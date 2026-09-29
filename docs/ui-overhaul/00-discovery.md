# Phase 0: Discovery Report — CreatorLink India UI/UX Overhaul

**Target Standard:** Apple.com / Nike.com tier polish, effortless modern aesthetics, confident whitespace, refined typography, and purposeful micro-interactions without disrupting core functionality or business logic.

---

## 1. Technical Stack Detection

| Layer | Detected Technology | Details & Versions |
|---|---|---|
| **Framework** | Next.js 16.3.6 (App Router + Turbopack) | React 19.2.8, React DOM 19.2.8, Node.js v23.10.0 |
| **Styling Engine** | Tailwind CSS v4 (`@tailwindcss/postcss` ^4) | Standard Tailwind v4 CSS imports in `app/globals.css`, CSS variables, custom keyframe animations, glassmorphism utilities |
| **Component Architecture** | Custom Handcrafted Components | Zero bloated third-party UI library; pure semantic React elements with Tailwind utilities, inline SVG icons, and custom glass effects |
| **Data Visualization** | Recharts 3.10.1 | ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar |
| **Routing** | Next.js App Router | Dynamic routes: `/[handle]`, `/[handle]/buy/[productId]`, `/r/[linkId]`, `/api/*` |
| **State Management** | Hybrid Server/Client Components | React state (`useState`, `useEffect`), HttpOnly cookie JWT (`cl_token`) via `jose` 6.2.12 & `bcryptjs` 3.0.3 |
| **Data Persistence** | Dual MongoDB & LowDB Fallback | Auto-detects local/remote MongoDB, seamlessly falls back to file-backed LowDB (`data/db.json`) requiring zero config |
| **Payments & Integrations** | Razorpay SDK 2.9.8 | Node SDK for dynamic payment link generation with INR currency |
| **Link Scraping & Metadata** | Cheerio 1.2.0 + native Fetch | Scrapes OpenGraph titles, thumbnails, and pricing from retail URLs (Amazon, Flipkart, Myntra) |
| **Internationalization** | Custom Multi-language dictionary | `lib/i18n.ts` supporting English (`en`), Hindi (`hi`), and Gujarati (`gu`) |

---

## 2. Inventory of Pages, Routes & Shared Components

### Key Pages & Routes

| Route | Type | Description | File Path |
|---|---|---|---|
| `/` | Public (Static/SSR) | Marketing Landing Page featuring Hero, Mockup, Trust Logos, Features Grid, Testimonials Marquee, and CTA | `app/page.tsx` |
| `/login` | Public | Creator Sign-in screen with email and password | `app/login/page.tsx` |
| `/register` | Public | Creator Registration with handle reservation, display name, and bio | `app/register/page.tsx` |
| `/[handle]` | Public | Live Creator Link-in-Bio mobile-first profile page with multi-language selector and WhatsApp sharing | `app/[handle]/page.tsx` |
| `/[handle]/buy/[productId]` | Public | Digital Product Checkout page with delivery preview and Razorpay checkout trigger | `app/[handle]/buy/[productId]/page.tsx` |
| `/dashboard` | Authenticated | Link Manager for creating, reordering, editing, and deleting affiliate links | `app/dashboard/page.tsx` |
| `/dashboard/analytics` | Authenticated | Click Analytics dashboard with daily traffic charts, device breakdown, and link performance table | `app/dashboard/analytics/page.tsx` |
| `/dashboard/products` | Authenticated | Digital product creation and management dashboard | `app/dashboard/products/page.tsx` |
| `/dashboard/settings` | Authenticated | Creator profile settings, bio, language selection, and affiliate tags configuration | `app/dashboard/settings/page.tsx` |
| `/r/[linkId]` | Route Handler | Fire-and-forget click analytics tracking and external retailer redirection | `app/r/[linkId]/route.ts` |

### Shared Components

| Component | Usage & Responsibilities | File Path |
|---|---|---|
| `DashboardShell` | Responsive wrapper for all `/dashboard/*` routes. Provides sticky desktop sidebar, mobile bottom navigation bar, top navigation with profile preview link, and avatar. | `components/DashboardShell.tsx` |
| `CreatorPublicPage` | Consumer-facing public link-in-bio page. Contains `LinkCard`, `ProductCard`, WhatsApp sharing actions, and dynamic multilingual string localization. | `components/CreatorPublicPage.tsx` |
| `LinksManager` | Interactive dashboard widget for adding affiliate URLs, automatic metadata scraping preview, and list sorting. | `components/LinksManager.tsx` |
| `ProductsManager` | Catalog management component for creating digital downloads, courses, and booking consultation products. | `components/ProductsManager.tsx` |
| `SettingsForm` | Profile customization panel including affiliate ID association (Amazon Associates, Flipkart Affiliate, Myntra). | `components/SettingsForm.tsx` |
| `AnalyticsClient` | Interactive Recharts dashboard rendering daily clicks, top clicked links, and device breakdown. | `components/AnalyticsClient.tsx` |

