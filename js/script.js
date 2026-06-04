const audio = document.getElementById('audio');
const disc = document.getElementById('disc');
const pauseBtn = document.getElementById('pauseBtn');
const playingSub = document.getElementById('playing-sub');
let playing = false;

function tryAutoplay() {
  audio.volume = 0.75;
  audio.play().then(() => {
    playing = true;
    disc.classList.remove('paused');
    pauseBtn.textContent = '⏸';
    playingSub.textContent = 'tocando agora...';
  }).catch(() => {
    disc.classList.add('paused');
    pauseBtn.textContent = '▶';
    playingSub.textContent = 'toque para ouvir';
  });
}

function togglePlay() {
  if (playing) {
    audio.pause();
    playing = false;
    disc.classList.add('paused');
    pauseBtn.textContent = '▶';
    playingSub.textContent = 'pausado';
  } else {
    audio.play();
    playing = true;
    disc.classList.remove('paused');
    pauseBtn.textContent = '⏸';
    playingSub.textContent = 'tocando agora...';
  }
}

window.addEventListener('load', () => setTimeout(tryAutoplay, 600));

document.addEventListener('click', function iniciar() {
  if (!playing) togglePlay();
}, { once: true });
