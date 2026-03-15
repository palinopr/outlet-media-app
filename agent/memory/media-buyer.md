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
- Contains "sienna" -> "sienna"
- Contains "vaz vil" or "kiko blade" -> "vaz_vil"
- Contains "don omar" -> "don_omar_bcn"
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

## Current Campaigns (Mar 9 2026, Cycle #156)
- **29 total** (8 ACTIVE, 21 PAUSED). Data from Mar 8 18:01 CST (>24h stale).

### ACTIVE (8)
- KYBBA Miami -- $2,703 spend, 2.47x ROAS, $100/day. Show Mar 22. **Delivery issue: only $2-6/day actual on $100/day budget.**
- Camila Anaheim -- $1,541 spend, 4.16x ROAS, $100/day. Show Mar 14.
- Camila Sacramento -- $1,539 spend, 4.92x ROAS, $100/day. Show Mar 15.
- Camila Phoenix -- $1,771 spend, 3.02x ROAS, $500/day. Show Mar 8 PAST -- should be paused.
- Arjona Salt Lake City -- $1,131 spend, 17.72x ROAS, $800/day. Show Mar 9 TODAY -- pause after show.
- Arjona Palm Desert -- $320 spend, 3.35x ROAS, $500/day. Show Mar 12.
- Arjona San Francisco -- $323 spend, 7.51x ROAS, $50/day. Show Mar 15.
- Vaz Vil - Kiko Blade -- $197 spend, 0x ROAS, $50/day. 7+ consecutive 0x snapshots. Alert posted.

### Notable PAUSED
- Don Omar BCN -- $370, 6.73x ROAS, $600/day. PAUSED by Jaime. Concert Jul 23 via Vivaticket.
- Sienna - Peace In Mind -- $776, $200/day. ViewContent optimization (music artist), 0x ROAS expected. PAUSED by Jaime ~Mar 8.
- Camila Houston -- $2,977, 5.90x ROAS. Was reactivated and scaled ($2,700/day).
- Camila Dallas -- $625, 19.02x ROAS. Was reactivated ($1,600/day).
- Alofoke -- $1,448, 9.79x ROAS. Boston show Mar 2 past.

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

<!-- auto-learned 2026-03-06 -->
- Sienna now has age-split adsets: 18-24, 25-34, 35-44 (active); 65+/broad paused
- Sienna 18-24 cost/ViewContent $2.98; 25-34 $2.15; broad $0.76-$0.86

<!-- auto-learned 2026-03-06 -->
- Sienna funnel: Ad → ToneIn landing → Spotify click = ViewContent
- Sienna expanding to international markets (LATAM, SE Asia, Europe)
- Sienna international adsets target 18-34 age range only

<!-- auto-learned 2026-03-06 -->
- Camila Phoenix show date: Mar 8 2026, ~$900 budget remaining
- Camila Phoenix stats: $1,078 spent, 19 purchases, 2.67x ROAS, $56.74 CPA

<!-- auto-learned 2026-03-06 -->
- Sienna: 12 new ads added from Google Drive across 3 active adsets
- Sienna vertical .mov (106MB) failed Meta upload; used story image fallback
- Sienna creatives: album art img, podcast vid, dark listening vid, beige player vid

<!-- auto-learned 2026-03-07 -->
- KYBBA Miami at $2,712 spent, 59 purchases, 2.47x ROAS, 4.4 frequency

<!-- auto-learned 2026-03-07 -->
- KYBBA: video ads outperform static (~$34 CPA vs $82 CPA)
- KYBBA best ad: video 11 ($749 spent, 22 purchases, 3.49x ROAS)
- KYBBA video 12(b) highest ROAS at 4.35x, $32.51 CPA

<!-- auto-learned 2026-03-07 -->
- Don Omar BCN: $224 spent, 4 purchases, 6.53x ROAS, $56 CPA

<!-- auto-learned 2026-03-07 -->
- Don Omar BCN: video ad 16.69x ROAS/$27 CPA vs image 3.20x/$84 CPA
- Don Omar BCN: 30 ATCs → 9 payment info → 4 purchases (13% ATC→purchase)
- Don Omar BCN: plan to pause image ad, shift all budget to video

<!-- auto-learned 2026-03-07 -->
- Don Omar BCN image ad paused; now video-only (all $100/day to video)

