import { describe, expect, it } from "vitest";

import layoutFixture from "./fixtures/arjona-miami-layout.json";
import { prepareTicketConciergeOptions } from "./option-preparer";
import type { TicketmasterBrowserCandidate } from "./ticketmaster-browser";

function makeCandidate(
  overrides: Partial<TicketmasterBrowserCandidate> & Pick<TicketmasterBrowserCandidate, "rawLabel" | "section" | "totalCents">,
): TicketmasterBrowserCandidate {
  return {
    ...overrides,
    execution: {
      eventUrl: "https://www.ticketmaster.com/example-event",
      quantity: 2,
      source: "ticketmaster_browser",
      ticketListLabel: overrides.rawLabel,
    },
    perTicketTotalCents: Math.round(overrides.totalCents / 2),
    quantity: 2,
    rawLabel: overrides.rawLabel,
    row: overrides.row ?? null,
    section: overrides.section,
    ticketType: overrides.ticketType ?? "Standard Admission",
    totalCents: overrides.totalCents,
  };
}

describe("prepareTicketConciergeOptions", () => {
  it("returns up to three prepared options in ranked order with labels, notes, and map SVGs", () => {
    const options = prepareTicketConciergeOptions({
      candidates: [
        makeCandidate({
          rawLabel: "Sec 323 • Row 11 Verified Resale Ticket $196.35",
          row: "11",
          section: "323",
          ticketType: "Verified Resale Ticket",
          totalCents: 39270,
        }),
        makeCandidate({
          rawLabel: "Sec 114 • Row K Standard Admission $149.00",
          row: "K",
          section: "114",
          totalCents: 29800,
        }),
        makeCandidate({
          rawLabel: "Sec 214 • Row M Standard Admission $154.00",
          row: "M",
          section: "214",
          totalCents: 30800,
        }),
        makeCandidate({
          rawLabel: "General Admission Verified Resale Ticket $250.00",
          section: "General Admission",
          ticketType: "Verified Resale Ticket",
          totalCents: 50000,
        }),
      ],
      intent: {
        maxTotalCents: 30000,
        preferences: ["near_stage"],
      },
      layout: layoutFixture,
    });

    expect(options).toHaveLength(3);
    expect(options.map((option) => option.label)).toEqual(["Option 1", "Option 2", "Option 3"]);
    expect(options.map((option) => option.section)).toEqual(["114", "214", "323"]);
    expect(options[0]).toMatchObject({
      isUnderBudget: true,
      note: "Closer to stage",
      quantity: 2,
      quoteSource: "exact",
      row: "K",
      seatLabels: [],
      totalCents: 29800,
    });
    expect(options[0]?.mapSvg).toContain('data-render-mode="detailed"');
    expect(options[1]?.isUnderBudget).toBe(false);
    expect(options[1]?.mapSvg).toContain('data-render-mode="detailed"');
    expect(options[2]?.mapSvg).toContain('data-render-mode="abstract"');
    expect(options[2]?.execution).toMatchObject({
      eventUrl: "https://www.ticketmaster.com/example-event",
      source: "ticketmaster_browser",
      ticketListLabel: "Sec 323 • Row 11 Verified Resale Ticket $196.35",
    });
  });

  it("keeps scarce inventory sets intact instead of inventing extra options", () => {
    const options = prepareTicketConciergeOptions({
      candidates: [
        makeCandidate({
          rawLabel: "Sec 214 • Row M Standard Admission $154.00",
          row: "M",
          section: "214",
          totalCents: 30800,
        }),
      ],
      intent: {
        maxTotalCents: 30000,
        preferences: [],
      },
      layout: layoutFixture,
    });

    expect(options).toHaveLength(1);
    expect(options[0]).toMatchObject({
      label: "Option 1",
      note: "Closest available",
      section: "214",
      totalCents: 30800,
    });
  });
});
