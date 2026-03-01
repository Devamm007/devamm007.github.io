/* ============================================================
   Devam Shah — Portfolio  |  script.js
   Canvas particle background · typed text · nav · reveal
   ============================================================ */

'use strict';

/* ── 1. Canvas: Pond Ecosystem ──────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H;
  const mouse   = { x: -9999, y: -9999 };
  const ripples = [];

  // ── Koi palettes ──────────────────────────────────────────
  const PALETTES = [
    { body: '#f59e0b', fin: '#b45309', glow: 'rgba(245,158,11,0.28)'  }, // amber koi
    { body: '#f87171', fin: '#b91c1c', glow: 'rgba(248,113,113,0.22)' }, // red koi
    { body: '#4ade80', fin: '#16a34a', glow: 'rgba(74,222,128,0.22)'  }, // jade koi
    { body: '#60a5fa', fin: '#2563eb', glow: 'rgba(96,165,250,0.22)'  }, // sapphire koi
    { body: '#e879f9', fin: '#a21caf', glow: 'rgba(232,121,249,0.18)' }, // blossom koi
  ];

  // ── Resize ────────────────────────────────────────────────
  let techNodes, techPulses; // declared here so resize can reference them
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    if (techNodes) techNodes.forEach(n => {
      n.x = Math.min(n.x, W - 1);
      n.y = Math.min(n.y, H - 1);
    });
  }
  window.addEventListener('resize', resize);
  resize();

  // ── Bioluminescent plankton ───────────────────────────────
  function mkPlankton() {
    return {
      x    : Math.random() * W,
      y    : Math.random() * H,
      r    : 0.8 + Math.random() * 2.2,
      vx   : (Math.random() - 0.5) * 0.18,
      vy   : -(0.08 + Math.random() * 0.22),
      hue  : 130 + Math.random() * 65, // green → teal
      alpha: 0.25 + Math.random() * 0.55,
      phase: Math.random() * Math.PI * 2,
      freq : 0.008 + Math.random() * 0.018,
    };
  }
  const plankton = Array.from({ length: 60 }, mkPlankton);

  // ── Fish ──────────────────────────────────────────────────
  function mkFish() {
    const pal     = PALETTES[Math.floor(Math.random() * PALETTES.length)];
    const goRight = Math.random() < 0.5;
    return {
      x       : goRight ? -60 : W + 60,
      y       : 0.15 * H + Math.random() * 0.7 * H,
      sz      : 13 + Math.random() * 17,
      spd     : 0.45 + Math.random() * 0.65,
      dir     : goRight ? 1 : -1,
      waveOff : Math.random() * Math.PI * 2,
      waveFreq: 0.006 + Math.random() * 0.01,
      tail    : Math.random() * Math.PI * 2,
      scared  : 0,
      pal,
    };
  }
  const fishArr = Array.from({ length: 8 }, mkFish);

  // ── Tech canvas state ─────────────────────────────────────
  const TECH_MAX_DIST = 165;
  techNodes = Array.from({ length: 55 }, () => ({
    x    : Math.random() * W,
    y    : Math.random() * H,
    vx   : (Math.random() - 0.5) * 0.38,
    vy   : (Math.random() - 0.5) * 0.38,
    r    : 1.4 + Math.random() * 2,
    hue  : 185 + Math.random() * 55,   // cyan → blue
    pulse: Math.random() * Math.PI * 2,
    scared: 0,
  }));
  techPulses = [];

  function drawTechBg() {
    const g = ctx.createRadialGradient(W * 0.5, H * 0.38, 0, W * 0.5, H * 0.6, Math.max(W, H) * 0.9);
    g.addColorStop(0,    '#040c1c');
    g.addColorStop(0.45, '#020810');
    g.addColorStop(1,    '#010206');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function drawTechGrid() {
    const sz = 58;
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'rgba(0,180,255,0.024)';
    for (let x = 0; x < W; x += sz) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += sz) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  function updateTechNodes() {
    for (const n of techNodes) {
      n.pulse += 0.022;
      const mdx = n.x - mouse.x, mdy = n.y - mouse.y;
      const md  = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < 115) n.scared = 45;
      if (n.scared > 0) {
        n.scared--;
        const ang = Math.atan2(mdy, mdx);
        n.x += Math.cos(ang) * 2.4;
        n.y += Math.sin(ang) * 2.4;
      } else {
        n.x += n.vx;
        n.y += n.vy;
      }
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      n.x = Math.max(0, Math.min(W, n.x));
      n.y = Math.max(0, Math.min(H, n.y));
    }
  }

  function drawTechEdgesAndPulses() {
    for (let i = 0; i < techNodes.length; i++) {
      for (let j = i + 1; j < techNodes.length; j++) {
        const dx = techNodes[i].x - techNodes[j].x;
        const dy = techNodes[i].y - techNodes[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < TECH_MAX_DIST) {
          const alpha = (1 - d / TECH_MAX_DIST) * 0.22;
          ctx.beginPath();
          ctx.moveTo(techNodes[i].x, techNodes[i].y);
          ctx.lineTo(techNodes[j].x, techNodes[j].y);
          ctx.strokeStyle = `rgba(0,210,255,${alpha})`;
          ctx.lineWidth = 0.65;
          ctx.stroke();
          if (Math.random() < 0.00065)
            techPulses.push({ i, j, t: 0 });
        }
      }
    }
    for (let p = techPulses.length - 1; p >= 0; p--) {
      const pulse = techPulses[p];
      pulse.t += 0.017;
      if (pulse.t > 1) { techPulses.splice(p, 1); continue; }
      const a = techNodes[pulse.i], b = techNodes[pulse.j];
      const px = a.x + (b.x - a.x) * pulse.t;
      const py = a.y + (b.y - a.y) * pulse.t;
      ctx.beginPath();
      ctx.arc(px, py, 2.3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100,255,220,${0.95 - pulse.t * 0.55})`;
      ctx.fill();
    }
  }

  function drawTechNodes() {
    for (const n of techNodes) {
      const a = 0.55 + 0.45 * Math.sin(n.pulse);
      const glo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
      glo.addColorStop(0, `hsla(${n.hue},100%,70%,${a * 0.3})`);
      glo.addColorStop(1, 'transparent');
      ctx.fillStyle = glo;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${n.hue},100%,80%,${a * 0.85 + 0.15})`;
      ctx.fill();
    }
  }

  // ── Background ────────────────────────────────────────────
  function drawBg() {
    const g = ctx.createRadialGradient(W * 0.5, H * 0.35, 0, W * 0.5, H * 0.6, Math.max(W, H) * 0.85);
    g.addColorStop(0,    '#0a1e12');
    g.addColorStop(0.45, '#050f09');
    g.addColorStop(1,    '#020706');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  // ── Water shimmer ─────────────────────────────────────────
  function drawShimmer() {
    const t = Date.now() * 0.00025;
    for (let i = 0; i < 7; i++) {
      const y = H * 0.08 + i * H * 0.14 + Math.sin(t + i * 1.3) * 9;
      ctx.fillStyle = 'rgba(0,180,90,0.028)';
      ctx.fillRect(0, y, W, 1.4);
    }
  }

  // ── Plankton ──────────────────────────────────────────────
  function drawPlankton() {
    for (const p of plankton) {
      p.phase += p.freq;
      p.x += p.vx + Math.sin(p.phase) * 0.14;
      p.y += p.vy;
      if (p.y < -12) { p.y = H + 12; p.x = Math.random() * W; }
      const a = p.alpha * (0.55 + 0.45 * Math.sin(p.phase * 2.3));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},75%,68%,${a})`;
      ctx.fill();
    }
  }

  // ── Draw a single fish ────────────────────────────────────
  function drawFish(f) {
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.scale(f.dir, 1); // flip for direction
    const s  = f.sz;
    const tw = Math.sin(f.tail) * 0.45;

    // soft glow halo
    const glo = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 2.2);
    glo.addColorStop(0, f.pal.glow);
    glo.addColorStop(1, 'transparent');
    ctx.fillStyle = glo;
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 2.2, s * 1.1, 0, 0, Math.PI * 2);
    ctx.fill();

    // body
    ctx.fillStyle = f.pal.body;
    ctx.beginPath();
    ctx.ellipse(0, 0, s, s * 0.44, 0, 0, Math.PI * 2);
    ctx.fill();

    // belly highlight
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath();
    ctx.ellipse(s * 0.1, s * 0.12, s * 0.52, s * 0.17, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // tail fan
    ctx.fillStyle = f.pal.fin;
    ctx.beginPath();
    ctx.moveTo(-s * 0.88, 0);
    ctx.lineTo(-s * 1.6, (-s * 0.52) + tw * s);
    ctx.lineTo(-s * 1.6, ( s * 0.52) + tw * s);
    ctx.closePath();
    ctx.fill();

    // dorsal fin
    ctx.fillStyle = f.pal.fin;
    ctx.beginPath();
    ctx.moveTo(-s * 0.05, -s * 0.44);
    ctx.quadraticCurveTo(s * 0.18, -s * 0.88, s * 0.42, -s * 0.44);
    ctx.closePath();
    ctx.fill();

    // pectoral fin
    ctx.beginPath();
    ctx.moveTo(s * 0.1, s * 0.15);
    ctx.quadraticCurveTo(s * 0.35, s * 0.62, s * 0.55, s * 0.28);
    ctx.closePath();
    ctx.fill();

    // eye
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(s * 0.56, -s * 0.1, s * 0.13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0a1408';
    ctx.beginPath();
    ctx.arc(s * 0.58, -s * 0.1, s * 0.07, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.arc(s * 0.61, -s * 0.14, s * 0.03, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // ── Update fish ───────────────────────────────────────────
  function updateFish(f) {
    f.tail    += 0.11;
    f.waveOff += f.waveFreq;

    // flee from mouse
    const mdx   = f.x - mouse.x;
    const mdy   = f.y - mouse.y;
    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
    if (mdist < 130) f.scared = 55;

    if (f.scared > 0) {
      f.scared--;
      const ang = Math.atan2(mdy, mdx);
      f.x += Math.cos(ang) * 3.5;
      f.y += Math.sin(ang) * 1.8;
      f.dir = Math.cos(ang) >= 0 ? 1 : -1;
    } else {
      f.x += f.dir * f.spd;
      f.y += Math.sin(f.waveOff) * 0.55;
    }

    // wrap
    if (f.x > W + 80) f.x = -80;
    if (f.x < -80)    f.x = W + 80;
    f.y = Math.max(40, Math.min(H - 40, f.y));
  }

  // ── Ripples ───────────────────────────────────────────────
  function drawRipples() {
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.r    += 2.8;
      r.alpha -= 0.014;
      if (r.alpha <= 0) { ripples.splice(i, 1); continue; }
      // outer ring (flattened ellipse — pond top-down perspective)
      ctx.beginPath();
      ctx.ellipse(r.x, r.y, r.r, r.r * 0.32, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0,200,110,${r.alpha})`;
      ctx.lineWidth = 1.3;
      ctx.stroke();
      // inner ring
      if (r.r > 18) {
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.r * 0.55, r.r * 0.55 * 0.32, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,200,110,${r.alpha * 0.45})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  // ── Tech ripple colours ───────────────────────────────────
  function techRippleColor(alpha) {
    return `rgba(0,200,255,${alpha})`;
  }
  function natureRippleColor(alpha) {
    return `rgba(0,200,110,${alpha})`;
  }

  // ── RAF loop ──────────────────────────────────────────────
  function loop() {
    const isTech = document.documentElement.dataset.theme === 'tech';
    if (isTech) {
      drawTechBg();
      drawTechGrid();
      updateTechNodes();
      drawTechEdgesAndPulses();
      drawTechNodes();
    } else {
      drawBg();
      drawShimmer();
      drawPlankton();
      for (const f of fishArr) { updateFish(f); drawFish(f); }
    }
    // draw ripples with theme-appropriate colour
    const rippleColor = isTech ? techRippleColor : natureRippleColor;
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.r    += 2.8;
      r.alpha -= 0.014;
      if (r.alpha <= 0) { ripples.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.ellipse(r.x, r.y, r.r, r.r * 0.32, 0, 0, Math.PI * 2);
      ctx.strokeStyle = rippleColor(r.alpha);
      ctx.lineWidth = 1.3;
      ctx.stroke();
      if (r.r > 18) {
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.r * 0.55, r.r * 0.55 * 0.32, 0, 0, Math.PI * 2);
        ctx.strokeStyle = rippleColor(r.alpha * 0.45);
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
    requestAnimationFrame(loop);
  }
  loop();

  // ── Events ────────────────────────────────────────────────
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (Math.random() < 0.04) ripples.push({ x: e.clientX, y: e.clientY, r: 2, alpha: 0.22 });
  });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
  canvas.style.pointerEvents = 'none'; // ensure content stays clickable
  document.addEventListener('click', e => {
    for (let i = 0; i < 3; i++)
      ripples.push({ x: e.clientX, y: e.clientY, r: i * 9, alpha: 0.65 - i * 0.15 });
  });
  window.addEventListener('resize', resize);
})();


/* ── 2. Typed text effect ───────────────────────────────────── */
(function initTyper() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Data Science Student @ IITM BS',
    'Teaching Assistant @ IITM BS',
    'Cyclist & Nature Adventurer',
    'Quantum Computing Enthusiast',
    'Cybersecurity Explorer',
    'Open-Source Builder',
    'Finance & AI Intersector',
  ];

  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const full = phrases[pi];
    el.textContent = deleting
      ? full.slice(0, ci--)
      : full.slice(0, ci++);

    let delay = deleting ? 42 : 72;

    if (!deleting && ci > full.length) {
      delay = 2000;
      deleting = true;
    } else if (deleting && ci < 0) {
      deleting = false;
      ci = 0;
      pi = (pi + 1) % phrases.length;
      delay = 400;
    }
    setTimeout(tick, delay);
  }
  tick();
})();


