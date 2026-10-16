import { Link } from 'react-router-dom'; import { Instagram, Facebook, MessageCircle, Phone, Mail, MapPin, Clock } from 'lucide-react'; import { biz, wa } from '../config';

// ===== EDIT: cities you serve (shown under "Our reach") =====
const CITIES = ['Bengaluru'];

export default function Footer() {
  const h = 'font-serif font-semibold text-white text-lg mb-4', link = 'block py-1.5 text-sm text-slate-300 hover:text-white transition-colors';
  const social = 'w-10 h-10 rounded-full border border-white/30 grid place-items-center text-white hover:bg-white hover:text-ink transition-colors';
  return <footer className="bg-ink text-slate-300 mt-16">
    <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
      <div className="lg:col-span-1">
        <Link to="/" className="inline-flex items-center gap-2 font-serif font-bold text-white text-2xl"><img src="/logo.png" alt="" className="h-8" onError={e => (e.currentTarget.style.display = 'none')} />{biz.name}</Link>
        <p className="text-sm mt-3 max-w-xs">{biz.tagline}. Rent by the day, week or month, or buy at 5–10% off.</p>
        <div className="flex gap-3 mt-5">
          {biz.instagram && <a aria-label="Instagram" className={social} href={biz.instagram} target="_blank" rel="noreferrer"><Instagram size={18} /></a>}
          {biz.facebook && <a aria-label="Facebook" className={social} href={biz.facebook} target="_blank" rel="noreferrer"><Facebook size={18} /></a>}
          <a aria-label="WhatsApp" className={social} href={wa()} target="_blank" rel="noreferrer"><MessageCircle size={18} /></a></div></div>

      <nav aria-label="Why us"><p className={h}>Why us</p>
        <Link className={link} to="/about">About us</Link><Link className={link} to="/refund-policy">Return policy</Link><Link className={link} to="/terms">Terms &amp; conditions</Link>
        <Link className={link} to="/privacy">Privacy policy</Link><Link className={link} to="/contact">Contact us</Link></nav>

      <nav aria-label="Categories"><p className={h}>Categories</p>
        <Link className={link} to="/products">All laptops</Link><Link className={link} to="/products?availableFor=rent">Laptops for rent</Link><Link className={link} to="/products?availableFor=buy">Laptops to buy</Link><Link className={link} to="/user">My account</Link></nav>

      <div><p className={h}>Our reach</p>{CITIES.map(c => <p key={c} className="py-1.5 text-sm flex items-center gap-2"><MapPin size={14} className="text-slate-400" />{c}</p>)}</div>

      <div><p className={h}>Contact</p>
        <a className={`${link} flex items-center gap-2`} href={`tel:+91${biz.phone}`}><Phone size={16} />{biz.phone}</a>
        <a className={`${link} flex items-center gap-2 break-all`} href={`mailto:${biz.email}`}><Mail size={16} className="shrink-0" />{biz.email}</a>
        {biz.address && <p className="py-1.5 text-sm flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0" />{biz.address}</p>}
        {biz.hours && <p className="py-1.5 text-sm flex items-start gap-2"><Clock size={16} className="mt-0.5 shrink-0" />{biz.hours}</p>}</div>
    </div>
    <div className="border-t border-white/15"><div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
      <span>© {new Date().getFullYear()} {biz.name}. All rights reserved.</span>
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-1"><Link className="hover:text-white" to="/terms">Terms and Conditions</Link><Link className="hover:text-white" to="/privacy">Privacy Policy</Link><Link className="hover:text-white" to="/refund-policy">Refund and Cancellation Policy</Link></div></div></div>
  </footer>;
}