# Root Files

Generated from the current working tree on 2026-04-28 02:57:59.

- Files: 26
- File kinds: Markdown doc (6), TypeScript module (6), JSON config/data (4), env/config text file (3), ignore file (2), file (no extension) (2), JavaScript module (2), TypeScript build info (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `.env.example`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: env/config text file
- Lines: 35
- Bytes: 1241
- Contents summary: env keys: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, NEXT_PUBLIC_CLERK_SIGN_IN_URL, NEXT_PUBLIC_CLERK_SIGN_UP_URL, NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL, NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, INGEST_SECRET, META_ACCESS_TOKEN, ME…

## `.env.local`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: env/config text file
- Lines: 51
- Bytes: 3009
- Contents summary: env keys: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, NEXT_PUBLIC_CLERK_SIGN_IN_URL, NEXT_PUBLIC_CLERK_SIGN_UP_URL, NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL, NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL, SUPABASE_ACCESS_TOKEN, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, INGEST_SECRET…

## `.gitignore`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: ignore file
- Lines: 37
- Bytes: 548
- Contents summary: ignore patterns: .env.local, .next, agent/.next, .local, session, output, tmp, .opencode, .playwright-mcp, .superpowers, docs/superpowers/, docs/screenshots/prototypes/, root-next-artifact-2026-03-08, root-next-artifact-2026-03-08-2, root-next-artifact-2026-03-08-3

## `.railwayignore`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: ignore file
- Lines: 21
- Bytes: 256
- Contents summary: ignore patterns: .git, .next, node_modules, /agent/, .playwright-mcp, .worktrees, .claude, .local, .opencode, session, root-next-artifact-2026-03-08, root-next-artifact-2026-03-08-2, root-next-artifact-2026-03-08-3, archive, coverage

## `AGENTS.md`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: Markdown doc
- Construction: markdown document
- Lines: 116
- Bytes: 5737
- Headings: Outlet Media -- Project Instructions, Stack, Current Product Scope, Product Principles, Architecture Priorities, Execution Expectations, No Garbage Rules, Persistent Context, Repo Organization Rules, Key Paths, … (+3 more)
- Contents summary: headings: Outlet Media -- Project Instructions \| Stack \| Current Product Scope \| Product Principles \| Architecture Priorities \| Execution Expectations

## `README.md`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: Markdown doc
- Construction: markdown document
- Lines: 70
- Bytes: 2382
- Headings: Outlet Media App, Stack, Product Shape, Structure, Read First, Development, Quality Gates, Deploy
- Contents summary: headings: Outlet Media App \| Stack \| Product Shape \| Structure \| Read First \| Development

## `archive/website-legacy/Outlet Media - Resources/.DS_Store`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: file (no extension)
- Bytes: 6148
- Contents summary: asset/binary file; size: 6148 bytes

## `archive/website-legacy/Outlet Media - Resources/Jaime assets/Fotos Jaime/.DS_Store`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: file (no extension)
- Bytes: 10244
- Contents summary: asset/binary file; size: 10244 bytes

## `audit/agent-dead-code.md`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: Markdown doc
- Construction: markdown document, frontmatter-like markdown structure
- Lines: 280
- Bytes: 11621
- Headings: Agent Dead Code & Architectural Drift Audit, TL;DR, 1. Architectural Contradictions in agent/src/, 1.1 queue-service.ts -- Full Delegation & Approval System, 1.2 runtime-state-service.ts -- Heartbeat Cron, 1.3 web-task-executor.ts -- Multi-Agent Routing, 1.4 router.ts -- Approval Channel + Dead Exports, 1.5 system-events-service.ts -- Approval Audit Trail, 2. Stale dist/ Files (19 files, no src/ counterpart), Old Agent System, … (+10 more)
- Contents summary: headings: Agent Dead Code & Architectural Drift Audit \| TL;DR \| 1. Architectural Contradictions in agent/src/ \| 1.1 queue-service.ts -- Full Delegation & Approval System \| 1.2 runtime-state-service.ts -- Heartbeat Cron \| 1.3 web-task-executor.ts -- Multi-Agent Routing

## `audit/architecture-smells.md`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: Markdown doc
- Construction: markdown document, frontmatter-like markdown structure
- Lines: 227
- Bytes: 12117
- Headings: Architecture Audit -- Outlet Media App, 1. Feature Module Audit, Actively used (imported by pages/routes/components), Never imported by pages/routes/components (zombie or internal-only), File structure inconsistency, 2. Database Types Staleness (CRITICAL), Tables in types but NOT used in code (16 zombie type definitions), Tables actively used in code but MISSING from types (5+), Tables from migrations with no code references, 3. Security Audit, … (+10 more)
- Contents summary: headings: Architecture Audit -- Outlet Media App \| 1. Feature Module Audit \| Actively used (imported by pages/routes/components) \| Never imported by pages/routes/components (zombie or internal-only) \| File structure inconsistency \| 2. Database Types Staleness (CRITICAL)

## `audit/dead-routes.md`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: Markdown doc
- Construction: markdown document, frontmatter-like markdown structure
- Lines: 141
- Bytes: 6935
- Headings: Dead Routes & Orphaned Features Audit, 1. Dead API Routes, DEAD: `/api/agent-outcomes/action-item` (POST), DEAD: `/api/campaign-comments/action-item` (POST), DEAD: `/api/campaign-comments` (GET, POST, PATCH, DELETE), ALIVE (all verified), 2. Orphaned Pages, 3. Dead Feature Modules, 4. Navigation Ghost Items, 5. Dead Admin Actions (Unused Exported Functions), … (+2 more)
- Contents summary: headings: Dead Routes & Orphaned Features Audit \| 1. Dead API Routes \| DEAD: `/api/agent-outcomes/action-item` (POST) \| DEAD: `/api/campaign-comments/action-item` (POST) \| DEAD: `/api/campaign-comments` (GET, POST, PATCH, DELETE) \| ALIVE (all verified)

## `audit/imports-deps.md`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: Markdown doc
- Construction: markdown document, frontmatter-like markdown structure
- Lines: 146
- Bytes: 5938
- Headings: Import, Dependency & Hygiene Audit, 1. Unused Imports, 2. Type-Only Imports (should use `import type`), 3. Circular Dependencies, 4. Package.json Audit, 4a. Unused Dependencies, 4b. Duplicate Dependency, 4c. Overlapping Radix Packages, 4d. All Other Dependencies: Verified Used, 5. Duplicate Utility Patterns, … (+8 more)
- Contents summary: headings: Import, Dependency & Hygiene Audit \| 1. Unused Imports \| 2. Type-Only Imports (should use `import type`) \| 3. Circular Dependencies \| 4. Package.json Audit \| 4a. Unused Dependencies

## `components.json`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: JSON config/data
- Construction: JSON configuration/data file
- Lines: 23
- Bytes: 443
- JSON shape: JSON object
- JSON keys: $schema, style, rsc, tsx, tailwind, iconLibrary, rtl, aliases, registries
- Contents summary: JSON object; keys: $schema, style, rsc, tsx, tailwind, iconLibrary, rtl, aliases, registries

## `e2e/authenticated-smoke.spec.ts`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: TypeScript module
- Construction: code module
- Lines: 253
- Bytes: 9992
- Imports (packages): @playwright/test
- Symbol details: function assertSignedOutRedirect, function signInAsAdmin, function signInWithToken, function assertAdminNavigation, function assertSettingsIsTechnicalOnly, function assertClientsOwnClientCreation, function assertCampaignDetailIsPerformanceOnly, function assertClientPortalIsCampaignsOnly, function assertRetiredRoutesRedirect, function createTemporaryUser, function deleteClerkUser, function clerkRequest, function appUrl, function rewriteUrlOrigin, function trimTrailingSlash, function slugToTitle, … (+5 more)
- Defines: assertSignedOutRedirect, signInAsAdmin, signInWithToken, assertAdminNavigation, assertSettingsIsTechnicalOnly, assertClientsOwnClientCreation, assertCampaignDetailIsPerformanceOnly, assertClientPortalIsCampaignsOnly, assertRetiredRoutesRedirect, createTemporaryUser, deleteClerkUser, clerkRequest, … (+25 more)
- Tests / describe labels: authenticated smoke, signed-out users are sent to sign in for protected pages, non-admin users cannot access the admin shell, admin and client surfaces stay narrow and usable, _
- Contents summary: tests/describes: authenticated smoke; signed-out users are sent to sign in for protected pages; non-admin users cannot access the admin shell; package imports: 1

## `eslint.config.mjs`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: JavaScript module
- Construction: code module
- Lines: 31
- Bytes: 834
- Imports (packages): eslint/config, eslint-config-next/core-web-vitals, eslint-config-next/typescript
- Exports: default
- Symbol details: const eslintConfig
- Defines: eslintConfig
- Contents summary: exports: default; package imports: 3

## `next-env.d.ts`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: TypeScript module
- Construction: code module
- Lines: 7
- Bytes: 247
- Imports (internal unresolved): .next/types/routes.d.ts
- Contents summary: internal imports: 1

## `next.config.ts`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: TypeScript module
- Construction: code module
- Lines: 32
- Bytes: 690
- Imports (packages): next, node:path
- Exports: default
- Contents summary: exports: default; package imports: 2

## `opencode.json.example`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: env/config text file
- Lines: 37
- Bytes: 994
- Contents summary: text lines: { \| "$schema": "https://opencode.ai/config.json", \| "mcp": { \| "filesystem": { \| "type": "local", \| "command": ["/usr/local/bin/npx", "-y", "@modelcontextprotocol/server-filesystem", "/Users/YOUR_USERNAME"],

## `package-lock.json`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: JSON config/data
- Construction: JSON configuration/data file
- Lines: 14971
- Bytes: 526512
- JSON shape: JSON object
- JSON keys: name, version, lockfileVersion, requires, packages
- Contents summary: JSON object; keys: name, version, lockfileVersion, requires, packages

## `package.json`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: JSON config/data
- Construction: JSON configuration/data file
- Lines: 70
- Bytes: 2840
- Imported by: src/app/api/health/route.ts
- Used by groups: src/app / api
- Route owners: src/app/api/health/route.ts
- Routes related (direct): src/app/api/health/route.ts
- Tests related: src/app/api/health/route.test.ts
- JSON shape: JSON object
- JSON keys: name, version, private, scripts, dependencies, devDependencies, overrides
- JSON scripts: dev, build, start, lint, lint:web, type-check, type-check:web, test, test:web, playwright:install, test:e2e, audit:deps, … (+8 more)
- Contents summary: JSON object; keys: name, version, private, scripts, dependencies, devDependencies, overrides; scripts: dev, build, start, lint, lint:web, type-check, type-check:web, test, test:web, playwright:install

## `playwright.config.ts`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: TypeScript module
- Construction: code module
- Lines: 37
- Bytes: 845
- Imports (packages): @playwright/test
- Exports: default
- Symbol details: const baseURL
- Defines: baseURL
- Contents summary: exports: default; package imports: 1

## `postcss.config.mjs`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: JavaScript module
- Construction: code module
- Lines: 8
- Bytes: 94
- Exports: default
- Symbol details: const config
- Defines: config
- Contents summary: exports: default

## `tsconfig.json`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: JSON config/data
- Construction: JSON configuration/data file
- Lines: 45
- Bytes: 852
- JSON shape: JSON object
- JSON keys: compilerOptions, include, exclude
- Contents summary: JSON object; keys: compilerOptions, include, exclude

## `tsconfig.tsbuildinfo`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: TypeScript build info
- Lines: 1
- Bytes: 285465
- Contents summary: text lines: {"fileNames":["./node_modules/typescript/lib/lib.es5.d.ts","./node_modules/typescript/lib/lib.es2015.d.ts","./node_modules/typescript/lib/lib.es2016.d.ts","./node_modules/typescript/lib/lib.es2017.d.ts","./node_modules/typescript/lib/lib.es2018.d.ts","./node_modules/typescript/lib/lib.es2019.d.ts","./node_…

## `vitest.config.ts`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: TypeScript module
- Construction: code module
- Lines: 34
- Bytes: 906
- Imports (packages): vitest/config, @vitejs/plugin-react, path
- Exports: default
- Contents summary: exports: default; package imports: 3

## `vitest.setup.ts`
- Status: tracked-clean
- System: root
- Group: Root Files
- Ownership: repo root
- Type: TypeScript module
- Construction: code module
- Lines: 24
- Bytes: 943
- Imports (packages): vitest, @clerk/nextjs/server
- Contents summary: package imports: 2
