import { describe, expect, it } from "vitest";

import { formatPreparedOptionsMessage } from "./result-formatter";

describe("formatPreparedOptionsMessage", () => {
  it("formats media payloads in ordinal order followed by the reply hint", () => {
    expect(
      formatPreparedOptionsMessage({
        baseUrl: "https://www.outletmedia.net/",
        locale: "en",
        options: [
          {
            execution: { selectionPayload: { placeSelections: [] } },
            id: "opt_3",
            isUnderBudget: false,
            label: "Option 3",
            mapSvg: "<svg />",
            mapToken: "map_3",
            note: "Center view",
            ordinal: 3,
            quantity: 2,
            quoteSource: "exact",
            row: "F",
            seatLabels: ["13", "14"],
            section: "118",
            totalCents: 32500,
          },
          {
            execution: { selectionPayload: { placeSelections: [] } },
            id: "opt_2",
            isUnderBudget: true,
            label: "Option 2",
            mapSvg: "<svg />",
            mapToken: "map_2",
            note: "Closest to stage",
            ordinal: 2,
            quantity: 2,
            quoteSource: "exact",
            row: "D",
            seatLabels: ["11", "12"],
            section: "120",
            totalCents: 31250,
          },
          {
            execution: { selectionPayload: { placeSelections: [] } },
            id: "opt_1",
            isUnderBudget: true,
            label: "Option 1",
            mapSvg: "<svg />",
            mapToken: "map_1",
            note: "Best value",
            ordinal: 1,
            quantity: 2,
            quoteSource: "exact",
            row: "K",
            seatLabels: ["7", "8"],
            section: "114",
            totalCents: 28600,
          },
        ],
      }),
    ).toEqual([
      {
        body: "Option 1\n$286 total\nSection 114, Row K\n2 seats together\nBest value",
        kind: "media",
        mediaUrl: "https://www.outletmedia.net/api/whatsapp/concierge/maps/map_1",
        optionOrdinal: 1,
      },
      {
        body: "Option 2\n$312.50 total\nSection 120, Row D\n2 seats together\nClosest to stage",
        kind: "media",
        mediaUrl: "https://www.outletmedia.net/api/whatsapp/concierge/maps/map_2",
        optionOrdinal: 2,
      },
      {
        body: "Option 3\n$325 total\nSection 118, Row F\n2 seats together\nCenter view",
        kind: "media",
        mediaUrl: "https://www.outletmedia.net/api/whatsapp/concierge/maps/map_3",
        optionOrdinal: 3,
      },
      {
        body: "Reply 1, 2, or 3 to pick one of these options.",
        kind: "text",
      },
    ]);
  });

  it("calls out limited live inventory and narrows the reply hint when fewer than three options remain", () => {
    expect(
      formatPreparedOptionsMessage({
        baseUrl: "https://www.outletmedia.net/",
        locale: "en",
        options: [
          {
            execution: { selectionPayload: { placeSelections: [] } },
            id: "opt_2",
            isUnderBudget: false,
            label: "Option 2",
            mapSvg: "<svg />",
            mapToken: "map_2",
            note: "Closest available",
            ordinal: 2,
            quantity: 2,
            quoteSource: "exact",
            row: null,
            seatLabels: ["3", "4"],
            section: "214",
            totalCents: 33400,
          },
          {
            execution: { selectionPayload: { placeSelections: [] } },
            id: "opt_1",
            isUnderBudget: false,
            label: "Option 1",
            mapSvg: "<svg />",
            mapToken: "map_1",
            note: "Best remaining value",
            ordinal: 1,
            quantity: 2,
            quoteSource: "exact",
            row: "M",
            seatLabels: ["1", "2"],
            section: "213",
            totalCents: 32800,
          },
        ],
      }),
    ).toEqual([
      {
        body: "Option 1\n$328 total\nSection 213, Row M\n2 seats together\nBest remaining value",
        kind: "media",
        mediaUrl: "https://www.outletmedia.net/api/whatsapp/concierge/maps/map_1",
        optionOrdinal: 1,
      },
      {
        body: "Option 2\n$334 total\nSection 214\n2 seats together\nClosest available",
        kind: "media",
        mediaUrl: "https://www.outletmedia.net/api/whatsapp/concierge/maps/map_2",
        optionOrdinal: 2,
      },
      {
        body: "Live inventory is limited right now.\nReply 1 or 2 to pick one of these options.",
        kind: "text",
      },
    ]);
  });

  it("renders the option cards and reply hint in Spanish", () => {
    expect(
      formatPreparedOptionsMessage({
        baseUrl: "https://www.outletmedia.net/",
        locale: "es",
        options: [
          {
            execution: { selectionPayload: { placeSelections: [] } },
            id: "opt_1",
            isUnderBudget: true,
            label: "Option 1",
            mapSvg: "<svg />",
            mapToken: "map_1",
            note: "Best value",
            ordinal: 1,
            quantity: 4,
            quoteSource: "exact",
            row: "14",
            seatLabels: ["1", "2", "3", "4"],
            section: "416",
            totalCents: 87400,
          },
          {
            execution: { selectionPayload: { placeSelections: [] } },
            id: "opt_2",
            isUnderBudget: false,
            label: "Option 2",
            mapSvg: "<svg />",
            mapToken: "map_2",
            note: "Closest available",
            ordinal: 2,
            quantity: 4,
            quoteSource: "exact",
            row: "15",
            seatLabels: ["5", "6", "7", "8"],
            section: "325",
            totalCents: 87860,
          },
        ],
      }),
    ).toEqual([
      {
        body: "Opcion 1\n$874 total\nSeccion 416, Fila 14\n4 asientos juntos\nMejor valor",
        kind: "media",
        mediaUrl: "https://www.outletmedia.net/api/whatsapp/concierge/maps/map_1",
        optionOrdinal: 1,
      },
      {
        body: "Opcion 2\n$878.60 total\nSeccion 325, Fila 15\n4 asientos juntos\nLo mas cercano disponible",
        kind: "media",
        mediaUrl: "https://www.outletmedia.net/api/whatsapp/concierge/maps/map_2",
        optionOrdinal: 2,
      },
      {
        body: "El inventario en vivo esta limitado ahora mismo.\nResponde 1 o 2 para elegir una de estas opciones.",
        kind: "text",
      },
    ]);
  });
});
