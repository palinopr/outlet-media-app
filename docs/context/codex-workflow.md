# Codex Workflow

## 1. Scope Threads To A Single Deliverable

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

## 2. Stay In One Checkout

Work from the main checkout by default.

Keep one active Codex thread and one active branch per task.

Do not let two Codex threads edit the same files at once.

Codex-created branches should use the `codex/` prefix.

## 3. Keep Prompts Narrow

For larger work:
- start with `/plan`
- name the relevant paths or subsystem
- describe the exact outcome you want
- include short `done when` acceptance criteria

If a conversation changes direction, start a new thread instead of carrying old context forward.

## 3a. Choose The Surface Explicitly

The active product surface is the web app. If the user does not specify a surface, default to `web` and work in `src/app/`, `src/features/`, `src/components/`, `src/lib/`, and any required Supabase migrations.

The old Discord/autonomous runtime has been retired. Do not recreate it by default.

## 4. Keep Repo Guidance Layered

Root `AGENTS.md` carries repo-wide rules.

Deeper `AGENTS.md` files narrow behavior for active areas such as:
- `src/app/`
- `src/features/`
- `supabase/`

If repo-local Codex/operator skills are introduced later, keep them in one dedicated repo skill directory so Codex can load specialized guidance only when it is needed.

Do not keep duplicate copies of the same operator skill under multiple local skill roots.

Repo-local Codex/operator skills belong in a dedicated repo skill directory only when that directory is actually checked in.
Durable architecture rules belong in `docs/context/`.
Execution sequencing should stay concise in the active issue, PR, or task thread; do not reintroduce broad historical plan folders by default.

## 5. Verify Before Handoff

Before handing work back:
- run `npm run type-check` for app changes
- run `npm run lint` or targeted lint for touched files
- run targeted tests when the path already has coverage or the behavior is risky
- run `npm run build` when code or config changes affect the Next.js app
- use `/review` or the review pane before merge

For scripted or CI-oriented runs, prefer `codex exec` or the GitHub workflow in `.github/workflows/codex-pr-review.yml`.

Do not use Playwright, screenshots, browser reports, or generated E2E artifacts as the default verification path. Add browser automation only when the specific change touches auth-critical browser behavior that focused tests cannot cover.

## 5a. Know When To Stop Building

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

## 5b. Verify Technical Assumptions Early

Do not guess on current library, framework, SDK, or API behavior.

Preferred research order when there is any meaningful uncertainty:
1. Context7 MCP for official/current library and framework docs
2. GitHub MCP for upstream repository implementation details, examples, and source-level behavior
3. Another primary source only if the MCP tools are unavailable or insufficient

If you did not verify an unstable technical assumption, do not present it as fact.

## 6. Recommended Personal Defaults

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

## 7. Browser MCP Notes

For `chrome-devtools-mcp`, prefer the official direct setup:

```toml
[mcp_servers.chrome-devtools]
command = "npx"
args = ["-y", "chrome-devtools-mcp@latest", "--autoConnect"]
```

When using Codex Desktop against a real Chrome session:
- enable Chrome remote debugging in `chrome://inspect/#remote-debugging`
- verify Chrome shows `Server running at: 127.0.0.1:9222` before blaming MCP config
- if Codex reports `ECONNREFUSED 127.0.0.1:9222`, Chrome is not exposing the debug server yet
- if Codex reports `Transport closed` or long `tools/call` timeouts, check for duplicate `chrome-devtools-mcp` children under one `codex app-server`
- before retrying, kill stale browser MCP helpers rather than stacking more wrapper scripts or profile hacks

Use this cleanup when the desktop app gets into a bad browser MCP state:

```bash
pkill -f 'chrome-devtools-mcp|@playwright/mcp|playwright-chrome-clone|mcp-discord|context7-mcp|mcp-server-supabase|mcpdoc'
```

For browser debugging, stabilize one MCP path first:
- get `chrome-devtools` healthy before adding another browser automation path
- do not mix browser automation experiments with a broken DevTools session in the same Codex run unless you are explicitly debugging MCP behavior itself

When running local Next.js dev with Clerk and a real browser session:
- prefer `npm run dev -- --hostname localhost --port <port>` over `127.0.0.1`
- Next 16 can proxy Clerk auth rewrites to `http://localhost:<port>` during development
- if the server was started on `127.0.0.1`, local `/sign-in` can fail with `Failed to proxy ... socket hang up` or an `Internal Server Error`
