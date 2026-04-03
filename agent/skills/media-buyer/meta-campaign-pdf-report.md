> Auto-created by Media Buyer on 2026-03-26

# Meta Campaign PDF Report Generation

Generate a professional PDF report for any Meta campaign with full KPIs, adset breakdown, daily trends, and insights.

## Steps

### 1. Fetch Campaign Data from Meta API

```bash
# Get campaign-level lifetime stats
curl -G "https://graph.facebook.com/v21.0/act_787610255314938/campaigns" \
  --data-urlencode "filtering=[{\"field\":\"name\",\"operator\":\"CONTAIN\",\"value\":\"CAMPAIGN_NAME\"}]" \
  --data-urlencode "fields=id,name,status,daily_budget,lifetime_budget" \
  --data-urlencode "access_token=$META_TOKEN"

# Get campaign insights (lifetime)
curl -G "https://graph.facebook.com/v21.0/<CAMPAIGN_ID>/insights" \
  --data-urlencode "fields=spend,impressions,clicks,cpc,cpm,ctr,actions,action_values,cost_per_action_type,video_avg_time_watched_actions,video_p25_watched_actions,video_p50_watched_actions,video_p75_watched_actions,video_p100_watched_actions" \
  --data-urlencode "date_preset=maximum" \
  --data-urlencode "access_token=$META_TOKEN"

# Get adset-level breakdown
curl -G "https://graph.facebook.com/v21.0/<CAMPAIGN_ID>/insights" \
  --data-urlencode "level=adset" \
  --data-urlencode "fields=adset_name,spend,impressions,clicks,actions,action_values,cost_per_action_type" \
  --data-urlencode "date_preset=maximum" \
  --data-urlencode "access_token=$META_TOKEN"

# Get daily breakdown (last 30 days)
curl -G "https://graph.facebook.com/v21.0/<CAMPAIGN_ID>/insights" \
  --data-urlencode "fields=spend,actions,action_values" \
  --data-urlencode "time_range={\"since\":\"YYYY-MM-DD\",\"until\":\"YYYY-MM-DD\"}" \
  --data-urlencode "time_increment=1" \
  --data-urlencode "access_token=$META_TOKEN"
```

### 2. Extract Key Metrics from Response

From `actions` array, extract by `action_type`:
- `link_click` → Clicks
- `landing_page_view` → Landing Page Views
- `offsite_conversion.fb_pixel_initiate_checkout` → Checkouts
- `offsite_conversion.fb_pixel_purchase` → Purchases
- `video_view` → Video Views
- `post_reaction` → Reactions
- `post_save` → Saves

From `action_values` array:
- `offsite_conversion.fb_pixel_purchase` → Revenue

**ROAS** = Revenue / Spend

### 3. Build HTML Report

Structure the HTML with these sections:
1. **Header** — Campaign name, client, date range, generation date
2. **Lifetime KPIs** — Total spend, purchases, ROAS, estimated revenue (formatted cards)
3. **Period Comparison Table** — Lifetime vs Last 30d vs Last 7d
4. **Conversion Funnel** — Clicks → LPV → Checkouts → Purchases (with drop-off rates)
5. **Adset Ranking Table** — All adsets sorted by spend: name, spend, purchases, ROAS, CPA
6. **Daily Breakdown Table** — Day-by-day: date, spend, purchases, ROAS
7. **Key Insights** — 3-5 bullet points analyzing trends, best performers, issues
8. **Engagement Metrics** — Video views, reactions, saves, comments

### 4. Convert HTML to PDF

```javascript
// Using Puppeteer (available in agent environment)
const puppeteer = require('puppeteer');
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setContent(htmlContent);
await page.pdf({
  path: 'agent/session/<CLIENT>-<CAMPAIGN>-Report.pdf',
  format: 'A4',
  margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
  printBackground: true
});
await browser.close();
```

### 5. Output Location

Reports saved to: `agent/session/<CLIENT>-<CAMPAIGN>-Report.pdf`

## Notes
- Monetary values from Meta API are in dollars (not cents like Supabase)
- Use `date_preset=maximum` for lifetime, `last_30d` / `last_7d` for period comparisons
- Adset-level data uses `level=adset` parameter on campaign insights endpoint
- Style the HTML with inline CSS for reliable PDF rendering (dark headers, alternating row colors, card layouts)