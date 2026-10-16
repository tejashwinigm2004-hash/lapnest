import { Link } from 'react-router-dom'; import { Home, Laptop, ShoppingCart, CircleUser, Phone, MessageCircle } from 'lucide-react'; import { biz, wa } from '../config'; import { useApp } from '../context/AppContext';
export default function FloatingSocial() {
  const { cart, user } = useApp(), it = 'flex flex-col items-center justify-center min-h-14 flex-1 text-xs gap-0.5', account = user ? (user.role === 'user' ? '/user' : '/admin') : '/login';
  const circle = 'w-12 h-12 rounded-full bg-white border-2 border-brand/30 text-brand grid place-items-center shadow-sm hover:bg-brand hover:text-white transition-colors';
  return <>
    {/* round contact buttons pinned to the right edge on every screen size */}
    <div className="fixed z-30 right-2 md:right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 p-2 rounded-full bg-cream/95 border border-sand shadow-xl">
      <a href={wa()} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className={circle}><MessageCircle size={22} /></a>
      <a href={`tel:+91${biz.phone}`} aria-label="Call us" className={circle}><Phone size={22} /></a></div>
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 flex" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <Link to="/" className={it}><Home size={20} />Home</Link><Link to="/products" className={it}><Laptop size={20} />Laptops</Link>
      <Link to="/cart" className={it}><ShoppingCart size={20} />Cart{cart.length > 0 && ` (${cart.length})`}</Link><Link to={account} className={it}><CircleUser size={20} />{user ? 'Account' : 'Log in'}</Link></nav></>;
}