---

## 3. Local Execution & Runtime Verification

- **Development Run Command:**
  ```bash
  cd creatorlink
  npm run dev
  ```
  App initializes Turbopack dev server on `http://localhost:3000`.

- **Production Build & Execution Command:**
  ```bash
  cd creatorlink
  npm run build
  npm start
  ```
  `npm run build` compiled 20 static and dynamic routes in ~3.1s with zero TypeScript or Turbopack errors.

- **Storage / Database Verification:**
  - Tested without external MongoDB dependency.
  - Automatically initializes `data/db.json` using LowDB with schema-conforming collections for `creators`, `links`, `products`, and `clickEvents`.

---

## 4. Visual Discovery & Baseline Screenshot Capture

27 baseline BEFORE screenshots were captured across 9 primary views at 3 standardized viewports (Mobile 375×812, Tablet 768×1024, Desktop 1440×900) using high-DPI headless Chromium/Edge:

**Saved Location:** `/docs/ui-overhaul/screenshots/before/`

| Page View | Mobile (375px) | Tablet (768px) | Desktop (1440px) |
|---|---|---|---|
| **Landing (`/`)** | `landing-mobile.png` | `landing-tablet.png` | `landing-desktop.png` |
| **Login (`/login`)** | `login-mobile.png` | `login-tablet.png` | `login-desktop.png` |
| **Register (`/register`)** | `register-mobile.png` | `register-tablet.png` | `register-desktop.png` |
| **Creator Profile (`/aarav`)** | `creator-profile-mobile.png` | `creator-profile-tablet.png` | `creator-profile-desktop.png` |
| **Product Buy (`/aarav/buy/...`)** | `product-buy-mobile.png` | `product-buy-tablet.png` | `product-buy-desktop.png` |
| **Dashboard Links (`/dashboard`)** | `dashboard-links-mobile.png` | `dashboard-links-tablet.png` | `dashboard-links-desktop.png` |
| **Dashboard Analytics (`/dashboard/analytics`)** | `dashboard-analytics-mobile.png` | `dashboard-analytics-tablet.png` | `dashboard-analytics-desktop.png` |
| **Dashboard Products (`/dashboard/products`)** | `dashboard-products-mobile.png` | `dashboard-products-tablet.png` | `dashboard-products-desktop.png` |
| **Dashboard Settings (`/dashboard/settings`)** | `dashboard-settings-mobile.png` | `dashboard-settings-tablet.png` | `dashboard-settings-desktop.png` |

---

## 5. Preliminary Observations for Phase 1 Audits

1. **Visual Consistency & Typography Scale:**
   - Elements mix random raw colors (`#4f46e5`, `#7c3aed`, `#0f0c29`, `#1e1b4b`, `rgb(99,102,241)`, etc.) instead of a unified semantic token system.
   - Typography lacks the confident scale, tracking, and optical rhythm typical of Apple/Nike editorial design (e.g. `clamp` values are somewhat abrupt, heading weights are inconsistent).
   - Some card surfaces use heavy drop-shadows and saturated borders rather than subtle translucent layers, border highlights, or delicate inset shadows.

2. **UX & Spatial Rhythm:**
   - Dashboard layouts have mixed spacing: padding shifts between 20px, 24px, 32px without a strict 8px/4px geometric rhythm.
   - The creator public page has good basic structure, but its dark gradient backdrop is overly saturated and lacks the refined, bespoke restraint expected from a premium consumer bio tool.
   - Product buy page is stark and bare, missing reassurance badges, security micro-copy, clear checkout breadcrumbs, and Apple-grade product presentation.

3. **Motion & Interaction Polish:**
   - Keyframe animations currently lack `@media (prefers-reduced-motion: reduce)` fallbacks.
   - Buttons and links rely on abrupt transforms (`-translate-y-1` or `translateY(-3px)`) rather than smooth spring/cubic-bezier micro-interactions with proper focus-visible outlines.

---

**Phase 0 Status: COMPLETE.**
Awaiting user confirmation (`APPROVED`) before launching Phase 1 parallel agent analysis.
