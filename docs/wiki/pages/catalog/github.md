# .github

Generated from the current working tree on 2026-04-28 02:31:12.

- Files: 4
- File kinds: file (.yml) (4)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `.github/workflows/ci.yml`
- Status: tracked-clean
- System: github
- Group: .github
- Ownership: GitHub workflow/config
- Type: file (.yml)
- Lines: 29
- Bytes: 539
- Contents summary: text lines: name: CI \| on: \| push: \| branches: [main] \| pull_request: \| branches: [main]

## `.github/workflows/codex-pr-review.yml`
- Status: tracked-clean
- System: github
- Group: .github
- Ownership: GitHub workflow/config
- Type: file (.yml)
- Lines: 93
- Bytes: 2939
- Contents summary: text lines: name: Codex PR Review \| on: \| workflow_dispatch: \| inputs: \| pr_number: \| description: Pull request number to review

## `.github/workflows/db-drift.yml`
- Status: tracked-clean
- System: github
- Group: .github
- Ownership: GitHub workflow/config
- Type: file (.yml)
- Lines: 43
- Bytes: 1213
- Contents summary: text lines: name: Supabase Drift Check \| on: \| workflow_dispatch: \| inputs: \| project_ref: \| description: "Supabase project ref"

## `.github/workflows/e2e-smoke.yml`
- Status: tracked-clean
- System: github
- Group: .github
- Ownership: GitHub workflow/config
- Type: file (.yml)
- Lines: 57
- Bytes: 1429
- Contents summary: text lines: name: E2E Smoke \| on: \| workflow_dispatch: \| inputs: \| base_url: \| description: "App URL to smoke test"
