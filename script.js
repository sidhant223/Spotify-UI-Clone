
const audio = new Audio();
let songs   = [];
let cur     = -1;
let playing = false;

// ── DOM references ───────────────────────────────
const $ = id => document.getElementById(id);

const songListUL = $('songListUL');
const qgrid      = $('qgrid');
const greet      = $('greet');
const pbTrack    = $('pbTrack');
const pbArtist   = $('pbArtist');
const tCur       = $('tCur');
const tDur       = $('tDur');
const seekProg   = $('seekProg');
const seekBar    = $('seekBar');
const btnPlay    = $('btnPlay');
const btnPrev    = $('btnPrev');
const btnNext    = $('btnNext');
const playIcon   = $('playIcon');
const volIn      = $('volIn');
const volProg    = $('volProg');
const sidebar    = $('sidebar');
const hamburger  = $('hamburger');
const sbClose    = $('sbClose');
const overlay    = $('overlay');


function fmt(s) {
  if (isNaN(s) || s < 0) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}
  
function cleanName(raw) {
  return decodeURIComponent(raw)
    .replace(/\.[^.]+$/, '')
    .replace(/_/g, ' ');
}

// ── Time-of-day greeting ─────────────────────────
const hr = new Date().getHours();
greet.innerHTML = `Good ${hr < 12 ? 'morning' : hr < 18 ? 'afternoon' : 'evening'} <em>—</em>`;

// ── Swatch gradients for song thumbnails ─────────
const swatches = [
  'linear-gradient(135deg, #062228, #0a3540)',
  'linear-gradient(135deg, #241200, #3a1e00)',
  'linear-gradient(135deg, #060e2a, #0a1a44)',
  'linear-gradient(135deg, #180622, #280a3a)',
  'linear-gradient(135deg, #081a10, #0e2c1a)',
  'linear-gradient(135deg, #200414, #360820)',
  'linear-gradient(135deg, #0a1e1e, #0e2e2e)',
  'linear-gradient(135deg, #1e1a02, #2e2804)',
];

// ── Fetch songs from /songs/ directory ───────────
async function getSongs() {
  try {
    const res  = await fetch('/songs/');
    const html = await res.text();
    const tmp  = document.createElement('div');
    tmp.innerHTML = html;
    return [...tmp.getElementsByTagName('a')]
      .filter(a => a.href.endsWith('.mp3'))
      .map(a => a.href.split('/songs/')[1]);
  } catch (err) {
    console.warn('Could not load /songs/ —', err.message);
    return [];
  }
}

// ── Render sidebar song list ─────────────────────
function renderList() {
  songListUL.innerHTML = '';

  songs.forEach((song, i) => {
    const name  = cleanName(song);
    const isCur = i === cur;
    const li    = document.createElement('li');
    li.dataset.index = i;
    if (isCur) li.classList.add('playing');

    li.innerHTML = `
      <div class="s-art" style="background:${swatches[i % swatches.length]}">
        <svg viewBox="0 0 24 24" fill="none"
             stroke="rgba(255,255,255,0.45)"
             stroke-width="1.5"
             stroke-linecap="round"
             stroke-linejoin="round">
          <circle cx="6.5" cy="18.5" r="3.5"/>
          <circle cx="18" cy="16" r="3"/>
          <path d="M10 18.5V7c0-.923.264-1.385.264-1.672C10.527 5.041 12 4.916 12 4.916
                   c4.022-.344 6.909-1.656 8.355-2.506C21 2.236 21 2.432 21 2.766V16
                   M10 10c5.867 0 9.778-2.333 11-3"/>
        </svg>
      </div>
      <div class="s-info">
        <div class="s-name">${name}</div>
        <div class="s-sub">Track ${i + 1}</div>
      </div>
      ${isCur
        ? `<div class="eq ${playing ? '' : 'paused'}">
             <span></span><span></span><span></span>
           </div>`
        : `<div class="ph-play">
             <svg viewBox="0 0 24 24"><path d="M5 20V4L19 12Z"/></svg>
           </div>`
      }`;

    li.addEventListener('click', () => playSong(i));
    songListUL.appendChild(li);
  });
}

// ── Render quick-picks grid ───────────────────────
function renderQuick() {
  qgrid.innerHTML = '';

  songs.slice(0, 8).forEach((song, i) => {
    const name = cleanName(song);
    const div  = document.createElement('div');
    div.className = 'qcard';
    div.innerHTML = `
      <div class="qcard-swatch" style="background:${swatches[i % swatches.length]}">
        <svg viewBox="0 0 24 24">
          <path d="M9 3L5 6.99h3V14h2V6.99h3L9 3z"/>
        </svg>
      </div>
      <span class="qcard-name">${name}</span>
      <div class="qcard-btn">
        <svg viewBox="0 0 24 24"><path d="M5 20V4L19 12Z"/></svg>
      </div>`;
    div.addEventListener('click', () => playSong(i));
    qgrid.appendChild(div);
  });
}

