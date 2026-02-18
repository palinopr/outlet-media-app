import "dotenv/config";

function require_env(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing env var: ${key}. Copy .env.example to .env and fill it in.`);
  return val;
}

export const config = {
  tm: {
    email: require_env("TM_EMAIL"),
    password: require_env("TM_PASSWORD"),
    // Ticketmaster One (promoter portal)
    baseUrl: "https://one.ticketmaster.com",
    loginUrl: "https://auth.ticketmaster.com/as/authorization.oauth2",
  },
  ingest: {
    url: process.env.INGEST_URL ?? "http://localhost:3000/api/ingest",
    secret: require_env("INGEST_SECRET"),
  },
  headless: process.env.HEADLESS !== "false",
  // Local cache file - scraped data is saved here before sending
  cacheFile: new URL("../cache/events.json", import.meta.url).pathname,
};
