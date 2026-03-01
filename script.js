/* ============================================================
   Devam Shah — Portfolio  |  script.js
   Canvas particle background · typed text · nav · reveal
   ============================================================ */

'use strict';

/* ── 1. Canvas Particle Background ─────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');

  // -- Config --
  const CONFIG = {
    particleCount : 110,
    minRadius     : 1.2,
    maxRadius     : 3.2,
    speed         : 0.38,
    linkDist      : 145,
    mouseRadius   : 160,
    mouseForce    : 0.045,
    colors        : ['#00d4ff', '#7c3aed', '#06d6a0', '#a78bfa', '#38bdf8'],
    bgGradient    : ['#070711', '#0e0a1f'],
  };

  let W, H, particles = [];
  const mouse = { x: -9999, y: -9999 };

  // -- Resize --
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // -- Particle factory --
  function createParticle(x, y) {
    const color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
    const angle = Math.random() * Math.PI * 2;
    const speed = CONFIG.speed * (0.4 + Math.random() * 0.9);
    return {
      x  : x  ?? Math.random() * W,
      y  : y  ?? Math.random() * H,
      vx : Math.cos(angle) * speed,
      vy : Math.sin(angle) * speed,
      r  : CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius),
      color,
      alpha : 0.5 + Math.random() * 0.5,
      // subtle drift offset for organic feel
      drift : (Math.random() - 0.5) * 0.004,
    };
  }

  // -- Populate --
  function populate() {
    particles = [];
    for (let i = 0; i < CONFIG.particleCount; i++) {
      particles.push(createParticle());
    }
  }
  populate();

  // -- Background gradient --
  function drawBackground() {
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, CONFIG.bgGradient[0]);
    grad.addColorStop(1, CONFIG.bgGradient[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  // -- Parse hex to rgba helper --
  function hexAlpha(hex, a) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${a.toFixed(3)})`;
  }

  // -- Draw links between close particles --
  function drawLinks() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < CONFIG.linkDist) {
          const opacity = (1 - dist / CONFIG.linkDist) * 0.32;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = hexAlpha(a.color, opacity);
          ctx.lineWidth   = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  // -- Draw particles --
  function drawParticles() {
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = hexAlpha(p.color, p.alpha);
      ctx.fill();

      // glow
      const glow = ctx.createRadialGradient(p.x,p.y,0, p.x,p.y,p.r*4);
      glow.addColorStop(0, hexAlpha(p.color, 0.12));
      glow.addColorStop(1, hexAlpha(p.color, 0));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r*4, 0, Math.PI*2);
      ctx.fillStyle = glow;
      ctx.fill();
    }
  }

  // -- Update particle positions --
  function updateParticles() {
    for (const p of particles) {
      // Mouse repulsion
      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const mdist = Math.sqrt(mdx*mdx + mdy*mdy);
      if (mdist < CONFIG.mouseRadius && mdist > 0) {
        const force = (1 - mdist / CONFIG.mouseRadius) * CONFIG.mouseForce;
        p.vx += (mdx / mdist) * force;
        p.vy += (mdy / mdist) * force;
      }

      // Add organic drift
      p.vx += p.drift;
      p.vy += p.drift * 0.7;

      // Speed cap
      const spd = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
      const maxSpd = CONFIG.speed * 2.2;
      if (spd > maxSpd) {
        p.vx = (p.vx / spd) * maxSpd;
        p.vy = (p.vy / spd) * maxSpd;
      }

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges with a buffer
      const buf = 10;
      if (p.x < -buf) p.x = W + buf;
      if (p.x > W + buf) p.x = -buf;
      if (p.y < -buf) p.y = H + buf;
      if (p.y > H + buf) p.y = -buf;
    }
  }

  // -- Click burst --
  canvas.addEventListener('click', e => {
    for (let i = 0; i < 6; i++) particles.push(createParticle(e.clientX, e.clientY));
    // remove oldest if over limit
    while (particles.length > CONFIG.particleCount + 30) particles.shift();
  });

  // -- RAF loop --
  function loop() {
    drawBackground();
    drawLinks();
    drawParticles();
    updateParticles();
    requestAnimationFrame(loop);
  }
  loop();

  // -- Mouse tracking --
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });
  // Repopulate on resize so no big gaps
  window.addEventListener('resize', populate);
})();


/* ── 2. Typed text effect ───────────────────────────────────── */
(function initTyper() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Data Science Student @ IITM BS',
    'Teaching Assistant @ IITM BS',
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