/* ── 3. Navbar scroll behaviour ─────────────────────────────── */
(function initNavbar() {
  const nav    = document.getElementById('navbar');
  const burger = document.getElementById('hamburger');
  const navMnu = document.querySelector('#navbar nav');

  // Scroll class
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    // close menu on scroll but keep theme toggle independent
    closeMenu();
  }, { passive: true });

  // Hamburger toggle
  function openMenu()  { navMnu.classList.add('open');  burger.classList.add('open');  }
  function closeMenu() { navMnu.classList.remove('open'); burger.classList.remove('open'); }

  burger.addEventListener('click', e => {
    e.stopPropagation();
    navMnu.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) closeMenu();
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    }
  }, { rootMargin: `-${Math.floor(window.innerHeight * 0.35)}px 0px -50% 0px` });

  sections.forEach(s => io.observe(s));
})();


/* ── 4. Scroll reveal ───────────────────────────────────────── */
(function initReveal() {
  const targets = [
    '.glass-card',
    '.section-title',
    '.contact-intro',
    '.hero-scroll-hint',
  ];

  // Add reveal class
  targets.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(i % 4) * 80}ms`;
    });
  });

  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();


/* ── 5. Theme toggle ─────────────────────────────────────────── */
(function initThemeToggle() {
  const btn  = document.getElementById('theme-toggle');
  const icon = btn && btn.querySelector('.toggle-icon');
  const html = document.documentElement;
  if (!btn) return;

  const ICONS  = { nature: '🌿', tech: '⚡' };
  const LABELS = { nature: 'Switch to Tech theme', tech: 'Switch to Nature theme' };

  function applyTheme(theme, save) {
    if (theme === 'tech') {
      html.dataset.theme = 'tech';
    } else {
      delete html.dataset.theme;
    }
    icon.textContent = ICONS[theme];
    btn.title        = LABELS[theme];
    btn.setAttribute('aria-label', LABELS[theme]);
    if (save) localStorage.setItem('ds-theme', theme);
  }

  // restore saved preference
  const saved = localStorage.getItem('ds-theme') || 'nature';
  applyTheme(saved, false);

  btn.addEventListener('click', () => {
    const current = html.dataset.theme === 'tech' ? 'tech' : 'nature';
    const next    = current === 'tech' ? 'nature' : 'tech';

    // spin animation
    btn.classList.add('spinning');
    setTimeout(() => btn.classList.remove('spinning'), 420);

    applyTheme(next, true);
  });
})();
