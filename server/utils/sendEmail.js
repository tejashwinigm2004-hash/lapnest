// Sends email through Brevo's HTTPS API (works on Render's free tier, unlike SMTP).
export default async function sendEmail({ to, subject, html }) {
  const key = process.env.BREVO_API_KEY;
  if (!key) { console.log('Email not set up. Would have sent to:', to); return false; }
  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': key, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ sender: { name: 'LapNest', email: process.env.MAIL_FROM }, to: [{ email: to }], subject, htmlContent: html }),
  });
  if (!r.ok) throw new Error('Email failed: ' + r.status + ' ' + (await r.text()));
  return true;
}