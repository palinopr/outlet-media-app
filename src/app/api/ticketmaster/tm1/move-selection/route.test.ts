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
    moveSelection: vi.fn().mockResolvedValue({
      eventId: "vvG1IZbw1PRs-v",
      inventoryVersion: 77,
      layoutVersion: "layout-9",
      externalEventVersion: 12,
      requestPath:
        "/api/events/events/vvG1IZbw1PRs-v/inventory/moveSelection/allocation/hold-4",
      target: {
        kind: "allocation",
        targetId: "hold-4",
        allocationDisplayName: "4-HOLD",
      },
      nonMovedSeats: [],
      totalMovedSeats: 24,
      raw: {
        totalMovedSeats: 24,
      },
    }),
  }),
}));

describe("POST /api/ticketmaster/tm1/move-selection", () => {
  it("allows ingest-secret callers and returns the move-selection result", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://example.com/api/ticketmaster/tm1/move-selection", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          secret: "test-secret",
          eventId: "vvG1IZbw1PRs-v",
          selection: {
            rsSectionSelections: [{ sectionId: "107" }],
          },
          target: {
            kind: "allocation",
            targetId: "hold-4",
            allocationDisplayName: "4-HOLD",
          },
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      capabilities: {
        browserlessRead: true,
        dynamicSeatingWritesReady: true,
      },
      move: {
        eventId: "vvG1IZbw1PRs-v",
        inventoryVersion: 77,
        totalMovedSeats: 24,
      },
    });
  });

  it("rejects requests without a secret or admin session", async () => {
    const { adminGuard } = await import("@/lib/api-helpers");
    vi.mocked(adminGuard).mockResolvedValueOnce(
      Response.json({ error: "Forbidden" }, { status: 403 }),
    );

    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://example.com/api/ticketmaster/tm1/move-selection", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          eventId: "vvG1IZbw1PRs-v",
          selection: {
            rsSectionSelections: [{ sectionId: "107" }],
          },
          target: {
            kind: "open",
          },
        }),
      }),
    );

    expect(response.status).toBe(403);
  });
});
