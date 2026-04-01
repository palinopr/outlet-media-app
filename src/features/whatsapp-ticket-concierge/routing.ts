import type { TicketConciergeScenario } from "./config";

export interface TicketConciergeMatch {
  kind: "conversation" | "scenario";
  scenarioKey: string;
}

function parseMetadataRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function normalizeDigits(value: string | null | undefined): string | null {
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  return digits.length > 0 ? digits : null;
}

function normalizeText(value: string | null | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

export function matchTicketConciergeScenario(input: {
  body: string | null | undefined;
  conversationMetadata: Record<string, unknown> | null | undefined;
  scenario: Pick<TicketConciergeScenario, "entryTokens" | "key">;
}): TicketConciergeMatch | null {
  const metadata = parseMetadataRecord(input.conversationMetadata);
  if (
    metadata.automationRoute === "ticket_concierge" &&
    metadata.scenarioKey === input.scenario.key
  ) {
    return {
      kind: "conversation",
      scenarioKey: input.scenario.key,
    };
  }

  const normalizedBody = normalizeText(input.body);
  if (!normalizedBody) {
    return null;
  }

  const matchedToken = input.scenario.entryTokens.some((token) =>
    normalizedBody.startsWith(normalizeText(token)),
  );
  if (!matchedToken) {
    return null;
  }

  return {
    kind: "scenario",
    scenarioKey: input.scenario.key,
  };
}

export function isAllowedTicketConciergeTarget(input: {
  conversationId: string;
  scenario: Pick<TicketConciergeScenario, "allowlist">;
  waId: string | null | undefined;
}): boolean {
  if (input.scenario.allowlist.conversationIds.includes(input.conversationId)) {
    return true;
  }

  const normalizedWaId = normalizeDigits(input.waId);
  if (!normalizedWaId) {
    return false;
  }

  return input.scenario.allowlist.waIds.some((allowedWaId) => normalizeDigits(allowedWaId) === normalizedWaId);
}

export function applyTicketConciergeConversationMetadata(
  existingMetadata: Record<string, unknown> | null | undefined,
  match: TicketConciergeMatch,
): Record<string, unknown> {
  return {
    ...parseMetadataRecord(existingMetadata),
    automationRoute: "ticket_concierge",
    conciergeAllowed: true,
    scenarioKey: match.scenarioKey,
  };
}

export function shouldQueueDiscordTriage(
  conversationMetadata: Record<string, unknown> | null | undefined,
): boolean {
  const metadata = parseMetadataRecord(conversationMetadata);
  return !(
    metadata.automationRoute === "ticket_concierge" && metadata.conciergeAllowed === true
  );
}
