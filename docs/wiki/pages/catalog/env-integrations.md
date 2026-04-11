# Env and Integration Map

Generated from the current working tree on 2026-04-10 21:37:00.

This page maps environment variables to integration services and to the first-party files that reference them.

- Environment keys tracked: 99
- Integration service buckets: 10

## Service overview

### Anthropic / Claude
- Env keys: ANTHROPIC_API_KEY, CLAUDE_PATH, CLIENT_AGENT_CLAUDE_MODEL
- Declared in: .env.example, agent/.env, agent/.env.example
- Routes: none
- Features/libs: src/features/client-agent/runtime.test.ts, src/features/client-agent/runtime.ts, src/lib/env.ts
- Agent files: agent/src/index.ts, agent/src/runner.test.ts, agent/src/runner.ts
- Tests/docs: none

### App / Runtime
- Env keys: INGEST_SECRET, INGEST_URL, NEXT_PUBLIC_APP_URL
- Declared in: .env.example, .env.local, agent/.env, agent/.env.example
- Routes: src/app/admin/settings/page.tsx, src/app/api/admin/invite/route.ts, src/app/api/alerts/route.ts, src/app/api/meta/callback/route.ts, src/app/api/meta/data-deletion/route.ts
- Features/libs: src/lib/api-helpers.test.ts, src/lib/api-helpers.ts, src/lib/env.ts
- Agent files: agent/LEARNINGS.md, agent/MEMORY.md
- Tests/docs: __tests__/api/agents-heartbeat.test.ts, __tests__/api/alerts.test.ts, __tests__/api/ingest.test.ts, docs/context/meta-ads-playbook.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/superpowers/plans/2026-03-10-agent-code-quality-10-10.md, src/app/api/admin/invite/route.test.ts, src/app/api/meta/callback/route.test.ts, src/app/api/meta/data-deletion/route.test.ts

### Clerk
- Env keys: CLERK_SECRET_KEY, NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL, NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, NEXT_PUBLIC_CLERK_SIGN_IN_URL, NEXT_PUBLIC_CLERK_SIGN_UP_URL
- Declared in: .env.example, .env.local
- Routes: src/app/admin/layout.tsx, src/app/admin/settings/page.tsx, src/app/client/[slug]/layout.tsx, src/app/client/pending/layout.tsx, src/app/layout.tsx, src/app/page.tsx
- Features/libs: src/features/notifications/server.ts, src/lib/env.ts
- Agent files: none
- Tests/docs: docs/plans/2026-03-03-client-accounts-plan.md, docs/plans/2026-03-27-shell-reset-implementation-plan.md, src/app/client/[slug]/layout.test.tsx

### Discord
- Env keys: DISCORD_ADMIN_ROLE_NAME, DISCORD_BANNED_WORDS, DISCORD_BOT_ROLE_NAME, DISCORD_CHANNEL_ID, DISCORD_CLIENT_ID, DISCORD_DEFAULT_ROLE_ID, DISCORD_EXEMPT_CHANNELS, DISCORD_GUILD_ID, DISCORD_LOG_CHANNEL_ID, DISCORD_OWNER_ROLE_NAME, DISCORD_OWNER_USER_IDS, DISCORD_RESTRUCTURE_PRUNE, DISCORD_TEAM_ROLE_NAME, DISCORD_TOKEN, DISCORD_USER_TOKEN, DISCORD_VIEWER_ROLE_NAME, DISCORD_WELCOME_CHANNEL_ID, EMAIL_NOTIFY_DISCORD
- Declared in: .env.example, agent/.env, agent/.env.example
- Routes: none
- Features/libs: none
- Agent files: agent/scripts/discord-mcp.sh, agent/src/discord/commands/slash.ts, agent/src/discord/core/entry.ts, agent/src/index.ts
- Tests/docs: docs/superpowers/plans/2026-03-10-agent-code-quality-10-10.md

