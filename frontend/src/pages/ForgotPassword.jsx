import { useState } from 'react'; import { Link } from 'react-router-dom'; import toast from 'react-hot-toast';
import Shapes from '../components/Shapes'; import api from '../services/api';
export default function ForgotPassword() {
  const [email, setEmail] = useState(''); const [busy, setBusy] = useState(false); const [sent, setSent] = useState(false);
  const submit = async e => { e.preventDefault(); setBusy(true);
    try { await api.post('/auth/forgot-password', { email }); setSent(true); }
    catch (err) { toast.error(err.response?.data?.message || 'Something went wrong'); }
    setBusy(false); };
  return <div className="relative overflow-hidden pb-10"><Shapes /><div className="relative z-10 max-w-md mx-auto px-4">
    <div className="p-6 mt-10 space-y-3 border border-slate-200 rounded-2xl bg-white/90 backdrop-blur">
      <h1 className="text-xl font-bold text-ink">Forgot your password?</h1>
      {sent
        ? <p className="text-sm">If this email is registered, we have sent a reset link to it. The link works for 15 minutes. Check your spam folder too.</p>
        : <form onSubmit={submit} className="space-y-3">
            <p className="text-sm">Enter your email and we will send you a link to set a new password.</p>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full border border-slate-300 rounded-lg px-3 min-h-11" />
            <button disabled={busy} className="w-full bg-brand text-white min-h-11 rounded-lg font-semibold disabled:opacity-60">{busy ? 'Sending…' : 'Send reset link'}</button></form>}
      <p className="text-sm"><Link to="/login">Back to sign in</Link></p></div></div></div>;
}