#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

export const DEFAULT_SOURCE_MAP_URLS = [
  "https://one.ticketmaster.com/cdn/PRD2939/components/PRD130/jem/scaling-sandbox/@tm1/prd130-tm1-events/88beb91f/main.js.map",
  "https://one.ticketmaster.com/cdn/PRD2939/components/PRD130/jem/scaling-sandbox/@tm1/prd130-tm1-events/88beb91f/484.js.map",
];

export const DEFAULT_MARKDOWN_OUTPUT = "docs/context/tm1-prd130-capability-map.md";
export const DEFAULT_JSON_OUTPUT = "session/tm1-prd130-capability-map.json";

export function parseArgs(argv) {
  const sourceMaps = [];
  let markdownOutput = DEFAULT_MARKDOWN_OUTPUT;
  let jsonOutput = DEFAULT_JSON_OUTPUT;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--source-map") {
      const value = argv[i + 1];
      if (!value) throw new Error("--source-map requires a URL");
      sourceMaps.push(value);
      i += 1;
      continue;
    }
    if (arg === "--markdown-output") {
      const value = argv[i + 1];
      if (!value) throw new Error("--markdown-output requires a path");
      markdownOutput = value;
      i += 1;
      continue;
    }
    if (arg === "--json-output") {
      const value = argv[i + 1];
      if (!value) throw new Error("--json-output requires a path");
      jsonOutput = value;
      i += 1;
      continue;
    }
    if (arg === "--help") {
      return { help: true };
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return {
    help: false,
    jsonOutput,
    markdownOutput,
    sourceMaps: sourceMaps.length > 0 ? sourceMaps : DEFAULT_SOURCE_MAP_URLS,
  };
}

export function printHelp() {
  console.log(`Usage: node agent/scripts/tm1-map-source-maps.mjs [options]

Options:
  --source-map <url>         Add a TM1 source map URL to scan. Can be repeated.
  --markdown-output <path>   Write the human summary here.
  --json-output <path>       Write the full machine map here.
  --help                     Show this message.
`);
}

function unique(values) {
  return [...new Set(values)];
}

function sortStrings(values) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function extractClassNames(content) {
  const matches = [...content.matchAll(/export\s+(?:abstract\s+)?class\s+([A-Za-z0-9_]+)/g)];
  return sortStrings(matches.map((match) => match[1]));
}

function extractInterfaces(content) {
  const matches = [...content.matchAll(/export\s+interface\s+([A-Za-z0-9_]+)/g)];
  return sortStrings(matches.map((match) => match[1]));
}

function extractMethods(content) {
  const methods = [];
  const regex =
    /^\s*(public|private|protected)\s+(?:async\s+)?([A-Za-z0-9_]+)\s*(?:<[^(\n]+>)?\s*\(/gm;

  for (const match of content.matchAll(regex)) {
    const visibility = match[1];
    const name = match[2];
    if (name === "if" || name === "for" || name === "switch" || name === "while") continue;
    methods.push({ name, visibility });
  }

  return methods.sort((a, b) => {
    if (a.visibility === b.visibility) return a.name.localeCompare(b.name);
    return a.visibility.localeCompare(b.visibility);
  });
}

function extractExportedFunctions(content) {
  const named = [...content.matchAll(/export\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)\s*\(/g)].map(
    (match) => match[1],
  );
  const constFns = [
    ...content.matchAll(
      /export\s+const\s+([A-Za-z0-9_]+)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z0-9_]+)\s*=>/g,
    ),
  ].map((match) => match[1]);
  return sortStrings(unique([...named, ...constFns]));
}

function normalizeEndpointTemplate(raw) {
  return raw.replace(/\s+/g, " ").trim();
}

export function extractEndpointTemplates(content) {
  const results = new Set();
  const templateRegex =
    /`((?:\$\{this\.baseUrl\}|\$\{baseUrl\}|\/api\/|\/events\/|\/inventories\/|\/runs\/)[^`]*)`/g;
  const quoteRegex = /["']((?:\/api\/|\/events\/|\/inventories\/|\/runs\/)[^"'`]*)["']/g;

  for (const match of content.matchAll(templateRegex)) {
    results.add(normalizeEndpointTemplate(match[1]));
  }
  for (const match of content.matchAll(quoteRegex)) {
    results.add(normalizeEndpointTemplate(match[1]));
  }

  return sortStrings([...results]);
}

