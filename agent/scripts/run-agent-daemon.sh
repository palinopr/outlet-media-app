#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_FILE="${OUTLET_AGENT_LOG:-/tmp/outlet-agent.log}"
RESTART_DELAY="${OUTLET_AGENT_RESTART_DELAY_SECONDS:-5}"

mkdir -p "$(dirname "$LOG_FILE")"
touch "$LOG_FILE"

while true; do
  {
    printf '[daemon] starting agent at %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
    cd "$ROOT_DIR"
    exec node --import tsx/esm src/index.ts
  } >>"$LOG_FILE" 2>&1

  exit_code=$?
  printf '[daemon] agent exited with code %s at %s; restarting in %ss\n' \
    "$exit_code" \
    "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" \
    "$RESTART_DELAY" >>"$LOG_FILE"

  sleep "$RESTART_DELAY"
done
