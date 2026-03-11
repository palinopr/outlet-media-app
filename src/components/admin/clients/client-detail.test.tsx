import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ClientDetailView } from "./client-detail";
import type { EventOperationsSummary } from "@/features/events/summary";

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
});

const client = {
  activeCampaigns: 1,
  activeShows: 1,
  assetSources: [],
  assets: [
    {
      createdAt: "2026-03-01T00:00:00.000Z",
      fileName: "hero-ad.png",
      format: "image/png",
      id: "asset-1",
      labels: ["launch"],
      mediaType: "image",
      placement: "feed",
      publicUrl: null,
      status: "new",
    },
  ],
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
  connectedAccounts: [
    {
      ad_account_id: "act_123",
      ad_account_name: "Acme Main",
      client_slug: "acme",
      connected_at: "2026-02-01T00:00:00.000Z",
      id: "acct-1",
      last_used_at: "2026-02-01T00:00:00.000Z",
      status: "active",
      token_expires_at: "2026-03-08T00:00:00.000Z",
    },
  ],
  createdAt: "2026-01-01T00:00:00.000Z",
  connectedAccountCount: 1,
  connectionRiskAccounts: 1,
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
  services: [],
  slug: "acme",
  status: "active",
  totalCampaigns: 1,
  totalRevenue: 4250,
  totalSpend: 1250,
};

const eventOperations: EventOperationsSummary = {
  attentionEvents: [],
  eventsNeedingAttention: 0,
  metrics: [
    {
      detail: "0 event next steps",
      key: "open_follow_ups",
      label: "Open follow-ups",
      value: 0,
    },
    {
      detail: "0 urgent event items",
      key: "urgent_follow_ups",
      label: "Urgent follow-ups",
      value: 0,
    },
    {
      detail: "0 active event threads",
      key: "open_discussions",
      label: "Open discussions",
      value: 0,
    },
    {
      detail: "0 event updates in the last 7 days",
      key: "recent_updates",
      label: "Recent updates",
      value: 0,
    },
  ],
};

describe("ClientDetailView", () => {
  it("defaults to the overview tab", () => {
    render(<ClientDetailView client={client} eventOperations={eventOperations} />);

    expect(screen.getByText("Client Portal Shape")).toBeInTheDocument();
    expect(screen.getByText("Portal Events Access")).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Toggle client events access" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /CRM/i })).not.toBeInTheDocument();
  });

  it("renders events when the Events tab is selected", () => {
    render(<ClientDetailView client={client} eventOperations={eventOperations} />);

    fireEvent.click(screen.getByRole("button", { name: /Events/i }));

    expect(screen.getByText("Assigned events")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Arena Night" })).toHaveAttribute(
      "href",
      "/admin/events/event-1",
    );
  });

  it("renders pending invites on the Members tab", () => {
    render(<ClientDetailView client={client} eventOperations={eventOperations} />);

    fireEvent.click(screen.getByRole("button", { name: /Members/i }));

    expect(screen.getByText("Access invites")).toBeInTheDocument();
    expect(screen.getByText("invitee@acme.com")).toBeInTheDocument();
    expect(screen.getByText("1 pending • 0 expired")).toBeInTheDocument();
  });
});
