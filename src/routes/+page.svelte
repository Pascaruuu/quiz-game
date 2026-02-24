<!-- home page -->
<script lang="ts">
    import type { PageData } from './$types';
    import { goto } from '$app/navigation';
    import LoadingScreen from '$lib/components/LoadingScreen.svelte';
    import FlashTransition from '$lib/components/FlashTransition.svelte';
    import { playFightSfx } from '$lib/audio';

    let { data }: { data: PageData } = $props();
    let transitioning = $state(false);

    function playAndTransition() {
        playFightSfx();
        transitioning = true;
        setTimeout(() => goto('/game'), 1800);
    }

    function changeName() {
        window.location.reload();
    }
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
</svelte:head>

<div class="home">
    <h1>日本語 <br> Quiz Game</h1>
    <p class="welcome">ようこそ, {data.userName}!</p>
    <div class="menu">
        <button class="playbtn" onclick={playAndTransition}>▶ Play (30s)</button>
        <a href="/leaderboard" class="btn">🏆 Leaderboard</a>
        <button class="btn" onclick={changeName}>✏️ Change Name</button>
        <a href="/credits" class="btn">👥 Credits</a>
    </div>
</div>

<FlashTransition visible={transitioning} />

<style>
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

    :global(*) {
        font-family: 'Press Start 2P', monospace;
    }

    .home {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;
        color: white;
        text-align: center;
        padding: 1rem;
        background-image: url('/homegrassbg.png');
        background-repeat: repeat-x;
        background-size: auto 100%;
        animation: slide-bg 20s linear infinite;
    }

    @keyframes slide-bg {
        from { background-position: 0% 0%; }
        to   { background-position-x: 1920px; }
    }

    h1 {
        font-size: 4rem;
        line-height: 1.5;
        color: #fff;
        text-shadow: 4px 4px 0px #000;
        -webkit-text-stroke: 2px #000;
    }

    .welcome {
        font-size: 2.5rem;
        font-weight: bold;
        color: #fff;
        text-shadow: 3px 3px 0px #000;
        -webkit-text-stroke: 2px #000;
    }

    .menu {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        width: 100%;
        align-items: center;
        justify-content: center;
    }

    .btn {
        display: block;
        width: 20%;
        padding: 0.75rem 1rem;
        background: #F8F8F8;
        color: #4D4D4D;
        text-decoration: none;
        border: 3px solid #4D4D4D;
        font-size: 1rem;
        text-align: center;
        image-rendering: pixelated;
        box-shadow: 4px 4px 0px #000;
        transition: transform 0.1s, box-shadow 0.1s;
        cursor: pointer;
        font-family: 'Press Start 2P', monospace;
    }

    .btn:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0px #000;
        background: #4D4D4D;
        color: #F8F8F8;
    }

    .playbtn {
        background: #ffe033;
        color: #1a1a2e;
        display: block;
        width: 20%;
        padding: 0.75rem 1rem;
        text-decoration: none;
        border: 3px solid #1a1a2e;
        font-size: 1rem;
        text-align: center;
        image-rendering: pixelated;
        box-shadow: 4px 4px 0px #000;
        transition: transform 0.1s, box-shadow 0.1s;
        cursor: pointer;
        font-family: 'Press Start 2P', monospace;
    }

        .playbtn:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0px #000;
        background: #918128;
        color: #fff;
    }
</style>