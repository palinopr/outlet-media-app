# Impact: src/app/admin/actions/audit.ts

Generated from the current working tree on 2026-04-10 17:55:29.

- Category: Admin actions
- Impact score: 52
- Ownership: web admin route surface
- Feature module: none
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Imported by: src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/actions/events.ts, src/app/admin/actions/users.ts
- Tests related: src/app/admin/actions/campaign-action-items.test.ts, src/components/admin/clients/client-detail.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- DB objects: admin_activity
- Env vars: none
- Mutation symbols: logActivity, logAudit
- Auth signals: imports Clerk server auth, calls currentUser()
- Behavior signals: server action/module
- Depends on groups: src/lib
- Used by groups: src/app / admin
- Summary: exports: logActivity, logAudit, ActivityEventType; internal imports: 2; package imports: 1
