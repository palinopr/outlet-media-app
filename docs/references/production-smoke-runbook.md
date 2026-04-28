# Production Smoke Runbook

Use this after a production push/deploy or any auth, routing, campaign, client, user, or settings change.

## Prerequisites

- Railway CLI logged in and linked to `outlet-media-app`.
- Playwright Chromium installed locally once with `npm run playwright:install`.
- Production Clerk secret available as `E2E_CLERK_SECRET_KEY`.
- Optional temporary client-member acceptance uses `E2E_SUPABASE_URL` and `E2E_SUPABASE_SERVICE_ROLE_KEY` to create and delete ephemeral `client_members` rows without inviting real clients. In GitHub Actions, `SUPABASE_ACCESS_TOKEN` is enough because the workflow resolves the service-role key at runtime and masks it.
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
E2E_CLIENT_SLUGS="sienna,zamora,kybba,distill_pr,vaz_vil_enterprise,chris_r,proteccion_final,beamina,happy_paws,don_omar_bcn" \
E2E_CLIENT_MEMBER_SLUGS="sienna,zamora" \
E2E_CLERK_SECRET_KEY="$E2E_CLERK_SECRET_KEY" \
E2E_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
E2E_SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" \
  npm run test:e2e
```

The smoke suite creates temporary Clerk users with `outlet-e2e-*` emails and deletes them in teardown. When Supabase E2E credentials are present, it also creates temporary non-admin client memberships and deletes those rows before deleting the users.

## Manual GitHub smoke

Use the **E2E Smoke** GitHub Actions workflow when you want the same smoke from CI infrastructure:

1. Confirm the repository secret `E2E_CLERK_SECRET_KEY` is set to the Clerk secret for the target environment.
2. Confirm `SUPABASE_ACCESS_TOKEN` is set so CI can resolve temporary non-admin client-member credentials at runtime without storing the service-role key as a GitHub secret.
3. Run the workflow manually.
4. Use `https://outletmedia.net` as `base_url` for production.
5. Use `sienna` as the default `client_slug` unless that portal has no campaign data.
6. Use `client_slugs` to cover every client portal that should be accepted for launch.
7. Keep `client_member_slugs` focused on a small representative set unless explicitly doing a heavier access audit.

## Expected coverage

- Signed-out admin/client requests redirect to Clerk sign-in.
- Non-admin users cannot access the admin shell.
- Admin nav exposes only Dashboard, Campaigns, Clients, Users, Settings.
- Settings is technical only and has no client creation form.
- Clients owns client creation.
- Campaign detail renders performance metrics and no retired workflow panels.
- Client portal navigation is Campaigns-only.
- Configured client portals load campaign lists/details without cross-client leakage.
- Temporary non-admin client members can access only their assigned portal when Supabase E2E credentials are present.
- Retired Events/Reports direct URLs redirect back to active surfaces.
- Active desktop and mobile surfaces do not create page-level horizontal overflow.

## Scheduled production monitor

The **Production Monitor** GitHub Actions workflow runs every 30 minutes and can be run manually. It fails when `/api/health` is degraded, the database check is not `ok`, or authenticated client errors were recorded in the recent alert window.

## If smoke fails

1. Open the Playwright trace or screenshots under `test-results/` / `playwright-report/`.
2. Verify the latest Railway deployment is `SUCCESS` and `/api/health` returns `ok`.
3. Check Admin → Settings → Recent app errors for authenticated client-side crashes before digging through host logs.
4. Confirm `E2E_BASE_URL` matches the Clerk environment domain.
5. Confirm no `outlet-e2e-*` Clerk users were left behind; delete any stale temp users manually if teardown was interrupted.
