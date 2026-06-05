const audio = document.getElementById('audio');
const disc = document.getElementById('disc');
const pauseBtn = document.getElementById('pauseBtn');
const playingSub = document.getElementById('playing-sub');
const unmuteBar = document.getElementById('unmute-bar');
let playing = false;
let muted = true;

// Tenta autoplay mutado — sempre funciona
function startMuted() {
  audio.muted = true;
  audio.volume = 0.75;
  audio.play().then(() => {
    playing = true;
    muted = true;
    disc.classList.remove('paused');
    pauseBtn.textContent = '⏸';
    playingSub.textContent = 'toque para ativar o som';
    if (unmuteBar) unmuteBar.style.display = 'flex';
  }).catch(() => {
    disc.classList.add('paused');
    pauseBtn.textContent = '▶';
    playingSub.textContent = 'toque para ouvir';
  });
}

// Ativa o som ao primeiro clique do usuário
function unmute() {
  audio.muted = false;
  muted = false;
  playingSub.textContent = 'tocando agora...';
  if (unmuteBar) unmuteBar.style.display = 'none';
  document.removeEventListener('click', unmuteOnClick);
}

function unmuteOnClick() {
  if (muted) unmute();
}

function togglePlay() {
  if (playing) {
    audio.pause();
    playing = false;
    disc.classList.add('paused');
    pauseBtn.textContent = '▶';
    playingSub.textContent = 'pausado';
    if (unmuteBar) unmuteBar.style.display = 'none';
  } else {
    audio.muted = false;
    audio.play();
    playing = true;
    muted = false;
    disc.classList.remove('paused');
    pauseBtn.textContent = '⏸';
    playingSub.textContent = 'tocando agora...';
    if (unmuteBar) unmuteBar.style.display = 'none';
  }
}

window.addEventListener('load', () => {
  setTimeout(startMuted, 600);
  document.addEventListener('click', unmuteOnClick);
});
