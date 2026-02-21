<script lang="ts">
    import type { PageData } from './$types';
    let { data } = $props<{ data: PageData }>();
    let players = $derived(data.players);
</script>

<a href="/">Back to Home</a>

<h1>Global Leaderboard</h1>

<table>
    <thead>
        <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
            <th>Time Played</th>
        </tr>
    </thead>
    <tbody>
        {#each players as player}
            <tr class:top-three={player.rank <= 3}>
                <td>#{player.rank}</td>
                <td><strong>{player.name}</strong></td>
                <td>{player.score.toLocaleString()}</td>
                <td>{player.timePlayed}</td>
            </tr>
        {/each}
    </tbody>
</table>