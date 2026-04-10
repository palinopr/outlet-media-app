# Impact: src/app/admin/actions/events.ts

Generated from the current working tree on 2026-04-10 16:52:39.

- Category: Admin actions
- Impact score: 42
- Ownership: web admin route surface
- Feature module: none
- Route owners: src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx
- Imported by: src/components/admin/events/columns.tsx, src/components/admin/events/event-operating-panel.tsx, src/components/admin/events/event-table.tsx
- Tests related: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- DB objects: tm_events, event_comments, event_follow_up_items
- Env vars: none
- Mutation symbols: updateEventStatus, assignEventClient, bulkAssignEventClient, bulkUpdateEventStatus, updateEventTickets, syncEventWorkflowClientSlug, UpdateEventStatusSchema, AssignEventClientSchema, UpdateTicketsSchema, BulkAssignEventClientSchema, BulkUpdateEventStatusSchema
- Auth signals: imports Clerk server auth, calls currentUser()
- Behavior signals: server action/module
- Depends on groups: src/features / workflow, src/lib, src/app / admin, src/features / system-events
- Used by groups: src/components / admin
- Summary: exports: updateEventStatus, assignEventClient, bulkAssignEventClient, bulkUpdateEventStatus, updateEventTickets; tests/describes: event; internal imports: 5; package imports: 2
