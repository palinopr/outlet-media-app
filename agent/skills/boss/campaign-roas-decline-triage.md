> Auto-created by Boss on 2026-02-26

# Campaign ROAS Decline Triage

Workflow for diagnosing a declining campaign and deciding whether to pause, restructure, or refresh.

## Step 1: Pull 7-Day Campaign Insights

```
GET /{campaign_id}/insights?fields=spend,actions,action_values,frequency&date_preset=last_7d&time_increment=1
```

- Account: `act_787610255314938`, API version `v21.0`
- `time_increment=1` gives daily breakdowns

## Step 2: Compute Blended Metrics

From daily rows, calculate:
- **7-day blended ROAS** = total revenue / total spend
- **CPA** = total spend / total purchases
- **Purchase frequency** = days with ≥1 purchase vs total days
- **Campaign frequency** (from insights `frequency` field) — flag if ≥3.0×

## Step 3: Analyze Daily Pattern

Build a daily table:
```
Date | Spend | Purchases | Daily ROAS
```

Look for:
- **Burst pattern**: Purchases clustered in 1-2 days with multi-day dry spells → audience fatigue / creative fatigue
- **Steady decline**: Each day worse than the last → market exhaustion
- **Random scatter**: No pattern → possible tracking / pixel issue

## Step 4: Decision Framework

| Signal | ROAS | Frequency | Pattern | Action |
|--------|------|-----------|---------|--------|
| Healthy | ≥2.0× | <2.5× | Steady | Continue |
| Warning | 1.5–2.0× | 2.5–3.0× | Declining | Restructure adsets |
| Critical | <1.5× | ≥3.0× | Burst/dead | Pause or full refresh |
| Below breakeven | <1.0× | Any | Any | Pause unless show is >21 days out |

If show is >21 days away and pattern suggests fatigue (not market death):
- **Don't panic-pause** — delegate to media buyer for adset-level diagnosis first

## Step 5: Delegate to Media Buyer

Request adset-level breakdown:
```
@media-buyer {campaign_name} 7-day ROAS dropped to {roas}×.
Pull adset-level performance for the last 7 days (spend, ROAS, purchases, CPA per adset).
Check frequency — campaign-level is at {freq}×.
Recommend whether to pause the campaign, restructure adsets, or refresh creatives.
Show is {date} ({days_out} days out).
```

Media buyer should return:
- Per-adset spend, ROAS, CPA, frequency
- Recommendation: pause / restructure / creative refresh
- If restructure: which adsets to kill, which to scale

## Step 6: Update Memory

Log the finding in agent memory with:
- Campaign name, date, 7-day ROAS, frequency
- Decision made (paused / restructured / delegated)
- Show date for context