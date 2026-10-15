import { useCallback, useEffect, useState } from 'react'; import toast from 'react-hot-toast'; import { Home as HomeIcon, CalendarDays, Laptop, FileText, Phone, MessageSquare, Users } from 'lucide-react'; import api from '../services/api'; import { inr } from '../utils';
const TABS = [['Overview', HomeIcon], ['Orders', CalendarDays], ['Laptops', Laptop], ['Requests', FileText], ['Calls', Phone], ['Enquiries', MessageSquare], ['Customers', Users]], STATUS = ['Placed', 'Confirmed', 'Delivered', 'Rented', 'Return Requested', 'Returned', 'Completed', 'Cancelled'];
const tone = { green: 'bg-green-100 text-green-800', amber: 'bg-amber-100 text-amber-800', red: 'bg-red-100 text-red-800', gray: 'bg-slate-100 text-slate-700' };
const color = { paid: 'green', approved: 'green', completed: 'green', Completed: 'green', Returned: 'green', Delivered: 'green', Rented: 'green', Confirmed: 'green', contacted: 'green', closed: 'gray', pending: 'amber', Placed: 'amber', unpaid: 'amber', new: 'amber', 'Return Requested': 'amber', rejected: 'red', Cancelled: 'red' };
const Pill = ({ s }) => <span className={`text-xs px-2 py-1 rounded-full ${tone[color[s] || 'gray']}`}>{s}</span>;
const Card = ({ children }) => <div className="border border-slate-200 rounded-xl p-4 bg-white flex flex-wrap justify-between gap-3">{children}</div>;
const Btn = ({ children, ...p }) => <button {...p} className={`px-3 min-h-11 rounded-lg text-sm font-semibold ${p.primary ? 'bg-brand text-white' : 'border border-slate-300 text-ink'}`}>{children}</button>;
const d = x => new Date(x).toLocaleDateString('en-IN'), inp = 'border border-slate-300 rounded-lg px-3 min-h-11 w-full';
const run = async (fn, msg, after) => { try { await fn(); toast.success(msg); after && after(); } catch (e) { toast.error(e.response?.data?.message || 'Action failed'); } };
function useGet(path) { const [data, setData] = useState(null); const load = useCallback(() => api.get(path).then(r => setData(r.data)).catch(() => toast.error('Could not load data')), [path]); useEffect(() => { load(); }, [load]); return [data, load]; }
const Empty = ({ text }) => <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-10 text-center sm:text-left"><svg viewBox="0 0 120 100" width="140" fill="#F3E7D1" stroke="#B8893A" strokeWidth="1.5" aria-hidden="true"><path d="M25 95V50h70v45zM45 95V68a15 15 0 0 1 30 0v27M45 50a15 18 0 0 1 30 0M60 32v-8" /></svg><div><p className="font-serif text-xl text-ink">No records to display</p><p className="text-sm mt-1">{text}</p></div></div>;
const Wait = ({ data, empty, children }) => !data ? <p>Loading…</p> : !data.length ? <Empty text={empty} /> : <div className="space-y-3">{children}</div>;

