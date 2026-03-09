#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
  aggregate,
  fetchSourceMap,
  writeOutputs,
} from "./tm1-map-source-maps.mjs";

const TM1_DEFAULT_BASE_URL = "https://one.ticketmaster.com";
const DEFAULT_MARKDOWN_OUTPUT = "docs/context/tm1-capability-map.md";
const DEFAULT_JSON_OUTPUT = "session/tm1-capability-map.json";
const DEFAULT_CRAWL_OUTPUT = "session/tm1-crawl-assets.json";
const DEFAULT_CONCURRENCY = 12;
const DEFAULT_MAX_ASSETS = 1200;

function parseArgs(argv) {
  const assetUrls = [];
  const routes = [];
  const sourceMaps = [];
  let baseUrl = process.env.TM1_BASE_URL ?? TM1_DEFAULT_BASE_URL;
  let concurrency = DEFAULT_CONCURRENCY;
  let crawlOutput = DEFAULT_CRAWL_OUTPUT;
  let eventId = null;
  let jsonOutput = DEFAULT_JSON_OUTPUT;
  let markdownOutput = DEFAULT_MARKDOWN_OUTPUT;
  let maxAssets = DEFAULT_MAX_ASSETS;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--route") {
      const value = argv[i + 1];
      if (!value) throw new Error("--route requires a URL or path");
      routes.push(value);
      i += 1;
      continue;
    }
    if (arg === "--asset-url") {
      const value = argv[i + 1];
      if (!value) throw new Error("--asset-url requires a URL");
      assetUrls.push(value);
      i += 1;
      continue;
    }
    if (arg === "--source-map") {
      const value = argv[i + 1];
      if (!value) throw new Error("--source-map requires a URL");
      sourceMaps.push(value);
      i += 1;
      continue;
    }
    if (arg === "--event-id") {
      const value = argv[i + 1];
      if (!value) throw new Error("--event-id requires a value");
      eventId = value;
      i += 1;
      continue;
    }
    if (arg === "--base-url") {
      const value = argv[i + 1];
      if (!value) throw new Error("--base-url requires a URL");
      baseUrl = value;
      i += 1;
      continue;
    }
    if (arg === "--concurrency") {
      const value = Number(argv[i + 1]);
      if (!Number.isFinite(value) || value < 1) {
        throw new Error("--concurrency requires a positive integer");
      }
      concurrency = Math.floor(value);
      i += 1;
      continue;
    }
    if (arg === "--max-assets") {
      const value = Number(argv[i + 1]);
      if (!Number.isFinite(value) || value < 1) {
        throw new Error("--max-assets requires a positive integer");
      }
      maxAssets = Math.floor(value);
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
    if (arg === "--crawl-output") {
      const value = argv[i + 1];
      if (!value) throw new Error("--crawl-output requires a path");
      crawlOutput = value;
      i += 1;
      continue;
    }
    if (arg === "--help") {
      return { help: true };
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return {
    baseUrl,
    concurrency,
    crawlOutput,
    eventId,
    help: false,
    jsonOutput,
    markdownOutput,
    maxAssets,
    assetUrls,
    routes,
    sourceMaps,
  };
}

function printHelp() {
  console.log(`Usage: node agent/scripts/tm1-crawl-capabilities.mjs [options]

Options:
  --event-id <id>            Add default event routes for this TM1 event.
  --route <url-or-path>      Add a TM1 route to crawl. Can be repeated.
  --asset-url <url>          Add a JS asset URL directly. Can be repeated.
  --source-map <url>         Add a source map URL directly. Can be repeated.
  --base-url <url>           Override the TM1 base URL.
  --concurrency <n>          Number of concurrent asset/source-map workers.
  --max-assets <n>           Maximum number of JS assets to fetch.
  --markdown-output <path>   Where to write the human summary.
  --json-output <path>       Where to write the merged capability JSON.
  --crawl-output <path>      Where to write crawl inventory metadata.
  --help                     Show this message.
`);
}

function normalizeRoute(baseUrl, route) {
  try {
    return new URL(route).toString();
  } catch {
    return new URL(route.startsWith("/") ? route : `/${route}`, baseUrl).toString();
  }
}

function buildDefaultRoutes(baseUrl, eventId) {
  const routes = [new URL("/events", baseUrl).toString()];
  if (!eventId) return routes;

  const baseEventPath = `/events/${eventId}/event-dashboard`;
  return [
    ...routes,
    new URL(baseEventPath, baseUrl).toString(),
    new URL(`${baseEventPath}/(fullScreenModal:map/inventory)`, baseUrl).toString(),
    new URL(`${baseEventPath}/(fullScreenModal:map/scaling)`, baseUrl).toString(),
  ];
}

function createHeaders(requireTm1Session) {
  const headers = new Headers({
    accept: "text/html,application/xhtml+xml,application/json,text/plain,*/*",
  });

  if (!requireTm1Session) {
    return headers;
  }

  const cookie = process.env.TM1_COOKIE;
  if (!cookie || cookie.trim().length === 0) {
    throw new Error("TM1_COOKIE is required when crawling authenticated TM1 routes.");
  }

  headers.set("cookie", cookie);

  const xsrfToken = process.env.TM1_XSRF_TOKEN;
  if (xsrfToken) {
    headers.set("x-xsrf-token", xsrfToken);
  }

  return headers;
}

function extractScriptUrlsFromHtml(html, pageUrl) {
  const results = new Set();
  const regex = /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;

  for (const match of html.matchAll(regex)) {
    const candidate = match[1];
    if (!candidate) continue;
    try {
      const resolved = new URL(candidate, pageUrl);
      if (resolved.host === "one.ticketmaster.com" && resolved.pathname.endsWith(".js")) {
        results.add(resolved.toString());
      }
    } catch {
      continue;
    }
  }

  return [...results].sort((a, b) => a.localeCompare(b));
}

function extractSourceMapUrl(jsText, assetUrl) {
  const lineMatch = jsText.match(/\/\/# sourceMappingURL=(.+)$/m);
  const blockMatch = jsText.match(/\/\*# sourceMappingURL=(.+?)\s*\*\//m);
  const raw = lineMatch?.[1]?.trim() ?? blockMatch?.[1]?.trim();
  if (!raw) return null;

  try {
    return new URL(raw, assetUrl).toString();
  } catch {
    return null;
  }
}

function extractJsAssetCandidates(jsText, assetUrl) {
  const results = new Set();
  const absoluteRegex = /https:\/\/one\.ticketmaster\.com\/[^"'`\s)]+\.js(?:\?[^"'`\s)]*)?/g;
  const quotedRegex = /["'`]([^"'`\n\r\s]+\.js(?:\?[^"'`\n\r\s]*)?)["'`]/g;

  for (const match of jsText.matchAll(absoluteRegex)) {
    results.add(match[0]);
  }

  for (const match of jsText.matchAll(quotedRegex)) {
    const candidate = match[1];
    if (!candidate) continue;
    try {
      const resolved = new URL(candidate, assetUrl);
      if (resolved.host === "one.ticketmaster.com" && resolved.pathname.endsWith(".js")) {
        results.add(resolved.toString());
      }
    } catch {
      continue;
    }
  }

  return [...results].sort((a, b) => a.localeCompare(b));
}

async function fetchText(url, headers) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

async function crawlRoutes(routeUrls, headers) {
  const pages = [];
  const pageScriptUrls = new Set();

  for (const routeUrl of routeUrls) {
    try {
      const html = await fetchText(routeUrl, headers);
      const scriptUrls = extractScriptUrlsFromHtml(html, routeUrl);
      pages.push({
        routeUrl,
        scriptCount: scriptUrls.length,
        scriptUrls,
      });
      scriptUrls.forEach((scriptUrl) => pageScriptUrls.add(scriptUrl));
    } catch (error) {
      pages.push({
        routeUrl,
        scriptCount: 0,
        scriptUrls: [],
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return {
    pages,
    scriptUrls: [...pageScriptUrls].sort((a, b) => a.localeCompare(b)),
  };
}

async function processWithConcurrency(items, workerCount, handler) {
  const queue = [...items];
  const results = [];

  async function worker() {
    while (queue.length > 0) {
      const item = queue.shift();
      if (item == null) return;
      results.push(await handler(item));
    }
  }

  await Promise.all(Array.from({ length: Math.min(workerCount, queue.length || 1) }, () => worker()));
  return results;
}

async function crawlAssets(seedAssets, headers, options) {
  const visitedAssets = new Set();
  const queuedAssets = new Set();
  const assetQueue = [];
  const discoveredSourceMaps = new Set(options.seedSourceMaps ?? []);
  const assets = [];
  const failures = [];

  const pushAsset = (assetUrl) => {
    if (
      visitedAssets.has(assetUrl) ||
      queuedAssets.has(assetUrl) ||
      assetQueue.length + visitedAssets.size >= options.maxAssets
    ) {
      return;
    }
    queuedAssets.add(assetUrl);
    assetQueue.push(assetUrl);
  };

  seedAssets.forEach(pushAsset);

  async function worker() {
    while (assetQueue.length > 0) {
      const assetUrl = assetQueue.shift();
      if (!assetUrl) return;
      queuedAssets.delete(assetUrl);
      if (visitedAssets.has(assetUrl)) continue;
      visitedAssets.add(assetUrl);

      try {
        const jsText = await fetchText(assetUrl, headers);
        const sourceMapUrl = extractSourceMapUrl(jsText, assetUrl);
        if (sourceMapUrl) {
          discoveredSourceMaps.add(sourceMapUrl);
        }

        const discoveredAssets = extractJsAssetCandidates(jsText, assetUrl);
        discoveredAssets.forEach(pushAsset);

        assets.push({
          assetUrl,
          discoveredAssetCount: discoveredAssets.length,
          discoveredAssets,
          sourceMapUrl,
        });
      } catch (error) {
        failures.push({
          assetUrl,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(options.concurrency, assetQueue.length || 1) }, () => worker()),
  );

  return {
    assets: assets.sort((a, b) => a.assetUrl.localeCompare(b.assetUrl)),
    failures,
    sourceMapUrls: [...discoveredSourceMaps].sort((a, b) => a.localeCompare(b)),
  };
}

async function fetchSourceMaps(sourceMapUrls, concurrency) {
  const results = [];
  const failures = [];

  const fetched = await processWithConcurrency(sourceMapUrls, concurrency, async (url) => {
    try {
      const sourceMap = await fetchSourceMap(url);
      return { ok: true, sourceMap: { ...sourceMap, url } };
    } catch (error) {
      return {
        ok: false,
        failure: {
          url,
          error: error instanceof Error ? error.message : String(error),
        },
      };
    }
  });

  for (const result of fetched) {
    if (result.ok) results.push(result.sourceMap);
    else failures.push(result.failure);
  }

  return { failures, sourceMaps: results };
}

async function writeCrawlOutput(rootDir, crawlData, outputPath) {
  const absolutePath = path.resolve(rootDir, outputPath);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, `${JSON.stringify(crawlData, null, 2)}\n`, "utf8");
  return absolutePath;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const rootDir = process.cwd();
  const defaultRoutes =
    args.routes.length === 0 && args.assetUrls.length === 0 && args.sourceMaps.length === 0
      ? buildDefaultRoutes(args.baseUrl, args.eventId)
      : args.eventId
        ? buildDefaultRoutes(args.baseUrl, args.eventId).slice(1)
        : [];
  const routeUrls = [
    ...defaultRoutes,
    ...args.routes.map((route) => normalizeRoute(args.baseUrl, route)),
  ].filter((route, index, all) => all.indexOf(route) === index);
  const headers = createHeaders(routeUrls.length > 0);

  const routeCrawl =
    routeUrls.length > 0
      ? await crawlRoutes(routeUrls, headers)
      : { pages: [], scriptUrls: [] };
  const seedAssets = [
    ...routeCrawl.scriptUrls,
    ...args.assetUrls.map((assetUrl) => normalizeRoute(args.baseUrl, assetUrl)),
  ].filter((assetUrl, index, all) => all.indexOf(assetUrl) === index);
  const assetCrawl = await crawlAssets(seedAssets, headers, {
    concurrency: args.concurrency,
    maxAssets: args.maxAssets,
    seedSourceMaps: args.sourceMaps,
  });
  const sourceMapFetch = await fetchSourceMaps(assetCrawl.sourceMapUrls, args.concurrency);
  const aggregated = aggregate(sourceMapFetch.sourceMaps);
  const mapData = {
    generatedAt: new Date().toISOString(),
    crawl: {
      assetFailures: assetCrawl.failures,
      jsAssetsVisited: assetCrawl.assets.length,
      pageFailures: routeCrawl.pages.filter((page) => page.error),
      routes: routeCrawl.pages,
      sourceMapFailures: sourceMapFetch.failures,
      sourceMapUrls: assetCrawl.sourceMapUrls,
    },
    ...aggregated,
  };

  const outputs = await writeOutputs(rootDir, mapData, args.markdownOutput, args.jsonOutput, {
    title: "TM1 Capability Map",
    intro:
      "This file is generated from authenticated TM1 route crawling plus recursively discovered TM1 source maps. It is broader than a single loaded module, but it still only covers the TM1 bundles discoverable from the scanned routes.",
  });
  const crawlOutputPath = await writeCrawlOutput(rootDir, mapData.crawl, args.crawlOutput);

  console.log("TM1 crawl complete:");
  console.log(`- routes: ${routeUrls.length}`);
  console.log(`- seed assets: ${seedAssets.length}`);
  console.log(`- js assets visited: ${mapData.crawl.jsAssetsVisited}`);
  console.log(`- source maps fetched: ${mapData.sourceMaps.length}`);
  console.log(`- markdown map: ${outputs.markdownPath}`);
  console.log(`- json map: ${outputs.jsonPath}`);
  console.log(`- crawl metadata: ${crawlOutputPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
