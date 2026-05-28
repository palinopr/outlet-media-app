# Outlet Media Memory MCP

Read-only MCP bridge for the canonical Outlet Media Memory Obsidian vault.

```text
/Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory
```

This gives ChatGPT or another MCP client controlled access to search and fetch compiled memory notes. It does not give ChatGPT raw filesystem access.

## Tools

- `search` - search allowed vault notes and return note IDs
- `fetch` - fetch the full text of an allowed note by ID/path
- `open_note_uri` - return an `obsidian://` URI for an allowed note
- `create_raw_inbox_note` - optional write tool, exposed only when `OUTLET_OBSIDIAN_MCP_ENABLE_WRITES=true`

Default read access intentionally excludes `.obsidian`, `.git`, `_archive`, `.trash`, and `50 Sources/Raw Inbox`.

## Run Locally

HTTP mode for ChatGPT connector testing:

```bash
npm run obsidian:mcp:http
curl http://127.0.0.1:8777/health
```

When exposing the server through a temporary HTTPS tunnel, require an unguessable
MCP path token:

```bash
OUTLET_OBSIDIAN_MCP_PATH_TOKEN="$(openssl rand -hex 24)" npm run obsidian:mcp:http
```

Use the `/mcp/<token>` path from the startup output as the connector URL path.
When a path token is configured, `/health` and wrong-path errors do not echo the
token.

Stdio mode for local MCP clients:

```bash
npm run obsidian:mcp:stdio
```

## ChatGPT Setup

ChatGPT connectors require an HTTPS `/mcp` endpoint. Run the local HTTP server, expose it with a trusted tunnel or deployment, then add the resulting URL in ChatGPT developer mode under Settings -> Connectors -> Create.

Example connector URL:

```text
https://<your-tunnel-host>/mcp
```

Keep the server read-only for normal ChatGPT use. Enable Raw Inbox writes only for a controlled session:

```bash
OUTLET_OBSIDIAN_MCP_ENABLE_WRITES=true npm run obsidian:mcp:http
```

## Configuration

```bash
OUTLET_MEMORY_VAULT="/Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory"
OUTLET_OBSIDIAN_MCP_PORT=8777
OUTLET_OBSIDIAN_MCP_ALLOWED_ROOTS="AGENTS.md,00 Start Here.md,01 Indexes,10 Doctrine,30 Clients,60 Claims,70 Triples,80 Logs,85 Snapshots,90 System"
OUTLET_OBSIDIAN_MCP_EXCLUDED_ROOTS=".git,.obsidian,.trash,_archive,50 Sources/Raw Inbox,node_modules"
OUTLET_OBSIDIAN_MCP_MAX_FETCH_BYTES=250000
OUTLET_OBSIDIAN_MCP_PATH_TOKEN="<optional-url-safe-token>"
```

## Test

```bash
npm run test:obsidian-mcp
```

## Safety Model

- No shell tool.
- No delete tool.
- No general file read outside the configured vault.
- Symlinks are resolved and must remain inside the vault.
- Raw Inbox writes are hidden unless explicitly enabled.
- Obvious secrets or credential-like strings are rejected by the write tool.
- Optional path-token mode avoids exposing a bare `/mcp` endpoint when using a
  temporary HTTPS tunnel.
