<!-- home page -->
<script lang="ts">
    import type { PageData } from './$types';
    import { goto } from '$app/navigation';
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

<div class="home">
    <h1>日本語 <br> Quiz Game</h1>
    <p class="welcome">ようこそ, {data.userName}!</p>
    <div class="menu">
        <button class="playbtn" onclick={playAndTransition}>
            <span class="btn-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="M22 11v2h-1v1h-1v1h-2v1h-2v1h-1v1h-2v1h-2v1h-1v1H8v1H6v1H3v-1H2V2h1V1h3v1h2v1h2v1h1v1h2v1h2v1h1v1h2v1h2v1h1v1z"/></svg>
            </span>
            <span class="btn-label">Play (30s)</span>
        </button>
        <a href="/leaderboard" class="btn">
            <span class="btn-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="currentColor"><path d="M6 3h12v2H6z"/><path d="M6 3h2v12H6zm10 0h2v12h-2z"/><path d="M16 5h6v2h-6zM2 5h6v2H2zm0 2h2v4H2zm2 4h2v2H4zm14 0h2v2h-2zm2-4h2v4h-2zM8 15h8v2H8zm3 2h2v4h-2z"/><path d="M9 19h6v2H9z"/></g></svg>
            </span>
            <span class="btn-label">Leaderboard</span>
        </a>
        <button class="btn" onclick={changeName}>
            <span class="btn-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M5 3h6v2H5zM3 5h2v14H3zm16 8h2v6h-2zM5 19h14v2H5zm3-9h2v6H8zm2 4h4v2h-4zm0-6h2v2h-2zm2-2h2v2h-2zm2-2h2v2h-2zm2-2h2v2h-2zm2 2h2v2h-2zm2 2h2v2h-2zm-2 2h2v2h-2zm-2 2h2v2h-2zm-2 2h2v2h-2zm-4 0h2v2h-2z"/></svg>
            </span>
            <span class="btn-label">Change Name</span>
        </button>
        <a href="/credits" class="btn">
            <span class="btn-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="currentColor" d="M8 7H7v2H6v1h1v1h1Zm0 0h1V6h1V5H7V4H6v2h2Zm-8 5h1v-1H0Zm1-1h1v-1H1Zm2 0h1v-1h1V9H4V7H3Zm2-2h1V8H5ZM2 7h1V6h2V4H4v1H1v1h1ZM1 4h1V3H1ZM0 3h1V2H0Zm10 9h1v-1h-1Zm-1-1h1v-1H9ZM5 4h1V2H5Zm4 0h1V3H9Zm1-1h1V2h-1Zm0 0"/></svg>
            </span>
            <span class="btn-label">Credits</span>
        </a>
    </div>
</div>

<FlashTransition visible={transitioning} />

<style>
    .home {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: clamp(0.8rem, 3vh, 2.5rem);
        color: white;
        text-align: center;
        padding: clamp(1rem, 4vh, 3rem) clamp(0.5rem, 2vw, 1rem);
        background-image: url('/homegrassbg.png');
        background-repeat: repeat-x;
        background-size: auto 100%;
        animation: slide-bg 40s linear infinite;
        box-sizing: border-box;
        overflow: hidden;
    }

    @keyframes slide-bg {
        from { background-position: 0px; }
        to   { background-position-x: 1920px; }
    }

    h1 {
        font-size: clamp(1rem, 4vw, 4rem);
        line-height: 1.8;
        color: #fff;
        text-shadow: clamp(1px, 0.3vw, 4px) clamp(1px, 0.3vw, 4px) 0px #000;
        -webkit-text-stroke: clamp(0.5px, 0.15vw, 2px) #000;
        paint-order: stroke fill;
        margin: 0 0 clamp(0.2rem, 1vh, 0.8rem) 0;
    }

    .welcome {
        font-size: clamp(0.6rem, 2.2vw, 2.5rem);
        color: #fff;
        text-shadow: clamp(1px, 0.2vw, 3px) clamp(1px, 0.2vw, 3px) 0px #000;
        -webkit-text-stroke: clamp(0.5px, 0.1vw, 2px) #000;
        paint-order: stroke fill;
        margin: 0 0 clamp(0.3rem, 1.5vh, 1rem) 0;
    }

    .menu {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: clamp(0.4rem, 1.5vw, 1.2rem); 
        width: 100%;
        align-items: stretch;
        justify-content: center;
        padding: 0 clamp(0.5rem, 2vw, 2rem); 
    }

    .btn, .playbtn {
        width: clamp(80px, 16vw, 200px);
        padding: clamp(0.4rem, 1vh, 0.8rem) clamp(0.3rem, 0.8vw, 1rem);
        text-decoration: none;
        border: clamp(1px, 0.2vw, 3px) solid #4D4D4D;
        box-shadow: clamp(1px, 0.3vw, 4px) clamp(1px, 0.3vw, 4px) 0px #000;
        transition: transform 0.1s, box-shadow 0.1s, background 0.1s, color 0.1s;
        cursor: pointer;
        font-family: 'Press Start 2P', monospace;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: clamp(0.3rem, 0.6vh, 0.6rem);
    }

    .btn {
        background: #F8F8F8;
        color: #4D4D4D;
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
        border-color: #1a1a2e;
    }

    .playbtn:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0px #000;
        background: #918128;
        color: #fff;
    }

    .btn-icon {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .btn-icon svg {
        width: clamp(16px, 2.5vw, 40px);
        height: clamp(16px, 2.5vw, 40px);
        image-rendering: pixelated;
    }

    .btn-label {
        font-size: clamp(0.3rem, 0.8vw, 0.8rem);
        line-height: 1.4;
        text-align: center;
    }
</style>