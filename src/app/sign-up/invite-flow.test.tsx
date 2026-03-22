import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const signUpMock = vi.fn(() => <div data-testid="sign-up-component" />);

vi.mock("@clerk/nextjs", () => ({
  SignUp: signUpMock,
}));

describe("SignUp invite flow", () => {
  it("preserves invite_id in the post-signup redirect", async () => {
    const { default: SignUpPage } = await import("./[[...sign-up]]/page");
    const element = await SignUpPage({
      searchParams: Promise.resolve({ invite_id: "invite_1" }),
    });

    render(element);

    expect(screen.getByTestId("sign-up-component")).toBeInTheDocument();
    expect(signUpMock).toHaveBeenCalledWith(
      expect.objectContaining({
        forceRedirectUrl: "/client?invite_id=invite_1",
        signInForceRedirectUrl: "/client?invite_id=invite_1",
      }),
      undefined,
    );
  });
});
