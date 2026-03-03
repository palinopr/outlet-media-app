# Client Accounts & Team Management

## Problem

Clients are implicit -- derived from `client_slug` values in campaigns/events. There's no way to formally create a client, invite them to sign up, approve their account, or let them manage their own team members. The admin has to manually coordinate access outside the app.

## Solution

Formal client entities in Supabase with Clerk-based auth. Self-serve signup with admin approval. Multi-user support per client with owner/member roles. Client owners can invite their own team members.

## Data Model

### `clients` table

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK (gen_random_uuid()) | |
| name | text NOT NULL | Display name, e.g. "Zamora Presents" |
| slug | text UNIQUE NOT NULL | URL slug, e.g. "zamora" |
| status | text NOT NULL DEFAULT 'active' | active, inactive |
| created_at | timestamptz DEFAULT now() | |

### `client_members` table

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK (gen_random_uuid()) | |
| client_id | uuid FK -> clients.id ON DELETE CASCADE | |
| clerk_user_id | text NOT NULL | Clerk user ID |
| role | text NOT NULL DEFAULT 'member' | owner, member |
| created_at | timestamptz DEFAULT now() | |
| UNIQUE(client_id, clerk_user_id) | | Prevent duplicate memberships |

### Migration

- Insert a `clients` row for each distinct `client_slug` currently in `meta_campaigns`
- Insert `client_members` rows for any existing Clerk users that have `publicMetadata.client_slug`

## Auth & Routing

Clerk `publicMetadata` keeps `role` and `client_slug` fields (existing pattern). Portal layout continues to check `client_slug === slug` for fast auth (no DB round-trip).

### Post-login routing

- `role === "admin"` -> redirect to `/admin`
- `client_slug` exists -> redirect to `/client/{slug}`
- Neither -> redirect to `/client/pending`

### First-visit auto-enrollment

When a user with a pre-set `client_slug` (from a Clerk invitation) visits the portal for the first time, the system upserts a `client_members` row if one doesn't exist.

## User Flows

### 1. Self-serve signup

1. New user goes to `/sign-up`, creates Clerk account
2. No metadata set -> lands on `/client/pending`
3. Pending page shows: "Your account is pending approval"

### 2. Admin approval

1. Admin goes to `/admin/users`
2. Users without `client_slug` show "Pending" badge
3. Admin assigns user to a client (existing or new):
   - Creates `client_members` row with chosen role
   - Sets `publicMetadata.client_slug` via Clerk API
4. User now has portal access on next visit

### 3. Client owner inviting team

1. Client owner sees "Invite Team" in portal settings
2. Enters email address
3. System sends Clerk invitation with `client_slug` pre-set
4. Invited user signs up -> auto-enrolled via first-visit logic

### 4. Admin managing clients

1. Create client: name + slug
2. View/edit client details and members
3. Add/remove members, change roles
4. Deactivate client (sets status=inactive)

## Admin UI Changes

### `/admin/clients` (enhanced)

- "Create Client" button -> form with name + slug (auto-generated)
- Table: name, slug, status, member count, campaign count, actions
- Click row -> client detail page

### `/admin/clients/[id]` (new)

- Client info: name, slug, status (editable)
- Members section: list with role badges, add/remove/change role
- Campaigns section: campaigns assigned to this slug
- "Invite Member" button: Clerk invitation with client_slug

### `/admin/users` (enhanced)

- "Status" column: Approved (has client) or Pending
- "Assign to Client" action for pending users
- Quick-assign dropdown: existing clients or "Create New"

## Client Portal UI Changes

### `/client/pending` (new)

- Centered message: "Account pending approval"
- Brief explanation of what happens next
- Sign-out link

### `/client/[slug]/settings` or `/client/[slug]/team` (new)

- Visible only to client owners
- List current team members with roles
- "Invite Member" form: enter email, sends Clerk invitation
- Remove member (owner only)

## Existing Patterns Preserved

- `meta_campaigns.client_slug` column stays (campaign assignment)
- `publicMetadata.client_slug` Clerk check stays (portal auth)
- `/api/admin/invite` route stays (enhanced to create client_members row)
- `ClientOnboardForm` component stays (adapted for new flow)

## Scope

- Single agency (Outlet Media)
- All campaigns in one Meta ad account
- No multi-agency or white-label support
