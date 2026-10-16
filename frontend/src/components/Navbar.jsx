import { useState } from 'react'; import { Link, NavLink, useNavigate } from 'react-router-dom'; import { Menu, X, Search, ShoppingCart, MapPin, ChevronDown, CircleUser } from 'lucide-react'; import { useApp } from '../context/AppContext'; import { biz } from '../config';

// ===== EDIT: cities you serve =====
const CITIES = ['Bengaluru'];

// ===== EDIT: the category menu. "items" makes a dropdown. =====
// Brand links use the search box (?search=). They only filter if your Products page reads that value.
const MENU = [
  { label: 'Laptops', to: '/products', items: [['All laptops', '/products'], ['Laptops for rent', '/products?availableFor=rent'], ['Laptops to buy', '/products?availableFor=buy']] },
  { label: 'Brands', items: ['Dell', 'HP', 'Lenovo', 'Apple', 'Acer', 'Asus'].map(b => [b, `/products?search=${b}`]) },
  { label: 'Rent', to: '/products?availableFor=rent' },
  { label: 'Buy', to: '/products?availableFor=buy' },
  { label: 'About us', to: '/about' },
  { label: 'Contact us', to: '/contact' },
];

export default function Navbar() {
  const { user, logout, cart } = useApp(), navigate = useNavigate();
  const [open, setOpen] = useState(false), [q, setQ] = useState(''), [city, setCity] = useState(() => { try { return localStorage.getItem('city') || CITIES[0]; } catch { return CITIES[0]; } });
  const close = () => setOpen(false);
  const pickCity = c => { setCity(c); try { localStorage.setItem('city', c); } catch { /* ignore */ } };
  const search = e => { e.preventDefault(); const t = q.trim(); navigate(t ? `/products?search=${encodeURIComponent(t)}` : '/products'); setQ(''); close(); };
  const home = user ? (user.role === 'user' ? '/user' : '/admin') : '/login';
  const l = ({ isActive }) => `flex items-center gap-1 px-1 min-h-11 text-sm font-medium ${isActive ? 'text-brand' : 'text-ink hover:text-brand'}`;

  const SearchBox = ({ className = '' }) => <form onSubmit={search} role="search" className={`flex items-center bg-white border border-slate-300 rounded-full overflow-hidden focus-within:border-brand ${className}`}>
    <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search laptops, brands…" aria-label="Search laptops" className="flex-1 min-w-0 px-4 min-h-11 bg-transparent outline-none text-sm" />
    <button aria-label="Search" className="w-12 min-h-11 grid place-items-center bg-brand text-white"><Search size={18} /></button></form>;

  const CitySelect = () => <label className="flex items-center gap-1 border border-slate-300 rounded-full px-3 min-h-11 bg-white text-sm text-ink"><MapPin size={16} className="text-brand shrink-0" />
    <select value={city} onChange={e => pickCity(e.target.value)} aria-label="Select a city" className="bg-transparent outline-none cursor-pointer max-w-[7.5rem]">{CITIES.map(c => <option key={c}>{c}</option>)}</select></label>;

  const CartLink = ({ full }) => <Link to="/cart" onClick={close} aria-label={`Cart, ${cart.length} items`} className="relative flex items-center gap-2 min-h-11 px-2 text-ink hover:text-brand">
    <ShoppingCart size={22} />{full && <span className="text-sm font-medium">Cart</span>}
    {cart.length > 0 && <span className="absolute -top-0.5 left-5 min-w-5 h-5 px-1 rounded-full bg-brand text-white text-xs font-bold grid place-items-center">{cart.length}</span>}</Link>;

  const Account = ({ mobile }) => user
    ? <div className={`flex items-center gap-3 ${mobile ? 'flex-col items-stretch' : ''}`}>
        <Link to={home} onClick={close} className="flex items-center gap-2 min-h-11 text-sm font-medium text-ink hover:text-brand"><CircleUser size={22} />{user.role === 'user' ? 'My account' : 'Admin'}</Link>
        <button onClick={() => { logout(); close(); }} className="min-h-11 px-4 rounded-full border border-slate-300 text-sm font-medium hover:border-brand hover:text-brand">Sign out ({user.name.split(' ')[0]})</button></div>
    : <Link to="/login" onClick={close} className="min-h-11 px-5 rounded-full bg-brand text-white text-sm font-semibold grid place-items-center whitespace-nowrap">Log-in / sign up</Link>;

  return <header className="sticky top-0 z-20 bg-white shadow-sm">
    {/* Row 1: logo, city, search, cart, account */}
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3 md:gap-5">
      <button className="md:hidden min-h-11 min-w-11 grid place-items-center -ml-2" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <Link to="/" onClick={close} className="flex items-center gap-2 font-serif font-bold text-ink text-2xl shrink-0"><img src="/logo.png" alt="" className="h-8" onError={e => (e.currentTarget.style.display = 'none')} />{biz.name}</Link>
      <div className="hidden md:block"><CitySelect /></div>
      <SearchBox className="hidden md:flex flex-1 max-w-xl" />
      <div className="ml-auto flex items-center gap-2 md:gap-4"><CartLink full /><div className="hidden md:block"><Account /></div></div></div>

    {/* Mobile search bar */}
    <div className="md:hidden px-4 pb-3"><SearchBox /></div>

    {/* Row 2: category menu (desktop) */}
    <nav aria-label="Categories" className="hidden md:block border-t border-sand bg-soft"><ul className="max-w-7xl mx-auto px-4 flex items-center gap-7">
      {MENU.map(m => <li key={m.label} className="relative group">
        {m.to ? <NavLink to={m.to} end className={l}>{m.label}{m.items && <ChevronDown size={14} />}</NavLink> : <button className={`${l({ isActive: false })} cursor-default`} aria-haspopup="true">{m.label}<ChevronDown size={14} /></button>}
        {m.items && <div className="absolute left-0 top-full hidden group-hover:block group-focus-within:block min-w-52 bg-white border border-sand rounded-xl shadow-lg py-2 z-30">
          {m.items.map(([t, to]) => <Link key={t} to={to} className="block px-4 py-2 text-sm text-ink hover:bg-soft hover:text-brand">{t}</Link>)}</div>}</li>)}</ul></nav>

    {/* Mobile drawer */}
    {open && <div className="md:hidden border-t border-sand bg-white max-h-[75vh] overflow-y-auto p-4 flex flex-col gap-1">
      <div className="mb-3"><CitySelect /></div>
      {MENU.map(m => <div key={m.label}>
        {m.to ? <Link to={m.to} onClick={close} className="block py-3 font-semibold text-ink border-b border-sand">{m.label}</Link> : <p className="pt-3 pb-1 font-semibold text-ink">{m.label}</p>}
        {m.items && <div className="pl-3 pb-2">{m.items.map(([t, to]) => <Link key={t} to={to} onClick={close} className="block py-2 text-sm text-slate-600">{t}</Link>)}</div>}</div>)}
      <div className="mt-4"><Account mobile /></div></div>}
  </header>;
}