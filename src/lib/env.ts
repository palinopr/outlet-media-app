import { z } from "zod";

/**
 * Validates environment variables at startup. Import this module early
 * (e.g. in layout.tsx or instrumentation.ts) to fail fast on missing config.
 *
 * Server-only vars are validated at runtime (not available during build).
 * Public vars are validated always.
 */

const serverSchema = z.object({
  // Required for auth
  CLERK_SECRET_KEY: z.string().min(1, "CLERK_SECRET_KEY is required"),

  // Required for database writes
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),

  // Required for ingest auth -- without this, ingest auth is bypassed
  INGEST_SECRET: z.string().min(8, "INGEST_SECRET must be at least 8 characters"),

  // Optional integrations
  META_ACCESS_TOKEN: z.string().optional(),
  META_AD_ACCOUNT_ID: z.string().optional(),
  GOOGLE_ADS_DEVELOPER_TOKEN: z.string().optional(),
  GOOGLE_ADS_CLIENT_ID: z.string().optional(),
  GOOGLE_ADS_CLIENT_SECRET: z.string().optional(),
  GOOGLE_ADS_REFRESH_TOKEN: z.string().optional(),
  GOOGLE_ADS_LOGIN_CUSTOMER_ID: z.string().optional(),
  GOOGLE_ADS_CUSTOMER_ID: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  CLIENT_AGENT_CLAUDE_MODEL: z.string().optional(),
  TICKETMASTER_API_KEY: z.string().optional(),
  TM1_API_PREFIX: z.string().optional(),
  TM1_BASE_URL: z.string().url().optional(),
  TM1_COOKIE: z.string().optional(),
  TM1_DEFAULT_EVENT_END: z.string().optional(),
  TM1_DEFAULT_EVENT_START: z.string().optional(),
  TM1_EVENTBASE_API_PREFIX: z.string().optional(),
  TM1_TIMEOUT_MS: z.string().optional(),
  TM1_TCODE: z.string().optional(),
  TM1_XSRF_TOKEN: z.string().optional(),

  // Meta signed-request verification / legacy callback support
  META_APP_SECRET: z.string().optional(),
});

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required"),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

function validateEnv() {
  // Public vars are always available
  const publicResult = publicSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!publicResult.success) {
    const missing = publicResult.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`);
    throw new Error(`[env] Missing public environment variables:\n${missing.join("\n")}`);
  }

  // Server vars are only available at runtime, not during build
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  const serverResult = serverSchema.safeParse({
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    INGEST_SECRET: process.env.INGEST_SECRET,
    META_ACCESS_TOKEN: process.env.META_ACCESS_TOKEN,
    META_AD_ACCOUNT_ID: process.env.META_AD_ACCOUNT_ID,
    GOOGLE_ADS_DEVELOPER_TOKEN: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    GOOGLE_ADS_CLIENT_ID: process.env.GOOGLE_ADS_CLIENT_ID,
    GOOGLE_ADS_CLIENT_SECRET: process.env.GOOGLE_ADS_CLIENT_SECRET,
    GOOGLE_ADS_REFRESH_TOKEN: process.env.GOOGLE_ADS_REFRESH_TOKEN,
    GOOGLE_ADS_LOGIN_CUSTOMER_ID: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
    GOOGLE_ADS_CUSTOMER_ID: process.env.GOOGLE_ADS_CUSTOMER_ID,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    CLIENT_AGENT_CLAUDE_MODEL: process.env.CLIENT_AGENT_CLAUDE_MODEL,
    TICKETMASTER_API_KEY: process.env.TICKETMASTER_API_KEY,
    TM1_API_PREFIX: process.env.TM1_API_PREFIX,
    TM1_BASE_URL: process.env.TM1_BASE_URL,
    TM1_COOKIE: process.env.TM1_COOKIE,
    TM1_DEFAULT_EVENT_END: process.env.TM1_DEFAULT_EVENT_END,
    TM1_DEFAULT_EVENT_START: process.env.TM1_DEFAULT_EVENT_START,
    TM1_EVENTBASE_API_PREFIX: process.env.TM1_EVENTBASE_API_PREFIX,
    TM1_TIMEOUT_MS: process.env.TM1_TIMEOUT_MS,
    TM1_TCODE: process.env.TM1_TCODE,
    TM1_XSRF_TOKEN: process.env.TM1_XSRF_TOKEN,
    META_APP_SECRET: process.env.META_APP_SECRET,
  });

  if (!serverResult.success) {
    const missing = serverResult.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`);
    throw new Error(`[env] Missing server environment variables:\n${missing.join("\n")}`);
  }
}

validateEnv();
