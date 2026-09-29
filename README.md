# AI Swarm: marketing site

The public homepage for **SaaS Launch by AI Swarm**, ported from the main app's `components/landing`.

## Commands

```bash
npm run dev     # http://localhost:3001
npm run build
npm run lint
npm run db:generate
npm run db:migrate -- --name <migration-name>
npm run db:push
npm run db:studio
```

Run the main AI Swarm app on :3000 so the sign-in button works locally. While
the launch is scheduled, acquisition buttons scroll to the homepage waitlist.

## Environment

Copy `.env.example` to `.env.local`:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | This site's public URL (canonical, Open Graph, sitemap) |
| `NEXT_PUBLIC_APP_URL` | Main app URL used by the sign-in link |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public support address |
| `DATABASE_URL` | PostgreSQL connection used by Prisma and waitlist signups |
| `RESEND_API_KEY` | Resend API key used for the launch notification |
| `LAUNCH_FROM_EMAIL` | Verified sender, such as `AI Swarm <launch@example.com>` |
| `CRON_SECRET` | Long random secret Vercel sends to the protected cron route |

## Launch notifications

The launch date lives in `components/landing/data/launch.ts`. Vercel calls
`/api/cron/launch-notifications` daily at 04:30 UTC (10:00 IST). Before the
configured launch timestamp the route exits without sending. At or after the
timestamp it sends the one-time launch email in idempotent Resend batches and
records each subscriber as notified.

Before deploying, add `RESEND_API_KEY`, `LAUNCH_FROM_EMAIL`, and `CRON_SECRET`
to the production environment and verify the sender domain in Resend.

## Where things live

- `components/landing/data/content.ts`: all copy, plus `stageAvailability` (which stages are live)
- `components/landing/sections/`: one file per homepage section
- `components/landing/ui/`: shared primitives (Card, Chip, Section…)
- `app/globals.css`: Tailwind v4 **without preflight** + landing design tokens
- `docs/`: positioning, SEO launch plan, migration plan
