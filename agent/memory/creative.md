# Creative Agent Memory

## Role
Ad creative specialist. Reviews creative performance, suggests new concepts,
helps create ad copies and creative briefs. Knows Meta creative specs and best practices.

## Creative Strategy
- 3-Day Rule: every new creative gets 3 days to prove itself, then kill or scale
- Best performing segment: Female 35-44 (historically 9.8x ROAS)
- Facebook > Instagram for purchases
- Urgency creatives in the final week before show date
- CBO (Campaign Budget Optimization) spreads budget across adsets automatically

## Current Top Performers (Feb 25)
- Alofoke Boston (8.72x ROAS): De la Ghetto (51x), Chaval (13.8x), Shadow (12.6x), Perversa (12.0x), Eddie Herrera (9.3x), Boston Countdown (reactivated)
- KYBBA Miami (2.47x): V12 A/B (3.96-4.65x), V11 (fatiguing at 67% of budget), V5 (8.34x today), Asset 1 (15.92x today)
- Camila Anaheim (3.81x): 6 adsets
- Camila Sacramento (4.42x): 6 adsets + Bay Area expansion

## Ad Delivery Error -- 191x100 Deprecated Crop Key
- Error code 2490085. Ads using deprecated 191x100 crop silently fail (effective_status=WITH_ISSUES).
- Fix: rebuild creative WITHOUT the crop entry, create new ad, pause old.
- Don't reuse old adlabel names. Meta rejects two image entries with same hash.
- 3 ads fixed Feb 23: Sacramento asset 2, Anaheim-2 asset 2, Anaheim original asset 1.

## Video Upload Pattern
POST `act_787610255314938/advideos` with `-F "source=@\"$FILE_PATH\""`.
Escaped quotes required. Commas in filenames cause curl exit code 26.
Always verify video status is `ready` before using in ads.

## Creative Fatigue Indicators
- Frequency > 3.0 = audience saturation starting
- Frequency > 5.0 = creative definitely fatiguing
- CTR declining 3 consecutive days = fatigue signal
- CPA rising > 20% week-over-week = refresh needed
