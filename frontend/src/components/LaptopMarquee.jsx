import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';
import { inr } from '../utils';
// Full-screen laptop wall. Two columns scroll up and down in opposite directions. Pauses on hover.
const SHAPES = ['aspect-[4/3]', 'aspect-[4/5]', 'aspect-square', 'aspect-[3/4]'];
const fill = a => { let r = a; while (r.length < 5) r = [...r, ...a]; return r; };
function Column({ list, dir, offset, dur }) {
  const half = hidden => list.map((p, i) => <Link key={`${p._id}-${i}-${hidden}`} to={`/products/${p._id}`} tabIndex={hidden ? -1 : 0} aria-hidden={hidden || undefined} className="group relative block overflow-hidden rounded-3xl bg-white/5">
    <ProductImage p={p} className={`${SHAPES[(i + offset) % 4]} w-full transition-transform duration-500 group-hover:scale-105`} />
    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/75 to-transparent text-white"><p className="text-sm font-semibold line-clamp-1">{p.name}</p><p className="text-xs opacity-90">{p.availableFor !== 'buy' ? `Rent from ${inr(p.rentRates.monthly)}/mo` : `Buy ${inr(p.sellingPrice)}`}</p></div></Link>);
  return <div className={`${dir === 'up' ? 'mq-up' : 'mq-down'} flex flex-col will-change-transform`} style={{ animationDuration: `${dur}s` }}><div className="flex flex-col gap-4 pb-4">{half(false)}</div><div className="flex flex-col gap-4 pb-4">{half(true)}</div></div>;
}
export default function LaptopMarquee({ items }) {
  if (!items?.length) return null;
  const mask = 'linear-gradient(to bottom, transparent, #000 10%, #000 90%, transparent)';
  const cols = [0, 1].map(c => { const l = items.filter((_, i) => i % 2 === c); return l.length ? l : [...items].reverse(); });
  return <section aria-label="Laptop showcase" className="relative bg-[#1b1b1b] text-white overflow-hidden" style={{ height: '100svh' }}>
    <style>{`@keyframes mqUp{from{transform:translateY(0)}to{transform:translateY(-50%)}}@keyframes mqDown{from{transform:translateY(-50%)}to{transform:translateY(0)}}.mq-up{animation:mqUp 50s linear infinite}.mq-down{animation:mqDown 56s linear infinite}.mq:hover .mq-up,.mq:hover .mq-down{animation-play-state:paused}@media (prefers-reduced-motion:reduce){.mq-up,.mq-down{animation:none}}`}</style>
    <div className="mq absolute inset-0 mx-auto max-w-4xl grid grid-cols-2 gap-4 px-4" style={{ maskImage: mask, WebkitMaskImage: mask }}>
      <Column list={fill(cols[0])} dir="up" offset={0} dur={50} />
      <Column list={fill(cols[1])} dir="down" offset={1} dur={58} />
    </div>
    <div className="absolute inset-0 bg-black/60 pointer-events-none grid place-items-center px-4">
      <div className="text-center max-w-2xl">
        <p className="text-sm font-semibold text-gold">Laptops for every need</p>
        <h2 className="mt-2 font-serif text-4xl md:text-6xl font-bold text-white">The right laptop for every job</h2>
        <p className="mt-4 text-white/85 text-lg">Office, study, design or coding. Rent for a day, a week or a month, or buy at 5 to 10% off.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 pointer-events-auto">
          <Link to="/products?availableFor=rent" className="bg-brand text-white px-8 min-h-12 grid place-items-center rounded-xl font-semibold">Rent a laptop</Link>
          <Link to="/products" className="border border-white/60 text-white px-8 min-h-12 grid place-items-center rounded-xl font-semibold">Browse all</Link>
        </div>
      </div>
    </div>
  </section>;
}