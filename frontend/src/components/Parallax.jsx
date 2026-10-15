import { useEffect, useRef } from 'react';
// Moves its content a little slower than the page scrolls. Switched off on phones and for people who prefer reduced motion.
export default function Parallax({ speed = 0.15, className = '', children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches || innerWidth < 768) return;
    let raf = 0;
    const tick = () => { raf = 0; const r = el.getBoundingClientRect(); el.style.transform = `translate3d(0,${(-(r.top + r.height / 2 - innerHeight / 2) * speed).toFixed(1)}px,0)`; };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    on(); addEventListener('scroll', on, { passive: true }); addEventListener('resize', on);
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, [speed]);
  return <div ref={ref} className={`will-change-transform ${className}`}>{children}</div>;
}