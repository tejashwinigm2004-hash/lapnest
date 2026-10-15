import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
export const verifyToken = async (req, res, next) => {
  try {
    const t = (req.headers.authorization || '').replace('Bearer ', '');
    const { id } = jwt.verify(t, process.env.JWT_SECRET);
    const u = await User.findById(id);
    if (!u || u.isBlocked) return res.status(401).json({ message: 'Not allowed' });
    req.user = u; next();
  } catch { res.status(401).json({ message: 'Please sign in' }); }
};
export const allowRoles = (...r) => (req, res, next) => r.includes(req.user.role) ? next() : res.status(403).json({ message: 'Forbidden' });