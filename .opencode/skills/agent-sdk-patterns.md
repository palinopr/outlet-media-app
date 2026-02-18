---
name: agent-sdk-patterns
description: Architecture guidance and implementation patterns for building autonomous AI agents using the feedback loop pattern. Use when designing agent systems, implementing tool selection logic, setting up verification loops, or working with the Claude Agent SDK or similar frameworks.
---

# Agent SDK Patterns

Architecture guidance for building autonomous AI agents using feedback loop patterns.

## Core Architecture: Feedback Loop Pattern

Every agent follows this cycle:

1. **Gather Context** → filesystem navigation, subagents, tools
2. **Take Action** → tools, bash, code generation, external APIs
3. **Verify Work** → rules-based, visual, LLM-as-judge
4. **Repeat** → iterate until completion

This pattern applies whether building a simple script or a complex multi-agent system.

## Execution Mechanisms (Priority Order)

Choose mechanisms based on task requirements:

1. **Custom Tools** → Primary workflows (appear prominently in context)
2. **Bash** → Flexible one-off operations
3. **Code Generation** → Complex, reusable outputs (prefer TypeScript for linting feedback)
4. **MCP** → Pre-built external integrations (Slack, GitHub, databases)

**Rule**: Use tools for repeatable operations, bash for exploration, code generation when you need structured output that can be validated.

## Quick Start Patterns

### Python: Basic Query

```python
from claude_agent_sdk import query

result = await query(
    model="claude-sonnet-4-5",
    system_prompt="You are a helpful coding assistant.",
    user_message="List files in current directory",
    working_dir=".",
)
print(result.final_message)
```

### TypeScript: Session Management

```typescript
import { ClaudeSdkClient } from '@anthropic-ai/agent-sdk';

const client = new ClaudeSdkClient({ apiKey: process.env.ANTHROPIC_API_KEY });

const result = await client.query({
  model: 'claude-sonnet-4-5',
  systemPrompt: 'You are a helpful coding assistant.',
  userMessage: 'List files in current directory',
  workingDir: '.',
});
```

## Key Components

### 1. Custom Tools (In-Process)

In-process tools with no subprocess overhead — the primary building block for agents.

**Python:**
```python
from claude_agent_sdk.mcp import tool, create_sdk_mcp_server

@tool(
    name="calculator",
    description="Perform calculations",
    input_schema={"expression": str}
)
async def calculator(args):
    result = eval(args["expression"])  # Use safe eval in production
    return {"content": [{"type": "text", "text": str(result)}]}

server = create_sdk_mcp_server(name="math", tools=[calculator])
```

**Benefits over external MCP**: Better performance, easier debugging, shared memory space, no IPC overhead.

### 2. Subagents

Isolated agents with separate context windows and specialised capabilities.

**When to use:**
- Parallel processing of independent tasks
- Context isolation (prevent one task from bloating main context)
- Specialised agents with different tools/models

```python
options = ClaudeAgentOptions(
    subagent_definitions={
        "researcher": {
            "tools": ["read", "grep", "glob"],
            "model": "claude-haiku-4",
            "description": "Fast research agent"
        }
    }
)
```

### 3. Lifecycle Hooks

Intercept and modify agent behaviour at specific points.

**Available hooks:**
- `PreToolUse` → Validate/modify/deny tool calls before execution
- `PostToolUse` → Process/log/modify tool results
- `Stop` → Handle completion events

**Validation example:**
```python
async def validate_command(input_data, tool_use_id, context):
    if "rm -rf" in input_data["tool_input"].get("command", ""):
        return {
            "hookSpecificOutput": {
                "permissionDecision": "deny",
                "permissionDecisionReason": "Dangerous command blocked"
            }
        }
```

### 4. Context Management

**Agentic Search (Preferred)**:
Use bash + filesystem navigation (grep, ls, tail) before reaching for semantic search. Simpler and more reliable.

