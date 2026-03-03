# Global Instructions

> Project instructions for Claude Code. Agent patterns in `.opencode/agents/`.

## Communication

<WRITING_STYLE>
- Never use overused AI phrases: comprehensive, robust, best-in-class, feature-rich, production-ready, enterprise-grade, seamlessly, smoking gun
- No smart quotes, em dashes, or emojis unless requested
- No sycophancy, marketing speak, or unnecessary summary paragraphs
- Write as an engineer explaining to a colleague, not someone selling a product
- Be direct, concise and specific. If a sentence adds no value, delete it
- Active voice, concrete examples
- Final check: does it sound like a person or Wikipedia crossed with a press release?
</WRITING_STYLE>

<DOCUMENTATION>
- Keep signal-to-noise ratio high - preserve domain insights, omit filler and fluff
- Start with what it does, not why it's amazing
- Configuration and examples over feature lists
- "Setup" not "Getting Started with emojis". "Exports to PDF" not "Seamlessly transforms content"
- Do NOT create new markdown files unless explicitly requested - update existing README.md or keep notes in conversation
- Code comments: explain "why" not "what", only for complex logic. No process comments ("improved", "fixed", "enhanced")
</DOCUMENTATION>

## Architecture and Design

<DESIGN_PRINCIPLES>
- Favour simplicity - start with working MVP, iterate. Abstraction only when a pattern repeats 3+ times
- Follow SOLID principles - small interfaces, composition, depend on abstractions
- Use appropriate design patterns (repository, DI, circuit breaker, strategy, observer, factory) based on context
- For greenfield projects: provide a single Makefile entrypoint to lint, test, version, build and run
</DESIGN_PRINCIPLES>

<CODE_QUALITY>
- Functions: max 50 lines (split if larger)
- Files: max 700 lines (split if larger)
- Cyclomatic complexity: under 10
- Tests: run quickly (seconds), no external service dependencies
- Build time: optimise if over 1 minute
- Coverage: 80% minimum for new code
</CODE_QUALITY>

<CONFIGURATION>
- Use .env or config files as single source of truth, ensure .env is gitignored
- Provide .env.example with all required variables
- Validate environment variables on startup
</CONFIGURATION>

## Security and Error Handling

<SECURITY>
- Never hardcode credentials, tokens, or secrets. Never commit sensitive data
- Never trust user input - validate and sanitise all inputs
- Parameterised queries only - never string concatenation for SQL
- Never expose internal errors or system details to end users
- Follow principle of least privilege. Rate-limit APIs. Keep dependencies updated
</SECURITY>

<ERROR_HANDLING>
- Structured logging (JSON) with correlation IDs. Log levels: ERROR, WARN, INFO, DEBUG
- Meaningful errors for developers, safe errors for end users. Never log sensitive data
- Graceful degradation over complete failure. Retry with exponential backoff for transient failures
</ERROR_HANDLING>

## Testing

<TESTING>
- Test-first for bugs: write failing test, fix, verify, check no regressions
- Descriptive test names. Arrange-Act-Assert pattern. Table-driven tests for multiple cases
- One assertion per test where practical. Test edge cases and error paths
- Mock external dependencies. Group tests in `test/` or `tests/`
</TESTING>

## Language Preferences

<TYPESCRIPT>
- Prefer TypeScript over JavaScript. Strict mode always
- Avoid `any` (use `unknown`), prefer discriminated unions over enums, `readonly` for immutables
- Const by default, async/await over promise chains, optional chaining and nullish coalescing
- Never hardcode styles - use theme/config
</TYPESCRIPT>

<PYTHON>
- Python 3.12+ features. Type hints for all functions
- Dataclasses for data structures. Pathlib over os.path. f-strings
</PYTHON>

