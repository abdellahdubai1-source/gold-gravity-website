# Gold Gravity Trading LLC — Website

A bilingual (English/Arabic) B2B product catalogue and lead-generation website for **Gold Gravity Trading LLC**, built with Next.js 14 (App Router), TypeScript, Tailwind CSS and Supabase.

This is **not** an e-commerce site: there is no cart, checkout, payment gateway or public pricing anywhere. Every product page drives visitors to **Request a Quote** or **WhatsApp Inquiry**, and a separate **Partnership** flow lets manufacturers/suppliers submit their own products for distribution.

---

## 1. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase Postgres |
| Auth | Supabase Auth (email/password) |
| File storage | Supabase Storage (`media`, `partnership-uploads` buckets) |
| Forms | react-hook-form + zod |
| Hosting target | Vercel / any Next.js-compatible host, DNS via Cloudflare |

No unnecessary dependencies were added — the library list in `package.json` is intentionally short.

---

## 2. Project Structure

```
website/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (site)/          # Public pages (header/footer/WhatsApp chrome)
│   │   │   │   ├── page.tsx             Home
│   │   │   │   ├── about/
│   │   │   │   ├── products/            Catalogue + /category/[category] + /[slug]
│   │   │   │   ├── brands/              Listing + /[slug]
│   │   │   │   ├── partnership/
│   │   │   │   ├── request-a-quote/
│   │   │   │   ├── contact/
│   │   │   │   ├── privacy-policy/
│   │   │   │   └── terms-and-conditions/
│   │   │   ├── admin/
│   │   │   │   ├── login/               Public login screen
│   │   │   │   └── (dashboard)/         Auth-gated admin (own layout, no public chrome)
│   │   │   └── layout.tsx       Shared <html>/fonts/JSON-LD/GA (root document)
│   │   ├── sitemap.ts / robots.ts
│   │   └── layout.tsx           Minimal pass-through root layout
│   ├── components/              UI, layout, product, forms, admin
│   ├── lib/
│   │   ├── supabase/            client.ts (browser) / server.ts (SSR) / admin.ts (service role)
│   │   ├── data/                queries.ts (public) / admin-queries.ts (admin)
│   │   ├── actions/             forms.ts / admin.ts / auth.ts — Server Actions
│   │   └── validation.ts        zod schemas
│   ├── i18n/                    locale config + EN/AR UI string dictionaries
│   └── types/database.ts        Hand-written types mirroring the SQL schema
├── supabase/
│   ├── schema.sql                Tables, indexes, triggers, storage buckets
│   └── policies.sql              Row Level Security policies
├── scripts/seed.ts               Loads the approved catalogue from the brief
├── public/images/                Organized, renamed client-supplied assets
└── .env.example
```

### Why a `(site)` route group?

`/admin` intentionally does **not** share the public header, footer or floating WhatsApp button — it's a focused work tool, not a marketing page. Next.js route groups (`(site)`, `(dashboard)`) let both live under the same `[locale]` segment with completely different chrome, without duplicating the locale-detection/auth logic.

---

## 3. Local Setup

```bash
npm install
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# SUPABASE_SERVICE_ROLE_KEY (see step 4 below)
npm run dev
```

The site runs at `http://localhost:3000` and immediately redirects to `/en`. Switch to `/ar` to see the Arabic/RTL experience.

**Without Supabase configured**, the public site still renders (every data query fails soft and shows the correct empty states — see `src/lib/data/queries.ts`), but there is no catalogue data and `/admin` cannot be used. Complete step 4 to see the real site.

---

## 4. Supabase Setup (do this once, under a Gold Gravity–owned Supabase account)

1. Create a new Supabase project.
2. Open the SQL editor and run, **in order**:
   - `supabase/schema.sql`
   - `supabase/policies.sql`
3. In **Project Settings → API**, copy the Project URL, `anon` public key, and `service_role` secret key into `.env.local`.
4. Create your first admin user:
   - Supabase Dashboard → Authentication → Users → **Add user** (set an email + password).
   - Then, in the SQL editor:
     ```sql
     insert into admin_profiles (id, full_name, role)
     values ('<paste the new user''s UUID here>', 'Your Name', 'admin');
     ```
   - Log in at `/en/admin/login` with that email/password.
