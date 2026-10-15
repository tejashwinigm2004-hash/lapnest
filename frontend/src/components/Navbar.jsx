import { useState } from 'react'; import { Link, NavLink } from 'react-router-dom'; import { Menu, X } from 'lucide-react'; import { useApp } from '../context/AppContext'; import { biz } from '../config';
export default function Navbar() {
  const { user, logout, cart } = useApp(); const [open, setOpen] = useState(false); const close = () => setOpen(false);
  const l = ({ isActive }) => isActive ? 'text-brand font-semibold' : 'hover:text-brand';
  const links = <><NavLink className={l} to="/products" onClick={close}>Laptops</NavLink><NavLink className={l} to="/about" onClick={close}>About</NavLink><NavLink className={l} to="/contact" onClick={close}>Contact</NavLink>
    {user?.role === 'user' && <NavLink className={l} to="/user" onClick={close}>My account</NavLink>}{user && user.role !== 'user' && <NavLink className={l} to="/admin" onClick={close}>Admin</NavLink>}
    <NavLink className={l} to="/cart" onClick={close}>Cart ({cart.length})</NavLink>
    {user ? <button onClick={() => { logout(); close(); }}>Sign out ({user.name.split(' ')[0]})</button> : <Link to="/login" onClick={close} className="bg-brand text-white px-5 py-2 rounded-full font-semibold text-center">Sign in / Rent now</Link>}</>;
  return <header className="sticky top-0 z-20 bg-cream/95 backdrop-blur border-b border-sand">
    <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 font-serif font-bold text-ink text-2xl"><img src="/logo.png" alt="" className="h-8" onError={e => (e.currentTarget.style.display = 'none')} />{biz.name}</Link>
      <div className="hidden md:flex gap-7 items-center text-sm">{links}</div>
      <button className="md:hidden min-h-11 min-w-11 grid place-items-center" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></nav>
    {open && <div className="md:hidden flex flex-col gap-4 p-4 border-t border-sand bg-cream">{links}</div>}</header>;
}