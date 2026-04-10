import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  TM1_EVENTBASE_ACCESS_TOKEN_HEADER,
  TM1_EXTERNAL_EVENT_VERSION_HEADER,
  TM1_IF_MATCH_HEADER,
  Tm1Client,
  normalizeTm1Summary,
} from "./tm1-client";

describe("normalizeTm1Summary", () => {
  it("normalizes nested TM1 figures and derives available values", () => {
    const summary = normalizeTm1Summary({
      figures: {
        sold: [{ value: "3663" }],
        totalTickets: [{ value: "3963" }],
        netCapacity: [{ value: "9919" }],
        opens: [{ value: "4486" }],
        holds: [{ value: "1174" }],
        totalRevenue: [{ value: "432199.86" }],
        potentialRevenue: [{ value: "1156910.38" }],
        comp: [{ value: "300" }],
        ticketsSoldToday: [{ value: "48" }],
      },
      source: {
        eventSource: "Host",
      },
    });

    expect(summary.sold).toBe(3663);
    expect(summary.opens).toBe(4486);
    expect(summary.holds).toBe(1174);
    expect(summary.available).toBe(5660);
    expect(summary.availableRevenue).toBeCloseTo(724710.52, 2);
    expect(summary.source.eventSource).toBe("Host");
  });

  it("falls back across alternate field names", () => {
    const summary = normalizeTm1Summary({
      figures: {
        totalSold: [{ value: "12" }],
        capacity: [{ value: "40" }],
        open: [{ value: "10" }],
        hold: [{ value: "5" }],
        ticketRevenue: [{ value: "1200" }],
        availableRevenue: [{ value: "600" }],
      },
    });

    expect(summary.sold).toBe(12);
    expect(summary.totalTickets).toBe(12);
    expect(summary.netCapacity).toBe(40);
    expect(summary.opens).toBe(10);
    expect(summary.holds).toBe(5);
    expect(summary.available).toBe(15);
    expect(summary.totalRevenue).toBe(1200);
    expect(summary.availableRevenue).toBe(600);
  });
});

function createTestJwt(payload: Record<string, unknown>): string {
  return `header.${Buffer.from(JSON.stringify(payload)).toString("base64url")}.signature`;
}

