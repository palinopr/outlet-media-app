# Campaign-to-Client Assignment

## Problem

Clients can't see their campaigns in the client portal. The current system auto-detects client ownership by pattern-matching campaign names (e.g., "arjona" -> zamora), which is fragile and requires naming conventions. There's no explicit link between a Meta campaign and a client.

## Solution

Admin explicitly assigns campaigns to clients via a dropdown on the admin campaigns page. Client portal queries by that assignment and fetches live Meta API data.

## Data Model

Add `client_slug` column to `meta_campaigns` table (nullable text, references clients).

## Admin UX

On the admin campaigns page, each campaign row gets a "Client" dropdown:
- Populated from the clients table (zamora, kybba, beamina, etc.)
- Includes "Unassigned" option (null)
- Changing it writes to `meta_campaigns.client_slug` via server action
- Visual indicator for unassigned campaigns

## Client Portal

Instead of pattern-matching campaign names:
1. Query `meta_campaigns WHERE client_slug = ?` to get assigned campaign IDs
2. Fetch live metrics from Meta API using the agency's token + those campaign IDs
3. Display to client

## Data Flow

1. Meta campaigns sync fills `meta_campaigns` table (existing behavior)
2. Admin assigns `client_slug` per campaign (new)
3. Client portal reads assigned campaign IDs from DB (changed)
4. Fetches live metrics from Meta API using agency token (existing, but uses agency token instead of per-client token)
5. Displays to client (existing)

## Scope

- Single agency (Outlet Media) with one Meta ad account (act_787610255314938)
- All campaigns live in Outlet's account, filtered per client
- No multi-agency / white-label support needed
