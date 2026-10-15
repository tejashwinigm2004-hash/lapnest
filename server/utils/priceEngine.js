export const PLAN_DAYS = { daily: 1, weekly: 7, monthly: 30 };
export const sellingPrice = p => Math.round(p.mrp - (p.mrp * p.discountPercent) / 100);
export function priceItem(p, { mode, plan, units = 1, qty = 1, startDate }) {
  if (mode === 'buy') return { price: sellingPrice(p) * qty, deposit: 0 };
  if (!PLAN_DAYS[plan]) throw new Error('Invalid rental plan');
  const start = new Date(startDate), end = new Date(start);
  end.setDate(end.getDate() + units * PLAN_DAYS[plan]);
  return { price: p.rentRates[plan] * units * qty, deposit: p.securityDeposit * qty, rentStart: start, rentEnd: end };
}
export function totals(lines, gstRate) {
  const subtotal = lines.reduce((s, l) => s + l.price, 0), deposit = lines.reduce((s, l) => s + l.deposit, 0);
  const gst = Math.round((subtotal * gstRate) / 100);
  return { subtotal, gst, deposit, total: subtotal + gst + deposit };
}