import { useEffect, useState } from 'react'; import { X } from 'lucide-react'; import toast from 'react-hot-toast'; import api from '../services/api';
const SLOTS = ['10:00 AM - 12:00 PM', '12:00 PM - 2:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM'], TOPICS = ['Rent a laptop', 'Buy a laptop', 'Bulk or business order', 'Something else'];
const today = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
export default function BookCall({ open, onClose }) {
  const [f, setF] = useState({ name: '', phone: '', date: '', timeSlot: '', topic: TOPICS[0] }), [booked, setBooked] = useState([]), [busy, setBusy] = useState(false);
  useEffect(() => { if (!open) return; const k = e => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [open, onClose]);
  useEffect(() => { if (!f.date) return setBooked([]); api.get('/calls/slots', { params: { date: f.date } }).then(r => setBooked(r.data)).catch(() => setBooked([])); }, [f.date]);
  if (!open) return null;
  const ch = e => setF({ ...f, [e.target.name]: e.target.value }), inp = 'w-full border border-slate-300 rounded-lg px-3 min-h-11', lab = 'block text-sm text-ink font-medium mb-1';
  const submit = async e => { e.preventDefault(); if (!f.date || !f.timeSlot) return toast.error('Choose a date and a time slot'); setBusy(true);
    try { await api.post('/calls', f); toast.success('Call booked. We will phone you in that slot.'); setF({ ...f, name: '', phone: '', date: '', timeSlot: '' }); onClose(); }
    catch (x) { toast.error(x.response?.data?.message || 'Could not book. Please try again.'); } finally { setBusy(false); } };
  return <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4 overflow-y-auto" onClick={onClose}>
    <form onSubmit={submit} onClick={e => e.stopPropagation()} role="dialog" aria-label="Book a call" className="relative bg-white rounded-2xl w-full max-w-md p-6 space-y-3">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute top-2 right-2 w-11 h-11 grid place-items-center"><X size={18} /></button>
      <h2 className="text-xl font-bold text-ink">Book a call</h2><p className="text-sm">Pick a time and we will phone you.</p>
      <div><label className={lab} htmlFor="bc-name">Your name</label><input id="bc-name" className={inp} name="name" value={f.name} onChange={ch} required /></div>
      <div><label className={lab} htmlFor="bc-phone">Phone (10 digits)</label><input id="bc-phone" className={inp} name="phone" inputMode="numeric" value={f.phone} onChange={ch} required /></div>
      <div><label className={lab} htmlFor="bc-topic">What is it about?</label><select id="bc-topic" className={inp} name="topic" value={f.topic} onChange={ch}>{TOPICS.map(t => <option key={t}>{t}</option>)}</select></div>
      <div><label className={lab} htmlFor="bc-date">Date</label><input id="bc-date" type="date" min={today()} className={inp} value={f.date} onChange={e => setF({ ...f, date: e.target.value, timeSlot: '' })} required /></div>
      {f.date && <div><p className={lab}>Time slot</p><div className="grid grid-cols-2 gap-2">{SLOTS.map(s => { const taken = booked.includes(s);
        return <button type="button" key={s} disabled={taken} aria-pressed={f.timeSlot === s} onClick={() => setF({ ...f, timeSlot: s })} className={`min-h-11 rounded-lg border text-sm ${f.timeSlot === s ? 'bg-brand text-white border-brand' : taken ? 'bg-soft text-slate-400 line-through' : 'border-slate-300'}`}>{s}</button>; })}</div></div>}
      <button disabled={busy} className="w-full bg-brand text-white min-h-12 rounded-xl font-semibold disabled:opacity-60">{busy ? 'Booking…' : 'Book my call'}</button></form></div>;
}