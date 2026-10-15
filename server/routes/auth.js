import { Router } from 'express'; import bcrypt from 'bcryptjs'; import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator'; import { User } from '../models/index.js'; import { verifyToken } from '../middleware/auth.js';
const r = Router();
const sign = u => jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
const pub = u => ({ id: u._id, name: u.name, email: u.email, role: u.role });
r.post('/register', body('name').notEmpty(), body('email').isEmail(), body('phone').isMobilePhone('en-IN'), body('password').isStrongPassword({ minLength: 8, minSymbols: 0 }),
  async (req, res) => {
    const e = validationResult(req); if (!e.isEmpty()) return res.status(400).json({ message: `Check your ${e.array()[0].path}` });
    if (await User.findOne({ email: req.body.email })) return res.status(409).json({ message: 'Email already registered' });
    const { name, email, phone, password } = req.body;
    const u = await User.create({ name, email, phone, password: await bcrypt.hash(password, 12), role: 'user' });
    res.status(201).json({ token: sign(u), user: pub(u) });
  });
r.post('/login', async (req, res) => {
  const u = await User.findOne({ email: req.body.email }).select('+password');
  if (!u || !(await bcrypt.compare(req.body.password || '', u.password))) return res.status(401).json({ message: 'Wrong email or password' });
  if (u.isBlocked) return res.status(403).json({ message: 'Account blocked' });
  res.json({ token: sign(u), user: pub(u) });
});
r.get('/me', verifyToken, (req, res) => res.json(pub(req.user)));
export default r;