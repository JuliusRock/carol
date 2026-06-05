const audio = document.getElementById('audio');
const disc = document.getElementById('disc');
const pauseBtn = document.getElementById('pauseBtn');
const playingSub = document.getElementById('playing-sub');
const unmuteBar = document.getElementById('unmute-bar');
let playing = false;
let muted = true;

function showUnmuteBar() {
  if (unmuteBar) {
    unmuteBar.style.display = 'flex';
  }
}

function hideUnmuteBar() {
  if (unmuteBar) {
    unmuteBar.style.display = 'none';
  }
}

function startMuted() {
  audio.muted = true;
  audio.volume = 0.75;
  audio.play().then(() => {
    playing = true;
    muted = true;
    disc.classList.remove('paused');
    pauseBtn.textContent = '⏸';
    playingSub.textContent = 'toque para ativar o som';
    showUnmuteBar();
  }).catch(() => {
    disc.classList.add('paused');
    pauseBtn.textContent = '▶';
    playingSub.textContent = 'toque para ouvir';
    showUnmuteBar();
  });
}

function unmute() {
  audio.muted = false;
  muted = false;
  if (!playing) {
    audio.play();
    playing = true;
    disc.classList.remove('paused');
    pauseBtn.textContent = '⏸';
  }
  playingSub.textContent = 'tocando agora...';
  hideUnmuteBar();
}

function togglePlay() {
  if (playing) {
    audio.pause();
    playing = false;
    disc.classList.add('paused');
    pauseBtn.textContent = '▶';
    playingSub.textContent = 'pausado';
    hideUnmuteBar();
  } else {
    audio.muted = false;
    audio.play();
    playing = true;
    muted = false;
    disc.classList.remove('paused');
    pauseBtn.textContent = '⏸';
    playingSub.textContent = 'tocando agora...';
    hideUnmuteBar();
  }
}

// Ativa som no primeiro toque em qualquer lugar
document.addEventListener('click', function onFirstClick(e) {
  // Não interfere com o botão pause
  if (e.target.id === 'pauseBtn' || e.target.id === 'disc') return;
  if (muted) {
    unmute();
  }
}, false);

// Clique direto no banner
if (unmuteBar) {
  unmuteBar.addEventListener('click', () => unmute());
}

window.addEventListener('load', () => setTimeout(startMuted, 600));
