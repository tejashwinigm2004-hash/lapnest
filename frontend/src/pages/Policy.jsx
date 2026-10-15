import { biz } from '../config';
// REVIEW: these are sensible starting texts. Check every number and promise with the business owner before going live.
const POLICIES = {
  terms: ['Terms and Conditions', [
    ['About these terms', `By using ${biz.name} you agree to these terms. ${biz.name} rents and sells laptops. Prices, discounts (5% or 10% on laptops for sale) and stock are shown on each laptop page and may change without notice. The price shown when you place an order is the price you pay.`],
    ['Accounts', 'You must give correct details when you register and keep your password private. We may block an account that is misused.'],
    ['Buying a laptop', 'A purchase is complete when the order is confirmed and paid. We deliver to the address you give us.'],
    ['Renting a laptop', 'You choose a daily, weekly or monthly plan and a start date. A refundable security deposit is collected with the rent. The laptop must be returned on or before the end date. You can ask for an extension from My account, and it depends on the laptop being free.'],
    ['Late return, loss and damage', 'If a laptop is returned late, extra rent at the daily rate may be charged. If it is lost or damaged beyond normal use, the repair or replacement cost may be deducted from the deposit, and charged separately if it is more than the deposit.'],
    ['Payments', 'Online payments are processed by Razorpay. We do not store your card, UPI or bank details. GST is added to the amount where applicable and shown before you order.'],
    ['Cancellations and refunds', 'See our Refund and Cancellation Policy.'],
    ['Contact', `Questions about these terms: ${biz.email} or ${biz.phone}.`]]],
  privacy: ['Privacy Policy', [
    ['What we collect', 'Your name, email, phone number, delivery address, the laptops you order or rent, and messages you send us (contact form and call bookings).'],
    ['How we use it', 'To create your account, process and deliver orders, send invoices, handle returns and extensions, call you when you book a call, and answer your questions.'],
    ['Payments', 'Payments are handled by Razorpay. We receive only the payment status and reference number, never your full card or UPI details.'],
    ['Sharing', 'We share your details only with services needed to complete your order, such as Razorpay and delivery or pickup staff. We do not sell your personal data.'],
    ['Storage and security', 'Passwords are stored in a protected (hashed) form and traffic is sent over HTTPS. Your sign-in and cart are kept in your browser so the site works between visits.'],
    ['Your choices', `You can ask us to correct or delete your details by writing to ${biz.email}. We keep order and invoice records as long as the law requires.`],
    ['Contact', `${biz.name}, ${biz.address}. Email ${biz.email}, phone ${biz.phone}.`]]],
  refund: ['Refund and Cancellation Policy', [
    ['Cancelling an order', 'You can cancel an order before it is delivered. Contact us with your order number and, if you have paid, you get a full refund.'],
    ['Rental deposit', 'The refundable security deposit is returned after the laptop is collected and checked. It is returned within 7 working days of the check, less any charges for damage, loss or late return, which we explain to you first.'],
    ['Laptops you buy', 'If a laptop you bought has a fault, tell us within 7 days of delivery and we will repair, replace or refund it after checking it.'],
    ['Failed or double payments', 'If money was taken but the order was not confirmed, or you were charged twice, the extra amount is refunded.'],
    ['How long refunds take', 'Refunds go back to the original payment method through Razorpay and usually reach you in 5 to 7 working days.'],
    ['How to ask', `Email ${biz.email} or call ${biz.phone} with your order number.`]]]
};
export default function Policy({ kind }) {
  const [title, sections] = POLICIES[kind];
  return <div className="max-w-3xl mx-auto px-4 py-12"><h1 className="text-3xl font-bold text-ink">{title}</h1><p className="text-sm mt-1">{biz.name}</p>
    {sections.map(([h, t]) => <section key={h} className="mt-6"><h2 className="font-semibold text-ink">{h}</h2><p className="mt-2">{t}</p></section>)}</div>;
}