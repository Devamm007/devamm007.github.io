/* ============================================================
   Devam Shah — Portfolio  |  script.js
   Canvas background · typed text · nav · reveal · theme
   ============================================================ */

'use strict';

/* ── 1. Canvas Background ───────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  const mouse   = { x: -9999, y: -9999 };
  const ripples = [];
  let frameCount = 0;

  /* ── Koi fish colour palettes ─────────────────────── */
  const PALETTES = [
    { body: '#f59e0b', fin: '#b45309', glow: 'rgba(245,158,11,0.28)' },
    { body: '#f87171', fin: '#b91c1c', glow: 'rgba(248,113,113,0.22)' },
    { body: '#4ade80', fin: '#16a34a', glow: 'rgba(74,222,128,0.22)' },
    { body: '#60a5fa', fin: '#2563eb', glow: 'rgba(96,165,250,0.22)' },
    { body: '#e879f9', fin: '#a21caf', glow: 'rgba(232,121,249,0.18)' },
  ];

  /* ── Resize handler ───────────────────────────────── */
  let mathSymbols, lilyPads, fireflies;

  /* Scale particle counts based on viewport area */
  function scaledCount(base, min) {
    const area = W * H;
    const ref  = 1920 * 1080;          // reference desktop area
    return Math.max(min, Math.round(base * Math.sqrt(area / ref)));
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    if (mathSymbols) {
      mathSymbols.forEach(s => {
        s.x = Math.min(s.x, W - 1);
        s.y = Math.min(s.y, H - 1);
      });
    }
    if (lilyPads) {
      lilyPads.forEach(l => {
        l.x = Math.min(l.x, W - 10);
        l.y = Math.min(l.y, H * 0.3);
      });
    }
  }
  window.addEventListener('resize', resize);
  resize();

  /* ═══════════════════════════════════════════════════════
     NATURE THEME — Pond with koi, plankton, caustics,
     lily pads, fireflies, sunbeams
     ═══════════════════════════════════════════════════════ */

  /* ── Plankton particles ───────────────────────────── */
  function mkPlankton() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.6 + Math.random() * 2.0,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -(0.06 + Math.random() * 0.18),
      hue: 130 + Math.random() * 65,
      alpha: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      freq: 0.006 + Math.random() * 0.016,
    };
  }
  const plankton = Array.from({ length: scaledCount(55, 15) }, mkPlankton);

  /* ── Fireflies (surface glow) ─────────────────────── */
  function mkFirefly() {
    return {
      x: Math.random() * W,
      y: Math.random() * H * 0.35,
      r: 1.2 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.12,
      phase: Math.random() * Math.PI * 2,
      freq: 0.01 + Math.random() * 0.02,
      hue: 50 + Math.random() * 80,
    };
  }
  fireflies = Array.from({ length: scaledCount(18, 6) }, mkFirefly);

  /* ── Lily pads ────────────────────────────────────── */
  function mkLilyPad() {
    return {
      x: Math.random() * W,
      y: 30 + Math.random() * H * 0.18,
      r: 14 + Math.random() * 22,
      rot: Math.random() * Math.PI * 2,
      phase: Math.random() * Math.PI * 2,
      freq: 0.003 + Math.random() * 0.005,
      drift: (Math.random() - 0.5) * 0.04,
    };
  }
  lilyPads = Array.from({ length: scaledCount(5, 2) }, mkLilyPad);

  /* ── Fish (koi) ───────────────────────────────────── */
  function mkFish() {
    const pal     = PALETTES[Math.floor(Math.random() * PALETTES.length)];
    const goRight = Math.random() < 0.5;
    const sizeScale = Math.min(W, H) / 900;
    return {
      x: goRight ? -60 : W + 60,
      y: 0.15 * H + Math.random() * 0.7 * H,
      sz: (13 + Math.random() * 17) * Math.max(0.6, sizeScale),
      spd: 0.45 + Math.random() * 0.65,
      dir: goRight ? 1 : -1,
      waveOff: Math.random() * Math.PI * 2,
      waveFreq: 0.006 + Math.random() * 0.01,
      tail: Math.random() * Math.PI * 2,
      scared: 0,
      pal,
    };
  }
  const fishArr = Array.from({ length: scaledCount(8, 3) }, mkFish);

  /* ── Nature background (deep pond gradient) ──────── */
  function drawNatureBg() {
    const g = ctx.createRadialGradient(
      W * 0.5, H * 0.35, 0,
      W * 0.5, H * 0.6, Math.max(W, H) * 0.85
    );
    g.addColorStop(0, '#0a1e12');
    g.addColorStop(0.3, '#071810');
    g.addColorStop(0.6, '#050f09');
    g.addColorStop(1, '#020706');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  /* ── Water caustic light patterns ─────────────────── */
  function drawCaustics() {
    const t = Date.now() * 0.0003;
    const scale = Math.min(W, H) / 900;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 6; i++) {
      const cx = W * (0.15 + 0.7 * ((Math.sin(t * 0.7 + i * 1.8) + 1) / 2));
      const cy = H * (0.1 + 0.5 * ((Math.cos(t * 0.5 + i * 2.4) + 1) / 2));
      const r  = (80 + 60 * Math.sin(t + i * 1.1)) * scale;
      const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, 'rgba(0,200,120,0.035)');
      g.addColorStop(0.5, 'rgba(0,180,100,0.018)');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    }
    ctx.restore();
  }

  /* ── Underwater sunbeam rays ──────────────────────── */
  function drawSunbeams() {
    const t = Date.now() * 0.00015;
    const scale = Math.min(W, H) / 900;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 4; i++) {
      const x   = W * (0.2 + i * 0.2) + Math.sin(t + i) * 30 * scale;
      const w   = (18 + 12 * Math.sin(t * 1.3 + i * 0.9)) * scale;
      const a   = 0.018 + 0.012 * Math.sin(t * 2 + i * 1.5);
      const g   = ctx.createLinearGradient(x, 0, x + w * 0.6, H * 0.7);
      g.addColorStop(0, `rgba(120,255,180,${a})`);
      g.addColorStop(0.4, `rgba(60,200,130,${a * 0.5})`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x - w, 0);
      ctx.lineTo(x + w, 0);
      ctx.lineTo(x + w * 0.3, H * 0.7);
      ctx.lineTo(x - w * 0.3, H * 0.7);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  /* ── Water surface shimmer ────────────────────────── */
  function drawShimmer() {
    const t = Date.now() * 0.00025;
    ctx.save();
    for (let i = 0; i < 8; i++) {
      const y = H * 0.06 + i * H * 0.12 + Math.sin(t + i * 1.3) * 7;
      const a = 0.02 + 0.015 * Math.sin(t * 1.5 + i * 0.8);
      ctx.fillStyle = `rgba(0,180,90,${a})`;
      ctx.fillRect(0, y, W, 1.2);
    }
    ctx.restore();
  }

  /* ── Plankton drawing & update ────────────────────── */
  function drawPlankton() {
    for (const p of plankton) {
      p.phase += p.freq;
      p.x += p.vx + Math.sin(p.phase) * 0.12;
      p.y += p.vy;
      if (p.y < -12) { p.y = H + 12; p.x = Math.random() * W; }
      if (p.x < -12) p.x = W + 12;
      if (p.x > W + 12) p.x = -12;
      const a = p.alpha * (0.5 + 0.5 * Math.sin(p.phase * 2.3));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},75%,68%,${a})`;
      ctx.fill();
    }
  }

  /* ── Firefly drawing & update ─────────────────────── */
  function drawFireflies() {
    for (const f of fireflies) {
      f.phase += f.freq;
      f.x += f.vx + Math.sin(f.phase * 0.8) * 0.08;
      f.y += f.vy + Math.cos(f.phase * 0.6) * 0.06;
      if (f.x < -20) f.x = W + 20;
      if (f.x > W + 20) f.x = -20;
      if (f.y < -20) f.y = H * 0.35;
      if (f.y > H * 0.4) f.y = -10;
      const pulse = 0.3 + 0.7 * Math.pow(Math.sin(f.phase), 2);
      // Outer glow
      const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 5);
      grd.addColorStop(0, `hsla(${f.hue},80%,75%,${0.12 * pulse})`);
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(f.x - f.r * 5, f.y - f.r * 5, f.r * 10, f.r * 10);
      // Core
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${f.hue},85%,80%,${0.6 * pulse})`;
      ctx.fill();
    }
  }

  /* ── Lily pad drawing & update ────────────────────── */
  function drawLilyPads() {
    for (const l of lilyPads) {
      l.phase += l.freq;
      l.x += l.drift + Math.sin(l.phase) * 0.03;
      l.y += Math.cos(l.phase * 0.7) * 0.02;
      if (l.x < -l.r * 2) l.x = W + l.r;
      if (l.x > W + l.r * 2) l.x = -l.r;

      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.rot + Math.sin(l.phase * 0.3) * 0.05);

      // Shadow
      ctx.beginPath();
      ctx.ellipse(2, 2, l.r, l.r * 0.55, 0, 0.15, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fill();

      // Pad body
      ctx.beginPath();
      ctx.ellipse(0, 0, l.r, l.r * 0.55, 0, 0.15, Math.PI * 2);
      ctx.fillStyle = 'rgba(20,90,40,0.35)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(40,140,60,0.25)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Vein line
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(l.r * 0.7, 0);
      ctx.strokeStyle = 'rgba(50,160,70,0.2)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.restore();
    }
  }

  /* ── Fish drawing (detailed koi) ──────────────────── */
  function drawFish(f) {
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.scale(f.dir, 1);
    const s = f.sz;
    const tw = Math.sin(f.tail) * 0.45;

    // Underwater glow (bioluminescent halo)
    const glo = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 2.4);
    glo.addColorStop(0, f.pal.glow);
    glo.addColorStop(1, 'transparent');
    ctx.fillStyle = glo;
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 2.4, s * 1.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = f.pal.body;
    ctx.beginPath();
    ctx.ellipse(0, 0, s, s * 0.44, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body highlight
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath();
    ctx.ellipse(s * 0.1, -s * 0.12, s * 0.52, s * 0.17, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Tail fin
    ctx.fillStyle = f.pal.fin;
    ctx.beginPath();
    ctx.moveTo(-s * 0.88, 0);
    ctx.lineTo(-s * 1.6, (-s * 0.52) + tw * s);
    ctx.lineTo(-s * 1.6, (s * 0.52) + tw * s);
    ctx.closePath();
    ctx.fill();

    // Dorsal fin
    ctx.beginPath();
    ctx.moveTo(-s * 0.05, -s * 0.44);
    ctx.quadraticCurveTo(s * 0.18, -s * 0.88, s * 0.42, -s * 0.44);
    ctx.closePath();
    ctx.fill();

    // Pectoral fin
    ctx.beginPath();
    ctx.moveTo(s * 0.1, s * 0.15);
    ctx.quadraticCurveTo(s * 0.35, s * 0.62, s * 0.55, s * 0.28);
    ctx.closePath();
    ctx.fill();

    // Eye white
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(s * 0.56, -s * 0.1, s * 0.13, 0, Math.PI * 2);
    ctx.fill();

    // Eye pupil
    ctx.fillStyle = '#0a1408';
    ctx.beginPath();
    ctx.arc(s * 0.58, -s * 0.1, s * 0.07, 0, Math.PI * 2);
    ctx.fill();

    // Eye glint
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.arc(s * 0.61, -s * 0.14, s * 0.03, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /* ── Fish AI (movement, fear response) ────────────── */
  function updateFish(f) {
    f.tail += 0.11;
    f.waveOff += f.waveFreq;

    const mdx = f.x - mouse.x;
    const mdy = f.y - mouse.y;
    const dist = Math.sqrt(mdx * mdx + mdy * mdy);

    if (dist < 130) f.scared = 55;

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

    if (f.x > W + 80) f.x = -80;
    if (f.x < -80)    f.x = W + 80;
    f.y = Math.max(40, Math.min(H - 40, f.y));
  }


  /* ═══════════════════════════════════════════════════════
     MATH THEME — Floating symbols, dot grid,
     constellation lines, pulsing nodes, depth layers
     ═══════════════════════════════════════════════════════ */

  const MATH_CHARS = [
    '\u03b1','\u03b2','\u03b3','\u03b4','\u03b5','\u03b6','\u03b7','\u03b8',
    '\u03bb','\u03bc','\u03c0','\u03c3','\u03c4','\u03c6','\u03c8','\u03c9',
    '\u2207','\u222b','\u2211','\u2202','\u221e','\u2208','\u2295','\u2297',
    '\u2261','\u2248','\u2192','\u27f9','\u2200','\u2203',
    '\u211d','\u2102','\u2115','\u2124','\u0394',
    'O(n)','P(A|B)','\u0065\u02e3','ln x',
    'det(A)','\u2207\u00b2f','\u03c3(x)','\u03a3\u1d62',
    '\u03c6(n)','f\'(x)','\u2202/\u2202x',
  ];

  function mkMathSymbol() {
    const depth = 0.3 + Math.random() * 0.7;
    const sizeScale = Math.min(W, H) / 900;
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.1 * depth,
      vy: (Math.random() - 0.5) * 0.1 * depth,
      text: MATH_CHARS[Math.floor(Math.random() * MATH_CHARS.length)],
      size: (10 + Math.random() * 22) * depth * Math.max(0.6, sizeScale),
      alpha: (0.06 + Math.random() * 0.16) * depth,
      phase: Math.random() * Math.PI * 2,
      freq: 0.002 + Math.random() * 0.006,
      depth,
      szOff: 0.6 + Math.random() * 0.8,
    };
  }
  mathSymbols = Array.from({ length: scaledCount(110, 30) }, mkMathSymbol);

  /* ── Math background (dark obsidian) ──────────────── */
  function drawMathBg() {
    const g = ctx.createRadialGradient(
      W * 0.5, H * 0.4, 0,
      W * 0.5, H * 0.6, Math.max(W, H) * 0.9
    );
    g.addColorStop(0, '#0c0d18');
    g.addColorStop(0.35, '#090a14');
    g.addColorStop(0.7, '#070810');
    g.addColorStop(1, '#04050c');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  /* ── Dot grid (graph paper with pulse) ────────────── */
  function drawDotGrid() {
    const spacing = 34;
    const t = Date.now() * 0.0002;
    for (let x = spacing / 2; x < W; x += spacing) {
      for (let y = spacing / 2; y < H; y += spacing) {
        const d = Math.sqrt(
          Math.pow(x - W * 0.5, 2) + Math.pow(y - H * 0.5, 2)
        );
        const pulse = 0.06 + 0.04 * Math.sin(t * 2 + d * 0.003);
        ctx.beginPath();
        ctx.arc(x, y, 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,168,98,${pulse})`;
        ctx.fill();
      }
    }
  }

  /* ── Ambient math glow (soft warmth) ──────────────── */
  function drawMathAmbient() {
    const t = Date.now() * 0.0002;
    const scale = Math.min(W, H) / 900;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const g1 = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, W * 0.5);
    g1.addColorStop(0, `rgba(196,168,98,${0.015 + 0.008 * Math.sin(t)})`);
    g1.addColorStop(1, 'transparent');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 3; i++) {
      const cx = W * (0.1 + 0.4 * i);
      const cy = H * (0.2 + 0.3 * Math.sin(t * 0.8 + i * 2));
      const r  = (100 + 50 * Math.sin(t + i)) * scale;
      const g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g2.addColorStop(0, 'rgba(138,148,200,0.012)');
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    }
    ctx.restore();
  }

  /* ── Math symbol update ───────────────────────────── */
  function updateMathSymbols() {
    for (const s of mathSymbols) {
      s.phase += s.freq;
      s.x += s.vx + Math.sin(s.phase * 0.7) * 0.04 * s.depth;
      s.y += s.vy + Math.cos(s.phase * 0.5) * 0.04 * s.depth;
      if (s.x < -60)    s.x = W + 40;
      if (s.x > W + 60) s.x = -40;
      if (s.y < -60)    s.y = H + 40;
      if (s.y > H + 60) s.y = -40;
    }
  }

  /* ── Math symbol drawing ──────────────────────────── */
  function drawMathSymbols() {
    for (const s of mathSymbols) {
      const pulse = 0.6 + 0.4 * Math.sin(s.phase);
      const a     = s.alpha * pulse;
      const sz    = s.size * (1 + (s.szOff - 0.7) * 0.06 * Math.sin(s.phase * 0.65));
      ctx.save();
      ctx.font = `${sz}px 'Cormorant Garamond', Georgia, serif`;
      ctx.fillStyle = `rgba(196,168,98,${a})`;
      ctx.fillText(s.text, s.x, s.y);
      ctx.restore();
    }
  }

  /* ── Constellation lines between nearby symbols ───── */
  function drawConstellations() {
    const maxDist = Math.max(60, 120 * Math.min(W, H) / 900);
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < mathSymbols.length; i++) {
      const a = mathSymbols[i];
      for (let j = i + 1; j < Math.min(i + 12, mathSymbols.length); j++) {
        const b = mathSymbols[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < maxDist && d > 10) {
          const alpha = (1 - d / maxDist) * 0.06 * Math.min(a.depth, b.depth);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y - a.size * 0.3);
          ctx.lineTo(b.x, b.y - b.size * 0.3);
          ctx.strokeStyle = `rgba(196,168,98,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  }

  /* ── Pulsing node dots at symbol positions ────────── */
  function drawSymbolNodes() {
    const t = Date.now() * 0.001;
    ctx.save();
    for (let i = 0; i < mathSymbols.length; i += 4) {
      const s = mathSymbols[i];
      const pulse = 0.3 + 0.7 * Math.pow(Math.sin(t + s.phase), 2);
      const r = 1.5 * s.depth * pulse;
      const grd = ctx.createRadialGradient(
        s.x, s.y - s.size * 0.3, 0,
        s.x, s.y - s.size * 0.3, r * 6
      );
      grd.addColorStop(0, `rgba(196,168,98,${0.1 * pulse * s.depth})`);
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(
        s.x - r * 6, s.y - s.size * 0.3 - r * 6,
        r * 12, r * 12
      );
    }
    ctx.restore();
  }

  /* ── Ripple colour helpers ────────────────────────── */
  function natureRippleColor(a) { return `rgba(0,200,110,${a})`; }
  function mathRippleColor(a)   { return `rgba(196,168,98,${a})`; }

  /* ── Main animation loop ──────────────────────────── */
  function loop() {
    frameCount++;
    const isTech = document.documentElement.dataset.theme === 'tech';

    if (isTech) {
      drawMathBg();
      drawMathAmbient();
      drawDotGrid();
      updateMathSymbols();
      drawConstellations();
      drawMathSymbols();
      drawSymbolNodes();
    } else {
      drawNatureBg();
      drawSunbeams();
      drawCaustics();
      drawShimmer();
      drawLilyPads();
      drawPlankton();
      drawFireflies();
      for (const f of fishArr) {
        updateFish(f);
        drawFish(f);
      }
    }

    // Ripples (theme-aware)
    const rippleColor = isTech ? mathRippleColor : natureRippleColor;
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.r += 2.8;
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

  /* ── User interaction events ──────────────────────── */
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (Math.random() < 0.04) {
      ripples.push({ x: e.clientX, y: e.clientY, r: 2, alpha: 0.22 });
    }
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  canvas.style.pointerEvents = 'none';

  document.addEventListener('click', e => {
    for (let i = 0; i < 3; i++) {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        r: i * 9,
        alpha: 0.65 - i * 0.15,
      });
    }
  });
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
    el.textContent = deleting ? full.slice(0, ci--) : full.slice(0, ci++);
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


/* ── 3. Navbar ──────────────────────────────────────────────── */
(function initNavbar() {
  const nav    = document.getElementById('navbar');
  const burger = document.getElementById('hamburger');
  const navMnu = document.querySelector('#navbar nav');
  if (!nav || !burger || !navMnu) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    /* Only close if actually open — avoids needless DOM thrash on every scroll */
    if (navMnu.classList.contains('open')) closeMenu();
  }, { passive: true });

  function openMenu()  { navMnu.classList.add('open');    burger.classList.add('open'); }
  function closeMenu() { navMnu.classList.remove('open'); burger.classList.remove('open'); }

  burger.addEventListener('click', e => {
    e.stopPropagation();
    navMnu.classList.contains('open') ? closeMenu() : openMenu();
  });

  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) closeMenu();
  });

  /* Smooth-scroll anchor links via JS (CSS smooth-scroll disabled on touch) */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        closeMenu();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', id);
      }
    });
  });

  // Active link: page-based + in-page scroll
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (!href.startsWith('#') && !href.startsWith('index.html#')) {
      const targetPage = href.split('#')[0] || 'index.html';
      if (targetPage === currentPage ||
          (currentPage === '' && targetPage === 'index.html')) {
        link.classList.add('active');
      }
    }
  });

  // In-page section tracking (only if sections exist in DOM)
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  if (sections.length === 0) return;

  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) {
        links.forEach(l => {
          const h = l.getAttribute('href') || '';
          if (h.startsWith('#')) l.classList.remove('active');
        });
        const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    }
  }, {
    rootMargin: `-${Math.floor(window.innerHeight * 0.35)}px 0px -50% 0px`,
  });

  sections.forEach(s => io.observe(s));
})();


