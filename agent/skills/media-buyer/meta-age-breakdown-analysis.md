> Auto-created by Media Buyer on 2026-03-04

# Meta Ad Campaign Age Breakdown Analysis

Procedure for pulling and analyzing spend/reach/conversion data by age group from Meta Ads API to diagnose budget allocation issues.

## When to Use
- Campaign spend seems skewed toward unexpected demographics
- Need to understand which age groups are converting
- Diagnosing why Meta's algorithm is chasing cheap engagement vs purchases

## Steps

### 1. Pull Age Breakdown from Meta Insights API

```bash
curl -G "https://graph.facebook.com/v21.0/{adset_or_campaign_id}/insights" \
  --data-urlencode "breakdowns=age" \
  --data-urlencode "fields=spend,reach,clicks,actions,cost_per_action_type" \
  --data-urlencode "date_preset=lifetime" \
  --data-urlencode "access_token={TOKEN}"
```

Key fields to extract per age bucket:
- `spend` — dollar string
- `reach` — unique users
- `clicks` — link clicks
- `actions` where `action_type` = `landing_page_view`, `view_content`, `purchase`

### 2. Build the Age Summary Table

Age buckets returned by Meta: `18-24`, `25-34`, `35-44`, `45-54`, `55-64`, `65+`

For each bucket, calculate:
- Spend (absolute + % of total)
- Reach
- Clicks
- Landing page views (from `actions` array)
- View content events
- Purchases

### 3. Diagnose Skew

Red flags to look for:
| Signal | Meaning |
|--------|---------|
| One age group > 50% of spend | Algorithm locked onto cheap engagement demo |
| High spend + zero purchases | Pixel has no conversion signal, Meta optimizes for clicks |
| 55+/65+ dominating | Common when no purchase optimization signal — older users click more |
| Low-spend age group has best conversion rate | Algorithm is ignoring the best converters |

### 4. Recommended Fixes

- **Age cap**: If target demo is known (e.g., 25-54), set `age_max` on the adset to stop bleeding budget on non-target ages
- **Pixel check**: Zero purchases across ALL ages = likely pixel not firing or product-market issue
- **Audience restart**: If badly skewed, duplicate the adset with corrected age targeting rather than editing (preserves learning)

### 5. Apply Age Cap via API (if needed)

```bash
curl -X POST "https://graph.facebook.com/v21.0/{adset_id}" \
  --data-urlencode "targeting={\"age_min\":25,\"age_max\":54, ...existing_targeting}" \
  --data-urlencode "access_token={TOKEN}"
```

**Important**: Merge with existing targeting — don't overwrite geo, interests, etc. Pull current targeting first with a GET request.