---
status: canonical
last_updated: 2026-05-19
replaces:
  - docs/context/production-operating-baseline.md
  - docs/references/production-smoke-runbook.md
  - AGENTS.md deployment sections
---

# Deployment and Production

This is the lean operating baseline for the shipped Outlet Media app.

## Production host

Railway is the production host and does **not** auto-deploy from git push.

- Railway project: `outlet-media-app`
- Production URL: `https://outletmedia.net`
- Railway URL: `https://outlet-media-app-production.up.railway.app`

Deploy from a clean, verified branch:

```bash
git push
railway up --detach
```

After deploy, confirm the latest Railway deployment reaches `SUCCESS`.

## Required production environment variable names

Do not copy secret values into the wiki, prompts, PRs, or logs.

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `META_ACCESS_TOKEN`
- `META_AD_ACCOUNT_ID`
- `META_APP_ID`
- `META_APP_SECRET`
- `CONTACT_FORM_TO_EMAIL`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

Additional Meta/Ticketmaster CAPI variables are listed in [Campaigns and Meta Ads](./Campaigns-And-Meta-Ads.md).

## Normal local verification

Use the combined check:

```bash
npm run check
```

Equivalent lean app gate:

```bash
npm run type-check
npm run lint
npm test
npm run build
```

Optional production smoke:

```bash
npm run smoke:prod
```

The smoke script is HTTP-only and intentionally does not use Playwright, screenshots, browser reports, or generated artifacts.

## Standard deploy smoke

Prerequisites:

- Railway CLI logged in and linked to `outlet-media-app`.
- Access to production at `https://outletmedia.net`.
- Admin credentials controlled by Outlet for manual verification when the changed area requires authenticated checks.

Commands:

```bash
git push
railway up --detach
```

Wait for latest Railway deployment to reach `SUCCESS`:

```bash
railway deployment list --json | jq -r '.[0] | {id,status,createdAt}'
```

Check the public health endpoint:

```bash
curl -fsS https://outletmedia.net/api/health && echo
```

## Expected smoke coverage

- `/api/health` returns `ok`.
- Admin nav exposes only Dashboard, Campaigns, Clients, Users, Settings.
- Campaign and client pages used by the change render without app errors.
- Client portal navigation is Campaigns-only.
- Retired Events/Reports direct URLs are absent and should return not found behavior or redirect to active surfaces.
- Settings remains technical only and has no client creation form.

## Scheduled production monitor

The **Production Monitor** GitHub Actions workflow runs every 30 minutes and can be run manually. It fails when `/api/health` is degraded, the database check is not `ok`, or authenticated client errors were recorded in the recent alert window.

Production monitor failures send Telegram alerts when these GitHub repository secrets are configured:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Use the **Telegram Alert Test** GitHub Actions workflow after setting those secrets. It sends a harmless test message and fails if the bot token or chat id is wrong.

## If smoke fails

1. Verify the latest Railway deployment is `SUCCESS` and `/api/health` returns `ok`.
2. Check Admin → Settings → Recent app errors for authenticated client-side crashes before digging through host logs.
3. Confirm the browser is on `https://outletmedia.net`, not the Railway preview URL, when using production Clerk credentials.

## Shipped surface reminder

- Active admin surfaces: Dashboard, Campaigns, Clients, Users, Settings.
- Active client surface: Campaigns only.
- Active integrations: Supabase, Clerk, Meta Marketing API, contact form email delivery.
- Active public/support routes: `/privacy`, `/terms`, `/api/contact`, `/api/health`, `/api/meta/callback`, `/api/meta/data-deletion`, `/deletion-status/[code]`.
- Active client funnels: `/9am/orlando` and `/ataca-sergio/newark`.
- Retired direct routes: admin Events/Reports and client Events/Reports/event detail are intentionally absent.
