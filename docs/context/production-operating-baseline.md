# Production Operating Baseline

This is the lean operating baseline for the shipped Outlet Media app. Keep it current when production surfaces, verification gates, or deployment commands change.

## Shipped Surface

- Active admin surfaces: Dashboard, Campaigns, Clients, Users, Settings.
- Active client surface: Campaigns only.
- Active integrations: Supabase, Clerk, Meta Marketing API, contact form email delivery.
- Active public/support routes: `/privacy`, `/terms`, `/api/contact`, `/api/health`, `/api/meta/callback`, `/api/meta/data-deletion`, `/deletion-status/[code]`.
- Active client funnel: `/9am/orlando` under `src/app/9am` and `public/9am`.
- Retired route guards: admin Events/Reports and client Events/Reports/event detail redirect back to Dashboard/Campaigns.

## Environment

Required production variable names:

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

Never copy secret values into docs, prompts, PRs, or logs.

## Verification

- Normal local gate: `npm run check`.
- Optional production smoke: `npm run smoke:prod`.
- The smoke script is HTTP-only and intentionally does not use Playwright, screenshots, browser reports, or generated artifacts.
- Use fresh no-context review loops for production-confidence changes when practical.

## Deploy

Railway is the production host and does not auto-deploy from git push.

- Deploy from clean `main`: `railway up --detach`.
- Confirm latest Railway deployment reaches `SUCCESS`.
- Run `npm run smoke:prod`.
- Check Railway logs briefly for boot/runtime errors.

Production URL: `https://outlet-media-app-production.up.railway.app`.
