import { Router } from 'express'; import { Order } from '../models/index.js'; import { verifyToken } from '../middleware/auth.js'; import { writeInvoice } from '../utils/generateInvoice.js';
const r = Router(); r.use(verifyToken);
r.get('/:orderId/download', async (req, res) => {
  const o = await Order.findById(req.params.orderId).populate('user', 'name email');
  if (!o) return res.status(404).json({ message: 'Order not found' });
  const mine = String(o.user._id) === String(req.user._id);
  if (!mine && !['admin', 'staff'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  res.setHeader('Content-Type', 'application/pdf'); res.setHeader('Content-Disposition', `attachment; filename="invoice-${o.orderNo}.pdf"`);
  writeInvoice(o, o.user, res);
});
export default r;