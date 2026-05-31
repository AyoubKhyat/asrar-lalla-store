# ASRAR LALLA — La Beauté Marocaine, Réinventée

A modern e-commerce store for Moroccan natural beauty products. Built for real sales with cash-on-delivery, WhatsApp ordering, and mobile-first design.

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Smooth Scroll:** Lenis
- **State:** useSyncExternalStore + localStorage
- **Deployment:** Vercel (static SSG)

## Features

- 16 products with premium SVG packaging visuals
- WhatsApp ordering on every product (one-tap)
- Cash-on-delivery checkout flow
- Admin dashboard (/admin) with order management
- Product packs with bundle pricing
- Mobile bottom navigation
- SEO: sitemap, robots.txt, JSON-LD structured data, Open Graph
- Analytics placeholders (GA4, Meta Pixel, Clarity)
- Responsive design (mobile-first)
- French/Arabic bilingual product names

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

Before launching, update these files:

### WhatsApp Number
```
src/data/config.ts         → WHATSAPP_NUMBER
src/components/ui/WhatsAppButton.tsx → WHATSAPP_NUMBER
src/data/admin.ts          → default whatsappNumber in settingsService
```

### Social Media URLs
```
src/components/layout/Footer.tsx → Instagram, TikTok, WhatsApp, Facebook URLs
```

### Analytics
```
src/components/ui/Analytics.tsx → GA_ID, META_PIXEL_ID, CLARITY_ID
```

### Admin Login
```
Default: admin@asrarlalla.ma / asrar2026
Change in: src/data/admin.ts → ADMIN_EMAIL, ADMIN_PASSWORD
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Framework: Next.js (auto-detected)
4. Deploy

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
│   ├── layout.tsx        # Root layout
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── sections/         # Homepage sections
│   ├── layout/           # Navbar, Footer, MobileBottomNav
│   ├── cart/             # Cart panel
│   └── ui/               # Logo, ProductVisual, Toast, etc.
├── data/
│   ├── products.ts       # Product catalog
│   ├── config.ts         # Packs, delivery prices, trust badges
│   └── admin.ts          # Order/inventory/auth services
├── store/
│   └── cart.ts           # Cart state with localStorage persistence
└── hooks/
    └── useLenis.ts       # Smooth scrolling
```

## License

Private — All rights reserved © 2026 ASRAR LALLA
