import { Router } from 'express'; import { Product, Order } from '../models/index.js'; import { verifyToken, allowRoles } from '../middleware/auth.js'; import { priceItem, totals } from '../utils/priceEngine.js';
const r = Router(); r.use(verifyToken);
// Prices are ALWAYS recalculated on the server; client totals are display-only.
r.post('/', async (req, res) => {
  try {
    const { items, address, paymentMethod } = req.body; if (!items?.length || !address) return res.status(400).json({ message: 'Cart and address required' });
    const lines = [];
    for (const i of items) {
      const p = await Product.findById(i.product);
      if (!p || !p.isActive || p.stock < i.qty) return res.status(409).json({ message: `${p?.name || 'Item'} is out of stock` });
      lines.push({ product: p._id, name: p.name, mode: i.mode, plan: i.plan, units: i.units, qty: i.qty, ...priceItem(p, i) });
    }
    for (const l of lines) await Product.updateOne({ _id: l.product }, { $inc: { stock: -l.qty } });
    const t = totals(lines, Number(process.env.GST_RATE || 18));
    const order = await Order.create({ orderNo: 'LR' + Date.now(), user: req.user._id, items: lines, address, paymentMethod, ...t });
    res.status(201).json(order);
  } catch (e) { res.status(400).json({ message: e.message }); }
});
r.get('/my', async (req, res) => res.json(await Order.find({ user: req.user._id }).sort('-createdAt')));
r.get('/', allowRoles('admin', 'staff'), async (req, res) => res.json(await Order.find().populate('user', 'name email').sort('-createdAt')));
r.put('/:id/status', allowRoles('admin', 'staff'), async (req, res) => {
  const o = await Order.findById(req.params.id); o.status = req.body.status;
  if (o.status === 'Cancelled') for (const l of o.items) await Product.updateOne({ _id: l.product }, { $inc: { stock: l.qty } });
  await o.save(); res.json(o);
});
export default r;