### Google / Gmail / Calendar
- Env keys: GMAIL_IMPERSONATE_USER, GMAIL_PUBSUB_TOPIC, GMAIL_PUSH_LABEL_IDS, GMAIL_PUSH_WEBHOOK_SECRET, GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET, GOOGLE_ADS_CUSTOMER_ID, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_LOGIN_CUSTOMER_ID, GOOGLE_ADS_REFRESH_TOKEN, GOOGLE_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_DRIVE_REFRESH_TOKEN, GOOGLE_REFRESH_TOKEN
- Declared in: .env.local, agent/.env, agent/.env.example
- Routes: src/app/admin/settings/page.tsx, src/app/api/agents/email/watch/route.ts
- Features/libs: src/lib/env.ts, src/lib/google-ads.ts
- Agent files: none
- Tests/docs: docs/context/google-ads-api.md, docs/context/tm1-browserless-api.md

### Meta
- Env keys: META_ACCESS_TOKEN, META_AD_ACCOUNT_ID, META_APP_ID, META_APP_SECRET, META_PAGE_ID
- Declared in: .env.example, .env.local
- Routes: src/app/admin/campaigns/page.tsx, src/app/admin/settings/page.tsx
- Features/libs: src/lib/env.ts, src/lib/meta-campaigns.ts, src/lib/meta-oauth.test.ts, src/lib/meta-oauth.ts
- Agent files: agent/prompts/agent.txt
- Tests/docs: docs/context/meta-ads-playbook.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-design.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-03-direct-meta-api-campaigns-plan.md, docs/superpowers/specs/2026-04-03-agent-simplification-design.md, src/app/api/meta/callback/route.test.ts, src/app/api/meta/data-deletion/route.test.ts

### Other / App
- Env keys: CHECK_CRON, CHROME_DEBUG_URL, CLIENT_AGENT_OPENAI_MODEL, CODEX_FINAL_MESSAGE, CONTACT_FORM_TO_EMAIL, EATA_PASSWORD, EATA_SCHEDULER_ENABLED, EATA_USERNAME, EMAIL_HISTORY_POLL_CRON, EVOLUTION_API_KEY, EVOLUTION_API_URL, EVOLUTION_INSTANCE_NAME, EVOLUTION_WEBHOOK_SECRET, NEXT_PHASE, PR_NUMBER, SCHEDULED_OWNER_NOTIFICATIONS, SHOPIFY_ADMIN_ACCESS_TOKEN, SHOPIFY_ADMIN_API_VERSION, SHOPIFY_STORE_DOMAIN, SHOPIFY_WEBHOOK_SECRET, … (+12 more)
- Declared in: .env.local, agent/.env, agent/.env.example
- Routes: src/app/api/contact/route.ts
- Features/libs: src/lib/env.ts, src/lib/shopify-admin.test.ts, src/lib/shopify-admin.ts
- Agent files: agent/MEMORY.md
- Tests/docs: docs/context/shopify-merch-sync.md, docs/context/tm1-browserless-api.md, docs/plans/2026-03-02-meta-oauth-integration-design.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/superpowers/plans/2026-03-31-client-agent-tab.md, docs/superpowers/plans/2026-04-01-client-agent-chatgpt-ux.md, docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md

### Resend
- Env keys: RESEND_API_KEY, RESEND_FROM_EMAIL
- Declared in: .env.example
- Routes: src/app/api/contact/route.ts
- Features/libs: none
- Agent files: none
- Tests/docs: docs/plans/2026-03-03-landing-page-design.md, docs/plans/2026-03-03-landing-page-plan.md

### Supabase
- Env keys: NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_ACCESS_TOKEN, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL
- Declared in: .env.example, .env.local, agent/.env, agent/.env.example
- Routes: src/app/admin/settings/page.tsx, src/app/api/ingest/route.ts
- Features/libs: src/lib/env.ts, src/lib/supabase.ts
- Agent files: agent/prompts/agent.txt, agent/src/index.ts, agent/src/services/queue-service.test.ts, agent/src/services/queue-service.ts, agent/src/services/runtime-state-service.test.ts, agent/src/services/runtime-state-service.ts, agent/src/services/supabase-service.ts
- Tests/docs: docs/plans/2026-02-26-discord-agent-architecture-plan.md

### Ticketmaster
- Env keys: TICKETMASTER_API_KEY, TM1_API_PREFIX, TM1_BASE_URL, TM1_COOKIE, TM1_DEFAULT_EVENT_END, TM1_DEFAULT_EVENT_START, TM1_EVENTBASE_API_PREFIX, TM1_TCODE, TM1_TIMEOUT_MS, TM1_XSRF_TOKEN
- Declared in: .env.example, agent/.env.example
- Routes: src/app/admin/settings/page.tsx
- Features/libs: src/lib/env.ts, src/lib/ticketmaster/tm1-client.ts
- Agent files: agent/scripts/tm1-crawl-capabilities.mjs
- Tests/docs: docs/context/tm1-browserless-api.md

