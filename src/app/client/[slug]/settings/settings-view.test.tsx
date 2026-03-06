import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SettingsView } from "./settings-view";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

vi.mock("./actions", () => ({
  inviteTeamMember: vi.fn(),
  removeTeamMember: vi.fn(),
  revokeTeamInvite: vi.fn(),
}));

vi.mock("./connected-accounts-list", () => ({
  ConnectedAccountsList: ({
    accounts,
    canManage,
    connectUrl,
  }: {
    accounts: Array<{ id: string }>;
    canManage: boolean;
    connectUrl: string;
  }) => (
    <div data-testid="connected-accounts">
      {accounts.length}:{String(canManage)}:{connectUrl}
    </div>
  ),
}));

describe("SettingsView", () => {
  it("renders both the connected account center and the team table", () => {
    render(
      <SettingsView
        data={{
          clientId: "client_1",
          clientName: "Zamora",
          connectedAccounts: [
            {
              id: "acct_row_1",
              ad_account_id: "act_123",
              ad_account_name: "Main Meta Account",
              connected_at: "2026-03-06T10:00:00.000Z",
              last_used_at: null,
              status: "active",
              token_expires_at: "2026-04-06T10:00:00.000Z",
            },
          ],
          isOwner: true,
          members: [
            {
              createdAt: "2026-03-06T10:00:00.000Z",
              email: "owner@example.com",
              id: "member_1",
              name: "Owner User",
              role: "owner",
            },
          ],
          pendingInvites: [
            {
              createdAt: "2026-03-06T12:00:00.000Z",
              email: "invitee@example.com",
              id: "inv_1",
              status: "pending",
            },
          ],
          slug: "zamora",
        }}
      />,
    );

    expect(screen.getByTestId("connected-accounts")).toHaveTextContent(
      "1:true:/api/meta/connect?slug=zamora",
    );
    expect(screen.getByText("Team")).toBeInTheDocument();
    expect(screen.getByText("Access invites")).toBeInTheDocument();
    expect(screen.getByText("invitee@example.com")).toBeInTheDocument();
    expect(screen.getByText("1 pending • 0 expired")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Owner User")).toBeInTheDocument();
  });
});
