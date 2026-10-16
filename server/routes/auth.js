import { Router } from 'express'; import bcrypt from 'bcryptjs'; import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator'; import { User } from '../models/index.js'; import { verifyToken } from '../middleware/auth.js';
import sendEmail from '../utils/sendEmail.js';
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

// ===== Forgot password =====
// The reset link is a token signed with the JWT secret plus the current password hash,
// so it stops working as soon as the password changes (one use only) and expires in 15 minutes.
const resetSecret = u => `${process.env.JWT_SECRET}${u.password}`;
const sendMail = async (to, link) => {
  if (!process.env.BREVO_API_KEY) { console.log('Reset link (email not set up):', link); return; }
  await sendEmail({
    to,
    subject: 'Reset your LapNest password',
    html: `<p>Click the button below to set a new password. The link works once and expires in 15 minutes.</p><p><a href="${link}" style="background:#D9480F;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block">Reset password</a></p><p>If the button does not work, copy this link into your browser:<br>${link}</p><p>If you did not ask for this, ignore this email.</p>`,
  });
};
r.post('/forgot-password', body('email').isEmail(), async (req, res) => {
  const same = { message: 'If this email is registered, a reset link has been sent.' };
  if (!validationResult(req).isEmpty()) return res.json(same);
  try {
    const u = await User.findOne({ email: req.body.email }).select('+password');
    if (u && !u.isBlocked) {
      const token = jwt.sign({ id: u._id, purpose: 'reset' }, resetSecret(u), { expiresIn: '15m' });
      await sendMail(u.email, `${(process.env.CLIENT_URL || '').replace(/\/$/, '')}/reset-password/${token}`);
    }
  } catch (err) { console.error('Forgot password error:', err.message); }
  res.json(same);
});
r.post('/reset-password', body('token').notEmpty(), body('password').isStrongPassword({ minLength: 8, minSymbols: 0 }), async (req, res) => {
  if (!validationResult(req).isEmpty()) return res.status(400).json({ message: 'Password needs 8+ characters with upper and lower case letters and a number' });
  const bad = () => res.status(400).json({ message: 'This reset link is invalid or has expired. Please ask for a new one.' });
  try {
    const d = jwt.decode(req.body.token); if (!d?.id || d.purpose !== 'reset') return bad();
    const u = await User.findById(d.id).select('+password'); if (!u) return bad();
    jwt.verify(req.body.token, resetSecret(u));
    u.password = await bcrypt.hash(req.body.password, 12); await u.save();
    res.json({ message: 'Password changed. You can sign in now.' });
  } catch { return bad(); }
});

r.get('/me', verifyToken, (req, res) => res.json(pub(req.user)));
export default r;