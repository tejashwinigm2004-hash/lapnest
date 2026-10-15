import 'dotenv/config'; import express from 'express'; import 'express-async-errors'; /* a failed request returns an error instead of crashing the server */ import mongoose from 'mongoose'; import cors from 'cors'; import helmet from 'helmet'; import morgan from 'morgan'; import rateLimit from 'express-rate-limit';
import auth from './routes/auth.js'; import products from './routes/products.js'; import orders from './routes/orders.js'; import invoices from './routes/invoices.js'; import rentals from './routes/rentals.js'; import enquiries from './routes/enquiries.js'; import calls from './routes/calls.js'; import payments from './routes/payments.js'; import admin from './routes/admin.js';
const app = express();
app.use(helmet(), cors({ origin: process.env.CLIENT_URL }), express.json({ limit: '1mb' }), morgan('dev'));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60e3, max: 50 }), auth);
app.use('/api/products', products); app.use('/api/orders', orders); app.use('/api/invoices', invoices); app.use('/api/rentals', rentals); app.use('/api/payments', payments); app.use('/api/admin', admin); app.use('/api/calls', rateLimit({ windowMs: 15 * 60e3, max: 20 }), calls); app.use('/api/enquiries', rateLimit({ windowMs: 15 * 60e3, max: 10 }), enquiries);
app.use((err, req, res, next) => res.status(500).json({ message: err.message }));
// A dropped internet or Atlas connection must not kill the server: log it, let the driver reconnect, and retry the first connection.
process.on('unhandledRejection', e => console.error('Unhandled error:', e?.message || e));
process.on('uncaughtException', e => console.error('Unexpected error:', e?.message || e));
mongoose.connection.on('error', e => console.error('MongoDB error:', e.message));
mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected. Reconnecting...'));
mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected.'));
for (let i = 1; ; i++) {
  try { await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 }); console.log('MongoDB connected'); break; }
  catch (e) { console.error(`MongoDB connection failed (try ${i} of 5): ${e.message}`); if (i >= 5) process.exit(1); await new Promise(r => setTimeout(r, 3000)); }
}
app.listen(process.env.PORT || 5000, () => console.log('API running'));