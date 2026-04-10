# agent / root

Generated from the current working tree on 2026-04-10 16:45:57.

- Files: 13
- File kinds: JSON config/data (5), Markdown doc (4), env/config text file (2), ignore file (1), TypeScript module (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `agent/.env`
- Status: tracked-clean
- System: agent
- Group: agent / root
- Ownership: agent root/runtime metadata
- Type: env/config text file
- Lines: 63
- Bytes: 2345
- Contents summary: env keys: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, TELEGRAM_OWNER_CHAT_IDS, TELEGRAM_WEBHOOK_SECRET, TM_EMAIL, TM_PASSWORD, INGEST_URL, INGEST_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CLAUDE_PATH, CHECK_CRON, DISCORD_TOKEN, DISCORD_CHANNEL_ID, DISCORD_CLIENT_ID

## `agent/.env.example`
- Status: tracked-clean
- System: agent
- Group: agent / root
- Ownership: agent root/runtime metadata
- Type: env/config text file
- Lines: 76
- Bytes: 2683
- Contents summary: env keys: TM_EMAIL, TM_PASSWORD, TM1_BASE_URL, TM1_API_PREFIX, TM1_EVENTBASE_API_PREFIX, TM1_TCODE, TM1_COOKIE, TM1_XSRF_TOKEN, TM1_DEFAULT_EVENT_START, TM1_DEFAULT_EVENT_END, TM1_TIMEOUT_MS, INGEST_URL, INGEST_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

## `agent/.gitignore`
- Status: tracked-clean
- System: agent
- Group: agent / root
- Ownership: agent root/runtime metadata
- Type: ignore file
- Lines: 5
- Bytes: 34
- Contents summary: ignore patterns: node_modules/, dist/, .env, session/

## `agent/AGENTS.md`
- Status: tracked-clean
- System: agent
- Group: agent / root
- Ownership: agent root/runtime metadata
- Type: Markdown doc
- Construction: markdown document
- Lines: 12
- Bytes: 1496
- Headings: Agent Runtime
- Contents summary: headings: Agent Runtime

## `agent/CLAUDE.md`
- Status: tracked-clean
- System: agent
- Group: agent / root
- Ownership: agent root/runtime metadata
- Type: Markdown doc
- Construction: markdown document
- Lines: 45
- Bytes: 1639
- Headings: Outlet Media Agent, What you are, What you are NOT, Tools available to you, Files that matter, What to ignore
- Contents summary: headings: Outlet Media Agent \| What you are \| What you are NOT \| Tools available to you \| Files that matter \| What to ignore

## `agent/LEARNINGS.md`
- Status: tracked-clean
- System: agent
- Group: agent / root
- Ownership: agent root/runtime metadata
- Type: Markdown doc
- Construction: markdown document, frontmatter-like markdown structure
- Lines: 1030
- Bytes: 122680
- Headings: Outlet Media Agent — Learning Journal, YYYY-MM-DD HH:MM — Cycle #N, 2026-02-18 — Cycles #0-3 Summary (Genesis & Setup), 2026-02-18 — Cycles #4-7 Summary (Discovery & Hardening), 2026-02-18 — Cycles #8-9 Summary (Monitoring + general.txt Audit), 2026-02-19 — Cycles #10-11 Summary (First Pacing + Infra Audit), 2026-02-19 — Cycles #12-17 Summary (Prompt Completion + Scheduler Crisis), 2026-02-22 — Cycles #18-21 Summary (Post-Restart Recovery), 2026-02-23 — Manual Actions (command-mode, not think cycles), 2026-02-23 — Cycles #22-28 Summary (First Full Day of Fresh Data), … (+10 more)
- Contents summary: headings: Outlet Media Agent — Learning Journal \| YYYY-MM-DD HH:MM — Cycle #N \| 2026-02-18 — Cycles #0-3 Summary (Genesis & Setup) \| 2026-02-18 — Cycles #4-7 Summary (Discovery & Hardening) \| 2026-02-18 — Cycles #8-9 Summary (Monitoring + general.txt Audit) \| 2026-02-19 — Cycles #10-11 Summary (First Pacing + Infra Au…

## `agent/MEMORY.md`
- Status: tracked-clean
- System: agent
- Group: agent / root
- Ownership: agent root/runtime metadata
- Type: Markdown doc
- Construction: markdown document
- Lines: 275
- Bytes: 23616
- Headings: Outlet Media Agent — Shared Memory, Who Is Jaime, What Outlet Media Does, Clients, Infrastructure, Campaign Strategy (from Arjona tour learnings), Email Rules — Venue/Pixel Communications, Learned Preferences, Data Storage Conventions, Data Pipeline Status (verified 2026-04-03), … (+10 more)
- Contents summary: headings: Outlet Media Agent — Shared Memory \| Who Is Jaime \| What Outlet Media Does \| Clients \| Infrastructure \| Campaign Strategy (from Arjona tour learnings)

## `agent/package-lock.json`
- Status: tracked-clean
- System: agent
- Group: agent / root
- Ownership: agent root/runtime metadata
- Type: JSON config/data
- Construction: JSON configuration/data file
- Lines: 3353
- Bytes: 114914
- JSON shape: JSON object
- JSON keys: name, version, lockfileVersion, requires, packages
- Contents summary: JSON object; keys: name, version, lockfileVersion, requires, packages

## `agent/package.json`
- Status: tracked-clean
- System: agent
- Group: agent / root
- Ownership: agent root/runtime metadata
- Type: JSON config/data
- Construction: JSON configuration/data file
- Lines: 28
- Bytes: 774
- JSON shape: JSON object
- JSON keys: name, version, description, type, scripts, dependencies, devDependencies
- JSON scripts: start, dev, daemon, type-check, test, check
- Contents summary: JSON object; keys: name, version, description, type, scripts, dependencies, devDependencies; scripts: start, dev, daemon, type-check, test, check

## `agent/rules.json`
- Status: tracked-clean
- System: agent
- Group: agent / root
- Ownership: agent root/runtime metadata
- Type: JSON config/data
- Construction: JSON configuration/data file
- Lines: 19
- Bytes: 404
- JSON shape: JSON object
- JSON keys: yellow, red_always
- Contents summary: JSON object; keys: yellow, red_always

## `agent/service-account.json`
- Status: tracked-clean
- System: agent
- Group: agent / root
- Ownership: agent root/runtime metadata
- Type: JSON config/data
- Construction: JSON configuration/data file
- Lines: 14
- Bytes: 2366
- JSON shape: JSON object
- JSON keys: type, project_id, private_key_id, private_key, client_email, client_id, auth_uri, token_uri, auth_provider_x509_cert_url, client_x509_cert_url, universe_domain
- Contents summary: JSON object; keys: type, project_id, private_key_id, private_key, client_email, client_id, auth_uri, token_uri, auth_provider_x509_cert_url, client_x509_cert_url

## `agent/tsconfig.json`
- Status: tracked-clean
- System: agent
- Group: agent / root
- Ownership: agent root/runtime metadata
- Type: JSON config/data
- Construction: JSON configuration/data file
- Lines: 14
- Bytes: 286
- JSON shape: JSON object
- JSON keys: compilerOptions, include
- Contents summary: JSON object; keys: compilerOptions, include

## `agent/vitest.config.ts`
- Status: tracked-clean
- System: agent
- Group: agent / root
- Ownership: agent root/runtime metadata
- Type: TypeScript module
- Construction: code module
- Lines: 13
- Bytes: 278
- Imports (packages): vitest/config, node:url
- Exports: default
- Symbol details: const rootDir
- Defines: rootDir
- Contents summary: exports: default; package imports: 2
