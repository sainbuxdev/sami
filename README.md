# Sami's iPhone

A premium used/refurbished iPhone store with an Apple-inspired storefront and a
secure admin portal. No cart, no payment gateway — customers browse, open a
product, and tap **Buy on WhatsApp** to message Sami with a pre-filled enquiry.

Built with **Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion
· Prisma**.

---

## Quick start

The app uses **PostgreSQL**. Create a free database first (Neon, Vercel
Postgres, or Supabase) and copy its connection string.

```bash
# 1. Install dependencies
npm install

# 2. Create your local env file, then set DATABASE_URL to your Postgres URL
cp .env.example .env        # (Windows: copy .env.example .env)

# 3. Create the database schema
npm run prisma:push

# 4. Seed the admin account, store settings, and demo iPhones
npm run db:seed

# 5. Start the dev server
npm run dev
```

Open <http://localhost:3000>.

For a full production deploy, see **[DEPLOY.md](DEPLOY.md)**.

**Admin portal:** <http://localhost:3000/admin> — sign in with the credentials
from your `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`). Defaults:

- Email: `sami@samisiphone.com`
- Password: `Sami@iPhone2026`

> Change these in `.env` before seeding (or re-run `npm run db:seed` after editing).

---

## Environment variables

See [`.env.example`](.env.example). Key values:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Prisma connection string (SQLite locally, Postgres in prod) |
| `AUTH_SECRET` | Secret used to sign admin session cookies — **use a long random string** |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed the first admin account |
| `WHATSAPP_NUMBER` | Default WhatsApp number (also editable in Admin → Settings) |
| `STORAGE_DRIVER` | `local` (dev disk) or `vercel-blob`; auto-detects Blob when a token exists |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token (injected automatically on Vercel) |
| `NEXT_PUBLIC_SITE_URL` | Absolute URL used for SEO / Open Graph / sitemap |

Never commit your real `.env`.

---

## Database

The app uses **PostgreSQL** (Neon / Vercel Postgres / Supabase). Set
`DATABASE_URL`, then `npm run prisma:push` and `npm run db:seed`. See
[DEPLOY.md](DEPLOY.md) for the full Vercel setup.

## Image storage

The upload adapter in [`src/lib/storage.ts`](src/lib/storage.ts) supports two
drivers:

- `local` - saves to `/public/uploads` (dev / self-hosted). Not persistent on
  Vercel's ephemeral filesystem.
- `vercel-blob` - uploads to Vercel Blob and returns a public CDN URL. Used
  automatically once a Blob store is added (which sets `BLOB_READ_WRITE_TOKEN`).

The rest of the app only ever sees the returned URL, so swapping in another host
(Cloudinary, S3, Supabase) means editing just this one file.

---

## Project structure

```text
src/
├── app/
│   ├── (store)/              # Public storefront (nav + footer shell)
│   │   ├── page.tsx          # Home: hero, trust, featured
│   │   ├── products/         # Listing + [slug] details
│   │   ├── about, contact/
│   │   └── not-found, error
│   ├── admin/
│   │   ├── login/            # Public login page
│   │   └── (panel)/          # Protected: dashboard, products, featured, settings
│   ├── api/                  # products, upload, admin/login|logout|settings
│   ├── robots.ts, sitemap.ts
│   └── layout.tsx
├── components/               # ui/ · product/ · admin/ · layout/ · animations/
├── lib/                      # db, auth, whatsapp, storage, products, validations…
├── types/
prisma/                       # schema.prisma + seed.ts
public/demo/                  # generated iPhone-mockup placeholders (seed images)
public/uploads/               # admin-uploaded product images (git-ignored)
```

---

## Features

**Storefront**
- Apple-inspired hero with a scroll-driven parallax/scale product visual plus
  pointer tilt and float (all respect `prefers-reduced-motion`)
- Product listing with instant search, **filters** (model: Pro Max / Pro / Plus
  / Mini, price range, minimum condition), sort, skeleton loaders, empty states
- Product details with a **multi-image gallery** (thumbnails + lightbox), full
  specs, and **Buy on WhatsApp** (pre-filled message)
- Sold items are hidden from the listing and cannot be purchased
- Responsive (1-4 column grid), accessible, SEO metadata + sitemap
- Sells **new and used** iPhones; footer credits Nexora Tech and links to admin

**Admin portal** (`/admin`)
- Secure login (bcrypt + signed JWT session cookie), middleware-protected routes
- Dashboard with live inventory stats
- Product CRUD: add / edit / delete (confirm modal) / mark sold / mark featured
- Drag-and-drop upload of multiple images (reorder + set cover) with type/size validation
- Editable store settings (name, WhatsApp number, description)
- Fully responsive (sidebar → drawer; table → cards on mobile)

**WhatsApp funnel** — [`src/lib/whatsapp.ts`](src/lib/whatsapp.ts)
`generateWhatsAppMessage(product)` + `generateWhatsAppUrl(number, message)`
produce a normalized `wa.me` click-to-chat link with the full product details.

---

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (runs `prisma generate` first) |
| `npm run start` | Serve the production build |
| `npm run prisma:push` | Sync the schema to the database |
| `npm run db:seed` | Seed admin, settings, and demo products |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | Next.js ESLint |

---

## Removing the demo data

Seeded products are flagged `isDemo = true`. Delete them from **Admin →
Products**, or clear them programmatically:

```bash
npx prisma studio   # then delete rows, or run a one-off script
```

Your own uploaded products are never touched by re-seeding.
