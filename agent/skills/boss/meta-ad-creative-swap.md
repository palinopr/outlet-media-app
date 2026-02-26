> Auto-created by Boss on 2026-02-26

# Swap Meta Ad Creative Images

Procedure to replace images on an existing Meta ad by uploading new creatives and updating the ad. Meta creatives are **immutable** — you must create a new creative and point the ad to it.

## Prerequisites
- Meta Ad Account ID: `act_787610255314938`
- API version: `v21.0`
- Access token in `.env.local` (`META_ACCESS_TOKEN`)
- Images already downloaded locally (post 1080×1350, story 1080×1920)

## Step 1: Upload Images to Meta

```bash
# Upload each image (post + story variants)
curl -F "filename=@/path/to/image_post.jpg" \
  -F "access_token=$META_ACCESS_TOKEN" \
  "https://graph.facebook.com/v21.0/act_787610255314938/adimages"

# Response contains hash: { "images": { "image_post.jpg": { "hash": "aa51916e..." } } }
```

Upload all variants (post + story for each day/creative). Record the returned **image hashes**.

## Step 2: Check Existing Ad Creative Format

```bash
# Get current creative to match format (page_id, instagram_actor_id, link, etc.)
curl "https://graph.facebook.com/v21.0/<CREATIVE_ID>?fields=asset_feed_spec,object_story_spec&access_token=$META_ACCESS_TOKEN"
```

## Step 3: Create New Creative with Post/Story Split

Use `asset_feed_spec` with `asset_customization_rules` to assign different images per placement:

```bash
curl -X POST "https://graph.facebook.com/v21.0/act_787610255314938/adcreatives" \
  -d "name=<label>_hoy" \
  -d 'asset_feed_spec={
    "images": [
      {"hash": "<POST_HASH>", "adlabels": [{"name": "post_image"}]},
      {"hash": "<STORY_HASH>", "adlabels": [{"name": "story_image"}]}
    ],
    "bodies": [{"text": "<ad copy>"}],
    "titles": [{"text": "<headline>"}],
    "descriptions": [{"text": "<description>"}],
    "link_urls": [{"website_url": "<ticket_url>"}],
    "call_to_action_types": ["BUY_TICKETS"],
    "asset_customization_rules": [
      {
        "priority": 1,
        "customization_spec": {
          "publisher_platforms": ["instagram"],
          "instagram_positions": ["story", "reels"]
        },
        "image_label": {"name": "story_image"}
      },
      {
        "priority": 2,
        "customization_spec": {},
        "image_label": {"name": "post_image"}
      }
    ]
  }' \
  -d "access_token=$META_ACCESS_TOKEN"
```

**Label convention**: `{city}_post` / `{city}_story` for images.

## Step 4: Update the Ad with New Creative

```bash
curl -X POST "https://graph.facebook.com/v21.0/<AD_ID>" \
  -d "creative={\"creative_id\": \"<NEW_CREATIVE_ID>\"}" \
  -d "access_token=$META_ACCESS_TOKEN"
```

## Step 5: Verify

```bash
curl "https://graph.facebook.com/v21.0/<AD_ID>?fields=creative,status&access_token=$META_ACCESS_TOKEN"
```

## Key Rules
- **Never reuse old creatives** — always create new ones (immutable)
- **Always split post + story** — never single-image ads
- Post format: 4:5 (1080×1350), Story format: 9:16 (1080×1920)
- Priority 1 = story/reels positions, Priority 2 = default (feed/other)