import { GAME_CONFIG } from './gameConfig';
import { playAttack, playHurt } from './audio';

export interface Question {
  id: number;
  meaning: string;
  answer: string;
  options: string[];
}

export interface Result {
  meaning: string;
  answer: string;
  chosen: string;
  correct: boolean;
  pointsEarned: number;
}

export function createGame() {
  let questions = $state<Question[]>([]);
  let score = $state(0);
  let timeLeft = $state(GAME_CONFIG.INITIAL_TIME);
  let currentIndex = $state(0);
  let isGameOver = $state(false);
  let isLoading = $state(false);
  let results = $state<Result[]>([]);
  let combo = $state(0);
  let streakHistory = $state([] as number[]);
  let timerInterval: ReturnType<typeof setInterval> | null = null;
  let savedUsername = $state('');
  let gameToken = $state('');

  let blueSprite = $state('bluestand');
  let redSprite  = $state('redstand');

  const currentQuestion = $derived(questions[currentIndex]);
  const pointsPerCorrect = GAME_CONFIG.POINTS_PER_CORRECT;
  const totalPossible = $derived(questions.length * pointsPerCorrect);

  // Combo multiplier: 1x, 1.5x, 2x, 2.5x, 3x (caps at 5 streak)
  function getMultiplier(currentCombo: number): number {
    if (currentCombo >= 5) return 3;
    if (currentCombo >= 4) return 2.5;
    if (currentCombo >= 3) return 2;
    if (currentCombo >= 2) return 1.5;
    return 1;
  }

  async function initGame(username: string) {
    savedUsername = username;
    isLoading = true;
    score = 0;
    currentIndex = 0;
    isGameOver = false;
    results = [];
    combo = 0;
    streakHistory = [];
    timeLeft = GAME_CONFIG.INITIAL_TIME;
    const response = await fetch(`/api/quiz?limit=${GAME_CONFIG.TOTAL_QUESTIONS_LIMIT}`);
    const data = await response.json();
    questions = data.questions;
    gameToken = data.gameToken; // Store the JWT for later validation
    isLoading = false;
    startGame();
  }

  function startGame() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft -= 1;
      } else {
        endGame();
      }
    }, 1000);
  }

  function triggerSprites(correct: boolean) {
    blueSprite = correct ? 'blueatk' : 'bluehurt';
    redSprite  = correct ? 'redhurt' : 'redatk';
    setTimeout(() => {
      blueSprite = 'bluestand';
      redSprite  = 'redstand';
    }, 600);
  }

  function submitAnswer(selectedOption: string) {
    if (isGameOver || !currentQuestion) return;

    const correct = selectedOption === currentQuestion.answer;
    let pointsEarned = 0;

    if (correct) {
      combo++;
      const multiplier = getMultiplier(combo);
      pointsEarned = Math.round(pointsPerCorrect * multiplier);
      score += pointsEarned;
      playAttack();
    } else {
      const penalty = Math.round(pointsPerCorrect * 0.5);
      pointsEarned = -penalty;
      score = Math.max(0, score - penalty);
      combo = 0;
      playHurt(); 
    }

    // RECORD STATUS: Push the combo state for THIS specific question
    // If correct, it's the new combo; if wrong, it's 0.
    streakHistory.push(combo);

    results.push({
      meaning: currentQuestion.meaning,
      answer: currentQuestion.answer,
      chosen: selectedOption,
      correct,
      pointsEarned
    });

    triggerSprites(correct);

    if (currentIndex < questions.length - 1) {
      currentIndex++;
    } else {
      endGame();
    }
  }

  async function endGame() {
    isGameOver = true;
    if (timerInterval) clearInterval(timerInterval);
    await autoSaveScore();
  }

  async function autoSaveScore() {
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: savedUsername, 
          result: {
            score,
            allStreaks: streakHistory // Sending the array [3, 2, 5]
          },
          token: gameToken 
        }) // Include JWT for validation
      });
    } catch (err) {
      console.error('Auto-save failed:', err);
    }
  }

  return {
    get questions()       { return questions },
    get score()           { return score },
    get timeLeft()        { return timeLeft },
    get currentQuestion() { return currentQuestion },
    get currentIndex()    { return currentIndex },
    get isGameOver()      { return isGameOver },
    get isLoading()       { return isLoading },
    get blueSprite()      { return blueSprite },
    get redSprite()       { return redSprite },
    get results()         { return results },
    get totalPossible()   { return totalPossible },
    get combo()           { return combo },
    initGame,
    submitAnswer,
    pointsPerCorrect
  };
}