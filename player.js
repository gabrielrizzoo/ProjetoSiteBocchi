/**
 * Mini Player — toca as músicas da Kessoku Band pelo YouTube (IFrame API)
 *
 * Os vídeos vêm do canal oficial do anime e do canal oficial da banda.
 * Por padrão toca só o áudio: o vídeo fica carregado mas recolhido
 * (com altura zero, sem display:none, para o navegador não pausar).
 * O botão de vídeo só mostra ou esconde o vídeo, sem pausar.
 *
 * Como o site tem várias páginas, a faixa, o tempo e o volume ficam
 * salvos na sessão e o player tenta continuar de onde parou.
 */
(function () {
  // Só vídeos dos canais oficiais (anime e Aniplex). Os do canal "Topic"
  // do YouTube bloqueiam reprodução fora do site deles (erro 150).
  const TRACKS = [
    { title: 'Seishun Complex', note: 'Ao vivo · Special Studio Live', id: 'n1K5BDHnr7c' },
    { title: 'Distortion!!', note: 'Encerramento · versão TV', id: 'Xy6lZxoJ4ts' },
    { title: 'Guitar to Kodoku to Aoi Hoshi', note: 'Lyric video oficial', id: 'B7BxrAAXl94' },
    { title: 'Ano Band', note: 'Lyric video oficial', id: 'L2i0i9gWE00' },
    { title: 'Karakara', note: 'Encerramento · versão TV', id: 'MTPiaDzacSI' },
    { title: 'Nani ga Warui', note: 'Encerramento · versão TV', id: '3ijkvUYwJhU' },
    { title: 'Wasurete Yaranai', note: 'Lyric video oficial', id: 'gX9m-rCtSqc' },
    { title: 'Seiza ni Naretara', note: 'Lyric video oficial', id: 'wSTbdqo-j74' },
    { title: 'Flashbacker', note: 'Ao vivo · Special Studio Live', id: 'YzoNZ-ozS3o' },
    { title: 'Korogaru Iwa, Kimi ni Asa ga Furu', note: 'Ao vivo · LIVE STAGE', id: '8vs7wgbH4g4' }
  ];

  const SESSION_KEY = 'bocchiPlayer';
  const VOLUME_KEY = 'bocchiVolume';

  // ================================================
  // ESTADO SALVO
  // ================================================
  function readJSON(storage, key) {
    try {
      return JSON.parse(storage.getItem(key)) || null;
    } catch {
      return null;
    }
  }

  function writeJSON(storage, key, value) {
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage indisponível
    }
  }

  const saved = readJSON(sessionStorage, SESSION_KEY) || {};
  const savedVolume = readJSON(localStorage, VOLUME_KEY) || {};

  if (saved.dismissed) return;

  const state = {
    index: Number.isInteger(saved.index) && saved.index >= 0 && saved.index < TRACKS.length ? saved.index : 0,
    time: saved.time || 0,
    wasPlaying: Boolean(saved.playing),
    volume: Number.isFinite(savedVolume.volume) ? savedVolume.volume : 70,
    muted: Boolean(savedVolume.muted)
  };

  let yt = null;            // instância do YT.Player
  let ytReady = false;
  let apiPromise = null;
  let isPlaying = false;
  let progressTimer = null;
  let seeking = false;
  let errorStreak = 0;

  // ================================================
  // MARKUP
  // ================================================
  const playerHTML = `
    <aside id="mini-player" class="mini-player" aria-label="Player com as músicas da Kessoku Band">
      <div class="player-panel" id="player-panel" aria-hidden="true">
        <div class="player-video"><div id="player-yt"></div></div>
      </div>
      <div class="player-bar">
        <div class="player-cover" role="img" aria-label="Capa: Kessoku Band"></div>
        <div class="player-info">
          <p class="player-label">
            <span class="player-eq" aria-hidden="true"><i></i><i></i><i></i></span>
            <span><span id="player-pos"></span> · <span id="player-source"></span></span>
          </p>
          <p class="player-title" id="player-title" aria-live="polite"></p>
        </div>
        <div class="player-controls">
          <button type="button" class="player-btn" id="player-prev" aria-label="Música anterior">
            <span class="material-symbols-outlined" aria-hidden="true">skip_previous</span>
          </button>
          <button type="button" class="player-btn play-btn" id="player-play" aria-label="Tocar">
            <span class="material-symbols-outlined" aria-hidden="true">play_arrow</span>
          </button>
          <button type="button" class="player-btn" id="player-next" aria-label="Próxima música">
            <span class="material-symbols-outlined" aria-hidden="true">skip_next</span>
          </button>
          <button type="button" class="player-btn" id="player-toggle" aria-controls="player-panel" aria-expanded="false" aria-label="Mostrar vídeo">
            <span class="material-symbols-outlined" aria-hidden="true">videocam</span>
          </button>
          <button type="button" class="player-btn player-close" id="player-close" aria-label="Fechar player">
            <span class="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </div>
      </div>
      <!-- Tempo e volume ficam sempre à mão, com ou sem o vídeo aberto -->
      <div class="player-extra">
        <div class="player-progress">
          <span class="player-time" id="player-current">0:00</span>
          <input type="range" id="player-seek" class="player-range" min="0" max="1000" value="0" step="1" aria-label="Posição na música">
          <span class="player-time" id="player-duration">0:00</span>
        </div>
        <div class="player-volume">
          <button type="button" class="player-btn" id="player-mute" aria-label="Silenciar">
            <span class="material-symbols-outlined" aria-hidden="true">volume_up</span>
          </button>
          <input type="range" id="player-volume" class="player-range" min="0" max="100" step="1" aria-label="Volume">
        </div>
      </div>
    </aside>
  `;

  document.body.insertAdjacentHTML('beforeend', playerHTML);
  document.body.classList.add('has-player');

  const el = {
    root: document.getElementById('mini-player'),
    panel: document.getElementById('player-panel'),
    title: document.getElementById('player-title'),
    pos: document.getElementById('player-pos'),
    source: document.getElementById('player-source'),
    play: document.getElementById('player-play'),
    prev: document.getElementById('player-prev'),
    next: document.getElementById('player-next'),
    toggle: document.getElementById('player-toggle'),
    close: document.getElementById('player-close'),
    seek: document.getElementById('player-seek'),
    current: document.getElementById('player-current'),
    duration: document.getElementById('player-duration'),
    volume: document.getElementById('player-volume'),
    mute: document.getElementById('player-mute')
  };

  const icon = (btn) => btn.querySelector('.material-symbols-outlined');

  // ================================================
  // UI
  // ================================================
  function formatTime(seconds) {
    const s = Math.max(0, Math.floor(seconds || 0));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  function renderTrack() {
    const track = TRACKS[state.index];
    el.title.textContent = track.title;
    el.pos.textContent = `${state.index + 1}/${TRACKS.length}`;
    el.source.textContent = track.note;
  }

  function renderPlayState() {
    el.root.classList.toggle('playing', isPlaying);
    icon(el.play).textContent = isPlaying ? 'pause' : 'play_arrow';
    el.play.setAttribute('aria-label', isPlaying ? 'Pausar' : 'Tocar');
  }

  function renderVolume() {
    const value = state.muted ? 0 : state.volume;
    el.volume.value = value;
    el.volume.style.setProperty('--fill', `${value}%`);
    icon(el.mute).textContent = value === 0 ? 'volume_off' : value < 50 ? 'volume_down' : 'volume_up';
    el.mute.setAttribute('aria-label', state.muted ? 'Ativar som' : 'Silenciar');
  }

  function renderProgress(current, total) {
    el.current.textContent = formatTime(current);
    el.duration.textContent = formatTime(total);
    if (!seeking) {
      const ratio = total > 0 ? current / total : 0;
      el.seek.value = Math.round(ratio * 1000);
      el.seek.style.setProperty('--fill', `${ratio * 100}%`);
    }
  }

  let videoOpen = false;

  function setPanel(open) {
    videoOpen = open;
    el.panel.setAttribute('aria-hidden', String(!open));
    el.root.classList.toggle('expanded', open);
    el.toggle.setAttribute('aria-expanded', String(open));
    el.toggle.setAttribute('aria-label', open ? 'Esconder vídeo' : 'Mostrar vídeo');
    el.toggle.title = open ? 'Esconder vídeo' : 'Mostrar vídeo';
    icon(el.toggle).textContent = open ? 'videocam_off' : 'videocam';
  }

  function saveSession(extra = {}) {
    const time = ytReady && yt.getCurrentTime ? yt.getCurrentTime() : state.time;
    writeJSON(sessionStorage, SESSION_KEY, {
      index: state.index,
      time,
      playing: isPlaying,
      video: videoOpen,
      ...extra
    });
  }

  function saveVolume() {
    writeJSON(localStorage, VOLUME_KEY, { volume: state.volume, muted: state.muted });
  }

  // ================================================
  // YOUTUBE IFRAME API
  // ================================================
  function loadApi() {
    if (apiPromise) return apiPromise;

    apiPromise = new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        resolve();
        return;
      }
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof previous === 'function') previous();
        resolve();
      };
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.head.appendChild(script);
    });

    return apiPromise;
  }

  function createPlayer(autoplay) {
    return loadApi().then(() => new Promise((resolve) => {
      yt = new YT.Player('player-yt', {
        videoId: TRACKS[state.index].id,
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          start: Math.floor(state.time),
          playsinline: 1,
          rel: 0
        },
        events: {
          onReady: () => {
            ytReady = true;
            applyVolume();
            if (autoplay) yt.playVideo();
            resolve();
          },
          onStateChange: onStateChange,
          onError: onError
        }
      });
    }));
  }

  function applyVolume() {
    if (!ytReady) return;
    yt.setVolume(state.volume);
    if (state.muted) yt.mute(); else yt.unMute();
  }

  function onStateChange(event) {
    const S = YT.PlayerState;

    if (event.data === S.PLAYING) {
      isPlaying = true;
      errorStreak = 0;
      startProgress();
    } else if (event.data === S.PAUSED || event.data === S.CUED) {
      isPlaying = false;
      stopProgress();
    } else if (event.data === S.ENDED) {
      isPlaying = false;
      stopProgress();
      changeTrack(1, true);
    }

    renderPlayState();
    saveSession();
  }

  // Faixa bloqueada para incorporação: avisa e pula para a próxima
  function onError() {
    errorStreak++;
    el.source.textContent = 'Faixa indisponível, pulando…';
    if (errorStreak < TRACKS.length) {
      setTimeout(() => changeTrack(1, true), 1500);
    } else {
      isPlaying = false;
      renderPlayState();
    }
  }

  function startProgress() {
    stopProgress();
    progressTimer = setInterval(() => {
      if (!ytReady) return;
      renderProgress(yt.getCurrentTime(), yt.getDuration());
    }, 500);
  }

  function stopProgress() {
    clearInterval(progressTimer);
    progressTimer = null;
  }

  // ================================================
  // AÇÕES
  // ================================================
  function play() {
    if (!yt) {
      createPlayer(true);
    } else if (ytReady) {
      yt.playVideo();
    }
  }

  function pause() {
    if (ytReady) yt.pauseVideo();
  }

  function changeTrack(delta, autoplay) {
    state.index = (state.index + delta + TRACKS.length) % TRACKS.length;
    state.time = 0;
    renderTrack();
    renderProgress(0, 0);

    if (ytReady) {
      const id = TRACKS[state.index].id;
      if (autoplay || isPlaying) yt.loadVideoById(id);
      else yt.cueVideoById(id);
    }
    saveSession();
  }

  el.play.addEventListener('click', () => (isPlaying ? pause() : play()));
  el.prev.addEventListener('click', () => changeTrack(-1, isPlaying));
  el.next.addEventListener('click', () => changeTrack(1, isPlaying));

  // Só mostra ou esconde o vídeo; a música continua tocando
  el.toggle.addEventListener('click', () => {
    setPanel(!videoOpen);
    if (videoOpen && !yt) createPlayer(false);
  });

  el.close.addEventListener('click', () => {
    if (yt && yt.destroy) yt.destroy();
    stopProgress();
    isPlaying = false;
    saveSession({ dismissed: true, playing: false });
    el.root.classList.remove('visible');
    document.body.classList.remove('has-player');
    setTimeout(() => el.root.remove(), 500);
  });

  // Barra de progresso
  el.seek.addEventListener('input', () => {
    seeking = true;
    const ratio = el.seek.value / 1000;
    el.seek.style.setProperty('--fill', `${ratio * 100}%`);
    if (ytReady) el.current.textContent = formatTime(ratio * yt.getDuration());
  });

  el.seek.addEventListener('change', () => {
    seeking = false;
    if (ytReady) yt.seekTo((el.seek.value / 1000) * yt.getDuration(), true);
  });

  // Volume
  el.volume.addEventListener('input', () => {
    state.volume = Number(el.volume.value);
    state.muted = state.volume === 0;
    renderVolume();
    applyVolume();
    saveVolume();
  });

  el.mute.addEventListener('click', () => {
    state.muted = !state.muted;
    if (!state.muted && state.volume === 0) state.volume = 50;
    renderVolume();
    applyVolume();
    saveVolume();
  });

  // Guarda o ponto da música ao trocar de página
  window.addEventListener('pagehide', () => saveSession());

  // ================================================
  // INIT
  // ================================================
  renderTrack();
  renderVolume();
  renderPlayState();
  setPanel(Boolean(saved.video));
  if (videoOpen && !state.wasPlaying) createPlayer(false);

  setTimeout(() => el.root.classList.add('visible'), state.wasPlaying ? 0 : 1200);

  // Vinha tocando na página anterior: tenta continuar
  if (state.wasPlaying) {
    createPlayer(true).then(() => {
      setTimeout(() => {
        if (!isPlaying) el.source.textContent = 'Toque em play para continuar';
      }, 1500);
    });
  }
})();
