import { describe, expect, it } from "vitest";

import { rankTicketConciergeOptions } from "./option-ranker";

describe("rankTicketConciergeOptions", () => {
  it("returns under-budget options first and keeps the closest under budget ahead of the rest", () => {
    const ranked = rankTicketConciergeOptions({
      candidates: [
        {
          id: "over-closest",
          pairingScore: 40,
          preferenceSignals: {},
          section: "214",
          sectionQualityScore: 20,
          totalCents: 31000,
        },
        {
          id: "under-far",
          pairingScore: 10,
          preferenceSignals: {},
          section: "312",
          sectionQualityScore: 10,
          totalCents: 25000,
        },
        {
          id: "under-close",
          pairingScore: 20,
          preferenceSignals: {},
          section: "114",
          sectionQualityScore: 30,
          totalCents: 29800,
        },
      ],
      intent: {
        maxTotalCents: 30000,
        preferences: [],
      },
    });

    expect(ranked.map((candidate) => candidate.id)).toEqual(["under-close", "under-far", "over-closest"]);
  });

  it("prefers explicit preferenceSignals before section quality when nothing is under budget", () => {
    const ranked = rankTicketConciergeOptions({
      candidates: [
        {
          id: "over-far",
          pairingScore: 20,
          preferenceSignals: { near_stage: 1 },
          section: "325",
          sectionQualityScore: 90,
          totalCents: 32000,
        },
        {
          id: "over-close-no-pref",
          pairingScore: 80,
          preferenceSignals: {},
          section: "120",
          sectionQualityScore: 100,
          totalCents: 30100,
        },
        {
          id: "over-close-pref",
          pairingScore: 40,
          preferenceSignals: { near_stage: 5 },
          section: "114",
          sectionQualityScore: 10,
          totalCents: 30100,
        },
      ],
      intent: {
        maxTotalCents: 30000,
        preferences: ["near_stage"],
      },
    });

    expect(ranked.map((candidate) => candidate.id)).toEqual(["over-close-pref", "over-close-no-pref", "over-far"]);
  });

  it("uses section quality before row and seat pairing after budget and preference ties", () => {
    const ranked = rankTicketConciergeOptions({
      candidates: [
        {
          id: "pairing-best",
          pairingScore: 100,
          preferenceSignals: { center_view: 3 },
          section: "118",
          sectionQualityScore: 40,
          totalCents: 29000,
        },
        {
          id: "section-best",
          pairingScore: 1,
          preferenceSignals: { center_view: 3 },
          section: "114",
          sectionQualityScore: 50,
          totalCents: 29000,
        },
        {
          id: "pairing-second",
          pairingScore: 50,
          preferenceSignals: { center_view: 3 },
          section: "118",
          sectionQualityScore: 40,
          totalCents: 29000,
        },
      ],
      intent: {
        maxTotalCents: 30000,
        preferences: ["center_view"],
      },
    });

    expect(ranked.map((candidate) => candidate.id)).toEqual(["section-best", "pairing-best", "pairing-second"]);
  });

  it("returns one ranked option when inventory is scarce", () => {
    const ranked = rankTicketConciergeOptions({
      candidates: [
        {
          id: "single",
          pairingScore: 1,
          preferenceSignals: {},
          section: "114",
          sectionQualityScore: 10,
          totalCents: 28000,
        },
      ],
      intent: {
        maxTotalCents: 30000,
        preferences: [],
      },
    });

    expect(ranked).toHaveLength(1);
    expect(ranked[0]?.id).toBe("single");
  });

  it("returns two ranked options when inventory is scarce", () => {
    const ranked = rankTicketConciergeOptions({
      candidates: [
        {
          id: "second",
          pairingScore: 20,
          preferenceSignals: {},
          section: "120",
          sectionQualityScore: 20,
          totalCents: 29000,
        },
        {
          id: "first",
          pairingScore: 30,
          preferenceSignals: {},
          section: "114",
          sectionQualityScore: 30,
          totalCents: 28000,
        },
      ],
      intent: {
        maxTotalCents: 30000,
        preferences: [],
      },
    });

    expect(ranked).toHaveLength(2);
    expect(ranked.map((candidate) => candidate.id)).toEqual(["second", "first"]);
  });
});
