import { Link } from 'react-router-dom'; import { Truck } from 'lucide-react'; import ProductImage from './ProductImage'; import { inr } from '../utils';
// compact = smaller card so more fit in one row on wide screens
export default function ProductCard({ p, compact = false }) {
  const c = compact, rent = p.availableFor !== 'buy', buy = p.availableFor !== 'rent', both = rent && buy;
  const mode = both ? 'Rent or buy' : rent ? 'Rent' : 'Buy', cta = both ? (c ? 'View & book' : 'View specs & book') : rent ? 'Rent now' : 'Buy now';
  return <Link to={`/products/${p._id}`} className="group rounded-2xl border border-sand bg-white overflow-hidden lift h-full flex flex-col">
    <div className="relative bg-soft">
      <ProductImage p={p} className="aspect-[4/3] w-full object-cover" />
      {buy && !!p.discountPercent && <span className={`absolute bg-green-700 text-white font-semibold rounded-full ${c ? 'top-2 left-2 text-[10px] px-2 py-0.5' : 'top-3 left-3 text-xs px-2.5 py-1'}`}>Save {p.discountPercent}%</span>}
      <span className={`absolute bg-white/95 text-ink font-medium rounded-full shadow-sm ${c ? 'top-2 right-2 text-[10px] px-2 py-0.5' : 'top-3 right-3 text-xs px-2.5 py-1'}`}>{mode}</span></div>
    <div className={`flex flex-col flex-1 ${c ? 'p-3' : 'p-4'}`}>
      <h3 className={`font-semibold text-ink group-hover:text-brand transition-colors ${c ? 'text-sm leading-tight line-clamp-2' : 'text-base line-clamp-2'}`}>{p.name}</h3>
      <p className={`mt-1 text-slate-500 ${c ? 'text-[11px] leading-snug line-clamp-2' : 'text-sm line-clamp-2'}`}>{p.specs?.processor} · {p.specs?.ram} · {p.specs?.storage}</p>
      <div className={`flex-1 ${c ? 'mt-2' : 'mt-3'}`}>
        {rent && <p className="flex items-baseline gap-1"><b className={`text-ink ${c ? 'text-base' : 'text-xl'}`}>{inr(p.rentRates?.monthly)}</b><span className={c ? 'text-[11px]' : 'text-sm'}>/mo</span></p>}
        {rent && <p className={`text-slate-500 ${c ? 'text-[10px]' : 'text-xs'}`}>{inr(p.rentRates?.daily)}/day · {inr(p.rentRates?.weekly)}/week</p>}
        {buy && <p className={`flex items-baseline gap-2 ${rent ? (c ? 'mt-1.5' : 'mt-2') : ''} ${c ? 'text-xs' : 'text-sm'}`}><span>Buy</span><b className="text-ink">{inr(p.sellingPrice)}</b><s className="text-slate-400">{inr(p.mrp)}</s></p>}</div>
      <p className={`flex items-center gap-1.5 text-slate-500 ${c ? 'mt-2 text-[10px]' : 'mt-3 text-xs'}`}><Truck size={c ? 12 : 14} className="text-brand shrink-0" />Delivery &amp; pickup available</p>
      <span className={`mt-3 grid place-items-center rounded-full bg-brand text-white font-semibold ${c ? 'min-h-10 text-xs' : 'min-h-11 text-sm'}`}>{cta}</span></div></Link>;
}