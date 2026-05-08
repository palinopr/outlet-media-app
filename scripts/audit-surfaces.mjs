#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const SOURCE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"];
const ROUTE_ROOT_NAMES = new Set(["page.tsx", "layout.tsx", "route.ts", "loading.tsx", "error.tsx"]);
const IGNORED_DIRS = new Set(["node_modules", ".next", ".git", "coverage", ".worktrees", ".claude"]);

const ACTIVE_ROUTE_PATTERNS = [
  /^src\/app\/admin\/layout\.tsx$/,
  /^src\/app\/admin\/(?:dashboard|campaigns|clients|users|settings)(?:\/.*)?\/(?:page|layout|loading|error)\.tsx$/,
  /^src\/app\/api\/(?:admin\/activity|admin\/invite|admin\/users\/\[id\]|contact|health|ingest|meta\/callback|meta\/data-deletion|observability\/client-error|user\/profile)\/route\.ts$/,
  /^src\/app\/client(?:\/pending)?\/(?:page|layout)\.tsx$/,
  /^src\/app\/client\/\[slug\]\/(?:page|layout|loading|error)\.tsx$/,
  /^src\/app\/client\/\[slug\]\/campaigns(?:\/.*)?\/(?:page|loading|error)\.tsx$/,
  /^src\/app\/client\/\[slug\]\/campaign\/\[campaignId\](?:\/.*)?\/(?:page|loading|error)\.tsx$/,
  /^src\/app\/9am\/\[city\]\/route\.ts$/,
  /^src\/app\/ataca-sergio(?:\/\[market\])?\/route\.ts$/,
  /^src\/app\/landing\/page\.tsx$/,
  /^src\/app\/(?:privacy|terms|connect-error|deletion-status\/\[code\]|sign-in\/\[\[\.\.\.sign-in\]\]|sign-up\/\[\[\.\.\.sign-up\]\])\/page\.tsx$/,
  /^src\/app\/(?:page|layout|not-found|global-error)\.tsx$/,
];

const EXTERNALLY_CALLED_API_ROUTES = new Set([
  "src/app/api/health/route.ts",
  "src/app/api/ingest/route.ts",
  "src/app/api/meta/callback/route.ts",
  "src/app/api/meta/data-deletion/route.ts",
]);

const FRAMEWORK_ROOTS = new Set([
  "src/app/global-error.tsx",
  "src/app/not-found.tsx",
  "src/instrumentation.ts",
  "src/proxy.ts",
]);

const PRODUCT_REVIEW_TERMS = [
  "agent",
  "agents",
  "events",
  "reports",
  "ticketing",
  "ingest",
  "approvals",
  "conversations",
  "action items",
  "workspace",
];
const PRODUCT_DECISION_ROUTE_SEGMENTS = new Set(["events", "reports"]);

export function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

export function isRouteRoot(relativePath) {
  return relativePath.startsWith("src/app/") && ROUTE_ROOT_NAMES.has(path.basename(relativePath));
}

function hasProductDecisionRouteSegment(relativePath) {
  return relativePath.split("/").some((segment) => PRODUCT_DECISION_ROUTE_SEGMENTS.has(segment));
}

export function classifyRouteRoot(relativePath) {
  if (hasProductDecisionRouteSegment(relativePath)) {
    return "needs product decision";
  }
  if (ACTIVE_ROUTE_PATTERNS.some((pattern) => pattern.test(relativePath))) {
    return "active shipped route root";
  }
  return "needs product decision";
}

export function isPublicFunnelException(relativePath) {
  return (
    relativePath.startsWith("src/app/9am/") ||
    relativePath.startsWith("public/9am/") ||
    relativePath.startsWith("src/app/ataca-sergio/") ||
    relativePath.startsWith("public/ataca-sergio/")
  );
}

export function extractImportSpecifiers(source) {
  const specifiers = new Set();
  const patterns = [
    /\bimport\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g,
    /\bexport\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)["']([^"']+)["']/g,
    /\bimport\(\s*["']([^"']+)["']\s*\)/g,
  ];

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      specifiers.add(match[1]);
    }
  }

  return [...specifiers];
}