5. Seed the approved catalogue:
   ```bash
   npm run seed
   ```
   This is **idempotent** — safe to re-run after editing `scripts/seed.ts`. It loads all categories, brands, products (WAVES ×11, PRIME ×3, LIMORA ×1, AL TAWFEER ×13), homepage/about/partnership/contact page content, and default site settings, exactly as specified in the developer brief.
6. Confirm storage buckets `media` (public) and `partnership-uploads` (private) exist — `schema.sql` creates them automatically.

### Data model

`Category ←→ Brand` and `Brand → Product` are both many-to-many/one-to-many via join tables (`brand_categories`, `product_categories`), **not** hard-coded — a brand (e.g. AL TAWFEER) can belong to multiple categories, and new brands/categories/products can be added from the admin dashboard with zero code changes. See `supabase/schema.sql` for the full schema and `supabase/policies.sql` for Row Level Security (public read of published content + insert-only on the three lead tables; all writes require an `admin_profiles` row).

---

## 5. Content & Asset Notes (read before editing product data)

- **Source of truth**: `scripts/seed.ts` contains every approved product name, bilingual description, size, carton quantity and barcode transcribed directly from the developer brief PDF.
- **Asset mapping**: client-supplied photos were matched to products by cross-referencing the barcode printed on each package photo against the brief's product tables (see comments in `scripts/seed.ts`). Original client photography is used throughout — nothing was replaced with AI-generated pack shots.
- **WAVES**: each of the 11 flavor/size variants has its own dedicated main photo; 6 variants additionally have a front+back gallery image.
- **AL TAWFEER "Garbage 50 Gallon Thick Twin Pack"**: no dedicated photo was supplied for this specific twin-pack configuration, so it currently reuses the single-pack photo as a placeholder — flagged in `scripts/seed.ts` and safely replaceable from **Admin → Products** once the client supplies one.
- **Logos**: `Gold_Gravity_Official_Logo.jpeg` and `AL_TAWFEER_Logo_Design_Reference.png` are used as-is (single, clean marks). The **WAVES** and **PRIME** logo files supplied are composite reference/mockup boards, not final production assets — per the brief, these must **not** be used as the live logo. The site currently renders WAVES/PRIME as clean typographic wordmarks as an interim measure; swap in the final true SVG + transparent PNG exports from **Admin → Brands** the moment they're approved (no code change needed).

---

## 6. Admin Dashboard

