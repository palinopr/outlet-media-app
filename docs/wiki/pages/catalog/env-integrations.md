# Env and Integration Map

Generated from the current working tree on 2026-04-28 03:23:46.

This page maps environment variables to integration services and to the first-party files that reference them.

- Environment keys tracked: 27
- Integration service buckets: 7

## Service overview

### Anthropic / Claude
- Env keys: ANTHROPIC_API_KEY, CLIENT_AGENT_CLAUDE_MODEL
- Declared in: none
- Routes: none
- Features/libs: src/lib/env.ts
- Agent files: none
- Tests/docs: none

### App / Runtime
- Env keys: E2E_BASE_URL, INGEST_SECRET, NEXT_PUBLIC_APP_URL
- Declared in: .env.example
- Routes: src/app/admin/settings/page.tsx, src/app/api/admin/invite/route.ts, src/app/api/meta/callback/route.ts, src/app/api/meta/data-deletion/route.ts
- Features/libs: src/lib/api-helpers.test.ts, src/lib/api-helpers.ts, src/lib/env.ts
- Agent files: none
- Tests/docs: __tests__/api/ingest.test.ts, docs/context/meta-ads-playbook.md, docs/references/production-smoke-runbook.md, src/app/api/admin/invite/route.test.ts, src/app/api/meta/callback/route.test.ts, src/app/api/meta/data-deletion/route.test.ts

### Clerk
- Env keys: CLERK_SECRET_KEY, E2E_CLERK_SECRET_KEY, NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL, NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, NEXT_PUBLIC_CLERK_SIGN_IN_URL, NEXT_PUBLIC_CLERK_SIGN_UP_URL
- Declared in: .env.example
- Routes: src/app/admin/layout.tsx, src/app/admin/settings/page.tsx, src/app/client/[slug]/layout.tsx, src/app/client/pending/layout.tsx, src/app/layout.tsx, src/app/page.tsx
- Features/libs: src/lib/env.ts
- Agent files: none
- Tests/docs: docs/references/production-smoke-runbook.md, src/app/client/[slug]/layout.test.tsx

### Meta
- Env keys: META_ACCESS_TOKEN, META_AD_ACCOUNT_ID, META_APP_SECRET
- Declared in: .env.example
- Routes: src/app/admin/campaigns/page.tsx, src/app/admin/settings/page.tsx
- Features/libs: src/lib/env.ts, src/lib/meta-campaigns.test.ts, src/lib/meta-campaigns.ts, src/lib/meta-oauth.test.ts, src/lib/meta-oauth.ts
- Agent files: none
- Tests/docs: __tests__/app/client/campaign-detail-data.test.ts, docs/context/meta-ads-playbook.md, src/app/api/meta/callback/route.test.ts, src/app/api/meta/data-deletion/route.test.ts

### Other / App
- Env keys: CI, CODEX_FINAL_MESSAGE, CONTACT_FORM_TO_EMAIL, E2E_CLIENT_SLUG, NEXT_PHASE, NEXT_PUBLIC_AUDIT_BOOKING_URL, PR_NUMBER
- Declared in: .env.example
- Routes: src/app/api/contact/route.ts
- Features/libs: src/lib/env.ts
- Agent files: none
- Tests/docs: docs/context/codex-workflow.md, docs/references/database-safety-runbook.md, docs/references/production-smoke-runbook.md, src/app/api/contact/route.test.ts

### Resend
- Env keys: RESEND_API_KEY, RESEND_FROM_EMAIL
- Declared in: .env.example
- Routes: src/app/api/contact/route.ts
- Features/libs: none
- Agent files: none
- Tests/docs: src/app/api/contact/route.test.ts

### Supabase
- Env keys: NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
- Declared in: .env.example
- Routes: src/app/admin/settings/page.tsx, src/app/api/ingest/route.ts
- Features/libs: src/lib/env.ts, src/lib/supabase.ts
- Agent files: none
- Tests/docs: none

## Env variable details

### `ANTHROPIC_API_KEY`
- Service: Anthropic / Claude
- Declared in: none
- Mentioned by groups: src/lib (1)
- Routes: none
- Features: none
- Shared libs: src/lib/env.ts
- Agent files: none
- Tests/docs/other: none

