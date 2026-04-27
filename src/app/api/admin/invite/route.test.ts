import { beforeEach, describe, expect, it, vi } from "vitest";

const createInvitation = vi.fn();
const sendEmail = vi.fn();

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(async () => ({ userId: "user_admin" })),
  currentUser: vi.fn(async () => ({ publicMetadata: { role: "admin" } })),
  clerkClient: vi.fn(async () => ({
    invitations: {
      createInvitation,
    },
  })),
}));

vi.mock("resend", () => ({
  Resend: vi.fn(function Resend() {
    return {
      emails: {
        send: sendEmail,
      },
    };
  }),
}));

describe("POST /api/admin/invite", () => {
  beforeEach(() => {
    vi.resetModules();
    createInvitation.mockReset();
    sendEmail.mockReset();
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://app.outletmedia.test");
    vi.stubEnv("RESEND_API_KEY", "re_test_123");
    vi.stubEnv("RESEND_INVITE_FROM_EMAIL", "Outlet Media <invites@outletmedia.co>");
    createInvitation.mockResolvedValue({
      url: "https://accounts.clerk.test/invitations/accept?token=abc123",
    });
  });

  it("creates client invitations and sends the Outlet invite email to the requested address", async () => {
    const { POST } = await import("./route");
    const request = new Request("https://local.test/api/admin/invite", {
      method: "POST",
      body: JSON.stringify({
        email: " Client@Example.COM ",
        client_slug: "zamora",
        client_role: "owner",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(createInvitation).toHaveBeenCalledWith({
      emailAddress: "client@example.com",
      ignoreExisting: true,
      notify: false,
      publicMetadata: {
        client_role: "owner",
        client_slug: "zamora",
      },
      redirectUrl:
        "https://app.outletmedia.test/sign-up?redirect_url=https%3A%2F%2Fapp.outletmedia.test%2Fclient%2Fzamora",
    });
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Outlet Media <invites@outletmedia.co>",
        subject: "You're invited to Outlet Media",
        text: expect.stringContaining("access the Zamora portal"),
        to: "client@example.com",
      }),
    );
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining("https://accounts.clerk.test/invitations/accept?token=abc123"),
        text: expect.stringContaining("https://accounts.clerk.test/invitations/accept?token=abc123"),
      }),
    );
  });

  it("sends admin invitations to the admin dashboard after signup", async () => {
    const { POST } = await import("./route");
    const request = new Request("https://local.test/api/admin/invite", {
      method: "POST",
      body: JSON.stringify({
        email: "ops@example.com",
        role: "admin",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(createInvitation).toHaveBeenCalledWith(
      expect.objectContaining({
        emailAddress: "ops@example.com",
        notify: false,
        publicMetadata: { role: "admin" },
        redirectUrl:
          "https://app.outletmedia.test/sign-up?redirect_url=https%3A%2F%2Fapp.outletmedia.test%2Fadmin%2Fdashboard",
      }),
    );
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining("access the Outlet Media admin workspace"),
        to: "ops@example.com",
      }),
    );
  });
});
