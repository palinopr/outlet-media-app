# Admin CRUD Design

## Goal
Give admins full create/read/update/delete control over campaigns, events, clients, and users. Campaign edits write to Supabase immediately; a "Sync to Meta" button pushes pause/resume/budget changes to Meta Ads API with confirmation.

## Architecture

### Server Actions
One file per entity under `src/app/admin/actions/`:
- `campaigns.ts` -- pause, resume, updateBudget, assignClient, syncToMeta
- `events.ts` -- updateStatus, assignClient, editTicketFields
- `clients.ts` -- rename, changeSlug, deactivate
- `users.ts` -- changeRole, reassignClient, deleteUser

Each action: Zod validation, adminGuard(), Supabase mutation, audit log write, revalidatePath().

### Shared Helpers
- `audit.ts` -- `logAudit(userId, email, entityType, entityId, action, oldValue, newValue)`
- `meta-sync.ts` -- `syncCampaignToMeta(campaignId, changes)` using Meta Graph API v21.0

### Inline Editing (no new pages)
Existing admin tables get interactive controls:
- Status: dropdown selector
- Numbers (budget, tickets): inline input + save
- Client assignment: dropdown
- Dangerous actions (delete, deactivate): confirmation dialog

### New Components
- `inline-edit.tsx` -- reusable inline number/text input with save/cancel
- `confirm-dialog.tsx` -- reusable confirmation dialog for destructive actions
- `status-select.tsx` -- reusable status dropdown with server action binding
- `campaigns/campaign-table.tsx` -- campaign table with edit controls
- `events/event-table.tsx` -- event table with edit controls
- `clients/client-table.tsx` -- client table with edit controls

### Audit Log Table
```sql
create table admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  user_email text not null,
  entity_type text not null,
  entity_id text not null,
  action text not null,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz default now()
);
```

### Meta Sync Flow
1. Admin edits campaign (budget, status) -> writes to Supabase immediately
2. "Sync to Meta" button appears on modified campaigns
3. Click opens confirmation dialog showing what will change
4. On confirm: POST to Meta Graph API, update Supabase synced_at, log audit entry
5. Only safe operations: pause (PAUSED), resume (ACTIVE), update daily_budget

## Entity Actions

### Campaigns
| Action | Supabase | Meta API | Audit |
|--------|----------|----------|-------|
| Pause | status->PAUSED | optional sync | yes |
| Resume | status->ACTIVE | optional sync | yes |
| Update budget | daily_budget | optional sync | yes |
| Assign client | client_slug | no | yes |

### Events
| Action | Supabase | Audit |
|--------|----------|-------|
| Update status | status | yes |
| Assign client | client_slug | yes |
| Edit tickets | tickets_sold, tickets_available | yes |

### Clients
| Action | Supabase | Audit |
|--------|----------|-------|
| Rename | update all meta_campaigns + tm_events with old slug | yes |
| Deactivate | set all campaigns to PAUSED, flag client | yes |

### Users
| Action | Clerk API | Audit |
|--------|-----------|-------|
| Change role | update publicMetadata.role | yes |
| Reassign client | update publicMetadata.client_slug | yes |
| Delete | delete via Clerk SDK | yes |
