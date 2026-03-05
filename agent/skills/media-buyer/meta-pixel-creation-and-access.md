> Auto-created by Media Buyer on 2026-03-05

# Meta Pixel Creation & User Access Assignment

## Overview
Create a new Meta pixel and grant user access (EDIT + ANALYZE permissions) via the Meta Marketing API.

## Steps

### 1. Create the Pixel
```
POST https://graph.facebook.com/v21.0/{business_id}/adspixels
```
**Parameters:**
- `name`: Descriptive pixel name (e.g., "Don Omar Spain")
- `access_token`: Meta API token

**Response:** Returns the new pixel `id`.

### 2. Look Up User IDs
If you only have names, look up business users:
```
GET https://graph.facebook.com/v21.0/{business_id}/business_users
```
Map names → user IDs.

### 3. Assign User Access to Pixel
For each user, grant permissions:
```
POST https://graph.facebook.com/v21.0/{pixel_id}/assigned_users
```
**Parameters:**
- `user`: Business user ID
- `tasks`: `["EDIT", "ANALYZE"]`
- `access_token`: Meta API token

Repeat for each user that needs access.

### 4. (Optional) Assign Pixel to Ad Account
```
POST https://graph.facebook.com/v21.0/{pixel_id}/shared_accounts
```
**Parameters:**
- `account_id`: Ad account ID (e.g., `act_787610255314938`)
- `business`: Business ID

## Known Team User IDs
- Jaime Ortiz
- Isabel Leal
- Alexandra Victoria

*(Look up current IDs via the business_users endpoint)*

## Example
```bash
# Create pixel
curl -X POST "https://graph.facebook.com/v21.0/{BIZ_ID}/adspixels" \
  -d "name=Don Omar Spain" -d "access_token=$TOKEN"

# Assign user
curl -X POST "https://graph.facebook.com/v21.0/{PIXEL_ID}/assigned_users" \
  -d "user={USER_ID}" -d 'tasks=["EDIT","ANALYZE"]' -d "access_token=$TOKEN"
```