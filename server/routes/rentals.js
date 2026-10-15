import { Router } from 'express'; import { Order, Product, RentalRequest } from '../models/index.js'; import { verifyToken, allowRoles } from '../middleware/auth.js'; import { PLAN_DAYS } from '../utils/priceEngine.js';
const r = Router(); r.use(verifyToken);
const ACTIVE = ['Confirmed', 'Delivered', 'Rented'];
const own = async (req, res) => { const o = await Order.findOne({ _id: req.body.orderId, user: req.user._id }); if (!o) res.status(404).json({ message: 'Order not found' }); return o; };
r.post('/extension', async (req, res) => {
  const o = await own(req, res); if (!o) return;
  const item = o.items[req.body.itemIndex], extra = Number(req.body.extraUnits);
  if (!item || item.mode !== 'rent' || !ACTIVE.includes(o.status) || !(extra >= 1)) return res.status(400).json({ message: 'This rental cannot be extended' });
  if (await RentalRequest.findOne({ order: o._id, itemIndex: req.body.itemIndex, type: 'extension', status: 'pending' })) return res.status(409).json({ message: 'An extension is already pending' });
  const p = await Product.findById(item.product); // extra rent is priced on the server
  res.status(201).json(await RentalRequest.create({ order: o._id, user: req.user._id, itemIndex: req.body.itemIndex, type: 'extension', extraUnits: extra, extraAmount: p.rentRates[item.plan] * extra * item.qty }));
});
r.post('/return', async (req, res) => {
  const o = await own(req, res); if (!o) return;
  if (!ACTIVE.includes(o.status) || !o.items.some(i => i.mode === 'rent')) return res.status(400).json({ message: 'No active rental on this order' });
  if (!req.body.pickupDate) return res.status(400).json({ message: 'Choose a pickup date' });
  o.status = 'Return Requested'; await o.save();
  res.status(201).json(await RentalRequest.create({ order: o._id, user: req.user._id, type: 'return', pickupDate: req.body.pickupDate, address: req.body.address || o.address }));
});
r.get('/my', async (req, res) => res.json(await RentalRequest.find({ user: req.user._id }).populate('order', 'orderNo').sort('-createdAt')));
// Admin: approve / reject / complete (return received)
r.put('/:id', allowRoles('admin', 'staff'), async (req, res) => {
  const q = await RentalRequest.findById(req.params.id), o = await Order.findById(q.order);
  q.status = req.body.status; q.adminNote = req.body.adminNote; await q.save();
  if (q.type === 'extension' && q.status === 'approved') {
    const it = o.items[q.itemIndex]; it.units += q.extraUnits; it.price += q.extraAmount;
    const e = new Date(it.rentEnd); e.setDate(e.getDate() + q.extraUnits * PLAN_DAYS[it.plan]); it.rentEnd = e;
    o.subtotal += q.extraAmount; o.gst = Math.round(o.subtotal * Number(process.env.GST_RATE || 18) / 100); o.total = o.subtotal + o.gst + o.deposit;
  }
  if (q.type === 'return' && q.status === 'rejected') o.status = 'Rented';
  if (q.type === 'return' && q.status === 'completed') { o.status = 'Returned'; for (const i of o.items) if (i.mode === 'rent') await Product.updateOne({ _id: i.product }, { $inc: { stock: i.qty } }); }
  await o.save(); res.json(q);
});
export default r;