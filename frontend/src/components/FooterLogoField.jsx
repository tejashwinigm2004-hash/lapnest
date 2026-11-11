import { useEffect, useRef } from 'react';
import logoData from './logoData';

// Full-width animated logo made of particles.
// - assembles from scattered particles the first time it scrolls into view
// - breathes gently while idle, with a bright scan sweeping across every few seconds
// - the cursor pushes particles aside; click or tap scatters them and they spring back
// Props: src = logo image (defaults to the embedded Hyperlap logo), height = fixed height in px (default: about 85% of the screen height).
export default function FooterLogoField({ src = logoData, height }) {
  const wrap = useRef(null), cv = useRef(null);

  useEffect(() => {
    const canvas = cv.current, ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const MAX = 9000;
    let W = 0, H = 0, R = 120, dpr = 1, parts = [], raf = 0, visible = true, alive = true, seen = false;
    let scanning = false, scan = 0, x0 = 0, x1 = 0, nextScan = performance.now() + 1500, last = performance.now();
    const ptr = { x: -999, y: -999 };
    const img = new Image();

    const sample = (data, step) => {
      const out = [];
      for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) {
        const i = (y * W + x) * 4;
        let r = data[i], g = data[i + 1], b = data[i + 2];
        // skip transparent pixels and the white JPEG background (the white "H" becomes empty space)
        if (data[i + 3] > 140 && Math.min(r, g, b) < 225) {
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (lum < 70) { // lift dark navy a little so it stays visible on the dark footer
            const t = ((70 - lum) / 70) * 0.55;
            r += (255 - r) * t; g += (255 - g) * t; b += (255 - b) * t;
          }
          out.push({ hx: x, hy: y, c: `rgb(${r | 0},${g | 0},${b | 0})` });
        }
      }
      return out;
    };

    const scatterRandom = () => parts.forEach(p => { p.x = Math.random() * W; p.y = Math.random() * H; p.vx = p.vy = 0; });

    const build = () => {
      W = Math.floor(wrap.current.clientWidth);
      H = height || Math.round(Math.min(Math.max(window.innerHeight * 0.85, 420), 760));
      R = Math.max(90, Math.min(W, H) * 0.16);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      parts = [];
      if (!img.naturalWidth) return;

      const o = document.createElement('canvas'); o.width = W; o.height = H;
      const oc = o.getContext('2d', { willReadFrequently: true });
      const s = Math.min((W * 0.9) / img.width, (H * 0.9) / img.height);
      const dw = img.width * s, dh = img.height * s;
      oc.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);

      try {
        const data = oc.getImageData(0, 0, W, H).data;
        let step = 2, pts = sample(data, step);
        if (pts.length > MAX) { step = Math.ceil(step * Math.sqrt(pts.length / MAX)); pts = sample(data, step); }
        parts = pts.map(p => ({ ...p, s: Math.max(1.6, step * 0.75), x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0 }));
        x0 = Math.min(...pts.map(p => p.hx)); x1 = Math.max(...pts.map(p => p.hx));
        if (reduce) parts.forEach(p => { p.x = p.hx; p.y = p.hy; });
      } catch { parts = []; }
    };

    const draw = now => {
      const dt = Math.min((now - last) / 16.7, 3); last = now;
      ctx.clearRect(0, 0, W, H);
      if (!reduce) {
        if (!scanning && now > nextScan) { scanning = true; scan = x0 - 60; }
        if (scanning) { scan += ((x1 - x0 + 120) / 100) * dt; if (scan > x1 + 60) { scanning = false; nextScan = now + 5000; } }
      }
      const band = Math.max(50, (x1 - x0) * 0.08);
      for (const p of parts) {
        if (!reduce) {
          const tx = p.hx + Math.sin(now * 0.0012 + p.hy * 0.02) * 1.3; // idle breathing
          const ty = p.hy + Math.cos(now * 0.001 + p.hx * 0.02) * 1.3;
          const dx = p.x - ptr.x, dy = p.y - ptr.y, d2 = dx * dx + dy * dy;
          if (d2 < R * R && d2 > 0.01) {
            const d = Math.sqrt(d2), f = (1 - d / R) * 2.4;
            p.vx += (dx / d) * f; p.vy += (dy / d) * f;
          }
          p.vx += (tx - p.x) * 0.05 * dt; p.vy += (ty - p.y) * 0.05 * dt;
          const damp = Math.pow(0.85, dt);
          p.vx *= damp; p.vy *= damp; p.x += p.vx * dt; p.y += p.vy * dt;
        }
        const sd = Math.abs(p.hx - scan), lift = scanning && sd < band ? 1 - sd / band : 0;
        ctx.fillStyle = lift > 0.05 ? '#ffffff' : p.c;
        ctx.fillRect(p.x, p.y - lift * 10, p.s + lift * 1.5, p.s + lift * 1.5);
      }
    };

    const loop = now => { if (!alive) return; draw(now); raf = visible && !reduce ? requestAnimationFrame(loop) : 0; };
    const start = () => { if (!raf && alive) { last = performance.now(); raf = requestAnimationFrame(loop); } };

    const pos = e => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const onMove = e => { [ptr.x, ptr.y] = pos(e); };
    const onLeave = () => { ptr.x = ptr.y = -999; };
    const onDown = e => {
      if (reduce) return;
      const [px, py] = pos(e), k = Math.min(Math.max(W / 900, 1), 2);
      for (const p of parts) {
        const dx = p.x - px, dy = p.y - py, d = Math.hypot(dx, dy) || 1;
        const f = (4 + Math.random() * 14) * k * Math.max(0.35, 1 - d / (W * 0.8));
        p.vx += (dx / d) * f + (Math.random() - 0.5) * 4; p.vy += (dy / d) * f + (Math.random() - 0.5) * 4;
      }
      start();
    };

    const ro = new ResizeObserver(() => { if (wrap.current && wrap.current.clientWidth !== W) { build(); start(); if (reduce) draw(performance.now()); } });
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) { if (!seen && !reduce) { seen = true; scatterRandom(); } start(); } // assemble when first scrolled into view
    }, { threshold: 0.15 });

    img.onload = () => { build(); ro.observe(wrap.current); io.observe(wrap.current); start(); if (reduce) draw(performance.now()); };
    img.onerror = () => console.warn('FooterLogoField: could not load the logo image');
    img.src = src;

    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointerdown', onDown);
    return () => {
      alive = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerdown', onDown);
    };
  }, [src, height]);

  return <div ref={wrap} className="relative w-full overflow-hidden border-t border-white/15">
    <canvas ref={cv} role="img" aria-label="Animated company logo" className="block w-full cursor-crosshair" style={{ touchAction: 'pan-y' }} />
    <p aria-hidden="true" className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-slate-400 pointer-events-none">Move your cursor through the logo. Tap to scatter.</p>
  </div>;
}