# Deploying Sami's iPhone to Vercel

The app uses **PostgreSQL** and **Vercel Blob** for image storage. Follow these
steps once; after that, every `git push` redeploys automatically.

---

## 1. Create a Postgres database

Pick one (all have free tiers):

- **Neon** - <https://neon.tech> -> create project -> copy the connection string
- **Vercel Postgres** - Vercel dashboard -> Storage -> Create -> Postgres
- **Supabase** - <https://supabase.com> -> Project settings -> Database -> URI

You'll get a `DATABASE_URL` like:

```
postgresql://user:password@host:5432/dbname?sslmode=require
```

## 2. Initialize the schema and seed data (run once, from your machine)

Put the production `DATABASE_URL` in your local `.env`, then:

```bash
npm install
npx prisma db push     # creates the tables in your Postgres DB
npm run db:seed        # creates the admin account, settings, and demo iPhones
```

> This is what creates your admin login. Set `ADMIN_EMAIL` / `ADMIN_PASSWORD`
> in `.env` **before** seeding (or change them and re-run the seed).

## 3. Add a Vercel Blob store (for admin image uploads)

Vercel dashboard -> your project -> **Storage** -> **Create** -> **Blob**.
This automatically injects `BLOB_READ_WRITE_TOKEN` into the project, and the app
auto-switches to Blob storage. (Local disk uploads do not persist on Vercel.)

## 4. Set environment variables in Vercel

Project -> **Settings** -> **Environment Variables** (Production + Preview):

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | your Postgres connection string |
| `AUTH_SECRET` | a long random string - generate with `openssl rand -base64 48` |
| `ADMIN_EMAIL` | your admin email |
| `ADMIN_PASSWORD` | your admin password |
| `WHATSAPP_NUMBER` | international format, e.g. `923001234567` |
| `NEXT_PUBLIC_SITE_URL` | your final domain, e.g. `https://samisiphone.com` (optional; leave blank to use the deployment URL) |
| `STORAGE_DRIVER` | `vercel-blob` (optional; auto-detected once the Blob store exists) |

> Do NOT set `NEXT_PUBLIC_SITE_URL` to an empty string manually - either give it
> a real URL or remove it. (An empty value is what caused the original build
> error; the code now guards against it, but keep it clean.)

## 5. Deploy

Push to your Git repo and import it in Vercel (or click **Redeploy**). The build
command is `npm run build` (`prisma generate && next build`), already set in
`package.json`.

## 6. Log in

Visit `https://your-domain/admin` and sign in with your `ADMIN_EMAIL` /
`ADMIN_PASSWORD`. Delete the demo products from **Admin -> Products** whenever
you're ready (they're flagged as demo data).

---

## Local development note

Because the app now targets PostgreSQL, local `npm run dev` also needs a
`DATABASE_URL`. The simplest setup is to point your local `.env` at the same
Neon/Supabase database (or a separate dev database on the same provider), then:

```bash
npx prisma db push
npm run db:seed
npm run dev
```
