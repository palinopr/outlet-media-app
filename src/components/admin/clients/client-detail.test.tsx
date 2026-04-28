import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { updateClient } from "@/app/admin/actions/clients";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ClientDetailView } from "./client-detail";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

vi.mock("@/app/admin/actions/clients", () => ({
  updateClient: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const mockedUpdateClient = vi.mocked(updateClient);

const client = {
  activeCampaigns: 1,
  activeShows: 1,
  assetsNeedingReview: 1,
  campaigns: [
    {
      id: "campaign-1",
      name: "Spring Launch",
      roas: 3.4,
      spend: 1250,
      status: "ACTIVE",
    },
  ],
  createdAt: "2026-01-01T00:00:00.000Z",
  connectedAccountCount: 1,
  connectionRiskAccounts: 1,
  brandName: "Acme Live",
  eventsEnabled: true,
  events: [
    {
      date: "2026-04-20",
      id: "event-1",
      name: "Arena Night",
      status: "onsale",
      venue: "United Center",
    },
  ],
  id: "client-1",
  memberCount: 1,
  members: [],
  name: "Acme Live",
  needsAttention: 3,
  logoAlt: "Acme Live",
  logoUrl: "https://cdn.example.com/acme.png",
  openActionItems: 2,
  openDiscussions: 1,
  pendingInvites: [
    {
      createdAt: "2026-03-03T00:00:00.000Z",
      email: "invitee@acme.com",
      id: "invite-1",
      status: "pending" as const,
    },
  ],
  pendingApprovals: 1,
  roas: 3.4,
  reportsEnabled: true,
  slug: "acme",
  status: "active",
  totalCampaigns: 1,
  totalRevenue: 4250,
  totalSpend: 1250,
};

describe("ClientDetailView", () => {
  it("defaults to the overview tab", () => {
    render(<ClientDetailView client={client} />);

    expect(screen.getByText("Client Portal Shape")).toBeInTheDocument();
    expect(screen.getByText("Portal Reports")).toBeInTheDocument();
    expect(screen.getByText("Portal Events")).toBeInTheDocument();
    expect(screen.getByText("Portal Reports Access")).toBeInTheDocument();
    expect(screen.getByText("Portal Events Access")).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Toggle client reports access" })).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Toggle client events access" })).toBeInTheDocument();
    expect(
      screen.getByText(
        /The client portal is intentionally narrow: Campaigns, optional Reports, and optional Events\./,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /When disabled, the Events nav item is removed and direct event URLs redirect back to campaigns\./,
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /CRM/i })).not.toBeInTheDocument();
  });

  it("persists the reports toggle from the overview tab", async () => {
    mockedUpdateClient.mockResolvedValue(undefined);

    render(<ClientDetailView client={client} />);

    fireEvent.click(screen.getByRole("switch", { name: "Toggle client reports access" }));

    await waitFor(() => {
      expect(mockedUpdateClient).toHaveBeenCalledWith({
        clientId: "client-1",
        reportsEnabled: false,
      });
    });
  });

  it("renders events when the Events tab is selected", () => {
    render(<ClientDetailView client={client} />);

    fireEvent.click(screen.getByRole("button", { name: /Events/i }));

    expect(screen.getByText("Assigned events")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Arena Night" })).toHaveAttribute(
      "href",
      "/admin/events/event-1",
    );
  });

  it("renders pending invites on the Members tab", () => {
    render(<ClientDetailView client={client} />);

    fireEvent.click(screen.getByRole("button", { name: /Members/i }));

    expect(screen.getByText("Access invites")).toBeInTheDocument();
    expect(screen.getByText("invitee@acme.com")).toBeInTheDocument();
    expect(screen.getByText("1 pending • 0 expired")).toBeInTheDocument();
  });
});
