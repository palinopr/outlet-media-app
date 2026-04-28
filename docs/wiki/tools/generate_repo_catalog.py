from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parents[3]
WIKI_ROOT = ROOT / "docs" / "wiki"
CATALOG_ROOT = WIKI_ROOT / "pages" / "catalog"

EXCLUDED_DIRS = {
    ".git",
    ".next",
    "node_modules",
    ".claude",
    ".worktrees",
    ".opencode",
    ".superpowers",
    "test-results",
    "tmp-playwright",
    "session",
}

EXCLUDED_PATH_PREFIXES = [
    ".env.local",
    "agent/.next/",
    "agent/dist/",
    "agent/node_modules/",
    "docs/wiki/pages/catalog/",
    "docs/wiki/generated/",
]

TEXT_EXTENSIONS = {
    ".css",
    ".env",
    ".example",
    ".gif",
    ".html",
    ".js",
    ".json",
    ".jsx",
    ".key",
    ".md",
    ".mjs",
    ".pem",
    ".sql",
    ".svg",
    ".test",
    ".ts",
    ".tsx",
    ".txt",
    ".yaml",
    ".yml",
}

BINARY_EXTENSIONS = {
    ".ico",
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".woff",
    ".woff2",
}

CODE_EXTENSIONS = {".ts", ".tsx", ".js", ".jsx", ".mjs"}
RESOLVABLE_EXTENSIONS = ["", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".md", ".sql"]

GROUP_LABELS = {
    "root": "Root Files",
    "github": ".github",
    "mocks": "Root Mocks",
    "tests-root": "Tests / Root",
    "tests-api": "Tests / API",
    "tests-app": "Tests / App",
    "tests-features": "Tests / Features",
    "tests-lib": "Tests / Lib",
    "docs-root": "Docs / Root",
    "docs-context": "Docs / Context",
    "docs-plans": "Docs / Plans",
    "docs-references": "Docs / References",
    "docs-screenshots": "Docs / Screenshots",
    "docs-superpowers-plans": "Docs / Superpowers Plans",
    "docs-superpowers-specs": "Docs / Superpowers Specs",
    "docs-wiki": "Docs / Wiki (manual control pages)",
    "public": "Public Assets",
    "src-root": "src / Root",
    "src-app-root": "src/app / root routes",
    "src-app-admin": "src/app / admin",
    "src-app-api": "src/app / api",
    "src-app-client": "src/app / client",
    "src-components-admin": "src/components / admin",
    "src-components-charts": "src/components / charts",
    "src-components-client": "src/components / client",
    "src-components-landing": "src/components / landing",
    "src-components-shared": "src/components / shared",
    "src-components-ui": "src/components / ui",
    "src-features-access": "src/features / access",
    "src-features-agent-outcomes": "src/features / agent-outcomes",
    "src-features-agents": "src/features / agents",
    "src-features-approvals": "src/features / approvals",
    "src-features-asset-follow-up-items": "src/features / asset-follow-up-items",
    "src-features-assets": "src/features / assets",
    "src-features-campaign-action-items": "src/features / campaign-action-items",
    "src-features-campaign-comments": "src/features / campaign-comments",
    "src-features-campaigns": "src/features / campaigns",
    "src-features-client-agent": "src/features / client-agent",
    "src-features-client-portal": "src/features / client-portal",
    "src-features-clients": "src/features / clients",
    "src-features-conversations": "src/features / conversations",
    "src-features-dashboard": "src/features / dashboard",
    "src-features-event-follow-up-items": "src/features / event-follow-up-items",
    "src-features-events": "src/features / events",
    "src-features-invitations": "src/features / invitations",
    "src-features-notifications": "src/features / notifications",
    "src-features-operations-center": "src/features / operations-center",
    "src-features-reports": "src/features / reports",
    "src-features-settings": "src/features / settings",
    "src-features-shared": "src/features / shared",
    "src-features-system-events": "src/features / system-events",
    "src-features-users": "src/features / users",
    "src-features-workflow": "src/features / workflow",
    "src-features-root": "src/features / root files",
    "src-hooks": "src / hooks",
    "src-lib": "src/lib",
    "src-scripts": "src / scripts",
    "agent-root": "agent / root",
    "agent-config": "agent / config",
    "agent-context": "agent / context",
    "agent-prompts": "agent / prompts",
    "agent-scripts": "agent / scripts",
    "agent-src-root": "agent/src / root",
    "agent-src-discord": "agent/src / discord",
    "agent-src-events": "agent/src / events",
    "agent-src-services": "agent/src / services",
    "agent-src-utils": "agent/src / utils",
    "supabase-root": "supabase / root",
    "supabase-migrations": "supabase / migrations",
}

IMPORT_PATTERN = re.compile(
    r"^\s*(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?[\"']([^\"']+)[\"']",
    re.M,
)
EXTRA_IMPORT_PATTERNS = [
    re.compile(r"\bimport\(\s*[\"']([^\"']+)[\"']\s*\)"),
    re.compile(r"\b(?:vi\.)?mock\(\s*[\"']([^\"']+)[\"']"),
    re.compile(r"\brequire\(\s*[\"']([^\"']+)[\"']\s*\)"),
]

EXPORT_PATTERNS = [
    r"export\s+default\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)",
    r"export\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)",
    r"export\s+const\s+([A-Za-z0-9_]+)",
    r"export\s+class\s+([A-Za-z0-9_]+)",
    r"export\s+type\s+([A-Za-z0-9_]+)",
    r"export\s+interface\s+([A-Za-z0-9_]+)",
    r"export\s+enum\s+([A-Za-z0-9_]+)",
]

DEFINITION_PATTERNS = [
    r"^\s*(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s+([A-Za-z0-9_]+)",
    r"^\s*(?:export\s+)?const\s+([A-Za-z0-9_]+)\s*=",
    r"^\s*(?:export\s+)?class\s+([A-Za-z0-9_]+)",
    r"^\s*(?:export\s+)?type\s+([A-Za-z0-9_]+)",
    r"^\s*(?:export\s+)?interface\s+([A-Za-z0-9_]+)",
    r"^\s*(?:export\s+)?enum\s+([A-Za-z0-9_]+)",
]

SYMBOL_DETAIL_PATTERNS = [
    (r"^export\s+default\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)", "default function", True),
    (r"^export\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)", "function", True),
    (r"^(?:async\s+)?function\s+([A-Za-z0-9_]+)", "function", False),
    (r"^export\s+const\s+([A-Za-z0-9_]+)\s*=", "const", True),
    (r"^const\s+([A-Za-z0-9_]+)\s*=", "const", False),
    (r"^export\s+class\s+([A-Za-z0-9_]+)", "class", True),
    (r"^class\s+([A-Za-z0-9_]+)", "class", False),
    (r"^export\s+type\s+([A-Za-z0-9_]+)", "type", True),
    (r"^type\s+([A-Za-z0-9_]+)", "type", False),
    (r"^export\s+interface\s+([A-Za-z0-9_]+)", "interface", True),
    (r"^interface\s+([A-Za-z0-9_]+)", "interface", False),
    (r"^export\s+enum\s+([A-Za-z0-9_]+)", "enum", True),
    (r"^enum\s+([A-Za-z0-9_]+)", "enum", False),
]


def sh(command: list[str]) -> str:
    return subprocess.check_output(command, cwd=ROOT, text=True)


def load_git_status() -> dict[str, str]:
    status: dict[str, str] = {}
    output = sh(["git", "status", "--short"])
    for raw in output.splitlines():
        if not raw:
            continue
        code = raw[:2]
        path = raw[3:]
        if " -> " in path:
            path = path.split(" -> ", 1)[1]
        if code == "??":
            status[path] = "untracked"
        elif "D" in code:
            status[path] = "deleted"
        elif "M" in code:
            status[path] = "modified"
        elif "A" in code:
            status[path] = "added"
        else:
            status[path] = code.strip() or "changed"
    return status


GIT_STATUS = load_git_status()


def is_excluded(rel_path: str) -> bool:
    parts = rel_path.split("/")
    if any(part in EXCLUDED_DIRS for part in parts[:-1]):
        return True
    return any(rel_path.startswith(prefix) for prefix in EXCLUDED_PATH_PREFIXES)


def iter_repo_files() -> Iterable[str]:
    for dirpath, dirnames, filenames in os.walk(ROOT):
        rel_dir = os.path.relpath(dirpath, ROOT)
        if rel_dir == ".":
            rel_dir = ""
        dirnames[:] = [
            d
            for d in dirnames
            if not is_excluded(f"{rel_dir}/{d}".strip("/"))
        ]
        for filename in filenames:
            rel_path = f"{rel_dir}/{filename}".strip("/")
            if not rel_path or is_excluded(rel_path):
                continue
            yield rel_path


def group_for(rel_path: str) -> str:
    if rel_path.startswith("src/app/admin/"):
        return "src-app-admin"
    if rel_path.startswith("src/app/api/"):
        return "src-app-api"
    if rel_path.startswith("src/app/client/"):
        return "src-app-client"
    if rel_path.startswith("src/app/"):
        return "src-app-root"
    if rel_path.startswith("src/components/"):
        second = rel_path.split("/")[2]
        return f"src-components-{second}"
    if rel_path.startswith("src/features/"):
        parts = rel_path.split("/")
        if len(parts) == 3:
            return "src-features-root"
        second = parts[2]
        return f"src-features-{second}"
    if rel_path.startswith("src/lib/"):
        return "src-lib"
    if rel_path.startswith("src/hooks/"):
        return "src-hooks"
    if rel_path.startswith("src/scripts/"):
        return "src-scripts"
    if rel_path.startswith("src/"):
        return "src-root"

    if rel_path.startswith("agent/src/discord/"):
        return "agent-src-discord"
    if rel_path.startswith("agent/src/events/"):
        return "agent-src-events"
    if rel_path.startswith("agent/src/services/"):
        return "agent-src-services"
    if rel_path.startswith("agent/src/utils/"):
        return "agent-src-utils"
    if rel_path.startswith("agent/src/"):
        return "agent-src-root"
    if rel_path.startswith("agent/config/"):
        return "agent-config"
    if rel_path.startswith("agent/context/"):
        return "agent-context"
    if rel_path.startswith("agent/prompts/"):
        return "agent-prompts"
    if rel_path.startswith("agent/scripts/"):
        return "agent-scripts"
    if rel_path.startswith("agent/"):
        return "agent-root"

    if rel_path.startswith("docs/context/"):
        return "docs-context"
    if rel_path.startswith("docs/references/"):
        return "docs-references"
    if rel_path.startswith("docs/screenshots/"):
        return "docs-screenshots"
    if rel_path.startswith("docs/wiki/"):
        return "docs-wiki"
    if rel_path.startswith("docs/"):
        return "docs-root"

    if rel_path.startswith("__tests__/api/"):
        return "tests-api"
    if rel_path.startswith("__tests__/app/"):
        return "tests-app"
    if rel_path.startswith("__tests__/features/"):
        return "tests-features"
    if rel_path.startswith("__tests__/lib/"):
        return "tests-lib"
    if rel_path.startswith("__tests__/"):
        return "tests-root"

    if rel_path.startswith("supabase/migrations/"):
        return "supabase-migrations"
    if rel_path.startswith("supabase/"):
        return "supabase-root"

    if rel_path.startswith(".github/"):
        return "github"
    if rel_path.startswith("__mocks__/"):
        return "mocks"
    if rel_path.startswith("public/"):
        return "public"
    return "root"


def system_for(rel_path: str) -> str:
    if rel_path.startswith("src/"):
        return "web"
    if rel_path.startswith("agent/"):
        return "agent"
    if rel_path.startswith("supabase/"):
        return "database"
    if rel_path.startswith("__tests__/"):
        return "tests"
    if rel_path.startswith("docs/"):
        return "docs"
    if rel_path.startswith("public/"):
        return "public"
    if rel_path.startswith(".github/"):
        return "github"
    return "root"


def ownership_for(rel_path: str) -> str:
    if rel_path.startswith("src/app/admin/"):
        return "web admin route surface"
    if rel_path.startswith("src/app/client/"):
        return "web client route surface"
    if rel_path.startswith("src/app/api/"):
        return "web API route surface"
    if rel_path.startswith("src/app/"):
        return "web root/shared route surface"
    if rel_path.startswith("src/components/admin/"):
        return "shared admin UI components"
    if rel_path.startswith("src/components/client/"):
        return "shared client UI components"
    if rel_path.startswith("src/components/charts/"):
        return "shared chart UI components"
    if rel_path.startswith("src/components/landing/"):
        return "landing page UI components"
    if rel_path.startswith("src/components/shared/"):
        return "shared app components"
    if rel_path.startswith("src/components/ui/"):
        return "UI primitive / design-system components"
    if rel_path.startswith("src/features/"):
        parts = rel_path.split("/")
        if len(parts) == 3:
            return "feature-layer root file"
        return f"feature module: {parts[2]}"
    if rel_path.startswith("src/lib/"):
        return "shared web library"
    if rel_path.startswith("src/hooks/"):
        return "shared hook layer"
    if rel_path.startswith("src/scripts/"):
        return "web/dev script"
    if rel_path.startswith("src/"):
        return "web source"

    if rel_path.startswith("agent/src/discord/"):
        return "agent Discord adapter layer"
    if rel_path.startswith("agent/src/events/"):
        return "agent event handling layer"
    if rel_path.startswith("agent/src/services/"):
        return "agent runtime service layer"
    if rel_path.startswith("agent/src/utils/"):
        return "agent utility layer"
    if rel_path.startswith("agent/src/"):
        return "agent runtime source"
    if rel_path.startswith("agent/prompts/"):
        return "agent prompt definition"
    if rel_path.startswith("agent/context/"):
        return "agent account/context notes"
    if rel_path.startswith("agent/config/"):
        return "agent config/data"
    if rel_path.startswith("agent/scripts/"):
        return "agent script/tooling"
    if rel_path.startswith("agent/"):
        return "agent root/runtime metadata"

    if rel_path.startswith("docs/context/"):
        return "durable context documentation"
    if rel_path.startswith("docs/references/"):
        return "reference documentation"
    if rel_path.startswith("docs/screenshots/"):
        return "visual reference assets"
    if rel_path.startswith("docs/wiki/"):
        return "repo wiki source"
    if rel_path.startswith("docs/"):
        return "documentation"

    if rel_path.startswith("__tests__/api/"):
        return "API test suite"
    if rel_path.startswith("__tests__/app/"):
        return "app route/surface test suite"
    if rel_path.startswith("__tests__/features/"):
        return "feature test suite"
    if rel_path.startswith("__tests__/lib/"):
        return "library test suite"
    if rel_path.startswith("__tests__/"):
        return "test suite"

    if rel_path.startswith("supabase/migrations/"):
        return "database migration history"
    if rel_path.startswith("supabase/"):
        return "database asset"

    if rel_path.startswith("public/"):
        return "public static asset"
    if rel_path.startswith(".github/"):
        return "GitHub workflow/config"
    if rel_path.startswith("__mocks__/"):
        return "test mock/stub"
    return "repo root"


def is_probably_text(path: Path) -> bool:
    suffix = path.suffix.lower()
    if suffix in BINARY_EXTENSIONS:
        return False
    if suffix in TEXT_EXTENSIONS:
        return True
    try:
        with path.open("rb") as f:
            chunk = f.read(2048)
        return b"\x00" not in chunk
    except OSError:
        return False


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def escape_md(text: str) -> str:
    return text.replace("|", "\\|").replace("\n", " ").strip()


def truncate(text: str, limit: int = 220) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) <= limit:
        return text
    return text[: limit - 1].rstrip() + "…"


def safe_slug(text: str) -> str:
    slug = text.strip().lower()
    slug = slug.replace("/", "-")
    slug = slug.replace("[", "").replace("]", "")
    slug = re.sub(r"[^a-z0-9._-]+", "-", slug)
    slug = re.sub(r"-+", "-", slug).strip("-")
    return slug or "index"


def route_path_from_app_file(rel_path: str) -> str:
    parts = Path(rel_path).parts
    if parts[:2] != ("src", "app"):
        return ""
    route_parts = list(parts[2:-1])
    if not route_parts:
        return "/"
    return "/" + "/".join(route_parts)


def is_special_app_router_file(rel_path: str) -> bool:
    return rel_path.endswith(("page.tsx", "layout.tsx", "loading.tsx", "route.ts"))


