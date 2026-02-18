# MCP Server Development Guide

Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. Use when building MCP servers to integrate external APIs or services, whether in Python (FastMCP) or TypeScript (MCP SDK).

## High-Level Workflow

### Phase 1: Deep Research and Planning

#### Understand Modern MCP Design

**API Coverage vs. Workflow Tools:**
Balance comprehensive API endpoint coverage with specialised workflow tools. Workflow tools can be more convenient for specific tasks, while comprehensive coverage gives agents flexibility to compose operations. When uncertain, prioritise comprehensive API coverage.

**Tool Naming and Discoverability:**
Clear, descriptive tool names help agents find the right tools quickly. Use consistent prefixes (e.g., `github_create_issue`, `github_list_repos`) and action-oriented naming.

**Context Management:**
Agents benefit from concise tool descriptions and the ability to filter/paginate results. Design tools that return focused, relevant data.

**Actionable Error Messages:**
Error messages should guide agents toward solutions with specific suggestions and next steps.

#### Study MCP Protocol Documentation

Start with the sitemap: `https://modelcontextprotocol.io/sitemap.xml`

Fetch specific pages with `.md` suffix for markdown format (e.g., `https://modelcontextprotocol.io/specification/draft.md`).

Key pages to review:
- Specification overview and architecture
- Transport mechanisms (streamable HTTP, stdio)
- Tool, resource, and prompt definitions

#### Choose Framework and Language

**Recommended stack:**
- **Language**: TypeScript (high-quality SDK support, good compatibility in many execution environments, static typing, good linting tools)
- **Transport**: Streamable HTTP for remote servers (stateless JSON -- simpler to scale and maintain). stdio for local servers.

**SDK References:**
- **TypeScript SDK**: `https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md`
- **Python SDK**: `https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/main/README.md`
- **MCP Best Practices**: `https://modelcontextprotocol.io/specification/draft.md`

#### Plan Implementation

- Review the service's API documentation to identify key endpoints, authentication requirements, and data models
- Prioritise comprehensive API coverage
- List endpoints to implement, starting with the most common operations

### Phase 2: Implementation

#### Set Up Project Structure

**TypeScript project setup:**
```json
{
  "name": "my-mcp-server",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "latest"
  }
}
```

**Python project setup:**
```bash
pip install mcp
# or with FastMCP
pip install fastmcp
```

#### Implement Core Infrastructure

Create shared utilities:
- API client with authentication
- Error handling helpers
- Response formatting (JSON/Markdown)
- Pagination support

#### Implement Tools

For each tool:

**Input Schema:**
- Use Zod (TypeScript) or Pydantic (Python)
- Include constraints and clear descriptions
- Add examples in field descriptions

**Output Schema:**
- Define `outputSchema` where possible for structured data
- Use `structuredContent` in tool responses

**Tool Description:**
- Concise summary of functionality
- Parameter descriptions
- Return type schema

**Implementation:**
- Async/await for I/O operations
- Proper error handling with actionable messages
- Support pagination where applicable

**Annotations:**
- `readOnlyHint`: true/false
- `destructiveHint`: true/false
- `idempotentHint`: true/false
- `openWorldHint`: true/false

### Phase 3: Review and Test

#### Code Quality

Review for:
- No duplicated code (DRY principle)
- Consistent error handling
- Full type coverage
- Clear tool descriptions

#### Build and Test

**TypeScript:**
- Run `npm run build` to verify compilation
- Test with MCP Inspector: `npx @modelcontextprotocol/inspector`

**Python:**
- Verify syntax: `python -m py_compile your_server.py`
- Test with MCP Inspector

### Phase 4: Create Evaluations

Create 10 evaluation questions to test whether LLMs can effectively use your MCP server.

#### Evaluation Requirements

Each question should be:
- **Independent**: Not dependent on other questions
- **Read-only**: Only non-destructive operations required
- **Complex**: Requiring multiple tool calls and deep exploration
- **Realistic**: Based on real use cases
- **Verifiable**: Single, clear answer verifiable by string comparison
- **Stable**: Answer won't change over time

#### Output Format

```xml
<evaluation>
  <qa_pair>
    <question>Your complex, realistic question here</question>
    <answer>Expected answer</answer>
  </qa_pair>
</evaluation>
```
