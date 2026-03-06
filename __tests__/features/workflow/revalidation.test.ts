import { describe, expect, it } from "vitest";
import {
  getAssetWorkflowPaths,
  getCampaignWorkflowPaths,
  getCrmWorkflowPaths,
  getEventWorkflowPaths,
} from "@/features/workflow/revalidation";

describe("workflow revalidation paths", () => {
  it("covers campaign operating surfaces", () => {
    expect(getCampaignWorkflowPaths("zamora", "cmp_1")).toEqual([
      "/admin/activity",
      "/admin/campaigns",
      "/admin/campaigns/cmp_1",
      "/admin/dashboard",
      "/admin/workspace",
      "/admin/workspace/tasks",
      "/client/zamora",
      "/client/zamora/campaign/cmp_1",
      "/client/zamora/campaigns",
      "/client/zamora/updates",
      "/client/zamora/workspace",
      "/client/zamora/workspace/tasks",
    ]);
  });

  it("covers asset, CRM, and event operating surfaces", () => {
    expect(getAssetWorkflowPaths("zamora", "asset_1")).toEqual([
      "/admin/activity",
      "/admin/assets",
      "/admin/assets/asset_1",
      "/admin/dashboard",
      "/admin/workspace",
      "/admin/workspace/tasks",
      "/client/zamora",
      "/client/zamora/assets",
      "/client/zamora/assets/asset_1",
      "/client/zamora/updates",
      "/client/zamora/workspace",
      "/client/zamora/workspace/tasks",
    ]);

    expect(getCrmWorkflowPaths("zamora", "crm_1")).toEqual([
      "/admin/activity",
      "/admin/crm",
      "/admin/crm/crm_1",
      "/admin/dashboard",
      "/admin/workspace",
      "/admin/workspace/tasks",
      "/client/zamora",
      "/client/zamora/crm",
      "/client/zamora/crm/crm_1",
      "/client/zamora/updates",
      "/client/zamora/workspace",
      "/client/zamora/workspace/tasks",
    ]);

    expect(getEventWorkflowPaths("zamora", "evt_1")).toEqual([
      "/admin/activity",
      "/admin/dashboard",
      "/admin/events",
      "/admin/events/evt_1",
      "/admin/workspace",
      "/admin/workspace/tasks",
      "/client/zamora",
      "/client/zamora/event/evt_1",
      "/client/zamora/events",
      "/client/zamora/updates",
      "/client/zamora/workspace",
      "/client/zamora/workspace/tasks",
    ]);
  });

  it("keeps admin-only paths when client slug is unavailable", () => {
    expect(getEventWorkflowPaths(null, "evt_1")).toEqual([
      "/admin/activity",
      "/admin/dashboard",
      "/admin/events",
      "/admin/events/evt_1",
      "/admin/workspace",
      "/admin/workspace/tasks",
    ]);
  });
});
