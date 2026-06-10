const audio = document.getElementById('audio');
const disc = document.getElementById('disc');
const pauseBtn = document.getElementById('pauseBtn');
const playingSub = document.getElementById('playing-sub');
const unmuteBar = document.getElementById('unmute-bar');
const armBottom = document.getElementById('arm-bottom');

let playing = false;
let muted = true;
let videoOpen = false; // controla se o modal está aberto

// --- HASTE ANIMATION ---
function armLift() {
  if (armBottom) {
    armBottom.style.transition = 'transform 0.8s ease';
    armBottom.style.transform = 'rotate(-30deg)';
  }
}

function armDrop() {
  if (armBottom) {
    armBottom.style.transition = 'transform 0.8s ease';
    armBottom.style.transform = '';
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
    showUnmuteBar();
  }).catch(() => {
    disc.classList.add('paused');
    pauseBtn.textContent = '▶';
    playingSub.textContent = 'toque para ouvir';
    showUnmuteBar();
  });
}

// --- UNMUTE ---
function unmute() {
  // Não ativa som se o modal de vídeo estiver aberto
  if (videoOpen) return;

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

// --- TOGGLE PLAY/PAUSE ---
function togglePlay() {
  if (playing) {
    audio.pause();
    playing = false;
    disc.classList.add('paused');
    pauseBtn.textContent = '▶';
    playingSub.textContent = 'pausado';
    armLift();
    hideUnmuteBar();
  } else {
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

// --- VIDEO MODAL ---
function openVideo() {
  const modal = document.getElementById('video-modal');
  const videoEl = document.getElementById('video-iframe');

  // Marca modal como aberto ANTES de qualquer outra ação
  // para bloquear o unmute que pode ser disparado pelo clique
  videoOpen = true;

  // Pausa música se estiver tocando
  if (playing) togglePlay();

  // Esconde banner de som se estiver visível
  hideUnmuteBar();

  // Abre o modal
  if (modal) modal.style.display = 'flex';

  // Reseta e toca o vídeo com delay
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

  // Fecha o modal
  if (modal) modal.style.display = 'none';

  // Para o vídeo sem tocar no src
  if (videoEl) {
    videoEl.pause();
    videoEl.currentTime = 0;
  }

  // Marca modal como fechado com pequeno delay
  // para evitar que o clique de fechar dispare o unmute
  setTimeout(() => {
    videoOpen = false;
  }, 100);
}

// Fecha modal clicando fora (no fundo escuro)
document.addEventListener('click', function(e) {
  const modal = document.getElementById('video-modal');
  if (e.target === modal) closeVideo();
});

// Ativa som no primeiro toque — ignora cliques em elementos específicos
// e ignora completamente se o modal de vídeo estiver aberto
document.addEventListener('click', function(e) {
  // Ignora se modal de vídeo estiver aberto
  if (videoOpen) return;

  // Ignora cliques no botão pause e no disco
  if (e.target.id === 'pauseBtn' || e.target.id === 'disc') return;

  // Ignora clique no botão de abrir vídeo
  if (e.target.classList.contains('cta-btn')) return;
  if (e.target.closest('.cta-btn')) return;

  // Ignora cliques dentro do modal
  if (e.target.closest('#video-modal')) return;

  // Ativa o som
  if (muted) unmute();
}, false);

// Clique direto no banner ativa o som
if (unmuteBar) {
  unmuteBar.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!videoOpen) unmute();
  });
}

window.addEventListener('load', () => setTimeout(startMuted, 600));
