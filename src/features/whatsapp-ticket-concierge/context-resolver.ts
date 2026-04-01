import { getTicketConciergeConfig } from "./config";
import type { TicketConciergeScenario } from "./types";

export class MissingScenarioContextError extends Error {
  constructor(message = "No concierge scenario matched the inbound message.") {
    super(message);
    this.name = "MissingScenarioContextError";
  }
}

export interface ResolvedTicketConciergeContext {
  eventContext: TicketConciergeScenario["eventContext"];
  scenarioKey: string;
  strippedMessage: string;
}

function stripEntryToken(body: string, scenario: TicketConciergeScenario): string {
  const normalizedBody = body.trim();

  for (const token of scenario.entryTokens) {
    const normalizedToken = token.trim();
    if (!normalizedToken) continue;

    if (normalizedBody.toLowerCase().startsWith(normalizedToken.toLowerCase())) {
      const stripped = normalizedBody.slice(normalizedToken.length).trimStart();
      return stripped.replace(/^[\s:,-]+/, "").trim();
    }
  }

  return normalizedBody;
}

function findScenarioByKeyOrToken(
  body: string,
  conversationMetadata: Record<string, unknown>,
  scenarios: TicketConciergeScenario[],
): TicketConciergeScenario | null {
  const scenarioKey =
    typeof conversationMetadata.scenarioKey === "string"
      ? conversationMetadata.scenarioKey.trim()
      : "";
  if (scenarioKey) {
    const matchedByKey = scenarios.find((scenario) => scenario.key === scenarioKey);
    if (matchedByKey) {
      return matchedByKey;
    }
  }

  const normalizedBody = body.trim().toLowerCase();
  return (
    scenarios.find((scenario) =>
      scenario.entryTokens.some((token) => normalizedBody.startsWith(token.trim().toLowerCase())),
    ) ?? null
  );
}

export function resolveTicketConciergeContext(input: {
  body: string;
  conversationMetadata: Record<string, unknown>;
}): ResolvedTicketConciergeContext {
  const config = getTicketConciergeConfig();
  const scenario = findScenarioByKeyOrToken(input.body, input.conversationMetadata, config.scenarios);

  if (!scenario) {
    throw new MissingScenarioContextError();
  }

  return {
    eventContext: scenario.eventContext,
    scenarioKey: scenario.key,
    strippedMessage: stripEntryToken(input.body, scenario),
  };
}
