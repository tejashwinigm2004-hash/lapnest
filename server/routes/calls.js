import { Router } from 'express'; import { body, validationResult } from 'express-validator'; import { CallBooking } from '../models/index.js';
const SLOTS = ['10:00 AM - 12:00 PM', '12:00 PM - 2:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM'];
const todayIST = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // YYYY-MM-DD in India
const r = Router();
// Which slots are already taken on a date (the form greys them out)
r.get('/slots', async (req, res) => {
  const d = String(req.query.date || ''); if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return res.json([]);
  res.json((await CallBooking.find({ date: d }).select('timeSlot')).map(b => b.timeSlot));
});
r.post('/', body('name').trim().notEmpty(), body('phone').isMobilePhone('en-IN'), body('date').matches(/^\d{4}-\d{2}-\d{2}$/), body('timeSlot').isIn(SLOTS), async (req, res) => {
  if (!validationResult(req).isEmpty()) return res.status(400).json({ message: 'Check your name, phone, date and time slot' });
  const { name, phone, date, timeSlot, topic } = req.body;
  if (date < todayIST()) return res.status(400).json({ message: 'Choose today or a future date' });
  try { await CallBooking.create({ name, phone, date, timeSlot, topic: String(topic || '').slice(0, 60) }); res.status(201).json({ ok: true }); }
  catch (e) { res.status(e.code === 11000 ? 409 : 500).json({ message: e.code === 11000 ? 'That slot is already booked. Please pick another.' : 'Could not book the call' }); }
});
export default r;