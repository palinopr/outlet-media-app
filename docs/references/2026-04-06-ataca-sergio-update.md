# Ataca Sergio Update

Date: April 6, 2026
Event: Festival 'ATACA SERGIO'
Venue: Prudential Center, Newark, NJ
Event date: May 30, 2026
TM1 event ID: 4328284920683167746
TM1 tcode: NTL-OSV
Meta campaign: 120244385512050525 (`Zamora - Ataca Sergio - 05/30`)

## What We Did Today

- Pulled a live TM1 snapshot from the authenticated TM1 browser session.
- Pulled targeted TM1 report data for summary, traffic, channels, platforms, pricing, and inventory.
- Reviewed the live TM1 inventory map and captured the visible house state.
- Exported and analyzed TM1 `Sales by Location` as Excel.
- Reviewed exported `Traffic Trends` PDF.
- Queried Meta Marketing API for campaign, daily insights, region breakdown, ad sets, ads, and ad-level performance.

## Current TM1 Snapshot

- Sold: 251
- Comp: 200
- Open: 7,192 to 7,467 depending on TM1 view used
- Holds: about 4,000
- Kills: 5,224
- Net/sellable capacity: about 11,920
- Total revenue: about $31,800 to $31,879 depending on report view
- Sell-through: about 2.1%
- Tickets sold today at time of pull: 1

Additional export confirmation:

- `event-audit.xlsx` shows 451 total distributed, 11,464 available, 11,915 net capacity, and 5,224 kills
- `inventory-status-host.pdf` shows 17,144 filtered seats with 7,469 open, 4,000 hold, 251 sold, 200 comp, and 5,224 kill
- `conversion-quadrant.xlsx` shows retail availability at about 94.28%

## Traffic and Conversion

Source: `/Users/jaimeortiz/Downloads/traffic-trends.pdf`

- Total EDP visits: 2,152
- Total orders: 32
- Average EDP conversion: 1.49%
- Total tracked TM1 value: $10,748

Interpretation:

- The problem is not zero traffic.
- People are reaching the event page, but conversion is too soft for how much inventory is open.

Supporting export:

- `conversion-quadrant.xlsx` confirms 2,152 EDP visits, 32 orders, 70 tickets, 1.49% EDP conversion, and about 195.6 average EDP visits over the lifetime window

## Sales Geography

Source: `/Users/jaimeortiz/Downloads/sales-by-location (1).xlsx`

Known-location total tickets in export: 235

- New York market: 172 tickets, about 73.2%
- Philadelphia market: 22 tickets
- Washington DC market: 8 tickets
- Hartford and New Haven market: 6 tickets
- NJ and NY regions combined: 181 tickets, about 77.0%

Top regions:

- Passaic, NJ: 29
- Union, NJ: 25
- Middlesex, NJ: 17
- Hudson, NJ: 17
- Philadelphia, PA: 14
- Bergen, NJ: 12
- Bronx, NY: 12
- Essex / Newark, NJ: 8

Top postal codes:

- 07204 Roselle Park, NJ: 10
- 08861 Perth Amboy, NJ: 8
- 19124 Philadelphia, PA: 7
- 07470 Wayne, NJ: 6
- 07032 Kearny, NJ: 6
- 20855 Derwood, MD: 6

Interpretation:

- This is a broader NY/NJ metro show, not only a Newark-local show.
- Philadelphia is meaningful.
- Essex / Newark matters, but it is not the dominant source of sales on its own.

## Meta Campaign Read

Date window used for most Meta reads: March 27, 2026 to April 5, 2026

Campaign-level results:

- Spend: $353.77
- Impressions: 46,462
- Reach: 21,621
- Clicks: 1,231
- Link clicks: 1,013
- Landing page views: 763
- View content: 790
- Purchases: 4
- Purchase ROAS: 2.97
- Purchase CPA: $88.44

Daily pattern:

- April 3: $86.75 spend, 99 LPV, 0 purchases
- April 4: $141.74 spend, 292 LPV, 3 purchases
- April 5: $125.28 spend, 372 LPV, 1 purchase

Interpretation:

- Meta is not dead. It is producing traffic and some purchases.
- The setup is not efficient enough yet to justify simply opening more inventory or scaling hard without changes.

## Channel and Platform Read

Sources:

- `/Users/jaimeortiz/Downloads/sales-channels.xlsx`
- `/Users/jaimeortiz/Downloads/sales-by-platform.xlsx`

Paid sold ticket mix by sales channel:

- Mobile: 209 sold, about 83.6%
- Internet: 22 sold, about 8.8%
- Primary Box Office: 17 sold, about 6.8%
- Agent Assisted Phone: 2 sold, about 0.8%

Platform mix:

- Mobile: 211 sold, $28,238.45
- Desktop: 22 sold, $4,539.40
- Box Office: 17 sold, $1,383.34
- Platform not specified: 200 sold, $0.00
- Transfer: 4
- Resale: 2

Interpretation:

