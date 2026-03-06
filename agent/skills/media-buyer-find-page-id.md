# How to Find a Facebook Page ID

## Method: Graph API Username Lookup

If you know the Facebook page username (e.g., "donomar" from facebook.com/donomar):

```bash
curl -s "https://graph.facebook.com/v21.0/{USERNAME}?fields=id,name,instagram_business_account&access_token=$TOKEN"
```

This returns:
- `id` — the numeric Page ID
- `name` — the page name
- `instagram_business_account.id` — linked IG business account ID (if any)

## Example: Don Omar

```bash
curl -s "https://graph.facebook.com/v21.0/DonOmar?fields=id,name,instagram_business_account&access_token=$TOKEN"
# Returns: {"id":"21608835481","name":"Don Omar","instagram_business_account":{"id":"17841400670290220"}}
```

## Known Page IDs

| Artist/Brand | Page ID | Instagram ID | Username |
|---|---|---|---|
| Outlet Media | 175118299508364 | 17841402356610735 | - |
| Don Omar | 21608835481 | 17841400670290220 | DonOmar |

## Notes

- The `/pages/search` endpoint requires `pages_read_engagement` permission (we don't have it). Use the username lookup instead.
- Always check `instagram_business_account` to get the linked IG ID for `object_story_spec`.
- Creatives are immutable in Meta — you can't update `object_story_spec.page_id`. You must create a NEW creative, new ad, and pause the old ad.
- Our ad account needs permissions on the page to run ads under it. If creative creation fails with a permissions error, the page owner needs to grant our BM advertising access.
