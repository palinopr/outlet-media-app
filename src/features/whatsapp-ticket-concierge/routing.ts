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

function isTruthyEnv(value: string | null | undefined): boolean {
  const normalized = value?.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

function getDefaultScenarioKey(): string | null {
  const key = process.env.WHATSAPP_TICKET_CONCIERGE_DEFAULT_SCENARIO_KEY?.trim();
  return key && key.length > 0 ? key : null;
}

function shouldAllowAllTargets(): boolean {
  return isTruthyEnv(process.env.WHATSAPP_TICKET_CONCIERGE_ALLOW_ALL);
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
    const defaultScenarioKey = getDefaultScenarioKey();
    if (!defaultScenarioKey || defaultScenarioKey !== input.scenario.key) {
      return null;
    }
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
  if (shouldAllowAllTargets()) {
    return true;
  }

  if (
    input.scenario.allowlist.conversationIds.length === 0 &&
    input.scenario.allowlist.waIds.length === 0
  ) {
    return true;
  }

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
