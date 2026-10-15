import PDFDocument from 'pdfkit';
// PDFKit's built-in font has no rupee sign, so amounts print as "Rs."
const money = n => 'Rs. ' + Number(n || 0).toLocaleString('en-IN');
const day = x => new Date(x).toLocaleDateString('en-IN');
export function writeInvoice(order, customer, stream) {
  const doc = new PDFDocument({ margin: 50 }); doc.pipe(stream);
  doc.fontSize(20).fillColor('#1E4FD8').text(process.env.COMPANY_NAME || 'LapRent');
  doc.fontSize(9).fillColor('#475569').text('GSTIN: ' + (process.env.COMPANY_GSTIN || 'add COMPANY_GSTIN in .env'));
  doc.moveDown().fontSize(16).fillColor('#0F172A').text('Invoice');
  doc.fontSize(10).text(`Invoice no: INV-${order.orderNo}`).text(`Date: ${day(order.createdAt)}`).text(`Order status: ${order.status}`);
  doc.moveDown().text(`Billed to: ${customer.name} (${customer.email})`).text(`Address: ${order.address}`).moveDown();
  let y = doc.y; doc.fillColor('#1E4FD8').text('Item', 50, y).text('Details', 210, y).text('Amount', 450, y, { width: 95, align: 'right' }); y += 22;
  doc.fillColor('#0F172A');
  for (const i of order.items) {
    const detail = i.mode === 'buy' ? `Buy x ${i.qty}` : `Rent ${i.units} ${i.plan}(s) x ${i.qty}, ${day(i.rentStart)} to ${day(i.rentEnd)}`;
    doc.text(i.name, 50, y, { width: 150 }).text(detail, 210, y, { width: 230 }).text(money(i.price), 450, y, { width: 95, align: 'right' }); y += 36;
  }
  y += 8; const row = (l, v, b) => { doc.font(b ? 'Helvetica-Bold' : 'Helvetica').text(l, 300, y, { width: 140 }).text(money(v), 450, y, { width: 95, align: 'right' }); y += 18; };
  row('Subtotal', order.subtotal); row('GST', order.gst); row('Refundable deposit', order.deposit); row('Total', order.total, true);
  doc.font('Helvetica').fontSize(8).fillColor('#475569').text('Deposit is refundable after the laptop is returned and inspected. Rental extensions are billed separately.', 50, y + 30, { width: 480 });
  doc.end();
}