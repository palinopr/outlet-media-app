# Database Safety Runbook

Production Supabase project: `dbznwsnteogovicllean`.

## Before schema changes

1. Create a migration under `supabase/migrations/`.
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

Use the **Supabase Drift Check** workflow when you want CI infrastructure to verify migration state.

Required GitHub secrets:

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_DB_PASSWORD`

The workflow links the project and runs `supabase db push --dry-run` without applying migrations.

## Active table baseline

The active app currently expects these public tables only:

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

Ticketing tables and event snapshot tables are retired and should not be recreated without a new explicit product decision.
