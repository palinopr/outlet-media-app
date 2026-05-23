---
status: canonical
last_updated: 2026-05-21
replaces:
  - docs/context/campaign-data-quality.md
  - docs/context/meta-ads-playbook.md
  - AGENTS.md Meta/data sections
---

# Campaigns and Meta Ads

Use this page when work touches campaign reporting, Meta campaign operations, launch mechanics, attribution, or local ad credentials.

For the consolidated “how we think about campaigns” philosophy, CBO/testing structure, and cross-source Meta strategy, start with [Meta Ads Operating System](./Meta-Ads-Operating-System.md).

For broader ecommerce/DTC marketing ops, creative testing, funnel/AOV economics, and the Mark Builds Brands Highlights source corpus, use [Marketing Ops Playbook](./Marketing-Ops-Playbook.md).

## Campaign data quality

Use the read-only audit when checking whether the active Campaigns product is ready for clients:

```bash
npm run audit:data
```

The audit uses existing Supabase environment variables, prints concise groups, and does not write reports or artifacts.

### Interpreting results

- `FIX NOW`: active product correctness issue, usually campaign assignment or invalid money/ROAS shape.
- `WATCH`: visible readiness gap that may be intentional, such as a client with no members, no connected account, no campaigns, or stale snapshots.
- `intentional/inactive`: safe to leave alone when the client, campaign, or account is not part of the current shipped scope.

Only make data changes when the mapping is obvious from campaign naming, active client records, or documented client rules. Prefer `campaign_client_overrides` for safe assignment corrections. Do not change UI, add reports, or create generated audit files for routine data checks.

Use this when active campaign snapshots are stale and Meta credentials are available locally:

```bash
npm run refresh:snapshots
```

The command refreshes active Meta campaigns only, converts Meta dollar spend into Supabase cents, and upserts today's `campaign_snapshots` rows.

Client campaign pages also refresh from Meta through the server data path. When a signed-in client loads Campaigns, the app fetches visible client campaigns from Meta and persists fresh campaign rows plus daily snapshots back to Supabase when stored rows are more than 10 minutes old. If Meta or Supabase persistence fails, the page should keep showing best available campaign data and fall back to stored Supabase rows rather than exposing raw provider errors.

Keep `npm run refresh:snapshots` as the operator recovery command for full active-account freshness, absent-active campaign retirement, and manual checks. Do not replace this with a broad scheduler or report system unless the shipped product needs that behavior.

## When unsure, use current primary docs

If Meta API behavior, SDK fields, webhook mechanics, or platform constraints are unclear, verify with current official sources before implementing. Prefer Context7 for official/current docs, then GitHub/upstream source when needed.

This is especially important for:

- campaign creation
- ad creative payloads
- webhook verification
- special ad category behavior
- placement customization
- ad delivery edge cases

Do not improvise Graph API payloads from memory when behavior matters for live spend.

## Canonical local credential source

For local live ad work, treat root `.env.local` as the canonical credential source.

Document variable names only. Do **not** copy secret values into docs, prompts, wiki pages, commits, or logs.

Common Meta variables:

- `META_ACCESS_TOKEN`
- `META_AD_ACCOUNT_ID`
- `META_APP_ID`
- `META_APP_SECRET`
- `NEXT_PUBLIC_APP_URL`

Ticketmaster Custom IMG pixel / Meta CAPI bridge variables:

- `META_CAPI_ACCESS_TOKEN`
- `META_CAPI_PIXEL_ID`
- `META_CAPI_TEST_EVENT_CODE`
- `TICKETMASTER_CAPI_PIXEL_SECRET`

Meta credentials should stay centralized in the parent app env rather than duplicated across local tools.

## Live Meta mutation rule

For live Meta changes, do not use local/bulk scripts.

Use direct Meta API calls object-by-object, or Ads Manager, for status, spend, budget, structure, creative, and launch mutations. Read the object first, make the smallest explicit change, inspect the response, and re-read after. For launches, activate ads first, ad sets second, and the campaign last so no campaign can spend before child objects are confirmed.

## Meta ad creative rules

- Always use separate creatives for Post and Story placements.
- Use `asset_feed_spec` with `asset_customization_rules` to split by placement.
- Label convention: `{city}_post_v` / `{city}_story_v` for videos, `{name}_post` / `{name}_story` for images.
- Never create single-video/single-image ads; always split post + story.
- Keep campaign mutations bounded and auditable.
- Use live Meta reads plus durable mirrored tables.
- Keep Meta campaign mutations bounded, logged, and separate from client-facing campaign reporting until execution surfaces are explicitly restored.

