import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname } from "node:path";
import { config } from "./config.js";
import type { ScrapeResult, IngestPayload } from "./types.js";

/**
 * Save scraped data to a local cache file.
 * Useful for debugging and as a backup if the POST fails.
 */
export function saveToCache(result: ScrapeResult): void {
  const dir = dirname(config.cacheFile);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  writeFileSync(config.cacheFile, JSON.stringify(result, null, 2));
  console.log(`Cached ${result.events.length} events to ${config.cacheFile}`);
}

/**
 * POST scraped data to the Next.js ingest endpoint.
 * The endpoint validates the secret and writes to Supabase.
 */
export async function sendToApp(result: ScrapeResult): Promise<void> {
  const payload: IngestPayload = {
    secret: config.ingest.secret,
    source: "ticketmaster_one",
    data: result,
  };

  console.log(`Sending ${result.events.length} events to ${config.ingest.url}...`);

  const res = await fetch(config.ingest.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Ingest endpoint returned ${res.status}: ${body}`);
  }

  const json = await res.json() as { ok: boolean; inserted: number };
  console.log(`Sync complete: ${json.inserted} events upserted in the database`);
}
