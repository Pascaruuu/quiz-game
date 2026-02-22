<script lang="ts">
    import type { PageData } from './$types';
    let { data } = $props<{ data: PageData }>();
</script>

<div class="leaderboard">
    <a href="/" class="back-btn">← Back</a>
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
                    {#each players as player}
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
        font-size: 1.5rem;
        text-shadow: 2px 2px 0px #000;
    }

    .dots {
        display: inline-block;
        animation: blink 1.2s steps(3, end) infinite;
        width: 1.5em;
        text-align: left;
    }

    @keyframes blink {
        33%  { opacity: 0.3; }
        66%  { opacity: 0.6; }
        100% { opacity: 1; }
    }

    /* keep all your existing styles below unchanged */
    .leaderboard {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.8rem 0.5rem;
        box-sizing: border-box;
        overflow-y: auto;
        background-image: url('/homegrassbg.png');
        background-repeat: repeat-x;
        background-size: auto 100%;
        animation: slide-bg 20s linear infinite;
    }

    @keyframes slide-bg {
        from { background-position: 0% 0%; }
        to   { background-position-x: 1920px; }
    }

    .back-btn {
        align-self: flex-start;
        color: #ffe033;
        font-size: 1.45rem;
        text-decoration: none;
        border: 2px solid #ffe033;
        padding: 0.3rem 0.6rem;
        box-shadow: 2px 2px 0px #000;
        background: #1a1a2e;
        margin-bottom: 0.5rem;
    }

    .back-btn:hover {
        background: #ffe033;
        color: #1a1a2e;
    }

    h1 {
        font-size: 4rem;
        text-align: center;
        line-height: 1.5;
        color: #fff;
        text-shadow: 4px 4px 0px #000;
        -webkit-text-stroke: 2px #000;
    }

    table {
        width: 90%;
        border-collapse: collapse;
        font-size: 1rem;
    }

    thead tr {
        background: #1a1a2e;
        color: #ffe033;
    }

    th {
        padding: 0.4rem 0.3rem;
        text-align: center;
        border: 2px solid #ffe033;
    }

    td {
        padding: 0.4rem 0.3rem;
        text-align: center;
        border: 1px solid rgba(255, 224, 51, 0.3);
        color: #fff;
        background: rgba(26, 26, 46, 0.75);
    }

    tr.top-three td {
        background: rgba(26, 26, 46, 0.75);
        color: #ffe033;
    }

    .rank { font-size: 1rem; }
    .name { text-align: left; padding-left: 0.6rem; }
    .score { color: #4caf50; }
    tr.top-three .score { color: #ffe033; }

    tbody tr:nth-child(even) td {
        background: rgba(26, 26, 46, 0.9);
    }

    tbody tr:hover td {
        background: rgba(77, 77, 77, 0.6);
        cursor: default;
    }
</style>