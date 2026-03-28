import { describe, expect, it } from "vitest";
import {
  getApprovalWorkflowPaths,
  getAssetWorkflowPaths,
  getCampaignWorkflowPaths,
  getCrmWorkflowPaths,
  getEventWorkflowPaths,
  getWorkspaceMutationTargets,
} from "./revalidation";

describe("workflow revalidation paths", () => {
  it("keeps campaign workflow revalidation on surviving admin and client routes", () => {
    expect(getCampaignWorkflowPaths("acme", "cmp_1")).toEqual([
      "/admin/activity",
      "/admin/campaigns",
      "/admin/campaigns/cmp_1",
      "/admin/dashboard",
      "/client/acme/campaign/cmp_1",
      "/client/acme/campaigns",
    ]);
  });

  it("collapses asset and CRM workflow revalidation onto kept surfaces", () => {
    expect(getAssetWorkflowPaths("acme", "asset_1")).toEqual([
      "/admin/activity",
      "/admin/campaigns",
      "/admin/dashboard",
      "/client/acme/campaigns",
    ]);

    expect(getCrmWorkflowPaths("acme", "contact_1")).toEqual([
      "/admin/activity",
      "/admin/clients",
      "/admin/dashboard",
      "/client/acme/campaigns",
    ]);
  });

  it("keeps event workflow revalidation on surviving routes only", () => {
    expect(getEventWorkflowPaths("acme", "evt_1")).toEqual([
      "/admin/activity",
      "/admin/dashboard",
      "/admin/events",
      "/admin/events/evt_1",
      "/client/acme/event/evt_1",
      "/client/acme/events",
    ]);
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
      "/admin/activity",
      "/admin/dashboard",
      "/admin/campaigns",
      "/client/acme/campaigns",
    ]);
  });

  it("reduces workspace mutation targets to surviving summary surfaces", () => {
    expect(
      getWorkspaceMutationTargets({
        clientSlug: "acme",
        includeActivity: true,
        includeNotifications: true,
        includeTasks: true,
        pageIds: ["page_1"],
      }),
    ).toEqual([
      { path: "/admin/dashboard" },
      { path: "/admin/activity" },
    ]);
  });
});
