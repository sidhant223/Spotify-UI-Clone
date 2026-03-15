# SoundWave 🎵

A Spotify-inspired music player web app built with pure HTML, CSS, and JavaScript. No frameworks, no libraries — just vanilla web fundamentals.

---

> Deep Teal × Amber × Slate dark theme with animated equalizer bars, a fixed playbar, and a responsive sidebar.

---

## Features

- 🎵 **Music playback** — play, pause, skip forward and backward
- ⏭ **Auto-advance** — automatically plays the next track when one ends
- ⏱ **Seekbar** — click anywhere on the progress bar to jump to that position
- 🔊 **Volume control** — slider to adjust audio volume
- 📂 **Dynamic song loading** — reads `.mp3` files from the `/songs/` folder automatically
- 📋 **Library sidebar** — lists all songs with animated EQ bars on the currently playing track
- ⚡ **Quick picks** — top 8 songs shown as fast-access cards on the home screen
- 🌙 **Time-of-day greeting** — shows Good morning / afternoon / evening based on system time
- 📱 **Responsive design** — collapsible sidebar with hamburger menu on mobile
- 🎨 **Custom colour theme** — Deep Teal (`#0dd4c8`) + Amber (`#f5a623`) accent palette

---

## Tech Stack

| Technology | Usage |
|---|---|
| **HTML5** | Semantic structure — `<aside>`, `<main>`, SVG icons inlined |
| **CSS3** | Flexbox, CSS Grid, custom properties (variables), keyframe animations, media queries |
| **JavaScript (ES6+)** | Fetch API, async/await, Audio API, DOM manipulation, event listeners |

---

## Project Structure

```
soundwave/
├── index.html       # App structure and markup
├── style.css        # All styles — layout, theme, responsive
├── script.js        # All logic — playback, rendering, controls
├── songs/           # Put your .mp3 files here (not tracked by Git)
└── README.md
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sidhant223/soundwave.git
cd soundwave
```

### 2. Add your songs

Create a `songs/` folder in the project root and drop your `.mp3` files inside:

```
songs/
├── Blinding Lights.mp3
├── Levitating.mp3
└── Stay.mp3
```

### 3. Run a local server

> ⚠️ You **cannot** open `index.html` directly with `file://` — the app uses `fetch()` to read the songs directory, which requires a server.

**Option A — Node.js (recommended):**
```bash
npx serve .
```

**Option B — VS Code:**
Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer), right-click `index.html` → Open with Live Server.

**Option C — Python:**
```bash
python -m http.server 8000
```

### 4. Open in browser

```
http://localhost:3000
```

---

## How It Works

### Song Loading
`script.js` fetches the `/songs/` directory listing, parses the HTML response to find all `.mp3` links, and stores the filenames in an array. This is the same approach used in the [CodeWithHarry Sigma Web Dev Course](https://github.com/CodeWithHarry/Sigma-Web-Dev-Course) (Video 84), reimplemented and extended.

### Audio Playback
Uses the browser's built-in `Audio` API — a single `Audio` object is created once and reused for every track by updating its `src` property.

### Responsive Layout
- **≥ 960px** — full sidebar always visible
- **< 960px** — sidebar slides in from the left via a hamburger menu button
- **< 640px** — volume control hidden, layout simplified for small screens

---

## Concepts Demonstrated

This project covers the following web development fundamentals:

- Semantic HTML5 tags and SVG icons
- CSS custom properties (design tokens / variables)
- Flexbox and CSS Grid layouts
- CSS transitions and `@keyframes` animations
- `position: fixed`, `absolute`, `relative`
- Media queries for responsive design
- `fetch()` and `async/await`
- DOM selection and manipulation
- `addEventListener` for user interaction
- The browser `Audio` API
- ES6+ features — arrow functions, template literals, array methods (`filter`, `map`, `forEach`)
- `classList.add/remove` for toggling UI state

---

## .gitignore

```
songs/
```

MP3 files are large and should not be committed to Git. The `songs/` folder is ignored — each person running the project adds their own music locally.

---

## Acknowledgements

- Project structure inspired by [CodeWithHarry — Sigma Web Dev Course, Video 84](https://github.com/CodeWithHarry/Sigma-Web-Dev-Course/tree/main/Video%2084%20-%20Project%202%20-%20Spotify%20Clone)
- Fonts: [Syne](https://fonts.google.com/specimen/Syne) + [Outfit](https://fonts.google.com/specimen/Outfit) via Google Fonts
- Icons: Custom inline SVG

---

## License

This project is open source and available under the [MIT License](LICENSE).
