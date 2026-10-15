export const inr = n => '₹' + Number(n || 0).toLocaleString('en-IN');
const DAYS = { daily: 1, weekly: 7, monthly: 30 };
export const rentPreview = (p, plan, units, qty = 1) => ({ rent: p.rentRates[plan] * units * qty, deposit: p.securityDeposit * qty, days: DAYS[plan] * units });