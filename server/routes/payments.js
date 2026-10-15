import { Router } from 'express'; import crypto from 'crypto'; import Razorpay from 'razorpay'; import { Order } from '../models/index.js'; import { verifyToken } from '../middleware/auth.js';
const r = Router(); r.use(verifyToken);
// Step 1: create a Razorpay order for an existing LapNest order. The amount comes from the database, never from the browser.
r.post('/create', async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return res.status(503).json({ message: 'Online payment is not set up yet' });
    if (!/^rzp_(test|live)_/.test(process.env.RAZORPAY_KEY_ID)) return res.status(503).json({ message: 'RAZORPAY_KEY_ID in .env looks wrong (it should start with rzp_test_)' });
    const o = await Order.findOne({ _id: req.body.orderId, user: req.user._id });
    if (!o || o.paymentStatus === 'paid' || o.status === 'Cancelled') return res.status(400).json({ message: 'This order cannot be paid' });
    const rz = await new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET }).orders.create({ amount: Math.round(o.total * 100), currency: 'INR', receipt: o.orderNo });
    o.razorpayOrderId = rz.id; await o.save();
    res.json({ keyId: process.env.RAZORPAY_KEY_ID, razorpayOrderId: rz.id, amount: rz.amount, orderNo: o.orderNo });
  } catch (e) {
    const why = e?.error?.description || e?.message || 'unknown error';   // Razorpay's own reason, e.g. "Authentication failed"
    console.error('Razorpay create failed:', e?.statusCode || '', why);
    res.status(502).json({ message: process.env.NODE_ENV === 'production' ? 'Could not start the payment. Please try again.' : 'Payment could not start: ' + why });
  }
});
// Step 2: check Razorpay's signature. Only a valid signature marks the order paid.
r.post('/verify', async (req, res) => {
  const { orderId, razorpay_order_id: rid, razorpay_payment_id: pid, razorpay_signature: sig } = req.body;
  const o = await Order.findOne({ _id: orderId, user: req.user._id });
  if (!o || !rid || o.razorpayOrderId !== rid || typeof sig !== 'string') return res.status(400).json({ message: 'Payment details do not match' });
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${rid}|${pid}`).digest('hex');
  if (expected.length !== sig.length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return res.status(400).json({ message: 'Payment could not be verified' });
  o.paymentStatus = 'paid'; o.razorpayPaymentId = pid; o.paymentMethod = 'razorpay'; if (o.status === 'Placed') o.status = 'Confirmed';
  await o.save(); res.json({ ok: true });
});
export default r;