<script lang="ts">
	import { createGame } from '$lib/game.svelte';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';
	import FlashTransition from '$lib/components/FlashTransition.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { playFightSfx } from '$lib/audio';
	import { resolve } from '$app/paths';

	let { data } = $props<{ data: PageData }>();
	let transitioning = $state(false);

	const game = createGame();

	onMount(() => {
		const sprites = [
			'/chars/blue/bluestand.png',
			'/chars/blue/blueatk.png',
			'/chars/blue/bluehurt.png',
			'/chars/red/redstand.png',
			'/chars/red/redatk.png',
			'/chars/red/redhurt.png'
		];
		sprites.forEach((src) => {
			const img = new Image();
			img.src = src;
		});

		game.initGame(data.savedUsername);
	});

	async function handleReplay() {
		playFightSfx();
		transitioning = true;
		await new Promise((resolve) => setTimeout(resolve, 1800));
		transitioning = false;
		await game.initGame(data.savedUsername);
	}
</script>

<div class="game-wrapper">
	{#if game.currentQuestion && !game.isGameOver}
		<!-- Blue character: bottom-left above question box -->
		<div class="char-blue">
			{#key game.blueSprite}
				<img src="/chars/blue/{game.blueSprite}.png" alt="blue" />
			{/key}
		</div>

		<!-- Red character: top-right above score box -->
		<div class="char-red">
			{#key game.redSprite}
				<img src="/chars/red/{game.redSprite}.png" alt="red" />
			{/key}
		</div>

		<!-- Timer: top-left box -->
		<div class="timer-box">
			<span class="timer-text">{game.timeLeft}s</span>
			<div
				class="timer-bar-fill"
				style="width: {(game.timeLeft / 30) * 68}%; background: {game.timeLeft > 15
					? '#4caf50'
					: game.timeLeft > 8
						? '#ff9800'
						: '#f44336'}"
			></div>
		</div>

		<!-- Score: bottom-right box -->
		<div class="score-box">
			<span>{game.score}pts</span>
			{#if game.combo >= 2}
				<span class="combo">🔥 x{game.combo}</span>
			{/if}
		</div>

		<!-- Bottom bar: question + options -->
		<div class="bottom-bar">
			<div class="question-box">
				<p>{game.currentQuestion.meaning}</p>
			</div>
			<div class="options-grid">
				{#each game.currentQuestion.options as option (option)}
					<button class="option-btn" onclick={() => game.submitAnswer(option)}>
						{option}
					</button>
				{/each}
			</div>
		</div>
	{:else if game.isGameOver}
		<div class="gameover">
			<div class="gameover-popup">
				<h2>Game Over</h2>
				<p class="final-score">
					Score: <span class="score-val">{game.score}</span>
					&nbsp;|&nbsp;
					<span class="score-total">{game.results.length} questions</span>
				</p>

				<div class="results-list">
					{#each game.results as r (r.meaning)}
						<div class="result-row {r.correct ? 'correct' : 'wrong'}">
							<span class="result-meaning">{r.meaning}</span>
							<span class="result-arrow">→</span>
							{#if r.correct}
								<span class="result-answer correct-word">✓ {r.answer}</span>
								<span class="points-earned">+{r.pointsEarned}</span>
							{:else}
								<span class="result-answer wrong-word">✗ {r.chosen}</span>
								<span class="result-answer correct-word">✓ {r.answer}</span>
								<span class="points-earned penalty">{r.pointsEarned}</span>
							{/if}
						</div>
					{/each}
				</div>

				<div class="gameover-btns">
					<a href={resolve('/')} class="go-btn menu-btn">Main Menu</a>
					<a href={resolve('/leaderboard')} class="go-btn menu-btn">Leaderboard</a>
					<button class="go-btn replay-btn" onclick={handleReplay}>▶ Replay</button>
				</div>
			</div>
		</div>
	{:else}
		<LoadingScreen />
	{/if}
	<FlashTransition visible={transitioning} />
</div>

<style>
	.game-wrapper {
		width: 100%;
		height: 100%;
		background-image: url('/bg.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		position: relative;
		overflow: hidden;
		font-size: clamp(0.3rem, 1vw, 0.5rem);
	}

	.char-blue {
		position: absolute;
		bottom: 22%;
		left: 2%;
		width: 20%;
		image-rendering: pixelated;
	}

	.char-blue img {
		width: 100%;
		height: auto;
	}

	.char-red {
		position: absolute;
		top: 0%;
		right: 20%;
		width: 20%;
		image-rendering: pixelated;
	}

	.char-red img {
		width: 100%;
		height: auto;
	}

	/* Top-left HP/timer box area */
	.timer-box {
		position: absolute;
		top: 6.7%;
		left: 1%;
		width: 39.2%;
		height: 14%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding-left: 8%;
		color: #1a1a1a;
		font-size: 1.5rem;
	}

	.timer-text {
		margin-bottom: 2%;
	}

	.timer-bar-fill {
		height: 18%;
		margin-left: 4%;
		transition:
			width 1s linear,
			background 1s;
	}

	/* Turn yellow then red as time runs out */
	.timer-bar-fill[style*='width: 4'],
	.timer-bar-fill[style*='width: 3'],
	.timer-bar-fill[style*='width: 2'],
	.timer-bar-fill[style*='width: 1'] {
		background: #f44336;
	}

	/* Bottom-right score box area */
	.score-box {
		position: absolute;
		top: 47%;
		right: 2%;
		width: 35%;
		height: 14%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #1a1a1a;
		font-size: 1.5rem;
	}

	.combo {
		font-size: 1rem;
		color: #ffe033;
		text-shadow: 2px 2px 0px #000;
		animation: pop 0.2s ease-out;
	}

	@keyframes pop {
		0% {
			transform: scale(1.5);
		}
		100% {
			transform: scale(1);
		}
	}

	/* Bottom bar: blue box + options */
	.bottom-bar {
		position: absolute;
		bottom: 0%;
		left: 0%;
		width: 100%;
		height: 32%;
		display: flex;
		flex-direction: row;
	}

	/* Blue question box (left ~55% of bottom bar) */
	.question-box {
		width: 57%;
		height: 133%;
		display: flex;
		align-items: center;
		padding: 0.5rem 3rem;
		color: #fff;
		font-size: 1.5rem;
		line-height: 1.8;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.question-box p {
		font-size: clamp(0.5rem, 1.2vw, 1.8rem);
		overflow-wrap: break-word;
		word-break: break-word;
		text-align: center;
		margin: 0;
		padding: 0.2rem;
		display: -webkit-box;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Options grid (right ~45% of bottom bar) */
	.options-grid {
		width: 43%;
		height: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.3rem;
		padding: 0.4rem;
		padding-top: 5rem;
		align-content: start;
	}

	.option-btn {
		background: #f8f8f8;
		border: 2px solid #4d4d4d;
		color: #4d4d4d;
		font-size: clamp(0.6rem, 1.5vw, 1.8rem);
		cursor: pointer;
		padding: 0.4rem;
		text-align: center;
		box-shadow: 2px 2px 0px #000;
		transition:
			transform 0.1s,
			box-shadow 0.1s;
		line-height: 1.5;
	}

	.option-btn:hover {
		transform: translate(1px, 1px);
		box-shadow: 1px 1px 0px #000;
		background: #4d4d4d;
		color: #f8f8f8;
	}

	/* Game over */
	.gameover {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.6);
	}

	.gameover-popup {
		background: #1a1a2e;
		border: 3px solid #fff;
		box-shadow: 6px 6px 0px #000;
		width: 60%;
		max-height: 90%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
		gap: 0.8rem;
		overflow: hidden;
	}

	.gameover-popup h2 {
		font-size: 1.2rem;
		color: #fff;
		text-shadow: 2px 2px 0px #000;
	}

	.final-score {
		font-size: 1rem;
		color: #fff;
	}

	.score-val {
		color: #4caf50;
		font-size: 1.2rem;
	}

	.score-total {
		color: #aaa;
	}

	.results-list {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		overflow-y: auto;
		max-height: 45%;
		padding-right: 0.3rem;
	}

	.result-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1.3rem;
		padding: 0.3rem 0.5rem;
		border-left: 3px solid transparent;
		flex-wrap: wrap;
	}

	.result-row.correct {
		border-left-color: #4caf50;
		background: rgba(76, 175, 80, 0.1);
	}

	.result-row.wrong {
		border-left-color: #f44336;
		background: rgba(244, 67, 54, 0.1);
	}

	.result-meaning {
		color: #aaa;
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.result-arrow {
		color: #555;
	}

	.points-earned {
		color: #4caf50;
		font-size: 1rem;
		margin-left: auto;
	}

	.points-earned.penalty {
		color: #f44336;
	}

	.correct-word {
		color: #4caf50;
	}

	.wrong-word {
		color: #f44336;
		text-decoration: line-through;
	}

	.gameover-btns {
		display: flex;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.go-btn {
		padding: 0.6rem 1.2rem;
		font-size: 0.7rem;
		font-family: 'Press Start 2P', monospace;
		border: 3px solid #4d4d4d;
		box-shadow: 3px 3px 0px #000;
		cursor: pointer;
		text-decoration: none;
		display: inline-block;
		transition:
			transform 0.1s,
			box-shadow 0.1s;
	}

	.go-btn:hover {
		transform: translate(2px, 2px);
		box-shadow: 1px 1px 0px #000;
	}

	.menu-btn {
		background: #f8f8f8;
		color: #4d4d4d;
		border-color: #4d4d4d;
	}

	.replay-btn {
		background: #ffe033;
		color: #1a1a2e;
		border-color: #1a1a2e;
	}

	.replay-btn:hover {
		background: #918128;
		color: #fff;
	}
</style>
