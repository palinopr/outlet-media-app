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
    requestMoveToAllocation: vi.fn().mockResolvedValue({
      eventId: "vv1AeZkozGkdO8RJs",
      requestId: "request-1",
      requestPath: "/api/events/collaboration/94d7f90f-ac48-458c-af98-edf54ea12f1e/team/messages",
      totalPlaces: 24,
      target: {
        kind: "allocation",
        targetId: "hold-4",
        allocationDisplayName: "4-HOLD",
      },
      raw: {
        changeRequest: {
          id: "request-1",
          status: "CREATED",
        },
      },
    }),
    resolveChangeRequest: vi.fn().mockResolvedValue({
      eventId: "vv1AeZkozGkdO8RJs",
      requestId: "request-1",
      requestPath:
        "/api/events/collaboration/94d7f90f-ac48-458c-af98-edf54ea12f1e/team/request/request-1/resolve",
      status: "DELETED",
      raw: {
        changeRequest: {
          id: "request-1",
          status: "DELETED",
        },
      },
    }),
  }),
}));

describe("POST /api/ticketmaster/tm1/request-move-selection", () => {
  it("creates a TM1 collaboration move request for secret callers", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://example.com/api/ticketmaster/tm1/request-move-selection", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          secret: "test-secret",
          eventId: "vv1AeZkozGkdO8RJs",
          selection: {
            placeSelections: [{ sectionId: "GE4Q", rowId: "R1", placeId: "S1" }],
          },
          target: {
            kind: "allocation",
            targetId: "hold-4",
            allocationDisplayName: "4-HOLD",
          },
          totalPlaces: 24,
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      capabilities: {
        browserlessRead: true,
        collaborationChangeRequestsReady: true,
      },
      request: {
        eventId: "vv1AeZkozGkdO8RJs",
        requestId: "request-1",
        totalPlaces: 24,
      },
      resolution: null,
    });
  });

  it("optionally resolves the created request in the same call", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://example.com/api/ticketmaster/tm1/request-move-selection", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          secret: "test-secret",
          eventId: "vv1AeZkozGkdO8RJs",
          selection: {
            placeSelections: [{ sectionId: "GE4Q", rowId: "R1", placeId: "S1" }],
          },
          target: {
            kind: "allocation",
            targetId: "hold-4",
            allocationDisplayName: "4-HOLD",
          },
          resolveStatus: "DELETED",
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      request: {
        requestId: "request-1",
      },
      resolution: {
        requestId: "request-1",
        status: "DELETED",
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
      new Request("https://example.com/api/ticketmaster/tm1/request-move-selection", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          eventId: "vv1AeZkozGkdO8RJs",
          selection: {
            placeSelections: [{ sectionId: "GE4Q", rowId: "R1", placeId: "S1" }],
          },
          target: {
            kind: "allocation",
            targetId: "hold-4",
            allocationDisplayName: "4-HOLD",
          },
        }),
      }),
    );

    expect(response.status).toBe(403);
  });
});
