> Auto-created by Media Buyer on 2026-03-04

# Meta Campaign Diagnosis & Optimization Procedure

When asked to improve/diagnose Meta ad campaigns, follow this workflow:

## Step 1: Pull Campaign Performance Data

Query Supabase `campaign_snapshots` + `meta_campaigns` for the relevant campaigns:

```sql
-- Get latest snapshot per campaign
SELECT mc.name, mc.status, mc.daily_budget,
       cs.spend, cs.roas, cs.purchases, cs.landing_page_views, cs.cpa
FROM meta_campaigns mc
LEFT JOIN campaign_snapshots cs ON mc.campaign_id = cs.campaign_id
WHERE mc.name ILIKE '%{artist/brand}%'
ORDER BY cs.snapshot_date DESC;
```

- `spend` is in **cents** → divide by 100 for display
- `daily_budget` is already in cents
- `roas` is a float (e.g., 8.4)

## Step 2: Diagnose Each Campaign

Build a table with: City, Budget, Spent, Purchases, ROAS, CPA, LPVs

Apply these diagnostic rules:
| Signal | Diagnosis |
|---|---|
| High spend + 0 purchases | Past kill threshold — check targeting & funnel |
| High LPVs + 0 purchases | Traffic is good → audience/funnel problem, not ad creative |
| High ROAS (>3x) | Candidate for budget scaling |
| Low LPVs + low spend | Still in learning phase — wait |
| PAUSED status | Candidate for reactivation with fixes |

## Step 3: Check Targeting via Meta API

```bash
# Get adset targeting for a campaign
curl -G "https://graph.facebook.com/v21.0/act_787610255314938/adsets" \
  -d "filtering=[{\"field\":\"campaign.name\",\"operator\":\"CONTAIN\",\"value\":\"{campaign_name}\"}]" \
  -d "fields=name,targeting,daily_budget,status" \
  -d "access_token=$META_TOKEN"
```

Look for:
- **Broad targeting** (no `flexible_spec` interests) → likely cause of clicks-but-no-purchases
- **Geo radius** too wide or too narrow
- **Age range** mismatch for the artist's audience

## Step 4: Recommend Actions

### Zero-purchase campaigns with traffic:
1. Add `flexible_spec` interest targeting (artist name, genre, related artists)
2. Keep budget, give 3 more days to test

### High-ROAS campaigns:
1. Scale budget by **30% max** (Meta's recommended scaling rule)
2. Don't change targeting on what's working

### Paused campaigns with upcoming show dates:
1. Apply same interest-targeting fix before reactivating
2. Prioritize by show date proximity

### Funnel verification:
1. Manually check ticket landing page links for each city
2. High LPVs + 0 purchases can indicate broken/slow landing pages

## Step 5: Add Interest Targeting (if approved)

```bash
# Find interest IDs
curl -G "https://graph.facebook.com/v21.0/search" \
  -d "type=adinterest" \
  -d "q={artist name}" \
  -d "access_token=$META_TOKEN"

# Update adset with interests
curl -X POST "https://graph.facebook.com/v21.0/{adset_id}" \
  -d "targeting={\"geo_locations\":{...},\"age_min\":18,\"age_max\":65,\"flexible_spec\":[{\"interests\":[{\"id\":\"INTEREST_ID\",\"name\":\"Interest Name\"}]}]}" \
  -d "access_token=$META_TOKEN"
```

## Key Thresholds
- **Kill threshold**: $50+ spend with 0 purchases
- **Scale rule**: Max 30% budget increase at a time
- **Learning phase**: ~50 optimization events needed