import { useEffect, useRef } from 'react'; import { Link, useLocation } from 'react-router-dom'; import { Home, Laptop, ShoppingCart, CircleUser, Phone, MessageCircle } from 'lucide-react'; import { biz, wa } from '../config'; import { useApp } from '../context/AppContext';
const CSS = `@keyframes fsIn{from{opacity:0;transform:translateX(90px)}to{opacity:1;transform:translateX(0)}}
@keyframes fsFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes fsPulse{0%{box-shadow:0 0 0 0 rgba(217,72,15,.45)}70%,100%{box-shadow:0 0 0 14px rgba(217,72,15,0)}}
@keyframes fsRing{0%,84%,100%{transform:rotate(0)}86%{transform:rotate(-16deg)}88%{transform:rotate(16deg)}90%{transform:rotate(-12deg)}92%{transform:rotate(12deg)}94%{transform:rotate(-6deg)}96%{transform:rotate(6deg)}}
.fs-pill{animation:fsIn .8s ease-out both,fsFloat 3.5s ease-in-out .8s infinite}
.fs-pulse{animation:fsPulse 2s ease-out infinite}.fs-pulse2{animation-delay:1s}
.fs-ring{display:grid;place-items:center;animation:fsRing 4s ease-in-out infinite}
.fs-pill:hover,.fs-pill:hover .fs-pulse,.fs-pill:hover .fs-ring{animation-play-state:paused}
@media (prefers-reduced-motion:reduce){.fs-pill,.fs-pulse,.fs-ring{animation:none}}`;
export default function FloatingSocial() {
  const { cart, user } = useApp(), { pathname } = useLocation(), ref = useRef(null), it = 'flex flex-col items-center justify-center min-h-14 flex-1 text-xs gap-0.5', account = user ? (user.role === 'user' ? '/user' : '/admin') : '/login';
  const circle = 'w-12 h-12 rounded-full bg-white border-2 border-brand/30 text-brand grid place-items-center shadow-sm hover:bg-brand hover:text-white transition-colors';

  // Smooth follow: the pill glides after the scroll position, a little behind the cursor, on the home page only.
  useEffect(() => {
    if (pathname !== '/') return;
    const el = ref.current; if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cur = window.scrollY, target = cur, raf = 0;
    const paint = () => { el.style.transform = `translateY(calc(-50% + ${cur}px))`; };
    const tick = () => { cur += (target - cur) * (reduce ? 1 : 0.12); paint(); raf = Math.abs(target - cur) > 0.5 ? requestAnimationFrame(tick) : 0; };
    const onScroll = () => { target = window.scrollY; if (!raf) raf = requestAnimationFrame(tick); };
    paint();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [pathname]);

  return <>
    {/* round contact buttons: home page only, they glide smoothly with the scroll */}
    {pathname === '/' && <div ref={ref} className="absolute z-30 right-2 md:right-4" style={{ top: '50svh', willChange: 'transform' }}>
      <style>{CSS}</style>
      <div className="fs-pill flex flex-col gap-3 p-2 rounded-full bg-cream/95 border border-sand shadow-xl">
        <a href={wa()} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className={`${circle} fs-pulse`}><MessageCircle size={22} /></a>
        <a href={`tel:+91${biz.phone}`} aria-label="Call us" className={`${circle} fs-pulse fs-pulse2`}><span className="fs-ring"><Phone size={22} /></span></a></div></div>}
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 flex" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <Link to="/" className={it}><Home size={20} />Home</Link><Link to="/products" className={it}><Laptop size={20} />Laptops</Link>
      <Link to="/cart" className={it}><ShoppingCart size={20} />Cart{cart.length > 0 && ` (${cart.length})`}</Link><Link to={account} className={it}><CircleUser size={20} />{user ? 'Account' : 'Log in'}</Link></nav></>;
}