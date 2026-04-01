import { randomUUID } from "node:crypto";

import type { TicketConciergeIntent, TicketConciergePreference, TicketConciergePreparedOption } from "./types";
import { renderSectionMiniMap, type MiniMapLayout } from "./mini-map-renderer";
import { rankTicketConciergeOptions, type TicketConciergeRankCandidate } from "./option-ranker";
import type { TicketmasterBrowserCandidate } from "./ticketmaster-browser";

const CENTER_VIEW_SECTIONS = new Set(["114", "115", "214", "215", "323", "324"]);

function parseSectionNumber(section: string): number | null {
  const parsed = Number.parseInt(section.replace(/\D/g, ""), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function sectionQualityScore(section: string): number {
  if (section === "General Admission") {
    return 95;
  }

  const sectionNumber = parseSectionNumber(section);
  if (sectionNumber == null) {
    return 20;
  }

  const level = Math.floor(sectionNumber / 100);
  switch (level) {
    case 1:
      return 80;
    case 2:
      return 65;
    case 3:
      return 40;
    case 4:
      return 20;
    default:
      return 10;
  }
}

function preferenceSignals(candidate: TicketmasterBrowserCandidate): Partial<Record<TicketConciergePreference, number>> {
  const signals: Partial<Record<TicketConciergePreference, number>> = {
    aisle: 0,
  };

  const quality = sectionQualityScore(candidate.section);
  signals.lower_level = quality >= 65 ? 5 : 0;
  signals.near_stage = candidate.section === "General Admission" ? 6 : quality >= 80 ? 5 : quality >= 65 ? 3 : 0;
  signals.center_view = CENTER_VIEW_SECTIONS.has(candidate.section) ? 5 : 0;

  return signals;
}

function pairingScore(candidate: TicketmasterBrowserCandidate): number {
  if (!candidate.row) {
    return 0;
  }

  const rowNumber = Number.parseInt(candidate.row.replace(/\D/g, ""), 10);
  if (Number.isFinite(rowNumber)) {
    return Math.max(1, 100 - rowNumber);
  }

  return 50;
}

function toRankCandidate(candidate: TicketmasterBrowserCandidate): TicketConciergeRankCandidate {
  return {
    id: candidate.rawLabel,
    pairingScore: pairingScore(candidate),
    preferenceSignals: preferenceSignals(candidate),
    section: candidate.section,
    sectionQualityScore: sectionQualityScore(candidate.section),
    totalCents: candidate.totalCents,
  };
}

function buildNote(candidate: TicketmasterBrowserCandidate, intent: TicketConciergeIntent, isUnderBudget: boolean): string {
  const signals = preferenceSignals(candidate);

  if ((intent.preferences.includes("near_stage") && (signals.near_stage ?? 0) > 0) || candidate.section === "General Admission") {
    return "Closer to stage";
  }

  if (intent.preferences.includes("center_view") && (signals.center_view ?? 0) > 0) {
    return "Clean center view";
  }

  if (isUnderBudget && candidate.ticketType.includes("Standard")) {
    return "Best value";
  }

  if (!isUnderBudget) {
    return "Closest available";
  }

  return "Ready to buy";
}

export function prepareTicketConciergeOptions(input: {
  candidates: TicketmasterBrowserCandidate[];
  intent: TicketConciergeIntent;
  layout: MiniMapLayout;
}): TicketConciergePreparedOption[] {
  const byId = new Map(input.candidates.map((candidate) => [candidate.rawLabel, candidate]));
  const ranked = rankTicketConciergeOptions({
    candidates: input.candidates.map(toRankCandidate),
    intent: input.intent,
  });

  return ranked.map((rankedCandidate, index) => {
    const candidate = byId.get(rankedCandidate.id);
    if (!candidate) {
      throw new Error(`Missing browser candidate for ranked option ${rankedCandidate.id}`);
    }

    const { svg } = renderSectionMiniMap({
      highlightedSection: candidate.section,
      layout: input.layout,
    });

    const isUnderBudget =
      input.intent.maxTotalCents == null || candidate.totalCents <= input.intent.maxTotalCents;

    return {
      execution: candidate.execution,
      id: randomUUID(),
      isUnderBudget,
      label: `Option ${index + 1}`,
      mapSvg: svg,
      mapToken: randomUUID(),
      note: buildNote(candidate, input.intent, isUnderBudget),
      ordinal: (index + 1) as 1 | 2 | 3,
      quantity: candidate.quantity,
      quoteSource: "exact",
      row: candidate.row,
      seatLabels: [],
      section: candidate.section,
      totalCents: candidate.totalCents,
    };
  });
}
