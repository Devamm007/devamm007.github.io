# devamm007.github.io

Personal portfolio website of **Devam Shah** — IITM BS Data Science student, Teaching Assistant, and open-source builder.

🌐 **Live:** [https://devamm007.github.io](https://devamm007.github.io)

---

## Overview

A fully responsive, single-page portfolio built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step. Features an animated particle canvas background, glassmorphism UI, smooth scroll-reveal animations, and a typed-text hero.

---

## Sections

| Section | Description |
|---|---|
| **Hero** | Animated intro with typed rotating roles |
| **Academics** | IITM BS DS degree — Foundation (completed) & Diploma (in progress) |
| **Projects** | 6 projects with live links, repo links, and tech tags |
| **Interests** | Finance, Cybersecurity, Quantum Computing, AI |
| **Certifications** | NPTEL & freeCodeCamp certs with direct credential links |
| **Experience** | Teaching Assistant roles at IIT Madras (AppDev I & Maths I) |
| **Contact** | Email, LinkedIn, GitHub, Telegram |

---

## Tech Stack

- **HTML5** — semantic structure
- **CSS3** — custom properties, glassmorphism, CSS Grid/Flexbox, responsive breakpoints
- **Vanilla JavaScript** — Canvas API (particle background), IntersectionObserver (scroll reveal & active nav), typed-text effect
- **Google Fonts** — Inter + JetBrains Mono

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
├── index.html       # Main page (all sections)
├── style.css        # All styles — theme variables, components, responsive
├── script.js        # Canvas background, typed text, navbar, scroll-reveal
├── academics.md     # Source notes for academics content
├── interests.md     # Source notes for interests content
├── github.md        # Source notes for project links
└── README.md        # This file
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
