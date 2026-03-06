import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConnectedAccountsList } from "./connected-accounts-list";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

describe("ConnectedAccountsList", () => {
  it("surfaces connection health counts and labels", () => {
    render(
      <ConnectedAccountsList
        accounts={[
          {
            ad_account_id: "act_healthy",
            ad_account_name: "Healthy Account",
            connected_at: "2026-03-01T12:00:00.000Z",
            id: "acct_1",
            last_used_at: "2026-03-05T12:00:00.000Z",
            status: "active",
            token_expires_at: "2026-04-01T12:00:00.000Z",
          },
          {
            ad_account_id: "act_attention",
            ad_account_name: "Expiring Account",
            connected_at: "2026-03-01T12:00:00.000Z",
            id: "acct_2",
            last_used_at: "2026-03-05T12:00:00.000Z",
            status: "active",
            token_expires_at: "2026-03-08T12:00:00.000Z",
          },
        ]}
        connectUrl="/api/meta/connect?slug=zamora"
        slug="zamora"
      />,
    );

    expect(screen.getAllByText("Healthy").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Expiring soon").length).toBeGreaterThan(0);
    expect(screen.getByText("Needs attention")).toBeInTheDocument();
    expect(screen.getByText("Healthy Account")).toBeInTheDocument();
    expect(screen.getByText("Expiring Account")).toBeInTheDocument();
  });
});
