import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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

const client = {
  activeCampaigns: 1,
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
  id: "client-1",
  memberCount: 1,
  members: [],
  name: "Acme Live",
  needsAttention: 1,
  logoAlt: "Acme Live",
  logoUrl: "https://cdn.example.com/acme.png",
  pendingInvites: [
    {
      createdAt: "2026-03-03T00:00:00.000Z",
      email: "invitee@acme.com",
      id: "invite-1",
      status: "pending" as const,
    },
  ],
  roas: 3.4,
  slug: "acme",
  status: "active",
  totalCampaigns: 1,
  totalRevenue: 4250,
  totalSpend: 1250,
};

describe("ClientDetailView", () => {
  it("defaults to the overview tab", () => {
    render(<ClientDetailView client={client} />);

    expect(screen.getByText("Portal Experience")).toBeInTheDocument();
    expect(
      screen.getByText(
        /The client portal is intentionally narrow: campaign performance only\./,
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /CRM/i })).not.toBeInTheDocument();
  });

  it("renders pending invites on the Members tab", () => {
    render(<ClientDetailView client={client} />);

    fireEvent.click(screen.getByRole("button", { name: /Members/i }));

    expect(screen.getByText("Access invites")).toBeInTheDocument();
    expect(screen.getByText("invitee@acme.com")).toBeInTheDocument();
    expect(screen.getByText("1 pending • 0 expired")).toBeInTheDocument();
  });
});
