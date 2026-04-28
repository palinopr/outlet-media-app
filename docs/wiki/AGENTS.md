# Outlet Repo Wiki Schema

This folder is a persistent LLM-maintained wiki for understanding the Outlet repo.

## Purpose

Primary job right now:
- document the repo completely
- describe what every file contains at a high level
- map how folders, routes, modules, docs, tests, and migrations fit together
- make it easy for a future coder to read the wiki first and then inspect the source with context

Secondary job later:
- readers may notice mismatches or cleanup opportunities from the documentation
- but the catalog itself should stay descriptive first, not judgment-first

The goal is a maintained understanding layer between the repo and future edits.

## Source layers

### Raw sources
The raw sources are the repo files themselves:
- `AGENTS.md`
- `README.md`
- `docs/context/**`
- `src/**`
- `agent/**`
- `supabase/**`
- `__tests__/**`

Do not treat wiki pages as the source of truth when a code or context file says otherwise. The wiki is a compiled understanding layer.

### Wiki pages
Use `pages/` for curated knowledge:
- `catalog/` — generated file-by-file documentation pages
- `overview/` — high-level repo understanding
- `inventory/` — route maps, feature maps, key files, ownership maps
- `audits/` — optional secondary pages for mismatches or cleanup notes

### Catalog field standard
The generated catalog should document each file with as many of these as apply:
- path
- git status
- system
- group
- ownership
- file type
- construction style
- route or route context
- line count
- byte size
- internal imports
- unresolved internal imports when present
- package imports
- imported-by cross-links
- dependency groups / used-by groups
- feature-module label when applicable
- route-owner cross-links
- test cross-links
- exports
- symbol details for key code files
- defined symbols
- route handlers
- test titles / describe labels
- markdown headings
- JSON keys / scripts / shape
- SQL objects
- concise contents summary

The generated catalog should also maintain these higher-level pages:
- `pages/catalog/group-dependencies.md`
- `pages/catalog/feature-dependencies.md`
- `pages/catalog/route-stacks.md`
- `pages/catalog/route-profiles.md`
- `pages/catalog/feature-profiles.md`
- `pages/catalog/business-rules.md`
- `pages/catalog/table-profiles.md`
- `pages/catalog/service-boundaries.md`
- `pages/catalog/onboarding-guides.md`
- `pages/catalog/key-file-symbols.md`
- `pages/catalog/auth-access.md`
- `pages/catalog/workflow-events.md`
- `pages/catalog/workflow-lifecycles.md`
- `pages/catalog/mutation-surfaces.md`
- `pages/catalog/env-integrations.md`
- `pages/catalog/database-to-code.md`
- `pages/catalog/supabase-schema.md`
- `pages/catalog/api-contracts.md`
- `pages/catalog/component-trees.md`
- `pages/catalog/test-coverage.md`

## Required workflow

### Ingest
When reading new code or docs:
1. read the source files
2. update the generated catalog when file structure changes by running `python3 docs/wiki/tools/generate_repo_catalog.py`
3. update or create the relevant overview/inventory pages when understanding improves
4. add links between related pages
5. update `index.md`
6. append an entry to `log.md`

### Query
When answering repo questions:
1. read `index.md` first
2. use `pages/catalog/manifest.md` to find the relevant folder page
3. follow the relevant overview/inventory pages for higher-level context
4. verify important claims against source files before making changes
5. record durable findings back into the wiki when useful

### Lint
Periodically check for:
- stale wiki claims
- missing files in the generated catalog
- folder pages that no longer match the current working tree
- overview pages that drift from the documented source files

## Important scope rule

Do not jump to "dead", "wrong", or "broken" in the main catalog pages.

The main catalog should answer:
- what files exist
- what each file contains
- how the repo is structured
- which files are modified or untracked in the current working tree

If deeper evaluation is needed, keep it in separate secondary pages instead of mixing judgment into the file catalog.

## Integration with Claude Code

The root `AGENTS.md` contains a "Wiki Maintenance" section that instructs Claude Code to:
- Read `docs/wiki/index.md` at the start of sessions involving code changes
- Append to `log.md` after completing meaningful work
- Update overview/inventory pages when structure changes
- Run the full catalog generator only after structural changes

This wiki schema and those root instructions should stay aligned. If you update the workflow here, update the root `AGENTS.md` section too.

## Writing style

Be concise and factual.
Prefer links, path references, and explicit evidence over vague summaries.
When something is only a hypothesis, label it clearly.
