<script lang="ts">
	import type { PageData } from './$types';
	import { resolve } from '$app/paths';

	let { data } = $props<{ data: PageData }>();
</script>

<div class="leaderboard">
	<a href={resolve('/')} class="back-btn">← Back</a>
	<h1>Leaderboard</h1>

	{#await data.players}
		<div class="loading">
			<p>Loading<span class="dots">...</span></p>
		</div>
	{:then players}
		{#if players.length === 0}
			<div class="loading">
				<p>No scores yet!</p>
			</div>
		{:else}
			<table>
				<thead>
					<tr>
						<th>Rank</th>
						<th>Player</th>
						<th>Score</th>
						<th>Time</th>
					</tr>
				</thead>
				<tbody>
					{#each players as player (player.id)}
						<tr class:top-three={player.rank <= 3}>
							<td class="rank">
								{#if player.rank === 1}🥇
								{:else if player.rank === 2}🥈
								{:else if player.rank === 3}🥉
								{:else}#{player.rank}
								{/if}
							</td>
							<td class="name">{player.name}</td>
							<td class="score">{player.score.toLocaleString()}</td>
							<td>{player.timePlayed}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	{:catch}
		<div class="loading">
			<p>Failed to load scores.</p>
		</div>
	{/await}
</div>

<style>
	.loading {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.loading p {
		color: #fff;
		font-size: clamp(0.5rem, 1.5vw, 1.5rem);
		text-shadow: 2px 2px 0px #000;
	}

	.dots {
		display: inline-block;
		animation: blink 1.2s steps(3, end) infinite;
		width: 1.5em;
		text-align: left;
	}

	@keyframes blink {
		33% {
			opacity: 0.3;
		}
		66% {
			opacity: 0.6;
		}
		100% {
			opacity: 1;
		}
	}

	.leaderboard {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: clamp(0.3rem, 1vh, 0.8rem) clamp(0.5rem, 2vw, 2rem);
		box-sizing: border-box;
		overflow-y: auto;
		background-image: url('/homegrassbg.png');
		background-repeat: repeat-x;
		background-size: auto 100%;
		animation: slide-bg 40s linear infinite;
		gap: clamp(0.5rem, 1.5vh, 1.2rem);
	}

	@keyframes slide-bg {
		from {
			background-position: 0% 0%;
		}
		to {
			background-position-x: 1920px;
		}
	}

	.back-btn {
		color: #4d4d4d;
		font-size: clamp(0.4rem, 1.2vw, 1.45rem);
		text-decoration: none;
		border: clamp(1px, 0.2vw, 3px) solid #4d4d4d;
		padding: clamp(0.2rem, 0.5vh, 0.5rem) clamp(0.2rem, 0.5vw, 0.6rem);
		box-shadow: clamp(1px, 0.3vw, 4px) clamp(1px, 0.3vw, 4px) 0px #000;
		background: #f8f8f8;
		margin-top: clamp(0.5rem, 2vh, 2rem);
		margin-left: clamp(1rem, 5vw, 5rem);
		align-self: flex-start;
		transition:
			transform 0.1s,
			box-shadow 0.1s;
	}

	.back-btn:hover {
		transform: translate(2px, 2px);
		box-shadow: 2px 2px 0px #000;
		background: #4d4d4d;
		color: #f8f8f8;
	}

	h1 {
		font-size: clamp(1rem, 4vw, 4rem);
		text-align: center;
		line-height: 1.5;
		color: #fff;
		text-shadow: clamp(1px, 0.3vw, 4px) clamp(1px, 0.3vw, 4px) 0px #000;
		-webkit-text-stroke: clamp(0.5px, 0.1vw, 2px) #000;
		paint-order: stroke fill;
		margin: clamp(0.2rem, 0.5vh, 0.5rem) 0;
	}

	table {
		width: 80%;
		border-collapse: collapse;
		font-size: clamp(0.3rem, 1vw, 1rem);
	}

	thead tr {
		background: #1a1a2e;
		color: #ffe033;
	}

	th {
		padding: clamp(0.2rem, 0.4vh, 0.4rem) clamp(0.15rem, 0.3vw, 0.3rem);
		text-align: center;
		border: clamp(1px, 0.15vw, 2px) solid #4d4d4d;
	}

	td {
		padding: clamp(0.2rem, 0.4vh, 0.4rem) clamp(0.15rem, 0.3vw, 0.3rem);
		text-align: center;
		border: 1px solid #4d4d4d;
		color: #fff;
		background: rgba(26, 26, 46, 0.75);
	}

	tr.top-three td {
		background: rgba(26, 26, 46, 0.75);
		color: #ffe033;
	}

	.rank {
		font-size: clamp(0.3rem, 1vw, 1rem);
	}
	.name {
		text-align: left;
		padding-left: clamp(0.2rem, 0.6vw, 0.6rem);
	}
	.score {
		color: #4caf50;
	}
	tr.top-three .score {
		color: #ffe033;
	}

	tbody tr:nth-child(even) td {
		background: rgba(26, 26, 46, 0.9);
	}

	tbody tr:hover td {
		background: rgba(77, 77, 77, 0.6);
		cursor: default;
	}
</style>
