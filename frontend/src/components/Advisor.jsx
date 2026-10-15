import { useMemo, useState } from 'react'; import { Link } from 'react-router-dom'; import { Scale } from 'lucide-react'; import Reveal from './Reveal'; import { inr } from '../utils';
const USES = [['Office and study', 8, 'Documents, browsing, video calls'], ['Design and coding', 16, 'Heavier software, multitasking'], ['Anything', 0, 'Show me every laptop']];
// Cheapest way to cover `days` of rent by mixing monthly, weekly and daily plans
const rentCost = (r, days) => { let best = Infinity; for (let m = 0; m <= Math.ceil(days / 30); m++) for (let w = 0; w <= Math.ceil(Math.max(0, days - m * 30) / 7); w++) best = Math.min(best, m * r.monthly + w * r.weekly + Math.max(0, days - m * 30 - w * 7) * r.daily); return best; };
const breakEven = p => { for (let d = 1; d <= 730; d++) if (rentCost(p.rentRates, d) >= p.sellingPrice) return d; return 730; };
export default function Advisor({ items }) {
  const [use, setUse] = useState(0), [weeks, setWeeks] = useState(4), days = weeks * 7;
  const rows = useMemo(() => (items || []).filter(p => !USES[use][1] || parseInt(p.specs?.ram) >= USES[use][1]).map(p => {
    const canRent = p.availableFor !== 'buy', canBuy = p.availableFor !== 'rent', rent = rentCost(p.rentRates, days), buy = p.sellingPrice;
    const verdict = !canBuy ? 'rent' : !canRent ? 'buy' : rent <= buy * 0.8 ? 'rent' : 'buy';   // owning wins once renting costs about as much as buying
    return { p, rent, buy, verdict, cost: verdict === 'rent' ? rent : buy, be: breakEven(p) };
  }).sort((a, b) => a.cost - b.cost).slice(0, 3), [items, use, days]);
  if (!items) return null;
  const best = rows[0], btn = 'text-left rounded-xl border px-4 py-3 min-h-11';
  let chart = null;
  if (best) {
    const rr = best.p.rentRates, maxD = Math.max(Math.ceil(best.be * 1.4), days + 14, 60), N = 36, pts = Array.from({ length: N + 1 }, (_, i) => { const d = Math.round(maxD * i / N); return [d, rentCost(rr, d)]; });
    const yMax = Math.max(best.buy * 1.15, pts[N][1]), X = d => 24 + d / maxD * 280, Y = v => 140 - v / yMax * 120;
    chart = <svg viewBox="0 0 320 160" className="w-full" role="img" aria-label={`Cost of renting against buying ${best.p.name} over time`}>
      <path d="M24 140H304M24 20V140" stroke="#D9C29A" fill="none" />
      <line x1="24" x2="304" y1={Y(best.buy)} y2={Y(best.buy)} stroke="#B8893A" strokeDasharray="5 4" />
      <text x="28" y={Y(best.buy) - 5} fontSize="10" fill="#8A735A">Buy {inr(best.buy)}</text>
      <path key={best.p._id + use} className="draw" pathLength="1" d={pts.map(([d, v], i) => `${i ? 'L' : 'M'}${X(d).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ')} fill="none" stroke="#8A3A1C" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1={X(days)} x2={X(days)} y1="20" y2="140" stroke="#8A3A1C" strokeOpacity=".35" />
      <circle cx={X(Math.min(best.be, maxD))} cy={Y(best.buy)} r="5" fill="#B8893A" stroke="#fff" strokeWidth="2" />
      <text x="304" y="154" fontSize="10" textAnchor="end" fill="#8A735A">{Math.round(maxD / 7)} weeks</text><text x="24" y="154" fontSize="10" fill="#8A735A">0</text></svg>;
  }
  return <section className="max-w-6xl mx-auto px-4 pb-14"><Reveal className="text-center mb-6"><h2 className="font-serif text-3xl font-bold text-ink flex items-center justify-center gap-3"><Scale className="text-brand" />Rent or buy? Find out in seconds</h2>
    <p className="mt-2 max-w-xl mx-auto">Tell us what you need and for how long. We work out the cheaper way and show where the two costs meet.</p></Reveal>
    <Reveal className="ornate bg-white border border-sand rounded-2xl p-5 md:p-8 grid lg:grid-cols-2 gap-8">
      <div className="space-y-6"><div><p className="font-semibold text-ink mb-2">What will you use it for?</p><div className="grid gap-2">{USES.map(([t, , d], i) =>
        <button key={t} onClick={() => setUse(i)} aria-pressed={use === i} className={`${btn} ${use === i ? 'bg-brand text-white border-brand' : 'bg-soft border-sand text-ink'}`}><span className="font-semibold block">{t}</span><span className="text-xs opacity-80">{d}</span></button>)}</div></div>
        <div><label htmlFor="adv-weeks" className="font-semibold text-ink flex justify-between">How long do you need it?<span className="text-brand">{weeks} week{weeks > 1 ? 's' : ''}</span></label>
          <input id="adv-weeks" type="range" min="1" max="52" value={weeks} onChange={e => setWeeks(+e.target.value)} className="w-full mt-3 accent-brand" /><div className="flex justify-between text-xs"><span>1 week</span><span>1 year</span></div></div></div>
      <div>{!best ? <p className="py-10 text-center">No laptop in stock matches that use. Try "Anything".</p> : <>
        <div key={best.verdict + use} className="anim-up"><p className={`inline-block rounded-full px-4 py-1 text-sm font-semibold ${best.verdict === 'rent' ? 'bg-brand text-white' : 'bg-gold text-white'}`}>{best.verdict === 'rent' ? `Renting is cheaper for ${weeks} week${weeks > 1 ? 's' : ''}` : `Buying is the smarter choice for ${weeks} weeks`}</p>
          <p className="mt-3 text-sm"><b className="text-ink">{best.p.name}</b>: rent {inr(best.rent)} against buy {inr(best.buy)}. The two cost the same at about <b className="text-ink">{Math.max(1, Math.round(best.be / 7))} weeks</b>.{best.verdict === 'rent' && ` A refundable deposit of ${inr(best.p.securityDeposit)} is added when you rent.`}</p></div>
        <div className="mt-3">{chart}</div>
        <div className="mt-3 grid gap-2">{rows.map(r => <Link key={r.p._id} to={`/products/${r.p._id}`} className="lift flex items-center justify-between gap-3 rounded-xl border border-sand bg-soft px-4 py-2 min-h-11">
          <span className="text-sm"><b className="text-ink">{r.p.name}</b> <span className="text-xs">{r.p.specs?.ram} · {r.p.specs?.storage}</span></span><span className={`text-xs font-semibold px-2 py-1 rounded-full ${r.verdict === 'rent' ? 'bg-brand text-white' : 'bg-gold text-white'}`}>{r.verdict === 'rent' ? `Rent ${inr(r.rent)}` : `Buy ${inr(r.buy)}`}</span></Link>)}</div></>}</div></Reveal></section>;
}