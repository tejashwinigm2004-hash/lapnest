import { Link } from 'react-router-dom'; import ProductImage from './ProductImage'; import { inr } from '../utils';
// compact = smaller card so 8 fit in one row on wide screens
export default function ProductCard({ p, compact = false }) {
  const c = compact, mode = p.availableFor === 'both' ? (c ? 'Buy/Rent' : 'Buy or rent') : p.availableFor === 'buy' ? 'Buy' : 'Rent', rent = p.availableFor !== 'buy', buy = p.availableFor !== 'rent';
  return <Link to={`/products/${p._id}`} className="ornate rounded-2xl border border-sand bg-white overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
    <div className={`relative ${c ? 'p-2.5 pb-0' : 'p-3 pb-0'}`}><ProductImage p={p} className="aspect-[4/3] w-full rounded-xl" />
      <span className={`absolute z-[3] bg-gold text-white font-semibold rounded-full ${c ? 'top-4 left-4 text-[10px] px-1.5 py-0.5' : 'top-5 left-5 text-xs px-2 py-1'}`}>{p.discountPercent}% off</span>
      <span className={`absolute z-[3] bg-white/90 text-ink rounded-full ${c ? 'top-4 right-4 text-[10px] px-1.5 py-0.5' : 'top-5 right-5 text-xs px-2 py-1'}`}>{mode}</span></div>
    <div className={`flex flex-col flex-1 ${c ? 'p-2.5' : 'p-4'}`}><h3 className={`font-serif font-semibold text-ink ${c ? 'text-sm leading-tight line-clamp-2' : ''}`}>{p.name}</h3>
      <p className={c ? 'text-[11px] leading-snug mt-1 line-clamp-2' : 'text-sm'}>{p.specs.processor} · {p.specs.ram} · {p.specs.storage}</p>
      <div className={`flex-1 ${c ? 'mt-2 text-[11px]' : 'mt-3 text-sm'}`}>{rent && <p>Rental <b className="text-ink">{inr(p.rentRates.daily)}</b>/day</p>}{buy && <p>Purchase <b className="text-ink">{inr(p.sellingPrice)}</b> <s>{inr(p.mrp)}</s></p>}</div>
      <span className={`mt-3 grid place-items-center rounded-full bg-brand text-white font-semibold ${c ? 'min-h-10 text-xs' : 'min-h-11 text-sm'}`}>{c ? 'View & book' : 'View specs & book'}</span></div></Link>;
}