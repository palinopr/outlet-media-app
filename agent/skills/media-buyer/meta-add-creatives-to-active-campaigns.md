> Auto-created by Media Buyer on 2026-03-06

# Add New Creatives to Active Meta Campaign Adsets

Workflow for adding new ad creatives from a Google Drive folder into all active adsets of an existing campaign.

## Steps

### 1. Download assets from Google Drive
- Access shared folder via Drive API or direct download
- Categorize assets: images (post vs story) and videos (post vs story)
- Note file sizes — large `.mov` files (>100MB) may need conversion or fallback

### 2. Upload assets to Meta
- **Images**: `POST act_{AD_ACCOUNT_ID}/adimages` with file bytes → get `hash`
- **Videos**: `POST act_{AD_ACCOUNT_ID}/advideos` with file source → get `video_id`
- Upload post and story variants in parallel when independent
- If a video fails processing, try converting (ffmpeg to mp4/h264) or use an image fallback for that placement

### 3. Create ad creatives (post+story split)
Each creative uses `asset_feed_spec` with `asset_customization_rules` to assign different assets per placement:

```
asset_customization_rules:
  - Priority 1: story/reels positions → story asset (9:16 vertical)
  - Priority 2: default (all other)  → post asset (4:5 or square)
```

- **Image pairs**: `asset_feed_spec.images` with hashes
- **Video pairs**: `asset_feed_spec.videos` with video IDs
- **Mixed fallback**: video for post + image for story (when vertical video fails)
- Reuse existing ad copy (message, link, CTA) from campaign

### 4. Create ads in all active adsets
- List adsets: `GET act_{ID}/adsets?filtering=[{field:campaign_id,operator:EQUAL,value:CAMPAIGN_ID}]&effective_status=["ACTIVE"]`
- For each adset × each creative, create an ad:
  ```
  POST act_{AD_ACCOUNT_ID}/ads
  {
    adset_id, creative: {creative_id}, status: ACTIVE
  }
  ```
- Total ads = (number of creatives) × (number of active adsets)

### 5. Verify
- Check ad status — expect `IN_PROCESS` (Meta review) initially
- Confirm no `WITH_ISSUES` flags
- Ads typically go live within 1 hour after review

## Failure handling
- **Large video upload timeout**: Convert `.mov` → `.mp4` (h264) with ffmpeg to reduce size
- **Video processing failure**: Use story image as fallback for story placements
- **Never single-asset ads**: Always split post + story per creative rules