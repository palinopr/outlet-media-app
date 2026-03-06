import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SettingsView } from "./settings-view";

vi.mock("./actions", () => ({
  inviteTeamMember: vi.fn(),
  removeTeamMember: vi.fn(),
}));

vi.mock("./connected-accounts-list", () => ({
  ConnectedAccountsList: ({
    accounts,
    connectUrl,
  }: {
    accounts: Array<{ id: string }>;
    connectUrl: string;
  }) => (
    <div data-testid="connected-accounts">
      {accounts.length}:{connectUrl}
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
          slug: "zamora",
        }}
      />,
    );

    expect(screen.getByTestId("connected-accounts")).toHaveTextContent(
      "1:/api/meta/connect?slug=zamora",
    );
    expect(screen.getByText("Team")).toBeInTheDocument();
    expect(screen.getByText("Owner User")).toBeInTheDocument();
  });
});
