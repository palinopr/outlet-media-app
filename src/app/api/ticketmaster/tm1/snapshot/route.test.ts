import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api-helpers", () => ({
  adminGuard: vi.fn().mockResolvedValue(null),
  apiError: (message: string, status = 500) => Response.json({ error: message }, { status }),
  secretGuard: vi.fn().mockImplementation((secret: unknown) =>
    secret === "test-secret" ? null : Response.json({ error: "Unauthorized" }, { status: 401 })),
}));

vi.mock("@/lib/ticketmaster/tm1-client", () => ({
  Tm1ClientError: class extends Error {
    status: number;
    constructor(message: string, status = 500) {
      super(message);
      this.status = status;
    }
  },
  createTm1ClientFromEnv: vi.fn().mockReturnValue({
    getEventSnapshot: vi.fn().mockResolvedValue({
      eventId: "vvG1IZbw1PRs-v",
      pulledAt: "2026-03-08T00:00:00.000Z",
      tcode: "NTL-QTE",
      event: { eventId: "vvG1IZbw1PRs-v", eventName: "Palm Desert" },
      summary: { sold: 3663, opens: 4486, holds: 1174 },
      channels: null,
    }),
  }),
}));

describe("GET /api/ticketmaster/tm1/snapshot", () => {
  it("allows ingest-secret callers and returns a normalized snapshot", async () => {
    const { GET } = await import("./route");
    const response = await GET(
      new Request(
        "https://example.com/api/ticketmaster/tm1/snapshot?secret=test-secret&eventId=vvG1IZbw1PRs-v",
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      capabilities: {
        browserlessRead: true,
        dynamicSeatingWritesReady: true,
      },
      snapshot: {
        eventId: "vvG1IZbw1PRs-v",
        summary: {
          sold: 3663,
        },
      },
    });
  });

  it("rejects requests without a secret or admin session", async () => {
    const { adminGuard } = await import("@/lib/api-helpers");
    vi.mocked(adminGuard).mockResolvedValueOnce(
      Response.json({ error: "Forbidden" }, { status: 403 }),
    );

    const { GET } = await import("./route");
    const response = await GET(
      new Request("https://example.com/api/ticketmaster/tm1/snapshot?eventId=vvG1IZbw1PRs-v"),
    );

    expect(response.status).toBe(403);
  });
});
