import { GAME_CONFIG } from './gameConfig';

export interface Question {
	id: number;
	meaning: string;
	answer: string;
	options: string[];
}

export function createGame() {
	let questions = $state<Question[]>([]);
	let score = $state(0);
	let timeLeft = $state(GAME_CONFIG.INITIAL_TIME);
	let currentIndex = $state(0);
	let isGameOver = $state(false);
	let isLoading = $state(false);
	let timerInterval: ReturnType<typeof setInterval> | null = null;

	const currentQuestion = $derived(questions[currentIndex]);
	const pointsPerCorrect = GAME_CONFIG.POINTS_PER_CORRECT;

	async function initGame() {
		isLoading = true;
		const response = await fetch(`/api/quiz?limit=${GAME_CONFIG.TOTAL_QUESTIONS_LIMIT}`);
		const data = await response.json();
		questions = data.questions;
		isLoading = false;
		startGame();
	}

	function startGame() {
		timerInterval = setInterval(() => {
			if (timeLeft > 0) {
				timeLeft -= 1;
			} else {
				endGame();
			}
		}, 1000);
	}

	function submitAnswer(selectedOption: string) {
		if (isGameOver || !currentQuestion) return;

		if (selectedOption === currentQuestion.answer) {
			score += pointsPerCorrect;
		}

		if (currentIndex < questions.length - 1) {
			currentIndex++;
		} else {
			endGame();
		}
	}

	function endGame() {
		isGameOver = true;
		if (timerInterval) clearInterval(timerInterval);
	}

	return {
		get questions() {
			return questions;
		},
		get score() {
			return score;
		},
		get timeLeft() {
			return timeLeft;
		},
		get currentQuestion() {
			return currentQuestion;
		},
		get currentIndex() {
			return currentIndex;
		},
		get isGameOver() {
			return isGameOver;
		},
		get isLoading() {
			return isLoading;
		},
		initGame,
		submitAnswer,
		pointsPerCorrect
	};
}
