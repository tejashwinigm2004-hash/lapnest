import { useEffect, useState } from 'react'; import { useSearchParams } from 'react-router-dom'; import Reveal from '../components/Reveal'; import api from '../services/api'; import ProductCard from '../components/ProductCard';
export default function Products() {
  const [sp, setSp] = useSearchParams(); const [items, setItems] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(true); api.get('/products?' + sp.toString()).then(r => setItems(r.data)).finally(() => setLoading(false)); }, [sp]);
  const set = (k, v) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); setSp(n); };
  const sel = 'border border-slate-300 rounded-lg px-3 min-h-11 bg-white';
  return <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-8"><h1 className="text-2xl font-bold text-ink mb-5">Laptops</h1>
    <div className="flex flex-wrap gap-3 mb-6">
      <input className={sel + ' flex-1 min-w-48'} placeholder="Search name or brand" defaultValue={sp.get('q') || ''} onKeyDown={e => e.key === 'Enter' && set('q', e.target.value)} />
      <select className={sel} value={sp.get('availableFor') || ''} onChange={e => set('availableFor', e.target.value)}><option value="">Buy or rent</option><option value="buy">Buy</option><option value="rent">Rent</option></select>
      <select className={sel} value={sp.get('sort') || ''} onChange={e => set('sort', e.target.value)}><option value="">Newest</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option></select></div>
    {loading ? <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">{Array.from({ length: 8 }, (_, i) => <div key={i} className="h-72 rounded-2xl bg-soft animate-pulse" />)}</div>
      : !items.length ? <p>No laptops match. Clear a filter to see more.</p>
      : <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">{items.map((p, i) => <Reveal key={p._id} delay={(i % 8) * 0.05} className="h-full"><ProductCard p={p} compact /></Reveal>)}</div>}</div>;
}