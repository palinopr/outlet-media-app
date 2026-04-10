import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { EventOperatingData } from "@/features/events/server";

const getEventOperatingData = vi.fn();

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

vi.mock("@/features/events/server", () => ({
  getEventOperatingData,
}));

vi.mock("@/components/admin/events/event-operating-panel", () => ({
  EventOperatingPanel: () => <div data-testid="event-operating-panel" />,
}));

vi.mock("@/components/admin/client-requests-panel", () => ({
  ClientRequestsPanel: ({ entityId }: { entityId: string }) => (
    <div data-testid="client-requests-panel" data-entity-id={entityId} />
  ),
}));

const data = {
  clients: [{ slug: "zamora" }],
  comments: [
    {
      id: "comment_1",
      eventId: "evt_1",
      clientSlug: "zamora",
      content: "Need the latest hold count before increasing spend.",
      visibility: "shared",
      authorId: null,
      authorName: "Client Team",
      parentCommentId: null,
      resolved: false,
      createdAt: "2026-04-10T10:00:00.000Z",
      updatedAt: "2026-04-10T10:00:00.000Z",
    },
  ],
  event: {
    avgTicketPrice: 86,
    artist: "Miami Show",
    city: "Miami",
    clientSlug: "zamora",
    date: "2026-04-18",
    gross: 120000,
    id: "evt_1",
    name: "Miami Show",
    status: "onsale",
    ticketsAvailable: 2200,
    ticketsSold: 1800,
    tm1Number: "TM1-123",
    updatedAt: "2026-04-10T09:00:00.000Z",
    url: null,
    venue: "Arena",
  },
  linkedCampaigns: [],
} as EventOperatingData;

describe("AdminEventDetailPage", () => {
  it("renders the client requests tab when requested", async () => {
    getEventOperatingData.mockResolvedValue(data);

    const { default: AdminEventDetailPage } = await import("./page");
    const element = await AdminEventDetailPage({
      params: Promise.resolve({ eventId: "evt_1" }),
      searchParams: Promise.resolve({ tab: "requests" }),
    });

    render(<>{element}</>);

    expect(screen.getByRole("link", { name: /Client requests/i })).toHaveAttribute(
      "href",
      "/admin/events/evt_1?tab=requests",
    );
    expect(screen.getByTestId("client-requests-panel")).toHaveAttribute("data-entity-id", "evt_1");
    expect(screen.queryByTestId("event-operating-panel")).not.toBeInTheDocument();
  });
});
