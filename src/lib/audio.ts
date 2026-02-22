let homeBgm: HTMLAudioElement | null = null;
let fightBgm: HTMLAudioElement | null = null;
let clickSfx: HTMLAudioElement | null = null;
let muted = false;

export function initAudio() {
  homeBgm = new Audio('/audio/homebgm.mp3');
  homeBgm.loop = true;
  homeBgm.volume = 0.5;
  homeBgm.preload = 'auto';
  homeBgm.load();

  fightBgm = new Audio('/audio/fight.mp3');
  fightBgm.loop = false;
  fightBgm.volume = 0.5;
  fightBgm.preload = 'auto';
  fightBgm.load();

  clickSfx = new Audio('/audio/click.mp3');
  clickSfx.loop = false;
  clickSfx.volume = 0.7;
  clickSfx.preload = 'auto';
  clickSfx.load();
}

export function playHomeBgm() {
  fightBgm?.pause();
  if (fightBgm) fightBgm.currentTime = 0;
  homeBgm?.play().catch(() => {});
}

export function playFightSfx() {
  homeBgm?.pause();
  if (homeBgm) homeBgm.currentTime = 0;
  if (fightBgm) fightBgm.currentTime = 0;
  fightBgm?.play().catch(() => {});
}

export function playClick() {
  if (!clickSfx) return;
  const click = clickSfx.cloneNode() as HTMLAudioElement;
  click.volume = 0.7;
  click.play().catch(() => {});
}

export function toggleMute(): boolean {
  muted = !muted;
  if (homeBgm) homeBgm.muted = muted;
  if (fightBgm) fightBgm.muted = muted;
  if (clickSfx) clickSfx.muted = muted;
  return muted;
}

export function isMuted(): boolean {
  return muted;
}