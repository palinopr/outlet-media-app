import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

vi.mock("@/features/client-portal/access", () => ({
  requireClientAccess: vi.fn(),
}));

vi.mock("@/features/notifications/server", () => ({
  listNotificationsForUser: vi.fn(),
}));

vi.mock("@/components/workspace/notifications-center", () => ({
  NotificationsCenter: ({
    initialNotifications,
    viewer,
  }: {
    initialNotifications: unknown[];
    viewer: "admin" | "client";
  }) => (
    <div data-testid="notifications-center">
      {viewer}:{initialNotifications.length}
    </div>
  ),
}));

import ClientNotificationsPage from "./page";
import { requireClientAccess } from "@/features/client-portal/access";
import { listNotificationsForUser } from "@/features/notifications/server";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ClientNotificationsPage", () => {
  it("passes assigned client scope into the initial inbox load", async () => {
    vi.mocked(requireClientAccess).mockResolvedValue({
      scope: {
        allowedCampaignIds: ["cmp_1"],
        allowedEventIds: ["evt_1"],
      },
      userId: "user_1",
    } as Awaited<ReturnType<typeof requireClientAccess>>);
    vi.mocked(listNotificationsForUser).mockResolvedValue([]);

    const element = await ClientNotificationsPage({
      params: Promise.resolve({ slug: "zamora" }),
    });

    render(<>{element}</>);

    expect(listNotificationsForUser).toHaveBeenCalledWith("user_1", {
      clientSlug: "zamora",
      scope: {
        allowedCampaignIds: ["cmp_1"],
        allowedEventIds: ["evt_1"],
      },
    });
    expect(screen.getByTestId("notifications-center")).toHaveTextContent("client:0");
  });
});
