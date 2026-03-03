<script lang="ts">
  import '../app.css';
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
  /* ── Loading Cover ── */
  .loading-cover {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
  }

  /* ── Mute Button ── */
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
    width: clamp(32px, 5vw, 80px);
    height: clamp(32px, 5vw, 80px);
    transition: transform 0.1s;
    image-rendering: pixelated;
  }

  .mute-btn img {
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
  }

  .mute-btn.pressed {
    transform: translate(3px, 3px);
  }

  /* ── Start Screen ── */
  .start-screen {
    width: 100%;
    height: 100%;
    background-image: url('/homegrassbg.png');
    background-size: auto 100%;
    background-repeat: repeat-x;
    animation: slide-bg 40s linear infinite;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: clamp(0.8rem, 3vh, 2rem);
    padding: clamp(1rem, 4vh, 3rem) clamp(0.5rem, 2vw, 2rem);
    text-align: center;
    overflow: hidden;
  }

  @keyframes slide-bg {
    from { background-position-x: 0px; }
    to   { background-position-x: 1920px; }
  }

  .start-screen h1 {
    font-size: clamp(1rem, 4vw, 4rem);
    line-height: 1.8; /* ← more breathing room between the two lines */
    color: #fff;
    text-shadow: clamp(1px, 0.3vw, 4px) clamp(1px, 0.3vw, 4px) 0px #000;
    -webkit-text-stroke: clamp(0.5px, 0.15vw, 2px) #000;
    margin: 0 0 clamp(0.2rem, 1vh, 0.8rem) 0; /* ← gap under title */
  }

  .start-screen p {
    font-size: clamp(0.5rem, 1.5vw, 1.5rem);
    color: #fff;
    text-shadow: clamp(1px, 0.2vw, 3px) clamp(1px, 0.2vw, 3px) 0px #000;
    -webkit-text-stroke: clamp(0.3px, 0.1vw, 2px) #000;
    margin: 0 0 clamp(0.2rem, 1vh, 0.5rem) 0; /* ← gap under prompt text */
  }

  .start-screen input {
    background: #000;
    border: clamp(1px, 0.2vw, 3px) solid #4D4D4D;
    color: #fff;
    padding: clamp(0.4rem, 1vh, 0.75rem) clamp(0.5rem, 1.5vw, 1rem); /* ← more inner padding */
    font-size: clamp(0.4rem, 1vw, 1rem);
    width: clamp(140px, 25vw, 280px);
    text-align: center;
    outline: none;
    font-family: 'Press Start 2P', monospace;
  }

  .start-screen input::placeholder {
    color: #555;
  }

  .start-screen button {
    background: #F8F8F8;
    border: clamp(1px, 0.2vw, 3px) solid #4D4D4D;
    color: #4D4D4D;
    padding: clamp(0.4rem, 1vh, 0.75rem) clamp(1rem, 3vw, 2rem); /* ← more padding inside button */
    font-size: clamp(0.3rem, 0.8vw, 0.65rem);
    cursor: pointer;
    box-shadow: clamp(1px, 0.3vw, 4px) clamp(1px, 0.3vw, 4px) 0px #000;
    transition: transform 0.1s, box-shadow 0.1s, background 0.1s, color 0.1s;
    font-family: 'Press Start 2P', monospace;
    margin-top: clamp(0.2rem, 0.5vh, 0.5rem); /* ← small gap above button */
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