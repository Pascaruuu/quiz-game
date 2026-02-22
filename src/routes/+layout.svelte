<script lang="ts">
  import { onMount } from 'svelte';
  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import LoadingScreen from '$lib/components/LoadingScreen.svelte';
  import { initAudio, playHomeBgm, playClick, toggleMute, isMuted } from '$lib/audio';

  let { children } = $props();
  let started = $state(false);
  let showLoading = $state(false);
  let username = $state('');

  let isMutedState = $state(false);
  let mutePressed = $state(false);

  function handleMute() {
    isMutedState = toggleMute();
  }

onMount(() => {
    const saved = document.cookie.match(/username=([^;]+)/)?.[1];
    if (saved) {
      username = decodeURIComponent(saved);
    }

    initAudio();

    const unsubscribe = page.subscribe(($page) => {
      if ($page.url.pathname !== '/game') {
        playHomeBgm();
      }
    });

    function handleGlobalClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a')) {
        playClick();
      }
    }

    document.addEventListener('click', handleGlobalClick);

    return () => {
      unsubscribe();
      document.removeEventListener('click', handleGlobalClick);
    };
  });

  async function enterAndStart() {
    if (!username.trim()) return;
    document.cookie = `username=${encodeURIComponent(username)}; path=/`;
    document.documentElement.requestFullscreen().catch(() => {});
    playHomeBgm(); // ← trigger on first user gesture
    showLoading = true;
    await invalidateAll();
    setTimeout(() => {
      started = true;
      goto('/');
    }, 1500);
  }
</script>

{#if showLoading && !started}
  <div class="loading-cover">
    <LoadingScreen />
  </div>
{:else if !started}
  <div class="app-wrapper">
    <div class="arcade-frame"></div>
    <button 
      class="mute-btn"
      class:pressed={mutePressed}
      onclick={handleMute}
      onmousedown={() => mutePressed = true}
      onmouseup={() => mutePressed = false}
      onmouseleave={() => mutePressed = false}
    >
      <img 
        src={isMutedState 
          ? (mutePressed ? '/mutebtn/musicoffclick.png' : '/mutebtn/musicoff.png')
          : (mutePressed ? '/mutebtn/musiconclick.png' : '/mutebtn/musicon.png')
        } 
        alt={isMutedState ? 'Unmute' : 'Mute'} 
      />
    </button>
    <div class="screen-content">
      <div class="start-screen">
        <h1>日本語<br/>Quiz Game</h1>
        <p>Hi there, what's your name?</p>
        <input
          type="text"
          placeholder="Enter your name..."
          bind:value={username}
          onkeydown={(e) => e.key === 'Enter' && enterAndStart()}
        />
        <button onclick={enterAndStart}>
          {username.trim() ? '▶ Continue' : '▶ Press Start'}
        </button>
      </div>
    </div>
  </div>
{:else}
  <div class="app-wrapper">
    <div class="arcade-frame"></div>
    <button 
      class="mute-btn"
      class:pressed={mutePressed}
      onclick={handleMute}
      onmousedown={() => mutePressed = true}
      onmouseup={() => mutePressed = false}
      onmouseleave={() => mutePressed = false}
    >
      <img 
        src={isMutedState 
          ? (mutePressed ? '/mutebtn/musicoffclick.png' : '/mutebtn/musicoff.png')
          : (mutePressed ? '/mutebtn/musiconclick.png' : '/mutebtn/musicon.png')
        } 
        alt={isMutedState ? 'Unmute' : 'Mute'} 
      />
    </button>
    <div class="screen-content">
      {@render children()}
    </div>
  </div>
{/if}

<style>
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

  :global(*) {
    font-family: 'Press Start 2P', monospace;
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    background: #000;
  }

  /* ── Loading Cover ── */
  .loading-cover {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
  }

  .mute-btn {
    position: absolute;
    top: 2%;
    right: 2%;
    z-index: 10;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    pointer-events: auto;
    width: 80px;
    height: 80px;
    transition: transform 0.1s, box-shadow 0.1s;
    image-rendering: pixelated;
  }

  .mute-btn img {
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
  }

  .mute-btn.pressed {
    transform: translate(3px, 3px); /* ← pushed down effect */
  }

  /* ── Start Screen ── */
  .start-screen {
    width: 100%;
    height: 100%;
    background-image: url('/homegrassbg.png');
    background-repeat: repeat-x;
    background-size: auto 100%;
    animation: slide-bg 40s linear infinite;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    padding: 2rem;
    text-align: center;
  }

  @keyframes slide-bg {
    from { background-position: 0% 0%; }
    to   { background-position-x: 1920px; }
  }

  .start-screen h1 {
    font-size: 4rem;
    line-height: 1.5;
    color: #fff;
    text-shadow: 4px 4px 0px #000;
    -webkit-text-stroke: 2px #000;
  }

  .start-screen p {
    font-size: 1.5rem;
    font-weight: bold;
    color: #fff;
    text-shadow: 3px 3px 0px #000;
    -webkit-text-stroke: 2px #000;
  }

  .start-screen input {
    background: #000;
    border: 3px solid #4D4D4D;
    color: #fff;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    width: 280px;
    text-align: center;
    outline: none;
  }

  .start-screen input::placeholder {
    color: #555;
  }

  .start-screen button {
    background: #F8F8F8;
    border: 3px solid #4D4D4D;
    color: #4D4D4D;
    padding: 0.75rem 2rem;
    font-size: 0.65rem;
    cursor: pointer;
    box-shadow: 4px 4px 0px #000;
    transition: transform 0.1s, box-shadow 0.1s;
  }

  .start-screen button:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px #000;
    background: #4D4D4D;
    color: #F8F8F8;
  }

  /* ── App Wrapper ── */
  .app-wrapper {
    width: 100vw;
    height: 100vh;
    position: relative;
    overflow: hidden;
  }

  .arcade-frame {
    position: absolute;
    inset: 0;
    background-image: url('/arcade_frame.png');
    background-size: 100% 100%;
    z-index: 2;
    pointer-events: none;
  }

  .screen-content {
    position: absolute;
    width: 75.3%;
    height: 74.5%;
    top: 13.8%;
    left: 12.5%;
    z-index: 1;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>