describe("Tm1Client moveSelection", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("auto-fetches context and posts allocation moves with TM1 optimistic-lock headers", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ version: 77 }), {
          status: 200,
          headers: { etag: '"77"' },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ version: "layout-9" }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ eventId: "11111111-1111-1111-1111-111111111123" }), {
          status: 200,
          headers: { [TM1_EXTERNAL_EVENT_VERSION_HEADER]: "12" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            rolledbackAllocationSelections: [{ sectionId: "301" }],
            totalMovedSeats: 24,
          }),
          {
            status: 200,
            headers: { etag: '"78"' },
          },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    const client = new Tm1Client({
      cookie: "tm1=1",
      tcode: "NTL-QTE",
      xsrfToken: "xsrf-123",
    });

    const result = await client.moveSelection({
      eventId: "11111111-1111-1111-1111-111111111123",
      selection: {
        rsSectionSelections: [{ sectionId: "107" }],
      },
      target: {
        kind: "allocation",
        targetId: "hold-4",
        allocationDisplayName: "4-HOLD",
      },
    });

    expect(fetchMock).toHaveBeenCalledTimes(4);
    const [url, init] = fetchMock.mock.calls[3] as [URL, RequestInit];
    expect(String(url)).toBe(
      "https://one.ticketmaster.com/api/events/events/11111111-1111-1111-1111-111111111123/inventory/moveSelection/allocation/hold-4",
    );
    expect(init.method).toBe("POST");

    const headers = init.headers as Headers;
    expect(headers.get(TM1_IF_MATCH_HEADER)).toBe('"77"');
    expect(headers.get(TM1_EXTERNAL_EVENT_VERSION_HEADER)).toBe("12");
    expect(headers.get("x-xsrf-token")).toBe("xsrf-123");

    const body = JSON.parse(String(init.body));
    expect(body).toEqual({
      allocationDisplayName: "4-HOLD",
      layoutVersion: "layout-9",
      selection: {
        rsSectionSelections: [{ sectionId: "107" }],
      },
      successAction: {
        type: "INVENTORY_ASSOCIATED_BACKEND_TO_OBJECT",
        targetType: "allocationAndSeatstatus",
        targetId: "hold-4",
      },
    });

    expect(result).toMatchObject({
      eventId: "11111111-1111-1111-1111-111111111123",
      inventoryVersion: 77,
      layoutVersion: "layout-9",
      externalEventVersion: 12,
      totalMovedSeats: 24,
      nonMovedSeats: [{ sectionId: "301" }],
    });
  });

  it("uses caller-supplied versions for open moves and strips selections from successAction", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          rolledbackAllocationSelections: [],
          totalMovedSeats: 8,
        }),
        {
          status: 200,
        },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const client = new Tm1Client({
      cookie: "tm1=1",
      tcode: "NTL-QTE",
    });

    const result = await client.moveSelection({
      eventId: "11111111-1111-1111-1111-111111111111",
      inventoryVersion: 91,
      layoutVersion: "layout-open",
      externalEventVersion: null,
      selection: {
        rowSelections: [{ sectionId: "201", rowId: "F" }],
      },
      target: {
        kind: "open",
        successAction: {
          type: "INVENTORY_ASSOCIATED_BACKEND_TO_OBJECT",
          targetType: "allocationAndSeatstatus",
          targetId: "Open",
          selections: [{ placeId: "should-be-removed" }],
        },
      },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(String(url)).toBe(
      "https://one.ticketmaster.com/api/events/events/11111111-1111-1111-1111-111111111111/inventory/moveSelection/standardOfferAllocation",
    );

    const headers = init.headers as Headers;
    expect(headers.get(TM1_IF_MATCH_HEADER)).toBe('"91"');
    expect(headers.get(TM1_EXTERNAL_EVENT_VERSION_HEADER)).toBeNull();

    const body = JSON.parse(String(init.body));
    expect(body).toEqual({
      layoutVersion: "layout-open",
      selection: {
        rowSelections: [{ sectionId: "201", rowId: "F" }],
      },
      successAction: {
        type: "INVENTORY_ASSOCIATED_BACKEND_TO_OBJECT",
        targetType: "allocationAndSeatstatus",
        targetId: "Open",
      },
    });

    expect(result.totalMovedSeats).toBe(8);
  });

  it("resolves dashboard-style event ids to internal UUIDs before eventbase writes", async () => {
    const resolvedEventId = "94d7f90f-ac48-458c-af98-edf54ea12f1e";
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(resolvedEventId), { status: 200 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ version: 77 }), {
          status: 200,
          headers: { etag: '"77"' },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ version: "layout-9" }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ eventId: resolvedEventId }), {
          status: 200,
          headers: { [TM1_EXTERNAL_EVENT_VERSION_HEADER]: "12" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ rolledbackAllocationSelections: [], totalMovedSeats: 24 }), {
          status: 200,
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const client = new Tm1Client({
      cookie: "tm1=1",
      tcode: "NTL-QTE",
    });

    const result = await client.moveSelection({
      eventId: "vv1AeZkozGkdO8RJs",
      selection: {
        rsSectionSelections: [{ sectionId: "GE4Q" }],
      },
      target: {
        kind: "allocation",
        targetId: "4-HOLD",
        allocationDisplayName: "4-HOLD",
      },
    });

    expect(fetchMock).toHaveBeenCalledTimes(5);
    const firstUrl = String((fetchMock.mock.calls[0] as [URL, RequestInit])[0]);
    expect(firstUrl).toBe(
      "https://one.ticketmaster.com/api/events/events/vv1AeZkozGkdO8RJs/id",
    );

    const finalUrl = String((fetchMock.mock.calls[4] as [URL, RequestInit])[0]);
    expect(finalUrl).toBe(
      `https://one.ticketmaster.com/api/events/events/${resolvedEventId}/inventory/moveSelection/allocation/4-HOLD`,
    );

    expect(result).toMatchObject({
      eventId: "vv1AeZkozGkdO8RJs",
      inventoryVersion: 77,
      layoutVersion: "layout-9",
      externalEventVersion: 12,
      totalMovedSeats: 24,
    });
  });
});

