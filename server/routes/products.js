import { Router } from 'express'; import { Product } from '../models/index.js'; import { verifyToken, allowRoles } from '../middleware/auth.js'; import { sellingPrice } from '../utils/priceEngine.js';
const r = Router(); const view = p => ({ ...p.toObject(), sellingPrice: sellingPrice(p) });
r.get('/', async (req, res) => {
  const { q, brand, ram, availableFor, sort, page = 1 } = req.query, f = { isActive: true };
  if (q) f.$text = { $search: String(q) }; if (brand) f.brand = String(brand); if (ram) f['specs.ram'] = String(ram);
  if (availableFor) f.availableFor = { $in: [String(availableFor), 'both'] };
  const order = { price_asc: { mrp: 1 }, price_desc: { mrp: -1 } }[sort] || { createdAt: -1 };
  const items = await Product.find(f).sort(order).skip((page - 1) * 12).limit(12);
  res.json(items.map(view));
});
r.get('/:id', async (req, res) => { const p = await Product.findById(req.params.id); p ? res.json(view(p)) : res.status(404).json({ message: 'Not found' }); });
const adm = [verifyToken, allowRoles('admin', 'staff')];
r.post('/', ...adm, async (req, res) => res.status(201).json(await Product.create(req.body)));
r.put('/:id', ...adm, async (req, res) => res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })));
r.delete('/:id', ...adm, async (req, res) => { await Product.findByIdAndUpdate(req.params.id, { isActive: false }); res.json({ ok: true }); });
export default r;