export function findProductScopeTerms(relativePath, source) {
  if (relativePath.startsWith("src/features/system-events/")) return [];
  const haystack = `${relativePath}\n${source}`.toLowerCase();
  return PRODUCT_REVIEW_TERMS.filter((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
    return new RegExp(`(^|[^a-z0-9_-])${escaped}([^a-z0-9_-]|$)`, "i").test(haystack);
  });
}

function listFiles(rootDir) {
  const files = [];

  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      files.push(fullPath);
    }
  }

  walk(rootDir);
  return files;
}

function isSourceFile(relativePath) {
  return relativePath.startsWith("src/") && SOURCE_EXTENSIONS.includes(path.extname(relativePath));
}

function isTestFile(relativePath) {
  return /(?:^|\/)__tests__\//.test(relativePath) || /\.(?:test|spec)\.[tj]sx?$/.test(relativePath);
}

export function apiRouteToUrlPrefix(relativePath) {
  if (!relativePath.startsWith("src/app/api/") || !relativePath.endsWith("/route.ts")) return null;
  return `/${relativePath.slice("src/app/".length, -"/route.ts".length)}`;
}

function escapeRegexSegment(segment) {
  return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function apiRouteToUrlPattern(relativePath) {
  const apiUrlPrefix = apiRouteToUrlPrefix(relativePath);
  if (!apiUrlPrefix) return null;

  const pattern = apiUrlPrefix
    .split("/")
    .map((segment) => {
      if (/^\[\[\.\.\.[^\]]+\]\]$/.test(segment)) return "(?:/.*)?";
      if (/^\[\.\.\.[^\]]+\]$/.test(segment)) return "/.+";
      if (/^\[[^\]]+\]$/.test(segment)) return "/[^/?#\"'`]+";
      if (segment === "") return "";
      return `/${escapeRegexSegment(segment)}`;
    })
    .join("");

  return new RegExp(`["'\`]${pattern}(?:[/?"'\`#]|$)`);
}

export function hasApiUrlReference(source, apiUrlPrefix) {
  const escaped = apiUrlPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`["'\`]${escaped}(?:[/?"'\`#]|$)`).test(source);
}

export function hasApiRouteReference(source, relativePath) {
  const pattern = apiRouteToUrlPattern(relativePath);
  return pattern ? pattern.test(source) : false;
}

function resolveImport(fromRelativePath, specifier, sourceFileSet) {
  if (!specifier.startsWith(".") && !specifier.startsWith("@/")) return null;

  const fromDir = path.dirname(fromRelativePath);
  const baseRelative = specifier.startsWith("@/")
    ? path.posix.join("src", specifier.slice(2))
    : path.posix.normalize(path.posix.join(fromDir, specifier));

  const candidates = [
    baseRelative,
    ...SOURCE_EXTENSIONS.map((ext) => `${baseRelative}${ext}`),
    ...SOURCE_EXTENSIONS.map((ext) => path.posix.join(baseRelative, `index${ext}`)),
  ];

  return candidates.find((candidate) => sourceFileSet.has(candidate)) ?? null;
}

