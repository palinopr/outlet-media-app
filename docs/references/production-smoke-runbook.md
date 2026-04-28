# Production Smoke Runbook

Use this after a production push/deploy or any auth, routing, campaign, client, user, or settings change.

## Prerequisites

- Railway CLI logged in and linked to `outlet-media-app`.
- Playwright Chromium installed locally once with `npm run playwright:install`.
- Production Clerk secret available as `E2E_CLERK_SECRET_KEY`.
- Production E2E target must be `https://outletmedia.net`; Clerk production keys do not allow the Railway preview origin for browser sign-in.

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

Run authenticated smoke:

```bash
E2E_BASE_URL=https://outletmedia.net \
E2E_CLIENT_SLUG=sienna \
E2E_CLERK_SECRET_KEY="$E2E_CLERK_SECRET_KEY" \
  npm run test:e2e
```

The smoke suite creates temporary Clerk users with `outlet-e2e-*` emails and deletes them in teardown.

## Manual GitHub smoke

Use the **E2E Smoke** GitHub Actions workflow when you want the same smoke from CI infrastructure:

1. Confirm the repository secret `E2E_CLERK_SECRET_KEY` is set to the Clerk secret for the target environment.
2. Run the workflow manually.
3. Use `https://outletmedia.net` as `base_url` for production.
4. Use `sienna` as the default `client_slug` unless that portal has no campaign data.

## Expected coverage

- Signed-out admin/client requests redirect to Clerk sign-in.
- Non-admin users cannot access the admin shell.
- Admin nav exposes only Dashboard, Campaigns, Clients, Users, Settings.
- Settings is technical only and has no client creation form.
- Clients owns client creation.
- Campaign detail renders performance metrics and no retired workflow panels.
- Client portal navigation is Campaigns-only.
- Retired Events/Reports direct URLs redirect back to active surfaces.

## If smoke fails

1. Open the Playwright trace or screenshots under `test-results/` / `playwright-report/`.
2. Verify the latest Railway deployment is `SUCCESS` and `/api/health` returns `ok`.
3. Confirm `E2E_BASE_URL` matches the Clerk environment domain.
4. Confirm no `outlet-e2e-*` Clerk users were left behind; delete any stale temp users manually if teardown was interrupted.
