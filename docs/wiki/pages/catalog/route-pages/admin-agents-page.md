# /admin/agents

Generated from the current working tree on 2026-04-10 21:59:58.

- Route file: `src/app/admin/agents/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Methods: none
- Auth signals: none
- Behavior signals: sets dynamic rendering mode
- Direct internal imports: src/app/admin/agents/data.ts, src/components/admin/agents/chat-panel.tsx, src/components/admin/agents/command-summary.tsx, src/components/admin/agents/agent-sidebar.tsx, src/components/admin/agents/job-history.tsx, src/components/ui/sheet.tsx, src/components/ui/button.tsx, src/components/admin/page-header.tsx
- Feature modules touched: agent-outcomes, agents, assets, operations-center, invitations
- Shared libs/runtime touched: src/lib/agent-jobs.ts, src/lib/formatters.tsx, src/lib/utils.ts, src/lib/supabase.ts, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/client-slug.ts
- Database objects touched: agent_tasks, system_events, campaign_action_items, asset_follow_up_items, event_follow_up_items, agent_runtime_state, meta_campaigns, ad_assets, campaign_client_overrides, clients, client_members, client_member_campaigns, client_member_events
- Direct tests: src/app/shell-import-smoke.test.ts
- All linked tests: src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/admin/agents`; exports: AgentsPage, dynamic, default; internal imports: 8; package imports: 1

## Stack by group
- src/app / admin: src/app/admin/agents/data.ts
- src/components / admin: src/components/admin/agents/chat-panel.tsx, src/components/admin/agents/command-summary.tsx, src/components/admin/agents/agent-sidebar.tsx, src/components/admin/agents/job-history.tsx, src/components/admin/page-header.tsx, src/components/admin/agents/constants.ts, src/components/admin/agents/status-badge.tsx, src/components/admin/run-button.tsx, src/components/admin/data-table/column-header.tsx, src/components/admin/data-table/data-table-pagination.tsx
- src/components / ui: src/components/ui/sheet.tsx, src/components/ui/button.tsx, src/components/ui/card.tsx, src/components/ui/badge.tsx, src/components/ui/input.tsx, src/components/ui/table.tsx
- src/features / agent-outcomes: src/features/agent-outcomes/server.ts, src/features/agent-outcomes/summary.ts
- src/features / agents: src/features/agents/summary.ts
- src/features / assets: src/features/assets/server.ts, src/features/assets/types.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / operations-center: src/features/operations-center/summary.ts
- src/lib: src/lib/agent-jobs.ts, src/lib/formatters.tsx, src/lib/utils.ts, src/lib/supabase.ts, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/client-slug.ts
