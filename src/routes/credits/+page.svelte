<script lang="ts">
	const members = [
		{
			name: 'Pascal パスカル',
			role: 'Leader',
			contributions: [
				'Environment Setup',
				'API Development',
				'Anki Deck Integration',
				'Score logic',
				'UI/UX Design',
				'Visual & Audio Design',
				'API security',
				'Deployment'
			]
		},
		{
			name: 'Vicheka ヴェチェカ',
			role: 'Sub-Leader',
			contributions: [
				'Frontend Architecture',
				'Screen Implementation',
				'Game Logic',
				'Leaderboard Logic'
			]
		},
		{
			name: 'Veansna ヴィスナ',
			role: 'Member',
			contributions: [
				'Database Design',
				'Database Management',
				'Score System',
				'Score Logic',
				'Frontend/Backend Integration',
				'Leaderboard Implementation'
			]
		}
	];
</script>

<div class="credits">
	<a href="/" class="back-btn">← Back</a>
	<h1>Credits</h1>

	<div class="members">
		{#each members as member}
			<div class="card">
				<h2>{member.name}</h2>
				<p class="role">{member.role}</p>
				<ul>
					{#each member.contributions as contribution}
						<li>{contribution}</li>
					{/each}
				</ul>
			</div>
		{/each}
		<div class="card sources">
			<h2>Assets</h2>
			<ul>
				<li>
					Battle BGM: <a href="https://youtu.be/5bn3Jmvep1k" target="_blank"
						>8-Bit Fantasy & Adventure Music — xDeviruchi</a
					>
				</li>
				<li>
					Home BGM: <a href="https://youtu.be/D5L36JDKxR0" target="_blank"
						>A Lonely Cherry Tree 🌸 — Pix</a
					>
				</li>
				<li>
					Sprites: Original artwork inspired by <a href="https://nextmake.site/" target="_blank"
						>NextMake's</a
					> mascot
				</li>
			</ul>
		</div>
	</div>
</div>

<style>
	.credits {
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
			background-position: 0px;
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
		padding: clamp(0.2rem, 0.6vh, 0.5rem) clamp(0.3rem, 0.8vw, 0.8rem);
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
		margin: 0;
	}

	.members {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: clamp(0.4rem, 1.2vw, 1.5rem);
		width: 90%;
		padding: 0 clamp(0.3rem, 1vw, 1rem);
		margin-bottom: clamp(0.5rem, 1.5vh, 1.5rem);
	}

	.card {
		background: rgba(26, 26, 46, 0.75);
		border: clamp(1px, 0.15vw, 2px) solid #4d4d4d;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: clamp(0.3rem, 0.6vh, 0.6rem);
		text-align: center;
		padding: clamp(0.5rem, 1.2vh, 1.2rem) clamp(0.4rem, 1vw, 1rem);
		box-sizing: border-box;
	}

	.card h2 {
		font-size: clamp(0.4rem, 1vw, 1rem);
		color: #fff;
		text-shadow: 2px 2px 0px #000;
		margin: 0 0 clamp(0.1rem, 0.3vh, 0.3rem) 0;
	}

	.role {
		font-size: clamp(0.4rem, 1vw, 1rem);
		color: #4caf50;
		text-shadow: 1px 1px 0px #000;
		margin: 0 0 clamp(0.2rem, 0.5vh, 0.5rem) 0;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: clamp(0.15rem, 0.4vh, 0.4rem);
		width: 100%;
	}

	li {
		font-size: clamp(0.3rem, 0.7vw, 0.7rem);
		color: #fff;
		border: 1px solid #4d4d4d;
		background: rgba(26, 26, 46, 0.9);
		padding: clamp(0.2rem, 0.4vh, 0.4rem) clamp(0.3rem, 0.6vw, 0.6rem);
		text-align: left;
	}

	.sources {
		grid-column: 1 / -1;
	}

	.sources a {
		color: #4caf50;
		text-decoration: none;
	}

	.sources a:hover {
		text-decoration: underline;
	}

	@media (max-width: 600px) {
		.members {
			grid-template-columns: 1fr;
		}

		.sources {
			grid-column: 1;
		}
	}
</style>