**Folder Structure as Context Engineering**:
Organise files intentionally — directory structure is visible to the agent and influences its understanding.

## Verification Patterns

### Rules-Based (Preferred)
Explicit validation enables self-correction:
```python
# In PostToolUse hook
if tool_name == "write":
    lint_result = run_linter(tool_output)
    if lint_result.has_errors:
        return {"continue": True}  # Let agent fix errors
```

### Visual Feedback
For UI tasks, screenshot and re-evaluate:
```python
@tool(name="check_ui", description="Verify UI matches requirements")
async def check_ui(args):
    screenshot = take_screenshot(args["url"])
    return {"content": [{"type": "image", "source": screenshot}]}
```

### LLM-as-Judge
Only for fuzzy criteria where rules don't work (higher latency):
```python
judge_result = await secondary_model.evaluate(
    criteria="Does output match tone guidelines?",
    output=agent_output
)
```

## Tool vs Bash vs Code Generation

**Use Custom Tools when:**
- Operation repeats frequently
- Need structured input/output validation
- Want prominent placement in agent context
- Require error handling and retry logic

**Use Bash when:**
- One-off exploration or debugging
- System operations (git, file management)
- Flexible scripting without formal structure

**Use Code Generation when:**
- Need structured, reusable output
- Can validate with linting/compilation
- TypeScript preferred for feedback quality

## Session Management

### Resuming Sessions

```python
# First run
result1 = await query(user_message="Create a file", working_dir=".")

# Resume with new message
result2 = await query(
    user_message="Now modify it",
    working_dir=".",
    session_id=result1.session_id
)
```

## Budget Control

Set USD spending limits:
```python
options = ClaudeAgentOptions(budget={"usd": 5.00})
```

## Testing Patterns

### Mock Tools for Testing

```python
import pytest
from unittest.mock import AsyncMock

@pytest.fixture
def mock_tool():
    return AsyncMock(return_value={
        "content": [{"type": "text", "text": "mocked"}]
    })
```

### Integration Testing with Isolation

```python
import tempfile
import os

async def test_file_operations():
    with tempfile.TemporaryDirectory() as tmpdir:
        result = await query(
            user_message="Create test.txt with content 'hello'",
            working_dir=tmpdir,
            permission_mode="bypassPermissions"
        )
        assert os.path.exists(f"{tmpdir}/test.txt")
```

## Common Pitfalls

1. **Tool not available** — Check MCP tool naming: `mcp__{server_name}__{tool_name}`
2. **Context overflow** — Use subagents for isolation or let automatic compaction handle it
3. **Tool execution failures** — Return structured error messages:
   ```python
   return {"content": [{"type": "text", "text": "Error: Invalid input. Expected format: ...", "isError": True}]}
   ```
4. **External MCP not connecting** — Verify server is executable and check logs

## Performance Optimisation

1. **Use smaller/faster models for simple tasks** — significantly cheaper and faster for research/exploration
2. **SDK MCP over external** — No subprocess overhead
3. **Batch operations** — Combine file operations when possible
4. **Set turn limits** — Prevent infinite loops (`turn_limit` parameter)
5. **Monitor token usage** — Use budget controls in production

## Security Best Practices

1. **Always validate tool inputs** — Never trust unchecked input
2. **Restrict filesystem access** — Limit scope to necessary directories
3. **Sandbox external MCP servers** — Isolate third-party tools
4. **Set budgets** — Prevent runaway costs
5. **Log all tool uses** — Audit trail via PostToolUse hooks
6. **Never hardcode API keys** — Use environment variables

## Key Principles

1. **Folder structure is context engineering** — Organise intentionally
2. **Rules-based feedback enables self-correction** — Add linting and validation
3. **Start with agentic search** — Bash navigation before semantic search
4. **Tools are primary, bash is secondary** — Use tools for repeatable operations
5. **Verification closes the loop** — Always validate agent work
6. **Use subagents for isolation** — Prevent context bloat and enable parallelism
