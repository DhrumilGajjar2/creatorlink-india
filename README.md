# CreatorLink India 🇮🇳

An India-first **link-in-bio and affiliate monetization** tool for social media creators. Built with Next.js 16, TypeScript, Tailwind CSS, MongoDB (with LowDB fallback), and Razorpay test-mode payments.

---

## Features

- 🔗 **Link-in-bio page** at `/[handle]` — mobile-first, clean UI
- 🌐 **Multilingual** — English, Hindi, Gujarati language toggle
- 🛒 **Affiliate auto-tagging** — Amazon, Flipkart, Myntra auto-detected & tagged
- 📊 **Analytics** — click tracking, bar chart, last-clicked timestamps
- 💳 **Razorpay** — test-mode payment links for digital products
- 📱 **WhatsApp share** — on each link and the full page
- 🗄️ **MongoDB + LowDB fallback** — runs without a DB install

---

## Prerequisites

- Node.js v18+
- (Optional) MongoDB running locally on port 27017
- (Optional) Razorpay test-mode API keys

---

## Setup

### 1. Install dependencies

```bash
cd creatorlink
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
copy .env.local.example .env.local
```

Edit `.env.local`:

```env
# MongoDB (optional — falls back to data/db.json if MongoDB is not running)
MONGODB_URI=mongodb://localhost:27017/creatorlink

# Razorpay TEST MODE keys (https://dashboard.razorpay.com → Test mode → API Keys)
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX

# App base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# JWT secret (any long random string)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

> **No Razorpay keys?** The app still works — you'll see a friendly message on the buy page.

### 3. (Optional) Start local MongoDB

```bash
# Windows
net start MongoDB

# or with mongod directly
mongod --dbpath C:\data\db
```

> **No MongoDB?** The app auto-falls back to a JSON file at `data/db.json` — zero config needed.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Getting Started

1. Go to **http://localhost:3000/register** and create your creator account
2. Pick a handle (e.g. `priya`) — your public page will be at `/priya`
3. Go to **Dashboard → Settings** to add your affiliate IDs
4. Go to **Dashboard → Links** and paste any Amazon/Flipkart/Myntra URL
5. Share your page link with your audience!

---

## URL Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/register` | Create account |
| `/login` | Sign in |
| `/[handle]` | Public creator page |
| `/[handle]/buy/[productId]` | Product buy → Razorpay redirect |
| `/r/[linkId]` | Click tracking redirect |
| `/dashboard` | Link management |
| `/dashboard/analytics` | Analytics with chart |
| `/dashboard/products` | Digital product creation |
| `/dashboard/settings` | Profile & affiliate IDs |

---

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/register` | POST | Create account |
| `/api/auth/login` | POST | Sign in |
| `/api/auth/logout` | POST | Sign out |
| `/api/auth/me` | GET | Current user |
| `/api/links` | GET/POST | List/create links |
| `/api/links/[id]` | PATCH/DELETE | Edit/delete a link |
| `/api/links/reorder` | POST | Reorder links |
| `/api/products` | GET/POST | List/create products |
| `/api/products/[id]/payment-link` | POST | Get/create Razorpay link |
| `/api/razorpay/webhook` | POST | Handle payment events |
| `/api/analytics` | GET | Click analytics |
| `/api/creator/settings` | PATCH | Update profile |

---

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **Backend**: Next.js API Routes
- **Database**: MongoDB → LowDB fallback (JSON file)
- **Auth**: JWT (jose) + bcryptjs
- **Payments**: Razorpay Node SDK (test mode)
- **Charts**: Recharts
- **OG Scraping**: fetch + cheerio

---

## Development Notes

- All auth is cookie-based (`cl_token` HttpOnly JWT, 7-day expiry)
- Affiliate tags are auto-appended on link creation, stored in the DB
- Click tracking is fire-and-forget (non-blocking redirect)
- The LowDB file is at `data/db.json` — safe to delete and recreate
- Images from shopping sites are loaded via `next/image` with `unoptimized` to avoid proxy costs

---

## Razorpay Webhook (local testing)

To test webhooks locally, use [ngrok](https://ngrok.com/):

```bash
ngrok http 3000
```

Then set the webhook URL in Razorpay dashboard to:
```
https://your-ngrok-url.ngrok-free.app/api/razorpay/webhook
```

Secret should match `RAZORPAY_KEY_SECRET` in your `.env.local`.