function inferCategory(sourcePath) {
  if (sourcePath.includes("/rest-services/")) return "rest-service";
  if (sourcePath.includes("/store-epics/")) return "store-epic";
  if (sourcePath.includes("/store/")) return "store";
  if (sourcePath.includes("/shared/model/")) return "model";
  if (sourcePath.includes("/shared/rest-services/interceptors/")) return "interceptor";
  if (sourcePath.includes("/shared/")) return "shared";
  return "other";
}

function buildEntry(sourceMapUrl, sourcePath, content) {
  const classNames = extractClassNames(content);
  const interfaces = extractInterfaces(content);
  const methods = extractMethods(content);
  const exportedFunctions = extractExportedFunctions(content);
  const endpointTemplates = extractEndpointTemplates(content);

  return {
    category: inferCategory(sourcePath),
    classNames,
    endpointTemplates,
    exportedFunctions,
    interfaces,
    lineCount: content.split("\n").length,
    methods,
    path: sourcePath,
    sourceMapUrl,
  };
}

export async function fetchSourceMap(url) {
  const response = await fetch(url, {
    headers: { accept: "application/json,text/plain,*/*" },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export function aggregate(sourceMaps) {
  const files = [];
  const byCategory = new Map();

  for (const sourceMap of sourceMaps) {
    const sources = Array.isArray(sourceMap.sources) ? sourceMap.sources : [];
    const sourcesContent = Array.isArray(sourceMap.sourcesContent) ? sourceMap.sourcesContent : [];

    sources.forEach((sourcePath, index) => {
      const content = sourcesContent[index];
      if (typeof content !== "string" || content.trim().length === 0) return;

      const entry = buildEntry(sourceMap.url, sourcePath, content);
      const hasInterestingContent =
        entry.classNames.length > 0 ||
        entry.interfaces.length > 0 ||
        entry.methods.length > 0 ||
        entry.exportedFunctions.length > 0 ||
        entry.endpointTemplates.length > 0;

      if (!hasInterestingContent) return;

      files.push(entry);
      byCategory.set(entry.category, (byCategory.get(entry.category) ?? 0) + 1);
    });
  }

  files.sort((a, b) => a.path.localeCompare(b.path));

  const restServices = files.filter((file) => file.category === "rest-service");
  const endpointFiles = files.filter((file) => file.endpointTemplates.length > 0);

  return {
    files,
    sourceMaps: sourceMaps.map((sourceMap) => ({
      fileCount: Array.isArray(sourceMap.sources) ? sourceMap.sources.length : 0,
      url: sourceMap.url,
    })),
    stats: {
      categories: Object.fromEntries([...byCategory.entries()].sort((a, b) => a[0].localeCompare(b[0]))),
      endpointFiles: endpointFiles.length,
      exportedFunctionFiles: files.filter((file) => file.exportedFunctions.length > 0).length,
      filesWithInterestingContent: files.length,
      methodFiles: files.filter((file) => file.methods.length > 0).length,
      restServiceFiles: restServices.length,
      totalEndpoints: endpointFiles.reduce((sum, file) => sum + file.endpointTemplates.length, 0),
      totalExportedFunctions: files.reduce((sum, file) => sum + file.exportedFunctions.length, 0),
      totalMethods: files.reduce((sum, file) => sum + file.methods.length, 0),
      totalSourceFiles: sourceMaps.reduce(
        (sum, sourceMap) => sum + (Array.isArray(sourceMap.sources) ? sourceMap.sources.length : 0),
        0,
      ),
    },
  };
}

export function topEndpointFiles(files, limit = 12) {
  return [...files]
    .filter((file) => file.endpointTemplates.length > 0)
    .sort((a, b) => {
      if (b.endpointTemplates.length !== a.endpointTemplates.length) {
        return b.endpointTemplates.length - a.endpointTemplates.length;
      }
      return a.path.localeCompare(b.path);
    })
    .slice(0, limit);
}

export function buildMarkdown(mapData, title = "TM1 PRD130 Capability Map", intro) {
  const lines = [];
  lines.push(`# ${title}`, "");
  lines.push(
    intro ??
      "This file is generated from TM1 source maps. It is a capability map of the currently scanned TM1 modules, not a complete map of the entire TM1 platform.",
    "",
  );
  lines.push(`Generated: ${mapData.generatedAt}`, "");
  lines.push("## Source Maps", "");
  for (const sourceMap of mapData.sourceMaps) {
    lines.push(`- ${sourceMap.url} (${sourceMap.fileCount} sources)`);
  }
  lines.push("");
  lines.push("## Stats", "");
  lines.push(`- Interesting source files: ${mapData.stats.filesWithInterestingContent}`);
  lines.push(`- Rest-service files: ${mapData.stats.restServiceFiles}`);
  lines.push(`- Files with endpoint templates: ${mapData.stats.endpointFiles}`);
  lines.push(`- Total extracted methods: ${mapData.stats.totalMethods}`);
  lines.push(`- Total extracted exported functions: ${mapData.stats.totalExportedFunctions}`);
  lines.push(`- Total extracted endpoint templates: ${mapData.stats.totalEndpoints}`);
  lines.push("");
  lines.push("## Top Endpoint Files", "");

  for (const file of topEndpointFiles(mapData.files)) {
    lines.push(`### ${file.path}`, "");
    if (file.classNames.length > 0) {
      lines.push(`Classes: ${file.classNames.join(", ")}`, "");
    }
    if (file.methods.length > 0) {
      const publicMethods = file.methods
        .filter((method) => method.visibility === "public")
        .map((method) => method.name);
      if (publicMethods.length > 0) {
        lines.push(`Public methods: ${publicMethods.join(", ")}`, "");
      }
    }
    lines.push("Endpoints:");
    for (const endpoint of file.endpointTemplates) {
      lines.push(`- \`${endpoint}\``);
    }
    lines.push("");
  }

  lines.push("## Rest Services", "");
  for (const file of mapData.files.filter((entry) => entry.category === "rest-service")) {
    lines.push(`### ${file.path}`, "");
    if (file.classNames.length > 0) {
      lines.push(`Classes: ${file.classNames.join(", ")}`);
    }
    if (file.methods.length > 0) {
      const methodList = file.methods.map((method) => `${method.visibility} ${method.name}`);
      lines.push(`Methods: ${methodList.join(", ")}`);
    }
    if (file.endpointTemplates.length > 0) {
      lines.push("Endpoints:");
      for (const endpoint of file.endpointTemplates) {
        lines.push(`- \`${endpoint}\``);
      }
    }
    lines.push("");
  }

  lines.push("## Notes", "");
  lines.push("- Use the JSON output for the full machine-readable function map.");
  lines.push("- Expand the input source-map list as TM1 lazy-loads more bundles.");
  lines.push("- Do not assume every extracted endpoint is safe to call without verifying auth, headers, and payload shape.");
  lines.push("");
  return `${lines.join("\n").trim()}\n`;
}

export async function writeOutputs(
  rootDir,
  mapData,
  markdownOutput,
  jsonOutput,
  options = {},
) {
  const markdownPath = path.resolve(rootDir, markdownOutput);
  const jsonPath = path.resolve(rootDir, jsonOutput);

  await mkdir(path.dirname(markdownPath), { recursive: true });
  await mkdir(path.dirname(jsonPath), { recursive: true });

  await writeFile(
    markdownPath,
    buildMarkdown(mapData, options.title, options.intro),
    "utf8",
  );
  await writeFile(jsonPath, `${JSON.stringify(mapData, null, 2)}\n`, "utf8");

  return { jsonPath, markdownPath };
}

export async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const rootDir = process.cwd();
  const sourceMaps = [];

  for (const url of args.sourceMaps) {
    const sourceMap = await fetchSourceMap(url);
    sourceMaps.push({ ...sourceMap, url });
  }

  const aggregated = aggregate(sourceMaps);
  const mapData = {
    generatedAt: new Date().toISOString(),
    ...aggregated,
  };
  const outputs = await writeOutputs(rootDir, mapData, args.markdownOutput, args.jsonOutput, {
    title: "TM1 PRD130 Capability Map",
    intro:
      "This file is generated from the currently loaded TM1 PRD130 source maps. It is a capability map of the loaded event-management module, not a complete map of the entire TM1 platform.",
  });

  console.log(`TM1 capability map written to:`);
  console.log(`- ${outputs.markdownPath}`);
  console.log(`- ${outputs.jsonPath}`);
  console.log(
    `Scanned ${mapData.sourceMaps.length} source maps, ${mapData.stats.filesWithInterestingContent} interesting files, ${mapData.stats.totalEndpoints} endpoint templates, and ${mapData.stats.totalMethods} methods.`,
  );
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isCli) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
