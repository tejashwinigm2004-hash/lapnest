import { useEffect, useRef } from 'react';
// Thin gold bar at the very top that fills as you scroll down the page.
export default function ScrollProgress() {
  const bar = useRef(null);
  useEffect(() => {
    let raf = 0;
    const upd = () => { raf = 0; const h = document.documentElement; if (bar.current) bar.current.style.transform = `scaleX(${h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)})`; };
    const on = () => { if (!raf) raf = requestAnimationFrame(upd); };
    on(); addEventListener('scroll', on, { passive: true }); addEventListener('resize', on);
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); };
  }, []);
  return <div aria-hidden="true" className="fixed top-0 inset-x-0 h-1 z-50 pointer-events-none"><div ref={bar} className="h-full bg-gold origin-left" style={{ transform: 'scaleX(0)' }} /></div>;
}