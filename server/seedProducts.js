// Adds 10 more laptops WITHOUT deleting anything. Skips a laptop if its name already exists. Run: node seedProducts.js
import 'dotenv/config'; import mongoose from 'mongoose'; import { Product } from './models/index.js';
const L = (name, brand, processor, ram, storage, display, mrp, discountPercent, d, w, m, securityDeposit, stock, availableFor = 'both') => ({
  name, brand, specs: { processor, ram, storage, display }, images: ['/laptops/' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '') + '.jpg'],
  mrp, discountPercent, rentRates: { daily: d, weekly: w, monthly: m }, securityDeposit, stock, availableFor });
const list = [
  L('Dell Latitude 5420', 'Dell', 'Core i5 11th Gen', '8GB', '256GB SSD', '14" FHD', 48000, 10, 350, 1900, 6000, 7000, 8),
  L('Dell Latitude 7420', 'Dell', 'Core i7 11th Gen', '16GB', '512GB SSD', '14" FHD', 72000, 5, 550, 3000, 9500, 11000, 5),
  L('HP ProBook 450 G8', 'HP', 'Core i5 11th Gen', '8GB', '512GB SSD', '15.6" FHD', 46000, 10, 330, 1800, 5800, 6500, 10),
  L('HP EliteBook 830 G8', 'HP', 'Core i7 11th Gen', '16GB', '512GB SSD', '13.3" FHD', 78000, 5, 600, 3300, 10500, 12000, 4),
  L('Lenovo ThinkPad E14', 'Lenovo', 'Ryzen 5 5500U', '8GB', '256GB SSD', '14" FHD', 42000, 10, 300, 1650, 5300, 6000, 9),
  L('Lenovo ThinkPad X1 Carbon', 'Lenovo', 'Core i7 11th Gen', '16GB', '1TB SSD', '14" FHD', 120000, 5, 900, 5000, 16000, 18000, 3),
  L('Apple MacBook Air M1', 'Apple', 'Apple M1', '8GB', '256GB SSD', '13.3" Retina', 92000, 5, 700, 3800, 12000, 15000, 4),
  L('ASUS VivoBook 15', 'ASUS', 'Core i3 11th Gen', '8GB', '512GB SSD', '15.6" FHD', 36000, 10, 250, 1400, 4500, 5000, 12, 'rent'),
  L('Acer Aspire 5', 'Acer', 'Core i5 12th Gen', '16GB', '512GB SSD', '15.6" FHD', 52000, 10, 380, 2100, 6700, 7500, 7),
  L('Dell Inspiron 15', 'Dell', 'Ryzen 7 5700U', '16GB', '512GB SSD', '15.6" FHD', 58000, 5, 420, 2300, 7300, 8500, 6, 'buy')];
await mongoose.connect(process.env.MONGO_URI); let added = 0;
for (const p of list) if (!(await Product.exists({ name: p.name }))) { await Product.create(p); added++; }
console.log(`Added ${added} laptops (${list.length - added} already existed). Total now: ${await Product.countDocuments()}`); process.exit();