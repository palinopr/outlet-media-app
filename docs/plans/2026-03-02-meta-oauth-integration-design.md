# Meta OAuth Integration Design

Date: 2026-03-02

## Goal

Enable clients to connect their own Meta ad accounts via OAuth, manage campaigns through a self-service UI, and meet Meta's App Review requirements so the app can be approved for Advanced Access.

## Decisions

- **Approach**: Facebook Login for Business + per-client encrypted tokens
- **Account model**: Multi-account -- each client connects their own ad account
- **Client capabilities**: Full self-service (create, edit, pause campaigns)
- **Billing**: Client pays Meta directly (their payment method on their ad account)
- **Campaign UI**: Multi-step wizard (5 steps)
- **Legal pages**: Draft starter versions for privacy policy and terms of service

## Data Model

### New table: `client_accounts`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK, default gen_random_uuid() |
| `clerk_user_id` | text | Links to Clerk user |
| `client_slug` | text | Matches existing slug system |
| `meta_user_id` | text | Facebook user ID from OAuth |
| `ad_account_id` | text | e.g. `act_123456789` |
| `ad_account_name` | text | Display name from Meta |
| `access_token_encrypted` | text | AES-256-GCM encrypted long-lived token |
| `token_expires_at` | timestamptz | When the token expires |
| `scopes` | text[] | Granted permissions |
| `status` | text | `active`, `revoked`, `expired` |
| `connected_at` | timestamptz | When they first connected |
| `last_used_at` | timestamptz | Last successful API call |
| `created_at` | timestamptz | default now() |
| `updated_at` | timestamptz | default now() |

One client can connect multiple ad accounts. The `client_slug` ties into the existing campaign/event data model.

### New env vars

- `META_APP_ID` -- Meta app ID from developer portal
- `META_APP_SECRET` -- Meta app secret
- `TOKEN_ENCRYPTION_KEY` -- 32-byte key for AES-256-GCM

## OAuth Flow

```
Client portal -> "Connect Ad Account" button
       |
Redirect to Meta OAuth:
  https://www.facebook.com/v21.0/dialog/oauth
  ?client_id={META_APP_ID}
  &redirect_uri={APP_URL}/api/meta/callback
  &scope=ads_management,ads_read,business_management
  &state={encrypted_csrf_token+clerk_user_id}
       |
User grants permissions on Meta
       |
Meta redirects to /api/meta/callback?code=XXX&state=YYY
       |
Server exchanges code for short-lived token:
  POST graph.facebook.com/v21.0/oauth/access_token
       |
Exchange short-lived for long-lived token:
  GET graph.facebook.com/v21.0/oauth/access_token
  ?grant_type=fb_exchange_token&fb_exchange_token={short}
       |
Fetch user's ad accounts:
  GET graph.facebook.com/v21.0/me/adaccounts
       |
Show ad account picker (if multiple accounts)
       |
Encrypt token, store in client_accounts table
       |
Redirect back to client portal with success toast
```

### Token refresh

Long-lived user tokens last 60 days. A cron job checks `token_expires_at`:
1. If < 7 days until expiry, attempt refresh via `fb_exchange_token`
2. If refresh fails, mark status `expired` and notify client to reconnect
3. Log all token events for audit

## New API Routes

### OAuth
- `GET /api/meta/connect` -- initiates OAuth, generates state param, redirects to Meta
- `GET /api/meta/callback` -- handles Meta redirect, exchanges tokens, shows account picker
- `POST /api/meta/disconnect` -- revokes token via Meta API, marks account as revoked
- `POST /api/meta/data-deletion` -- Meta's data deletion callback (HMAC-SHA256 verified)

### Campaign management
- `POST /api/meta/campaigns` -- create campaign + ad set + ad
- `PATCH /api/meta/campaigns/[id]` -- update campaign
- `POST /api/meta/campaigns/[id]/status` -- pause/resume
- `GET /api/meta/targeting/search` -- proxy Meta's targeting search for interest autocomplete
- `POST /api/meta/creatives/upload` -- upload images/videos to Meta

## New Pages

### Client portal
- `/client/[slug]/settings` -- connected accounts, connect/disconnect buttons
- `/client/[slug]/connect` -- ad account picker after OAuth
- `/client/[slug]/campaigns/new` -- 5-step campaign creation wizard
- `/client/[slug]/campaign/[id]/edit` -- campaign edit form

### Public (no auth)
- `/privacy` -- privacy policy
- `/terms` -- terms of service
- `/deletion-status/[code]` -- data deletion status check page

## Campaign Creation Wizard

5-step flow:

1. **Basics**: campaign name, objective (OUTCOME_AWARENESS, OUTCOME_TRAFFIC, OUTCOME_ENGAGEMENT, OUTCOME_SALES), daily budget
2. **Audience**: location, age range, gender, interests (autocomplete via Meta targeting search API)
3. **Placements**: automatic vs manual (Facebook Feed, Instagram Feed, Stories, Reels)
4. **Creative**: image/video upload, primary text, headline, description, CTA button. Separate creatives for Post and Story placements (per existing creative rules).
5. **Review and publish**: summary of all settings, confirm and create

## Legal Pages

### Privacy policy (`/privacy`)
Sections: data collection, usage, sharing, retention, deletion rights, contact info. Specific about Meta data accessed. Universal deletion rights (no geographic restrictions).

### Terms of service (`/terms`)
Sections: service description, acceptable use, data ownership, liability, termination.

### Data deletion endpoint (`POST /api/meta/data-deletion`)
- Receives `signed_request` from Meta
- Verifies HMAC-SHA256 using `META_APP_SECRET`
- Deletes user's data from `client_accounts` and cached campaign data
- Returns `{ url, confirmation_code }` JSON
- Status page at `/deletion-status/[code]`

## Architecture Changes

### Client portal data fetching
- `data.ts` changes from global `META_ACCESS_TOKEN` to per-client token lookup from `client_accounts`
- Fallback chain: client token -> Supabase cached data -> empty state

### Admin portal
- Keeps working with Outlet Media's own token for its own ad account
- For client accounts, admin can use the client's stored token (admin has access to all `client_accounts`)

### Agent sync
- Iterates over all `client_accounts` where `status = 'active'`
- Syncs each account with its own token
- Per-account rate limiting and error isolation

### Middleware
- Add `/privacy`, `/terms`, `/deletion-status` to public routes
- Add `/api/meta/callback`, `/api/meta/data-deletion` to public routes

### New module: `src/lib/crypto.ts`
- AES-256-GCM encrypt/decrypt using `TOKEN_ENCRYPTION_KEY`
- Used when storing and reading tokens from `client_accounts`

## Meta App Review Requirements

To pass review, the app must demonstrate:
1. Working OAuth flow (Facebook Login for Business)
2. Ad account selection after connecting
3. Campaign dashboard showing real metrics
4. Campaign creation/editing through custom UI
5. Disconnect/revoke capability
6. Privacy policy with all 4 sections
7. Terms of service
8. Data deletion callback with HMAC verification
9. Status page for deletion requests

Screencasts must use operational language, not marketing speak. Avoid words like "automate", "AI-powered", "scrape".
