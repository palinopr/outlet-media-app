import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/approvals/server", () => ({
  listApprovalRequests: vi.fn(),
}));

vi.mock("@/features/notifications/server", () => ({
  listNotificationsForUser: vi.fn(),
}));

vi.mock("@/features/work-queue/server", () => ({
  getWorkQueue: vi.fn(),
}));

import { listApprovalRequests } from "@/features/approvals/server";
import {
  getAdminNotificationsCenter,
  getClientNotificationsCenter,
} from "@/features/notifications/center";
import { listNotificationsForUser } from "@/features/notifications/server";
import { getWorkQueue } from "@/features/work-queue/server";

describe("notifications center loaders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(listApprovalRequests).mockResolvedValue([]);
    vi.mocked(listNotificationsForUser).mockResolvedValue([]);
    vi.mocked(getWorkQueue).mockResolvedValue({
      items: [],
      metrics: [],
    });
  });

  it("loads scoped client inbox context", async () => {
    const scope = {
      allowedCampaignIds: ["cmp_1"],
      allowedEventIds: ["evt_1"],
    };

    await getClientNotificationsCenter({
      clientSlug: "zamora",
      scope,
      userId: "user_1",
    });

    expect(listApprovalRequests).toHaveBeenCalledWith({
      audience: "shared",
      clientSlug: "zamora",
      limit: 5,
      scope,
      status: "pending",
    });
    expect(listNotificationsForUser).toHaveBeenCalledWith("user_1", {
      clientSlug: "zamora",
      scope,
    });
    expect(getWorkQueue).toHaveBeenCalledWith({
      assigneeId: "user_1",
      clientSlug: "zamora",
      limit: 4,
      mode: "client",
      scope,
    });
  });

  it("loads admin inbox context without client scoping", async () => {
    await getAdminNotificationsCenter({ userId: "admin_1" });

    expect(listApprovalRequests).toHaveBeenCalledWith({
      audience: "all",
      limit: 5,
      status: "pending",
    });
    expect(listNotificationsForUser).toHaveBeenCalledWith("admin_1");
    expect(getWorkQueue).toHaveBeenCalledWith({
      assigneeId: "admin_1",
      limit: 4,
      mode: "admin",
    });
  });
});
