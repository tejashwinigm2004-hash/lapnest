import { useEffect, useState } from 'react'; import { Link, useLocation } from 'react-router-dom'; import { CalendarClock, Search, MessageCircle, X } from 'lucide-react'; import { wa } from '../config'; import { useApp } from '../context/AppContext'; import BookCall from './BookCall';

const IDS = ['call', 'find', 'team'];
const FIRST_DELAY = 60000; // first popup appears 1 minute after the visitor enters
const NEXT_DELAY = 60000;  // each next popup appears 1 minute after the previous one is closed

// ===== EDIT: background image of each popup (files go in frontend/public/popups) =====
const IMAGES = { call: '/popups/call.jpg', find: '/popups/find.jpg', team: '/popups/team.jpg' };
const FALLBACK_IMAGE = '/hero.jpg'; // used if a popup image is missing

// Shown one by one, in this order
const CARDS = [
  { id: 'call', Icon: CalendarClock, title: 'Book a call', text: 'Pick a time slot and we will call you.', cta: 'Book a call' },
  { id: 'find', Icon: Search, title: 'Find the best laptop', text: 'Tell us your budget and use. We will suggest one.', cta: 'Browse laptops' },
  { id: 'team', Icon: MessageCircle, title: 'Talk to our team', text: 'Call or message us if you need help choosing.', cta: 'Chat on WhatsApp' },
];

const BLINK = `@keyframes popBlink{0%,100%{box-shadow:0 0 0 0 rgba(217,72,15,.6);opacity:1}50%{box-shadow:0 0 0 12px rgba(217,72,15,0);opacity:.78}}.pop-blink{animation:popBlink 1.4s ease-in-out infinite}.pop-blink:hover{animation:none}@media (prefers-reduced-motion:reduce){.pop-blink{animation:none}}`;

export default function SitePopups() {
  const { pathname } = useLocation(), { user } = useApp(), loggedIn = !!user;
  const [closed, setClosed] = useState([]), [show, setShow] = useState(false), [call, setCall] = useState(false);
  const hidden = /^\/(admin|login|register)/.test(pathname);
  const next = CARDS.find(x => !closed.includes(x.id));

  // Start the cycle again every time the visitor opens the home page
  useEffect(() => { if (pathname === '/') { setShow(false); setClosed([]); } }, [pathname]);
  // Start the cycle again right after login
  useEffect(() => { if (loggedIn) { setShow(false); setClosed([]); } }, [loggedIn]);

  // Wait 1 minute before the first popup, then 1 minute before each next one
  useEffect(() => {
    if (hidden || show || !next) return;
    const t = setTimeout(() => setShow(true), closed.length === 0 ? FIRST_DELAY : NEXT_DELAY);
    return () => clearTimeout(t);
  }, [hidden, show, next, closed]);

  const dismiss = id => { setShow(false); setClosed(c => (c.includes(id) ? c : [...c, id])); };
  const dismissAll = () => { setShow(false); setClosed(IDS); };

  if (hidden) return <BookCall open={call} onClose={() => setCall(false)} />;

  const c = show ? next : null;
  const btn = 'pop-blink mt-7 w-full bg-brand text-white font-semibold min-h-12 px-5 rounded-full grid place-items-center';
  const cta = !c ? null : c.id === 'call'
    ? <button onClick={() => { setCall(true); dismissAll(); }} className={btn}>{c.cta}</button>
    : c.id === 'find'
      ? <Link to="/products" onClick={dismissAll} className={btn}>{c.cta}</Link>
      : <a href={wa('Hello, I would like to talk to your team')} target="_blank" rel="noreferrer" onClick={dismissAll} className={btn}>{c.cta}</a>;
  const bg = !c ? undefined : {
    backgroundColor: '#1E293B',
    backgroundImage: `linear-gradient(180deg,rgba(15,23,42,.5) 0%,rgba(15,23,42,.88) 100%),url("${IMAGES[c.id]}"),url("${FALLBACK_IMAGE}")`,
    backgroundSize: 'cover', backgroundPosition: 'center',
  };
  return <>
    {c && <div role="dialog" aria-modal="true" aria-label={c.title} className="fixed inset-0 z-50 bg-black/60 overflow-y-auto">
      <style>{BLINK}</style>
      <div className="min-h-full grid place-items-center p-4">
        <div key={c.id} style={bg} className="anim-up relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden px-8 pt-14 pb-8 text-center">
          <button onClick={() => dismiss(c.id)} aria-label={`Close ${c.title}`} className="absolute top-3 right-3 w-11 h-11 grid place-items-center text-white/80 hover:text-white"><X size={22} /></button>
          <span className="mx-auto w-20 h-20 rounded-2xl bg-white/15 border border-white/30 text-white grid place-items-center"><c.Icon size={36} /></span>
          <h2 className="mt-6 text-2xl font-bold text-white">{c.title}</h2>
          <p className="mt-3 text-base text-white/90">{c.text}</p>
          {cta}</div></div></div>}
    <BookCall open={call} onClose={() => setCall(false)} /></>;
}