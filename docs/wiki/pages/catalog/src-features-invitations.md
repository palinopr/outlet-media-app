# src/features / invitations

Generated from the current working tree on 2026-04-10 18:02:26.

- Files: 4
- File kinds: TypeScript module (3), test file (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/invitations/server.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / invitations
- Ownership: feature module: invitations
- Type: test file
- Construction: test specification
- Lines: 108
- Bytes: 2986
- Imports (internal): src/features/invitations/server.ts
- Imports (packages): vitest
- Depends on groups: src/features / invitations
- Feature module: invitations
- Defines: invitations
- Tests / describe labels: buildActionableInvitations, prefers Clerk-enriched status over the stored ledger status, filters invitations by client id and excluded emails, prioritizes pending invites ahead of expired cleanup
- Contents summary: tests/describes: buildActionableInvitations; prefers Clerk-enriched status over the stored ledger status; filters invitations by client id and excluded emails; internal imports: 1; package imports: 1

## `src/features/invitations/server.ts`
- Status: tracked-clean
- System: web
- Group: src/features / invitations
- Ownership: feature module: invitations
- Type: TypeScript module
- Construction: code module
- Lines: 141
- Bytes: 4408
- Imports (internal): src/lib/supabase.ts, src/features/invitations/sort.ts, src/features/invitations/types.ts
- Imports (packages): @clerk/nextjs/server
- Imported by: src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/app/admin/users/data.ts, src/features/invitations/server.test.ts
- Depends on groups: src/lib, src/features / invitations
- Used by groups: src/app / admin, src/features / invitations
- Feature module: invitations
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Tests related (direct): src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts
- Exports: buildActionableInvitations, listActionableInvitations
- Symbol details: function buildActionableInvitations (exported), function listActionableInvitations (exported), function toActionableInvitationStatus, function normalizeClientSlug, interface ClientAccessInviteLike, interface ListActionableInvitationsOptions
- Defines: buildActionableInvitations, listActionableInvitations, toActionableInvitationStatus, normalizeClientSlug, excluded, email, status, rows, clerkIds, clerkStatuses, clerk, invitations, … (+3 more)
- Contents summary: exports: buildActionableInvitations, listActionableInvitations; internal imports: 3; package imports: 1

## `src/features/invitations/sort.ts`
- Status: tracked-clean
- System: web
- Group: src/features / invitations
- Ownership: feature module: invitations
- Type: TypeScript module
- Construction: code module
- Lines: 42
- Bytes: 1258
- Imports (internal): src/features/invitations/types.ts
- Imported by: src/components/admin/clients/members-section.tsx, src/features/invitations/server.ts, src/features/settings/summary.ts, src/features/users/summary.ts
- Depends on groups: src/features / invitations
- Used by groups: src/components / admin, src/features / invitations, src/features / settings, src/features / users
- Feature module: invitations
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx
- Tests related: src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts, __tests__/features/settings/summary.test.ts, __tests__/features/users/summary.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: invitationStatusPriority, compareActionableInvitationState, countActionableInvitationStatuses
- Symbol details: function invitationStatusPriority (exported), function compareActionableInvitationState (exported), function countActionableInvitationStatuses (exported), function toTimestamp
- Defines: toTimestamp, invitationStatusPriority, compareActionableInvitationState, countActionableInvitationStatuses, statusOrder
- Contents summary: exports: invitationStatusPriority, compareActionableInvitationState, countActionableInvitationStatuses; internal imports: 1

## `src/features/invitations/types.ts`
- Status: tracked-clean
- System: web
- Group: src/features / invitations
- Ownership: feature module: invitations
- Type: TypeScript module
- Construction: code module
- Lines: 12
- Bytes: 278
- Imported by: src/app/admin/users/data.ts, src/features/invitations/server.ts, src/features/invitations/sort.ts, src/features/shared/admin-summary-types.ts, src/lib/formatters.tsx
- Used by groups: src/app / admin, src/features / invitations, src/features / shared, src/lib
- Feature module: invitations
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, … (+14 more)
- Tests related: src/app/shell-import-smoke.test.ts, src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts, __tests__/features/shared/admin-summary-types.test.ts, __tests__/lib/formatters.test.ts, __tests__/features/settings/summary.test.ts, __tests__/features/users/summary.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, … (+45 more)
- Exports: ActionableInvitationStatus, ActionableInvitation
- Symbol details: type ActionableInvitationStatus (exported), interface ActionableInvitation (exported)
- Defines: ActionableInvitationStatus, ActionableInvitation
- Contents summary: exports: ActionableInvitationStatus, ActionableInvitation
