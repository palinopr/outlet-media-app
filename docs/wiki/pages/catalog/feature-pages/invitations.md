# Feature: invitations

Generated from the current working tree on 2026-04-28 02:31:12.

- Files: 4
- Entry files: src/features/invitations/server.ts, src/features/invitations/sort.ts, src/features/invitations/types.ts
- Component files: none
- Client files: none
- Server files: src/features/invitations/server.ts
- Route users: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/dashboard/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/layout.tsx, src/app/client/[slug]/reports/page.tsx
- Database objects touched: clients, client_access_invites, if
- Depends on feature modules: none
- Used by feature modules: users (1), shared (1)
- Auth/access signals: imports Clerk server auth
- Behavior signals: none
- Direct tests: src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts
- All linked tests: src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx, __tests__/features/users/summary.test.ts, __tests__/features/shared/admin-summary-types.test.ts, __tests__/lib/formatters.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/admin/dashboard/page.test.tsx, … (+10 more)

## Exporting files
- `src/features/invitations/server.ts` — exports: buildActionableInvitations, listActionableInvitations
- `src/features/invitations/sort.ts` — exports: invitationStatusPriority, compareActionableInvitationState, countActionableInvitationStatuses
- `src/features/invitations/types.ts` — exports: ActionableInvitationStatus, ActionableInvitation

## File list
- `src/features/invitations/server.test.ts` — tests/describes: buildActionableInvitations; prefers Clerk-enriched status over the stored ledger status; filters invitations by client id and excluded emails; internal imports: 1; package imports: 1
- `src/features/invitations/server.ts` — exports: buildActionableInvitations, listActionableInvitations; internal imports: 3; package imports: 1
- `src/features/invitations/sort.ts` — exports: invitationStatusPriority, compareActionableInvitationState, countActionableInvitationStatuses; internal imports: 1
- `src/features/invitations/types.ts` — exports: ActionableInvitationStatus, ActionableInvitation
