import toast from 'react-hot-toast'; import api from './api'; import { biz } from '../config';
const loadRazorpay = () => new Promise(res => { if (window.Razorpay) return res(true); const s = document.createElement('script'); s.src = 'https://checkout.razorpay.com/v1/checkout.js'; s.onload = () => res(true); s.onerror = () => res(false); document.body.appendChild(s); });
// Opens the Razorpay window for an order. done() runs when the window closes or the payment finishes.
export async function payOnline(order, user, done = () => {}) {
  try {
    if (!(await loadRazorpay())) { toast.error('Could not open the payment window. You can pay from My account.'); return done(); }
    const { data: c } = await api.post('/payments/create', { orderId: order._id });
    new window.Razorpay({ key: c.keyId, amount: c.amount, currency: 'INR', name: biz.name, description: 'Order ' + c.orderNo, order_id: c.razorpayOrderId, prefill: { name: user?.name, email: user?.email }, theme: { color: '#1E4FD8' },
      handler: async resp => { try { await api.post('/payments/verify', { orderId: order._id, ...resp }); toast.success('Payment received'); } catch { toast.error('We could not verify the payment. Contact us with order ' + order.orderNo); } done(); },
      modal: { ondismiss: () => { toast('Payment not completed. You can pay from My account.'); done(); } } }).open();
  } catch (e) { toast.error(e.response?.data?.message || 'Could not start the payment'); done(); }
}