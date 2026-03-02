# devamm007.github.io

Personal portfolio website of **Devam Shah** — IITM BS Data Science student, Teaching Assistant, and open-source builder.

🌐 **Live:** [https://devamm007.github.io](https://devamm007.github.io)

---

## Overview

A fully responsive, multi-page portfolio built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step. Features a dual-theme animated canvas background, glassmorphism UI, smooth scroll-reveal animations, a typed-text hero, and Google Calendar appointment booking.

### Dual Canvas Themes

| Theme | Visual | Key Effects |
|---|---|---|
| **🌿 Nature** | Deep pond with koi fish | Water caustics, sunbeam rays, lily pads, fireflies, plankton particles, bioluminescent fish halos |
| **∑ Math** | Midnight obsidian scholar | Floating Greek symbols & equations, constellation lines, pulsing dot-grid, depth-layered parallax, ambient golden glow |

Switch between themes with the toggle in the navbar — your preference persists via `localStorage`.

---

## Pages & Sections

| Page / Section | Description |
|---|---|
| **Hero** | Animated intro with typed rotating roles |
| **Academics** | IITM BS DS degree — Foundation (completed) & Diploma (in progress) |
| **Projects** | 5 projects with live links, repo links, and tech tags |
| **[Interests](interests.html)** | Finance, Cybersecurity, Quantum Computing, AI, Mathematics, Open Source |
| **Certifications** | NPTEL & freeCodeCamp certs with direct credential links |
| **Experience** | Teaching Assistant roles at IIT Madras (AppDev I & Maths I) |
| **[Leisure](leisure.html)** | Cycling, travelling in nature, adventures — with philosophy quote |
| **Contact** | Email, LinkedIn, GitHub, Telegram + Google Calendar appointment booking |

---

## Tech Stack

- **HTML5** — semantic structure across `index.html`, `interests.html`, `leisure.html`
- **CSS3** — custom properties, glassmorphism, CSS Grid/Flexbox, responsive breakpoints, `@keyframes` animations, smooth theme transitions
- **Vanilla JavaScript** — Canvas API (dual-theme animated backgrounds), IntersectionObserver (scroll reveal & active nav), typed-text effect, `localStorage` theme persistence
- **Google Calendar** — appointment scheduling integration via `calendar.app.google` link
- **FormSubmit** — no-server contact form submission
- **Google Fonts** — Inter + JetBrains Mono + Cormorant Garamond

---

## Canvas Effects

### Nature Theme (default)
- **Koi fish** — 8 multi-coloured koi with body, fins, glow halos, and fear response to cursor
- **Water caustics** — animated radial light patterns that drift across the pond surface
- **Sunbeam rays** — diagonal light columns that slowly shift and breathe
- **Lily pads** — floating elliptical pads with vein details and gentle drift
- **Fireflies** — pulsing warm particles near the top of the viewport
- **Plankton** — rising bioluminescent particles with organic movement
- **Ripples** — elliptical ripple rings on click and mouse movement

### Math Theme
- **Floating symbols** — 110 Greek letters, operators, and equation fragments in Cormorant Garamond
- **Depth layers** — symbols at different parallax depths for a 3D feel
- **Constellation lines** — faint golden connections between nearby symbols
- **Pulsing nodes** — glowing dots at symbol positions
- **Dot grid** — subtle graph-paper dots with radial pulse animation
- **Ambient glow** — warm golden and lavender centre glow
- **Ripples** — golden-tinted elliptical ripples on interaction

---

## Running Locally

No install required — just open the file:

```bash
# Clone the repo
git clone https://github.com/Devamm007/devamm007.github.io.git
cd devamm007.github.io

# Open directly in browser
start index.html        # Windows
open index.html         # macOS
xdg-open index.html     # Linux
```

Or serve with any static file server:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

Then visit `http://localhost:8080`.

---

## File Structure

```
devamm007.github.io/
├── index.html         # Main page (Hero, Academics, Projects, Certs, Experience, Contact)
├── interests.html     # Interests sub-page (Finance, Cyber, Quantum, AI, Maths, Open Source)
├── leisure.html       # Leisure sub-page (Cycling, Nature Travel, Adventures)
├── style.css          # All styles — theme variables, components, responsive, dual theme
├── script.js          # Canvas backgrounds, typed text, navbar, scroll-reveal, theme toggle
├── academics.md       # Source notes for academics content
├── interests.md       # Source notes for interests content
├── github.md          # Source notes for project links
├── LICENSE            # MIT License
└── README.md          # This file
```

---

## Deployment

This site is deployed via **GitHub Pages** from the root of the `main` branch.

To deploy your own fork:
1. Fork / clone this repo
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)`
4. Your site will be live at `https://<your-username>.github.io`

---

## License

MIT — feel free to use this as a template. Attribution appreciated but not required.

---

*Built with ❤️ and vanilla web tech by [Devam Shah](https://github.com/Devamm007)*