### `CI`
- Service: Other / App
- Declared in: none
- Mentioned by groups: Root Files (2), Docs / References (2), .github (1), Docs / Context (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: .github/workflows/ci.yml, README.md, docs/context/codex-workflow.md, docs/references/database-safety-runbook.md, docs/references/production-smoke-runbook.md, playwright.config.ts

### `CLERK_SECRET_KEY`
- Service: Clerk
- Declared in: .env.example
- Mentioned by groups: Root Files (1), src/app / admin (1), src/lib (1)
- Routes: src/app/admin/settings/page.tsx
- Features: none
- Shared libs: src/lib/env.ts
- Agent files: none
- Tests/docs/other: e2e/authenticated-smoke.spec.ts

### `CLIENT_AGENT_CLAUDE_MODEL`
- Service: Anthropic / Claude
- Declared in: none
- Mentioned by groups: src/lib (1)
- Routes: none
- Features: none
- Shared libs: src/lib/env.ts
- Agent files: none
- Tests/docs/other: none

### `CODEX_FINAL_MESSAGE`
- Service: Other / App
- Declared in: none
- Mentioned by groups: .github (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: .github/workflows/codex-pr-review.yml

### `CONTACT_FORM_TO_EMAIL`
- Service: Other / App
- Declared in: none
- Mentioned by groups: src/app / api (2)
- Routes: src/app/api/contact/route.ts
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: src/app/api/contact/route.test.ts

### `E2E_BASE_URL`
- Service: App / Runtime
- Declared in: .env.example
- Mentioned by groups: Root Files (3), .github (1), Docs / References (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: .github/workflows/e2e-smoke.yml, README.md, docs/references/production-smoke-runbook.md, e2e/authenticated-smoke.spec.ts, playwright.config.ts

### `E2E_CLERK_SECRET_KEY`
- Service: Clerk
- Declared in: .env.example
- Mentioned by groups: Root Files (2), .github (1), Docs / References (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: .github/workflows/e2e-smoke.yml, README.md, docs/references/production-smoke-runbook.md, e2e/authenticated-smoke.spec.ts

### `E2E_CLIENT_SLUG`
- Service: Other / App
- Declared in: .env.example
- Mentioned by groups: .github (1), Docs / References (1), Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: .github/workflows/e2e-smoke.yml, docs/references/production-smoke-runbook.md, e2e/authenticated-smoke.spec.ts

### `INGEST_SECRET`
- Service: App / Runtime
- Declared in: .env.example
- Mentioned by groups: src/lib (3), Tests / API (1), src/app / admin (1)
- Routes: src/app/admin/settings/page.tsx
- Features: none
- Shared libs: src/lib/api-helpers.test.ts, src/lib/api-helpers.ts, src/lib/env.ts
- Agent files: none
- Tests/docs/other: __tests__/api/ingest.test.ts

### `META_ACCESS_TOKEN`
- Service: Meta
- Declared in: .env.example
- Mentioned by groups: src/lib (3), src/app / admin (2), Tests / App (1), Docs / Context (1), src/app / client (1)
- Routes: src/app/admin/settings/page.tsx
- Features: none
- Shared libs: src/lib/env.ts, src/lib/meta-campaigns.test.ts, src/lib/meta-campaigns.ts
- Agent files: none
- Tests/docs/other: __tests__/app/client/campaign-detail-data.test.ts, docs/context/meta-ads-playbook.md, src/app/admin/actions/meta-sync.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts

### `META_AD_ACCOUNT_ID`
- Service: Meta
- Declared in: .env.example
- Mentioned by groups: src/lib (3), src/app / admin (2), Tests / App (1), Docs / Context (1), src/app / client (1)
- Routes: src/app/admin/campaigns/page.tsx
- Features: none
- Shared libs: src/lib/env.ts, src/lib/meta-campaigns.test.ts, src/lib/meta-campaigns.ts
- Agent files: none
- Tests/docs/other: __tests__/app/client/campaign-detail-data.test.ts, docs/context/meta-ads-playbook.md, src/app/admin/actions/meta-sync.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts

### `META_APP_SECRET`
- Service: Meta
- Declared in: .env.example
- Mentioned by groups: src/lib (3), src/app / api (2), Docs / Context (1)
- Routes: none
- Features: none
- Shared libs: src/lib/env.ts, src/lib/meta-oauth.test.ts, src/lib/meta-oauth.ts
- Agent files: none
- Tests/docs/other: docs/context/meta-ads-playbook.md, src/app/api/meta/callback/route.test.ts, src/app/api/meta/data-deletion/route.test.ts

### `NEXT_PHASE`
- Service: Other / App
- Declared in: none
- Mentioned by groups: src/lib (1)
- Routes: none
- Features: none
- Shared libs: src/lib/env.ts
- Agent files: none
- Tests/docs/other: none

### `NEXT_PUBLIC_APP_URL`
- Service: App / Runtime
- Declared in: .env.example
- Mentioned by groups: src/app / api (6), Root Files (2), Docs / Context (1), src/lib (1)
- Routes: src/app/api/admin/invite/route.ts, src/app/api/meta/callback/route.ts, src/app/api/meta/data-deletion/route.ts
- Features: none
- Shared libs: src/lib/env.ts
- Agent files: none
- Tests/docs/other: docs/context/meta-ads-playbook.md, e2e/authenticated-smoke.spec.ts, playwright.config.ts, src/app/api/admin/invite/route.test.ts, src/app/api/meta/callback/route.test.ts, src/app/api/meta/data-deletion/route.test.ts

### `NEXT_PUBLIC_AUDIT_BOOKING_URL`
- Service: Other / App
- Declared in: none
- Mentioned by groups: src/components / landing (2)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: src/components/landing/contact-form.tsx, src/components/landing/lead-funnel.tsx

### `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
- Service: Clerk
- Declared in: .env.example
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: audit/imports-deps.md

### `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`
- Service: Clerk
- Declared in: .env.example
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: audit/imports-deps.md

### `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Service: Clerk
- Declared in: .env.example
- Mentioned by groups: src/app / client (3), src/app / admin (2), src/app / root routes (2), src/components / admin (1), src/lib (1)
- Routes: src/app/admin/layout.tsx, src/app/client/[slug]/layout.tsx, src/app/client/pending/layout.tsx, src/app/layout.tsx, src/app/page.tsx
- Features: none
- Shared libs: src/lib/env.ts
- Agent files: none
- Tests/docs/other: src/app/admin/users/data.ts, src/app/client/[slug]/layout.test.tsx, src/components/admin/user-avatar.tsx

### `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- Service: Clerk
- Declared in: .env.example
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: audit/imports-deps.md

### `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- Service: Clerk
- Declared in: .env.example
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: audit/imports-deps.md

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Service: Supabase
- Declared in: .env.example
- Mentioned by groups: src/lib (2)
- Routes: none
- Features: none
- Shared libs: src/lib/env.ts, src/lib/supabase.ts
- Agent files: none
- Tests/docs/other: none

### `NEXT_PUBLIC_SUPABASE_URL`
- Service: Supabase
- Declared in: .env.example
- Mentioned by groups: src/lib (2), src/app / admin (1)
- Routes: src/app/admin/settings/page.tsx
- Features: none
- Shared libs: src/lib/env.ts, src/lib/supabase.ts
- Agent files: none
- Tests/docs/other: none

### `PR_NUMBER`
- Service: Other / App
- Declared in: none
- Mentioned by groups: .github (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: .github/workflows/codex-pr-review.yml

### `RESEND_API_KEY`
- Service: Resend
- Declared in: .env.example
- Mentioned by groups: src/app / api (2), Root Files (1)
- Routes: src/app/api/contact/route.ts
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: audit/imports-deps.md, src/app/api/contact/route.test.ts

### `RESEND_FROM_EMAIL`
- Service: Resend
- Declared in: none
- Mentioned by groups: src/app / api (2), Root Files (1)
- Routes: src/app/api/contact/route.ts
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: audit/imports-deps.md, src/app/api/contact/route.test.ts

### `SUPABASE_SERVICE_ROLE_KEY`
- Service: Supabase
- Declared in: .env.example
- Mentioned by groups: src/lib (2), src/app / admin (1), src/app / api (1)
- Routes: src/app/admin/settings/page.tsx, src/app/api/ingest/route.ts
- Features: none
- Shared libs: src/lib/env.ts, src/lib/supabase.ts
- Agent files: none
- Tests/docs/other: none
