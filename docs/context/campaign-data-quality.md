# Campaign Data Quality

Use `npm run audit:data` when checking whether the active Campaigns product is ready for clients.

The audit is read-only and uses existing Supabase environment variables. It prints concise groups instead of writing reports or artifacts.

## Interpreting Results

- `FIX NOW`: active product correctness issue, usually campaign assignment or invalid money/ROAS shape.
- `WATCH`: visible readiness gap that may be intentional, such as a client with no members, no connected account, no campaigns, or stale snapshots.
- `intentional/inactive`: safe to leave alone when the client, campaign, or account is not part of the current shipped scope.

Only make data changes when the mapping is obvious from campaign naming, active client records, or documented client rules. Prefer `campaign_client_overrides` for safe assignment corrections. Do not change UI, add reports, or create generated audit files for routine data checks.

Use `npm run refresh:snapshots` when active campaign snapshots are stale and Meta credentials are available locally. The command refreshes active Meta campaigns only, converts Meta dollar spend into Supabase cents, and upserts today's `campaign_snapshots` rows.
