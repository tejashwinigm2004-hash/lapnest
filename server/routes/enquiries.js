import { Router } from 'express'; import { body, validationResult } from 'express-validator'; import { Enquiry } from '../models/index.js';
const r = Router();
r.post('/', body('name').trim().notEmpty(), body('phone').isMobilePhone('en-IN'), body('message').trim().isLength({ min: 5, max: 1000 }), async (req, res) => {
  if (!validationResult(req).isEmpty()) return res.status(400).json({ message: 'Check your name, phone and message' });
  const { name, email, phone, message } = req.body; await Enquiry.create({ name, email, phone, message }); res.status(201).json({ ok: true });
});
export default r;