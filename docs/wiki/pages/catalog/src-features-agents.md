# src/features / agents

Generated from the current working tree on 2026-04-10 21:59:58.

- Files: 1
- File kinds: TypeScript module (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/agents/summary.ts`
- Status: tracked-clean
- System: web
- Group: src/features / agents
- Ownership: feature module: agents
- Type: TypeScript module
- Construction: code module
- Lines: 165
- Bytes: 5445
- Imports (internal): src/features/agent-outcomes/summary.ts, src/features/operations-center/summary.ts, src/lib/agent-jobs.ts
- Imported by: __tests__/features/agents/summary.test.ts, src/app/admin/agents/data.ts, src/components/admin/agents/command-summary.test.tsx, src/components/admin/agents/command-summary.tsx
- Depends on groups: src/features / agent-outcomes, src/features / operations-center, src/lib
- Used by groups: Tests / Features, src/app / admin, src/components / admin
- Feature module: agents
- Route owners: src/app/admin/agents/page.tsx
- Tests related: __tests__/features/agents/summary.test.ts, src/components/admin/agents/command-summary.test.tsx, src/components/admin/agents/job-history.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): __tests__/features/agents/summary.test.ts, src/components/admin/agents/command-summary.test.tsx
- Exports: buildAgentCommandSummary, AgentCommandMetric, AgentCommandOutcomeBucket, AgentCommandSummary
- Symbol details: function buildAgentCommandSummary (exported), function runtimeDetail, function recentCutoff, function isRecent, function compareAttentionJobs, function hasLinkedWork, function isActionableOutcome, function outcomeBucketKey, function compareActionableOutcomes, interface AgentCommandMetric (exported), interface AgentCommandOutcomeBucket (exported), interface AgentCommandSummary (exported)
- Defines: runtimeDetail, recentCutoff, isRecent, compareAttentionJobs, hasLinkedWork, isActionableOutcome, outcomeBucketKey, compareActionableOutcomes, buildAgentCommandSummary, statusWeight, statusDiff, now, … (+10 more)
- Contents summary: exports: buildAgentCommandSummary, AgentCommandMetric, AgentCommandOutcomeBucket, AgentCommandSummary; internal imports: 3
