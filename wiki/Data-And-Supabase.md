---
status: canonical
last_updated: 2026-05-19
replaces:
  - docs/references/database-safety-runbook.md
  - docs/references/supabase-backup-restore-runbook.md
  - supabase/AGENTS.md durable rules
---

# Data and Supabase

Production Supabase project: `dbznwsnteogovicllean`.

Production Supabase URL: `https://dbznwsnteogovicllean.supabase.co`.

Never paste database passwords, service role keys, tokens, dumps, or private client data into the wiki, prompts, commits, or logs.

## Active table baseline

The active app currently expects these public tables:

- `admin_activity`
- `application_errors`
- `campaign_client_overrides`
- `campaign_snapshots`
- `client_access_invites`
- `client_accounts`
- `client_member_campaigns`
- `client_members`
- `clients`
- `contact_submissions`
- `meta_campaigns`
- `system_events`

Additional active attribution/observability tables can exist for explicitly live funnels, such as `ticketmaster_capi_events`, but ticketing product surfaces and event snapshot tables should not be recreated without a new explicit product decision.

## Before schema changes

1. Create a forward migration under `supabase/migrations/`.
2. Run a dry run locally:

```bash
set -a; source .env.local; set +a
npm run db:push:dry-run
```

3. Apply only after the dry run lists the expected migration:

```bash
supabase db push --yes
```

4. Regenerate types from production after applying:

```bash
supabase gen types typescript --project-id dbznwsnteogovicllean > src/lib/database.types.ts
```

5. Run the app gate:

```bash
npm run check
```

## Manual GitHub drift check

Use the **Supabase Drift Check** workflow when CI should verify migration state.

Required GitHub secret:

- `SUPABASE_ACCESS_TOKEN`

The workflow links the project with the Supabase CLI login role and runs `supabase db push --dry-run` without applying migrations. It does not require storing the database password in GitHub.

## Supabase development rules

- Make durable schema changes through migrations, not dashboard-only edits.
- Public app tables should ship with RLS enabled and explicit policies. Do not leave exposed tables without policies.
- Preserve Outlet data conventions: money in cents, Meta `spend` converted from dollars, `daily_budget` already in cents, ROAS as float.
- Preserve the shared product backbone: `system_events` for client-visible timeline and `admin_activity` for internal audit.
- Schema and policy changes should support shared admin/client visibility instead of one-off route behavior.

## Backup policy

- Use Supabase managed daily backups as the primary production safety net.
- The **Supabase Backup Readiness** GitHub Actions workflow runs weekly and can be run manually to verify project backups are listable with `SUPABASE_ACCESS_TOKEN`.
- Before any destructive migration or cleanup, create a manual backup from the Supabase dashboard.
- Keep local exports for emergency inspection only; do not commit dumps or secrets to git.

## Create a manual backup before risky work

1. Open Supabase Dashboard → project `dbznwsnteogovicllean` → Database → Backups.
2. Trigger an on-demand backup if the dashboard plan supports it.
3. Record the backup timestamp, migration being applied, operator, and expected rollback window in deployment notes.
4. Run the drift dry-run before applying schema changes:

```bash
set -a; source .env.local; set +a
npm run db:push:dry-run
```

## Optional local logical export

Use this only from a trusted machine with the production database connection string loaded locally. Never paste or commit the password.

```bash
pg_dump "$DATABASE_URL" \
  --format=custom \
  --no-owner \
  --no-privileges \
  --file "supabase-backup-$(date +%Y%m%d-%H%M%S).dump"
```

Move the dump to approved secure storage, then remove local copies when no longer needed.

## Restore decision checklist

Restore only when one of these is true:

- A destructive migration or production write corrupted active tables.
- Access records, memberships, campaign assignments, or campaign reporting data cannot be repaired safely with targeted SQL.
- Supabase support recommends point-in-time recovery.

Before restoring, capture:

- current production health from `/api/health`
- failing user/admin flow
- latest deployed git SHA
- latest applied migration
- backup timestamp selected for restore

## Preferred restore path: Supabase point-in-time recovery

1. Put the app in maintenance mode if the incident risks further writes.
2. In Supabase Dashboard → Database → Backups, choose point-in-time recovery or the closest safe backup.
3. Restore to a temporary project first when possible.
4. Validate the temporary project:
   - active tables exist from this page's active table baseline
   - critical clients and memberships are present
   - representative campaigns load
5. Promote the restored database or apply targeted repaired data back to production.
6. Regenerate DB types if schema changed:

```bash
supabase gen types typescript --project-id dbznwsnteogovicllean > src/lib/database.types.ts
```

7. Run verification:

```bash
npm run check
npm run db:push:dry-run
```

8. Run the production smoke checklist in [Deployment and Production](./Deployment-And-Production.md).

## Targeted restore path

If only a small table or row set is affected, prefer targeted repair over full project rollback.

1. Restore or export the affected data into a temporary database/project.
2. Diff affected rows by primary key.
3. Write a reviewed SQL repair script.
4. Apply in a transaction where possible.
5. Verify the affected admin/client route and `/api/health`.

## After restore

- Document root cause and exact restore timestamp in the wiki or incident notes.
- Re-run GitHub Supabase Drift Check.
- Re-run the production smoke checklist.
- Remove local dumps from developer machines.
