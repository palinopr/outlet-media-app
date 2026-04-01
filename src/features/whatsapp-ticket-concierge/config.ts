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

export function getTicketConciergeConfig(): TicketConciergeConfig {
  const fileContents = readFileSync(conciergeConfigPath, "utf8");
  const parsed = conciergeConfigSchema.parse(JSON.parse(fileContents));

  return {
    ...parsed,
    chromeDebugUrl: process.env.CHROME_DEBUG_URL ?? "http://127.0.0.1:9222",
  };
}