function Overview() {
  const [s] = useGet('/admin/stats'); if (!s) return <p>Loading…</p>;
  const cards = [['Payments received', inr(s.revenue)], ['Orders', s.orders], ['Active rentals', s.activeRentals], ['Pending requests', s.pendingRequests], ['Low stock (2 or less)', s.lowStock], ['Customers', s.customers], ['New call bookings', s.newCalls], ['New enquiries', s.newEnquiries]];
  return <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{cards.map(([t, v]) => <div key={t} className="border border-slate-200 rounded-xl p-4 bg-white"><p className="text-sm">{t}</p><p className="text-2xl font-bold text-ink mt-1">{v}</p></div>)}</div>;
}
function Orders() {
  const [o, load] = useGet('/orders');
  return <Wait data={o} empty="No orders yet.">{o?.map(x => <Card key={x._id}>
    <div><p className="font-semibold text-ink">{x.orderNo} <Pill s={x.paymentStatus || 'unpaid'} /></p><p className="text-sm">{x.user?.name} · {x.user?.email} · {d(x.createdAt)}</p><p className="text-sm">{x.items.map(i => `${i.name} (${i.mode})`).join(', ')}</p><p className="text-sm">{x.address} · {x.paymentMethod}</p><p className="font-bold text-ink mt-1">{inr(x.total)}</p></div>
    <div className="flex flex-col gap-2 min-w-48"><select className={inp} value={x.status} onChange={e => run(() => api.put(`/orders/${x._id}/status`, { status: e.target.value }), 'Status updated', load)}>{STATUS.map(s => <option key={s}>{s}</option>)}</select>
      {x.paymentStatus !== 'paid' && <Btn primary onClick={() => run(() => api.put(`/admin/orders/${x._id}/payment`, { paymentStatus: 'paid' }), 'Marked as paid', load)}>Mark payment received</Btn>}</div></Card>)}</Wait>;
}
const FIELDS = [['name', 'Name'], ['brand', 'Brand'], ['processor', 'Processor'], ['ram', 'RAM'], ['storage', 'Storage'], ['display', 'Display'], ['mrp', 'MRP (Rs.)', 'number'], ['daily', 'Rent per day', 'number'], ['weekly', 'Rent per week', 'number'], ['monthly', 'Rent per month', 'number'], ['securityDeposit', 'Deposit', 'number'], ['stock', 'Stock', 'number'], ['image', 'Photo path, e.g. /laptops/dell-latitude-5420.jpg']];
const blank = { name: '', brand: '', processor: '', ram: '', storage: '', display: '', mrp: '', discountPercent: 10, daily: '', weekly: '', monthly: '', securityDeposit: '', stock: '', availableFor: 'both', image: '' };
const toForm = p => ({ name: p.name, brand: p.brand, ...p.specs, mrp: p.mrp, discountPercent: p.discountPercent, ...p.rentRates, securityDeposit: p.securityDeposit, stock: p.stock, availableFor: p.availableFor, image: p.images?.[0] || '' });
const toBody = f => ({ name: f.name, brand: f.brand, specs: { processor: f.processor, ram: f.ram, storage: f.storage, display: f.display }, mrp: +f.mrp, discountPercent: +f.discountPercent, rentRates: { daily: +f.daily, weekly: +f.weekly, monthly: +f.monthly }, securityDeposit: +f.securityDeposit, stock: +f.stock, availableFor: f.availableFor, images: f.image ? [f.image] : [] });
function Laptops() {
  const [p, load] = useGet('/admin/products'), [edit, setEdit] = useState(null), [f, setF] = useState(blank), ch = e => setF({ ...f, [e.target.name]: e.target.value });
  const save = e => { e.preventDefault(); run(() => edit === 'new' ? api.post('/products', toBody(f)) : api.put('/products/' + edit, toBody(f)), 'Laptop saved', () => { setEdit(null); load(); }); };
  if (edit) return <form onSubmit={save} className="space-y-3 max-w-2xl"><h2 className="font-semibold text-ink">{edit === 'new' ? 'Add a laptop' : 'Edit laptop'}</h2>
    <div className="grid sm:grid-cols-2 gap-3">{FIELDS.map(([k, l, t]) => <label key={k} className="text-sm">{l}<input className={inp} name={k} type={t || 'text'} value={f[k] ?? ''} onChange={ch} required={k !== 'image' && k !== 'display'} /></label>)}
      <label className="text-sm">Discount<select className={inp} name="discountPercent" value={f.discountPercent} onChange={ch}><option value={5}>5%</option><option value={10}>10%</option></select></label>
      <label className="text-sm">Available for<select className={inp} name="availableFor" value={f.availableFor} onChange={ch}><option value="both">Buy and rent</option><option value="buy">Buy only</option><option value="rent">Rent only</option></select></label></div>
    <div className="flex gap-3"><Btn primary type="submit">Save laptop</Btn><Btn type="button" onClick={() => setEdit(null)}>Cancel</Btn></div></form>;
  return <><Btn primary onClick={() => { setF(blank); setEdit('new'); }}>Add a laptop</Btn><div className="mt-4"><Wait data={p} empty="No laptops yet.">{p?.map(x => <Card key={x._id}>
    <div><p className="font-semibold text-ink">{x.name} {!x.isActive && <Pill s="hidden" />}</p><p className="text-sm">{x.mrp && inr(x.mrp)} · {x.discountPercent}% off · stock {x.stock} · {x.availableFor}</p></div>
    <div className="flex gap-2"><Btn onClick={() => { setF(toForm(x)); setEdit(x._id); }}>Edit</Btn><Btn onClick={() => run(() => api.put('/products/' + x._id, { isActive: !x.isActive }), x.isActive ? 'Hidden from the shop' : 'Visible in the shop', load)}>{x.isActive ? 'Hide' : 'Show'}</Btn></div></Card>)}</Wait></div></>;
}
function Requests() {
  const [q, load] = useGet('/admin/requests'), set = (id, status) => run(() => api.put('/rentals/' + id, { status }), 'Request updated', load);
  return <Wait data={q} empty="No extension or return requests.">{q?.map(x => <Card key={x._id}>
    <div><p className="font-semibold text-ink">{x.order?.orderNo} · {x.type} <Pill s={x.status} /></p><p className="text-sm">{x.user?.name} · {x.user?.phone}</p>
      <p className="text-sm">{x.type === 'extension' ? `Extend ${x.order?.items?.[x.itemIndex]?.name || ''} by ${x.extraUnits} (${inr(x.extraAmount)})` : `Pickup on ${d(x.pickupDate)}`}</p></div>
    <div className="flex gap-2 items-start">{x.status === 'pending' && <><Btn primary onClick={() => set(x._id, 'approved')}>Approve</Btn><Btn onClick={() => set(x._id, 'rejected')}>Reject</Btn></>}{x.type === 'return' && x.status === 'approved' && <Btn primary onClick={() => set(x._id, 'completed')}>Mark returned</Btn>}</div></Card>)}</Wait>;
}
function Inbox({ path, empty, line }) {
  const [rows, load] = useGet('/admin/' + path);
  return <Wait data={rows} empty={empty}>{rows?.map(x => <Card key={x._id}><div><p className="font-semibold text-ink">{x.name} <Pill s={x.status} /></p>{line(x)}</div>
    {x.status === 'new' && <Btn primary onClick={() => run(() => api.put(`/admin/${path}/${x._id}`, { status: 'contacted' }), 'Marked as contacted', load)}>Mark contacted</Btn>}</Card>)}</Wait>;
}
function Customers() {
  const [u, load] = useGet('/admin/users');
  return <Wait data={u} empty="No customers yet.">{u?.map(x => <Card key={x._id}><div><p className="font-semibold text-ink">{x.name} {x.isBlocked && <Pill s="rejected" />}</p><p className="text-sm">{x.email} · {x.phone} · joined {d(x.createdAt)}</p></div>
    <Btn onClick={() => run(() => api.put(`/admin/users/${x._id}/block`, { isBlocked: !x.isBlocked }), x.isBlocked ? 'Unblocked' : 'Blocked', load)}>{x.isBlocked ? 'Unblock' : 'Block'}</Btn></Card>)}</Wait>;
}
export default function AdminDashboard() {
  const [tab, setTab] = useState('Overview');
  return <div className="skyline pb-28"><div className="max-w-6xl mx-auto px-4 py-8"><h1 className="text-2xl font-bold text-ink mb-4">Admin dashboard</h1>
    <div className="flex gap-2 overflow-x-auto pb-2 mb-6">{TABS.map(([t, Icon]) => <button key={t} onClick={() => setTab(t)} aria-pressed={tab === t} className={`px-4 min-h-11 rounded-lg whitespace-nowrap text-sm font-semibold flex items-center gap-2 border ${tab === t ? 'bg-brand text-white border-brand' : 'bg-soft text-ink border-sand'}`}><Icon size={16} />{t}</button>)}</div>
    <div className="ornate rounded-2xl border border-sand bg-white p-5 min-h-72">{tab === 'Overview' && <Overview />}{tab === 'Orders' && <Orders />}{tab === 'Laptops' && <Laptops />}{tab === 'Requests' && <Requests />}
    {tab === 'Calls' && <Inbox path="calls" empty="No call bookings yet." line={x => <p className="text-sm"><a className="text-brand" href={`tel:+91${x.phone}`}>{x.phone}</a> · {x.date} · {x.timeSlot} · {x.topic}</p>} />}
    {tab === 'Enquiries' && <Inbox path="enquiries" empty="No enquiries yet." line={x => <><p className="text-sm">{x.phone} · {x.email}</p><p className="text-sm mt-1">{x.message}</p></>} />}
    {tab === 'Customers' && <Customers />}</div></div></div>;
}