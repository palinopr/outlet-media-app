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

const data = {
  clients: [{ slug: "zamora" }],
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
  it("renders the event operating panel without request tabs", async () => {
    getEventOperatingData.mockResolvedValue(data);

    const { default: AdminEventDetailPage } = await import("./page");
    const element = await AdminEventDetailPage({
      params: Promise.resolve({ eventId: "evt_1" }),
    });

    render(<>{element}</>);

    expect(screen.getByTestId("event-operating-panel")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Client requests/i })).not.toBeInTheDocument();
  });
});