`/en/admin` (or `/ar/admin`) — protected by Supabase Auth + middleware + Row Level Security (defense in depth: even a bypassed middleware check can't read/write admin data without an `admin_profiles` row).

Sections: **Overview, Products, Categories, Brands, Pages, Quote Requests, Partnership Requests, Contact Messages, Media, Settings.**

Designed for a non-technical team member:
- No UUIDs, raw JSON, schema or storage-bucket terminology anywhere in the UI.
- Adding a product/brand/category is a single form with a Save button.
- Image upload is drag-and-drop-friendly with instant preview, replace and remove.
- Every destructive action (delete) requires an explicit confirmation.
- Toast notifications confirm success/failure of every save.

---

## 7. Forms → Supabase Flow

- **Request a Quote** (`/request-a-quote`): if reached via a product's "Request a Quote" button, brand/product/category are pre-selected via URL params and resolved to their IDs server-side. Submissions insert into `quote_requests` (RLS: public insert-only).
- **Partnership** (`/partnership`): catalogue/photo uploads go to the private `partnership-uploads` Storage bucket; submissions insert into `partnership_submissions` with the uploaded file URLs attached.
- **Contact** (`/contact`): inserts into `contact_submissions`.

All three forms have a hidden honeypot field (`website`) for basic spam protection, plus zod validation on both client and server.

---

## 8. WhatsApp Integration

- Official number: **+971 50 502 3438** (`NEXT_PUBLIC_WHATSAPP_NUMBER` / Admin → Settings — never the main call number).
- A floating WhatsApp button appears on every public page.
- Every product page's WhatsApp button opens a pre-filled, locale-aware message: *"Hello Gold Gravity, I am interested in [Product] by [Brand]…"* (Arabic equivalent when the site is in Arabic) — see `src/lib/utils.ts` → `productWhatsAppMessage`.

---

## 9. SEO

- Locale-prefixed routes (`/en/...`, `/ar/...`) with `hreflang`/canonical alternates set in `src/app/[locale]/layout.tsx`.
- Per-entity editable SEO title/description for pages, brands and products (via Admin), seeded from the brief's approved metadata table.
- `sitemap.xml` and `robots.txt` generated dynamically (`src/app/sitemap.ts`, `src/app/robots.ts`) covering both locales × all static pages, categories, brands and products.
- JSON-LD: `Organization` schema sitewide, `Product` schema on every product page (no price field populated — pricing is provided on request only).

---

## 10. Performance & Accessibility

- Images served via `next/image` (AVIF/WebP, responsive `sizes`), lazy-loaded by default.
- Scroll-reveal animations use a lightweight `IntersectionObserver` wrapper (`src/components/ui/Reveal.tsx`) — no animation library dependency — and respect `prefers-reduced-motion`.
- Semantic HTML, labeled form fields, visible focus states, skip-to-content link, sufficient color contrast (charcoal-on-warm-white body text).

---

## 11. Deployment

1. Push this repository to GitHub under a Gold Gravity–owned organization/account.
2. Deploy to Vercel (or any Next.js host) connected to that repo.
3. Add the environment variables from `.env.example` (with real values) in the host's dashboard — **never commit `.env.local`**.
4. Point `goldgravityuae.com` at the deployment via Cloudflare DNS (proxied, SSL/TLS set to "Full (strict)").
5. Set `NEXT_PUBLIC_SITE_URL` to the final production domain.
6. Add the Google Analytics Measurement ID from **Admin → Settings** once the client provides a company-owned property.

---

## 12. Backup Recommendations

- **Database**: enable Supabase's built-in daily backups (Project Settings → Database → Backups) on a paid plan; additionally schedule a periodic `pg_dump` export stored outside Supabase for extra redundancy.
- **Storage (product images, partnership uploads)**: periodically sync the `media` and `partnership-uploads` buckets to an external location (e.g. a scheduled job using the Supabase Storage API or `rclone`) — Supabase Storage itself does not version or auto-backup objects.
- **Source code**: hosted on GitHub, which is itself a backup; tag releases before major changes.

This describes a recommended strategy — no automatic backup job has been configured as part of this delivery, since that requires access to the client's own Supabase billing/plan and infrastructure accounts.

---

## 13. Pending Items (client-supplied, not blocking launch)

Kept fully configurable from **Admin → Settings** / **Admin → Brands** — nothing below required guessing or fabricating information:

- [ ] Company physical address
- [ ] Google Maps link/embed
- [ ] Social media links (Instagram / Facebook / LinkedIn)
- [ ] Final true SVG + transparent PNG logo exports for **WAVES** and **PRIME** (AL TAWFEER's reference logo is already usable; Gold Gravity's official logo is final)
- [ ] Optional approved client/partner logos for future "trusted by" style sections
- [ ] Final legally-reviewed Privacy Policy / Terms & Conditions copy (current pages are clearly labeled as a provisional template)
- [ ] Company-owned Google Analytics Measurement ID
- [ ] Cloudflare + Supabase + Vercel/hosting accounts transferred to Gold Gravity Trading LLC ownership

---

## 14. What Was Deliberately Left Out

Per the brief, this project does **not** include: a shopping cart, checkout, payment gateway, customer accounts, public product prices, an online booking system, fake testimonials/partner logos, or a fabricated company address/social links/statistics. If you're looking for any of these, they were intentionally excluded — see Section 60 of the developer brief ("Do Not Do These Things").
