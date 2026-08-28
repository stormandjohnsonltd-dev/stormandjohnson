# Storm & Johnson Limited Website

Next.js + MongoDB website for Storm & Johnson Limited: product showcase, enquiry forms, distributor applications, and an admin dashboard.

## Stack

- Next.js (App Router)
- MongoDB + Mongoose
- Tailwind CSS
- Nodemailer (email notifications)
- JWT cookie auth for admin

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy env file and update values:

```bash
cp .env.example .env.local
```

Required:
- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Optional (for live email sending):
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`
- `EMAIL_TO`

If SMTP is not configured, enquiry/distributor emails are logged to the server console.

3. Seed brands, categories, sample products, company details and admin user:

```bash
npm run seed
```

Default admin (unless changed in `.env.local`):
- Email: `admin@stormandjohnson.com`
- Password: `Admin@12345`

4. Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Features

### Public
- Home, About, Products, Product Details, Become a Distributor, Contact
- Product search + brand/category filters
- Product enquiry form (email + admin dashboard)
- Distributor application form
- WhatsApp quick contact on product pages

### Admin
- Login with seeded email/password
- Manage products (create / edit / delete)
- Manage brands (create / enable / disable / delete)
- Manage categories (create / enable / disable / delete)
- Update company details
- View recent enquiries, distributor applications and contact messages
