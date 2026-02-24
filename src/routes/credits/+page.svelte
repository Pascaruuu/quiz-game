<script lang="ts">
    const members = [
        {
            name: "Pascal - パスカル",
            role: "Leader",
            contributions: [
                "Environment Setup",
                "API Development",
                "Anki Deck Integration",
                "Score logic",
                "UI/UX Design",
                "Visual & Audio Design",
                "Deployment"
            ]
        },
        {
            name: "Vicheka - ヴェチェカ",
            role: "Sub-Leader",
            contributions: [
                "Frontend Architecture",
                "Screen Implementation",
                "Game Logic",
                "Leaderboard Logic"
            ]
        },
        {
            name: "Veansna - ヴィスナ",
            role: "Member",
            contributions: [
                "Database Design",
                "Database Management",
                "Score System",
                "Score Logic",
                "Frontend/Backend Integration",
                "Leaderboard Implementation"
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
    </div>
    <div class="sources">
        <h2>Assets</h2>
        <ul>
            <li>Battle BGM: <a href="https://youtu.be/5bn3Jmvep1k" target="_blank">8-Bit Fantasy & Adventure Music — xDeviruchi</a></li>
            <li>Home BGM: <a href="https://youtu.be/D5L36JDKxR0" target="_blank">A Lonely Cherry Tree 🌸 — Pix</a></li>
            <li>Sprites: Original artwork inspired by <a href="https://nextmake.site/" target="_blank">NextMake's</a> mascot</li>
        </ul>
    </div>
</div>



<style>
    .credits {
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
        color: #4D4D4D;
        font-size: 1.45rem;
        text-decoration: none;
        border: 3px solid #4D4D4D;
        padding: 0.5rem 0.6rem 0.3rem 0.5rem;
        box-shadow: 4px 4px 0px #000;
        background: #F8F8F8;
        margin-top: 2rem;
        margin-left: 5rem;
        align-self: flex-start;
        transition: transform 0.1s, box-shadow 0.1s;
    }

    .back-btn:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0px #000;
        background: #4D4D4D;
        color: #F8F8F8;
    }

    h1 {
        font-size: 4rem;
        text-align: center;
        line-height: 0.7;
        color: #fff;
        text-shadow: 4px 4px 0px #000;
        -webkit-text-stroke: 2px #000;
    }

    .members {
        display: flex;
        flex-direction: row;
        gap: 1.5rem;
        width: 90%;
        justify-content: center;
        flex-wrap: wrap;
        padding: 1rem 0;
    }

    .card {
        background: rgba(26, 26, 46, 0.75);
        border: 2px solid #4D4D4D;
        width: 30%;
        min-width: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.6rem;
        text-align: center;
        padding: 1rem;
    }

    .card h2 {
        font-size: 1rem;
        color: #fff;
        text-shadow: 2px 2px 0px #000;
    }

    .role {
        font-size: 1rem;
        color: #4caf50;
        text-shadow: 1px 1px 0px #000;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        width: 100%;
    }

    li {
        font-size: 0.7rem;
        color: #fff;
        border: 1px solid #4D4D4D;
        background: rgba(26, 26, 46, 0.9);
        padding: 0.3rem 0.5rem;
        text-align: left;
    }
    
    .sources {
        width: 85%;
        margin-top: 1rem;
        background: rgba(26, 26, 46, 0.75);
        border: 2px solid #4D4D4D;
        padding: 1rem;
    }

    .sources h2 {
        font-size: 1rem;
        color: #fff;
        text-shadow: 2px 2px 0px #000;
        margin-bottom: 0.8rem;
        text-align: center;
    }

    .sources ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
    }

    .sources li {
        font-size: 0.7rem;
        color: #fff;
        border: 1px solid #4D4D4D;
        background: rgba(26, 26, 46, 0.9);
        padding: 0.3rem 0.5rem;
    }

    .sources a {
        color: #4caf50;
        text-decoration: none;
    }

    .sources a:hover {
        text-decoration: underline;
    }
</style>