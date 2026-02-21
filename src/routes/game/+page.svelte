<script lang="ts">
  import { createGame } from '$lib/game.svelte';
  import { enhance } from '$app/forms'; // Helps submit without page reload
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  
  // load user name
  let { data } = $props<{ data: PageData }>();
  let username = $derived(data.savedUsername);

  // load game logic
  const game = createGame();
  onMount(() => {
    game.initGame();
  });

</script>

{#if game.currentQuestion && !game.isGameOver}
  <div class="quiz-container">
    <div class="stats">
      <span>Time: {game.timeLeft}s</span>
      <span>Score: {game.score}</span>
    </div>

    <h2>{game.currentQuestion.meaning}</h2>

    <div class="options-grid">
      {#each game.currentQuestion.options as option}
        <button 
          class="option-btn" 
          onclick={() => game.submitAnswer(option)}
        >
          {option}
        </button>
      {/each}
    </div>
  </div>
{:else if game.isGameOver}
  <form method="POST" action="?/submitScore" use:enhance>
    <input type="hidden" name="score" value={game.score} />
    <h2>Final Score: {game.score}/{game.currentIndex * game.pointsPerCorrect}</h2>
    <input type="hidden" name="username" value={username}/>
    <button type="submit">Save to Leaderboard</button>
  </form>
{:else}
  <p>Loading Quiz...</p>
{/if}