<GOLANG>
- Use latest Go version (verify, don't assume). Build with `-ldflags="-s -w"`
- Idiomatic Go: explicit error handling, early returns, small interfaces, composition, defer for cleanup, table-driven tests
</GOLANG>

<BASH>
- `#!/usr/bin/env bash` with `set -euo pipefail`
- Quote all variable expansions. Use `[[ ]]` for conditionals. Trap for error handling
</BASH>

## Tool Usage

<TOOLS>
- Use purpose-built tools over manual approaches (e.g. search tools for documentation rather than guessing)
- If stuck, use available tools to look up documentation or search the web - don't make things up
- Use MCP tools (dev-tools, github, playwright, memory, n8n) effectively
</TOOLS>

## Diagramming

<MERMAID>
- You MUST NOT use round brackets ( ) within item labels or descriptions
- Use `<br>` instead of `\n` for line breaks
- Mermaid does not support unordered lists within item labels
- Apply this colour theme unless specified otherwise:
```
classDef inputOutput fill:#F5F5F5,stroke:#9E9E9E,color:#616161
classDef llm fill:#E8EAF6,stroke:#7986CB,color:#3F51B5
classDef components fill:#F3E5F5,stroke:#BA68C8,color:#8E24AA
classDef process fill:#E0F2F1,stroke:#4DB6AC,color:#00897B
classDef stop fill:#FFEBEE,stroke:#E57373,color:#D32F2F
classDef data fill:#E3F2FD,stroke:#64B5F6,color:#1976D2
classDef decision fill:#FFF3E0,stroke:#FFB74D,color:#F57C00
classDef storage fill:#F1F8E9,stroke:#9CCC65,color:#689F38
classDef api fill:#FFF9C4,stroke:#FDD835,color:#F9A825
classDef error fill:#FFCDD2,stroke:#EF5350,color:#C62828
```
</MERMAID>

## Self-Review Protocol

After implementing a list of changes, perform a critical self-review pass before reporting completion, fixing any issues you find.

## Deployment

<DEPLOYMENT>
**Railway is the production host. It does NOT auto-deploy from git push — you must trigger it manually every time.**

After every `git push`, run:
```bash
cd /Users/jaimeortiz/outlet-media-app && railway up --detach
```

**Never declare a task complete without triggering Railway.** The app will be stale until this runs.

- Railway project: `outlet-media-app` (ID: `25cb843d-b4b5-4fe2-aa2d-754f6175e37d`)
- Service ID: `e08125fc-7385-4121-a42f-1d381181de28`
- Live URL: `https://outlet-media-app-production.up.railway.app`
- CLI: `/opt/homebrew/bin/railway` — authenticated as `jaime@outletmedia.net`
</DEPLOYMENT>

## Rules

<RULES>
**Before declaring any task complete, verify**: linting passes, code builds, all tests pass (new + existing), no debug statements remain, error handling in place.

- Never hardcode credentials, unique identifiers, or localhost URLs
- Never give time estimates for tasks
- Never add process comments ("improved function", "optimised version", "# FIX:")
- Never implement placeholder or mocked functionality unless explicitly instructed
- **You must not state something is fixed unless you have confirmed it by testing, measuring output, or building the application**
- Edit only what's necessary - make precise, minimal changes unless instructed otherwise
- Implement requirements in full or discuss with the user why you can't - don't defer work
- When contributing to open source: match existing code style, read CONTRIBUTING.md first, no placeholder comments
</RULES>

## Session Handoff (Landing the Plane)

**When ending a work session**, complete ALL steps below. Work is NOT done until it is committed and any open threads are captured as GitHub issues.

**MANDATORY WORKFLOW:**

1. **File GitHub issues for unfinished work** - One issue per distinct task. Include file paths and current state so the next session can pick up without re-reading history.
2. **Run quality gates** (if code changed) - Linting, build, tests must pass before stopping.
3. **Commit and push** - All changes committed with a clear message:
   ```bash
   git add -A
   git commit -m "type: description"
   git push
   ```
4. **Update Memory MCP** - Persist any domain decisions, architecture choices, or context that would take more than 2 minutes to re-derive next session.
5. **Provide handoff summary** - What was done, what issues were filed, what the next action is.

**CRITICAL RULES:**
- Never say "ready to continue when you are" and stop - capture the state first.
- GitHub issues are the source of truth for remaining work, not chat history.
- Memory MCP observations should be facts, not summaries of conversation.

## Available Agent Patterns

Reference patterns in `.opencode/agents/`:

| Agent | Purpose |
|-------|---------|
| `software-research-assistant.md` | Technical research workflow for libraries, frameworks, and APIs |
| `code-reviewer.md` | Thorough code review: quality, security, CI/CD, and development workflow |
| `research-agent-patterns.md` | Orchestrator-subagent patterns: query classification, delegation, synthesis |
| `citations-agent.md` | Post-processing agent that adds inline citations to research reports |
| `codebase-usage-researcher.md` | Analyse a codebase and generate AI-optimised usage documentation |
| `docs-quality-reviewer.md` | Audit and improve project documentation quality and structure |
| `file-length-auditor.md` | Scan codebase for files over 700 lines, provide refactoring recommendations |
| `peer-reviewer.md` | Use an external LLM CLI to peer-review complex implementations for quality assurance |
| `tech-lead-orchestrator.md` | Orchestrate multi-step tasks across specialist agents - use for any complex feature |
| `nextjs-expert.md` | Next.js 15 App Router - routes, server components, API routes, auth, dashboard UI |
| `ticketmaster-scraper.md` | Ticketmaster API - event data, TM1 numbers, venue and sales info |
| `meta-ads-manager.md` | Meta Marketing API - Facebook/Instagram campaign creation and performance tracking |

---

## AI Team Configuration

**Detected Stack:**
- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui
- Backend: Next.js API Routes (Server Actions)
- External APIs: Ticketmaster API, Meta Marketing API
- AI: Claude Code agents for autonomous campaign management

| Task | Agent | Notes |
|------|-------|-------|
| Multi-step feature or architectural decision | `@tech-lead-orchestrator` | Always start here for complex tasks |
| Next.js routes, components, API routes | `@nextjs-expert` | Fetches latest Next.js docs before implementing |
| Ticketmaster data, TM1 numbers, event sync | `@ticketmaster-scraper` | All TM API integration goes through this agent |
| Meta ads, campaign creation, performance | `@meta-ads-manager` | Facebook/Instagram ad automation |
| Code review after any significant change | `@code-reviewer` | Run after every feature implementation |
| Research libraries, APIs, or patterns | `@software-research-assistant` | Use before implementing unfamiliar APIs |
