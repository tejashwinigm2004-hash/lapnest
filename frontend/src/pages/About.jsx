import { ShieldCheck, Wrench, BadgePercent } from 'lucide-react'; import { biz } from '../config';
export default function About() {
  return <div className="max-w-3xl mx-auto px-4 py-12"><h1 className="text-3xl font-bold text-ink">About {biz.name}</h1>
    <p className="mt-4 text-lg">{biz.name} gives students, startups and teams a simple way to get a good laptop without paying full price. Rent one for a week or a month, or buy it at 5–10% below MRP.</p>{/* TODO: replace with your real story */}
    <div className="mt-10 grid gap-6 sm:grid-cols-3">{[[ShieldCheck, 'Checked laptops', 'Each laptop is inspected before it goes out.'], [BadgePercent, 'Clear pricing', 'Rent, deposit and GST are shown before you order.'], [Wrench, 'Support included', 'Call or message us if anything goes wrong.']].map(([I, t, d]) => <div key={t}><I className="text-brand" /><p className="font-semibold text-ink mt-2">{t}</p><p className="text-sm mt-1">{d}</p></div>)}</div></div>;
}