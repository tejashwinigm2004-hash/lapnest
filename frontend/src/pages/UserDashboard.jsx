import { useCallback, useEffect, useState } from 'react'; import toast from 'react-hot-toast'; import { payOnline } from '../services/payment'; import api from '../services/api'; import { useApp } from '../context/AppContext'; import { inr } from '../utils';
const tone = { Paid: 'green', 'Payment due': 'amber', Placed: 'amber', pending: 'amber', Confirmed: 'blue', Delivered: 'green', Rented: 'green', approved: 'green', completed: 'green', Returned: 'green', Completed: 'green', Cancelled: 'red', rejected: 'red', 'Return Requested': 'amber' };
const cls = { amber: 'bg-amber-100 text-amber-800', blue: 'bg-blue-100 text-blue-800', green: 'bg-green-100 text-green-800', red: 'bg-red-100 text-red-800' };
const Badge = ({ s }) => <span className={`text-xs px-2 py-1 rounded-full ${cls[tone[s]] || 'bg-slate-100'}`}>{s}</span>;
const ACTIVE = ['Confirmed', 'Delivered', 'Rented'], inp = 'border border-slate-300 rounded-lg px-3 min-h-11';
const date = d => new Date(d).toLocaleDateString('en-IN');

function RentalActions({ o, done }) {
  const rents = o.items.map((it, i) => ({ it, i })).filter(x => x.it.mode === 'rent');
  const [idx, setIdx] = useState(rents[0]?.i), [units, setUnits] = useState(1), [pickup, setPickup] = useState('');
  const send = async (path, body, msg) => { try { await api.post('/rentals/' + path, { orderId: o._id, ...body }); toast.success(msg); done(); } catch (e) { toast.error(e.response?.data?.message || 'Request failed'); } };
  return <div className="mt-3 grid sm:grid-cols-2 gap-3 bg-soft rounded-xl p-3">
    <div className="space-y-2"><p className="text-sm font-semibold text-ink">Extend rental</p>
      <select className={inp + ' w-full'} value={idx} onChange={e => setIdx(+e.target.value)}>{rents.map(({ it, i }) => <option key={i} value={i}>{it.name} (ends {date(it.rentEnd)})</option>)}</select>
      <div className="flex gap-2"><input type="number" min="1" className={inp + ' w-24'} value={units} onChange={e => setUnits(Math.max(1, +e.target.value))} />
        <button className="bg-brand text-white px-4 min-h-11 rounded-lg" onClick={() => send('extension', { itemIndex: idx, extraUnits: units }, 'Extension requested')}>Request</button></div></div>
    <div className="space-y-2"><p className="text-sm font-semibold text-ink">Return laptop</p>
      <input type="date" className={inp + ' w-full'} min={new Date().toISOString().slice(0, 10)} value={pickup} onChange={e => setPickup(e.target.value)} />
      <button className="border border-brand text-brand px-4 min-h-11 rounded-lg" onClick={() => send('return', { pickupDate: pickup }, 'Return requested')}>Request pickup</button></div></div>;
}

export default function UserDashboard() {
  const { user } = useApp(); const [orders, setOrders] = useState(null), [reqs, setReqs] = useState([]);
  const load = useCallback(() => { api.get('/orders/my').then(r => setOrders(r.data)); api.get('/rentals/my').then(r => setReqs(r.data)); }, []);
  useEffect(load, [load]);
  const invoice = async o => {
    try { const r = await api.get(`/invoices/${o._id}/download`, { responseType: 'blob' }); const url = URL.createObjectURL(r.data), a = document.createElement('a'); a.href = url; a.download = `invoice-${o.orderNo}.pdf`; a.click(); URL.revokeObjectURL(url); }
    catch { toast.error('Could not download the invoice'); }
  };
  if (!orders) return <p className="p-8">Loading your account…</p>;
  return <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
    <h1 className="text-2xl font-bold text-ink">Hello, {user?.name}</h1>
    <section><h2 className="font-semibold text-ink mb-3">Your orders</h2>
      {!orders.length ? <p>No orders yet. Pick a laptop to rent or buy.</p> : <div className="space-y-4">{orders.map(o => <div key={o._id} className="border border-slate-200 rounded-xl p-4">
        <div className="flex flex-wrap justify-between gap-2"><div><p className="font-semibold text-ink">{o.orderNo}</p><p className="text-xs">{date(o.createdAt)}</p></div><div className="flex gap-2"><Badge s={o.status} />{o.status !== 'Cancelled' && <Badge s={o.paymentStatus === 'paid' ? 'Paid' : 'Payment due'} />}</div></div>
        <ul className="mt-2 text-sm space-y-1">{o.items.map((i, x) => <li key={x}>{i.name} · {i.mode === 'buy' ? 'Buy' : `Rent ${i.units} ${i.plan}, until ${date(i.rentEnd)}`}</li>)}</ul>
        <div className="mt-3 flex items-center justify-between"><p className="font-bold text-ink">{inr(o.total)}</p>
          <div className="flex items-center gap-4">{o.paymentStatus !== 'paid' && o.status !== 'Cancelled' && <button onClick={() => payOnline(o, user, load)} className="bg-brand text-white px-4 min-h-11 rounded-lg font-semibold">Pay now</button>}{o.status !== 'Cancelled' && <button onClick={() => invoice(o)} className="text-brand font-semibold min-h-11">Download invoice</button>}</div></div>
        {ACTIVE.includes(o.status) && o.items.some(i => i.mode === 'rent') && <RentalActions o={o} done={load} />}
        {o.status === 'Placed' && <p className="text-sm mt-2">Waiting for payment confirmation. Extend and return unlock once the order is confirmed.</p>}</div>)}</div>}</section>
    {reqs.length > 0 && <section><h2 className="font-semibold text-ink mb-3">Extension and return requests</h2><div className="space-y-2">{reqs.map(q => <div key={q._id} className="border border-slate-200 rounded-xl p-3 flex flex-wrap justify-between gap-2 text-sm">
      <span>{q.order?.orderNo} · {q.type === 'extension' ? `Extend by ${q.extraUnits} (${inr(q.extraAmount)})` : `Return pickup ${date(q.pickupDate)}`}{q.adminNote && ` · Note: ${q.adminNote}`}</span><Badge s={q.status} /></div>)}</div></section>}
  </div>;
}