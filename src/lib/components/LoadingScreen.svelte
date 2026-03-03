<div class="loading-screen">
  <img src="/loadingscreen.png" alt="Loading..." />
  <p class="loading-text">Loading<span class="dots">...</span></p>
</div>

<style>
  .loading-screen {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
  }

  .loading-screen img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    image-rendering: pixelated;
  }

  .loading-text {
    position: absolute;
    bottom: 30%;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    font-size: 3rem;
    text-shadow: 2px 2px 0px #000;
    white-space: nowrap;
  }

  .dots {
    display: inline-block;
    animation: blink 1.2s steps(3, end) infinite;
    width: 1.5em;
    text-align: left;
  }

  @keyframes blink {
    0%   { content: '.'; }
    33%  { opacity: 0.3; }
    66%  { opacity: 0.6; }
    100% { opacity: 1; }
  }
</style>