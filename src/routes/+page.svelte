<!-- home page -->

<script lang="ts">
	import type { PageData } from './$types';
	import NameInput from '$lib/components/NameInput.svelte';

	// 1. Receive the data from +page.server.ts
	let { data }: { data: PageData } = $props();
</script>

{#if !data.hasName}
	<div class="modal-overlay">
		<div class="modal-content">
			<NameInput />
		</div>
	</div>
{/if}

<h1>日本語の Quiz Game</h1>
<p>Welcome, {data.userName}</p>
<p>
	This is a quiz game to help you practice your Japanese. Click the play button to start the game,
	or check out the leaderboard to see how you rank against other players.
</p>
<div>
	<a href="/game">Play (30s)</a>
	<a href="/leaderboard">Leaderboard</a>
</div>
