import { useState } from 'react'; import toast from 'react-hot-toast'; import { Phone, Mail, MapPin, Instagram, MessageCircle } from 'lucide-react'; import api from '../services/api'; import { biz, wa } from '../config';
export default function Contact() {
  const [f, setF] = useState({ name: '', email: '', phone: '', message: '' }); const ch = e => setF({ ...f, [e.target.name]: e.target.value }); const inp = 'w-full border border-slate-300 rounded-lg px-3 min-h-11';
  const send = async e => { e.preventDefault(); try { await api.post('/enquiries', f); toast.success('Message sent. We will contact you soon.'); setF({ name: '', email: '', phone: '', message: '' }); } catch (x) { toast.error(x.response?.data?.message || 'Could not send. Try WhatsApp instead.'); } };
  const row = 'flex items-center gap-3 hover:text-brand';
  return <div className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10"><div><h1 className="text-3xl font-bold text-ink">Contact us</h1>
    <div className="mt-6 space-y-3"><a className={row} href={`tel:+91${biz.phone}`}><Phone size={18} />{biz.phone}</a><a className={row} href={wa()} target="_blank" rel="noreferrer"><MessageCircle size={18} />Chat on WhatsApp</a><a className={row} href={`mailto:${biz.email}`}><Mail size={18} />{biz.email}</a>
      <a className={row} href={biz.instagram} target="_blank" rel="noreferrer"><Instagram size={18} />@mass_murthy</a><p className={row}><MapPin size={18} />{biz.address}</p><p className="text-sm">{biz.hours}</p></div>
    <iframe title="Store location" className="mt-6 w-full h-56 rounded-2xl border-0" loading="lazy" src={`https://www.google.com/maps?q=${encodeURIComponent(biz.mapQuery)}&output=embed`} />
    <a className="inline-block mt-3 text-brand font-semibold" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(biz.mapQuery)}`}>Get directions</a></div>
    <form onSubmit={send} className="space-y-3 border border-slate-200 rounded-2xl p-6 h-fit"><p className="font-semibold text-ink">Send us a message</p>
      <input className={inp} name="name" placeholder="Your name" value={f.name} onChange={ch} required /><input className={inp} name="phone" placeholder="10-digit phone" value={f.phone} onChange={ch} required />
      <input className={inp} name="email" type="email" placeholder="Email (optional)" value={f.email} onChange={ch} /><textarea className={inp + ' py-2 min-h-28'} name="message" placeholder="How can we help?" value={f.message} onChange={ch} required />
      <button className="w-full bg-brand text-white min-h-12 rounded-xl font-semibold">Send message</button></form></div>;
}