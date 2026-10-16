import { useState } from 'react'; import Shapes from '../components/Shapes'; import Laptop3D from '../components/Laptop3D'; import { Link, useNavigate } from 'react-router-dom'; import toast from 'react-hot-toast'; import { Eye, EyeOff } from 'lucide-react';
import api from '../services/api'; import { useApp } from '../context/AppContext';
export default function Auth({ register }) {
  const [f, setF] = useState({}); const [show, setShow] = useState(false); const { login } = useApp(); const nav = useNavigate(); const ch = e => setF({ ...f, [e.target.name]: e.target.value });
  const submit = async e => { e.preventDefault();
    try { const { data } = await api.post(register ? '/auth/register' : '/auth/login', f); login(data); nav(data.user.role === 'user' ? '/' : '/admin'); }
    catch (err) { toast.error(err.response?.data?.message || 'Something went wrong'); } };
  const field = (name, label, type = 'text') => <input name={name} type={type} placeholder={label} onChange={ch} required className="w-full border border-slate-300 rounded-lg px-3 min-h-11" />;
  const password = <div className="relative">
    <input name="password" type={show ? 'text' : 'password'} placeholder="Password" onChange={ch} required className="w-full border border-slate-300 rounded-lg pl-3 pr-12 min-h-11" />
    <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show} className="absolute inset-y-0 right-0 w-11 grid place-items-center text-slate-500 hover:text-ink">{show ? <EyeOff size={20} /> : <Eye size={20} />}</button></div>;
  return <div className="relative overflow-hidden pb-10"><Shapes /><div className="relative z-10 max-w-4xl mx-auto grid lg:grid-cols-2 items-center gap-6 px-4"><form key={String(register)} onSubmit={submit} className="w-full max-w-sm mx-auto p-6 mt-10 space-y-3 border border-slate-200 rounded-2xl bg-white/90 backdrop-blur">
    <h1 className="text-xl font-bold text-ink">{register ? 'Create your account' : 'Sign in'}</h1>
    {register && <>{field('name', 'Full name')}{field('phone', '10-digit phone')}</>}{field('email', 'Email', 'email')}{password}
    <button className="w-full bg-brand text-white min-h-11 rounded-lg font-semibold">{register ? 'Create account' : 'Sign in'}</button>
    <p className="text-sm">{register ? <Link to="/login">Have an account? Sign in</Link> : <Link to="/register">New here? Create an account</Link>}</p></form><div className="hidden lg:block mt-10"><Laptop3D /></div></div></div>;
}