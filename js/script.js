const audio = document.getElementById('audio');
const disc = document.getElementById('disc');
const pauseBtn = document.getElementById('pauseBtn');
const playingSub = document.getElementById('playing-sub');
const unmuteBar = document.getElementById('unmute-bar');
const armTop = document.getElementById('arm-top');    // parte de cima da haste (fixa)
const armBottom = document.getElementById('arm-bottom'); // parte de baixo (gira)

let playing = false;
let muted = true;
let armOut = false; // controla se haste está retirada

// --- HASTE ANIMATION ---
function armLift() {
  // Gira haste inteira para FORA do disco
  // Mude o valor de rotate para ajustar o sentido e ângulo:
  // rotate(-45deg) → gira para esquerda (afasta do disco)
  // rotate(45deg)  → gira para direita
  if (armBottom) {
    armBottom.style.transition = 'transform 0.8s ease';
    armBottom.style.transform = 'rotate(-35deg)'; // ← SENTIDO E ÂNGULO AQUI
  }
  armOut = true;
}

function armDrop() {
  // Volta haste para posição inicial sobre o disco
  // Este valor deve ser o mesmo que está no CSS em .arm-bottom transform
  if (armBottom) {
    armBottom.style.transition = 'transform 0.8s ease';
    armBottom.style.transform = 'rotate(-10deg)'; // ← POSIÇÃO INICIAL AQUI
  }
  armOut = false;
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
  const iframe = document.getElementById('video-iframe');
  if (modal) {
    modal.style.display = 'flex';
    // Pausa música ao abrir vídeo
    if (playing) togglePlay();
  }
}

function closeVideo() {
  const modal = document.getElementById('video-modal');
  const iframe = document.getElementById('video-iframe');
  if (modal) {
    modal.style.display = 'none';
    // Para o vídeo ao fechar
    if (iframe) iframe.src = iframe.src;
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
