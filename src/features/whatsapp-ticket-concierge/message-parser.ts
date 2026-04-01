import type { TicketConciergeIntent, TicketConciergePreference } from "./types";

const PREFERENCE_RULES: Array<[RegExp, TicketConciergePreference]> = [
  [/\bnear\s+the\s+stage\b|\bnear\s+stage\b/i, "near_stage"],
  [/\bcenter\s+view\b|\bcenter\b/i, "center_view"],
  [/\blower\s+level\b|\blower\s+bowl\b/i, "lower_level"],
  [/\baisle\b/i, "aisle"],
];

function parseExplicitQuantity(body: string): number | undefined {
  const match = body.match(/\b(\d+)\s+(?:tickets?|seats?)\b/i);
  if (!match) return undefined;

  const quantity = Number.parseInt(match[1] ?? "", 10);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : undefined;
}

function parseUnderBudget(body: string): number | undefined {
  const match = body.match(/\bunder\s+\$?(\d+(?:\.\d{1,2})?)\b/i);
  if (!match) return undefined;

  const amount = Number.parseFloat(match[1] ?? "");
  return Number.isFinite(amount) && amount > 0 ? Math.round(amount * 100) : undefined;
}

function parsePreferences(body: string): TicketConciergePreference[] {
  const preferences: TicketConciergePreference[] = [];

  for (const [pattern, preference] of PREFERENCE_RULES) {
    if (pattern.test(body) && !preferences.includes(preference)) {
      preferences.push(preference);
    }
  }

  return preferences;
}

export function parseCustomerTicketIntent(body: string): TicketConciergeIntent {
  const normalizedBody = body.trim();

  const intent: TicketConciergeIntent = {
    preferences: parsePreferences(normalizedBody),
  };

  const quantity = parseExplicitQuantity(normalizedBody);
  if (quantity) {
    intent.quantity = quantity;
  }

  const maxTotalCents = parseUnderBudget(normalizedBody);
  if (maxTotalCents) {
    intent.maxTotalCents = maxTotalCents;
  }

  return intent;
}
