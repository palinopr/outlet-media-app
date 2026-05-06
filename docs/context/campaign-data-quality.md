# Campaign Data Quality

Use `npm run audit:data` when checking whether the active Campaigns product is ready for clients.

The audit is read-only and uses existing Supabase environment variables. It prints concise groups instead of writing reports or artifacts.

## Interpreting Results

- `FIX NOW`: active product correctness issue, usually campaign assignment or invalid money/ROAS shape.
- `WATCH`: visible readiness gap that may be intentional, such as a client with no members, no connected account, no campaigns, or stale snapshots.
- `intentional/inactive`: safe to leave alone when the client, campaign, or account is not part of the current shipped scope.

Only make data changes when the mapping is obvious from campaign naming, active client records, or documented client rules. Prefer `campaign_client_overrides` for safe assignment corrections. Do not change UI, add reports, or create generated audit files for routine data checks.

Use `npm run refresh:snapshots` when active campaign snapshots are stale and Meta credentials are available locally. The command refreshes active Meta campaigns only, converts Meta dollar spend into Supabase cents, and upserts today's `campaign_snapshots` rows.

Client campaign pages also refresh from Meta through the server data path. When a signed-in client loads their Campaigns page, the app fetches the visible client campaigns from Meta and persists those fresh campaign rows plus daily snapshots back to Supabase when the stored rows are more than 10 minutes old. If Meta or Supabase persistence fails, the page should keep showing the best available campaign data and fall back to stored Supabase rows rather than exposing raw provider errors to the client.

Keep `npm run refresh:snapshots` as the operator recovery command for full active-account freshness, absent-active campaign retirement, and manual checks. Do not replace this with a broad scheduler or report system unless the shipped product needs that behavior.
