> Auto-created by Media Buyer on 2026-03-06

# Meta Campaign Creation from Google Drive Assets

Full workflow to create a Meta ad campaign using creative assets from a Google Drive folder.

## Prerequisites
- Meta ad account ID (e.g., `act_787610255314938`)
- Landing page URL
- Meta Pixel ID for the campaign
- Google Drive folder URL with creative assets
- Google service account configured (for Drive access)

## Steps

### 1. Create Campaign (CBO)
- Objective: `OUTCOME_SALES`
- Status: `PAUSED` (wait for approval)
- Special ad categories as needed
- Campaign budget optimization (CBO) with daily budget (e.g., $50/day = 5000 cents)

### 2. Download Creatives from Google Drive
- Use Drive API (via service account) to list files in the shared folder
- Download all assets locally (videos + images)
- Classify by type and aspect ratio:
  - **Videos**: reel (9:16 vertical), marco/post (4:5 or 1:1)
  - **Images**: 1080x1920 (story), 1080x1350 (feed/4:5), 1080x1080 (square), 1200x630 (link)

### 3. Upload Assets to Meta
- **Videos**: POST to `act_{id}/advideos` with file
- **Images**: POST to `act_{id}/adimages` with file → get image hash

### 4. Create Ad Set
- Campaign ID from step 1
- Targeting: location radius (e.g., city + 50km), age 18-65, broad
- Optimization goal: `OFFSITE_CONVERSIONS` (purchase)
- Pixel ID linked
- Billing event: `IMPRESSIONS`
- Bid strategy: `LOWEST_COST_WITHOUT_CAP`

### 5. Create Ad Creatives (Split by Placement)
Always create **separate creatives for Post and Story placements** using `asset_feed_spec` with `asset_customization_rules`:

```json
{
  "asset_feed_spec": {
    "videos": [
      {"video_id": "<reel_id>", "adlabels": [{"name": "story_v"}]},
      {"video_id": "<marco_id>", "adlabels": [{"name": "post_v"}]}
    ],
    "bodies": [{"text": "...", "adlabels": [{"name": "default"}]}],
    "titles": [{"text": "...", "adlabels": [{"name": "default"}]}],
    "call_to_action_types": ["LEARN_MORE"],
    "link_urls": [{"website_url": "https://..."}],
    "asset_customization_rules": [
      {
        "priority": 1,
        "customization_spec": {
          "publisher_platforms": ["instagram", "facebook"],
          "instagram_positions": ["story", "reels"],
          "facebook_positions": ["story"]
        },
        "video_label": {"name": "story_v"}
      },
      {
        "priority": 2,
        "customization_spec": {},
        "video_label": {"name": "post_v"}
      }
    ]
  }
}
```

For **image** creatives, use `asset_feed_spec.images` with hash, same placement split pattern:
- Story/Reels: 9:16 vertical image (1080x1920)
- Feed/Default: 4:5 image (1080x1350)

### 6. Create Ads
- One ad per creative (video ad + image ad)
- Link to ad set from step 4
- Status: `PAUSED`

### 7. Verify
- Check ad review status — confirm no policy issues
- Summarize: campaign ID, ad set ID, ad count, creative breakdown

## Label Conventions
- `{city}_post_v` / `{city}_story_v` for video labels
- `{name}_post` / `{name}_story` for image labels

## Key Rules
- **NEVER** create single-image or single-video ads — always split post + story
- Monetary values: `daily_budget` in cents (e.g., 5000 = $50)
- Campaign starts PAUSED — activate only after approval