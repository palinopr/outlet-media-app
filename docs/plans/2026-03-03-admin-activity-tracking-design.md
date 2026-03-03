# Admin Activity Tracking Design

Track what admin users do in the Outlet Media admin panel: page views, actions, errors, and sessions. All data stored in a single Supabase table with a dedicated viewer page at `/admin/activity`.

## Data Model

Single `admin_activity` table replaces and extends the existing `admin_audit_log`:

```sql
create table admin_activity (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  user_id     text not null,
  user_email  text not null,
  event_type  text not null,  -- 'page_view' | 'action' | 'error' | 'session_start'
  page        text,
  detail      text,
  metadata    jsonb default '{}'::jsonb
);

create index idx_admin_activity_user on admin_activity(user_id);
create index idx_admin_activity_type on admin_activity(event_type);
create index idx_admin_activity_created on admin_activity(created_at desc);
```

Event type mapping:

| event_type | page | detail | metadata |
|---|---|---|---|
| `page_view` | `/admin/campaigns` | "Viewed Campaigns" | `{}` |
| `action` | `/admin/campaigns` | "Changed campaign status" | `{entity_type, entity_id, old_value, new_value}` |
| `error` | `/admin/events` | "Failed to update event" | `{error_message, stack, component}` |
| `session_start` | null | "Logged in" | `{user_agent}` |

## Tracking Implementation

### 1. Page Views -- `<ActivityTracker>` client component

Added to `admin/layout.tsx`. Uses `usePathname()` to detect route changes and POSTs to `/api/admin/activity`. Debounced to prevent flood on rapid navigation.

### 2. Actions -- `logActivity()` server action

Replaces `logAudit()` in `src/app/admin/actions/audit.ts`. Same call sites (campaign status, budget, client assignment, event updates, user changes) but writes to `admin_activity`. Action events store old/new values in `metadata`.

### 3. Errors -- Admin Error Boundary

React error boundary wrapping admin layout children. On error:
- Logs to `admin_activity` with error message, stack, and component name
- Shows fallback UI
- Also captures `window.onerror` and `unhandledrejection` for non-React errors

### 4. Sessions -- Login detection

On admin layout server render, detect first-load-after-auth and log `session_start`. Use a short-lived cookie to avoid logging every page load as a session.

### 5. API Endpoint -- `POST /api/admin/activity`

Validates caller is authenticated admin, inserts into `admin_activity`. Used by client-side tracker for page views and error reports.

## Activity Viewer Page (`/admin/activity`)

### Top stats (4 cards)
- Total Events Today
- Active Users Today
- Errors Today (red highlight if > 0)
- Most Active Page

### Filters
- User dropdown (all users or specific admin)
- Event type checkboxes (page views, actions, errors, sessions)
- Date range (today / 7d / 30d / custom)

### Activity feed
Chronological table, most recent first:
- Time, User, Type (color-coded badge), Page, Detail
- Expandable rows to show full metadata (error stacks, old/new values)
- Paginated

### Navigation
Add "Activity" to admin sidebar between "Users" and "Settings" with Lucide `Activity` icon.

## Migration from `admin_audit_log`

The existing `admin_audit_log` table has action data already. Options:
1. Migrate existing rows to `admin_activity` with `event_type='action'` and drop the old table
2. Leave the old table as-is (historical reference) and only write new data to `admin_activity`

Recommended: option 2 (leave old table, new data goes to new table). Simple and no risk of breaking anything.

## Scope

- Admin users only (no client portal tracking)
- No session replay or heatmaps (can add PostHog later if needed)
- No real-time websocket feed (page refreshes to see new data)