/* ── 4. Scroll reveal ───────────────────────────────────────── */
(function initReveal() {
  const selectors = [
    '.glass-card',
    '.section-title',
    '.contact-intro',
    '.hero-scroll-hint',
    '.page-hero-title',
    '.page-hero-sub',
  ];

  selectors.forEach(sel => {
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


/* ── 5. Theme toggle ───────────────────────────────────────── */
(function initThemeToggle() {
  const btn  = document.getElementById('theme-toggle');
  const icon = btn && btn.querySelector('.toggle-icon');
  const html = document.documentElement;
  if (!btn || !icon) return;

  const ICONS  = { nature: '\uD83C\uDF3F', tech: '\u2211' };
  const LABELS = { nature: 'Switch to Math theme', tech: 'Switch to Nature theme' };

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

  const saved = localStorage.getItem('ds-theme') || 'nature';
  applyTheme(saved, false);

  btn.addEventListener('click', () => {
    const current = html.dataset.theme === 'tech' ? 'tech' : 'nature';
    const next    = current === 'tech' ? 'nature' : 'tech';
    btn.classList.add('spinning');
    setTimeout(() => btn.classList.remove('spinning'), 420);
    applyTheme(next, true);
  });
})();


/* ── 6. "?sent=1" thank-you toast ───────────────────────────── */
(function initFormToast() {
  if (!window.location.search.includes('sent=1')) return;

  const toast = document.createElement('div');
  toast.className = 'form-toast';
  toast.textContent = '\u2714  Message sent \u2014 I\'ll be in touch soon!';
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('toast-visible'));

  setTimeout(() => {
    toast.classList.remove('toast-visible');
    setTimeout(() => toast.remove(), 500);
    history.replaceState({}, '', window.location.pathname);
  }, 4500);
})();


/* ── 7. Contact form — purpose dropdown ─────────────────────── */
(function initPurposeSelect() {
  /* Works across all 3 pages regardless of element-id prefix */
  const form          = document.getElementById('contact-form');
  const hiddenSubject = document.getElementById('hidden-subject');
  if (!form || !hiddenSubject) return;

  /* Find the purpose <select> — id varies per page (f-purpose / fi-purpose / fl-purpose) */
  const purposeSelect    = form.querySelector('select[id$="-purpose"]');
  const customGroup      = form.querySelector('.form-custom-purpose') ||
                           document.getElementById('custom-purpose-group');
  const customInput      = form.querySelector('.form-custom-input')  ||
                           document.getElementById('f-custom-purpose');
  if (!purposeSelect) return;

  purposeSelect.addEventListener('change', function () {
    if (this.value === 'other') {
      if (customGroup)  customGroup.style.display = 'block';
      if (customInput)  customInput.setAttribute('required', 'true');
    } else {
      if (customGroup)  customGroup.style.display = 'none';
      if (customInput) { customInput.removeAttribute('required'); customInput.value = ''; }
      hiddenSubject.value = this.value;
    }
  });

  form.addEventListener('submit', function () {
    if (purposeSelect.value === 'other' && customInput) {
      hiddenSubject.value = 'Portfolio Contact \u2014 ' + (customInput.value || 'Other');
    }
  });
})();
