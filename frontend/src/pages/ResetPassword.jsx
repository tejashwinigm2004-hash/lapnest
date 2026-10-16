import { useState } from 'react'; import { Link, useNavigate, useParams } from 'react-router-dom'; import toast from 'react-hot-toast'; import { Eye, EyeOff } from 'lucide-react';
import Shapes from '../components/Shapes'; import api from '../services/api';
export default function ResetPassword() {
  const { token } = useParams(), nav = useNavigate();
  const [password, setPassword] = useState(''), [confirm, setConfirm] = useState(''), [show, setShow] = useState(false), [busy, setBusy] = useState(false);
  const submit = async e => { e.preventDefault();
    if (password !== confirm) return toast.error('The two passwords do not match');
    setBusy(true);
    try { const { data } = await api.post('/auth/reset-password', { token, password }); toast.success(data.message); nav('/login'); }
    catch (err) { toast.error(err.response?.data?.message || 'Something went wrong'); }
    setBusy(false); };
  return <div className="relative overflow-hidden pb-10"><Shapes /><div className="relative z-10 max-w-md mx-auto px-4">
    <form onSubmit={submit} className="p-6 mt-10 space-y-3 border border-slate-200 rounded-2xl bg-white/90 backdrop-blur">
      <h1 className="text-xl font-bold text-ink">Set a new password</h1>
      <p className="text-sm">Use at least 8 characters with upper and lower case letters and a number.</p>
      <div className="relative">
        <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="New password" required className="w-full border border-slate-300 rounded-lg pl-3 pr-12 min-h-11" />
        <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show} className="absolute inset-y-0 right-0 w-11 grid place-items-center text-slate-500 hover:text-ink">{show ? <EyeOff size={20} /> : <Eye size={20} />}</button></div>
      <input type={show ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm new password" required className="w-full border border-slate-300 rounded-lg px-3 min-h-11" />
      <button disabled={busy} className="w-full bg-brand text-white min-h-11 rounded-lg font-semibold disabled:opacity-60">{busy ? 'Saving…' : 'Change password'}</button>
      <p className="text-sm"><Link to="/login">Back to sign in</Link></p></form></div></div>;
}