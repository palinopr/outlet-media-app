import { describe, expect, it } from "vitest";
import {
  getApprovalWorkflowPaths,
  getAssetWorkflowPaths,
  getCampaignWorkflowPaths,
  getCrmWorkflowPaths,
  getEventWorkflowPaths,
  getWorkspaceMutationTargets,
} from "@/features/workflow/revalidation";

describe("workflow revalidation paths", () => {
  it("covers campaign operating surfaces", () => {
    expect(getCampaignWorkflowPaths("zamora", "cmp_1")).toEqual([
      "/admin/activity",
      "/admin/campaigns",
      "/admin/campaigns/cmp_1",
      "/admin/conversations",
      "/admin/dashboard",
      "/admin/notifications",
      "/admin/workspace",
      "/admin/workspace/tasks",
      "/client/zamora",
      "/client/zamora/campaign/cmp_1",
      "/client/zamora/campaigns",
      "/client/zamora/conversations",
      "/client/zamora/notifications",
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
      "/admin/conversations",
      "/admin/dashboard",
      "/admin/notifications",
      "/admin/workspace",
      "/admin/workspace/tasks",
      "/client/zamora",
      "/client/zamora/assets",
      "/client/zamora/assets/asset_1",
      "/client/zamora/conversations",
      "/client/zamora/notifications",
      "/client/zamora/updates",
      "/client/zamora/workspace",
      "/client/zamora/workspace/tasks",
    ]);

    expect(getCrmWorkflowPaths("zamora", "crm_1")).toEqual([
      "/admin/activity",
      "/admin/conversations",
      "/admin/crm",
      "/admin/crm/crm_1",
      "/admin/dashboard",
      "/admin/notifications",
      "/admin/workspace",
      "/admin/workspace/tasks",
      "/client/zamora",
      "/client/zamora/conversations",
      "/client/zamora/crm",
      "/client/zamora/crm/crm_1",
      "/client/zamora/notifications",
      "/client/zamora/updates",
      "/client/zamora/workspace",
      "/client/zamora/workspace/tasks",
    ]);

    expect(getEventWorkflowPaths("zamora", "evt_1")).toEqual([
      "/admin/activity",
      "/admin/conversations",
      "/admin/dashboard",
      "/admin/events",
      "/admin/events/evt_1",
      "/admin/notifications",
      "/admin/workspace",
      "/admin/workspace/tasks",
      "/client/zamora",
      "/client/zamora/conversations",
      "/client/zamora/event/evt_1",
      "/client/zamora/events",
      "/client/zamora/notifications",
      "/client/zamora/updates",
      "/client/zamora/workspace",
      "/client/zamora/workspace/tasks",
    ]);
  });

  it("keeps admin-only paths when client slug is unavailable", () => {
    expect(getEventWorkflowPaths(null, "evt_1")).toEqual([
      "/admin/activity",
      "/admin/conversations",
      "/admin/dashboard",
      "/admin/events",
      "/admin/events/evt_1",
      "/admin/notifications",
      "/admin/workspace",
      "/admin/workspace/tasks",
    ]);
  });

  it("covers approval centers plus linked entity surfaces", () => {
    expect(
      getApprovalWorkflowPaths({
        audience: "shared",
        clientSlug: "zamora",
        entityId: "asset_1",
        entityType: "asset",
        metadata: {
          assetId: "asset_1",
          campaignId: "cmp_1",
        },
        pageId: "page_1",
        requestType: "asset_review",
      }),
    ).toEqual([
      "/admin/activity",
      "/admin/approvals",
      "/admin/dashboard",
      "/admin/notifications",
      "/admin/reports",
      "/admin/workspace",
      "/admin/workspace/tasks",
      "/client/zamora",
      "/client/zamora/approvals",
      "/client/zamora/notifications",
      "/client/zamora/reports",
      "/client/zamora/updates",
      "/client/zamora/workspace",
      "/client/zamora/workspace/tasks",
      "/admin/workspace/page_1",
      "/client/zamora/workspace/page_1",
      "/admin/campaigns",
      "/admin/campaigns/cmp_1",
      "/admin/conversations",
      "/client/zamora/campaign/cmp_1",
      "/client/zamora/campaigns",
      "/client/zamora/conversations",
      "/admin/assets",
      "/admin/assets/asset_1",
      "/client/zamora/assets",
      "/client/zamora/assets/asset_1",
    ]);

    expect(
      getApprovalWorkflowPaths({
        audience: "admin",
        clientSlug: "zamora",
        entityId: "evt_1",
        entityType: "event",
        metadata: null,
        pageId: null,
        requestType: "event_review",
      }),
    ).toEqual([
      "/admin/activity",
      "/admin/approvals",
      "/admin/dashboard",
      "/admin/notifications",
      "/admin/reports",
      "/admin/workspace",
      "/admin/workspace/tasks",
      "/admin/conversations",
      "/admin/events",
      "/admin/events/evt_1",
    ]);
  });

  it("covers workspace layout, detail, notifications, and activity targets", () => {
    expect(
      getWorkspaceMutationTargets({
        clientSlug: "zamora",
        includeActivity: true,
        includeNotifications: true,
        includeTasks: true,
        pageIds: ["page_1", "page_2", "page_1"],
      }),
    ).toEqual([
      { path: "/admin/workspace", type: "layout" },
      { path: "/admin/activity" },
      { path: "/admin/notifications" },
      { path: "/admin/workspace/tasks" },
      { path: "/admin/workspace/page_1" },
      { path: "/admin/workspace/page_2" },
      { path: "/client/zamora/workspace", type: "layout" },
      { path: "/client/zamora/updates" },
      { path: "/client/zamora/notifications" },
      { path: "/client/zamora/workspace/tasks" },
      { path: "/client/zamora/workspace/page_1" },
      { path: "/client/zamora/workspace/page_2" },
    ]);

    expect(
      getWorkspaceMutationTargets({
        clientSlug: "admin",
        includeNotifications: true,
        pageIds: ["page_1"],
      }),
    ).toEqual([
      { path: "/admin/workspace", type: "layout" },
      { path: "/admin/notifications" },
      { path: "/admin/workspace/page_1" },
    ]);
  });
});
