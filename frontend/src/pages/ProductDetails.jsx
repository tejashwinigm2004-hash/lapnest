import { useEffect, useState } from 'react'; import { useParams, useNavigate } from 'react-router-dom'; import toast from 'react-hot-toast';
import ProductImage from '../components/ProductImage'; import api from '../services/api'; import { useApp } from '../context/AppContext'; import { inr, rentPreview } from '../utils';
export default function ProductDetails() {
  const { id } = useParams(); const nav = useNavigate(); const { user, addToCart } = useApp();
  const [p, setP] = useState(null); const [mode, setMode] = useState('buy'); const [plan, setPlan] = useState('weekly'); const [units, setUnits] = useState(1); const [startDate, setStart] = useState('');
  useEffect(() => { api.get('/products/' + id).then(r => { setP(r.data); if (r.data.availableFor === 'rent') setMode('rent'); }); }, [id]);
  if (!p) return <p className="p-8">Loading…</p>;
  const rp = rentPreview(p, plan, units); const inp = 'border border-slate-300 rounded-lg px-3 min-h-11';
  const add = () => {
    if (!user) { toast.error('Sign in to add to cart'); return nav('/login'); }
    if (mode === 'rent' && !startDate) return toast.error('Choose a rental start date');
    addToCart({ product: p._id, name: p.name, mode, plan, units: +units, qty: 1, startDate, buyPrice: p.sellingPrice, rentRates: p.rentRates, deposit: p.securityDeposit });
    toast.success('Added to cart'); nav('/cart');
  };
  return <div className="max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
    <ProductImage p={p} className="rounded-2xl aspect-square w-full" />
    <div><h1 className="text-2xl font-bold text-ink">{p.name}</h1><p>{Object.values(p.specs).filter(v => typeof v === 'string').join(' · ')}</p>
      <p className="mt-2 text-sm">{p.stock} in stock</p>
      {p.availableFor === 'both' && <div className="flex gap-2 mt-4">{['buy', 'rent'].map(m => <button key={m} onClick={() => setMode(m)} className={`px-5 min-h-11 rounded-lg border ${mode === m ? 'bg-brand text-white border-brand' : 'border-slate-300'}`}>{m === 'buy' ? 'Buy' : 'Rent'}</button>)}</div>}
      {mode === 'buy' ? <p className="mt-4 text-2xl font-bold text-ink">{inr(p.sellingPrice)} <s className="text-base font-normal">{inr(p.mrp)}</s></p> :
      <div className="mt-4 space-y-3"><div className="flex gap-2">
        <select className={inp} value={plan} onChange={e => setPlan(e.target.value)}>{Object.keys(p.rentRates).map(k => <option key={k} value={k}>{k} · {inr(p.rentRates[k])}</option>)}</select>
        <input type="number" min="1" className={inp + ' w-24'} value={units} onChange={e => setUnits(Math.max(1, e.target.value))} /></div>
        <input type="date" min={new Date().toISOString().slice(0, 10)} className={inp} value={startDate} onChange={e => setStart(e.target.value)} />
        <p>Rent {inr(rp.rent)} for {rp.days} days + {inr(rp.deposit)} refundable deposit</p></div>}
      <button onClick={add} className="mt-6 w-full bg-brand text-white min-h-12 rounded-xl font-semibold sticky bottom-20 md:static shadow-lg md:shadow-none">Add to cart</button></div></div>;
}