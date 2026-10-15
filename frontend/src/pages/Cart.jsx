import { useState } from 'react'; import { useNavigate } from 'react-router-dom'; import toast from 'react-hot-toast';
import { payOnline } from '../services/payment'; import api from '../services/api'; import { useApp } from '../context/AppContext'; import { inr, rentPreview } from '../utils';
const GST = 18; // display only; the server calculates the real total
export default function Cart() {
  const { cart, removeFromCart, setCart, user } = useApp(); const nav = useNavigate(); const [address, setAddress] = useState(''); const [pay, setPay] = useState('razorpay');
  const lines = cart.map(i => { if (i.mode === 'buy') return { price: i.buyPrice * i.qty, deposit: 0 }; const r = rentPreview({ rentRates: i.rentRates, securityDeposit: i.deposit }, i.plan, i.units, i.qty); return { price: r.rent, deposit: r.deposit }; });
  const sub = lines.reduce((s, l) => s + l.price, 0), dep = lines.reduce((s, l) => s + l.deposit, 0), gst = Math.round(sub * GST / 100);
  const place = async () => {
    if (!user) return nav('/login'); if (!address.trim()) return toast.error('Enter a delivery address');
    try { const { data } = await api.post('/orders', { items: cart, address, paymentMethod: pay }); setCart([]); toast.success('Order ' + data.orderNo + ' placed'); if (pay === 'razorpay') await payOnline(data, user, () => nav('/user')); else nav('/user'); }
    catch (e) { toast.error(e.response?.data?.message || 'Could not place order'); }
  };
  if (!cart.length) return <p className="p-8 text-center">Your cart is empty. Browse laptops to rent or buy.</p>;
  return <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
    {cart.map((i, x) => <div key={x} className="border border-slate-200 rounded-xl p-4 flex justify-between gap-4">
      <div><p className="font-semibold text-ink">{i.name}</p><p className="text-sm">{i.mode === 'buy' ? 'Buy' : `Rent · ${i.units} ${i.plan} unit(s) from ${i.startDate}`}</p></div>
      <div className="text-right"><p className="font-semibold">{inr(lines[x].price)}</p><button className="text-sm text-red-600" onClick={() => removeFromCart(x)}>Remove</button></div></div>)}
    <div className="bg-soft rounded-xl p-4 space-y-1"><p className="flex justify-between"><span>Subtotal</span>{inr(sub)}</p><p className="flex justify-between"><span>GST ({GST}%)</span>{inr(gst)}</p>
      <p className="flex justify-between"><span>Refundable deposit</span>{inr(dep)}</p><p className="flex justify-between font-bold text-ink"><span>Total</span>{inr(sub + gst + dep)}</p></div>
    <textarea className="w-full border border-slate-300 rounded-lg p-3" placeholder="Delivery address" value={address} onChange={e => setAddress(e.target.value)} />
    <select className="border border-slate-300 rounded-lg px-3 min-h-11" value={pay} onChange={e => setPay(e.target.value)}><option value="razorpay">Pay online (Razorpay)</option><option value="upi">UPI</option><option value="bank">Bank transfer</option><option value="cod">Cash</option></select>
    <button onClick={place} className="w-full bg-brand text-white min-h-12 rounded-xl font-semibold">Place order</button></div>;
}