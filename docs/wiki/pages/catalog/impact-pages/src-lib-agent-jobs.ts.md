# Impact: src/lib/agent-jobs.ts

Generated from the current working tree on 2026-04-10 22:05:59.

- Category: Shared web libraries
- Impact score: 40
- Ownership: shared web library
- Feature module: none
- Route owners: src/app/api/agents/job/[id]/route.ts, src/app/api/agents/jobs/route.ts, src/app/api/agents/route.ts, src/app/admin/agents/page.tsx, src/app/admin/dashboard/page.tsx
- Imported by: __tests__/api/agents-jobs.test.ts, src/app/admin/agents/data.ts, src/app/admin/dashboard/data.ts, src/app/api/agents/job/[id]/route.ts, src/app/api/agents/jobs/route.ts, src/app/api/agents/route.ts, src/features/agents/summary.ts
- Tests related: __tests__/api/agents-jobs.test.ts, src/components/admin/agents/job-history.test.tsx, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/api/agents.test.ts, __tests__/features/agents/summary.test.ts, src/components/admin/agents/command-summary.test.tsx
- DB objects: agent_tasks, agent_runtime_state
- Env vars: none
- Mutation symbols: none
- Auth signals: none
- Behavior signals: none
- Depends on groups: src/lib
- Used by groups: Tests / API, src/app / admin, src/app / api, src/features / agents
- Summary: exports: mapTaskToJob, listAgentJobs, getAgentJob, getLatestAgentStatuses, getHeartbeatStatus, AgentJobView; internal imports: 2
