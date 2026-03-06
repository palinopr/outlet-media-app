#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGENT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ENV_FILE="${DISCORD_MCP_ENV_FILE:-${AGENT_DIR}/.env}"

read_env_var() {
  local key="$1"
  python3 - "$key" "$ENV_FILE" <<'PY'
import sys
from pathlib import Path

key = sys.argv[1]
env_path = Path(sys.argv[2])
if not env_path.exists():
    raise SystemExit(0)

for raw in env_path.read_text().splitlines():
    line = raw.strip()
    if not line or line.startswith("#") or "=" not in raw:
        continue
    k, v = raw.split("=", 1)
    if k.strip() != key:
        continue
    value = v.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
        value = value[1:-1]
    print(value)
    break
PY
}

export DISCORD_TOKEN="${DISCORD_TOKEN:-$(read_env_var DISCORD_TOKEN)}"
export DISCORD_GUILD_ID="${DISCORD_GUILD_ID:-$(read_env_var DISCORD_GUILD_ID)}"
export DISCORD_CLIENT_ID="${DISCORD_CLIENT_ID:-$(read_env_var DISCORD_CLIENT_ID)}"

if [[ -z "${DISCORD_TOKEN}" ]]; then
  echo "discord-mcp: missing DISCORD_TOKEN in ${ENV_FILE}" >&2
  exit 1
fi

exec npx -y mcp-discord@1.3.4 "$@"