When creating a placement-split `asset_feed_spec`, keep one shared link URL and use unique body/title asset values per labeled variant or Meta can reject the creative as a duplicate-asset payload.

Freshly uploaded videos may not be ad-ready immediately; wait for video processing status to be `ready` before creating the ad creative.

## Operating rules for ticket/event campaigns

- Review purchase concentration by `platform_position`; if Stories/Reels produce purchases while feed is weak, split or bias placements instead of treating all placements equally.
- If a secondary video test produces views or landing page views but not purchases, cap it or pause it before scaling.
- If a third-party ticketing path like Eventbrite already fires Meta purchase/LPV events, backend access is not required for first-pass warm retargeting; a website custom audience can still be built from the stable ticket URL token plus purchase exclusion.
- If a low-budget ticket campaign has a customer-provided spreadsheet that matches the live buyer skew, clean it into an adult deduped customer-list audience and merge it into the existing warm ad set before creating multiple extra CRM ad sets.
- If a vendor delivers `IGP` / `IGS` / `TVH` video variants, prioritize `IGP + IGS` first for Meta paid; hold `TVH` unless a specific horizontal use case exists.
- When a new support creative is meant to help an existing winner structure, add it inside the strongest live ad sets before creating overlapping duplicate-audience test ad sets.

## CBO spend controls

When budget sits on the campaign, treat the setup as CBO / campaign budget optimization.

If one winner monopolizes spend or new geo/retargeting lines are not getting a fair test, use light ad set controls instead of immediately raising campaign budget.

Context7-confirmed field names:

- `daily_min_spend_target` = best-effort ad set floor
- `daily_spend_cap` = ad set cap

Practical rule:

- use minimums to force a real spend test for new geos or warm retargeting
- use caps to stop one dominant ad set from swallowing too much campaign budget
- once a new geo or warm line has had a fair test without fresh purchase proof, remove its minimum and leave only the cap so the test can stay live without forcing spend
- reserve active minimums for current closing lines, not every active ad set
- do not overconstrain every ad set or CBO stops acting like real CBO

Operator clarity rule:

- talk about budgets in normal dollars like `$100.00/day` and `$150.00/day`
- only use raw API minor-unit values when writing the actual Graph payload

## Ticketmaster Custom IMG pixel to Meta CAPI

Ticketmaster Custom tags can only render a single `<img>` tag. For closed-loop purchase signal when the built-in Meta vendor cannot emit the needed event shape, use:

- Starting URL: `https://outletmedia.net/api/meta/ticketmaster-capi?key=<TICKETMASTER_CAPI_PIXEL_SECRET>`
- Required dynamic parameters for `Purchase`: `order_id` and `value`
- Recommended dynamic parameters: `currency`, `eventname`, `eventdate`, `eventid`, `quantity`, `fbclid` when Ticketmaster can expose it

The endpoint always returns a 1x1 GIF so Ticketmaster validation/browser rendering stays stable. It only sends to Meta when the static `key` matches `TICKETMASTER_CAPI_PIXEL_SECRET` and CAPI credentials are configured.

Do not enable multiple Ticketmaster purchase emitters unless they deduplicate with the same Meta `event_id`; otherwise Meta can double-count purchases. Prefer one source of truth for `Purchase`, then use `OutboundTicketClick` from the funnel as a diagnostic proxy only.

### Current Ataca Sergio setup

- Funnel pages keep the browser Meta pixel for upper/mid-funnel events such as `PageView`, `ViewContent`, and `OutboundTicketClick`.
- Ticketmaster confirmation uses the Custom IMG pixel as the sole `Purchase` source.
- The Custom IMG hits `/api/meta/ticketmaster-capi`, which validates `TICKETMASTER_CAPI_PIXEL_SECRET`, builds a deterministic Meta `event_id`, sends the event to Meta CAPI, and returns a 1x1 GIF.
- Ticketmaster's built-in Meta purchase emitter should stay disabled unless exact Meta dedupe by matching `event_name + event_id` is confirmed.
- Production pixel id currently used for this bridge: `1553637492361321`.

### Ticketmaster CAPI observability

Every valid keyed Ticketmaster CAPI hit is recorded in `ticketmaster_capi_events` for audit/debugging. View recent activity in:

- `Admin → Settings → Ticketmaster CAPI events`

The log is intentionally privacy-safe. It stores order/event/value metadata, Meta status/response summaries, skip/error reason, hit count, and hashed request identifiers. Do not log buyer PII or secrets.

Use the log to answer:

- Did Ticketmaster fire the custom pixel?
- Did the event contain `order_id` and `value`?
- Did Meta accept the CAPI event?
- Was the hit duplicated or retried?
- Is the issue Ticketmaster delivery, Outlet bridge parsing, or Meta acceptance?

