# Supabase Backup and Restore Runbook

Production Supabase project: `dbznwsnteogovicllean`.

## Backup policy

- Use Supabase managed daily backups as the primary production safety net.
- Before any destructive migration or cleanup, create a manual backup from the Supabase dashboard.
- Keep local exports for emergency inspection only; do not commit dumps or secrets to git.

## Create a manual backup before risky work

1. Open Supabase Dashboard → project `dbznwsnteogovicllean` → Database → Backups.
2. Trigger an on-demand backup if the dashboard plan supports it.
3. Record the backup timestamp, migration being applied, operator, and expected rollback window in the deployment notes.
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
   - active tables exist from `docs/references/database-safety-runbook.md`
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

8. Run the authenticated Playwright smoke test against production after redeploy.

## Targeted restore path

If only a small table or row set is affected, prefer targeted repair over full project rollback.

1. Restore or export the affected data into a temporary database/project.
2. Diff affected rows by primary key.
3. Write a reviewed SQL repair script.
4. Apply in a transaction where possible.
5. Verify the affected admin/client route and `/api/health`.

## After restore

- Document root cause and exact restore timestamp.
- Re-run GitHub Supabase Drift Check.
- Re-run production E2E smoke.
- Remove local dumps from developer machines.
