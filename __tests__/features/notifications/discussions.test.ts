import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  createNotification,
  listAdminNotificationRecipients,
  listClientNotificationRecipients,
} = vi.hoisted(() => ({
  createNotification: vi.fn(),
  listAdminNotificationRecipients: vi.fn(),
  listClientNotificationRecipients: vi.fn(),
}));

vi.mock("@/features/notifications/server", () => ({
  createNotification,
  listAdminNotificationRecipients,
  listClientNotificationRecipients,
}));

import {
  listDiscussionNotificationRecipientIds,
  notifyDiscussionAudience,
} from "@/features/notifications/discussions";

describe("discussion notifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("notifies admins and shared client members for shared comments", async () => {
    listAdminNotificationRecipients.mockResolvedValue(["admin_1", "admin_2"]);
    listClientNotificationRecipients.mockResolvedValue(["client_1", "admin_2"]);

    const recipients = await listDiscussionNotificationRecipientIds({
      actorId: "user_1",
      clientSlug: "zamora",
      visibility: "shared",
    });

    expect(listAdminNotificationRecipients).toHaveBeenCalledWith({
      excludeUserId: "user_1",
    });
    expect(listClientNotificationRecipients).toHaveBeenCalledWith("zamora", {
      excludeUserId: "user_1",
    });
    expect(recipients).toEqual(["admin_1", "admin_2", "client_1"]);
  });

  it("limits admin-only comments to admins", async () => {
    listAdminNotificationRecipients.mockResolvedValue(["admin_1"]);

    const recipients = await listDiscussionNotificationRecipientIds({
      actorId: "admin_actor",
      clientSlug: "zamora",
      visibility: "admin_only",
    });

    expect(listClientNotificationRecipients).not.toHaveBeenCalled();
    expect(recipients).toEqual(["admin_1"]);
  });

  it("creates comment notifications that deep-link to the parent entity", async () => {
    listAdminNotificationRecipients.mockResolvedValue(["admin_1"]);
    listClientNotificationRecipients.mockResolvedValue(["client_1"]);

    await notifyDiscussionAudience({
      actorId: "user_1",
      actorName: "Jaime",
      clientSlug: "zamora",
      entityId: "cmp_123",
      entityType: "campaign",
      message: "Client asked for updated copy.",
      title: "New campaign comment",
      visibility: "shared",
    });

    expect(createNotification).toHaveBeenCalledTimes(2);
    expect(createNotification).toHaveBeenCalledWith({
      clientSlug: "zamora",
      entityId: "cmp_123",
      entityType: "campaign",
      fromUserId: "user_1",
      fromUserName: "Jaime",
      message: "Client asked for updated copy.",
      title: "New campaign comment",
      type: "comment",
      userId: "admin_1",
    });
    expect(createNotification).toHaveBeenCalledWith({
      clientSlug: "zamora",
      entityId: "cmp_123",
      entityType: "campaign",
      fromUserId: "user_1",
      fromUserName: "Jaime",
      message: "Client asked for updated copy.",
      title: "New campaign comment",
      type: "comment",
      userId: "client_1",
    });
  });
});