### Hyros-style attribution layer

The Ataca Sergio funnel has a first-party attribution layer before the Ticketmaster handoff:

- landing page captures/stores `om_session_id` plus Meta/UTM parameters
- funnel engagement events post to `/api/attribution/funnel`
- ticket CTAs route through `/out/ticketmaster/ataca-sergio-newark`
- the redirect logs `ticket_redirect`, writes a durable `ticketmaster_attribution_handoffs` row, appends `om_click_id` / `om_session_id`, and forwards attribution parameters to Ticketmaster
- Ticketmaster CAPI logs parse `om_click_id`, `om_session_id`, Meta campaign/ad set/ad fields, placement, and UTMs from request params or `source_url` when Ticketmaster preserves them
- if Ticketmaster preserves only a deterministic `ad_id`, the CAPI logger resolves that ad's parent ad set and campaign through the Meta Graph API before storing the row
- when Ticketmaster drops query params, the CAPI logger matches purchases back to first-party handoffs using direct click/session IDs, nested source URL attribution, `fbclid`/`fbc`/`fbp`, exact hashed IP+UA, or safe unique recent browser matches
- CAPI rows store `attribution_match_method`, `attribution_match_confidence`, `attribution_handoff_id`, and `attribution_matched_at` so deterministic and inferred attribution stay separate

Standard Meta ad URL parameter template:

```text
campaign_id={{campaign.id}}&campaign_name={{campaign.name}}&adset_id={{adset.id}}&adset_name={{adset.name}}&ad_id={{ad.id}}&ad_name={{ad.name}}&placement={{placement}}&site_source={{site_source_name}}&utm_source=meta&utm_medium=paid_social&utm_campaign=ataca_sergio_newark&utm_content={{ad.name}}
```

### Heatmap-lite funnel analytics

Use the privacy-safe heatmap-lite layer for directional funnel optimization only. It tracks aggregate section visibility, CTA impressions, scroll-depth buckets, ticket clicks, viewport/device fields, and ad/creative URL sources through `/api/attribution/funnel` and `marketing_attribution_events`.

Guardrails:

- no session recordings
- no mouse coordinates
- no screenshots
- no DOM text capture
- no form values
- no raw IP or raw user-agent display
- no buyer PII or secrets
- client and server URL storage keeps only page path plus approved attribution params; referrer is origin-only
- public funnel API cannot create `ticket_redirect`; Ticketmaster redirects remain server-recorded only
- public sample-rate values are not used to weight admin counts
- not purchase attribution; Ticketmaster CAPI remains the purchase source of truth

Current static tracker:

- `public/om-funnel-analytics.js`
- Ataca Newark sends section/CTA visibility only because page view, scroll, and ticket click already exist in the custom Ataca script.
- 9AM city pages send page view, section visibility, CTA impressions, scroll depth, and ticket clicks.
- Admin dashboard reads aggregate summaries through `src/features/meta/funnel-analytics.ts` and renders `Funnel engagement`.

### Ticketmaster CAPI future improvements

1. Confirm a real Ticketmaster sale appears as `Purchase` with `Meta accepted` in Admin Settings.
2. Run a controlled purchase/comp-order test to confirm whether Ticketmaster preserves `om_click_id` on the confirmation page `source_url`.
3. Add alerting for broken signal: no recent purchase hits during active sales windows, repeated missing `order_id`/`value`, or elevated Meta rejection rates.
4. If Ticketmaster exposes more fields, pass hashed email/phone/name/city/zip/country to improve Meta match quality.
5. Join Meta spend by campaign/adset/ad with `ticketmaster_capi_events` using deterministic/high-confidence handoff matches before treating ad-level CAPI value as optimization truth.
6. Run `npm run enrich:ticketmaster-capi-meta` to dry-run recent deterministic `ad_id` rows that can be enriched with Meta ad set/campaign hierarchy. Set `TICKETMASTER_META_HIERARCHY_APPLY=1` only when the dry-run counts are reviewed.
7. Run `npm run backfill:ticketmaster-attribution` after deploying handoff schema changes to safely re-match recent unknown purchase rows. The command defaults to dry-run; set `TICKETMASTER_ATTRIBUTION_BACKFILL_APPLY=1` to write safe deterministic/high matches, and only set `TICKETMASTER_ATTRIBUTION_BACKFILL_ALLOW_MEDIUM=1` when medium-confidence inferred matches have been reviewed.

## Cross-repo rule

- If a task needs closed-loop attribution or call-first funnel behavior, use Omaha as the reference implementation.
- If a task needs campaign ops, snapshots, reporting, or bounded Meta mutations, use Outlet as the reference implementation.
