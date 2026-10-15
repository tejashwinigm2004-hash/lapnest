# LapRent – Laptop Rental & Sales (MERN) – Phase 1 core
## Run
1. `cd server && cp .env.example .env && npm i && npm run seed && npm run dev`
2. `cd client && npm i && npm run dev` → http://localhost:5173
Admin: admin@example.com / Admin@12345 (change immediately)
## Done
Auth (JWT, bcrypt, roles), products + filters/sort, 5/10% discount, buy/rent cart with duration selector,
server-side price engine (GST + deposit), order placement with stock reservation, order status API, responsive white theme.
## Next (per plan)
Invoices (PDFKit), user dashboard, return/extension requests, admin UI, banners, chatbot, book-a-call, enquiries, maintenance, reports, emails/cron, Cloudinary uploads.