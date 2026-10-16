import { useEffect, useState } from 'react'; import { Link, useLocation } from 'react-router-dom'; import { User, X } from 'lucide-react';

export default function EnquiryNotice() {
  const { pathname } = useLocation(), [show, setShow] = useState(false);
  useEffect(() => {
    let closed = false;
    try { closed = sessionStorage.getItem('enquiryClosed') === '1'; } catch { /* ignore */ }
    if (closed) return;
    const t = setTimeout(() => setShow(true), 10000);
    return () => clearTimeout(t);
  }, []);
  const close = () => { setShow(false); try { sessionStorage.setItem('enquiryClosed', '1'); } catch { /* ignore */ } };
  if (!show || pathname.startsWith('/admin') || pathname === '/contact') return null;
  return <div role="status" className="anim-up fixed z-30 left-4 bottom-20 md:left-5 md:bottom-6 flex items-stretch bg-ink text-white rounded-xl shadow-xl overflow-hidden">
    <Link to="/contact" onClick={close} className="flex items-center gap-2 pl-5 pr-4 min-h-12 font-semibold hover:bg-black/20 transition-colors">Request for Enquiry<User size={20} /></Link>
    <button onClick={close} aria-label="Close notification" className="grid place-items-center w-12 min-h-12 border-l border-white/20 hover:bg-black/20 transition-colors"><X size={18} /></button></div>;
}