export function createSurfaceAudit(repoRoot = REPO_ROOT) {
  const allFiles = listFiles(repoRoot).map((fullPath) => toPosix(path.relative(repoRoot, fullPath)));
  const sourceFiles = allFiles.filter(isSourceFile).sort();
  const sourceFileSet = new Set(sourceFiles);
  const fileSources = new Map(
    sourceFiles.map((relativePath) => [
      relativePath,
      fs.readFileSync(path.join(repoRoot, relativePath), "utf8"),
    ]),
  );

  const routeRoots = sourceFiles.filter(isRouteRoot);
  const activeRouteRoots = [];
  const routeRootsNeedingDecision = [];

  for (const routeRoot of routeRoots) {
    const classification = classifyRouteRoot(routeRoot);
    if (classification === "active shipped route root") activeRouteRoots.push(routeRoot);
    if (classification === "needs product decision") routeRootsNeedingDecision.push(routeRoot);
  }

  const importsByFile = new Map();
  const importedByFile = new Map(sourceFiles.map((file) => [file, new Set()]));

  for (const file of sourceFiles) {
    const imports = extractImportSpecifiers(fileSources.get(file))
      .map((specifier) => resolveImport(file, specifier, sourceFileSet))
      .filter(Boolean);
    importsByFile.set(file, imports);
    for (const imported of imports) {
      importedByFile.get(imported)?.add(file);
    }
  }

  const rootsForReachability = [...routeRoots, ...FRAMEWORK_ROOTS];
  const reachable = new Set();
  const stack = [...rootsForReachability];
  while (stack.length > 0) {
    const current = stack.pop();
    if (reachable.has(current)) continue;
    reachable.add(current);
    for (const imported of importsByFile.get(current) ?? []) {
      stack.push(imported);
    }
  }

  const testOnlyFiles = sourceFiles.filter((file) => isTestFile(file));
  const unreachableCandidates = sourceFiles.filter((file) => {
    if (reachable.has(file)) return false;
    if (isRouteRoot(file)) return false;
    if (isTestFile(file)) return false;
    if (file === "src/lib/database.types.ts") return false;
    if (file.startsWith("src/components/landing/")) return false;
    return true;
  });

  const nonTestSourceFiles = sourceFiles.filter((file) => !isTestFile(file));
  const apiRoutesWithNoObviousCaller = routeRoots
    .filter((file) => file.startsWith("src/app/api/"))
    .filter((file) => !EXTERNALLY_CALLED_API_ROUTES.has(file))
    .filter((file) => {
      const nonTestImportCallers = [...(importedByFile.get(file) ?? [])].filter((caller) => !isTestFile(caller));
      if (nonTestImportCallers.length > 0) return false;

      return !nonTestSourceFiles.some((caller) => hasApiRouteReference(fileSources.get(caller), file));
    })
    .sort();

  const productScopeReview = sourceFiles
    .map((file) => ({
      file,
      terms: findProductScopeTerms(file, fileSources.get(file)),
    }))
    .filter((entry) => entry.terms.length > 0)
    .filter((entry) => !isPublicFunnelException(entry.file))
    .sort((a, b) => a.file.localeCompare(b.file));

  return {
    activeRouteRoots: activeRouteRoots.sort(),
    routeRootsNeedingDecision: routeRootsNeedingDecision.sort(),
    activeImportedCode: [...reachable].filter((file) => !isRouteRoot(file)).sort(),
    testOnlyFiles: testOnlyFiles.sort(),
    unreachableCandidates: unreachableCandidates.sort(),
    apiRoutesWithNoObviousCaller,
    productScopeReview,
  };
}

function printList(title, items, format = (item) => item) {
  console.log(`\n## ${title} (${items.length})`);
  if (items.length === 0) {
    console.log("- none");
    return;
  }
  for (const item of items) {
    console.log(`- ${format(item)}`);
  }
}

export function printSurfaceAudit(report) {
  console.log("Outlet Media surface audit");
  console.log("Mode: read-only, no files are modified");

  printList("Active shipped route roots", report.activeRouteRoots);
  printList("Route roots needing product decision", report.routeRootsNeedingDecision);
  printList("Active imported code", report.activeImportedCode);
  printList("Test-only source files", report.testOnlyFiles);
  printList("Unreachable candidates", report.unreachableCandidates);
  printList("API routes with no obvious source caller", report.apiRoutesWithNoObviousCaller);
  printList(
    "Product-scope review matches",
    report.productScopeReview,
    (entry) => `${entry.file} [${[...new Set(entry.terms)].join(", ")}]`,
  );
}

if (process.argv[1] === __filename) {
  printSurfaceAudit(createSurfaceAudit());
}