describe("Tm1Client collaboration move requests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("creates move-to-allocation change requests through collaboration messages", async () => {
    const eventbaseToken = createTestJwt({
      sub: "C88E27F1-109F-4BB2-8EA8-4612F5A55604",
      principal: {
        id: "C88E27F1-109F-4BB2-8EA8-4612F5A55604",
        firstName: "Jamie",
        lastName: "Ortiz",
      },
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify([]), {
          status: 200,
          headers: { [TM1_EVENTBASE_ACCESS_TOKEN_HEADER]: eventbaseToken },
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: "message-1",
            changeRequest: {
              id: "request-1",
              status: "CREATED",
            },
          }),
          { status: 200 },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    const client = new Tm1Client({
      cookie: "tm1=1",
      tcode: "NTL-QTE",
    });

    const result = await client.requestMoveToAllocation({
      eventId: "94d7f90f-ac48-458c-af98-edf54ea12f1e",
      selection: {
        placeSelections: [{ sectionId: "GE4Q", rowId: "R1", placeId: "S1" }],
      },
      target: {
        kind: "allocation",
        targetId: "hold-4",
        allocationDisplayName: "4-HOLD",
      },
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [url, init] = fetchMock.mock.calls[1] as [URL, RequestInit];
    expect(String(url)).toBe(
      "https://one.ticketmaster.com/api/events/collaboration/94d7f90f-ac48-458c-af98-edf54ea12f1e/team/messages",
    );
    expect(init.method).toBe("POST");

    const headers = init.headers as Headers;
    expect(headers.get(TM1_EVENTBASE_ACCESS_TOKEN_HEADER)).toBe(`Bearer ${eventbaseToken}`);

    const body = JSON.parse(String(init.body));
    expect(body).toMatchObject({
      message: "",
      mentions: [],
      changeRequest: {
        data: {
          destination: "hold-4",
          destinationType: 2,
          totalPlaces: 1,
          selection: {
            placeSelections: [{ sectionId: "GE4Q", rowId: "R1", placeId: "S1" }],
            rowSelections: [],
            rsSectionSelections: [],
            partialGaSelections: [],
            fullGaSelections: [],
          },
        },
        type: "MOVE_TO_ALLOCATION",
        status: "CREATED",
        requestorId: "C88E27F1-109F-4BB2-8EA8-4612F5A55604",
      },
    });
    expect(typeof body.id).toBe("string");
    expect(typeof body.changeRequest.id).toBe("string");
    expect(typeof body.changeRequest.creationDate).toBe("number");

    expect(result).toMatchObject({
      eventId: "94d7f90f-ac48-458c-af98-edf54ea12f1e",
      requestId: "request-1",
      totalPlaces: 1,
    });
  });

  it("resolves change requests through the collaboration resolve endpoint", async () => {
    const eventbaseToken = createTestJwt({
      sub: "C88E27F1-109F-4BB2-8EA8-4612F5A55604",
      principal: {
        id: "C88E27F1-109F-4BB2-8EA8-4612F5A55604",
        firstName: "Jamie",
        lastName: "Ortiz",
      },
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify([]), {
          status: 200,
          headers: { [TM1_EVENTBASE_ACCESS_TOKEN_HEADER]: eventbaseToken },
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: "message-2",
            changeRequest: {
              id: "request-1",
              status: "DELETED",
              approverId: "C88E27F1-109F-4BB2-8EA8-4612F5A55604",
            },
          }),
          { status: 200 },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    const client = new Tm1Client({
      cookie: "tm1=1",
      tcode: "NTL-QTE",
    });

    const result = await client.resolveChangeRequest({
      eventId: "94d7f90f-ac48-458c-af98-edf54ea12f1e",
      requestId: "request-1",
      status: "DELETED",
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [url, init] = fetchMock.mock.calls[1] as [URL, RequestInit];
    expect(String(url)).toBe(
      "https://one.ticketmaster.com/api/events/collaboration/94d7f90f-ac48-458c-af98-edf54ea12f1e/team/request/request-1/resolve",
    );
    expect(init.method).toBe("POST");

    const headers = init.headers as Headers;
    expect(headers.get(TM1_EVENTBASE_ACCESS_TOKEN_HEADER)).toBe(`Bearer ${eventbaseToken}`);

    const body = JSON.parse(String(init.body));
    expect(body).toMatchObject({
      id: "request-1",
      status: "DELETED",
      message: {
        message: "",
        authorId: "C88E27F1-109F-4BB2-8EA8-4612F5A55604",
        author: "Jamie Ortiz",
        mentions: [],
        messageType: "REQUEST_APPROVAL",
        changeRequestId: "request-1",
        justAdded: true,
      },
    });
    expect(typeof body.message.id).toBe("string");
    expect(typeof body.message.date).toBe("number");

    expect(result).toMatchObject({
      eventId: "94d7f90f-ac48-458c-af98-edf54ea12f1e",
      requestId: "request-1",
      status: "DELETED",
    });
  });
});
