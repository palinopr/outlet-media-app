import { describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  apiRouteToUrlPrefix,
  apiRouteToUrlPattern,
  classifyRouteRoot,
  createSurfaceAudit,
  extractImportSpecifiers,
  hasApiRouteReference,
  hasApiUrlReference,
  isPublicFunnelException,
  isRouteRoot,
} from "./audit-surfaces.mjs";

describe("surface audit classification", () => {
  it("detects Next.js route roots", () => {
    expect(isRouteRoot("src/app/admin/campaigns/page.tsx")).toBe(true);
    expect(isRouteRoot("src/app/client/[slug]/campaigns/loading.tsx")).toBe(true);
    expect(isRouteRoot("src/components/admin/nav-config.ts")).toBe(false);
  });

  it("classifies active routes and flags retired surface reintroductions for product decision", () => {
    expect(classifyRouteRoot("src/app/admin/campaigns/page.tsx")).toBe("active shipped route root");
    expect(classifyRouteRoot("src/app/admin/clients/[id]/page.tsx")).toBe("active shipped route root");
    expect(classifyRouteRoot("src/app/admin/events/page.tsx")).toBe("needs product decision");
    expect(classifyRouteRoot("src/app/admin/clients/[id]/reports/page.tsx")).toBe("needs product decision");
    expect(classifyRouteRoot("src/app/admin/campaigns/[id]/events/page.tsx")).toBe("needs product decision");
    expect(classifyRouteRoot("src/app/client/[slug]/reports/page.tsx")).toBe("needs product decision");
    expect(classifyRouteRoot("src/app/client/[slug]/campaigns/reports/page.tsx")).toBe("needs product decision");
  });

  it("protects the 9am public funnel exception", () => {
    expect(isPublicFunnelException("src/app/9am/[city]/route.ts")).toBe(true);
    expect(isPublicFunnelException("public/9am/orlando/poster.jpg")).toBe(true);
    expect(isPublicFunnelException("src/app/ataca-sergio/[market]/route.ts")).toBe(true);
    expect(isPublicFunnelException("public/ataca-sergio/newark/index.html")).toBe(true);
    expect(classifyRouteRoot("src/app/9am/[city]/route.ts")).toBe("active shipped route root");
    expect(classifyRouteRoot("src/app/ataca-sergio/[market]/route.ts")).toBe("active shipped route root");
  });

  it("extracts static import specifiers used by the import graph", () => {
    const source = `
      import type { Metadata } from "next";
      import { AdminPageHeader } from "@/components/admin/page-header";
      export { default } from "./error-boundary";
      const dynamicImport = import("./campaigns/data");
    `;

    expect(extractImportSpecifiers(source)).toEqual([
      "next",
      "@/components/admin/page-header",
      "./error-boundary",
      "./campaigns/data",
    ]);
  });

  it("maps API route roots to URL prefixes for product caller detection", () => {
    expect(apiRouteToUrlPrefix("src/app/api/contact/route.ts")).toBe("/api/contact");
    expect(apiRouteToUrlPrefix("src/app/api/admin/users/[id]/route.ts")).toBe("/api/admin/users/[id]");
    expect(apiRouteToUrlPrefix("src/app/admin/campaigns/page.tsx")).toBeNull();
  });

  it("builds API URL patterns from dynamic route roots", () => {
    expect(apiRouteToUrlPattern("src/app/api/contact/route.ts")?.test('fetch("/api/contact")')).toBe(true);
    expect(apiRouteToUrlPattern("src/app/api/admin/users/[id]/route.ts")?.test("fetch(`/api/admin/users/${user.id}`)")).toBe(true);
    expect(apiRouteToUrlPattern("src/app/api/admin/users/[id]/route.ts")?.test('fetch("/api/admin/users")')).toBe(false);
    expect(apiRouteToUrlPattern("src/app/api/admin/users/[id]/route.ts")?.test('fetch("/api/admin/users-archive/123")')).toBe(false);
  });

  it("detects direct API URL references without matching unrelated paths", () => {
    expect(hasApiUrlReference('await fetch("/api/contact", { method: "POST" })', "/api/contact")).toBe(true);
    expect(hasApiUrlReference("const url = `/api/contact?source=landing`;", "/api/contact")).toBe(true);
    expect(hasApiUrlReference('await fetch("/api/contact-us")', "/api/contact")).toBe(false);
  });

  it("detects dynamic API route callers", () => {
    expect(
      hasApiRouteReference(
        "await fetch(`/api/admin/users/${user.id}`, { method: 'PATCH' })",
        "src/app/api/admin/users/[id]/route.ts",
      ),
    ).toBe(true);
  });

  it("seeds reachability from all Next.js route roots while keeping route classifications separate", () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "surface-audit-"));
    fs.mkdirSync(path.join(tempRoot, "src/app/api/ingest"), { recursive: true });
    fs.writeFileSync(
      path.join(tempRoot, "src/app/api/ingest/route.ts"),
      'import { ingestMetaCampaigns } from "./ingest-meta-campaigns";\nexport async function POST() { return ingestMetaCampaigns(); }\n',
    );
    fs.writeFileSync(
      path.join(tempRoot, "src/app/api/ingest/ingest-meta-campaigns.ts"),
      "export function ingestMetaCampaigns() { return Response.json({ ok: true }); }\n",
    );

    const report = createSurfaceAudit(tempRoot);

    expect(report.activeRouteRoots).toContain("src/app/api/ingest/route.ts");
    expect(report.unreachableCandidates).not.toContain("src/app/api/ingest/ingest-meta-campaigns.ts");
    expect(report.routeRootsNeedingDecision).not.toContain("src/app/api/ingest/route.ts");
  });

  it("does not report documented externally called operational APIs as missing callers", () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "surface-audit-"));
    fs.mkdirSync(path.join(tempRoot, "src/app/api/health"), { recursive: true });
    fs.mkdirSync(path.join(tempRoot, "src/app/api/ingest"), { recursive: true });
    fs.mkdirSync(path.join(tempRoot, "src/app/api/meta/callback"), { recursive: true });
    fs.mkdirSync(path.join(tempRoot, "src/app/api/meta/data-deletion"), { recursive: true });

    for (const file of [
      "src/app/api/health/route.ts",
      "src/app/api/ingest/route.ts",
      "src/app/api/meta/callback/route.ts",
      "src/app/api/meta/data-deletion/route.ts",
    ]) {
      fs.writeFileSync(path.join(tempRoot, file), "export async function GET() { return Response.json({ ok: true }); }\n");
    }

    const report = createSurfaceAudit(tempRoot);

    expect(report.apiRoutesWithNoObviousCaller).toEqual([]);
  });
});
