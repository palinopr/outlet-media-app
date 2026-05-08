# Production Smoke Runbook

Use this after a production push/deploy or any auth, routing, campaign, client, user, or settings change.

## Prerequisites

- Railway CLI logged in and linked to `outlet-media-app`.
- Access to the production app at `https://outletmedia.net`.
- Admin credentials controlled by Outlet for manual verification when the changed area requires authenticated checks.

## Standard deploy smoke

```bash
git push
railway up --detach
```

Wait for the latest Railway deployment to reach `SUCCESS`:

```bash
railway deployment list --json | jq -r '.[0] | {id,status,createdAt}'
```

Check the public health endpoint:

```bash
curl -fsS https://outletmedia.net/api/health && echo
```

## Expected coverage

- `/api/health` returns `ok`.
- Admin nav exposes only Dashboard, Campaigns, Clients, Users, Settings.
- Campaign and client pages used by the change render without app errors.
- Client portal navigation is Campaigns-only.
- Retired Events/Reports direct URLs are absent and should return not found behavior.
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
