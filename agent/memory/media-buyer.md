# Media Buyer Agent Memory

## Role
Meta Ads specialist. Manages Facebook/Instagram campaigns via Graph API v21.0.
Can read campaign data, modify budgets, create/pause adsets, fix delivery issues.

## Meta API Credentials
- Ad Account: act_787610255314938
- Business Manager: 229314527708647 (Outlet Media LLC)
- Pixel ID: 879345548404130
- Page ID: 175118299508364
- Instagram ID: 17841402356610735
- API Version: v21.0
- Token location: ../.env.local (META_ACCESS_TOKEN)

## Client Slug Mapping
Campaign name determines client slug for Supabase:
- Contains "arjona" or "camila" or "alofoke" -> "zamora"
- Contains "kybba" -> "kybba"
- Contains "beamina" -> "beamina"
- Contains "happy" or "paws" -> "happy_paws"
- Default -> "unknown"

## Campaign Strategy
- CBO (Campaign Budget Optimization) + broad targeting
- 3-Day Rule: every new creative gets 3 days to prove itself, then kill or scale
- Best performing segment: Female 35-44 (historically 9.8x ROAS)
- Facebook > Instagram for purchases
- Retargeting = 5x ROAS typically
- NEVER kill a city/show entirely -- find new strategy
- ROAS below 2.0 = flag for review, not automatic kill
- Urgency creatives in the final week before show date

## Data Storage Conventions
- Supabase stores monetary values in CENTS (bigint): spend=224000 = $2,240.00
- Meta API: daily_budget/lifetime_budget come in cents natively
- Meta API: spend comes as dollar string -- multiply by 100 for Supabase
- Meta API: cpm/cpc come as dollar strings -- stored as-is (NOT multiplied)
- Meta API: ctr comes as percentage string (e.g. "1.48" = 1.48%)
- ROAS is stored as a float (e.g. 8.4) -- NOT cents, not percentage
- Session cache: spend = dollars (float), daily_budget_cents = cents (int)

## Video Upload Pattern
Use `act_787610255314938/advideos` with `-F "source=@\"$FILE_PATH\""` (escaped quotes required).
Commas in filenames cause curl exit code 26 without the quotes.
Always verify video status is `ready` before using in ads.

## Ad Delivery Error -- 191x100 Crop Key
- Meta deprecated the 191x100 image crop key. Ads using it fail silently.
- Detection: GET /{AD_ID}?fields=issues_info -- look for error_code 2490085
- Fix: rebuild creative WITHOUT the crop entry, create new ad, pause old.
- Don't reuse old adlabel names when creating new creative.
- Meta rejects two image entries with same hash -- drop duplicate, don't strip crop.

## Current Campaigns (Feb 25)
- 5 ACTIVE: Alofoke (8.72x, $250/day), Camila Ana (3.81x, $100/day), Camila Sac (4.42x, $100/day), KYBBA (2.47x, $50/day), Houston ($0, $400/day)
- 13 PAUSED
- KYBBA adset swap executed Feb 24: PAUSED V9+V1, ACTIVATED V5+Asset1
- Alofoke budget bumped $100->$250/day (under $2K client cap)

## Business Manager Users
7 people: Jaime, Alexandra, Isabel Leal, Antonella, Cinzia, sofia, EL JD
User lookup: `act_{ID}/assigned_users?business=229314527708647` (NOT /business_users)

## Meta Intraday Reporting Lag
Within-day spend deltas are unreliable. Campaigns show <3% of expected daily delivery after 12 hours.
True daily spend finalizes 24-48h after the day ends.
Use daily snapshots for trend analysis, not intraday deltas.


<!-- auto-learned 2026-02-26 -->
- Camila Houston: "mañana" text is baked into visual creatives, not ad body text

<!-- auto-learned 2026-02-26 -->
- Camila Houston: $4K campaign spend cap, daily budget now $2,700/day
- Camila Houston: ~$2,067 spent, zero purchases as of Feb 26

<!-- auto-learned 2026-02-26 -->
- Camila Houston adset "Houston 3" paused; Houston 2 & 5 remain active

<!-- auto-learned 2026-03-04 -->
- KYBBA spend cap: $5,110, daily budget now $100/day (up from $50)
- KYBBA spent $4,307.55 of $5,110 cap as of Mar 4; show is Mar 22

<!-- auto-learned 2026-03-04 -->
- Arjona SLC active $100/day, 10.26x ROAS as of Mar 4
- Arjona Palm Desert & SF active $50/day each, 0 purchases
- Camila San Diego active $300/day, 1.00x ROAS, $655 spent
- Arjona San Diego & Arjona Anaheim campaigns paused

<!-- auto-learned 2026-03-04 -->
- Arjona Palm Desert & SF: zero interest targeting (broad 50mi, 18-65)
- Arjona SLC show date: Mar 19

<!-- auto-learned 2026-03-04 -->
- 2026 YTD (thru Mar 4): $24.8K spend, $132.5K revenue, 5.33x ROAS, 631 purchases
- Camila Houston now $17.6K revenue/5.90x ROAS (was zero purchases Feb 26)
- Camila Dallas: $625 spent, $11.9K revenue, 19.02x ROAS

<!-- auto-learned 2026-03-04 -->
- Camila Phoenix active at $300/day as of Mar 4
- Sienna "Peace In Mind" campaign active, spending ~$50/day
- Vaz Vil "Kiko Blade" new campaign ramping as of Mar 4

<!-- auto-learned 2026-03-04 -->
- Sienna "Peace In Mind": 65+ eats 70% of budget, zero purchases at $289 spent
- Sienna: no purchase pixel signal yet; Meta chasing cheap 65+ clicks

<!-- auto-learned 2026-03-05 -->
- Don Omar Spain pixel created: ID 2005949343681464
- Pixel 2005949343681464: Jaime, Isabel, Alexandra have EDIT+ANALYZE access

<!-- auto-learned 2026-03-05 -->
- aa1 is shorthand for ad account act_787610255314938

<!-- auto-learned 2026-03-06 -->
- Sienna "Peace In Mind" budget now $100/day (was ~$50/day)
- Sienna optimized for ViewContent, not purchases; 0x ROAS expected
- Sienna at $608 spent, 3.04% CTR, $7.92 CPM, 475 ViewContent

<!-- auto-learned 2026-03-06 -->
- Don Omar BCN campaign created: ID 120243011364360525, PAUSED $50/day
- Don Omar BCN adset: 120243011428280525, Barcelona 50km, 18-65, broad
- Don Omar BCN landing page: cookmusicfest.es/don-omar-barcelona-1/
- Don Omar BCN: 2 ads (video+image), split post/story placements
- Don Omar BCN creatives sourced from shared Google Drive folder

<!-- auto-learned 2026-03-06 -->
- Don Omar BCN campaign spend cap set to $9,939
- Don Omar BCN end date: Jul 23 2026 6PM Barcelona time
- Don Omar BCN caption uses "ÚNICO SHOW en España" messaging
- Tenerife and Sevilla Don Omar shows are SOLD OUT

<!-- auto-learned 2026-03-06 -->
- CTA must always be "Shop Now" for event/ticket campaigns
- Fan page: use artist's page, fallback to Zamora if unavailable
- Advantage+ Creative enhancements: ALL set to 0 (disabled)