import { Router } from 'express'; import { User, Product, Order, RentalRequest, Enquiry, CallBooking } from '../models/index.js'; import { verifyToken, allowRoles } from '../middleware/auth.js';
const r = Router(); r.use(verifyToken, allowRoles('admin', 'staff'));
r.get('/stats', async (req, res) => {
  const [paid, orders, activeRentals, pendingRequests, lowStock, customers, newCalls, newEnquiries] = await Promise.all([
    Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, t: { $sum: '$total' } } }]), Order.countDocuments(),
    Order.countDocuments({ status: { $in: ['Confirmed', 'Delivered', 'Rented'] }, 'items.mode': 'rent' }), RentalRequest.countDocuments({ status: 'pending' }),
    Product.countDocuments({ isActive: true, stock: { $lte: 2 } }), User.countDocuments({ role: 'user' }), CallBooking.countDocuments({ status: 'new' }), Enquiry.countDocuments({ status: 'new' })]);
  res.json({ revenue: paid[0]?.t || 0, orders, activeRentals, pendingRequests, lowStock, customers, newCalls, newEnquiries });
});
r.get('/products', async (req, res) => res.json(await Product.find().sort('-createdAt')));   // includes hidden laptops
r.put('/orders/:id/payment', async (req, res) => { const o = await Order.findByIdAndUpdate(req.params.id, { paymentStatus: req.body.paymentStatus === 'paid' ? 'paid' : 'unpaid' }, { new: true }); res.json(o); });
r.get('/requests', async (req, res) => res.json(await RentalRequest.find().populate('order', 'orderNo items').populate('user', 'name phone').sort('-createdAt')));
r.get('/calls', async (req, res) => res.json(await CallBooking.find().sort('-createdAt')));
r.put('/calls/:id', async (req, res) => res.json(await CallBooking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })));
r.get('/enquiries', async (req, res) => res.json(await Enquiry.find().sort('-createdAt')));
r.put('/enquiries/:id', async (req, res) => res.json(await Enquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })));
r.get('/users', async (req, res) => res.json(await User.find({ role: 'user' }).sort('-createdAt')));
r.put('/users/:id/block', allowRoles('admin'), async (req, res) => res.json(await User.findByIdAndUpdate(req.params.id, { isBlocked: !!req.body.isBlocked }, { new: true })));
export default r;