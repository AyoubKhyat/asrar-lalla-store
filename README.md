# ASRAR LALLA — La Beauté Marocaine, Réinventée

A modern e-commerce store for Moroccan natural beauty products. Built for real sales with cash-on-delivery, WhatsApp ordering, and mobile-first design.

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Database:** PostgreSQL (direct connection via `postgres` package)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Smooth Scroll:** Lenis
- **State:** useSyncExternalStore (cart) + PostgreSQL (orders, products, settings)
- **Deployment:** Vercel

## Features

- 16 products with premium SVG packaging visuals
- WhatsApp ordering on every product (one-tap)
- Cash-on-delivery checkout flow
- Admin dashboard (/admin) with order management
- Product packs with bundle pricing
- Mobile bottom navigation
- SEO: sitemap, robots.txt, JSON-LD structured data, Open Graph
- Analytics (GA4, Meta Pixel, Clarity) via env vars
- Responsive design (mobile-first)
- French/Arabic bilingual product names

## Getting Started

```bash
# Install dependencies
npm install

# Copy env file and fill in your values
cp .env.local.example .env.local

# Create your PostgreSQL database and run the schema
psql -d asrar_lalla -f db/schema.sql

# Seed the database with products and reviews
npm run seed

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

All secrets are managed via `.env.local`:

```env
# PostgreSQL
DATABASE_URL=postgresql://user:password@host:5432/asrar_lalla

# Admin credentials
ADMIN_EMAIL=admin@asrarlalla.ma
ADMIN_PASSWORD=change-me-to-a-strong-password

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=212600000000

# Analytics (leave empty to disable)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_CLARITY_ID=
```

### Admin Login

Access the admin dashboard at `/admin`. Credentials are configured via `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars.

## Database

The database schema is in `db/schema.sql`. It includes:

- **products** — full product catalog
- **orders** + **order_items** — order management with auto-generated refs (AL-2026-XXXX)
- **reviews** — customer reviews with moderation
- **delivery_prices** — per-city shipping costs
- **site_settings** — WhatsApp number, promo banner, shipping threshold

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Framework: Next.js (auto-detected)
4. Add environment variables from `.env.local`
5. Deploy

### Custom Domain

Add these DNS records for `asrarlalla.ma`:
- `A` record → `76.76.21.21`
- `CNAME` record for `www` → `cname.vercel-dns.com`

## Project Structure

```
src/
├── app/
│   ├── (store)/          # Customer-facing pages (with Navbar/Footer)
│   │   ├── page.tsx      # Homepage
│   │   ├── products/     # Catalog + detail pages
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── order-success/
│   ├── admin/            # Admin dashboard (standalone layout)
│   ├── api/              # API routes (orders, products, settings, auth, reviews)
│   ├── layout.tsx        # Root layout
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── sections/         # Homepage sections
│   ├── layout/           # Navbar, Footer, MobileBottomNav
│   ├── cart/             # Cart panel
│   └── ui/               # Logo, ProductVisual, Toast, etc.
├── data/
│   ├── products.ts       # Static product catalog (used for SSG fallback)
│   ├── config.ts         # Packs, delivery prices, trust badges
│   └── admin.ts          # Service layer (API client for orders/products/settings)
├── lib/
│   └── db.ts             # PostgreSQL client
├── store/
│   └── cart.ts           # Cart state with localStorage persistence
└── hooks/
    └── useLenis.ts       # Smooth scrolling
```

## License

Private — All rights reserved © 2026 ASRAR LALLA
