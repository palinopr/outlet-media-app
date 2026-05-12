# Meta Ads Playbook

Use this page when work touches Meta campaign operations, reporting, launch mechanics, or local ad credentials.

## When unsure, use Context7

If Meta API behavior, SDK fields, webhook mechanics, or platform constraints are unclear:

- use **Context7** first
- verify the exact field names, endpoint behavior, and payload requirements
- do not improvise Graph API payloads from memory when the behavior matters for live spend

This is especially important for:

- campaign creation
- ad creative payloads
- webhook verification
- special ad category behavior
- placement customization
- ad delivery edge cases

## Canonical local credential source

For local live ad work, treat the root app env as the canonical credential source:

- `.env.local`

Document variable names only. Do **not** copy secret values into docs, prompts, KB pages, or commit history.

Common Meta variables referenced across the repo:

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

## Ticketmaster Custom IMG pixel to Meta CAPI

Ticketmaster Custom tags can only render a single `<img>` tag. For closed-loop purchase signal when the built-in Meta vendor cannot emit the needed event shape, use the app endpoint:

- Starting URL: `https://outletmedia.net/api/meta/ticketmaster-capi?key=<TICKETMASTER_CAPI_PIXEL_SECRET>`
- Required dynamic parameters for `Purchase`: `order_id` and `value`
- Recommended dynamic parameters: `currency`, `eventname`, `eventdate`, `eventid`, `quantity`, `fbclid` when Ticketmaster can expose it

The endpoint always returns a 1x1 GIF so Ticketmaster validation/browser rendering stays stable, but it only sends to Meta when the static `key` matches `TICKETMASTER_CAPI_PIXEL_SECRET` and CAPI credentials are configured.

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

The Ataca Sergio funnel now has a first-party attribution layer before the Ticketmaster handoff:

- landing page captures/stores `om_session_id` plus Meta/UTM parameters
- funnel engagement events post to `/api/attribution/funnel`
- ticket CTAs route through `/out/ticketmaster/ataca-sergio-newark`
- the redirect logs `ticket_redirect`, appends `om_click_id` / `om_session_id`, and forwards attribution parameters to Ticketmaster
- Ticketmaster CAPI logs parse `om_click_id`, `om_session_id`, Meta campaign/ad set/ad fields, placement, and UTMs from request params or `source_url` when Ticketmaster preserves them

Standard Meta ad URL parameter template for this funnel:

```text
campaign_id={{campaign.id}}&campaign_name={{campaign.name}}&adset_id={{adset.id}}&adset_name={{adset.name}}&ad_id={{ad.id}}&ad_name={{ad.name}}&placement={{placement}}&site_source={{site_source_name}}&utm_source=meta&utm_medium=paid_social&utm_campaign=ataca_sergio_newark&utm_content={{ad.name}}
```

### Ticketmaster CAPI todo / future improvements

1. Confirm a real Ticketmaster sale appears as `Purchase` with `Meta accepted` in Admin Settings.
2. Run a controlled purchase/comp-order test to confirm whether Ticketmaster preserves `om_click_id` on the confirmation page `source_url`.
3. Add alerting for broken signal: no recent purchase hits during active sales windows, repeated missing `order_id`/`value`, or elevated Meta rejection rates.
4. If Ticketmaster exposes more fields, pass hashed email/phone/name/city/zip/country to improve Meta match quality.
5. Join Meta spend by campaign/adset/ad with `ticketmaster_capi_events` once real purchases contain preserved ad/click parameters.

## Repeated operating rules

- keep post/feed and story/reels creatives separate
- prefer `asset_feed_spec` with `asset_customization_rules`
- keep campaign mutations bounded and auditable
- use live Meta reads plus durable mirrored tables
- keep Meta campaign mutations bounded, logged, and separate from client-facing campaign reporting until execution surfaces are explicitly restored
- for ticket / event campaigns, review purchase concentration by `platform_position`; if Stories / Reels are producing purchases while feed is weak, split or bias placements instead of treating all placements as equal
- if a secondary video test is producing views or LPV but not purchases, cap it or pause it before scaling the campaign
- if a third-party ticketing path like Eventbrite is already firing Meta purchase / LPV events, backend access is not required for first-pass warm retargeting; a website custom audience can still be built from the stable ticket URL token plus purchase exclusion
- if a low-budget ticket campaign also has a customer-provided spreadsheet that matches the live buyer skew, clean it into an adult deduped customer-list audience and merge it into the existing warm ad set before creating multiple extra CRM ad sets
- if a vendor delivers `IGP` / `IGS` / `TVH` video variants, prioritize `IGP + IGS` first for Meta paid; hold `TVH` unless a specific horizontal use case exists
- when creating a placement-split `asset_feed_spec`, keep one shared link URL and use unique body/title asset values per labeled variant or Meta can reject the creative as a duplicate-asset payload
- freshly uploaded videos may not be ad-ready immediately; wait for the video processing status to be `ready` before creating the ad creative
- when a new support creative is meant to help an existing winner structure, add it inside the strongest live ad sets before creating overlapping duplicate-audience test ad sets

## CBO spend controls

When the budget sits on the campaign, treat the setup as CBO / campaign budget optimization.

If one winner starts monopolizing spend or new geo / retargeting lines are not getting a fair test, use light ad set controls instead of immediately raising the campaign budget.

Context7-confirmed field names:

- `daily_min_spend_target` = best-effort ad set floor
- `daily_spend_cap` = ad set cap

Practical rule:

- use minimums to force a real spend test for new geos or warm retargeting
- use caps to stop one dominant ad set from swallowing too much campaign budget
- once a new geo or warm line has had a fair test without fresh purchase proof, remove its minimum and leave only the cap so the test can stay live without forcing spend
- reserve active minimums for the current closing lines, not every active ad set
- do not overconstrain every ad set or CBO stops acting like real CBO

Operator clarity rule:

- talk about budgets in normal dollars like `$100.00/day` and `$150.00/day`
- only use raw API minor-unit values when writing the actual Graph payload

## Cross-repo rule

If a task needs closed-loop attribution or call-first funnel behavior, use Omaha as the reference implementation.
If a task needs campaign ops, snapshots, reporting, or bounded Meta mutations, use Outlet as the reference implementation.
