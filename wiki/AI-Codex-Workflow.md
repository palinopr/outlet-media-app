---
status: canonical
last_updated: 2026-05-19
replaces:
  - docs/context/codex-workflow.md
  - AGENTS.md execution sections
---

# AI Codex Workflow

Use this page for Codex/LLM/operator workflow, branch hygiene, prompt hygiene, and browser MCP notes.

## 1. Scope threads to a single deliverable

Use one Codex thread per bugfix, feature branch, or PR review pass.

Reuse the same thread while:

- the work stays on the same branch
- the diff is still the same deliverable
- you are fixing review comments, tests, or lint on that same work

Start a new thread when:

- the branch changes
- the task changes
- the thread accumulates stale context
- the previous task has already merged

## 2. Stay in one checkout

Work from the main checkout by default.

Keep one active Codex thread and one active branch per task.

Do not let two Codex threads edit the same files at once.

Codex-created branches should use the `codex/` prefix.

## 3. Keep prompts narrow

For larger work:

- start with `/plan`
- name the relevant paths or subsystem
- describe the exact outcome wanted
- include short `done when` acceptance criteria

If a conversation changes direction, start a new thread instead of carrying stale context forward.

## 4. Choose the surface explicitly

The active product surface is the web app. If the user does not specify a surface, default to `web` and work in:

- `src/app/`
- `src/features/`
- `src/components/`
- `src/lib/`
- required Supabase migrations

The old Discord/autonomous runtime is retired. Do not recreate it by default.

## 5. Keep repo guidance layered

Root `AGENTS.md` carries bootstrap rules only and points to this wiki.

Deeper `AGENTS.md` files should narrow behavior for active areas such as:

- `src/app/`
- `src/features/`
- `supabase/`

Repo-local Codex/operator skills belong in a dedicated repo skill directory only when that directory is actually checked in. Durable architecture rules belong in this wiki. Execution sequencing should stay concise in the active issue, PR, or task thread; do not reintroduce broad historical plan folders by default.

## 6. Verify before handoff

Before handing work back:

- run `npm run type-check` for app changes
- run `npm run lint` or targeted lint for touched files
- run targeted tests when the path already has coverage or the behavior is risky
- run `npm run build` when code or config changes affect the Next.js app
- use `/review` or the review pane before merge when available

For scripted or CI-oriented runs, prefer `codex exec` or the GitHub workflow in `.github/workflows/codex-pr-review.yml`.

Do not use Playwright, screenshots, browser reports, or generated E2E artifacts as the default verification path. Add browser automation only when a specific auth-critical browser behavior cannot be verified with focused tests.

## 7. Know when to stop building

Do not keep adding breadth just because the architecture can support it.

Preferred sequence:

- build shared primitives once
- wire one complete vertical slice
- stop adding new scope
- stabilize, test, and fix
- only then clone the pattern into another pod, platform, or surface

Switch from building to testing when any of these become true:

- the current slice has a real end-to-end path from intake to outcome
- the diff already spans schema, runtime, and user-visible surface changes
- an executor, publisher, scheduler, approval, or other live-side-effect path is now wired
- you are tempted to add a second platform or second pod before proving the first one

Testing after that point should focus on:

- happy-path execution
- approval gating
- concurrency/resource locks
- idempotency and replay safety
- auditability in `system_events`, ledgers, or visible status surfaces
- failure handling and operator recovery steps

## 8. Verify technical assumptions early

Do not guess on current library, framework, SDK, or API behavior.

Preferred research order when there is meaningful uncertainty:

1. Context7 MCP for official/current library and framework docs
2. GitHub MCP for upstream repository implementation details, examples, and source-level behavior
3. Another primary source only if MCP tools are unavailable or insufficient

If you did not verify an unstable technical assumption, do not present it as fact.

## 9. Recommended personal defaults

Current working defaults for `~/.codex/config.toml`:

- default model: `gpt-5.3-codex`
- default reasoning: `medium`
- use `high` for tricky refactors, incident debugging, or architecture-heavy work
- use `xhigh` only for unusually hard long-horizon tasks

Example baseline:

```toml
model = "gpt-5.3-codex"
model_reasoning_effort = "medium"
personality = "pragmatic"

[profiles.deep]
model = "gpt-5.4"
model_reasoning_effort = "high"
personality = "pragmatic"

[profiles.fast]
model = "gpt-5.4"
model_reasoning_effort = "medium"
personality = "pragmatic"

[profiles.review]
model = "gpt-5.3-codex"
model_reasoning_effort = "medium"
personality = "pragmatic"
```

## 10. Browser MCP notes

Do not add `chrome-devtools-mcp` to `~/.codex/config.toml` for normal browser work. The legacy `mcp_servers.chrome-devtools` wrapper was removed on 2026-05-11 because it collided with the bundled Chrome plugin path and failed against the real Chrome profile.

For `@chrome` work, use the bundled `chrome@openai-bundled` plugin. If browser automation fails, debug that plugin path instead of reintroducing a separate DevTools MCP server.

Use this cleanup when the desktop app gets into a bad MCP state:

```bash
pkill -f '@playwright/mcp|playwright-chrome-clone|mcp-discord|context7-mcp|mcp-server-supabase|mcpdoc'
```

If a stale `chrome-devtools-mcp` process is already running from older config, kill that process directly before restarting Codex, but do not add the MCP server back to the config.

When running local Next.js dev with Clerk and a real browser session:

- prefer `npm run dev -- --hostname localhost --port <port>` over `127.0.0.1`
- Next 16 can proxy Clerk auth rewrites to `http://localhost:<port>` during development
- if the server was started on `127.0.0.1`, local `/sign-in` can fail with `Failed to proxy ... socket hang up` or an `Internal Server Error`