- This show is overwhelmingly a mobile-buying event.
- Mobile accounts for about 83.6% of paid sold tickets and about 82.1% of paid revenue.
- Creative and landing-page quality on mobile matter more than anything else in the conversion path.

## Meta Geo and Creative Findings

Active ad set geo:

- Active ad sets were centered on Prudential Center with a 25-mile radius.

Interpretation:

- That is too tight for what the TM1 sales-by-location export shows.
- The campaign should cover the broader NY/NJ metro and keep Philadelphia in plan.

Active ad sets with actual delivery:

- Ataca Sergio - Con Patrocinio
- Ataca Sergio - Version Invitados - Oscar D'Leon
- Ataca Sergio - Version Invitados - La india
- Ataca Sergio - Video - Huey Dunbar

Best ad-level purchase signals in the pull:

- `Oscar D'Leon` asset ad: 1 purchase, 276 LPV
- `La India` asset ad: 1 purchase, 42 LPV

Observed pattern:

- Guest/asset ads produced the clearest purchase signal.
- Several video ads produced clicks and LPV but no purchases in the pulled sample.

## Inventory and Seat Strategy Read

From the live seat map and TM1 inventory reports:

- The house is already staged on one side, but the event is still too open overall.
- Upper and outer visible inventory is still broad, especially in weaker outer/upper areas.
- Premium inventory is not the main issue. Lower and mid-cheap inventory is much heavier.

Price-level health from TM1:

- `P1` looked relatively healthy: about 34 sold vs about 40 open
- `P7-P10` remained very heavy and weak
- `P7-P10` open counts were still far above current demand

Event Audit price-level read:

- Sold by price level: P1 34, P2 10, P3 23, P4 44, P5 18, P6 54, P7 27, P8 12, P9 12, P10 17
- Available by price level: P1 320, P2 368, P3 508, P4 937, P5 1492, P6 1613, P7 2058, P8 1317, P9 1860, P10 991
- Kills by price level are already concentrated in P2-P4, especially P2 1453 and P3 2059

Inventory pressure summary:

- P1-P4 account for 2,133 available seats, about 18.6% of available inventory
- P5-P10 account for 9,331 available seats, about 81.4% of available inventory
- P7-P10 alone account for 6,226 available seats, about 54.3% of available inventory
- At the level-by-level view, most price levels are still more than 90% available

Inventory Status Host qualifiers:

- Rear-qualified inventory: 2,713 seats
- No qualifier: 11,098 seats

Interpretation:

- The inventory problem is concentrated in the broader cheap and mid-price house, not in premium.
- We already have meaningful kills in some better bands, but the event is still too loose in P5-P10.
- If more tightening happens next, it should keep attacking weak outer and upper inventory before touching stronger-looking premium and lower-bowl conversion zones.

Interpretation:

- Do not open more seats right now.
- Tighten weak outer and upper inventory first.
- Keep the better lower and premium sections visible.

## Plain-English Conclusion

- People are seeing the event.
- Some people are buying.
- The event is still far too open for the current pace.
- The ad geo is too tight for the way the actual buyers are distributed.
- The best next move is not opening inventory. The best next move is tightening weak inventory and widening the ad geography to match the real NY/NJ + Philadelphia demand pattern.

## Recommended Next Actions

1. Do not open more seats yet.
2. Close more weak upper and outer sections first.
3. Keep stronger lower-bowl and premium inventory visible.
4. Expand Meta targeting beyond the current 25-mile arena radius.
5. Focus on broader NY/NJ metro coverage first.
6. Keep Philadelphia in the paid plan.
7. Keep the guest asset ads that produced purchases.
8. Reduce or rotate video ads that are getting traffic without purchases.

## Most Useful Next TM1 Exports

If we want better decision support next, these are the highest-value exports:

- Event Audit
- Inventory Status (Host)
- Sales Channels
- Sales by Platform
- Order Details BETA

These will help answer:

- which sections are actually converting
- which price points are moving
- whether mobile/desktop/channel mix is hurting conversion
- whether we should tighten the building more aggressively

The new exports from today made these points much clearer:

- `event-audit.xlsx` was one of the highest-value exports because it tied sold, available, net capacity, and kills together by price level
- `sales-channels.xlsx` and `sales-by-platform.xlsx` confirmed this is a mobile-heavy buyer path
- `inventory-status-host.pdf` confirmed the house is still extremely loose overall
- `traffic-trends.pdf` and `conversion-quadrant.xlsx` confirmed that traffic exists, but conversion remains too low relative to availability

## Source Files Used Today

- `/Users/jaimeortiz/Downloads/traffic-trends.pdf`
- `/Users/jaimeortiz/Downloads/sales-by-location (1).xlsx`
- `/Users/jaimeortiz/Downloads/conversion-quadrant.xlsx`
- `/Users/jaimeortiz/Downloads/sales-by-platform.xlsx`
- `/Users/jaimeortiz/Downloads/sales-channels.xlsx`
- `/Users/jaimeortiz/Downloads/inventory-status-host.pdf`
- `/Users/jaimeortiz/Downloads/event-audit.xlsx`
