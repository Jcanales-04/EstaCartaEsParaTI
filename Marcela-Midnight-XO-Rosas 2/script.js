const envelope = document.querySelector('#envelope');
const letterToggle = document.querySelector('#letter-toggle');
const openButtonText = document.querySelector('#open-button-text');
const letterSheet = document.querySelector('#letter-sheet');
const musicToggle = document.querySelector('#music-toggle');
const musicToggleText = document.querySelector('#music-toggle-text');
const musicIcon = document.querySelector('#music-icon');
const musicPlayer = document.querySelector('#music-player');
const localAudio = document.querySelector('#local-audio');
const playerPlay = document.querySelector('#player-play');
const playerPlayIcon = document.querySelector('#player-play-icon');
const seekBar = document.querySelector('#seek-bar');
const currentTimeLabel = document.querySelector('#current-time');
const totalTimeLabel = document.querySelector('#total-time');
const playerStatus = document.querySelector('#player-status');
const closePlayer = document.querySelector('#close-player');
const nextNote = document.querySelector('#next-note');
const noteText = document.querySelector('#note-text');
const noteNumber = document.querySelector('#note-number');

let letterIsOpen = false;

letterToggle.addEventListener('click', () => {
  letterIsOpen = !letterIsOpen;
  envelope.classList.toggle('is-open', letterIsOpen);
  letterToggle.setAttribute('aria-expanded', String(letterIsOpen));

  if (letterIsOpen) {
    letterSheet.hidden = false;
    openButtonText.textContent = 'Cerrar la carta';
    letterToggle.querySelector('.button-orb').textContent = '♡';
    window.setTimeout(() => {
      letterSheet.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
      letterSheet.focus({ preventScroll: true });
    }, 240);
  } else {
    stopMusic();
    letterSheet.hidden = true;
    openButtonText.textContent = 'Abrir mi carta';
    letterToggle.querySelector('.button-orb').textContent = '↗';
    document.querySelector('#inicio').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

musicToggle.addEventListener('click', async () => {
  if (musicPlayer.hidden) {
    musicPlayer.hidden = false;
    musicToggle.setAttribute('aria-expanded', 'true');
    musicToggleText.textContent = 'Ocultar reproductor';
    musicIcon.textContent = '♫';
    try {
      await localAudio.play();
    } catch (error) {
      playerStatus.textContent = 'El reproductor está listo. Pulsa el botón redondo para escuchar la canción.';
      updatePlayButton();
    }
  } else {
    stopMusic();
  }
});

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}

function updatePlayButton() {
  const isPlaying = !localAudio.paused && !localAudio.ended;
  document.querySelectorAll('.cover-vinyl, .player-art-disc').forEach((disc) => {
    disc.classList.toggle('spinning', isPlaying);
  });
  playerPlayIcon.textContent = isPlaying ? 'Ⅱ' : '▶';
  playerPlay.setAttribute('aria-label', isPlaying ? 'Pausar canción' : 'Reproducir canción');
  musicIcon.textContent = isPlaying ? 'Ⅱ' : '▶';

  if (!musicPlayer.hidden) {
    musicToggleText.textContent = isPlaying ? 'Ocultar reproductor' : 'Reproductor abierto';
    playerStatus.textContent = isPlaying
      ? 'Sonando para ti, Marce. ♥'
      : 'Pausado. Pulsa reproducir cuando quieras continuar.';
  }
}

playerPlay.addEventListener('click', async () => {
  if (localAudio.paused || localAudio.ended) {
    try {
      await localAudio.play();
    } catch (error) {
      playerStatus.textContent = 'No se pudo abrir el audio. Comprueba que el archivo as-you-are.mp3 esté junto al proyecto, dentro de assets.';
    }
  } else {
    localAudio.pause();
  }
  updatePlayButton();
});

localAudio.addEventListener('loadedmetadata', () => {
  totalTimeLabel.textContent = formatTime(localAudio.duration);
  seekBar.max = String(localAudio.duration || 100);
});

localAudio.addEventListener('timeupdate', () => {
  currentTimeLabel.textContent = formatTime(localAudio.currentTime);
  if (!seekBar.matches(':active')) seekBar.value = String(localAudio.currentTime || 0);
});

seekBar.addEventListener('input', () => {
  if (Number.isFinite(localAudio.duration)) {
    localAudio.currentTime = Number(seekBar.value);
  }
});

localAudio.addEventListener('play', updatePlayButton);
localAudio.addEventListener('pause', updatePlayButton);
localAudio.addEventListener('ended', () => {
  updatePlayButton();
  playerStatus.textContent = 'Fin de la canción. Puedes volver a escucharla cuando quieras. ♥';
});
localAudio.addEventListener('error', () => {
  playerStatus.textContent = 'No se pudo cargar el audio. Verifica que assets/as-you-are.mp3 siga en la carpeta del proyecto.';
});

function stopMusic() {
  localAudio.pause();
  localAudio.currentTime = 0;
  musicPlayer.hidden = true;
  musicToggle.setAttribute('aria-expanded', 'false');
  musicToggleText.textContent = 'Escuchar la canción';
  musicIcon.textContent = '▶';
  playerPlayIcon.textContent = '▶';
  playerPlay.setAttribute('aria-label', 'Reproducir canción');
  seekBar.value = '0';
  currentTimeLabel.textContent = '0:00';
  playerStatus.textContent = 'Pulsa reproducir y deja que la canción acompañe tu carta.';
}

closePlayer.addEventListener('click', stopMusic);

const notes = [
  'No tienes que resolverlo todo hoy, Marce. Puedes ir paso a paso. Yo estoy orgulloso de ti también en los días en los que sientes que avanzaste poquito.',
  'Entre todas las cosas que pueden mejorar un día, a veces basta con recibir un mensaje tuyo.',
  'Ojalá pudieras verte por un momento desde mis ojos. Entenderías por qué te admiro tanto.',
  'Me acuerdo de cuando empezaste con el arco. Mira hasta dónde has llegado. Date crédito por tu esfuerzo, mi amor; yo sí lo veo.',
  'Me gusta escucharte, incluso cuando me cuentas cosas que no entiendo. Es que me gusta que me dejes entrar en tu mundo.'
];

let noteIndex = 0;
nextNote.addEventListener('click', () => {
  noteIndex = (noteIndex + 1) % notes.length;
  noteText.animate(
    [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }],
    { duration: 280, easing: 'ease-out' }
  );
  noteText.textContent = notes[noteIndex];
  noteNumber.textContent = `NOTA ${String(noteIndex + 1).padStart(2, '0')} / ${String(notes.length).padStart(2, '0')}`;
});