// ── Play a track by index ─────────────────────────
function playSong(i, autoplay = true) {
  if (i < 0 || i >= songs.length) return;

  cur       = i;
  audio.src = '/songs/' + songs[i];

  pbTrack.textContent  = cleanName(songs[i]);
  pbArtist.textContent = `Track ${i + 1}`;

  if (autoplay) {
    audio.play().catch(err => console.warn('Playback failed:', err));
    setPlayState(true);
  }

  renderList();
}

// ── Toggle play/pause visual state ───────────────
function setPlayState(isNowPlaying) {
  playing = isNowPlaying;

  // pause.svg: two rectangles | play.svg: triangle with stroke
  playIcon.innerHTML = isNowPlaying
    ? `<path d="M4 7C4 5.58579 4 4.87868 4.43934 4.43934C4.87868 4 5.58579 4 7 4C8.41421 4 9.12132 4 9.56066 4.43934C10 4.87868 10 5.58579 10 7V17C10 18.4142 10 19.1213 9.56066 19.5607C9.12132 20 8.41421 20 7 20C5.58579 20 4.87868 20 4.43934 19.5607C4 19.1213 4 18.4142 4 17V7Z" stroke="#061012" stroke-width="1.5"/>
       <path d="M14 7C14 5.58579 14 4.87868 14.4393 4.43934C14.8787 4 15.5858 4 17 4C18.4142 4 19.1213 4 19.5607 4.43934C20 4.87868 20 5.58579 20 7V17C20 18.4142 20 19.1213 19.5607 19.5607C19.1213 20 18.4142 20 17 20C15.5858 20 14.8787 20 14.4393 19.5607C14 19.1213 14 18.4142 14 17V7Z" stroke="#061012" stroke-width="1.5"/>`
    : `<path d="M5 20V4L19 12L5 20Z" fill="none" stroke="#061012" stroke-width="1.5" stroke-linejoin="round"/>`;

  // Animate / pause the EQ bars in the sidebar
  document.querySelectorAll('.eq').forEach(el => {
    isNowPlaying
      ? el.classList.remove('paused')
      : el.classList.add('paused');
  });
}

// ── Audio: time update ────────────────────────────
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  seekProg.style.width  = pct + '%';
  tCur.textContent      = fmt(audio.currentTime);
  tDur.textContent      = fmt(audio.duration);
});

// ── Audio: track ended → auto-advance ────────────
audio.addEventListener('ended', () => {
  if (cur + 1 < songs.length) {
    playSong(cur + 1);
  } else {
    setPlayState(false);
  }
});

// ── Play / Pause button ───────────────────────────
btnPlay.addEventListener('click', () => {
  if (!songs.length) return;

  if (cur === -1) {
    playSong(0);
    return;
  }

  if (audio.paused) {
    audio.play().catch(err => console.warn(err));
    setPlayState(true);
  } else {
    audio.pause();
    setPlayState(false);
  }
});

// ── Previous button ───────────────────────────────
btnPrev.addEventListener('click', () => {
  // If more than 3 seconds in, restart current track
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  if (cur > 0) playSong(cur - 1);
});

// ── Next button ───────────────────────────────────
btnNext.addEventListener('click', () => {
  if (cur + 1 < songs.length) playSong(cur + 1);
});

// ── Seekbar click ─────────────────────────────────
seekBar.addEventListener('click', e => {
  if (!audio.duration) return;
  const rect = seekBar.getBoundingClientRect();
  const pct  = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
});

// ── Volume slider ─────────────────────────────────
audio.volume = 0.7;

volIn.addEventListener('input', e => {
  const val = parseInt(e.target.value);
  audio.volume = val / 100;
  volProg.style.width = val + '%';
});

// ── Sidebar open / close (mobile) ────────────────
hamburger.addEventListener('click', openSidebar);
sbClose.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('on');
}

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('on');
}

// ── Init ─────────────────────────────────────────
async function init() {
  songs = await getSongs();

  // Demo mode when /songs/ isn't available
  if (!songs.length) {
    songs = Array.from({ length: 8 }, (_, i) =>
      `Demo%20Track%20${String(i + 1).padStart(2, '0')}.mp3`
    );
    pbTrack.textContent  = 'Add .mp3 files to /songs/';
    pbArtist.textContent = 'Demo mode';
  }

  renderList();
  renderQuick();

  // Pre-load first track (no autoplay — browser policy)
  cur = 0;
  audio.src = '/songs/' + songs[0];
  pbTrack.textContent  = cleanName(songs[0]);
  pbArtist.textContent = 'Track 1';
  renderList();
}

init();
