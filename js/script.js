const audio = document.getElementById('audio');
const disc = document.getElementById('disc');
const pauseBtn = document.getElementById('pauseBtn');
const playingSub = document.getElementById('playing-sub');
const unmuteBar = document.getElementById('unmute-bar');
const armBottom = document.getElementById('arm-bottom');

let playing = false;
let muted = true;

// --- HASTE ANIMATION ---
function armLift() {
  // Gira haste para FORA do disco ao pausar
  // Mude o ângulo para ajustar o movimento:
  // rotate(-45deg) → gira para esquerda
  // rotate(45deg)  → gira para direita
  if (armBottom) {
    armBottom.style.transition = 'transform 0.8s ease';
    armBottom.style.transform = 'rotate(-30deg)'; // ← ÂNGULO AO PAUSAR
  }
}

function armDrop() {
  // Volta haste para posição inicial — CSS assume
  if (armBottom) {
    armBottom.style.transition = 'transform 0.8s ease';
    armBottom.style.transform = ''; // ← limpa JS, CSS define posição
  }
}

// --- UNMUTE BAR ---
function showUnmuteBar() {
  if (unmuteBar) unmuteBar.style.display = 'flex';
}

function hideUnmuteBar() {
  if (unmuteBar) unmuteBar.style.display = 'none';
}

// --- AUTOPLAY MUTADO ---
function startMuted() {
  audio.muted = true;
  audio.volume = 0.75;
  audio.play().then(() => {
    playing = true;
    muted = true;
    disc.classList.remove('paused');
    pauseBtn.textContent = '⏸';
    playingSub.textContent = 'toque para ativar o som';
    // Haste já está na posição correta pelo CSS — não mexe aqui
    showUnmuteBar();
  }).catch(() => {
    disc.classList.add('paused');
    pauseBtn.textContent = '▶';
    playingSub.textContent = 'toque para ouvir';
    // Só levanta a haste se o autoplay falhar completamente
    showUnmuteBar();
  });
}

// --- UNMUTE ---
function unmute() {
  audio.muted = false;
  muted = false;
  if (!playing) {
    audio.play();
    playing = true;
    disc.classList.remove('paused');
    pauseBtn.textContent = '⏸';
    // Não chama armDrop() aqui — haste já está na posição correta pelo CSS
  }
  playingSub.textContent = 'tocando agora...';
  hideUnmuteBar();
}

// --- TOGGLE PLAY/PAUSE ---
function togglePlay() {
  if (playing) {
    // PAUSAR — haste sobe
    audio.pause();
    playing = false;
    disc.classList.add('paused');
    pauseBtn.textContent = '▶';
    playingSub.textContent = 'pausado';
    armLift();
    hideUnmuteBar();
  } else {
    // PLAY — haste desce
    audio.muted = false;
    audio.play();
    playing = true;
    muted = false;
    disc.classList.remove('paused');
    pauseBtn.textContent = '⏸';
    playingSub.textContent = 'tocando agora...';
    armDrop();
    hideUnmuteBar();
  }
}

// --- TOGGLE VIDEO MODAL ---
function openVideo() {
  const modal = document.getElementById('video-modal');
  const videoEl = document.getElementById('video-iframe');

  // 1. Pausa música PRIMEIRO
  if (playing) togglePlay();

  // 2. Abre o modal
  if (modal) modal.style.display = 'flex';

  // 3. Reseta e toca o vídeo
  if (videoEl) {
    videoEl.pause();
    videoEl.currentTime = 0;
    videoEl.load();
    setTimeout(() => {
      videoEl.play().catch(() => {});
    }, 300);
  }
}

function closeVideo() {
  const modal = document.getElementById('video-modal');
  const videoEl = document.getElementById('video-iframe');

  // 1. Fecha o modal
  if (modal) modal.style.display = 'none';

  // 2. Para o vídeo sem tocar no src
  if (videoEl) {
    videoEl.pause();
    videoEl.currentTime = 0;
  }
}

// Fecha modal clicando fora
document.addEventListener('click', function(e) {
  const modal = document.getElementById('video-modal');
  if (e.target === modal) closeVideo();
});

// Ativa som no primeiro toque
document.addEventListener('click', function onFirstClick(e) {
  if (e.target.id === 'pauseBtn' || e.target.id === 'disc') return;
  if (muted) unmute();
}, false);

if (unmuteBar) {
  unmuteBar.addEventListener('click', () => unmute());
}

window.addEventListener('load', () => setTimeout(startMuted, 600));
