import { describe, expect, it } from "vitest";
import {
  getApprovalWorkflowPaths,
  getAssetWorkflowPaths,
  getCampaignWorkflowPaths,
  getEventWorkflowPaths,
} from "./revalidation";

describe("workflow revalidation paths", () => {
  it("keeps campaign workflow revalidation on surviving admin and client routes", () => {
    expect(getCampaignWorkflowPaths("acme", "cmp_1")).toEqual([
      "/admin/campaigns",
      "/admin/campaigns/cmp_1",
      "/admin/dashboard",
      "/client/acme/campaign/cmp_1",
      "/client/acme/campaigns",
    ]);
  });

  it("collapses asset workflow revalidation onto kept surfaces", () => {
    expect(getAssetWorkflowPaths("acme", "asset_1")).toEqual([
      "/admin/campaigns",
      "/admin/dashboard",
      "/client/acme/campaigns",
    ]);
  });

  it("keeps event workflow revalidation on surviving routes only", () => {
    expect(getEventWorkflowPaths("acme", "evt_1")).toEqual(["/admin/dashboard"]);
  });

  it("drops approvals, reports, notifications, updates, and workspace paths from approval revalidation", () => {
    expect(
      getApprovalWorkflowPaths({
        audience: "shared",
        clientSlug: "acme",
        entityType: "asset",
        entityId: "asset_1",
      }),
    ).toEqual([
      "/admin/dashboard",
      "/admin/campaigns",
      "/client/acme/campaigns",
    ]);
  });

});
