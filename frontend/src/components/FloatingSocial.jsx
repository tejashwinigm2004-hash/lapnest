import { Link } from 'react-router-dom'; import { Home, Laptop, ShoppingCart, Phone, MessageCircle } from 'lucide-react'; import { biz, wa } from '../config'; import { useApp } from '../context/AppContext';
export default function FloatingSocial() {
  const { cart } = useApp(); const it = 'flex flex-col items-center justify-center min-h-14 flex-1 text-xs gap-0.5';
  return <>
    <a href={wa()} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="hidden md:grid fixed right-5 bottom-5 z-30 w-14 h-14 rounded-full bg-green-600 text-white place-items-center shadow-lg"><MessageCircle /></a>
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 flex" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <Link to="/" className={it}><Home size={20} />Home</Link><Link to="/products" className={it}><Laptop size={20} />Laptops</Link>
      <Link to="/cart" className={it}><ShoppingCart size={20} />Cart{cart.length > 0 && ` (${cart.length})`}</Link>
      <a href={`tel:+91${biz.phone}`} className={it}><Phone size={20} />Call</a><a href={wa()} target="_blank" rel="noreferrer" className={it + ' text-green-700'}><MessageCircle size={20} />WhatsApp</a></nav></>;
}