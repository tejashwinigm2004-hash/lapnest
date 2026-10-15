import 'dotenv/config'; import mongoose from 'mongoose'; import bcrypt from 'bcryptjs'; import { User, Product } from './models/index.js';
await mongoose.connect(process.env.MONGO_URI); await Product.deleteMany({});
await User.updateOne({ email: 'admin@example.com' }, { name: 'Admin', phone: '9999999999', role: 'admin', password: await bcrypt.hash('Admin@12345', 12) }, { upsert: true });
await Product.insertMany([
 { name: 'ThinkPad T14', images: ['/laptops/thinkpad-t14.jpg'], brand: 'Lenovo', specs: { processor: 'Core i5', ram: '16GB', storage: '512GB SSD', display: '14"' }, mrp: 55000, discountPercent: 10, rentRates: { daily: 400, weekly: 2200, monthly: 7000 }, securityDeposit: 8000, stock: 10 },
 { name: 'EliteBook 840', images: ['/laptops/elitebook-840.jpg'], brand: 'HP', specs: { processor: 'Core i7', ram: '16GB', storage: '512GB SSD', display: '14"' }, mrp: 68000, discountPercent: 5, rentRates: { daily: 500, weekly: 2800, monthly: 9000 }, securityDeposit: 10000, stock: 6 }]);
console.log('Seeded. Admin: admin@example.com / Admin@12345'); process.exit();