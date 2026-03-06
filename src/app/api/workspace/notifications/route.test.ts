import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { authGuard, currentUser, getMemberAccessForSlug, listNotificationsForUser, supabaseAdmin } =
  vi.hoisted(() => ({
    authGuard: vi.fn(),
    currentUser: vi.fn(),
    getMemberAccessForSlug: vi.fn(),
    listNotificationsForUser: vi.fn(),
    supabaseAdmin: {
      from: vi.fn(() => ({
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
      })),
    },
  }));

vi.mock("@/lib/api-helpers", () => ({
  apiError: (message: string, status = 500) =>
    Response.json({ error: message }, { status }),
  authGuard,
}));

vi.mock("@clerk/nextjs/server", () => ({
  currentUser,
}));

vi.mock("@/lib/member-access", () => ({
  getMemberAccessForSlug,
}));

vi.mock("@/features/notifications/server", () => ({
  listNotificationsForUser,
}));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin,
}));

function makeGetRequest(url: string) {
  return {
    nextUrl: new URL(url),
  } as NextRequest;
}

function makePatchRequest(body: Record<string, unknown>) {
  return new Request("https://example.com/api/workspace/notifications", {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    method: "PATCH",
  }) as unknown as NextRequest;
}

describe("workspace notifications route", () => {
  beforeEach(() => {
    authGuard.mockReset();
    currentUser.mockReset();
    getMemberAccessForSlug.mockReset();
    listNotificationsForUser.mockReset();
    supabaseAdmin.from.mockClear();
  });

  it("blocks client viewers from fetching an unscoped inbox", async () => {
    authGuard.mockResolvedValue({ error: null, userId: "user_client" });
    currentUser.mockResolvedValue({ publicMetadata: { role: "client" } });

    const { GET } = await import("./route");
    const response = await GET(makeGetRequest("https://example.com/api/workspace/notifications"));

    expect(response.status).toBe(403);
    expect(listNotificationsForUser).not.toHaveBeenCalled();
  });

  it("passes assigned member scope into client inbox reads", async () => {
    authGuard.mockResolvedValue({ error: null, userId: "user_client" });
    currentUser.mockResolvedValue({ publicMetadata: { role: "client" } });
    getMemberAccessForSlug.mockResolvedValue({
      allowedCampaignIds: ["cmp_1"],
      allowedEventIds: ["evt_1"],
      clientId: "client_1",
      clientName: "Acme",
      clientSlug: "acme",
      memberId: "member_1",
      role: "member",
      scope: "assigned",
    });
    listNotificationsForUser.mockResolvedValue([]);

    const { GET } = await import("./route");
    const response = await GET(
      makeGetRequest("https://example.com/api/workspace/notifications?clientSlug=acme"),
    );

    expect(response.status).toBe(200);
    expect(listNotificationsForUser).toHaveBeenCalledWith("user_client", {
      clientSlug: "acme",
      scope: {
        allowedCampaignIds: ["cmp_1"],
        allowedEventIds: ["evt_1"],
      },
    });
  });

  it("blocks client viewers from marking notifications read without a client scope", async () => {
    authGuard.mockResolvedValue({ error: null, userId: "user_client" });
    currentUser.mockResolvedValue({ publicMetadata: { role: "client" } });

    const { PATCH } = await import("./route");
    const response = await PATCH(makePatchRequest({ id: "notif_1" }));

    expect(response.status).toBe(403);
    expect(listNotificationsForUser).not.toHaveBeenCalled();
  });
});
