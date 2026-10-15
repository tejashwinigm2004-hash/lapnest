import { useEffect, useRef } from 'react';
// A CSS 3D laptop that slowly swings, now with an interactive background: a warm glow follows the cursor/finger and soft dots drift and move away from it. No libraries.
export default function Laptop3D({ className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const colors = ['184,134,59', '139,58,30', '198,160,100'];
    const ptr = { x: 0, y: 0, on: false };
    let w = 0, h = 0, gx = 0, gy = 0, ga = 0, raf = 0, visible = true, dots = [];
    const make = () => {
      const n = w < 500 ? 22 : 40;
      dots = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h, r: 2 + Math.random() * 4,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        c: colors[Math.floor(Math.random() * colors.length)], a: 0.25 + Math.random() * 0.35,
      }));
    };
    const size = () => {
      const r = cv.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height; cv.width = w * d; cv.height = h * d;
      ctx.setTransform(d, 0, 0, d, 0, 0); gx = w / 2; gy = h / 2; make();
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      gx += (ptr.x - gx) * 0.12; gy += (ptr.y - gy) * 0.12; ga += ((ptr.on ? 1 : 0) - ga) * 0.08;
      if (ga > 0.01) {
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, 170);
        g.addColorStop(0, `rgba(212,160,70,${0.30 * ga})`); g.addColorStop(1, 'rgba(212,160,70,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      }
      for (const p of dots) {
        if (!still) {
          const dx = p.x - ptr.x, dy = p.y - ptr.y, d = Math.hypot(dx, dy);
          if (ptr.on && d < 120 && d > 0) { p.x += (dx / d) * (120 - d) * 0.05; p.y += (dy / d) * (120 - d) * 0.05; }
          p.x += p.vx; p.y += p.vy;
          if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;
        }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.a})`; ctx.fill();
      }
    };
    const loop = () => { if (visible) draw(); raf = requestAnimationFrame(loop); };
    const move = e => {
      const r = cv.getBoundingClientRect();
      ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top;
      ptr.on = ptr.x >= 0 && ptr.y >= 0 && ptr.x <= r.width && ptr.y <= r.height;
    };
    const leave = () => { ptr.on = false; };
    size(); draw();
    if (!still) raf = requestAnimationFrame(loop);
    const ro = new ResizeObserver(size); ro.observe(cv);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(cv);
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', leave); document.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', leave); document.removeEventListener('pointerleave', leave);
    };
  }, []);
  return <div aria-hidden="true" className={`l3d ${className}`}>
    <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
    <div className="l3d-s">
      <div className="l3d-base"><i /></div>
      <div className="l3d-lid"><div className="l3d-screen"><b>LapNest</b><span /></div><div className="l3d-back" /></div></div><div className="l3d-shadow" /></div>;
}