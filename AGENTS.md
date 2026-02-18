# Global Instructions

> Adapted from [sammcj/agentic-coding](https://github.com/sammcj/agentic-coding), [anthropics/skills](https://github.com/anthropics/skills), and [anthropics/claude-cookbooks](https://github.com/anthropics/claude-cookbooks) for Claude Code.
> Skills and reference docs are in `.Claude/skills/`, commands in `.Claude/commands/`, agents in `.Claude/agents/`.

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
- See `.opencode/skills/testing-anti-patterns.md` for common mistakes to avoid
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
- When stuck on persistent problems, follow the systematic debugging methodology in `.Claude/skills/systematic-debugging.md`
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

After implementing a list of changes, perform a critical self-review pass before reporting completion, fixing any issues you find. See `.Claude/commands/self-review.md` for the full protocol.

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
- If stuck on a persistent problem after multiple attempts, follow the systematic debugging methodology in `.Claude/skills/systematic-debugging.md`
- When contributing to open source: match existing code style, read CONTRIBUTING.md first, no placeholder comments
</RULES>

## Session Handoff (Landing the Plane)

**When ending a work session**, complete ALL steps below. Work is NOT done until it is committed and any open threads are captured as GitHub issues.

**MANDATORY WORKFLOW:**

1. **File GitHub issues for unfinished work** - Use the `mcp_github_create_issue` tool. One issue per distinct task. Include file paths and current state so the next session can pick up without re-reading history.
2. **Run quality gates** (if code changed) - Linting, build, tests must pass before stopping.
3. **Commit and push** - All changes committed with a clear message. If the repo has a remote:
   ```bash
   git add -A
   git commit -m "type: description"
   git push
   ```
4. **Update Memory MCP** - Use `mcp_memory_create_entities` or `mcp_memory_add_observations` to persist any domain decisions, architecture choices, or context that would take more than 2 minutes to re-derive next session.
5. **Provide handoff summary** - Tell the user: what was done, what issues were filed, what the next action is.

**CRITICAL RULES:**
- Never say "ready to continue when you are" and stop - capture the state first.
- GitHub issues are the source of truth for remaining work, not chat history.
- Memory MCP observations should be facts, not summaries of conversation.

## Available Skills Reference

The following skill documents are available in `.Claude/skills/` for reference during tasks:

| Skill | When to Use |
|-------|-------------|
| `.Claude/skills/systematic-debugging.md` | Persistent bugs after multiple failed fix attempts |
| `.Claude/skills/creating-development-plans.md` | Creating structured dev plans with phased task breakdowns |
| `.Claude/skills/code-simplification.md` | Reviewing and refactoring code for simplicity |
| `.Claude/skills/code-review.md` | Self-review after completing complex tasks |
| `.Claude/skills/critical-thinking.md` | Analysing written content, arguments, and claims |
| `.Claude/skills/prompt-enhancer.md` | Improving prompt quality for AI systems |
| `.Claude/skills/testing-anti-patterns.md` | Writing or changing tests, avoiding common test mistakes |
| `.Claude/skills/analyse-design.md` | Reverse-engineering UI design systems from code |
| `.Claude/skills/frontend-design.md` | Building distinctive, production-grade web UIs and components |
| `.Claude/skills/mcp-builder.md` | Creating MCP servers in TypeScript or Python |
| `.Claude/skills/pdf-processing.md` | Reading, creating, merging, splitting, or OCR-ing PDF files |
| `.Claude/skills/xlsx-processing.md` | Creating, editing, or analysing Excel/spreadsheet files |
| `.Claude/skills/docx-processing.md` | Creating, editing, or manipulating Word documents |
| `.Claude/skills/webapp-testing.md` | Testing local web applications with Playwright |
| `.Claude/skills/doc-coauthoring.md` | Structured workflow for collaborative document creation |
| `.Claude/skills/canvas-design.md` | Creating visual art/posters as PDF or PNG using design philosophy |
| `.Claude/skills/skill-creator.md` | Creating or updating instruction documents for repeatable tasks |
| `.Claude/skills/pptx-processing.md` | Creating, editing, or styling PowerPoint presentations |
| `.Claude/skills/algorithmic-art.md` | Generative art with p5.js, seeded randomness, interactive controls |
| `.Claude/skills/slack-gif-creator.md` | Creating animated GIFs optimised for Slack |
| `.Claude/skills/web-artifacts-builder.md` | Building complex React + Tailwind + shadcn/ui web applications |
| `.Claude/skills/agent-skills-spec.md` | Reference spec for the Agent Skills format |
| `.Claude/skills/authoring-agents-md.md` | Creating and maintaining AGENTS.md project memory files effectively |
| `.Claude/skills/diataxis-documentation.md` | Applying the Diataxis framework to create or improve technical documentation |
| `.Claude/skills/shell-scripting.md` | Writing reliable, maintainable bash scripts with defensive programming |
| `.Claude/skills/go-testing.md` | Applying current Go testing best practices |
| `.Claude/skills/swift-best-practices.md` | Modern Swift 6+ for iOS/macOS: async/await, actors, MainActor, Sendable |
| `.Claude/skills/deepeval.md` | Testing LLM applications with the DeepEval pytest-based framework |
| `.Claude/skills/extract-wisdom.md` | Extracting insights and actionable takeaways from YouTube, articles, or text files |
| `.Claude/skills/excalidraw-diagrams.md` | Creating Excalidraw diagrams as files or inline previews |
| `.Claude/skills/aws-strands-agentcore.md` | AWS Strands Agents SDK and Amazon Bedrock AgentCore architecture and patterns |
| `.Claude/skills/agent-sdk-patterns.md` | Feedback loop architecture, tool selection, and verification patterns for AI agents |

## Available Command Templates

Templates in `.Claude/commands/`:

| Command | Purpose |
|---------|---------|
| `create-development-plan.md` | Full prompt template for creating tiered dev plans |
| `self-review.md` | Quick self-review checklist |
| `review-pr.md` | Review an open pull request and optionally post the review to GitHub |
| `review-pr-ci.md` | Review a pull request and post the review automatically (CI/automated use) |
| `review-issue.md` | Review and respond to a GitHub issue |
| `link-review.md` | Check links in changed files for quality and security issues |
| `review-development-plan.md` | Review a development plan for quality, structure, and completeness |
| `create-skill.md` | Guided assistant for creating new skill files |
| `create-command.md` | Create a new custom command file with proper structure |
| `go-unit-testing.md` | Go unit testing best practices reference (2024-2025) |

## Available Agent Patterns

Reference patterns in `.Claude/agents/`:

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
