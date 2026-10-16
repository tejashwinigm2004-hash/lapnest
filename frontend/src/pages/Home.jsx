import { useEffect, useState } from 'react'; import { Link } from 'react-router-dom'; import { Tag, CalendarClock, ShieldCheck, Truck, Phone, MessageCircle, Volume2, VolumeX, Laptop, Info, Mail, ShoppingCart, CircleUser, ArrowRight, ChevronDown } from 'lucide-react'; import { useApp } from '../context/AppContext'; import BookCall from '../components/BookCall'; import Reveal from '../components/Reveal'; import Parallax from '../components/Parallax'; import Shapes from '../components/Shapes'; import Advisor from '../components/Advisor'; import LaptopMarquee from '../components/LaptopMarquee';
import api from '../services/api'; import { inr } from '../utils'; import ProductCard from '../components/ProductCard'; import ProductImage from '../components/ProductImage'; import { biz, wa } from '../config'; import AdPlayer, { useAdVideo } from '../components/VideoAd';
const why = [[Tag, '5–10% off to buy', 'Every laptop we sell is priced below MRP.'], [CalendarClock, 'Rent by day, week or month', 'Pick the plan and see the exact total first.'], [ShieldCheck, 'Refundable deposit', 'Get it back after the laptop is returned and checked.'], [Truck, 'Delivery and pickup', 'We bring it to you and collect it when you are done.']];
const Float = ({ className = '', dur = 6, delay = 0, rot = 0, children }) => <div className={`absolute ${className}`} style={{ transform: `rotate(${rot}deg)` }}><div className="ln-f" style={{ animation: `lnFloat ${dur}s ease-in-out ${delay}s infinite` }}>{children}</div></div>;
function FullHero({ kind, onBook }) {
  const [muted, setMuted] = useState(true);
  return <section className="relative isolate overflow-hidden bg-black text-white min-h-[calc(100svh-4rem)] flex items-center justify-center text-center">
    {kind === 'youtube'
      ? <iframe title={`${biz.name} video`} tabIndex={-1} allow="autoplay; encrypted-media" className="absolute top-1/2 left-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none border-0"
          src={`https://www.youtube-nocookie.com/embed/${biz.adYoutubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${biz.adYoutubeId}&rel=0&playsinline=1`} />
      : <Parallax speed={0.15} className="absolute inset-x-0 -top-24 -bottom-24"><video src={biz.adVideo} autoPlay muted={muted} loop playsInline className="w-full h-full object-cover" /></Parallax>}
    <div className="absolute inset-0 bg-black/55" />
    <div className="relative z-10 max-w-3xl px-6 py-16">
      <span className="anim-up inline-block mb-3 rounded-full border border-white/40 bg-white/10 px-4 py-1 text-sm">Rent or buy · 5–10% off</span>
      <h1 className="anim-up d1 mt-2 text-4xl md:text-6xl font-bold leading-[1.1]">Business-grade laptops, ready when you are.</h1>
      <p className="anim-up d2 mt-5 text-lg opacity-90 max-w-xl mx-auto">Rent by the day, week or month, or buy at 5–10% off. See the full price before you order.</p>
      <div className="anim-up d3 mt-8 flex flex-wrap justify-center gap-3"><Link to="/products?availableFor=rent" className="bg-brand text-white px-7 min-h-12 grid place-items-center rounded-full font-semibold">Rent a laptop</Link>
        <Link to="/products?availableFor=buy" className="border border-white text-white px-7 min-h-12 grid place-items-center rounded-full font-semibold">Buy a laptop</Link><button onClick={onBook} className="bg-white text-brand px-7 min-h-12 rounded-full font-semibold">Book a call</button></div></div>
    <ChevronDown aria-hidden="true" className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/80 animate-bounce" />
    {kind === 'file' && <button onClick={() => setMuted(m => !m)} aria-label={muted ? 'Turn sound on' : 'Turn sound off'} className="absolute bottom-5 right-5 z-10 w-11 h-11 rounded-full bg-white/90 text-ink grid place-items-center">{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>}</section>;
}
function AboutVisual() {
  return <Parallax speed={0.08}><div className="rounded-2xl overflow-hidden border border-sand bg-white shadow-lg"><video src="/ads/advertise.mp4" poster="/about.jpg" autoPlay muted loop playsInline preload="auto" className="w-full aspect-video object-cover block pointer-events-none" /></div></Parallax>;
}
export default function Home() {
  const [items, setItems] = useState(null); useEffect(() => { api.get('/products').then(r => setItems(r.data)).catch(() => setItems([])); }, []);
  const [callOpen, setCallOpen] = useState(false), [chip, setChip] = useState('all'); const { user, cart } = useApp(); const shown = (items || []).filter(p => chip === 'all' || p.availableFor === 'both' || p.availableFor === chip); const f = items?.[0];
  const quick = [[Laptop, 'Laptops', 'Browse, search and filter every laptop.', '/products', 'Browse laptops'], [Info, 'About us', 'Who we are and how renting works.', '/about', 'About us'], [Mail, 'Contact us', 'Call, message or visit us.', '/contact', 'Contact us'],
    [ShoppingCart, 'Cart', `${cart.length} item(s) in your cart.`, '/cart', 'Open cart'], [CircleUser, user ? 'My account' : 'Sign in', user ? 'Orders, invoices, extensions and returns.' : 'Sign in to order and track rentals.', user ? (user.role === 'user' ? '/user' : '/admin') : '/login', user ? 'My account' : 'Sign in']]; const adKind = useAdVideo();
  return <>
    {adKind ? <FullHero kind={adKind} onBook={() => setCallOpen(true)} /> : <section className="max-w-6xl mx-auto px-4 pt-12 pb-16 md:pt-20 grid md:grid-cols-2 gap-12 items-center">
      <div><h1 className="text-4xl md:text-5xl font-bold text-ink leading-[1.1]">Business-grade laptops, ready when you are.</h1>
        <p className="mt-5 text-lg max-w-md">Rent by the day, week or month, or buy at 5–10% off. See the full price before you order.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link to="/products?availableFor=rent" className="bg-brand text-white px-6 min-h-12 grid place-items-center rounded-full font-semibold">Rent a laptop</Link>
          <Link to="/products?availableFor=buy" className="border border-brand text-brand px-6 min-h-12 grid place-items-center rounded-full font-semibold">Buy a laptop</Link><button onClick={() => setCallOpen(true)} className="bg-soft text-brand px-6 min-h-12 rounded-full font-semibold">Book a call</button></div></div>
      <div className="relative h-[26rem] md:h-[31rem]">
        <style>{`@keyframes lnFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}@media (prefers-reduced-motion:reduce){.ln-f{animation:none!important}}`}</style>
        {f ? <>
          <Float className="inset-0 grid place-items-center" dur={6}><Link to={`/products/${f._id}`} className="block w-60 md:w-80 rounded-3xl bg-white border border-slate-200 shadow-xl p-3">
            <ProductImage p={f} className="rounded-2xl aspect-[4/3] w-full" /><p className="mt-3 font-semibold text-ink">{f.name}</p><p className="text-xs">{f.specs.processor} · {f.specs.ram} · {f.specs.storage}</p>
            <p className="mt-1 font-bold text-ink">{inr(f.sellingPrice)} <s className="text-xs font-normal">{inr(f.mrp)}</s></p></Link></Float>
          {items[1] && <Float className="left-0 top-2" dur={7} delay={0.6} rot={-6}><Link to={`/products/${items[1]._id}`} className="block w-28 md:w-40 rounded-2xl bg-white border border-slate-200 shadow-lg p-2">
            <ProductImage p={items[1]} className="rounded-xl aspect-[4/3] w-full" /><p className="mt-1 text-xs font-semibold text-ink truncate">{items[1].name}</p></Link></Float>}
          <Float className="right-0 top-6" dur={5} delay={0.3} rot={5}><span className="block bg-green-700 text-white rounded-full px-4 py-2 font-semibold shadow-lg">{f.discountPercent}% off</span></Float>
          <Float className="left-2 bottom-6" dur={6.5} delay={1} rot={4}><span className="block bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-lg text-sm"><span className="block text-xs">Rent from</span><b className="text-ink">{inr(f.rentRates.weekly)}</b>/week</span></Float>
          <Float className="right-0 bottom-10" dur={7.5} delay={0.2} rot={-4}><span className="flex items-center gap-2 bg-brand text-white rounded-2xl px-4 py-2 shadow-lg text-sm font-semibold"><ShieldCheck size={16} />Refundable deposit</span></Float></>
        : <div className="rounded-3xl bg-soft h-full animate-pulse" />}</div></section>}
    <section className="bg-soft"><div className="max-w-6xl mx-auto px-4 py-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{why.map(([I, t, d], i) => <Reveal key={t} delay={i * 0.1}><I className="text-brand" /><p className="mt-3 font-semibold text-ink">{t}</p><p className="text-sm mt-1">{d}</p></Reveal>)}</div></section>
    <section className="max-w-[1800px] mx-auto px-4 md:px-6 py-14"><div className="flex justify-center mb-10">
        <style>{`@keyframes lnBlink{0%,100%{box-shadow:0 0 0 0 rgba(30,79,216,.55);opacity:1}50%{box-shadow:0 0 0 10px rgba(30,79,216,0);opacity:.7}}.ln-blink{animation:lnBlink 1.6s ease-in-out infinite}.ln-blink:hover{animation:none}@media (prefers-reduced-motion:reduce){.ln-blink{animation:none}}`}</style>
        <button onClick={() => setCallOpen(true)} className="ln-blink bg-brand text-white font-semibold w-[250px] max-w-full h-12 rounded-full flex items-center justify-center gap-2"><CalendarClock size={18} />Book a call</button></div>
      <Reveal className="text-center mb-6"><h2 className="font-serif text-3xl font-bold text-ink">Featured laptops</h2><div className="band mx-auto mt-2 w-24 h-3.5" aria-hidden="true" /></Reveal>
      <div className="flex justify-center flex-wrap gap-2 mb-6">{[['all', 'All laptops'], ['rent', 'To rent'], ['buy', 'To buy']].map(([k, l]) => <button key={k} onClick={() => setChip(k)} aria-pressed={chip === k} className={`px-5 min-h-11 rounded-full border text-sm font-medium ${chip === k ? 'bg-brand text-white border-brand' : 'bg-soft border-sand text-ink'}`}>{l}</button>)}</div>
      {!items ? <p>Loading laptops…</p> : !items.length ? <p>Laptops will appear here soon.</p> : <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">{shown.slice(0, 7).map((p, i) => <Reveal key={p._id} delay={i * 0.06} className="h-full"><ProductCard p={p} compact /></Reveal>)}
        <Link to="/products" className="lift rounded-2xl border-2 border-dashed border-brand/40 bg-soft hover:bg-white transition-colors flex flex-col items-center justify-center gap-3 p-4 text-center min-h-48">
          <span className="w-11 h-11 rounded-full bg-brand text-white grid place-items-center"><ArrowRight size={20} /></span><span className="font-semibold text-brand">Browse all laptops</span><span className="text-xs">See every laptop we have</span></Link></div>}</section>
    <LaptopMarquee items={items} />
    <Advisor items={items} />
    <section className="max-w-6xl mx-auto px-4 pb-14"><Reveal className="text-center mb-6"><h2 className="font-serif text-3xl font-bold text-ink">How renting works</h2><div className="band mx-auto mt-2 w-24 h-3.5" aria-hidden="true" /></Reveal>
      <ol className="grid gap-4 md:grid-cols-3">{[['Choose', 'Pick a laptop, a plan and a start date.'], ['Order', 'Place the order. We confirm the payment and deliver.'], ['Extend or return', 'Extend or schedule pickup from your account.']].map(([t, d], i) => <Reveal as="li" delay={i * 0.12} key={t} className="lift ornate bg-white border border-sand rounded-2xl p-6 text-center"><span className="font-serif font-bold text-brand text-xl">Step 0{i + 1}</span><p className="font-semibold text-ink mt-1">{t}</p><p className="text-sm mt-1">{d}</p></Reveal>)}</ol></section>
    <section className="bg-soft"><div className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-2 gap-10 items-center">
      <Reveal><h2 className="font-serif text-3xl font-bold text-ink">About {biz.name}</h2>
        <p className="mt-3">{biz.name} gives students, startups and teams a simple way to get a good laptop without paying full price. Rent one for a week or a month, or buy it at 5–10% below MRP.</p>
        <ul className="mt-4 space-y-2 text-sm list-disc ml-5"><li>Every laptop is checked before it goes out.</li><li>Rent, deposit and GST are shown before you order.</li><li>Call or message us if anything goes wrong.</li></ul>
        <Link to="/about" className="inline-block mt-6 bg-brand text-white px-6 min-h-12 leading-[3rem] rounded-full font-semibold">More about us</Link></Reveal>
      <Reveal delay={0.15}><AboutVisual /></Reveal></div></section>
    <section className="max-w-6xl mx-auto px-4 py-14"><h2 className="text-2xl font-bold text-ink mb-6">Everything in one place</h2>
      <div className="grid gap-4 max-w-3xl">{quick.map(([I, t, d, to, b], i) => <Reveal key={t} delay={i * 0.08} className="lift border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"><I className="text-brand shrink-0" size={28} />
        <div className="flex-1"><p className="font-semibold text-ink">{t}</p><p className="text-sm mt-1">{d}</p></div>
        <Link to={to} className="sm:w-56 bg-soft text-brand font-semibold min-h-11 grid place-items-center rounded-full">{b}</Link></Reveal>)}</div></section>
    <section className="pattern bg-brand text-white relative overflow-hidden"><Shapes /><div className="relative z-10 max-w-6xl mx-auto px-4 py-12 flex flex-wrap items-center justify-between gap-6"><div><p className="font-serif text-2xl font-bold">Not sure which laptop fits?</p><p className="opacity-90 mt-1">Tell us your budget and use. We will suggest one.</p></div>
      <div className="flex gap-3"><a href={`tel:+91${biz.phone}`} className="bg-white text-brand font-semibold px-5 min-h-12 rounded-full flex items-center gap-2"><Phone size={18} />Call us</a><a href={wa()} target="_blank" rel="noreferrer" className="border border-white font-semibold px-5 min-h-12 rounded-full flex items-center gap-2"><MessageCircle size={18} />WhatsApp</a><button onClick={() => setCallOpen(true)} className="bg-white text-brand font-semibold px-5 min-h-12 rounded-full flex items-center gap-2"><CalendarClock size={18} />Book a call</button><Link to="/contact" className="border border-white font-semibold px-5 min-h-12 rounded-full grid place-items-center">Contact page</Link></div></div></section><BookCall open={callOpen} onClose={() => setCallOpen(false)} /></>;
}