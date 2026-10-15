import mongoose from 'mongoose';
const { Schema, model } = mongoose;
export const User = model('User', new Schema({
  name: { type: String, required: true }, email: { type: String, unique: true, required: true, lowercase: true },
  phone: String, password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'staff', 'admin'], default: 'user' }, isBlocked: { type: Boolean, default: false }
}, { timestamps: true }));
export const Product = model('Product', new Schema({
  name: String, brand: String, specs: { processor: String, ram: String, storage: String, display: String },
  images: [String], mrp: Number, discountPercent: { type: Number, enum: [5, 10], default: 5 },
  rentRates: { daily: Number, weekly: Number, monthly: Number }, securityDeposit: Number,
  availableFor: { type: String, enum: ['buy', 'rent', 'both'], default: 'both' }, stock: { type: Number, default: 0 }, isActive: { type: Boolean, default: true }
}, { timestamps: true }).index({ name: 'text', brand: 'text' }));
export const Order = model('Order', new Schema({
  orderNo: String, user: { type: Schema.Types.ObjectId, ref: 'User' },
  items: [{ product: { type: Schema.Types.ObjectId, ref: 'Product' }, name: String, mode: String, plan: String, units: Number, qty: Number, price: Number, deposit: Number, rentStart: Date, rentEnd: Date }],
  address: String, paymentMethod: { type: String, enum: ['cod', 'upi', 'bank', 'razorpay'], default: 'cod' }, paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' }, razorpayOrderId: String, razorpayPaymentId: String,
  subtotal: Number, gst: Number, deposit: Number, total: Number,
  status: { type: String, enum: ['Placed', 'Confirmed', 'Delivered', 'Rented', 'Return Requested', 'Returned', 'Completed', 'Cancelled'], default: 'Placed' }
}, { timestamps: true }));
export const RentalRequest = model('RentalRequest', new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'Order' }, user: { type: Schema.Types.ObjectId, ref: 'User' }, itemIndex: Number,
  type: { type: String, enum: ['extension', 'return'] }, extraUnits: Number, extraAmount: Number, pickupDate: Date, address: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' }, adminNote: String
}, { timestamps: true }));
export const Enquiry = model('Enquiry', new Schema({ name: String, email: String, phone: String, message: String, status: { type: String, default: 'new' } }, { timestamps: true }));
export const Banner = model('Banner', new Schema({ title: String, subtitle: String, imageUrl: String, link: { type: String, default: '/products' }, art: { type: String, default: 'rent' }, videoUrl: String, startDate: Date, endDate: Date, position: { type: Number, default: 0 }, isActive: { type: Boolean, default: true } }, { timestamps: true }));
export const CallBooking = model('CallBooking', new Schema({ name: String, phone: String, date: String, timeSlot: String, topic: String, status: { type: String, default: 'new' } }, { timestamps: true }).index({ date: 1, timeSlot: 1 }, { unique: true }));