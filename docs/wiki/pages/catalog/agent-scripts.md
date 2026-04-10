# agent / scripts

Generated from the current working tree on 2026-04-10 18:02:26.

- Files: 5
- File kinds: file (.sh) (2), JavaScript module (2), TypeScript module (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `agent/scripts/discord-mcp.sh`
- Status: tracked-clean
- System: agent
- Group: agent / scripts
- Ownership: agent script/tooling
- Type: file (.sh)
- Lines: 44
- Bytes: 1163
- Contents summary: text lines: #!/usr/bin/env bash \| set -euo pipefail \| SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)" \| AGENT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)" \| ENV_FILE="${DISCORD_MCP_ENV_FILE:-${AGENT_DIR}/.env}" \| read_env_var() {

## `agent/scripts/growth-ledger.ts`
- Status: tracked-clean
- System: agent
- Group: agent / scripts
- Ownership: agent script/tooling
- Type: TypeScript module
- Construction: code module
- Lines: 392
- Bytes: 14995
- Imports (internal unresolved): agent/src/services/growth-ledger-service.js
- Symbol details: function usage, function option, function requiredOption, function optionJson, function optionList, function optionNumber, function optionScore, function print, function main
- Defines: usage, option, requiredOption, optionJson, optionList, optionNumber, optionScore, print, main, flag, index, value, … (+2 more)
- Tests / describe labels: ,
- Contents summary: tests/describes: ,; internal imports: 1

## `agent/scripts/run-agent-daemon.sh`
- Status: tracked-clean
- System: agent
- Group: agent / scripts
- Ownership: agent script/tooling
- Type: file (.sh)
- Lines: 27
- Bytes: 667
- Contents summary: text lines: #!/usr/bin/env bash \| set -euo pipefail \| ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)" \| LOG_FILE="${OUTLET_AGENT_LOG:-/tmp/outlet-agent.log}" \| RESTART_DELAY="${OUTLET_AGENT_RESTART_DELAY_SECONDS:-5}" \| mkdir -p "$(dirname "$LOG_FILE")"

## `agent/scripts/tm1-crawl-capabilities.mjs`
- Status: tracked-clean
- System: agent
- Group: agent / scripts
- Ownership: agent script/tooling
- Type: JavaScript module
- Construction: code module
- Lines: 472
- Bytes: 14237
- Imports (internal): agent/scripts/tm1-map-source-maps.mjs
- Imports (packages): node:fs/promises, node:path, node:process
- Depends on groups: agent / scripts
- Symbol details: function parseArgs, function printHelp, function normalizeRoute, function buildDefaultRoutes, function createHeaders, function extractScriptUrlsFromHtml, function extractSourceMapUrl, function extractJsAssetCandidates, function fetchText, function crawlRoutes, function processWithConcurrency, function crawlAssets, function fetchSourceMaps, function writeCrawlOutput, function main, const TM1_DEFAULT_BASE_URL, … (+5 more)
- Defines: parseArgs, printHelp, normalizeRoute, buildDefaultRoutes, createHeaders, extractScriptUrlsFromHtml, extractSourceMapUrl, extractJsAssetCandidates, fetchText, crawlRoutes, processWithConcurrency, worker, … (+61 more)
- Contents summary: internal imports: 1; package imports: 3

## `agent/scripts/tm1-map-source-maps.mjs`
- Status: tracked-clean
- System: agent
- Group: agent / scripts
- Ownership: agent script/tooling
- Type: JavaScript module
- Construction: code module
- Lines: 381
- Bytes: 13070
- Imports (packages): node:fs/promises, node:path, node:process, node:url
- Imported by: agent/scripts/tm1-crawl-capabilities.mjs
- Used by groups: agent / scripts
- Exports: parseArgs, printHelp, extractEndpointTemplates, fetchSourceMap, aggregate, topEndpointFiles, buildMarkdown, writeOutputs, main, DEFAULT_SOURCE_MAP_URLS, DEFAULT_MARKDOWN_OUTPUT, DEFAULT_JSON_OUTPUT
- Symbol details: function parseArgs (exported), function printHelp (exported), function extractEndpointTemplates (exported), function fetchSourceMap (exported), function aggregate (exported), function topEndpointFiles (exported), function buildMarkdown (exported), function writeOutputs (exported), function main (exported), function unique, function sortStrings, function extractClassNames, function extractInterfaces, function extractMethods, function extractExportedFunctions, function normalizeEndpointTemplate, … (+6 more)
- Defines: parseArgs, printHelp, unique, sortStrings, extractClassNames, extractInterfaces, extractMethods, extractExportedFunctions, normalizeEndpointTemplate, extractEndpointTemplates, inferCategory, buildEntry, … (+48 more)
- Tests / describe labels: \n
- Contents summary: exports: parseArgs, printHelp, extractEndpointTemplates, fetchSourceMap, aggregate, topEndpointFiles, buildMarkdown, writeOutputs; tests/describes: \n; package imports: 4
