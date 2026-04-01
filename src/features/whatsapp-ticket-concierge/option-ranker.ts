import type { TicketConciergeIntent, TicketConciergePreference } from "./types";

export interface TicketConciergeRankCandidate {
  id: string;
  pairingScore: number;
  preferenceSignals: Partial<Record<TicketConciergePreference, number>>;
  section: string;
  sectionQualityScore: number;
  totalCents: number;
}

export interface RankTicketConciergeOptionsInput {
  candidates: TicketConciergeRankCandidate[];
  intent: TicketConciergeIntent;
}

function compareBudgetPosition(
  left: TicketConciergeRankCandidate,
  right: TicketConciergeRankCandidate,
  maxTotalCents?: number,
): number {
  if (maxTotalCents == null) return 0;

  const leftUnderBudget = left.totalCents <= maxTotalCents;
  const rightUnderBudget = right.totalCents <= maxTotalCents;

  if (leftUnderBudget !== rightUnderBudget) {
    return leftUnderBudget ? -1 : 1;
  }

  if (leftUnderBudget) {
    return right.totalCents - left.totalCents;
  }

  return left.totalCents - right.totalCents;
}

function preferenceScore(
  candidate: TicketConciergeRankCandidate,
  preferences: TicketConciergePreference[],
): number {
  return preferences.reduce((score, preference) => score + (candidate.preferenceSignals[preference] ?? 0), 0);
}

function compareCandidates(
  left: TicketConciergeRankCandidate,
  right: TicketConciergeRankCandidate,
  intent: TicketConciergeIntent,
): number {
  const budgetComparison = compareBudgetPosition(left, right, intent.maxTotalCents);
  if (budgetComparison !== 0) return budgetComparison;

  const leftPreferenceScore = preferenceScore(left, intent.preferences);
  const rightPreferenceScore = preferenceScore(right, intent.preferences);
  if (leftPreferenceScore !== rightPreferenceScore) {
    return rightPreferenceScore - leftPreferenceScore;
  }

  if (left.sectionQualityScore !== right.sectionQualityScore) {
    return right.sectionQualityScore - left.sectionQualityScore;
  }

  if (left.pairingScore !== right.pairingScore) {
    return right.pairingScore - left.pairingScore;
  }

  if (left.totalCents !== right.totalCents) {
    return left.totalCents - right.totalCents;
  }

  return left.id.localeCompare(right.id);
}

export function rankTicketConciergeOptions(
  input: RankTicketConciergeOptionsInput,
): TicketConciergeRankCandidate[] {
  return [...input.candidates]
    .sort((left, right) => compareCandidates(left, right, input.intent))
    .slice(0, 3);
}
