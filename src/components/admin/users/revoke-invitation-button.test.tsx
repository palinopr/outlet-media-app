import { describe, expect, it, vi } from "vitest";
import { act } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { RevokeInvitationButton } from "./revoke-invitation-button";

const { revokeInvitation } = vi.hoisted(() => ({
  revokeInvitation: vi.fn(),
}));

vi.mock("@/app/admin/actions/users", () => ({
  revokeInvitation,
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("RevokeInvitationButton", () => {
  it("confirms and revokes the pending invite", async () => {
    render(
      <RevokeInvitationButton
        email="invitee@example.com"
        invitationId="inv_1"
        trigger={<button type="button">Revoke invite</button>}
      />,
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Revoke invite" }));
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Revoke" }));
    });

    await waitFor(() => {
      expect(revokeInvitation).toHaveBeenCalledWith({ invitationId: "inv_1" });
    });
  });
});
