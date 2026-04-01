import { readFileSync } from "fs";
import path from "path";
import { z } from "zod";

const conciergeScenarioSchema = z.object({
  key: z.string().min(1),
  clientSlug: z.string().min(1),
  entryTokens: z.array(z.string().min(1)),
  allowlist: z.object({
    conversationIds: z.array(z.string().min(1)),
    waIds: z.array(z.string().min(1)),
  }),
  eventContext: z.object({
    artist: z.string().min(1),
    city: z.string().min(1),
    date: z.string().min(1),
    eventId: z.string().min(1),
    eventUrl: z.string(),
  }),
});

const conciergeConfigSchema = z.object({
  enabled: z.boolean(),
  optionTtlSeconds: z.number().int().positive(),
  scenarios: z.array(conciergeScenarioSchema),
});

export type TicketConciergeScenario = z.infer<typeof conciergeScenarioSchema>;

export type TicketConciergeConfig = z.infer<typeof conciergeConfigSchema> & {
  chromeDebugUrl: string;
};

const conciergeConfigPath = path.resolve(
  process.cwd(),
  "config/whatsapp-ticket-concierge.json",
);

function parseBooleanOverride(value: string | undefined): boolean | null {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  return null;
}

function parseCsvOverride(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function getTicketConciergeConfig(): TicketConciergeConfig {
  const fileContents = readFileSync(conciergeConfigPath, "utf8");
  const parsed = conciergeConfigSchema.parse(JSON.parse(fileContents));
  const enabledOverride = parseBooleanOverride(process.env.WHATSAPP_TICKET_CONCIERGE_ENABLED);
  const allowlistConversationIds = parseCsvOverride(
    process.env.WHATSAPP_TICKET_CONCIERGE_ALLOWLIST_CONVERSATION_IDS,
  );
  const allowlistWaIds = parseCsvOverride(process.env.WHATSAPP_TICKET_CONCIERGE_ALLOWLIST_WA_IDS);

  return {
    ...parsed,
    enabled: enabledOverride ?? parsed.enabled,
    chromeDebugUrl: process.env.CHROME_DEBUG_URL ?? "http://127.0.0.1:9222",
    scenarios: parsed.scenarios.map((scenario) => ({
      ...scenario,
      allowlist: {
        conversationIds:
          allowlistConversationIds.length > 0
            ? [...allowlistConversationIds]
            : scenario.allowlist.conversationIds,
        waIds: allowlistWaIds.length > 0 ? [...allowlistWaIds] : scenario.allowlist.waIds,
      },
    })),
  };
}