## Env variable details

### `ANTHROPIC_API_KEY`
- Service: Anthropic / Claude
- Declared in: .env.example
- Mentioned by groups: src/features / client-agent (2), src/lib (1)
- Routes: none
- Features: src/features/client-agent/runtime.test.ts, src/features/client-agent/runtime.ts
- Shared libs: src/lib/env.ts
- Agent files: none
- Tests/docs/other: none

### `CHECK_CRON`
- Service: Other / App
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `CHROME_DEBUG_URL`
- Service: Other / App
- Declared in: none
- Mentioned by groups: Docs / Superpowers Plans (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md

### `CLAUDE_PATH`
- Service: Anthropic / Claude
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: agent/src / root (3)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: agent/src/index.ts, agent/src/runner.test.ts, agent/src/runner.ts
- Tests/docs/other: none

### `CLERK_SECRET_KEY`
- Service: Clerk
- Declared in: .env.example, .env.local
- Mentioned by groups: src/app / admin (1), src/lib (1)
- Routes: src/app/admin/settings/page.tsx
- Features: none
- Shared libs: src/lib/env.ts
- Agent files: none
- Tests/docs/other: none

### `CLIENT_AGENT_CLAUDE_MODEL`
- Service: Anthropic / Claude
- Declared in: .env.example
- Mentioned by groups: src/features / client-agent (2), src/lib (1)
- Routes: none
- Features: src/features/client-agent/runtime.test.ts, src/features/client-agent/runtime.ts
- Shared libs: src/lib/env.ts
- Agent files: none
- Tests/docs/other: none

### `CLIENT_AGENT_OPENAI_MODEL`
- Service: Other / App
- Declared in: none
- Mentioned by groups: Docs / Superpowers Plans (2)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: docs/superpowers/plans/2026-03-31-client-agent-tab.md, docs/superpowers/plans/2026-04-01-client-agent-chatgpt-ux.md

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
- Mentioned by groups: src/app / api (1)
- Routes: src/app/api/contact/route.ts
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `DISCORD_ADMIN_ROLE_NAME`
- Service: Discord
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `DISCORD_BANNED_WORDS`
- Service: Discord
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `DISCORD_BOT_ROLE_NAME`
- Service: Discord
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `DISCORD_CHANNEL_ID`
- Service: Discord
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: agent/src / discord (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: agent/src/discord/core/entry.ts
- Tests/docs/other: none

### `DISCORD_CLIENT_ID`
- Service: Discord
- Declared in: .env.example, agent/.env, agent/.env.example
- Mentioned by groups: agent / scripts (1), agent/src / discord (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: agent/scripts/discord-mcp.sh, agent/src/discord/commands/slash.ts
- Tests/docs/other: none

### `DISCORD_DEFAULT_ROLE_ID`
- Service: Discord
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `DISCORD_EXEMPT_CHANNELS`
- Service: Discord
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `DISCORD_GUILD_ID`
- Service: Discord
- Declared in: .env.example, agent/.env, agent/.env.example
- Mentioned by groups: agent / scripts (1), agent/src / discord (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: agent/scripts/discord-mcp.sh, agent/src/discord/commands/slash.ts
- Tests/docs/other: none

### `DISCORD_LOG_CHANNEL_ID`
- Service: Discord
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `DISCORD_OWNER_ROLE_NAME`
- Service: Discord
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `DISCORD_OWNER_USER_IDS`
- Service: Discord
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: Docs / Superpowers Plans (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: docs/superpowers/plans/2026-03-10-agent-code-quality-10-10.md

### `DISCORD_RESTRUCTURE_PRUNE`
- Service: Discord
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `DISCORD_TEAM_ROLE_NAME`
- Service: Discord
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `DISCORD_TOKEN`
- Service: Discord
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: agent / scripts (1), agent/src / discord (1), agent/src / root (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: agent/scripts/discord-mcp.sh, agent/src/discord/core/entry.ts, agent/src/index.ts
- Tests/docs/other: none

### `DISCORD_USER_TOKEN`
- Service: Discord
- Declared in: agent/.env
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `DISCORD_VIEWER_ROLE_NAME`
- Service: Discord
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `DISCORD_WELCOME_CHANNEL_ID`
- Service: Discord
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `EATA_PASSWORD`
- Service: Other / App
- Declared in: agent/.env
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `EATA_SCHEDULER_ENABLED`
- Service: Other / App
- Declared in: agent/.env.example
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `EATA_USERNAME`
- Service: Other / App
- Declared in: agent/.env
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `EMAIL_HISTORY_POLL_CRON`
- Service: Other / App
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `EMAIL_NOTIFY_DISCORD`
- Service: Discord
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `EVOLUTION_API_KEY`
- Service: Other / App
- Declared in: .env.local
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `EVOLUTION_API_URL`
- Service: Other / App
- Declared in: .env.local
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `EVOLUTION_INSTANCE_NAME`
- Service: Other / App
- Declared in: .env.local
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `EVOLUTION_WEBHOOK_SECRET`
- Service: Other / App
- Declared in: .env.local
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `GMAIL_IMPERSONATE_USER`
- Service: Google / Gmail / Calendar
- Declared in: agent/.env.example
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `GMAIL_PUBSUB_TOPIC`
- Service: Google / Gmail / Calendar
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `GMAIL_PUSH_LABEL_IDS`
- Service: Google / Gmail / Calendar
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `GMAIL_PUSH_WEBHOOK_SECRET`
- Service: Google / Gmail / Calendar
- Declared in: .env.local
- Mentioned by groups: Root Files (1), src/app / api (1)
- Routes: src/app/api/agents/email/watch/route.ts
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: audit/imports-deps.md

### `GOOGLE_ADS_CLIENT_ID`
- Service: Google / Gmail / Calendar
- Declared in: .env.local
- Mentioned by groups: src/lib (2), Docs / Context (1), src/app / admin (1)
- Routes: src/app/admin/settings/page.tsx
- Features: none
- Shared libs: src/lib/env.ts, src/lib/google-ads.ts
- Agent files: none
- Tests/docs/other: docs/context/google-ads-api.md

### `GOOGLE_ADS_CLIENT_SECRET`
- Service: Google / Gmail / Calendar
- Declared in: .env.local
- Mentioned by groups: src/lib (2), Docs / Context (1), src/app / admin (1)
- Routes: src/app/admin/settings/page.tsx
- Features: none
- Shared libs: src/lib/env.ts, src/lib/google-ads.ts
- Agent files: none
- Tests/docs/other: docs/context/google-ads-api.md

### `GOOGLE_ADS_CUSTOMER_ID`
- Service: Google / Gmail / Calendar
- Declared in: .env.local
- Mentioned by groups: src/lib (2), Docs / Context (1), src/app / admin (1)
- Routes: src/app/admin/settings/page.tsx
- Features: none
- Shared libs: src/lib/env.ts, src/lib/google-ads.ts
- Agent files: none
- Tests/docs/other: docs/context/google-ads-api.md

### `GOOGLE_ADS_DEVELOPER_TOKEN`
- Service: Google / Gmail / Calendar
- Declared in: .env.local
- Mentioned by groups: src/lib (2), Docs / Context (1), src/app / admin (1)
- Routes: src/app/admin/settings/page.tsx
- Features: none
- Shared libs: src/lib/env.ts, src/lib/google-ads.ts
- Agent files: none
- Tests/docs/other: docs/context/google-ads-api.md

### `GOOGLE_ADS_LOGIN_CUSTOMER_ID`
- Service: Google / Gmail / Calendar
- Declared in: .env.local
- Mentioned by groups: src/lib (2), Docs / Context (1), src/app / admin (1)
- Routes: src/app/admin/settings/page.tsx
- Features: none
- Shared libs: src/lib/env.ts, src/lib/google-ads.ts
- Agent files: none
- Tests/docs/other: docs/context/google-ads-api.md

### `GOOGLE_ADS_REFRESH_TOKEN`
- Service: Google / Gmail / Calendar
- Declared in: .env.local
- Mentioned by groups: src/lib (2), Docs / Context (1), src/app / admin (1)
- Routes: src/app/admin/settings/page.tsx
- Features: none
- Shared libs: src/lib/env.ts, src/lib/google-ads.ts
- Agent files: none
- Tests/docs/other: docs/context/google-ads-api.md

### `GOOGLE_API_KEY`
- Service: Google / Gmail / Calendar
- Declared in: .env.local
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `GOOGLE_CLIENT_ID`
- Service: Google / Gmail / Calendar
- Declared in: .env.local, agent/.env
- Mentioned by groups: Docs / Context (2)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: docs/context/google-ads-api.md, docs/context/tm1-browserless-api.md

### `GOOGLE_CLIENT_SECRET`
- Service: Google / Gmail / Calendar
- Declared in: .env.local, agent/.env
- Mentioned by groups: Docs / Context (2)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: docs/context/google-ads-api.md, docs/context/tm1-browserless-api.md

### `GOOGLE_DRIVE_REFRESH_TOKEN`
- Service: Google / Gmail / Calendar
- Declared in: .env.local
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `GOOGLE_REFRESH_TOKEN`
- Service: Google / Gmail / Calendar
- Declared in: .env.local, agent/.env
- Mentioned by groups: Docs / Context (2)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: docs/context/google-ads-api.md, docs/context/tm1-browserless-api.md

### `INGEST_SECRET`
- Service: App / Runtime
- Declared in: .env.example, .env.local, agent/.env, agent/.env.example
- Mentioned by groups: Tests / API (3), src/lib (3), Docs / Superpowers Plans (1), src/app / admin (1), src/app / api (1)
- Routes: src/app/admin/settings/page.tsx, src/app/api/alerts/route.ts
- Features: none
- Shared libs: src/lib/api-helpers.test.ts, src/lib/api-helpers.ts, src/lib/env.ts
- Agent files: none
- Tests/docs/other: __tests__/api/agents-heartbeat.test.ts, __tests__/api/alerts.test.ts, __tests__/api/ingest.test.ts, docs/superpowers/plans/2026-03-10-agent-code-quality-10-10.md

### `INGEST_URL`
- Service: App / Runtime
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: agent / root (2)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: agent/LEARNINGS.md, agent/MEMORY.md
- Tests/docs/other: none

### `META_ACCESS_TOKEN`
- Service: Meta
- Declared in: .env.example, .env.local
- Mentioned by groups: Docs / Plans (4), src/app / admin (2), src/lib (2), agent / prompts (1), Docs / Context (1), Docs / Superpowers Specs (1), src/app / client (1)
- Routes: src/app/admin/settings/page.tsx
- Features: none
- Shared libs: src/lib/env.ts, src/lib/meta-campaigns.ts
- Agent files: agent/prompts/agent.txt
- Tests/docs/other: docs/context/meta-ads-playbook.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-design.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-03-direct-meta-api-campaigns-plan.md, docs/superpowers/specs/2026-04-03-agent-simplification-design.md, src/app/admin/actions/meta-sync.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts

### `META_AD_ACCOUNT_ID`
- Service: Meta
- Declared in: .env.example, .env.local
- Mentioned by groups: Docs / Plans (3), src/app / admin (2), src/lib (2), Docs / Context (1), src/app / client (1)
- Routes: src/app/admin/campaigns/page.tsx
- Features: none
- Shared libs: src/lib/env.ts, src/lib/meta-campaigns.ts
- Agent files: none
- Tests/docs/other: docs/context/meta-ads-playbook.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-03-direct-meta-api-campaigns-plan.md, src/app/admin/actions/meta-sync.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts

### `META_APP_ID`
- Service: Meta
- Declared in: .env.local
- Mentioned by groups: Docs / Plans (2), Docs / Context (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: docs/context/meta-ads-playbook.md, docs/plans/2026-03-02-meta-oauth-integration-design.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md

### `META_APP_SECRET`
- Service: Meta
- Declared in: .env.example, .env.local
- Mentioned by groups: src/lib (3), Docs / Plans (2), src/app / api (2), Docs / Context (1)
- Routes: none
- Features: none
- Shared libs: src/lib/env.ts, src/lib/meta-oauth.test.ts, src/lib/meta-oauth.ts
- Agent files: none
- Tests/docs/other: docs/context/meta-ads-playbook.md, docs/plans/2026-03-02-meta-oauth-integration-design.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, src/app/api/meta/callback/route.test.ts, src/app/api/meta/data-deletion/route.test.ts

### `META_PAGE_ID`
- Service: Meta
- Declared in: none
- Mentioned by groups: Docs / Plans (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: docs/plans/2026-03-02-meta-oauth-integration-plan.md

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
- Mentioned by groups: src/app / api (6), Docs / Context (1), Docs / Plans (1), src/lib (1)
- Routes: src/app/api/admin/invite/route.ts, src/app/api/meta/callback/route.ts, src/app/api/meta/data-deletion/route.ts
- Features: none
- Shared libs: src/lib/env.ts
- Agent files: none
- Tests/docs/other: docs/context/meta-ads-playbook.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, src/app/api/admin/invite/route.test.ts, src/app/api/meta/callback/route.test.ts, src/app/api/meta/data-deletion/route.test.ts

### `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
- Service: Clerk
- Declared in: .env.example, .env.local
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: audit/imports-deps.md

### `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`
- Service: Clerk
- Declared in: .env.example, .env.local
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: audit/imports-deps.md

### `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Service: Clerk
- Declared in: .env.example, .env.local
- Mentioned by groups: src/app / client (3), Docs / Plans (2), src/app / admin (2), src/app / root routes (2), src/components / admin (1), src/features / notifications (1), src/lib (1)
- Routes: src/app/admin/layout.tsx, src/app/client/[slug]/layout.tsx, src/app/client/pending/layout.tsx, src/app/layout.tsx, src/app/page.tsx
- Features: src/features/notifications/server.ts
- Shared libs: src/lib/env.ts
- Agent files: none
- Tests/docs/other: docs/plans/2026-03-03-client-accounts-plan.md, docs/plans/2026-03-27-shell-reset-implementation-plan.md, src/app/admin/users/data.ts, src/app/client/[slug]/layout.test.tsx, src/components/admin/user-avatar.tsx

### `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- Service: Clerk
- Declared in: .env.example, .env.local
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: audit/imports-deps.md

### `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- Service: Clerk
- Declared in: .env.example, .env.local
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: audit/imports-deps.md

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Service: Supabase
- Declared in: .env.example, .env.local
- Mentioned by groups: src/lib (2)
- Routes: none
- Features: none
- Shared libs: src/lib/env.ts, src/lib/supabase.ts
- Agent files: none
- Tests/docs/other: none

### `NEXT_PUBLIC_SUPABASE_URL`
- Service: Supabase
- Declared in: .env.example, .env.local
- Mentioned by groups: agent/src / services (3), src/lib (2), Docs / Plans (1), src/app / admin (1)
- Routes: src/app/admin/settings/page.tsx
- Features: none
- Shared libs: src/lib/env.ts, src/lib/supabase.ts
- Agent files: agent/src/services/queue-service.ts, agent/src/services/runtime-state-service.ts, agent/src/services/supabase-service.ts
- Tests/docs/other: docs/plans/2026-02-26-discord-agent-architecture-plan.md

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
- Mentioned by groups: Docs / Plans (2), Root Files (1), src/app / api (1)
- Routes: src/app/api/contact/route.ts
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: audit/imports-deps.md, docs/plans/2026-03-03-landing-page-design.md, docs/plans/2026-03-03-landing-page-plan.md

### `RESEND_FROM_EMAIL`
- Service: Resend
- Declared in: none
- Mentioned by groups: Root Files (1), src/app / api (1)
- Routes: src/app/api/contact/route.ts
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: audit/imports-deps.md

### `SCHEDULED_OWNER_NOTIFICATIONS`
- Service: Other / App
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `SHOPIFY_ADMIN_ACCESS_TOKEN`
- Service: Other / App
- Declared in: .env.local
- Mentioned by groups: src/lib (2), Docs / Context (1)
- Routes: none
- Features: none
- Shared libs: src/lib/shopify-admin.test.ts, src/lib/shopify-admin.ts
- Agent files: none
- Tests/docs/other: docs/context/shopify-merch-sync.md

### `SHOPIFY_ADMIN_API_VERSION`
- Service: Other / App
- Declared in: .env.local
- Mentioned by groups: src/lib (2), Docs / Context (1)
- Routes: none
- Features: none
- Shared libs: src/lib/shopify-admin.test.ts, src/lib/shopify-admin.ts
- Agent files: none
- Tests/docs/other: docs/context/shopify-merch-sync.md

### `SHOPIFY_STORE_DOMAIN`
- Service: Other / App
- Declared in: .env.local
- Mentioned by groups: src/lib (2), Docs / Context (1)
- Routes: none
- Features: none
- Shared libs: src/lib/shopify-admin.test.ts, src/lib/shopify-admin.ts
- Agent files: none
- Tests/docs/other: docs/context/shopify-merch-sync.md

### `SHOPIFY_WEBHOOK_SECRET`
- Service: Other / App
- Declared in: .env.local
- Mentioned by groups: Docs / Context (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: docs/context/shopify-merch-sync.md

### `SUPABASE_ACCESS_TOKEN`
- Service: Supabase
- Declared in: .env.local
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `SUPABASE_SERVICE_ROLE_KEY`
- Service: Supabase
- Declared in: .env.example, .env.local, agent/.env, agent/.env.example
- Mentioned by groups: agent/src / services (5), src/lib (2), agent / prompts (1), agent/src / root (1), Docs / Plans (1), src/app / admin (1), src/app / api (1)
- Routes: src/app/admin/settings/page.tsx, src/app/api/ingest/route.ts
- Features: none
- Shared libs: src/lib/env.ts, src/lib/supabase.ts
- Agent files: agent/prompts/agent.txt, agent/src/index.ts, agent/src/services/queue-service.test.ts, agent/src/services/queue-service.ts, agent/src/services/runtime-state-service.test.ts, agent/src/services/runtime-state-service.ts, agent/src/services/supabase-service.ts
- Tests/docs/other: docs/plans/2026-02-26-discord-agent-architecture-plan.md

### `SUPABASE_URL`
- Service: Supabase
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: agent/src / services (5), agent/src / root (1), Docs / Plans (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: agent/src/index.ts, agent/src/services/queue-service.test.ts, agent/src/services/queue-service.ts, agent/src/services/runtime-state-service.test.ts, agent/src/services/runtime-state-service.ts, agent/src/services/supabase-service.ts
- Tests/docs/other: docs/plans/2026-02-26-discord-agent-architecture-plan.md

### `TELEGRAM_BOT_TOKEN`
- Service: Other / App
- Declared in: agent/.env
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `TELEGRAM_CHAT_ID`
- Service: Other / App
- Declared in: agent/.env
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `TELEGRAM_OWNER_CHAT_IDS`
- Service: Other / App
- Declared in: agent/.env
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `TELEGRAM_WEBHOOK_SECRET`
- Service: Other / App
- Declared in: .env.local, agent/.env
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `TICKETMASTER_API_KEY`
- Service: Ticketmaster
- Declared in: .env.example
- Mentioned by groups: src/app / admin (1), src/lib (1)
- Routes: src/app/admin/settings/page.tsx
- Features: none
- Shared libs: src/lib/env.ts
- Agent files: none
- Tests/docs/other: none

### `TM1_API_PREFIX`
- Service: Ticketmaster
- Declared in: .env.example, agent/.env.example
- Mentioned by groups: Docs / Context (1), src/lib (1), src/lib / ticketmaster (1)
- Routes: none
- Features: none
- Shared libs: src/lib/env.ts, src/lib/ticketmaster/tm1-client.ts
- Agent files: none
- Tests/docs/other: docs/context/tm1-browserless-api.md

### `TM1_BASE_URL`
- Service: Ticketmaster
- Declared in: .env.example, agent/.env.example
- Mentioned by groups: agent / scripts (1), Docs / Context (1), src/lib (1), src/lib / ticketmaster (1)
- Routes: none
- Features: none
- Shared libs: src/lib/env.ts, src/lib/ticketmaster/tm1-client.ts
- Agent files: agent/scripts/tm1-crawl-capabilities.mjs
- Tests/docs/other: docs/context/tm1-browserless-api.md

### `TM1_COOKIE`
- Service: Ticketmaster
- Declared in: .env.example, agent/.env.example
- Mentioned by groups: agent / scripts (1), Docs / Context (1), src/lib (1), src/lib / ticketmaster (1)
- Routes: none
- Features: none
- Shared libs: src/lib/env.ts, src/lib/ticketmaster/tm1-client.ts
- Agent files: agent/scripts/tm1-crawl-capabilities.mjs
- Tests/docs/other: docs/context/tm1-browserless-api.md

### `TM1_DEFAULT_EVENT_END`
- Service: Ticketmaster
- Declared in: .env.example, agent/.env.example
- Mentioned by groups: Docs / Context (1), src/lib (1), src/lib / ticketmaster (1)
- Routes: none
- Features: none
- Shared libs: src/lib/env.ts, src/lib/ticketmaster/tm1-client.ts
- Agent files: none
- Tests/docs/other: docs/context/tm1-browserless-api.md

### `TM1_DEFAULT_EVENT_START`
- Service: Ticketmaster
- Declared in: .env.example, agent/.env.example
- Mentioned by groups: Docs / Context (1), src/lib (1), src/lib / ticketmaster (1)
- Routes: none
- Features: none
- Shared libs: src/lib/env.ts, src/lib/ticketmaster/tm1-client.ts
- Agent files: none
- Tests/docs/other: docs/context/tm1-browserless-api.md

### `TM1_EVENTBASE_API_PREFIX`
- Service: Ticketmaster
- Declared in: .env.example, agent/.env.example
- Mentioned by groups: Docs / Context (1), src/lib (1), src/lib / ticketmaster (1)
- Routes: none
- Features: none
- Shared libs: src/lib/env.ts, src/lib/ticketmaster/tm1-client.ts
- Agent files: none
- Tests/docs/other: docs/context/tm1-browserless-api.md

### `TM1_TCODE`
- Service: Ticketmaster
- Declared in: .env.example, agent/.env.example
- Mentioned by groups: Docs / Context (1), src/lib (1), src/lib / ticketmaster (1)
- Routes: none
- Features: none
- Shared libs: src/lib/env.ts, src/lib/ticketmaster/tm1-client.ts
- Agent files: none
- Tests/docs/other: docs/context/tm1-browserless-api.md

### `TM1_TIMEOUT_MS`
- Service: Ticketmaster
- Declared in: .env.example, agent/.env.example
- Mentioned by groups: Docs / Context (1), src/lib (1), src/lib / ticketmaster (1)
- Routes: none
- Features: none
- Shared libs: src/lib/env.ts, src/lib/ticketmaster/tm1-client.ts
- Agent files: none
- Tests/docs/other: docs/context/tm1-browserless-api.md

### `TM1_XSRF_TOKEN`
- Service: Ticketmaster
- Declared in: .env.example, agent/.env.example
- Mentioned by groups: agent / scripts (1), Docs / Context (1), src/lib (1), src/lib / ticketmaster (1)
- Routes: none
- Features: none
- Shared libs: src/lib/env.ts, src/lib/ticketmaster/tm1-client.ts
- Agent files: agent/scripts/tm1-crawl-capabilities.mjs
- Tests/docs/other: docs/context/tm1-browserless-api.md

### `TM_EMAIL`
- Service: Other / App
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: agent / root (1), Docs / Context (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: agent/MEMORY.md
- Tests/docs/other: docs/context/tm1-browserless-api.md

### `TM_PASSWORD`
- Service: Other / App
- Declared in: agent/.env, agent/.env.example
- Mentioned by groups: agent / root (1), Docs / Context (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: agent/MEMORY.md
- Tests/docs/other: docs/context/tm1-browserless-api.md

### `TM_SCHEDULER_ENABLED`
- Service: Other / App
- Declared in: agent/.env.example
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `TOKEN_ENCRYPTION_KEY`
- Service: Other / App
- Declared in: none
- Mentioned by groups: Docs / Plans (2)
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: docs/plans/2026-03-02-meta-oauth-integration-design.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md

### `WHATSAPP_APP_SECRET`
- Service: Other / App
- Declared in: agent/.env.example
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `WHATSAPP_CLOUD_API_TOKEN`
- Service: Other / App
- Declared in: agent/.env.example
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `WHATSAPP_OWNER_NUMBERS`
- Service: Other / App
- Declared in: agent/.env.example
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none

### `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
- Service: Other / App
- Declared in: agent/.env.example
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent files: none
- Tests/docs/other: none
