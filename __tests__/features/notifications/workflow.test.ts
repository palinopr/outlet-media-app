import { beforeEach, describe, expect, it, vi } from "vitest";

const { createNotification, listAdminNotificationRecipients } = vi.hoisted(() => ({
  createNotification: vi.fn(),
  listAdminNotificationRecipients: vi.fn(),
}));

vi.mock("@/features/notifications/server", () => ({
  createNotification,
  listAdminNotificationRecipients,
}));

import { notifyWorkflowAssignee } from "@/features/notifications/workflow";

describe("workflow assignment notifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("notifies assigned shared-workflow users", async () => {
    const result = await notifyWorkflowAssignee({
      actorId: "user_1",
      actorName: "Outlet",
      assigneeId: "user_2",
      clientSlug: "zamora",
      entityId: "cmp_1",
      entityType: "campaign",
      message: "Review budget pacing",
      title: "Campaign action assigned to you",
      visibility: "shared",
    });

    expect(result).toBe(true);
    expect(createNotification).toHaveBeenCalledWith({
      clientSlug: "zamora",
      entityId: "cmp_1",
      entityType: "campaign",
      fromUserId: "user_1",
      fromUserName: "Outlet",
      message: "Review budget pacing",
      title: "Campaign action assigned to you",
      type: "assignment",
      userId: "user_2",
    });
  });

  it("skips admin-only assignment notifications for non-admin assignees", async () => {
    listAdminNotificationRecipients.mockResolvedValue(["admin_1"]);

    const result = await notifyWorkflowAssignee({
      actorId: "admin_actor",
      actorName: "Outlet",
      assigneeId: "client_user",
      clientSlug: "zamora",
      entityId: "asset_1",
      entityType: "asset",
      message: "Review new poster variants",
      title: "Asset follow-up assigned to you",
      visibility: "admin_only",
    });

    expect(result).toBe(false);
    expect(createNotification).not.toHaveBeenCalled();
  });
});
