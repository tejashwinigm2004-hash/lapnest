// Checks your Razorpay keys from .env without placing an order. Run: node checkRazorpay.js
import 'dotenv/config'; import Razorpay from 'razorpay';
const id = process.env.RAZORPAY_KEY_ID, secret = process.env.RAZORPAY_KEY_SECRET;
console.log('Key Id found:', id ? `${id.slice(0, 12)}... (${id.length} characters)` : 'NO');
console.log('Secret found:', secret ? `yes (${secret.length} characters)` : 'NO');
if (id && /\s|["']/.test(id + secret)) console.log('WARNING: a space or quote mark is inside a key. Remove it in .env.');
try { await new Razorpay({ key_id: id, key_secret: secret }).orders.all({ count: 1 }); console.log('Razorpay accepted your keys. Payments should work.'); }
catch (e) { console.log('Razorpay rejected the keys:', e?.error?.description || e.message); }