def unique(items: Iterable[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for item in items:
        if item and item not in seen:
            seen.add(item)
            out.append(item)
    return out


def list_to_text(items: list[str], limit: int = 12, empty: str = "none") -> str:
    if not items:
        return empty
    shown = items[:limit]
    text = ", ".join(shown)
    if len(items) > limit:
        text += f", … (+{len(items) - limit} more)"
    return text


def resolve_candidate_base(candidate_base: Path) -> str:
    candidates: list[Path] = []

    if candidate_base.suffix:
        candidates.append(candidate_base)
        if candidate_base.suffix.lower() in {".js", ".jsx", ".mjs", ".cjs"}:
            stem = candidate_base.with_suffix("")
            for ext in [".ts", ".tsx", ".js", ".jsx", ".mjs"]:
                candidates.append(stem.with_suffix(ext))
    else:
        for ext in RESOLVABLE_EXTENSIONS:
            candidates.append(Path(str(candidate_base) + ext))

    if candidate_base.is_dir() or not candidate_base.suffix:
        for ext in RESOLVABLE_EXTENSIONS[1:]:
            candidates.append(candidate_base / f"index{ext}")

    for candidate in unique(path.as_posix() for path in candidates):
        candidate_path = Path(candidate)
        if candidate_path.exists() and candidate_path.is_file():
            return candidate_path.relative_to(ROOT).as_posix()

    try:
        return candidate_base.relative_to(ROOT).as_posix()
    except ValueError:
        return candidate_base.as_posix()


def resolve_internal_import(source_rel_path: str, spec: str) -> str:
    if spec.startswith("@/"):
        candidate_base = (ROOT / "src" / spec[2:]).resolve()
    elif spec.startswith(("src/", "agent/", "docs/", "supabase/", "__tests__/")):
        candidate_base = (ROOT / spec).resolve()
    elif spec.startswith("."):
        source_parent = (ROOT / source_rel_path).parent
        candidate_base = (source_parent / spec).resolve()
    else:
        return spec

    try:
        candidate_base.relative_to(ROOT)
    except ValueError:
        return spec

    return resolve_candidate_base(candidate_base)


def classify_imports(source_rel_path: str, content: str) -> tuple[list[str], list[str]]:
    modules = list(IMPORT_PATTERN.findall(content))
    for pattern in EXTRA_IMPORT_PATTERNS:
        modules.extend(pattern.findall(content))
    modules = unique(modules)
    internal: list[str] = []
    external: list[str] = []
    for module in modules:
        if module.startswith((".", "@/", "src/", "agent/", "docs/", "supabase/", "__tests__/")):
            internal.append(resolve_internal_import(source_rel_path, module))
        else:
            external.append(module)
    return unique(internal), unique(external)


def extract_exports(content: str) -> list[str]:
    exports = unique(
        match
        for pattern in EXPORT_PATTERNS
        for match in re.findall(pattern, content)
    )
    for block in re.findall(r"export\s*\{([^}]+)\}", content, flags=re.S):
        for piece in block.split(","):
            name = piece.strip()
            if not name:
                continue
            if " as " in name:
                name = name.split(" as ")[-1].strip()
            exports.append(name)
    if re.search(r"export\s+default\b", content) and "default" not in exports:
        exports.append("default")
    return unique(exports)


def extract_definitions(content: str) -> list[str]:
    items = unique(
        match
        for pattern in DEFINITION_PATTERNS
        for match in re.findall(pattern, content, flags=re.M)
    )
    return items


def extract_symbol_details(content: str) -> list[str]:
    details: list[str] = []
    seen: set[str] = set()
    for pattern, kind, exported in SYMBOL_DETAIL_PATTERNS:
        for match in re.findall(pattern, content, flags=re.M):
            label = f"{kind} {match}"
            if exported:
                label += " (exported)"
            if label not in seen:
                seen.add(label)
                details.append(label)
    return details


def extract_route_handlers(content: str) -> list[str]:
    return unique(
        re.findall(
            r"export\s+(?:async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)\b",
            content,
        )
    )


def extract_tests(content: str) -> list[str]:
    return unique(re.findall(r"(?:describe|it|test)\(\s*['\"]([^'\"]+)['\"]", content))


def extract_headings(content: str) -> list[str]:
    return unique(re.findall(r"^#{1,6}\s+(.+)$", content, flags=re.M))


def extract_json_details(content: str) -> tuple[list[str], list[str], str]:
    try:
        data = json.loads(content)
    except Exception:
        keys = unique(re.findall(r'"([^"]+)"\s*:', content))
        return keys[:20], [], "unparsed JSON-like content"

    if isinstance(data, dict):
        keys = list(data.keys())[:20]
        scripts = list(data.get("scripts", {}).keys())[:20] if isinstance(data.get("scripts"), dict) else []
        shape = "JSON object"
        return keys, scripts, shape
    if isinstance(data, list):
        return [], [], f"JSON array ({len(data)} items)"
    return [], [], f"JSON value ({type(data).__name__})"


def extract_sql_objects(content: str) -> list[str]:
    objects: list[str] = []
    patterns = [
        (r"create\s+table\s+(?:if\s+not\s+exists\s+)?([a-zA-Z0-9_\.]+)", "create table"),
        (r"alter\s+table\s+([a-zA-Z0-9_\.]+)", "alter table"),
        (r"create\s+(?:or\s+replace\s+)?function\s+([a-zA-Z0-9_\.]+)", "function"),
        (r"create\s+policy\s+([^\n]+?)\s+on\s+([a-zA-Z0-9_\.]+)", "policy"),
        (r"create\s+(?:materialized\s+)?view\s+([a-zA-Z0-9_\.]+)", "view"),
        (r"create\s+index\s+(?:if\s+not\s+exists\s+)?([a-zA-Z0-9_\.]+)", "index"),
    ]
    for pattern, label in patterns:
        for match in re.findall(pattern, content, flags=re.I):
            if isinstance(match, tuple):
                objects.append(f"{label}: {' on '.join(match)}")
            else:
                objects.append(f"{label}: {match}")
    return unique(objects)


def normalize_db_name(name: str) -> str:
    return name.strip().strip('"').split(".")[-1]


def extract_database_entities(content: str) -> list[tuple[str, str]]:
    entities: list[tuple[str, str]] = []
    patterns = [
        (r"create\s+table\s+(?:if\s+not\s+exists\s+)?([a-zA-Z0-9_\.]+)", "table"),
        (r"alter\s+table\s+([a-zA-Z0-9_\.]+)", "table"),
        (r"create\s+(?:or\s+replace\s+)?function\s+([a-zA-Z0-9_\.]+)", "function"),
        (r"create\s+(?:materialized\s+)?view\s+([a-zA-Z0-9_\.]+)", "view"),
        (r"create\s+policy\s+[^\n]+?\s+on\s+([a-zA-Z0-9_\.]+)", "table"),
        (r"create\s+trigger\s+([a-zA-Z0-9_\.]+)", "trigger"),
    ]
    for pattern, kind in patterns:
        for match in re.findall(pattern, content, flags=re.I):
            entities.append((kind, normalize_db_name(match)))
    return unique(entities)


def construction_details(rel_path: str, kind: str, content: str | None) -> list[str]:
    details: list[str] = []
    suffix = Path(rel_path).suffix.lower()

    if rel_path.endswith("page.tsx"):
        details.append("App Router page")
    elif rel_path.endswith("layout.tsx"):
        details.append("App Router layout")
    elif rel_path.endswith("loading.tsx"):
        details.append("App Router loading UI")
    elif rel_path.endswith("route.ts"):
        details.append("App Router route handler")

    if ".test." in rel_path or rel_path.startswith("__tests__/"):
        details.append("test specification")
    elif suffix in {".tsx", ".jsx"}:
        details.append("component/UI-oriented module")
    elif suffix in {".ts", ".js", ".mjs"}:
        details.append("code module")
    elif suffix == ".md":
        details.append("markdown document")
    elif suffix == ".json":
        details.append("JSON configuration/data file")
    elif suffix == ".sql":
        details.append("SQL migration/query file")
    elif suffix in BINARY_EXTENSIONS or rel_path.startswith("public/"):
        details.append("asset file")

    if content:
        if "use client" in content:
            details.append("contains `use client`")
        if re.search(r"^---\s*$", content, flags=re.M):
            if suffix == ".md":
                details.append("frontmatter-like markdown structure")
        route_handlers = extract_route_handlers(content)
        if route_handlers:
            details.append("handlers: " + ", ".join(route_handlers))

    if rel_path.startswith("agent/prompts/"):
        details.append("LLM prompt source")
    if rel_path.startswith("supabase/migrations/"):
        details.append("ordered migration history file")

    return unique(details)


def summarize_code(rel_path: str, content: str) -> str:
    pieces: list[str] = []
    exports = extract_exports(content)
    route_handlers = extract_route_handlers(content)
    tests = extract_tests(content)[:3]
    internal_imports, external_imports = classify_imports(rel_path, content)

    if "use client" in content:
        pieces.append("contains `use client`")
    if rel_path.startswith("src/app/"):
        route = route_path_from_app_file(rel_path)
        if rel_path.endswith("page.tsx"):
            pieces.append(f"Next.js page for `{route}`")
        elif rel_path.endswith("layout.tsx"):
            pieces.append(f"Next.js layout for `{route}`")
        elif rel_path.endswith("loading.tsx"):
            pieces.append(f"Next.js loading UI for `{route}`")
        elif rel_path.endswith("route.ts"):
            pieces.append(f"Next.js route handler for `{route}`")
    if route_handlers:
        pieces.append("route handlers: " + ", ".join(route_handlers))
    if exports:
        pieces.append("exports: " + ", ".join(exports[:8]))
    if tests:
        pieces.append("tests/describes: " + "; ".join(tests))
    if internal_imports:
        pieces.append(f"internal imports: {len(internal_imports)}")
    if external_imports:
        pieces.append(f"package imports: {len(external_imports)}")

    leading_comment = re.search(r"^\s*/\*\*(.*?)\*/", content, flags=re.S)
    if not pieces and leading_comment:
        pieces.append(truncate(re.sub(r"\s*\* ?", " ", leading_comment.group(1))))

    if not pieces:
        defined = extract_definitions(content)
        if defined:
            pieces.append("defines: " + ", ".join(defined[:6]))
        else:
            pieces.append("module content documented by source only")
    return truncate("; ".join(pieces), 320)


def summarize_markdown(content: str) -> str:
    headings = extract_headings(content)
    if headings:
        return truncate("headings: " + " | ".join(headings[:6]), 320)
    first_line = next((line.strip() for line in content.splitlines() if line.strip()), "markdown file")
    return truncate(first_line, 320)


def summarize_json(content: str) -> str:
    keys, scripts, shape = extract_json_details(content)
    pieces = [shape]
    if keys:
        pieces.append("keys: " + ", ".join(keys[:10]))
    if scripts:
        pieces.append("scripts: " + ", ".join(scripts[:10]))
    return truncate("; ".join(pieces), 320)


def summarize_sql(content: str) -> str:
    objects = extract_sql_objects(content)
    if objects:
        return truncate("; ".join(objects[:8]), 320)
    return "SQL migration or query file"


def summarize_plain_text(rel_path: str, content: str) -> str:
    basename = Path(rel_path).name

    if basename.startswith(".env") or rel_path.endswith((".example", ".local")):
        keys = []
        for line in content.splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            keys.append(line.split("=", 1)[0].strip())
        if keys:
            return truncate("env keys: " + ", ".join(keys[:15]), 320)

    if basename in {".gitignore", ".railwayignore"}:
        patterns = []
        for line in content.splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            patterns.append(line)
        if patterns:
            return truncate("ignore patterns: " + ", ".join(patterns[:15]), 320)

    lines = [line.strip() for line in content.splitlines() if line.strip()]
    if lines:
        return truncate("text lines: " + " | ".join(lines[:6]), 320)
    return "plain-text file"


def summarize_asset(path: Path) -> str:
    size = path.stat().st_size if path.exists() else 0
    return f"asset/binary file; size: {size} bytes"


def classify_file(rel_path: str) -> str:
    path = Path(rel_path)
    suffix = path.suffix.lower()
    basename = path.name
    if rel_path.endswith("page.tsx"):
        return "Next.js page"
    if rel_path.endswith("layout.tsx"):
        return "Next.js layout"
    if rel_path.endswith("loading.tsx"):
        return "Next.js loading UI"
    if rel_path.endswith("route.ts"):
        return "Next.js route handler"
    if basename.startswith(".env") or rel_path.endswith((".example", ".local")):
        return "env/config text file"
    if basename in {".gitignore", ".railwayignore"}:
        return "ignore file"
    if suffix == ".tsbuildinfo":
        return "TypeScript build info"
    if ".test." in rel_path or rel_path.startswith("__tests__/"):
        return "test file"
    if suffix == ".tsx":
        return "React/TSX module"
    if suffix == ".ts":
        return "TypeScript module"
    if suffix in {".js", ".mjs"}:
        return "JavaScript module"
    if suffix == ".json":
        return "JSON config/data"
    if suffix == ".md":
        return "Markdown doc"
    if suffix == ".sql":
        return "SQL migration/query"
    if suffix in BINARY_EXTENSIONS:
        return "binary asset"
    if suffix == ".svg":
        return "SVG asset"
    return f"file ({suffix or 'no extension'})"


def is_test_file(rel_path: str) -> bool:
    return rel_path.startswith("__tests__/") or ".test." in rel_path


def is_route_file(rel_path: str) -> bool:
    return rel_path.startswith("src/app/") and is_special_app_router_file(rel_path)


def feature_module_name(rel_path: str) -> str | None:
    parts = rel_path.split("/")
    if len(parts) >= 3 and parts[0] == "src" and parts[1] == "features":
        return parts[2]
    return None


def file_metadata(rel_path: str) -> dict[str, object]:
    path = ROOT / rel_path
    group = group_for(rel_path)
    status = GIT_STATUS.get(rel_path, "tracked-clean")
    kind = classify_file(rel_path)
    system = system_for(rel_path)
    ownership = ownership_for(rel_path)
    bytes_size = path.stat().st_size if path.exists() else None

    metadata: dict[str, object] = {
        "path": rel_path,
        "status": status,
        "kind": kind,
        "system": system,
        "group": GROUP_LABELS.get(group, group),
        "ownership": ownership,
        "bytes": bytes_size,
    }

    if path.exists() and is_probably_text(path):
        content = read_text(path)
        suffix = path.suffix.lower()
        metadata["_content"] = content
        metadata["lines"] = content.count("\n") + 1 if content else 0
        metadata["construction"] = construction_details(rel_path, kind, content)

        if rel_path.startswith("src/app/"):
            route_context = route_path_from_app_file(rel_path)
            if is_special_app_router_file(rel_path):
                metadata["route"] = route_context
            else:
                metadata["route_context"] = route_context

        if suffix in CODE_EXTENSIONS:
            internal_imports, external_imports = classify_imports(rel_path, content)
            metadata["internal_imports"] = internal_imports
            metadata["external_imports"] = external_imports
            metadata["exports"] = extract_exports(content)
            metadata["defines"] = extract_definitions(content)
            metadata["symbol_details"] = extract_symbol_details(content)[:24]
            metadata["tests_named"] = extract_tests(content)[:12]
            metadata["route_handlers"] = extract_route_handlers(content)
            metadata["summary"] = summarize_code(rel_path, content)
        elif suffix == ".md":
            metadata["headings"] = extract_headings(content)[:20]
            metadata["summary"] = summarize_markdown(content)
        elif suffix == ".json":
            keys, scripts, shape = extract_json_details(content)
            metadata["json_shape"] = shape
            metadata["json_keys"] = keys
            metadata["json_scripts"] = scripts
            metadata["summary"] = summarize_json(content)
        elif suffix == ".sql":
            metadata["sql_objects"] = extract_sql_objects(content)[:20]
            metadata["summary"] = summarize_sql(content)
        else:
            metadata["summary"] = summarize_plain_text(rel_path, content)
    else:
        metadata["lines"] = None
        metadata["construction"] = construction_details(rel_path, kind, None)
        metadata["summary"] = summarize_asset(path)

    return metadata


def build_dependency_graph(metadata_by_path: dict[str, dict[str, object]]) -> tuple[dict[str, list[str]], dict[str, list[str]]]:
    file_set = set(metadata_by_path)
    graph: dict[str, list[str]] = {}
    reverse_graph: dict[str, list[str]] = {path: [] for path in metadata_by_path}

    for path, metadata in metadata_by_path.items():
        imports = [item for item in metadata.get("internal_imports", []) if isinstance(item, str)]
        resolved = [item for item in imports if item in file_set]
        unresolved = [item for item in imports if item not in file_set]
        metadata["internal_imports"] = resolved
        if unresolved:
            metadata["internal_imports_unresolved"] = unresolved
        graph[path] = unique(resolved)
        for target in graph[path]:
            reverse_graph.setdefault(target, []).append(path)

    for path in reverse_graph:
        reverse_graph[path] = unique(reverse_graph[path])

    return graph, reverse_graph


def reachable_matches(start: str, reverse_graph: dict[str, list[str]], predicate) -> list[str]:
    seen = {start}
    queue = list(reverse_graph.get(start, []))
    matches: list[str] = []

    while queue:
        current = queue.pop(0)
        if current in seen:
            continue
        seen.add(current)
        if predicate(current):
            matches.append(current)
        queue.extend(reverse_graph.get(current, []))

    return unique(matches)


def transitive_dependencies(start: str, graph: dict[str, list[str]]) -> list[str]:
    seen = {start}
    queue = list(graph.get(start, []))
    ordered: list[str] = []

    while queue:
        current = queue.pop(0)
        if current in seen:
            continue
        seen.add(current)
        ordered.append(current)
        queue.extend(graph.get(current, []))

    return ordered


def route_sort_key(path: str) -> tuple[str, str]:
    metadata_path = path
    route = route_path_from_app_file(metadata_path) if metadata_path.startswith("src/app/") else metadata_path
    return route, metadata_path


def enrich_cross_links(metadata_by_path: dict[str, dict[str, object]]) -> tuple[dict[str, list[str]], dict[str, list[str]]]:
    graph, reverse_graph = build_dependency_graph(metadata_by_path)

    for path, metadata in metadata_by_path.items():
        direct_imported_by = reverse_graph.get(path, [])
        if direct_imported_by:
            metadata["imported_by"] = direct_imported_by
            metadata["used_by_groups"] = unique(GROUP_LABELS.get(group_for(item), group_for(item)) for item in direct_imported_by)

        imports = graph.get(path, [])
        if imports:
            metadata["depends_on_groups"] = unique(GROUP_LABELS.get(group_for(item), group_for(item)) for item in imports)

        direct_tests = [item for item in direct_imported_by if is_test_file(item)]
        if direct_tests:
            metadata["tests_related_direct"] = direct_tests

        direct_routes = [item for item in direct_imported_by if is_route_file(item)]
        if direct_routes:
            metadata["routes_related_direct"] = direct_routes

        transitive_tests = reachable_matches(path, reverse_graph, is_test_file)
        if transitive_tests:
            metadata["tests_related"] = transitive_tests

        transitive_routes = reachable_matches(path, reverse_graph, is_route_file)
        if transitive_routes:
            metadata["route_owners"] = transitive_routes

        module = feature_module_name(path)
        if module:
            metadata["feature_module"] = module

    return graph, reverse_graph


def write_group_dependency_page(
    generated_at: str,
    groups: dict[str, list[dict[str, object]]],
    graph: dict[str, list[str]],
    reverse_graph: dict[str, list[str]],
) -> None:
    outgoing: dict[str, Counter[str]] = defaultdict(Counter)
    incoming: dict[str, Counter[str]] = defaultdict(Counter)

    for source, targets in graph.items():
        source_group = GROUP_LABELS.get(group_for(source), group_for(source))
        for target in targets:
            target_group = GROUP_LABELS.get(group_for(target), group_for(target))
            if source_group == target_group:
                continue
            outgoing[source_group][target_group] += 1
            incoming[target_group][source_group] += 1

    lines = [
        "# Group Dependency Map",
        "",
        f"Generated from the current working tree on {generated_at}.",
        "",
        "This page summarizes internal file-to-file dependencies rolled up to the catalog group level.",
        "",
    ]

    for group in sorted(groups):
        label = GROUP_LABELS.get(group, group)
        lines.extend([
            f"## {label}",
            f"- Files in group: {len(groups[group])}",
            f"- Depends on groups: {escape_md(list_to_text([f'{name} ({count})' for name, count in outgoing[label].most_common()], limit=12))}",
            f"- Used by groups: {escape_md(list_to_text([f'{name} ({count})' for name, count in incoming[label].most_common()], limit=12))}",
            "",
        ])

    write_text(CATALOG_ROOT / "group-dependencies.md", "\n".join(lines).rstrip() + "\n")


def write_feature_dependency_page(
    generated_at: str,
    groups: dict[str, list[dict[str, object]]],
    graph: dict[str, list[str]],
    reverse_graph: dict[str, list[str]],
) -> None:
    feature_groups = [group for group in sorted(groups) if group.startswith("src-features-") and group != "src-features-root"]
    lines = [
        "# Feature Module Dependency Map",
        "",
        f"Generated from the current working tree on {generated_at}.",
        "",
        "This page rolls internal dependencies up to the `src/features/*` module level and shows which route/component groups use each feature module.",
        "",
    ]

    for group in feature_groups:
        label = GROUP_LABELS.get(group, group)
        files = groups[group]
        paths = [str(item["path"]) for item in files]
        outgoing_features: Counter[str] = Counter()
        outgoing_groups: Counter[str] = Counter()
        incoming_groups: Counter[str] = Counter()
        incoming_routes: set[str] = set()

        for path in paths:
            for target in graph.get(path, []):
                target_group_key = group_for(target)
                target_group = GROUP_LABELS.get(target_group_key, target_group_key)
                if target_group != label:
                    outgoing_groups[target_group] += 1
                target_feature = feature_module_name(target)
                if target_feature and target_feature != feature_module_name(path):
                    outgoing_features[target_feature] += 1

            for source in reverse_graph.get(path, []):
                source_group_key = group_for(source)
                source_group = GROUP_LABELS.get(source_group_key, source_group_key)
                if source_group != label:
                    incoming_groups[source_group] += 1
                if is_route_file(source):
                    incoming_routes.add(source)

        lines.extend([
            f"## {label}",
            f"- Files in module: {len(files)}",
            f"- Depends on feature modules: {escape_md(list_to_text([f'{name} ({count})' for name, count in outgoing_features.most_common()], limit=12))}",
            f"- Depends on groups: {escape_md(list_to_text([f'{name} ({count})' for name, count in outgoing_groups.most_common()], limit=12))}",
            f"- Used by groups: {escape_md(list_to_text([f'{name} ({count})' for name, count in incoming_groups.most_common()], limit=12))}",
            f"- Direct route users: {escape_md(list_to_text(sorted(incoming_routes), limit=12))}",
            "",
        ])

    write_text(CATALOG_ROOT / "feature-dependencies.md", "\n".join(lines).rstrip() + "\n")


def write_route_stack_page(
    generated_at: str,
    metadata_by_path: dict[str, dict[str, object]],
    graph: dict[str, list[str]],
) -> None:
    route_paths = sorted([path for path in metadata_by_path if is_route_file(path)], key=route_sort_key)
    lines = [
        "# Route Stack Map",
        "",
        f"Generated from the current working tree on {generated_at}.",
        "",
        "This page documents each Next.js special route file and the internal stack it pulls in through direct and transitive imports.",
        "",
    ]

    for route_path in route_paths:
        metadata = metadata_by_path[route_path]
        closure = transitive_dependencies(route_path, graph)
        closure_set = set(closure)
        groups = unique(GROUP_LABELS.get(group_for(path), group_for(path)) for path in closure)
        features = unique(feature_module_name(path) for path in closure if feature_module_name(path))
        libs = [path for path in closure if path.startswith("src/lib/") or path.startswith("agent/src/")]
        related_tests = unique(
            test
            for path in [route_path] + closure
            for test in metadata_by_path.get(path, {}).get("tests_related_direct", [])
            if isinstance(test, str)
        )
        stack_by_group: dict[str, list[str]] = defaultdict(list)
        for path in closure:
            stack_by_group[GROUP_LABELS.get(group_for(path), group_for(path))].append(path)

        lines.extend([
            f"## `{metadata.get('route', route_path)}`",
            f"- Route file: `{route_path}`",
            f"- Type: {metadata['kind']}",
            f"- Ownership: {metadata['ownership']}",
            f"- Direct internal imports: {escape_md(list_to_text([str(v) for v in metadata.get('internal_imports', [])], limit=10))}",
            f"- Transitive internal stack size: {len(closure)}",
            f"- Groups touched: {escape_md(list_to_text(groups, limit=12))}",
            f"- Feature modules touched: {escape_md(list_to_text(features, limit=12))}",
            f"- Shared libs/runtime files touched: {escape_md(list_to_text(libs, limit=10))}",
            f"- Related tests: {escape_md(list_to_text(related_tests, limit=10))}",
            "",
            "### Stack by group",
        ])

        for group_name in sorted(stack_by_group):
            lines.append(f"- {group_name}: {escape_md(list_to_text(stack_by_group[group_name], limit=12))}")
        if not stack_by_group:
            lines.append("- none")
        lines.append("")

    write_text(CATALOG_ROOT / "route-stacks.md", "\n".join(lines).rstrip() + "\n")


def is_key_symbol_file(path: str) -> bool:
    if is_test_file(path):
        return False
    if is_route_file(path):
        return True
    if path.startswith("agent/src/"):
        return True
    if path.startswith("src/features/"):
        parts = path.split("/")
        return len(parts) == 4 and Path(path).suffix.lower() in CODE_EXTENSIONS
    if path.startswith("src/lib/") and Path(path).suffix.lower() in CODE_EXTENSIONS:
        return True
    if path.startswith("src/components/") and Path(path).suffix.lower() in {".tsx", ".ts"}:
        return len(path.split("/")) <= 5
    return False


def write_key_symbol_page(generated_at: str, metadata_by_path: dict[str, dict[str, object]]) -> None:
    sections: list[tuple[str, list[str]]] = [
        ("Web route files", sorted([path for path in metadata_by_path if is_route_file(path)], key=route_sort_key)),
        ("Feature entry files", sorted([path for path in metadata_by_path if path.startswith("src/features/") and is_key_symbol_file(path)])),
        ("Shared web libraries", sorted([path for path in metadata_by_path if path.startswith("src/lib/") and is_key_symbol_file(path)])),
        ("Agent runtime files", sorted([path for path in metadata_by_path if path.startswith("agent/src/") and is_key_symbol_file(path)])),
        ("Shared components", sorted([path for path in metadata_by_path if path.startswith("src/components/") and is_key_symbol_file(path)])),
    ]

    seen: set[str] = set()
    lines = [
        "# Key File Symbol Map",
        "",
        f"Generated from the current working tree on {generated_at}.",
        "",
        "This page highlights key code files and lists their exported symbols, top-level definitions, and route/test ownership links.",
        "",
    ]

    for title, paths in sections:
        filtered = [path for path in paths if path not in seen]
        if not filtered:
            continue
        lines.extend([f"## {title}", ""])
        for path in filtered:
            seen.add(path)
            metadata = metadata_by_path[path]
            lines.extend([
                f"### `{path}`",
                f"- Type: {metadata['kind']}",
                f"- Ownership: {metadata['ownership']}",
            ])
            add_optional(lines, "Route", metadata.get("route"))
            add_optional(lines, "Exports", metadata.get("exports"), limit=16)
            add_optional(lines, "Symbol details", metadata.get("symbol_details"), limit=20)
            add_optional(lines, "Defines", metadata.get("defines"), limit=16)
            add_optional(lines, "Imported by", metadata.get("imported_by"), limit=10)
            add_optional(lines, "Route owners", metadata.get("route_owners"), limit=8)
            add_optional(lines, "Tests related", metadata.get("tests_related"), limit=8)
            lines.append(f"- Contents summary: {escape_md(str(metadata['summary']))}")
            lines.append("")

    write_text(CATALOG_ROOT / "key-file-symbols.md", "\n".join(lines).rstrip() + "\n")


def build_database_registry(metadata_by_path: dict[str, dict[str, object]]) -> dict[str, dict[str, object]]:
    db_objects: dict[str, dict[str, object]] = {}

    for path, metadata in metadata_by_path.items():
        if not path.startswith("supabase/migrations/"):
            continue
        content = metadata.get("_content")
        if not isinstance(content, str):
            continue
        for kind, name in extract_database_entities(content):
            obj = db_objects.setdefault(name, {
                "kinds": set(),
                "defined_in": set(),
                "migration_mentions": set(),
                "references": set(),
                "routes": set(),
                "features": set(),
                "libs": set(),
                "agents": set(),
                "tests": set(),
                "docs": set(),
                "other": set(),
                "groups": Counter(),
            })
            obj["kinds"].add(kind)
            obj["defined_in"].add(path)
            obj["migration_mentions"].add(path)

    searchable_paths = [
        path for path in metadata_by_path
        if not path.startswith("supabase/migrations/") and not path.startswith("docs/wiki/")
    ]

    for name, info in db_objects.items():
        pattern = re.compile(rf"(?<![A-Za-z0-9_]){re.escape(name)}(?![A-Za-z0-9_])")
        for path in searchable_paths:
            metadata = metadata_by_path[path]
            content = metadata.get("_content")
            if not isinstance(content, str):
                continue
            if not pattern.search(content):
                continue
            info["references"].add(path)
            info["groups"][GROUP_LABELS.get(group_for(path), group_for(path))] += 1
            if is_route_file(path):
                info["routes"].add(path)
            elif path.startswith("src/features/"):
                info["features"].add(path)
            elif path.startswith("src/lib/"):
                info["libs"].add(path)
            elif path.startswith("agent/src/"):
                info["agents"].add(path)
            elif is_test_file(path):
                info["tests"].add(path)
            elif path.startswith("docs/"):
                info["docs"].add(path)
            else:
                info["other"].add(path)

    return db_objects


def write_database_map_page(generated_at: str, db_objects: dict[str, dict[str, object]]) -> None:
    lines = [
        "# Database-to-Code Map",
        "",
        f"Generated from the current working tree on {generated_at}.",
        "",
        "This page maps database objects discovered in `supabase/migrations/*` to routes, features, libs, agent files, tests, and docs that mention them.",
        "",
        f"- Database objects tracked: {len(db_objects)}",
        "",
    ]

    for name in sorted(db_objects):
        info = db_objects[name]
        lines.extend([
            f"## `{name}`",
            f"- Kinds: {escape_md(list_to_text(sorted(info['kinds']), limit=10))}",
            f"- Defined in migrations: {escape_md(list_to_text(sorted(info['defined_in']), limit=10))}",
            f"- Mentioned by groups: {escape_md(list_to_text([f'{group} ({count})' for group, count in info['groups'].most_common()], limit=12))}",
            f"- Routes: {escape_md(list_to_text(sorted(info['routes']), limit=10))}",
            f"- Features: {escape_md(list_to_text(sorted(info['features']), limit=10))}",
            f"- Shared libs: {escape_md(list_to_text(sorted(info['libs']), limit=10))}",
            f"- Agent runtime files: {escape_md(list_to_text(sorted(info['agents']), limit=10))}",
            f"- Tests: {escape_md(list_to_text(sorted(info['tests']), limit=10))}",
            f"- Docs: {escape_md(list_to_text(sorted(info['docs']), limit=10))}",
            f"- Other mentions: {escape_md(list_to_text(sorted(info['other']), limit=10))}",
            "",
        ])

    write_text(CATALOG_ROOT / "database-to-code.md", "\n".join(lines).rstrip() + "\n")


def write_supabase_schema_page(generated_at: str, db_objects: dict[str, dict[str, object]]) -> None:
    sections = [
        ("Tables", "table"),
        ("Views", "view"),
        ("Functions", "function"),
        ("Triggers", "trigger"),
    ]

    lines = [
        "# Supabase Schema Map",
        "",
        f"Generated from the current working tree on {generated_at}.",
        "",
        "This page groups migration-discovered database objects by schema kind and records which migrations define them plus how many code/docs references exist outside the migrations.",
        "",
        f"- Database objects tracked: {len(db_objects)}",
        "",
    ]

    for title, kind in sections:
        objects = [name for name, info in db_objects.items() if kind in info["kinds"]]
        lines.extend([f"## {title}", f"- Objects: {len(objects)}", ""])
        for name in sorted(objects):
            info = db_objects[name]
            total_refs = len(info["references"])
            lines.extend([
                f"### `{name}`",
                f"- Kinds: {escape_md(list_to_text(sorted(info['kinds']), limit=10))}",
                f"- Migrations: {escape_md(list_to_text(sorted(info['defined_in']), limit=12))}",
                f"- Non-migration references: {total_refs}",
                f"- Referenced by groups: {escape_md(list_to_text([f'{group} ({count})' for group, count in info['groups'].most_common()], limit=12))}",
                f"- Routes: {escape_md(list_to_text(sorted(info['routes']), limit=8))}",
                f"- Features/libs/agents: {escape_md(list_to_text(sorted(info['features'] | info['libs'] | info['agents']), limit=10))}",
                f"- Tests/docs: {escape_md(list_to_text(sorted(info['tests'] | info['docs']), limit=10))}",
                "",
            ])

    write_text(CATALOG_ROOT / "supabase-schema.md", "\n".join(lines).rstrip() + "\n")


def is_api_route_file(path: str) -> bool:
    return path.startswith("src/app/api/") and path.endswith("/route.ts")


def detect_request_signals(content: str) -> list[str]:
    signals: list[str] = []
    if re.search(r"\b(?:request|req)\.json\(", content):
        signals.append("reads JSON body")
    if re.search(r"\b(?:request|req)\.formData\(", content):
        signals.append("reads form-data body")
    if re.search(r"\b(?:request|req)\.text\(", content):
        signals.append("reads text body")
    if re.search(r"\bheaders\b", content):
        signals.append("reads headers")
    if re.search(r"searchParams", content):
        signals.append("reads query/search params")
    if re.search(r"\bparams\b", content):
        signals.append("uses route params/context params")
    return unique(signals)


def detect_response_signals(content: str) -> list[str]:
    signals: list[str] = []
    if "NextResponse.json" in content:
        signals.append("uses NextResponse.json")
    if "Response.json" in content:
        signals.append("uses Response.json")
    if re.search(r"\bjsonOk\b", content):
        signals.append("uses jsonOk helper")
    if re.search(r"\bjsonError\b", content):
        signals.append("uses jsonError helper")
    statuses = unique(re.findall(r"status\s*:\s*(\d{3})", content))
    if statuses:
        signals.append("explicit statuses: " + ", ".join(statuses))
    return unique(signals)


def detect_auth_signals(content: str) -> list[str]:
    signals: list[str] = []
    if "@clerk/nextjs/server" in content:
        signals.append("imports Clerk server auth")
    if re.search(r"\bauth\(", content):
        signals.append("calls auth()")
    if re.search(r"\bcurrentUser\(", content):
        signals.append("calls currentUser()")
    if re.search(r"requireAdmin|ensureAdmin|requireOwner", content):
        signals.append("contains explicit access/role guard helper usage")
    if re.search(r"member-access|client_members|client_member_", content):
        signals.append("references membership/scope access concepts")
    return unique(signals)


def detect_behavior_signals(content: str) -> list[str]:
    signals: list[str] = []
    if re.search(r"\bredirect\(", content):
        signals.append("calls redirect()")
    if re.search(r"\bnotFound\(", content):
        signals.append("calls notFound()")
    if re.search(r"\brevalidatePath\(", content):
        signals.append("calls revalidatePath()")
    if re.search(r"\brevalidateTag\(", content):
        signals.append("calls revalidateTag()")
    if re.search(r"\bunstable_noStore\(", content):
        signals.append("calls unstable_noStore()")
    if "'use client'" in content or '"use client"' in content:
        signals.append("client component/module")
    if "'use server'" in content or '"use server"' in content:
        signals.append("server action/module")
    if re.search(r"generateMetadata", content):
        signals.append("defines generateMetadata")
    if re.search(r"dynamic\s*=", content):
        signals.append("sets dynamic rendering mode")
    return unique(signals)


def build_db_reverse_index(db_objects: dict[str, dict[str, object]]) -> dict[str, list[str]]:
    reverse: dict[str, list[str]] = defaultdict(list)
    for name, info in db_objects.items():
        for bucket in ["defined_in", "references", "routes", "features", "libs", "agents", "tests", "docs", "other"]:
            for path in info.get(bucket, set()):
                reverse[str(path)].append(name)
    return {path: unique(names) for path, names in reverse.items()}


def db_names_for_paths(paths: list[str], db_reverse: dict[str, list[str]]) -> list[str]:
    return unique(name for path in paths for name in db_reverse.get(path, []))


def is_auth_related_db_object(name: str) -> bool:
    return bool(re.search(r"member|invite|invitation|user|auth|role|permission|oauth|token|session", name))


def auth_related_file(path: str, metadata: dict[str, object]) -> bool:
    content = str(metadata.get("_content", ""))
    if detect_auth_signals(content):
        return True
    if path in {"src/proxy.ts", "src/lib/member-access.ts"}:
        return True
    if "/sign-in/" in path or "/sign-up/" in path:
        return True
    if path.startswith("src/features/access/") or path.startswith("src/features/invitations/"):
        return True
    if path.startswith("src/features/client-portal/") and ("access" in path or "entry" in path or "config" in path):
        return True
    internal_imports = [str(v) for v in metadata.get("internal_imports", [])]
    return any(token in imp for imp in internal_imports for token in ["member-access", "/access", "invitations", "client-portal"])


def workflow_category(name: str) -> str | None:
    if name in {"system_events", "approval_requests", "notifications", "admin_activity"}:
        return "Shared timeline / approvals / notifications"
    if re.search(r"campaign_comments|campaign_action_items|event_follow_up_items|asset_follow_up_items|asset_comments", name):
        return "Campaign / event / asset workflow"
    if re.search(r"agent_tasks|agent_runtime_state|agent_alerts|agent_jobs|runtime_lease|acquire_runtime_lease", name):
        return "Agent runtime workflow"
    if re.search(r"client_agent_threads|client_agent_messages", name):
        return "Client agent conversation workflow"
    return None


def is_workflow_related_file(path: str, metadata: dict[str, object], db_reverse: dict[str, list[str]]) -> bool:
    db_names = db_reverse.get(path, [])
    if any(workflow_category(name) for name in db_names):
        return True
    if any(token in path for token in [
        "system-events",
        "workflow",
        "approvals",
        "notifications",
        "campaign-comments",
        "campaign-action-items",
        "event-follow-up-items",
        "asset-follow-up-items",
        "agent-outcomes",
    ]):
        return True
    content = str(metadata.get("_content", ""))
    return bool(re.search(r"system_events|approval_requests|agent_tasks|notifications|revalidatePath|safeLogAgentTask|campaign_comments|campaign_action_items", content))


def extract_mutation_symbols(metadata: dict[str, object]) -> list[str]:
    names = unique([str(v) for v in metadata.get("exports", [])] + [str(v) for v in metadata.get("defines", [])])
    verbs = (
        "create", "update", "delete", "remove", "add", "append", "assign", "change", "rename", "deactivate",
        "bulk", "sync", "send", "enqueue", "complete", "fail", "approve", "reject", "defer", "request",
        "submit", "revoke", "log", "upsert", "start", "stop"
    )
    return [name for name in names if name and any(name.lower().startswith(verb) for verb in verbs)]


def extract_validation_symbols(metadata: dict[str, object]) -> list[str]:
    names = [str(v) for v in metadata.get("defines", [])]
    return [name for name in names if any(token in name.lower() for token in ["schema", "validator", "shape", "parse"])]


def write_api_contract_page(
    generated_at: str,
    metadata_by_path: dict[str, dict[str, object]],
    graph: dict[str, list[str]],
) -> None:
    route_paths = sorted([path for path in metadata_by_path if is_api_route_file(path)], key=route_sort_key)
    lines = [
        "# API Contract Map",
        "",
        f"Generated from the current working tree on {generated_at}.",
        "",
        "This page documents each `src/app/api/**/route.ts` file with its methods, request/response signals, validation symbols, dependency stack, and related tests.",
        "",
    ]

    for route_path in route_paths:
        metadata = metadata_by_path[route_path]
        content = metadata.get("_content") if isinstance(metadata.get("_content"), str) else ""
        closure = transitive_dependencies(route_path, graph)
        features = unique(feature_module_name(path) for path in closure if feature_module_name(path))
        libs = [path for path in closure if path.startswith("src/lib/")]
        request_signals = detect_request_signals(content)
        response_signals = detect_response_signals(content)
        auth_signals = detect_auth_signals(content)
        validation_symbols = extract_validation_symbols(metadata)

        lines.extend([
            f"## `{metadata.get('route', route_path)}`",
            f"- Route file: `{route_path}`",
            f"- Methods: {escape_md(list_to_text([str(v) for v in metadata.get('route_handlers', [])], limit=10))}",
            f"- Request signals: {escape_md(list_to_text(request_signals, limit=10))}",
            f"- Response signals: {escape_md(list_to_text(response_signals, limit=10))}",
            f"- Auth signals: {escape_md(list_to_text(auth_signals, limit=10))}",
            f"- Validation symbols: {escape_md(list_to_text(validation_symbols, limit=10))}",
            f"- Direct internal imports: {escape_md(list_to_text([str(v) for v in metadata.get('internal_imports', [])], limit=10))}",
            f"- Feature modules touched: {escape_md(list_to_text(features, limit=12))}",
            f"- Shared libs touched: {escape_md(list_to_text(libs, limit=10))}",
            f"- Related tests: {escape_md(list_to_text([str(v) for v in metadata.get('tests_related', [])], limit=10))}",
            f"- Contents summary: {escape_md(str(metadata['summary']))}",
            "",
        ])

    write_text(CATALOG_ROOT / "api-contracts.md", "\n".join(lines).rstrip() + "\n")


def is_surface_entry_file(path: str) -> bool:
    if not (path.startswith("src/app/admin/") or path.startswith("src/app/client/")):
        return False
    return path.endswith(("page.tsx", "layout.tsx", "loading.tsx", "error.tsx"))


def component_category(path: str) -> str | None:
    if path.startswith("src/components/ui/"):
        return "UI primitives"
    if path.startswith("src/components/admin/"):
        return "Shared admin components"
    if path.startswith("src/components/client/"):
        return "Shared client components"
    if path.startswith("src/components/charts/"):
        return "Chart components"
    if path.startswith("src/components/shared/"):
        return "Shared app components"
    if path.startswith("src/features/") and "/components/" in path:
        return "Feature components"
    if path.startswith("src/app/admin/") and "/components/" in path:
        return "Admin route-local components"
    if path.startswith("src/app/client/") and "/components/" in path:
        return "Client route-local components"
    if (path.startswith("src/app/admin/") or path.startswith("src/app/client/")) and path.endswith((".tsx", ".ts")) and not is_surface_entry_file(path):
        return "Route-local modules/components"
    return None


def write_component_tree_page(
    generated_at: str,
    metadata_by_path: dict[str, dict[str, object]],
    graph: dict[str, list[str]],
) -> None:
    sections = [
        ("Admin surfaces", sorted([path for path in metadata_by_path if path.startswith("src/app/admin/") and is_surface_entry_file(path)], key=route_sort_key)),
        ("Client surfaces", sorted([path for path in metadata_by_path if path.startswith("src/app/client/") and is_surface_entry_file(path)], key=route_sort_key)),
    ]

    lines = [
        "# Component Tree Map",
        "",
        f"Generated from the current working tree on {generated_at}.",
        "",
        "This page focuses on admin and client UI surface files and summarizes the component-oriented tree they pull in through direct and transitive imports.",
        "",
    ]

    for title, paths in sections:
        lines.extend([f"## {title}", ""])
        for surface_path in paths:
            metadata = metadata_by_path[surface_path]
            closure = transitive_dependencies(surface_path, graph)
            direct_components = [path for path in metadata.get("internal_imports", []) if isinstance(path, str) and component_category(path)]
            categories: dict[str, list[str]] = defaultdict(list)
            for path in closure:
                category = component_category(path)
                if category:
                    categories[category].append(path)
            feature_modules = unique(feature_module_name(path) for path in closure if feature_module_name(path))
            libs = [path for path in closure if path.startswith("src/lib/")]
            lines.extend([
                f"### `{metadata.get('route', metadata.get('route_context', surface_path))}`",
                f"- Surface file: `{surface_path}`",
                f"- Direct component imports: {escape_md(list_to_text(direct_components, limit=10))}",
                f"- Feature modules touched: {escape_md(list_to_text(feature_modules, limit=10))}",
                f"- Shared libs touched: {escape_md(list_to_text(libs, limit=10))}",
                f"- Related tests: {escape_md(list_to_text([str(v) for v in metadata.get('tests_related', [])], limit=10))}",
                "",
            ])
            for category in sorted(categories):
                lines.append(f"- {category}: {escape_md(list_to_text(categories[category], limit=12))}")
            if not categories:
                lines.append("- No component imports captured")
            lines.append("")

    write_text(CATALOG_ROOT / "component-trees.md", "\n".join(lines).rstrip() + "\n")


def route_profile_filename(path: str) -> str:
    return safe_slug(path.replace("src/app/", "").replace("/route.ts", "-route").replace("/page.tsx", "-page").replace("/layout.tsx", "-layout").replace("/loading.tsx", "-loading").replace("/error.tsx", "-error")) + ".md"


def feature_profile_filename(module: str) -> str:
    return safe_slug(module) + ".md"


def write_route_profile_pages(
    generated_at: str,
    metadata_by_path: dict[str, dict[str, object]],
    graph: dict[str, list[str]],
    db_objects: dict[str, dict[str, object]],
) -> None:
    route_dir = CATALOG_ROOT / "route-pages"
    route_dir.mkdir(parents=True, exist_ok=True)
    db_reverse = build_db_reverse_index(db_objects)
    route_paths = sorted([path for path in metadata_by_path if is_route_file(path)], key=route_sort_key)

    index_lines = [
        "# Route Profiles",
        "",
        f"Generated from the current working tree on {generated_at}.",
        "",
        "This index links to deep route pages with behavior/context summaries for each Next.js special route file.",
        "",
    ]

    sections = {
        "API routes": [path for path in route_paths if path.startswith("src/app/api/")],
        "Admin surfaces": [path for path in route_paths if path.startswith("src/app/admin/")],
        "Client surfaces": [path for path in route_paths if path.startswith("src/app/client/")],
        "Root/other surfaces": [path for path in route_paths if path not in set([* [p for p in route_paths if p.startswith('src/app/api/')], * [p for p in route_paths if p.startswith('src/app/admin/')], * [p for p in route_paths if p.startswith('src/app/client/')]])],
    }

    for title, paths in sections.items():
        if not paths:
            continue
        index_lines.extend([f"## {title}", ""])
        for route_path in paths:
            metadata = metadata_by_path[route_path]
            closure = transitive_dependencies(route_path, graph)
            db_names = unique(name for path in [route_path] + closure for name in db_reverse.get(path, []))
            features = unique(feature_module_name(path) for path in closure if feature_module_name(path))
            tests = [str(v) for v in metadata.get("tests_related", [])]
            filename = route_profile_filename(route_path)
            index_lines.append(f"- [{metadata.get('route', route_path)}](./route-pages/{filename}) — `{route_path}`; features: {len(features)}; db objects: {len(db_names)}; tests: {len(tests)}")
        index_lines.append("")

    for route_path in route_paths:
        metadata = metadata_by_path[route_path]
        content = metadata.get("_content") if isinstance(metadata.get("_content"), str) else ""
        closure = transitive_dependencies(route_path, graph)
        features = unique(feature_module_name(path) for path in closure if feature_module_name(path))
        libs = [path for path in closure if path.startswith("src/lib/") or path.startswith("agent/src/")]
        db_names = unique(name for path in [route_path] + closure for name in db_reverse.get(path, []))
        tests = [str(v) for v in metadata.get("tests_related", [])]
        direct_tests = [str(v) for v in metadata.get("tests_related_direct", [])]
        auth_signals = detect_auth_signals(content)
        behavior_signals = detect_behavior_signals(content)
        stack_by_group: dict[str, list[str]] = defaultdict(list)
        for path in closure:
            stack_by_group[GROUP_LABELS.get(group_for(path), group_for(path))].append(path)

        lines = [
            f"# {metadata.get('route', route_path)}",
            "",
            f"Generated from the current working tree on {generated_at}.",
            "",
            f"- Route file: `{route_path}`",
            f"- Type: {metadata['kind']}",
            f"- Ownership: {metadata['ownership']}",
            f"- Methods: {escape_md(list_to_text([str(v) for v in metadata.get('route_handlers', [])], limit=10))}",
            f"- Auth signals: {escape_md(list_to_text(auth_signals, limit=10))}",
            f"- Behavior signals: {escape_md(list_to_text(behavior_signals, limit=10))}",
            f"- Direct internal imports: {escape_md(list_to_text([str(v) for v in metadata.get('internal_imports', [])], limit=10))}",
            f"- Feature modules touched: {escape_md(list_to_text(features, limit=12))}",
            f"- Shared libs/runtime touched: {escape_md(list_to_text(libs, limit=12))}",
            f"- Database objects touched: {escape_md(list_to_text(db_names, limit=14))}",
            f"- Direct tests: {escape_md(list_to_text(direct_tests, limit=10))}",
            f"- All linked tests: {escape_md(list_to_text(tests, limit=10))}",
            f"- Contents summary: {escape_md(str(metadata['summary']))}",
            "",
            "## Stack by group",
        ]
        for group_name in sorted(stack_by_group):
            lines.append(f"- {group_name}: {escape_md(list_to_text(stack_by_group[group_name], limit=12))}")
        if not stack_by_group:
            lines.append("- none")
        lines.append("")

        if is_api_route_file(route_path):
            lines.extend([
                "## API behavior",
                f"- Request signals: {escape_md(list_to_text(detect_request_signals(content), limit=10))}",
                f"- Response signals: {escape_md(list_to_text(detect_response_signals(content), limit=10))}",
                f"- Validation symbols: {escape_md(list_to_text(extract_validation_symbols(metadata), limit=10))}",
                "",
            ])

        write_text(route_dir / route_profile_filename(route_path), "\n".join(lines).rstrip() + "\n")

    write_text(CATALOG_ROOT / "route-profiles.md", "\n".join(index_lines).rstrip() + "\n")


def write_feature_profile_pages(
    generated_at: str,
    groups: dict[str, list[dict[str, object]]],
    metadata_by_path: dict[str, dict[str, object]],
    graph: dict[str, list[str]],
    reverse_graph: dict[str, list[str]],
    db_objects: dict[str, dict[str, object]],
) -> None:
    feature_dir = CATALOG_ROOT / "feature-pages"
    feature_dir.mkdir(parents=True, exist_ok=True)
    db_reverse = build_db_reverse_index(db_objects)
    feature_groups = [group for group in sorted(groups) if group.startswith("src-features-") and group != "src-features-root"]

    index_lines = [
        "# Feature Profiles",
        "",
        f"Generated from the current working tree on {generated_at}.",
        "",
        "This index links to deep feature-module pages with semantic and behavior-oriented summaries.",
        "",
    ]

    for group in feature_groups:
        module = group.replace("src-features-", "")
        files = groups[group]
        paths = [str(item["path"]) for item in files]
        route_users = unique(route for path in paths for route in metadata_by_path[path].get("route_owners", []) if isinstance(route, str))
        db_names = unique(name for path in paths for name in db_reverse.get(path, []))
        index_lines.append(f"- [{module}](./feature-pages/{feature_profile_filename(module)}) — files: {len(files)}; routes: {len(route_users)}; db objects: {len(db_names)}")

        entry_files = [path for path in paths if "/components/" not in path and not is_test_file(path)]
        component_files = [path for path in paths if "/components/" in path]
        client_files = [path for path in paths if "contains `use client`" in [str(v) for v in metadata_by_path[path].get("construction", [])]]
        server_files = [path for path in paths if path.endswith("server.ts") or "server action/module" in [str(v) for v in metadata_by_path[path].get("construction", [])]]
        route_users = unique(route for path in paths for route in metadata_by_path[path].get("route_owners", []) if isinstance(route, str))
        direct_tests = unique(test for path in paths for test in metadata_by_path[path].get("tests_related_direct", []) if isinstance(test, str))
        all_tests = unique(test for path in paths for test in metadata_by_path[path].get("tests_related", []) if isinstance(test, str))
        auth_signals = unique(signal for path in paths for signal in detect_auth_signals(str(metadata_by_path[path].get("_content", ""))))
        behavior_signals = unique(signal for path in paths for signal in detect_behavior_signals(str(metadata_by_path[path].get("_content", ""))))
        outgoing_features: Counter[str] = Counter()
        incoming_features: Counter[str] = Counter()
        for path in paths:
            for target in graph.get(path, []):
                target_feature = feature_module_name(target)
                if target_feature and target_feature != module:
                    outgoing_features[target_feature] += 1
            for source in reverse_graph.get(path, []):
                source_feature = feature_module_name(source)
                if source_feature and source_feature != module:
                    incoming_features[source_feature] += 1
        db_names = unique(name for path in paths for name in db_reverse.get(path, []))
        exported_files = [path for path in paths if metadata_by_path[path].get("exports")]

        lines = [
            f"# Feature: {module}",
            "",
            f"Generated from the current working tree on {generated_at}.",
            "",
            f"- Files: {len(files)}",
            f"- Entry files: {escape_md(list_to_text(entry_files, limit=12))}",
            f"- Component files: {escape_md(list_to_text(component_files, limit=12))}",
            f"- Client files: {escape_md(list_to_text(client_files, limit=12))}",
            f"- Server files: {escape_md(list_to_text(server_files, limit=12))}",
            f"- Route users: {escape_md(list_to_text(route_users, limit=12))}",
            f"- Database objects touched: {escape_md(list_to_text(db_names, limit=14))}",
            f"- Depends on feature modules: {escape_md(list_to_text([f'{name} ({count})' for name, count in outgoing_features.most_common()], limit=12))}",
            f"- Used by feature modules: {escape_md(list_to_text([f'{name} ({count})' for name, count in incoming_features.most_common()], limit=12))}",
            f"- Auth/access signals: {escape_md(list_to_text(auth_signals, limit=10))}",
            f"- Behavior signals: {escape_md(list_to_text(behavior_signals, limit=10))}",
            f"- Direct tests: {escape_md(list_to_text(direct_tests, limit=10))}",
            f"- All linked tests: {escape_md(list_to_text(all_tests, limit=10))}",
            "",
            "## Exporting files",
        ]
        for path in exported_files:
            file_meta = metadata_by_path[path]
            lines.append(f"- `{path}` — exports: {escape_md(list_to_text([str(v) for v in file_meta.get('exports', [])], limit=12))}")
        if not exported_files:
            lines.append("- none")
        lines.extend(["", "## File list"])
        for path in paths:
            file_meta = metadata_by_path[path]
            lines.append(f"- `{path}` — {escape_md(str(file_meta['summary']))}")
        lines.append("")

        write_text(feature_dir / feature_profile_filename(module), "\n".join(lines).rstrip() + "\n")

    write_text(CATALOG_ROOT / "feature-profiles.md", "\n".join(index_lines).rstrip() + "\n")


def is_code_source_file(path: str, metadata: dict[str, object]) -> bool:
    if is_test_file(path):
        return False
    kind = str(metadata.get("kind", ""))
    return kind in {
        "Next.js page",
        "Next.js layout",
        "Next.js loading UI",
        "Next.js route handler",
        "React/TSX module",
        "TypeScript module",
        "JavaScript module",
    }


def write_auth_access_page(
    generated_at: str,
    metadata_by_path: dict[str, dict[str, object]],
    db_objects: dict[str, dict[str, object]],
) -> None:
    db_reverse = build_db_reverse_index(db_objects)
    route_paths = [path for path in sorted(metadata_by_path, key=route_sort_key) if is_route_file(path) and auth_related_file(path, metadata_by_path[path])]
    code_paths = [
        path for path in sorted(metadata_by_path)
        if not is_route_file(path)
        and not is_test_file(path)
        and auth_related_file(path, metadata_by_path[path])
        and (path.startswith("src/") or path.startswith("agent/"))
    ]
    auth_db_objects = sorted([name for name in db_objects if is_auth_related_db_object(name)])

    lines = [
        "# Auth and Access Map",
        "",
        f"Generated from the current working tree on {generated_at}.",
        "",
        "This page focuses on files and database objects that participate in authentication, membership, scope, invite, or access-control behavior.",
        "",
        f"- Auth-related routes: {len(route_paths)}",
        f"- Auth-related code files: {len(code_paths)}",
        f"- Auth-related DB objects: {len(auth_db_objects)}",
        "",
        "## Route and API surfaces",
        "",
    ]

    for path in route_paths:
        metadata = metadata_by_path[path]
        content = str(metadata.get("_content", ""))
        lines.extend([
            f"### `{metadata.get('route', metadata.get('route_context', path))}`",
            f"- File: `{path}`",
            f"- Auth signals: {escape_md(list_to_text(detect_auth_signals(content), limit=10))}",
            f"- Behavior signals: {escape_md(list_to_text(detect_behavior_signals(content), limit=10))}",
            f"- Related DB objects: {escape_md(list_to_text(db_reverse.get(path, []), limit=12))}",
            f"- Related tests: {escape_md(list_to_text([str(v) for v in metadata.get('tests_related', [])], limit=10))}",
            f"- Direct imports: {escape_md(list_to_text([str(v) for v in metadata.get('internal_imports', [])], limit=10))}",
            "",
        ])

    lines.extend(["## Code files", ""])
    for path in code_paths:
        metadata = metadata_by_path[path]
        content = str(metadata.get("_content", ""))
        lines.extend([
            f"### `{path}`",
            f"- Ownership: {metadata['ownership']}",
            f"- Auth signals: {escape_md(list_to_text(detect_auth_signals(content), limit=10))}",
            f"- Related DB objects: {escape_md(list_to_text(db_reverse.get(path, []), limit=12))}",
            f"- Route owners: {escape_md(list_to_text([str(v) for v in metadata.get('route_owners', [])], limit=10))}",
            f"- Related tests: {escape_md(list_to_text([str(v) for v in metadata.get('tests_related', [])], limit=10))}",
            f"- Contents summary: {escape_md(str(metadata['summary']))}",
            "",
        ])

    lines.extend(["## Database objects", ""])
    for name in auth_db_objects:
        info = db_objects[name]
        lines.extend([
            f"### `{name}`",
            f"- Kinds: {escape_md(list_to_text(sorted(info['kinds']), limit=10))}",
            f"- Migrations: {escape_md(list_to_text(sorted(info['defined_in']), limit=10))}",
            f"- Routes: {escape_md(list_to_text(sorted(info['routes']), limit=10))}",
            f"- Features/libs/agents: {escape_md(list_to_text(sorted(info['features'] | info['libs'] | info['agents']), limit=10))}",
            f"- Tests/docs: {escape_md(list_to_text(sorted(info['tests'] | info['docs']), limit=10))}",
            "",
        ])

    write_text(CATALOG_ROOT / "auth-access.md", "\n".join(lines).rstrip() + "\n")


def write_workflow_map_page(
    generated_at: str,
    metadata_by_path: dict[str, dict[str, object]],
    db_objects: dict[str, dict[str, object]],
) -> None:
    db_reverse = build_db_reverse_index(db_objects)
    categories: dict[str, list[str]] = defaultdict(list)
    for name in db_objects:
        category = workflow_category(name)
        if category:
            categories[category].append(name)

    workflow_files = [
        path for path in sorted(metadata_by_path)
        if is_workflow_related_file(path, metadata_by_path[path], db_reverse)
        and (path.startswith("src/") or path.startswith("agent/"))
        and not is_test_file(path)
    ]

    lines = [
        "# Workflow and Event Map",
        "",
        f"Generated from the current working tree on {generated_at}.",
        "",
        "This page focuses on workflow/event-bearing database objects and the code files that appear to orchestrate or consume them.",
        "",
        f"- Workflow DB objects: {sum(len(v) for v in categories.values())}",
        f"- Workflow-related code files: {len(workflow_files)}",
        "",
    ]

    for category in sorted(categories):
        lines.extend([f"## {category}", ""])
        for name in sorted(categories[category]):
            info = db_objects[name]
            lines.extend([
                f"### `{name}`",
                f"- Kinds: {escape_md(list_to_text(sorted(info['kinds']), limit=10))}",
                f"- Migrations: {escape_md(list_to_text(sorted(info['defined_in']), limit=10))}",
                f"- Routes: {escape_md(list_to_text(sorted(info['routes']), limit=10))}",
                f"- Features/libs/agents: {escape_md(list_to_text(sorted(info['features'] | info['libs'] | info['agents']), limit=12))}",
                f"- Tests/docs: {escape_md(list_to_text(sorted(info['tests'] | info['docs']), limit=12))}",
                "",
            ])

    lines.extend(["## Workflow-related code files", ""])
    for path in workflow_files:
        metadata = metadata_by_path[path]
        lines.extend([
            f"### `{path}`",
            f"- Ownership: {metadata['ownership']}",
            f"- Related DB objects: {escape_md(list_to_text(db_reverse.get(path, []), limit=12))}",
            f"- Route owners: {escape_md(list_to_text([str(v) for v in metadata.get('route_owners', [])], limit=10))}",
            f"- Related tests: {escape_md(list_to_text([str(v) for v in metadata.get('tests_related', [])], limit=10))}",
            f"- Contents summary: {escape_md(str(metadata['summary']))}",
            "",
        ])

    write_text(CATALOG_ROOT / "workflow-events.md", "\n".join(lines).rstrip() + "\n")


def write_mutation_surface_page(
    generated_at: str,
    metadata_by_path: dict[str, dict[str, object]],
    db_objects: dict[str, dict[str, object]],
) -> None:
    db_reverse = build_db_reverse_index(db_objects)
    api_routes = [
        path for path in sorted(metadata_by_path, key=route_sort_key)
        if is_api_route_file(path)
        and any(method in {"POST", "PUT", "PATCH", "DELETE"} for method in metadata_by_path[path].get("route_handlers", []))
    ]
    admin_actions = [
        path for path in sorted(metadata_by_path)
        if path.startswith("src/app/admin/actions/")
        and path.endswith(".ts")
        and not is_test_file(path)
        and extract_mutation_symbols(metadata_by_path[path])
    ]
    mutation_files = [
        path for path in sorted(metadata_by_path)
        if not is_test_file(path)
        and not path.startswith("src/app/admin/actions/")
        and not is_api_route_file(path)
        and extract_mutation_symbols(metadata_by_path[path])
        and (path.startswith("src/features/") or path.startswith("src/lib/") or path.startswith("agent/src/"))
    ]

    lines = [
        "# Mutation Surface Map",
        "",
        f"Generated from the current working tree on {generated_at}.",
        "",
        "This page focuses on obvious state-changing surfaces: API mutation routes, admin actions, and exported mutation-oriented helpers/runtime files.",
        "",
    ]

    lines.extend(["## API mutation routes", ""])
    for path in api_routes:
        metadata = metadata_by_path[path]
        lines.extend([
            f"### `{metadata.get('route', path)}`",
            f"- File: `{path}`",
            f"- Methods: {escape_md(list_to_text([str(v) for v in metadata.get('route_handlers', [])], limit=10))}",
            f"- Validation symbols: {escape_md(list_to_text(extract_validation_symbols(metadata), limit=10))}",
            f"- DB objects touched: {escape_md(list_to_text(db_reverse.get(path, []), limit=12))}",
            f"- Related tests: {escape_md(list_to_text([str(v) for v in metadata.get('tests_related', [])], limit=10))}",
            f"- Summary: {escape_md(str(metadata['summary']))}",
            "",
        ])

    lines.extend(["## Admin actions", ""])
    for path in admin_actions:
        metadata = metadata_by_path[path]
        lines.extend([
            f"### `{path}`",
            f"- Mutation symbols: {escape_md(list_to_text(extract_mutation_symbols(metadata), limit=16))}",
            f"- DB objects touched: {escape_md(list_to_text(db_reverse.get(path, []), limit=12))}",
            f"- Route owners: {escape_md(list_to_text([str(v) for v in metadata.get('route_owners', [])], limit=10))}",
            f"- Related tests: {escape_md(list_to_text([str(v) for v in metadata.get('tests_related', [])], limit=10))}",
            f"- Summary: {escape_md(str(metadata['summary']))}",
            "",
        ])

    lines.extend(["## Other mutation-oriented files", ""])
    for path in mutation_files:
        metadata = metadata_by_path[path]
        lines.extend([
            f"### `{path}`",
            f"- Mutation symbols: {escape_md(list_to_text(extract_mutation_symbols(metadata), limit=16))}",
            f"- DB objects touched: {escape_md(list_to_text(db_reverse.get(path, []), limit=12))}",
            f"- Route owners: {escape_md(list_to_text([str(v) for v in metadata.get('route_owners', [])], limit=10))}",
            f"- Related tests: {escape_md(list_to_text([str(v) for v in metadata.get('tests_related', [])], limit=10))}",
            f"- Summary: {escape_md(str(metadata['summary']))}",
            "",
        ])

    write_text(CATALOG_ROOT / "mutation-surfaces.md", "\n".join(lines).rstrip() + "\n")


def parse_env_keys_from_content(content: str) -> list[str]:
    keys: list[str] = []
    for line in content.splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key = line.split("=", 1)[0].strip()
        if re.fullmatch(r"[A-Z0-9_]+", key):
            keys.append(key)
    return unique(keys)


def integration_service_name(key: str) -> str:
    upper = key.upper()
    if "CLERK" in upper:
        return "Clerk"
    if "SUPABASE" in upper:
        return "Supabase"
    if upper.startswith(("META", "FB", "FACEBOOK")):
        return "Meta"
    if any(token in upper for token in ["GMAIL", "GOOGLE", "GCAL", "CALENDAR"]):
        return "Google / Gmail / Calendar"
    if "DISCORD" in upper:
        return "Discord"
    if "RESEND" in upper:
        return "Resend"
    if any(token in upper for token in ["ANTHROPIC", "CLAUDE"]):
        return "Anthropic / Claude"
    if "RAILWAY" in upper:
        return "Railway"
    if any(token in upper for token in ["INGEST", "APP_URL", "NEXT_PUBLIC_APP", "BASE_URL"]):
        return "App / Runtime"
    return "Other / App"


def build_env_registry(metadata_by_path: dict[str, dict[str, object]]) -> dict[str, dict[str, object]]:
    registry: dict[str, dict[str, object]] = {}
    process_env_pattern = re.compile(r"process\.env\.([A-Z0-9_]+)")

    for path, metadata in metadata_by_path.items():
        content = metadata.get("_content")
        if not isinstance(content, str):
            continue
        if Path(path).name.startswith(".env") or path.endswith(".env.example") or path.endswith(".env.local"):
            for key in parse_env_keys_from_content(content):
                info = registry.setdefault(key, {
                    "service": integration_service_name(key),
                    "declared_in": set(),
                    "references": set(),
                    "routes": set(),
                    "features": set(),
                    "libs": set(),
                    "agents": set(),
                    "tests": set(),
                    "docs": set(),
                    "other": set(),
                    "groups": Counter(),
                })
                info["declared_in"].add(path)
        for key in process_env_pattern.findall(content):
            info = registry.setdefault(key, {
                "service": integration_service_name(key),
                "declared_in": set(),
                "references": set(),
                "routes": set(),
                "features": set(),
                "libs": set(),
                "agents": set(),
                "tests": set(),
                "docs": set(),
                "other": set(),
                "groups": Counter(),
            })
            info["references"].add(path)

    searchable_paths = [
        path for path in metadata_by_path
        if not path.startswith("docs/wiki/")
    ]

    for key, info in registry.items():
        pattern = re.compile(rf"(?<![A-Za-z0-9_]){re.escape(key)}(?![A-Za-z0-9_])")
        for path in searchable_paths:
            content = metadata_by_path[path].get("_content")
            if not isinstance(content, str):
                continue
            if not pattern.search(content):
                continue
            if Path(path).name.startswith(".env"):
                continue
            info["references"].add(path)
            info["groups"][GROUP_LABELS.get(group_for(path), group_for(path))] += 1
            if is_route_file(path):
                info["routes"].add(path)
            elif path.startswith("src/features/"):
                info["features"].add(path)
            elif path.startswith("src/lib/"):
                info["libs"].add(path)
            elif path.startswith("agent/"):
                info["agents"].add(path)
            elif is_test_file(path):
                info["tests"].add(path)
            elif path.startswith("docs/"):
                info["docs"].add(path)
            else:
                info["other"].add(path)

    return registry


def build_env_reverse_index(env_registry: dict[str, dict[str, object]]) -> dict[str, list[str]]:
    reverse: dict[str, list[str]] = defaultdict(list)
    for key, info in env_registry.items():
        for bucket in ["declared_in", "references", "routes", "features", "libs", "agents", "tests", "docs", "other"]:
            for path in info.get(bucket, set()):
                reverse[str(path)].append(key)
    return {path: unique(keys) for path, keys in reverse.items()}


def write_env_integration_page(generated_at: str, env_registry: dict[str, dict[str, object]]) -> None:
    service_map: dict[str, dict[str, object]] = defaultdict(lambda: {
        "keys": [],
        "declared_in": set(),
        "routes": set(),
        "features": set(),
        "libs": set(),
        "agents": set(),
        "tests": set(),
        "docs": set(),
        "other": set(),
    })

    for key, info in env_registry.items():
        service = str(info["service"])
        service_map[service]["keys"].append(key)
        for bucket in ["declared_in", "routes", "features", "libs", "agents", "tests", "docs", "other"]:
            service_map[service][bucket].update(info[bucket])

    lines = [
        "# Env and Integration Map",
        "",
        f"Generated from the current working tree on {generated_at}.",
        "",
        "This page maps environment variables to integration services and to the first-party files that reference them.",
        "",
        f"- Environment keys tracked: {len(env_registry)}",
        f"- Integration service buckets: {len(service_map)}",
        "",
        "## Service overview",
        "",
    ]

    for service in sorted(service_map):
        info = service_map[service]
        lines.extend([
            f"### {service}",
            f"- Env keys: {escape_md(list_to_text(sorted(unique(info['keys'])), limit=20))}",
            f"- Declared in: {escape_md(list_to_text(sorted(info['declared_in']), limit=10))}",
            f"- Routes: {escape_md(list_to_text(sorted(info['routes']), limit=10))}",
            f"- Features/libs: {escape_md(list_to_text(sorted(info['features'] | info['libs']), limit=12))}",
            f"- Agent files: {escape_md(list_to_text(sorted(info['agents']), limit=10))}",
            f"- Tests/docs: {escape_md(list_to_text(sorted(info['tests'] | info['docs']), limit=12))}",
            "",
        ])

    lines.extend(["## Env variable details", ""])
    for key in sorted(env_registry):
        info = env_registry[key]
        lines.extend([
            f"### `{key}`",
            f"- Service: {info['service']}",
            f"- Declared in: {escape_md(list_to_text(sorted(info['declared_in']), limit=10))}",
            f"- Mentioned by groups: {escape_md(list_to_text([f'{group} ({count})' for group, count in info['groups'].most_common()], limit=12))}",
            f"- Routes: {escape_md(list_to_text(sorted(info['routes']), limit=10))}",
            f"- Features: {escape_md(list_to_text(sorted(info['features']), limit=10))}",
            f"- Shared libs: {escape_md(list_to_text(sorted(info['libs']), limit=10))}",
            f"- Agent files: {escape_md(list_to_text(sorted(info['agents']), limit=10))}",
            f"- Tests/docs/other: {escape_md(list_to_text(sorted(info['tests'] | info['docs'] | info['other']), limit=12))}",
            "",
        ])

    write_text(CATALOG_ROOT / "env-integrations.md", "\n".join(lines).rstrip() + "\n")


LIFECYCLE_PROFILES = [
    {
        "slug": "access-and-invites",
        "title": "Access and invite lifecycle",
        "description": "Files and DB objects involved in client access, invites, membership resolution, and portal entry.",
        "db_names": {"clients", "client_members", "client_access_invites", "client_member_campaigns", "client_member_events"},
        "path_tokens": ["src/proxy.ts", "features/access", "features/invitations", "client-portal", "sign-in", "sign-up", "api/admin/invite", "api/user/profile", "member-access"],
    },
    {
        "slug": "agent-runtime",
        "title": "Agent runtime lifecycle",
        "description": "Files and DB objects involved in queued agent work, runtime heartbeat, alerts, and runtime state.",
        "db_names": {"agent_tasks", "agent_runtime_state", "agent_alerts", "agent_jobs", "acquire_runtime_lease", "release_runtime_lease"},
        "path_tokens": ["agent/src/services/queue-service", "agent/src/services/runtime-state-service", "agent/src/services/web-task-executor", "src/lib/agent-dispatch", "src/lib/agent-jobs", "api/agents", "api/alerts"],
    },
    {
        "slug": "campaign-discussion-and-action-items",
        "title": "Campaign discussion and action-item lifecycle",
        "description": "Files and DB objects involved in campaign comments, campaign action items, notifications, and shared system events.",
        "db_names": {"campaign_comments", "campaign_action_items", "notifications", "system_events"},
        "path_tokens": ["campaign-comments", "campaign-action-items", "agent-outcomes", "notifications", "system-events", "app/admin/campaigns", "app/client/[slug]/campaign"],
    },
    {
        "slug": "event-follow-up",
        "title": "Event follow-up lifecycle",
        "description": "Files and DB objects involved in event follow-up work, event reporting, and ticket/event workflow surfaces.",
        "db_names": {"event_follow_up_items", "notifications", "system_events", "tm_events", "tm_event_snapshots", "tm_event_demographics"},
        "path_tokens": ["event-follow-up-items", "features/events", "app/admin/events", "app/client/[slug]/event", "api/ingest"],
    },
    {
        "slug": "client-agent-conversations",
        "title": "Client agent conversation lifecycle",
        "description": "Files and DB objects involved in client-agent threads, messages, runtime responses, and client agent UI/API routes.",
        "db_names": {"client_agent_threads", "client_agent_messages", "calls", "clients"},
        "path_tokens": ["features/client-agent", "api/client/[slug]/agent", "client/[slug]/agent"],
    },
    {
        "slug": "approvals-and-shared-timeline",
        "title": "Approvals and shared timeline lifecycle",
        "description": "Files and DB objects involved in approvals, notifications, shared events, and summary/reporting surfaces that expose them.",
        "db_names": {"approval_requests", "system_events", "notifications", "admin_activity"},
        "path_tokens": ["approvals", "system-events", "notifications", "dashboard", "reports", "admin/activity"],
    },
    {
        "slug": "ingest-and-snapshots",
        "title": "Ingest and snapshot lifecycle",
        "description": "Files and DB objects involved in external data ingest, campaign/event snapshots, and summary/report surfaces built on them.",
        "db_names": {"meta_campaigns", "meta_campaign_snapshots", "tm_events", "tm_event_snapshots", "tm_event_demographics"},
        "path_tokens": ["api/ingest", "features/reports", "features/dashboard", "features/events", "features/campaigns", "app/admin/reports", "app/client/[slug]/reports"],
    },
]

BUSINESS_RULE_PROFILES = [
    {
        "slug": "access-membership-and-portal-entry",
        "title": "Access, membership, and portal-entry rules",
        "description": "Files and DB objects that appear to enforce how users gain access, how memberships are resolved, and how users land in the correct portal state.",
        "db_names": {"clients", "client_members", "client_access_invites", "client_member_campaigns", "client_member_events"},
        "path_tokens": ["member-access", "features/access", "features/invitations", "client-portal/entry", "client-portal/access", "api/admin/invite", "api/user/profile", "sign-in", "sign-up", "src/proxy.ts"],
    },
    {
        "slug": "campaign-ownership-and-scope-rules",
        "title": "Campaign ownership and scope rules",
        "description": "Files and DB objects that appear to enforce campaign ownership, effective client assignment, and campaign-scoped reads/writes.",
        "db_names": {"meta_campaigns", "campaign_comments", "campaign_action_items", "notifications", "client_member_campaigns"},
        "path_tokens": ["campaign-client-assignment", "features/campaigns", "campaign-comments", "campaign-action-items", "client-portal/scope", "admin/campaigns"],
    },
    {
        "slug": "approval-visibility-and-notification-rules",
        "title": "Approval visibility and notification rules",
        "description": "Files and DB objects that appear to control who sees approvals, notifications, and shared timeline events.",
        "db_names": {"approval_requests", "notifications", "system_events", "client_members", "client_member_campaigns", "client_member_events"},
        "path_tokens": ["approvals", "notifications", "system-events", "dashboard", "reports", "client-portal/scope"],
    },
    {
        "slug": "client-agent-read-only-reporting-rules",
        "title": "Client-agent read-only reporting rules",
        "description": "Files and DB objects that appear to keep the client agent constrained to read-only reporting and scoped conversational context.",
        "db_names": {"client_agent_threads", "client_agent_messages", "clients", "calls"},
        "path_tokens": ["features/client-agent", "api/client/[slug]/agent", "client/[slug]/agent", "ThreadContextPayload", "evaluatePromptPolicy"],
    },
    {
        "slug": "agent-runtime-recovery-and-task-rules",
        "title": "Agent runtime recovery and task rules",
        "description": "Files and DB objects that appear to govern queued agent tasks, runtime heartbeat, recovery, and runtime-side task execution boundaries.",
        "db_names": {"agent_tasks", "agent_runtime_state", "agent_alerts", "agent_jobs", "acquire_runtime_lease", "release_runtime_lease"},
        "path_tokens": ["queue-service", "runtime-state-service", "web-task-executor", "agent-dispatch", "agent-jobs", "api/agents", "api/alerts"],
    },
    {
        "slug": "reporting-from-shared-backbone-rules",
        "title": "Reporting-from-shared-backbone rules",
        "description": "Files and DB objects that appear to connect reports and dashboards back to shared workflow, event, and snapshot data instead of isolated summary-only state.",
        "db_names": {"system_events", "approval_requests", "campaign_comments", "campaign_action_items", "event_follow_up_items", "meta_campaign_snapshots", "tm_event_snapshots", "tm_event_demographics"},
        "path_tokens": ["features/reports", "features/dashboard", "features/events", "features/campaigns", "app/admin/reports", "app/client/[slug]/reports"],
    },
]

ONBOARDING_GUIDES = [
    {
        "slug": "admin-web-work",
        "title": "Start here: admin web work",
        "description": "Recommended read order for someone changing admin surfaces, admin actions, admin workflow, or admin reporting views.",
        "db_names": {"clients", "client_members", "approval_requests", "notifications", "system_events", "meta_campaigns", "tm_events"},
        "path_tokens": ["src/app/admin/", "src/components/admin/", "src/app/admin/actions/", "features/dashboard", "features/reports", "features/campaigns", "features/events"],
        "wiki_links": [
            "./manifest.md",
            "./route-profiles.md",
            "./feature-profiles.md",
            "./component-trees.md",
            "./mutation-surfaces.md",
            "./business-rules.md",
        ],
    },
    {
        "slug": "client-portal-work",
        "title": "Start here: client portal work",
        "description": "Recommended read order for someone changing client portal routing, access, campaign/event pages, reports, or the client agent surface.",
        "db_names": {"clients", "client_members", "client_member_campaigns", "client_member_events", "campaign_comments", "event_follow_up_items", "client_agent_threads", "client_agent_messages"},
        "path_tokens": ["src/app/client/", "features/client-portal", "features/client-agent", "features/reports", "features/events", "features/campaigns"],
        "wiki_links": [
            "./route-profiles.md",
            "./feature-profiles.md",
            "./auth-access.md",
            "./workflow-lifecycles.md",
            "./component-trees.md",
            "./business-rules.md",
        ],
    },
    {
        "slug": "agent-runtime-work",
        "title": "Start here: agent runtime work",
        "description": "Recommended read order for someone changing the Discord/runtime agent, queued tasks, runtime state, or web-admin queue recovery.",
        "db_names": {"agent_tasks", "agent_runtime_state", "agent_alerts", "agent_jobs", "system_events"},
        "path_tokens": ["agent/src/", "src/lib/agent-", "api/agents", "api/alerts", "features/agent-outcomes"],
        "wiki_links": [
            "./workflow-events.md",
            "./workflow-lifecycles.md",
            "./auth-access.md",
            "./mutation-surfaces.md",
            "./env-integrations.md",
            "./feature-profiles.md",
        ],
    },
    {
        "slug": "auth-and-access-work",
        "title": "Start here: auth and access work",
        "description": "Recommended read order for someone changing sign-in/up flows, invites, memberships, portal-entry behavior, or scope enforcement.",
        "db_names": {"clients", "client_members", "client_access_invites", "client_member_campaigns", "client_member_events"},
        "path_tokens": ["src/proxy.ts", "member-access", "features/access", "features/invitations", "client-portal/entry", "client-portal/access", "sign-in", "sign-up", "api/admin/invite", "api/user/profile"],
        "wiki_links": [
            "./auth-access.md",
            "./business-rules.md",
            "./workflow-lifecycles.md",
            "./table-profiles.md",
            "./route-profiles.md",
            "./feature-profiles.md",
        ],
    },
    {
        "slug": "reporting-and-ingest-work",
        "title": "Start here: reporting and ingest work",
        "description": "Recommended read order for someone changing ingest, snapshots, reports, dashboard summaries, or external analytics integrations.",
        "db_names": {"meta_campaigns", "meta_campaign_snapshots", "tm_events", "tm_event_snapshots", "tm_event_demographics", "system_events"},
        "path_tokens": ["api/ingest", "features/reports", "features/dashboard", "features/events", "features/campaigns", "app/admin/reports", "app/client/[slug]/reports", "lib/meta"],
        "wiki_links": [
            "./workflow-lifecycles.md",
            "./api-contracts.md",
            "./supabase-schema.md",
            "./database-to-code.md",
            "./feature-profiles.md",
            "./env-integrations.md",
        ],
    },
]


def collect_profile_scope(
    profile: dict[str, object],
    metadata_by_path: dict[str, dict[str, object]],
    db_objects: dict[str, dict[str, object]],
) -> dict[str, object]:
    db_names = sorted([name for name in db_objects if name in profile["db_names"]])
    matched_paths: set[str] = set()
    all_paths = sorted(metadata_by_path)

    for name in db_names:
        info = db_objects.get(name)
        if not info:
            continue
        for bucket in ["routes", "features", "libs", "agents", "tests", "docs", "other"]:
            matched_paths.update(str(p) for p in info.get(bucket, set()))

    for path in all_paths:
        content = str(metadata_by_path[path].get("_content", ""))
        if any(token in path for token in profile["path_tokens"]) or any(token in content for token in profile["path_tokens"]):
            matched_paths.add(path)

    routes = sorted([path for path in matched_paths if is_route_file(path)], key=route_sort_key)
    features = sorted([path for path in matched_paths if path.startswith("src/features/")])
    libs_agents_actions = sorted([
        path for path in matched_paths
        if path.startswith("src/lib/") or path.startswith("agent/src/") or path.startswith("src/app/admin/actions/")
    ])
    tests = sorted([path for path in matched_paths if is_test_file(path)])
    docs = sorted([path for path in matched_paths if path.startswith("docs/") or path in {"AGENTS.md", "README.md"}])
    mutation_files = sorted([path for path in matched_paths if not is_test_file(path) and extract_mutation_symbols(metadata_by_path.get(path, {}))])
    behavior_signals = Counter(signal for path in matched_paths for signal in detect_behavior_signals(str(metadata_by_path.get(path, {}).get("_content", ""))))
    auth_signals = Counter(signal for path in matched_paths for signal in detect_auth_signals(str(metadata_by_path.get(path, {}).get("_content", ""))))

    return {
        "db_names": db_names,
        "routes": routes,
        "features": features,
        "libs_agents_actions": libs_agents_actions,
        "tests": tests,
        "docs": docs,
        "mutation_files": mutation_files,
        "behavior_signals": behavior_signals,
        "auth_signals": auth_signals,
    }


def table_category(name: str) -> str:
    if is_auth_related_db_object(name):
        return "Access / auth tables"
    wf = workflow_category(name)
    if wf:
        return wf
    if name.startswith("meta_") or name.startswith("tm_") or name in {"calls", "contact_submissions"}:
        return "External ingest / reporting tables"
    if name in {"clients", "users"}:
        return "Account backbone tables"
    return "Other tables"


def write_workflow_lifecycle_pages(
    generated_at: str,
    metadata_by_path: dict[str, dict[str, object]],
    db_objects: dict[str, dict[str, object]],
) -> None:
    lifecycle_dir = CATALOG_ROOT / "lifecycle-pages"
    lifecycle_dir.mkdir(parents=True, exist_ok=True)
    db_reverse = build_db_reverse_index(db_objects)

    index_lines = [
        "# Workflow Lifecycle Pages",
        "",
        f"Generated from the current working tree on {generated_at}.",
        "",
        "This index links to deeper lifecycle pages that group routes, features, libs, tests, and DB objects around major system flows.",
        "",
    ]

    all_paths = sorted(metadata_by_path)
    for profile in LIFECYCLE_PROFILES:
        db_names = sorted([name for name in db_objects if name in profile["db_names"]])
        matched_paths: set[str] = set()
        for name in db_names:
            info = db_objects.get(name)
            if not info:
                continue
            for bucket in ["routes", "features", "libs", "agents", "tests", "docs", "other"]:
                matched_paths.update(str(p) for p in info.get(bucket, set()))
        for path in all_paths:
            content = str(metadata_by_path[path].get("_content", ""))
            if any(token in path for token in profile["path_tokens"]) or any(token in content for token in profile["path_tokens"]):
                matched_paths.add(path)

        routes = sorted([path for path in matched_paths if is_route_file(path)], key=route_sort_key)
        features = sorted([path for path in matched_paths if path.startswith("src/features/")])
        libs_agents = sorted([path for path in matched_paths if path.startswith("src/lib/") or path.startswith("agent/src/") or path.startswith("src/app/admin/actions/")])
        tests = sorted([path for path in matched_paths if is_test_file(path)])
        docs = sorted([path for path in matched_paths if path.startswith("docs/") or path in {"AGENTS.md", "README.md"}])
        mutation_files = sorted([path for path in matched_paths if not is_test_file(path) and extract_mutation_symbols(metadata_by_path.get(path, {}))])
        behavior_signals = Counter(signal for path in matched_paths for signal in detect_behavior_signals(str(metadata_by_path.get(path, {}).get("_content", ""))))
        auth_signals = Counter(signal for path in matched_paths for signal in detect_auth_signals(str(metadata_by_path.get(path, {}).get("_content", ""))))
        filename = safe_slug(profile["slug"]) + ".md"

        index_lines.append(f"- [{profile['title']}](./lifecycle-pages/{filename}) — db objects: {len(db_names)}; routes: {len(routes)}; feature files: {len(features)}; libs/agents/actions: {len(libs_agents)}")

        lines = [
            f"# {profile['title']}",
            "",
            f"Generated from the current working tree on {generated_at}.",
            "",
            profile["description"],
            "",
            f"- DB objects: {escape_md(list_to_text(db_names, limit=16))}",
            f"- Routes: {escape_md(list_to_text(routes, limit=12))}",
            f"- Feature files: {escape_md(list_to_text(features, limit=12))}",
            f"- Libs / agents / actions: {escape_md(list_to_text(libs_agents, limit=12))}",
            f"- Mutation-oriented files: {escape_md(list_to_text(mutation_files, limit=12))}",
            f"- Tests: {escape_md(list_to_text(tests, limit=12))}",
            f"- Docs: {escape_md(list_to_text(docs, limit=12))}",
            f"- Behavior signals: {escape_md(list_to_text([f'{name} ({count})' for name, count in behavior_signals.most_common()], limit=12))}",
            f"- Auth signals: {escape_md(list_to_text([f'{name} ({count})' for name, count in auth_signals.most_common()], limit=12))}",
            "",
        ]

        lines.extend(["## Database objects", ""])
        for name in db_names:
            info = db_objects[name]
            lines.extend([
                f"### `{name}`",
                f"- Kinds: {escape_md(list_to_text(sorted(info['kinds']), limit=10))}",
                f"- Migrations: {escape_md(list_to_text(sorted(info['defined_in']), limit=10))}",
                f"- Related routes: {escape_md(list_to_text(sorted(info['routes']), limit=10))}",
                f"- Related features/libs/agents: {escape_md(list_to_text(sorted(info['features'] | info['libs'] | info['agents']), limit=12))}",
                f"- Related tests/docs: {escape_md(list_to_text(sorted(info['tests'] | info['docs']), limit=12))}",
                "",
            ])

        lines.extend([
            "## Route surfaces",
            f"- {escape_md(list_to_text(routes, limit=16))}",
            "",
            "## Feature files",
            f"- {escape_md(list_to_text(features, limit=16))}",
            "",
            "## Libs / agents / admin actions",
            f"- {escape_md(list_to_text(libs_agents, limit=16))}",
            "",
            "## Tests and docs",
            f"- Tests: {escape_md(list_to_text(tests, limit=16))}",
            f"- Docs: {escape_md(list_to_text(docs, limit=16))}",
            "",
        ])

        write_text(lifecycle_dir / filename, "\n".join(lines).rstrip() + "\n")

    write_text(CATALOG_ROOT / "workflow-lifecycles.md", "\n".join(index_lines).rstrip() + "\n")


def write_business_rule_pages(
    generated_at: str,
    metadata_by_path: dict[str, dict[str, object]],
    db_objects: dict[str, dict[str, object]],
) -> None:
    rule_dir = CATALOG_ROOT / "business-rule-pages"
    rule_dir.mkdir(parents=True, exist_ok=True)

    index_lines = [
        "# Business Rule Pages",
        "",
        f"Generated from the current working tree on {generated_at}.",
        "",
        "This index links to deeper rule-oriented pages that group files and DB objects around major business constraints or policy areas.",
        "",
    ]

    for profile in BUSINESS_RULE_PROFILES:
        scope = collect_profile_scope(profile, metadata_by_path, db_objects)
        filename = safe_slug(str(profile["slug"])) + ".md"
        index_lines.append(
            f"- [{profile['title']}](./business-rule-pages/{filename}) — db objects: {len(scope['db_names'])}; routes: {len(scope['routes'])}; feature files: {len(scope['features'])}; mutation files: {len(scope['mutation_files'])}"
        )

        lines = [
            f"# {profile['title']}",
            "",
            f"Generated from the current working tree on {generated_at}.",
            "",
            str(profile["description"]),
            "",
            f"- DB objects: {escape_md(list_to_text(scope['db_names'], limit=16))}",
            f"- Routes: {escape_md(list_to_text(scope['routes'], limit=12))}",
            f"- Feature files: {escape_md(list_to_text(scope['features'], limit=12))}",
            f"- Libs / agents / admin actions: {escape_md(list_to_text(scope['libs_agents_actions'], limit=12))}",
            f"- Mutation-oriented files: {escape_md(list_to_text(scope['mutation_files'], limit=12))}",
            f"- Tests: {escape_md(list_to_text(scope['tests'], limit=12))}",
            f"- Docs: {escape_md(list_to_text(scope['docs'], limit=12))}",
            f"- Behavior signals: {escape_md(list_to_text([f'{name} ({count})' for name, count in scope['behavior_signals'].most_common()], limit=12))}",
            f"- Auth signals: {escape_md(list_to_text([f'{name} ({count})' for name, count in scope['auth_signals'].most_common()], limit=12))}",
            "",
            "## Database objects",
            "",
        ]

        for name in scope["db_names"]:
            info = db_objects[name]
            lines.extend([
                f"### `{name}`",
                f"- Kinds: {escape_md(list_to_text(sorted(info['kinds']), limit=10))}",
                f"- Migrations: {escape_md(list_to_text(sorted(info['defined_in']), limit=10))}",
                f"- Related routes: {escape_md(list_to_text(sorted(info['routes']), limit=10))}",
                f"- Related features/libs/agents: {escape_md(list_to_text(sorted(info['features'] | info['libs'] | info['agents']), limit=12))}",
                f"- Related tests/docs: {escape_md(list_to_text(sorted(info['tests'] | info['docs']), limit=12))}",
                "",
            ])

        lines.extend([
            "## Route surfaces",
            f"- {escape_md(list_to_text(scope['routes'], limit=16))}",
            "",
            "## Feature files",
            f"- {escape_md(list_to_text(scope['features'], limit=16))}",
            "",
            "## Libs / agents / admin actions",
            f"- {escape_md(list_to_text(scope['libs_agents_actions'], limit=16))}",
            "",
            "## Tests and docs",
            f"- Tests: {escape_md(list_to_text(scope['tests'], limit=16))}",
            f"- Docs: {escape_md(list_to_text(scope['docs'], limit=16))}",
            "",
        ])

        write_text(rule_dir / filename, "\n".join(lines).rstrip() + "\n")

    write_text(CATALOG_ROOT / "business-rules.md", "\n".join(index_lines).rstrip() + "\n")


def write_table_profile_pages(
    generated_at: str,
    metadata_by_path: dict[str, dict[str, object]],
    db_objects: dict[str, dict[str, object]],
) -> None:
    table_dir = CATALOG_ROOT / "table-pages"
    table_dir.mkdir(parents=True, exist_ok=True)
    tables = sorted([name for name, info in db_objects.items() if "table" in info["kinds"]])
    categories: dict[str, list[str]] = defaultdict(list)
    for name in tables:
        categories[table_category(name)].append(name)

    index_lines = [
        "# Table Profiles",
        "",
        f"Generated from the current working tree on {generated_at}.",
        "",
        "This index links to deeper per-table pages for migration-discovered database tables.",
        "",
        f"- Tables tracked: {len(tables)}",
        "",
    ]

    for category in sorted(categories):
        index_lines.extend([f"## {category}", ""])
        for name in sorted(categories[category]):
            info = db_objects[name]
            filename = safe_slug(name) + ".md"
            index_lines.append(
                f"- [{name}](./table-pages/{filename}) — refs: {len(info['references'])}; routes: {len(info['routes'])}; features/libs/agents: {len(info['features'] | info['libs'] | info['agents'])}"
            )
        index_lines.append("")

    for name in tables:
        info = db_objects[name]
        filename = safe_slug(name) + ".md"
        ref_paths = sorted(info["references"])
        mutation_files = sorted([
            path for path in (info["routes"] | info["features"] | info["libs"] | info["agents"] | info["other"])
            if extract_mutation_symbols(metadata_by_path.get(str(path), {}))
        ])
        behavior_signals = Counter(
            signal
            for path in ref_paths
            for signal in detect_behavior_signals(str(metadata_by_path.get(path, {}).get("_content", "")))
        )
        auth_signals = Counter(
            signal
            for path in ref_paths
            for signal in detect_auth_signals(str(metadata_by_path.get(path, {}).get("_content", "")))
        )

        lines = [
            f"# Table: {name}",
            "",
            f"Generated from the current working tree on {generated_at}.",
            "",
            f"- Category: {table_category(name)}",
            f"- Kinds: {escape_md(list_to_text(sorted(info['kinds']), limit=10))}",
            f"- Migrations: {escape_md(list_to_text(sorted(info['defined_in']), limit=12))}",
            f"- Non-migration references: {len(info['references'])}",
            f"- Referenced by groups: {escape_md(list_to_text([f'{group} ({count})' for group, count in info['groups'].most_common()], limit=12))}",
            f"- Routes: {escape_md(list_to_text(sorted(info['routes']), limit=12))}",
            f"- Features: {escape_md(list_to_text(sorted(info['features']), limit=12))}",
            f"- Shared libs: {escape_md(list_to_text(sorted(info['libs']), limit=12))}",
            f"- Agent files: {escape_md(list_to_text(sorted(info['agents']), limit=12))}",
            f"- Mutation-oriented files: {escape_md(list_to_text(mutation_files, limit=12))}",
            f"- Tests: {escape_md(list_to_text(sorted(info['tests']), limit=12))}",
            f"- Docs: {escape_md(list_to_text(sorted(info['docs']), limit=12))}",
            f"- Other mentions: {escape_md(list_to_text(sorted(info['other']), limit=12))}",
            f"- Behavior signals from references: {escape_md(list_to_text([f'{name_} ({count})' for name_, count in behavior_signals.most_common()], limit=12))}",
            f"- Auth signals from references: {escape_md(list_to_text([f'{name_} ({count})' for name_, count in auth_signals.most_common()], limit=12))}",
            "",
            "## Reference files",
            f"- {escape_md(list_to_text(ref_paths, limit=20))}",
            "",
        ]

        write_text(table_dir / filename, "\n".join(lines).rstrip() + "\n")

    write_text(CATALOG_ROOT / "table-profiles.md", "\n".join(index_lines).rstrip() + "\n")


def write_schema_object_profile_pages(
    generated_at: str,
    db_objects: dict[str, dict[str, object]],
) -> None:
    schema_dir = CATALOG_ROOT / "schema-object-pages"
    schema_dir.mkdir(parents=True, exist_ok=True)
    objects = sorted([name for name, info in db_objects.items() if "table" not in info["kinds"]])

    def category_for(name: str, info: dict[str, object]) -> str:
        kinds = set(info["kinds"])
        if "function" in kinds:
            return "Functions"
        if "view" in kinds:
            return "Views"
        if "trigger" in kinds:
            return "Triggers"
        return "Other schema objects"

    categories: dict[str, list[str]] = defaultdict(list)
    for name in objects:
        categories[category_for(name, db_objects[name])].append(name)

    index_lines = [
        "# Schema Object Profiles",
        "",
        f"Generated from the current working tree on {generated_at}.",
        "",
        "This index links to deeper pages for migration-discovered functions, views, triggers, and other non-table schema objects.",
        "",
        f"- Objects tracked: {len(objects)}",
        "",
    ]

    for category in sorted(categories):
        index_lines.extend([f"## {category}", ""])
        for name in sorted(categories[category]):
            info = db_objects[name]
            filename = safe_slug(name) + ".md"
            index_lines.append(
                f"- [{name}](./schema-object-pages/{filename}) — refs: {len(info['references'])}; routes: {len(info['routes'])}; features/libs/agents: {len(info['features'] | info['libs'] | info['agents'])}"
            )
        index_lines.append("")

    for name in objects:
        info = db_objects[name]
        filename = safe_slug(name) + ".md"
        lines = [
            f"# Schema object: {name}",
            "",
            f"Generated from the current working tree on {generated_at}.",
            "",
            f"- Kinds: {escape_md(list_to_text(sorted(info['kinds']), limit=10))}",
            f"- Migrations: {escape_md(list_to_text(sorted(info['defined_in']), limit=12))}",
            f"- Non-migration references: {len(info['references'])}",
            f"- Referenced by groups: {escape_md(list_to_text([f'{group} ({count})' for group, count in info['groups'].most_common()], limit=12))}",
            f"- Routes: {escape_md(list_to_text(sorted(info['routes']), limit=12))}",
            f"- Features: {escape_md(list_to_text(sorted(info['features']), limit=12))}",
            f"- Shared libs: {escape_md(list_to_text(sorted(info['libs']), limit=12))}",
            f"- Agent files: {escape_md(list_to_text(sorted(info['agents']), limit=12))}",
            f"- Tests/docs/other: {escape_md(list_to_text(sorted(info['tests'] | info['docs'] | info['other']), limit=16))}",
            "",
        ]
        write_text(schema_dir / filename, "\n".join(lines).rstrip() + "\n")

    write_text(CATALOG_ROOT / "schema-object-profiles.md", "\n".join(index_lines).rstrip() + "\n")


def impact_category(path: str) -> str:
    if path.startswith("src/lib/"):
        return "Shared web libraries"
    if path.startswith("src/features/"):
        return "Feature files"
    if path.startswith("agent/src/services/"):
        return "Agent services"
    if path.startswith("agent/src/"):
        return "Agent runtime files"
    if path.startswith("src/app/admin/actions/"):
        return "Admin actions"
    if path.startswith("src/components/"):
        return "Shared components"
    return "Other impact candidates"


def is_impact_candidate(path: str, metadata: dict[str, object]) -> bool:
    if is_test_file(path) or is_route_file(path):
        return False
    if Path(path).suffix.lower() not in CODE_EXTENSIONS:
        return False
    if path.startswith(("src/lib/", "src/features/", "agent/src/", "src/app/admin/actions/")):
        return bool(
            metadata.get("imported_by")
            or metadata.get("route_owners")
            or metadata.get("tests_related")
            or metadata.get("exports")
        )
    if path.startswith("src/components/"):
        return len(metadata.get("route_owners", [])) >= 2 or len(metadata.get("imported_by", [])) >= 3
    return False


def impact_score(metadata: dict[str, object], db_names: list[str], env_keys: list[str]) -> int:
    return (
        len(metadata.get("route_owners", [])) * 3
        + len(metadata.get("imported_by", [])) * 2
        + len(metadata.get("tests_related", []))
        + len(db_names) * 2
        + len(env_keys)
        + len(extract_mutation_symbols(metadata)) * 2
    )


def write_impact_pages(
    generated_at: str,
    metadata_by_path: dict[str, dict[str, object]],
    db_objects: dict[str, dict[str, object]],
    env_registry: dict[str, dict[str, object]],
) -> None:
    impact_dir = CATALOG_ROOT / "impact-pages"
    impact_dir.mkdir(parents=True, exist_ok=True)
    db_reverse = build_db_reverse_index(db_objects)
    env_reverse = build_env_reverse_index(env_registry)

    candidates = [path for path in sorted(metadata_by_path) if is_impact_candidate(path, metadata_by_path[path])]
    categories: dict[str, list[str]] = defaultdict(list)
    for path in candidates:
        categories[impact_category(path)].append(path)

    index_lines = [
        "# Impact Maps",
        "",
        f"Generated from the current working tree on {generated_at}.",
        "",
        "This index links to pages meant to answer: if I touch this file, what else is likely to move?",
        "",
        f"- Impact candidates tracked: {len(candidates)}",
        "",
    ]

    for category in sorted(categories):
        index_lines.extend([f"## {category}", ""])
        ranked = sorted(
            categories[category],
            key=lambda path: impact_score(metadata_by_path[path], db_reverse.get(path, []), env_reverse.get(path, [])),
            reverse=True,
        )
        for path in ranked:
            metadata = metadata_by_path[path]
            filename = safe_slug(path) + ".md"
            index_lines.append(
                f"- [{path}](./impact-pages/{filename}) — score: {impact_score(metadata, db_reverse.get(path, []), env_reverse.get(path, []))}; routes: {len(metadata.get('route_owners', []))}; tests: {len(metadata.get('tests_related', []))}; db: {len(db_reverse.get(path, []))}"
            )
        index_lines.append("")

    for path in candidates:
        metadata = metadata_by_path[path]
        filename = safe_slug(path) + ".md"
        db_names = db_reverse.get(path, [])
        env_keys = env_reverse.get(path, [])
        lines = [
            f"# Impact: {path}",
            "",
            f"Generated from the current working tree on {generated_at}.",
            "",
            f"- Category: {impact_category(path)}",
            f"- Impact score: {impact_score(metadata, db_names, env_keys)}",
            f"- Ownership: {metadata['ownership']}",
            f"- Feature module: {escape_md(str(metadata.get('feature_module', 'none')))}",
            f"- Route owners: {escape_md(list_to_text([str(v) for v in metadata.get('route_owners', [])], limit=12))}",
            f"- Imported by: {escape_md(list_to_text([str(v) for v in metadata.get('imported_by', [])], limit=12))}",
            f"- Tests related: {escape_md(list_to_text([str(v) for v in metadata.get('tests_related', [])], limit=12))}",
            f"- DB objects: {escape_md(list_to_text(db_names, limit=12))}",
            f"- Env vars: {escape_md(list_to_text(env_keys, limit=12))}",
            f"- Mutation symbols: {escape_md(list_to_text(extract_mutation_symbols(metadata), limit=12))}",
            f"- Auth signals: {escape_md(list_to_text(detect_auth_signals(str(metadata.get('_content', ''))), limit=10))}",
            f"- Behavior signals: {escape_md(list_to_text(detect_behavior_signals(str(metadata.get('_content', ''))), limit=10))}",
            f"- Depends on groups: {escape_md(list_to_text([str(v) for v in metadata.get('depends_on_groups', [])], limit=10))}",
            f"- Used by groups: {escape_md(list_to_text([str(v) for v in metadata.get('used_by_groups', [])], limit=10))}",
            f"- Summary: {escape_md(str(metadata['summary']))}",
            "",
        ]
        write_text(impact_dir / filename, "\n".join(lines).rstrip() + "\n")

    write_text(CATALOG_ROOT / "impact-maps.md", "\n".join(index_lines).rstrip() + "\n")


def write_service_boundaries_page(
    generated_at: str,
    metadata_by_path: dict[str, dict[str, object]],
    db_objects: dict[str, dict[str, object]],
    env_registry: dict[str, dict[str, object]],
) -> None:
    db_reverse = build_db_reverse_index(db_objects)
    web_paths = [path for path in metadata_by_path if path.startswith("src/")]
    agent_paths = [path for path in metadata_by_path if path.startswith("agent/")]
    route_paths = [path for path in metadata_by_path if is_route_file(path)]
    admin_routes = [path for path in route_paths if path.startswith("src/app/admin/")]
    client_routes = [path for path in route_paths if path.startswith("src/app/client/")]
    api_routes = [path for path in route_paths if path.startswith("src/app/api/")]

    web_db_paths = sorted([path for path in web_paths if db_reverse.get(path)])
    agent_db_paths = sorted([path for path in agent_paths if db_reverse.get(path)])
    web_agent_touchpoints = sorted([
        path for path in web_paths
        if any(token in path for token in ["agent", "alerts"]) or any(name in db_reverse.get(path, []) for name in ["agent_tasks", "agent_runtime_state", "agent_alerts", "agent_jobs"])
    ])
    boundary_libs = sorted([
        path for path in metadata_by_path
        if path.startswith("src/lib/") and any(token in path for token in ["agent", "supabase", "member-access", "meta", "google"])
    ])

    env_services = defaultdict(list)
    for key, info in env_registry.items():
        env_services[str(info["service"])].append(key)

    lines = [
        "# Service Boundary Map",
        "",
        f"Generated from the current working tree on {generated_at}.",
        "",
        "This page summarizes the major system boundaries in the repo: web, agent runtime, database, and the bridge files that connect them.",
        "",
        "## Web system",
        f"- Route files: {len(route_paths)}",
        f"- Admin routes: {len(admin_routes)}",
        f"- Client routes: {len(client_routes)}",
        f"- API routes: {len(api_routes)}",
        f"- Web files touching DB objects: {len(web_db_paths)}",
        f"- Web↔agent touchpoints: {escape_md(list_to_text(web_agent_touchpoints, limit=12))}",
        "",
        "## Agent system",
        f"- Agent files tracked: {len(agent_paths)}",
        f"- Agent files touching DB objects: {len(agent_db_paths)}",
        f"- Agent DB touchpoints: {escape_md(list_to_text(agent_db_paths, limit=12))}",
        "",
        "## Database system",
        f"- Schema objects tracked: {len(db_objects)}",
        f"- Tables tracked: {len([name for name, info in db_objects.items() if 'table' in info['kinds']])}",
        f"- Functions/views/triggers tracked: {len([name for name, info in db_objects.items() if 'table' not in info['kinds']])}",
        "",
        "## Shared boundary libraries",
        f"- {escape_md(list_to_text(boundary_libs, limit=16))}",
        "",
        "## Integration services seen in env registry",
    ]

    for service in sorted(env_services):
        lines.append(f"- {service}: {escape_md(list_to_text(sorted(env_services[service]), limit=16))}")

    lines.extend([
        "",
        "## Boundary bridge files",
    ])
    for path in boundary_libs:
        metadata = metadata_by_path[path]
        lines.extend([
            f"### `{path}`",
            f"- Ownership: {metadata['ownership']}",
            f"- DB objects: {escape_md(list_to_text(db_reverse.get(path, []), limit=12))}",
            f"- Route owners: {escape_md(list_to_text([str(v) for v in metadata.get('route_owners', [])], limit=10))}",
            f"- Related tests: {escape_md(list_to_text([str(v) for v in metadata.get('tests_related', [])], limit=10))}",
            f"- Summary: {escape_md(str(metadata['summary']))}",
            "",
        ])

    write_text(CATALOG_ROOT / "service-boundaries.md", "\n".join(lines).rstrip() + "\n")


def write_onboarding_guides(
    generated_at: str,
    metadata_by_path: dict[str, dict[str, object]],
    db_objects: dict[str, dict[str, object]],
) -> None:
    guide_dir = CATALOG_ROOT / "guide-pages"
    guide_dir.mkdir(parents=True, exist_ok=True)

    index_lines = [
        "# Onboarding Guides",
        "",
        f"Generated from the current working tree on {generated_at}.",
        "",
        "This index links to human-oriented read-order guides for common areas of work in the repo.",
        "",
    ]

    for guide in ONBOARDING_GUIDES:
        scope = collect_profile_scope(guide, metadata_by_path, db_objects)
        filename = safe_slug(str(guide["slug"])) + ".md"
        index_lines.append(
            f"- [{guide['title']}](./guide-pages/{filename}) — routes: {len(scope['routes'])}; feature files: {len(scope['features'])}; DB objects: {len(scope['db_names'])}"
        )

        lines = [
            f"# {guide['title']}",
            "",
            f"Generated from the current working tree on {generated_at}.",
            "",
            str(guide["description"]),
            "",
            "## Recommended wiki read order",
        ]
        for link in guide["wiki_links"]:
            lines.append(f"- `{link}`")
        lines.extend([
            "",
            "## Source entrypoints",
            f"- Routes: {escape_md(list_to_text(scope['routes'], limit=12))}",
            f"- Feature files: {escape_md(list_to_text(scope['features'], limit=12))}",
            f"- Libs / agents / admin actions: {escape_md(list_to_text(scope['libs_agents_actions'], limit=12))}",
            f"- DB objects: {escape_md(list_to_text(scope['db_names'], limit=12))}",
            f"- Tests: {escape_md(list_to_text(scope['tests'], limit=12))}",
            f"- Docs: {escape_md(list_to_text(scope['docs'], limit=12))}",
            "",
            "## Signals seen in this area",
            f"- Auth signals: {escape_md(list_to_text([f'{name} ({count})' for name, count in scope['auth_signals'].most_common()], limit=12))}",
            f"- Behavior signals: {escape_md(list_to_text([f'{name} ({count})' for name, count in scope['behavior_signals'].most_common()], limit=12))}",
            "",
        ])

        write_text(guide_dir / filename, "\n".join(lines).rstrip() + "\n")

    write_text(CATALOG_ROOT / "onboarding-guides.md", "\n".join(index_lines).rstrip() + "\n")


def write_test_coverage_page(
    generated_at: str,
    groups: dict[str, list[dict[str, object]]],
) -> None:
    lines = [
        "# Test Coverage Map",
        "",
        f"Generated from the current working tree on {generated_at}.",
        "",
        "This page maps code files to the exact direct and transitive tests currently linked through imports.",
        "",
    ]

    for group in sorted(groups):
        items = [item for item in groups[group] if is_code_source_file(str(item["path"]), item)]
        if not items:
            continue

        direct_count = sum(1 for item in items if item.get("tests_related_direct"))
        transitive_count = sum(1 for item in items if item.get("tests_related"))
        none_count = sum(1 for item in items if not item.get("tests_related"))
        label = GROUP_LABELS.get(group, group)

        lines.extend([
            f"## {label}",
            f"- Code files: {len(items)}",
            f"- With direct test links: {direct_count}",
            f"- With transitive test links: {transitive_count}",
            f"- With no linked tests: {none_count}",
            "",
        ])

        for item in items:
            path = str(item["path"])
            direct_tests = [str(v) for v in item.get("tests_related_direct", [])]
            all_tests = [str(v) for v in item.get("tests_related", [])]
            lines.extend([
                f"### `{path}`",
                f"- Direct tests: {escape_md(list_to_text(direct_tests, limit=10))}",
                f"- All linked tests: {escape_md(list_to_text(all_tests, limit=10))}",
                f"- Route owners: {escape_md(list_to_text([str(v) for v in item.get('route_owners', [])], limit=8))}",
                f"- Imported by: {escape_md(list_to_text([str(v) for v in item.get('imported_by', [])], limit=8))}",
                "",
            ])

    write_text(CATALOG_ROOT / "test-coverage.md", "\n".join(lines).rstrip() + "\n")


def group_stats(items: list[dict[str, object]]) -> str:
    kinds = Counter(str(item["kind"]) for item in items)
    top = ", ".join(f"{k} ({v})" for k, v in kinds.most_common(8))
    return top or "n/a"


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def add_optional(lines: list[str], label: str, value: object, *, limit: int = 12) -> None:
    if value is None:
        return
    if isinstance(value, list):
        if not value:
            return
        lines.append(f"- {label}: {escape_md(list_to_text([str(v) for v in value], limit=limit))}")
        return
    lines.append(f"- {label}: {escape_md(str(value))}")


def build_catalog() -> None:
    CATALOG_ROOT.mkdir(parents=True, exist_ok=True)
    for old_path in list(CATALOG_ROOT.iterdir()):
        if old_path.is_dir():
            shutil.rmtree(old_path)
        else:
            old_path.unlink()

    files = sorted(iter_repo_files())
    metadata_by_path = {rel_path: file_metadata(rel_path) for rel_path in files}
    graph, reverse_graph = enrich_cross_links(metadata_by_path)

    groups: dict[str, list[dict[str, object]]] = defaultdict(list)
    for rel_path in files:
        groups[group_for(rel_path)].append(metadata_by_path[rel_path])

    generated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    system_counts = Counter(system_for(rel_path) for rel_path in files)

    manifest_lines = [
        "# Repo File Catalog",
        "",
        f"Generated from the current working tree on {generated_at}.",
        "",
        "This catalog is documentation-first: it describes what files exist, what each file contains, how each file is constructed, and which system or folder ownership it belongs to.",
        "",
        "## Scope",
        f"- Cataloged files: {len(files)}",
        "- Catalog uses the current working tree, so modified and untracked source files are included if they live in the documented code/doc paths.",
        "- Excluded from the generated catalog to avoid noise or recursion: `.git/`, `node_modules/`, `.next/`, `agent/.next/`, `agent/dist/`, `test-results/`, `tmp-playwright/`, `session/`, `.opencode/`, `.claude/`, `.worktrees/`, and `docs/wiki/pages/catalog/`.",
        "",
        "## System counts",
    ]
    for system, count in sorted(system_counts.items()):
        manifest_lines.append(f"- {system}: {count}")

    manifest_lines.extend([
        "",
        "## Cross-link and dependency pages",
        "- [Group Dependency Map](./group-dependencies.md) — internal dependencies rolled up by catalog group",
        "- [Feature Module Dependency Map](./feature-dependencies.md) — internal dependencies rolled up by `src/features/*` module",
        "- [Route Stack Map](./route-stacks.md) — route file to component/feature/lib stack map",
        "- [Route Profiles](./route-profiles.md) — deeper behavior/context pages for each route file",
        "- [Feature Profiles](./feature-profiles.md) — deeper behavior/context pages for each feature module",
        "- [Business Rule Pages](./business-rules.md) — deeper rule-oriented pages grouped around major business constraints",
        "- [Table Profiles](./table-profiles.md) — deeper per-table pages for migration-discovered tables",
        "- [Schema Object Profiles](./schema-object-profiles.md) — deeper pages for functions, views, triggers, and other non-table schema objects",
        "- [Impact Maps](./impact-maps.md) — if-you-touch-X pages for high-impact shared files",
        "- [Service Boundary Map](./service-boundaries.md) — web vs agent vs database bridge surfaces and shared boundary files",
        "- [Onboarding Guides](./onboarding-guides.md) — human-oriented read-order guides for common work areas",
        "- [Key File Symbol Map](./key-file-symbols.md) — exported symbols and top-level definitions for important code files",
        "- [Auth and Access Map](./auth-access.md) — auth, membership, invite, and scope-related routes/files/DB objects",
        "- [Workflow and Event Map](./workflow-events.md) — workflow-bearing DB objects and code files",
        "- [Workflow Lifecycle Pages](./workflow-lifecycles.md) — deeper lifecycle pages grouped around major system flows",
        "- [Mutation Surface Map](./mutation-surfaces.md) — obvious state-changing routes, actions, and helpers",
        "- [Env and Integration Map](./env-integrations.md) — env vars grouped by integration service and code references",
        "- [Database-to-Code Map](./database-to-code.md) — database objects linked back to code, routes, tests, and docs",
        "- [Supabase Schema Map](./supabase-schema.md) — migration-discovered schema objects grouped by kind",
        "- [API Contract Map](./api-contracts.md) — API route methods, request/response signals, and dependency context",
        "- [Component Tree Map](./component-trees.md) — admin/client UI surface component trees",
        "- [Test Coverage Map](./test-coverage.md) — code files linked to exact direct and transitive tests",
        "",
        "## Group pages",
    ])

    for group in sorted(groups):
        label = GROUP_LABELS.get(group, group)
        items = groups[group]
        page_name = f"{group}.md"
        manifest_lines.append(f"- [{label}](./{page_name}) — {len(items)} files")

        page_lines = [
            f"# {label}",
            "",
            f"Generated from the current working tree on {generated_at}.",
            "",
            f"- Files: {len(items)}",
            f"- File kinds: {group_stats(items)}",
            "",
            "Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.",
            "",
        ]

        for item in items:
            page_lines.append(f"## `{item['path']}`")
            page_lines.append(f"- Status: {item['status']}")
            page_lines.append(f"- System: {item['system']}")
            page_lines.append(f"- Group: {item['group']}")
            page_lines.append(f"- Ownership: {item['ownership']}")
            page_lines.append(f"- Type: {item['kind']}")
            add_optional(page_lines, "Construction", item.get("construction"), limit=10)
            add_optional(page_lines, "Route", item.get("route"))
            add_optional(page_lines, "Route context", item.get("route_context"))
            add_optional(page_lines, "Lines", item.get("lines"))
            add_optional(page_lines, "Bytes", item.get("bytes"))
            add_optional(page_lines, "Imports (internal)", item.get("internal_imports"), limit=10)
            add_optional(page_lines, "Imports (internal unresolved)", item.get("internal_imports_unresolved"), limit=10)
            add_optional(page_lines, "Imports (packages)", item.get("external_imports"), limit=10)
            add_optional(page_lines, "Imported by", item.get("imported_by"), limit=10)
            add_optional(page_lines, "Depends on groups", item.get("depends_on_groups"), limit=10)
            add_optional(page_lines, "Used by groups", item.get("used_by_groups"), limit=10)
            add_optional(page_lines, "Feature module", item.get("feature_module"))
            add_optional(page_lines, "Route owners", item.get("route_owners"), limit=8)
            add_optional(page_lines, "Routes related (direct)", item.get("routes_related_direct"), limit=8)
            add_optional(page_lines, "Tests related", item.get("tests_related"), limit=8)
            add_optional(page_lines, "Tests related (direct)", item.get("tests_related_direct"), limit=8)
            add_optional(page_lines, "Exports", item.get("exports"), limit=12)
            add_optional(page_lines, "Symbol details", item.get("symbol_details"), limit=16)
            add_optional(page_lines, "Defines", item.get("defines"), limit=12)
            add_optional(page_lines, "Route handlers", item.get("route_handlers"), limit=10)
            add_optional(page_lines, "Tests / describe labels", item.get("tests_named"), limit=8)
            add_optional(page_lines, "Headings", item.get("headings"), limit=10)
            add_optional(page_lines, "JSON shape", item.get("json_shape"))
            add_optional(page_lines, "JSON keys", item.get("json_keys"), limit=12)
            add_optional(page_lines, "JSON scripts", item.get("json_scripts"), limit=12)
            add_optional(page_lines, "SQL objects", item.get("sql_objects"), limit=12)
            page_lines.append(f"- Contents summary: {escape_md(str(item['summary']))}")
            page_lines.append("")

        write_text(CATALOG_ROOT / page_name, "\n".join(page_lines).rstrip() + "\n")

    write_text(CATALOG_ROOT / "manifest.md", "\n".join(manifest_lines).rstrip() + "\n")
    write_group_dependency_page(generated_at, groups, graph, reverse_graph)
    write_feature_dependency_page(generated_at, groups, graph, reverse_graph)
    db_objects = build_database_registry(metadata_by_path)
    write_route_stack_page(generated_at, metadata_by_path, graph)
    write_route_profile_pages(generated_at, metadata_by_path, graph, db_objects)
    write_feature_profile_pages(generated_at, groups, metadata_by_path, graph, reverse_graph, db_objects)
    write_business_rule_pages(generated_at, metadata_by_path, db_objects)
    write_table_profile_pages(generated_at, metadata_by_path, db_objects)
    write_schema_object_profile_pages(generated_at, db_objects)
    env_registry = build_env_registry(metadata_by_path)
    write_impact_pages(generated_at, metadata_by_path, db_objects, env_registry)
    write_key_symbol_page(generated_at, metadata_by_path)
    write_service_boundaries_page(generated_at, metadata_by_path, db_objects, env_registry)
    write_onboarding_guides(generated_at, metadata_by_path, db_objects)
    write_env_integration_page(generated_at, env_registry)
    write_auth_access_page(generated_at, metadata_by_path, db_objects)
    write_workflow_map_page(generated_at, metadata_by_path, db_objects)
    write_workflow_lifecycle_pages(generated_at, metadata_by_path, db_objects)
    write_mutation_surface_page(generated_at, metadata_by_path, db_objects)
    write_database_map_page(generated_at, db_objects)
    write_supabase_schema_page(generated_at, db_objects)
    write_api_contract_page(generated_at, metadata_by_path, graph)
    write_component_tree_page(generated_at, metadata_by_path, graph)
    write_test_coverage_page(generated_at, groups)

    local_lines = [
        "# Working Tree Snapshot",
        "",
        f"Generated from the current working tree on {generated_at}.",
        "",
        "## Git status summary",
    ]

    status_counter = Counter(GIT_STATUS.values())
    if status_counter:
        for status, count in sorted(status_counter.items()):
            local_lines.append(f"- {status}: {count}")
    else:
        local_lines.append("- working tree clean")

    local_lines.extend([
        "",
        "## Changed paths currently present",
    ])
    if GIT_STATUS:
        for path in sorted(GIT_STATUS):
            local_lines.append(f"- `{path}` — {GIT_STATUS[path]}")
    else:
        local_lines.append("- none")

    present_excluded = []
    for rel in [
        ".next",
        "node_modules",
        "agent/.next",
        "agent/dist",
        "agent/node_modules",
        "test-results",
        "tmp-playwright",
        "session",
        ".opencode",
        ".claude",
        ".worktrees",
    ]:
        if (ROOT / rel).exists():
            present_excluded.append(rel)

    local_lines.extend([
        "",
        "## Excluded local/generated directories currently present",
    ])
    if present_excluded:
        for rel in present_excluded:
            local_lines.append(f"- `{rel}`")
    else:
        local_lines.append("- none")

    write_text(CATALOG_ROOT / "working-tree.md", "\n".join(local_lines).rstrip() + "\n")


if __name__ == "__main__":
    build_catalog()