<!-- auto-learned 2026-03-07 -->
- Camila Phoenix: $579 spent, 14 purchases, 3.51x ROAS, $41 CPA (Mar 7)
- Camila Anaheim: 3 weak ads paused; Video 3 star (8.11x/$29 CPA)
- Camila Sacramento: 2 weak ads paused; asset 2 fixed star (9.49x/$26 CPA)
- Camila Phoenix show Mar 8; Anaheim Mar 14; Sacramento Mar 15

<!-- auto-learned 2026-03-07 -->
- Camila Anaheim: Video 6 paused ($84 CPA); adsets 5+6 paused (dead)
- Camila Sacramento: video 3 paused ($60 CPA, 2.06x); Bay Area adset paused
- Camila Anaheim: 3 active adsets remain (Video 3/4 + asset 2 fixed)
- Camila Sacramento: 6 active adsets remain after cleanup

<!-- auto-learned 2026-03-08 -->
- Arjona Salt Lake City show date: Mar 9 2026, 34.28x ROAS, $800/day

<!-- auto-learned 2026-03-08 -->
- Arjona SLC: ad copy swap "Manana"→"Hoy" scheduled for show day

<!-- auto-learned 2026-03-08 -->
- Arjona SF: $284 spent, 8 purchases, 8.55x ROAS, $35.50 CPA, $50/day
- Camila Sacramento frequency 3.66 — approaching fatigue, needs fresh creative
- Camila Phoenix: pause tonight after Mar 8 show

<!-- auto-learned 2026-03-08 -->
- Don Omar BCN budget bumped from $100/day to $600/day (Mar 7)

<!-- auto-learned 2026-03-08 -->
- Arjona SLC Mar 8: $526 spent, 42 purchases, 17.74x ROAS, $12.53 CPA
- Arjona Palm Desert: $50/day, 13.87x ROAS, show Mar 12
- Vaz Vil: 6 straight days zero purchases, kill decision pending
- Don Omar BCN campaign currently PAUSED
- KYBBA Miami Mar 8: $18.69 CPA, 4.25x ROAS (best day recently)

<!-- auto-learned 2026-03-08 -->
- Arjona Palm Desert Mar 8: $320 spent, 4 purchases, 3.35x ROAS, $80 CPA

<!-- auto-learned 2026-03-10 -->
- KYBBA Miami: $5,110 campaign spend cap, $4,884 spent, ~$226 left

<!-- auto-learned 2026-03-10 -->
- KYBBA Miami: budget cut $100/day → $50/day (Mar 10), review end of week

<!-- auto-learned 2026-03-10 -->
- Camila ads switched to official Camila MX FB page (254160188123)
- Camila MX IG actor: 17841400367905728 (@camilamx)

<!-- auto-learned 2026-03-10 -->
- Camila Sacramento Mar 10: $1,749 spent, 34 purchases, 4.72x ROAS, freq 4.07
- Camila Anaheim Mar 10: $1,751 spent, 29 purchases, 3.97x ROAS, freq 2.98

<!-- auto-learned 2026-03-10 -->
- Don Omar FB page: 21608835481 (23.6M fans), IG: 17841400670290220
- Meta blocks owner/Business Manager ID lookup without business_management perm

<!-- auto-learned 2026-03-10 -->
- Arjona Palm Desert Mar 10: $1,055 spent, 11 purchases, 2.14x ROAS, $96 CPA
- Arjona Palm Desert: only 1 active ad (Asset 1) carrying all spend
- Influencer video content requested urgently for Arjona Palm Desert

<!-- auto-learned 2026-03-10 -->
- Sienna fan page: "Sienna Music" / @siennamusicofficial (correct)
- Sienna has 3 active adsets: EUR/SEA, LATAM, US
- Meta upload: files >130MB need chunked upload API (413 error)
- 4 new video creatives added to Sienna campaign (Mar 10)

<!-- auto-learned 2026-03-10 -->
- Sienna V5 (ad 4174436769535587) + V6 (951929210749482) created Mar 10
- Sienna: 17 broken 0310 ads paused, replaced by V5/V6 (2 correct ads)
- Sienna creatives = 2 videos (not 4), each split post+story

<!-- auto-learned 2026-03-12 -->
- Pixel "El Destilero" created: ID 939151375333756 (ad account AA1)
- Pixel access: Jaime Ortiz, Isabel Leal, Alexandra Victoria (edit/analyze/advertise)

<!-- auto-learned 2026-03-14 -->
- Camila all cities lifetime: $13,203 spent, 325 purchases, 5.13x ROAS

<!-- auto-learned 2026-03-14 -->
- Camila all-cities spend cap target: $15,000
- Camila Sacramento: $1,800/day budget, auto-ends 6pm PDT Mar 14