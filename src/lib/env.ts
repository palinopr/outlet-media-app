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

  // Required for agent ingest auth -- without this, ingest/alerts auth is bypassed
  INGEST_SECRET: z.string().min(8, "INGEST_SECRET must be at least 8 characters"),

  // Optional integrations
  META_ACCESS_TOKEN: z.string().optional(),
  META_AD_ACCOUNT_ID: z.string().optional(),
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
  EVOLUTION_API_KEY: z.string().optional(),
  EVOLUTION_API_URL: z.string().url().optional(),
  EVOLUTION_INSTANCE_NAME: z.string().optional(),
  EVOLUTION_WEBHOOK_SECRET: z.string().optional(),
  WHATSAPP_APP_SECRET: z.string().optional(),
  WHATSAPP_CLOUD_API_TOKEN: z.string().optional(),
  WHATSAPP_CLOUD_API_VERSION: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_WEBHOOK_VERIFY_TOKEN: z.string().optional(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_VALIDATE_SIGNATURE: z.string().optional(),
  TWILIO_WHATSAPP_FROM: z.string().optional(),
  TWILIO_WHATSAPP_STATUS_CALLBACK_URL: z.string().url().optional(),
  TWILIO_WHATSAPP_TYPING_INDICATOR: z.string().optional(),
  WHATSAPP_AUTO_ACK_DELAY_MS: z.string().optional(),
  WHATSAPP_AUTO_ACK_COOLDOWN_SECONDS: z.string().optional(),
  WHATSAPP_AUTO_ACK_TEXT: z.string().optional(),

  // Meta OAuth (optional until OAuth flow is enabled)
  META_APP_ID: z.string().optional(),
  META_APP_SECRET: z.string().optional(),
  TOKEN_ENCRYPTION_KEY: z.string().min(32).optional(),
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
    EVOLUTION_API_KEY: process.env.EVOLUTION_API_KEY,
    EVOLUTION_API_URL: process.env.EVOLUTION_API_URL,
    EVOLUTION_INSTANCE_NAME: process.env.EVOLUTION_INSTANCE_NAME,
    EVOLUTION_WEBHOOK_SECRET: process.env.EVOLUTION_WEBHOOK_SECRET,
    WHATSAPP_APP_SECRET: process.env.WHATSAPP_APP_SECRET,
    WHATSAPP_CLOUD_API_TOKEN: process.env.WHATSAPP_CLOUD_API_TOKEN,
    WHATSAPP_CLOUD_API_VERSION: process.env.WHATSAPP_CLOUD_API_VERSION,
    WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
    WHATSAPP_WEBHOOK_VERIFY_TOKEN: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_VALIDATE_SIGNATURE: process.env.TWILIO_VALIDATE_SIGNATURE,
    TWILIO_WHATSAPP_FROM: process.env.TWILIO_WHATSAPP_FROM,
    TWILIO_WHATSAPP_STATUS_CALLBACK_URL: process.env.TWILIO_WHATSAPP_STATUS_CALLBACK_URL,
    TWILIO_WHATSAPP_TYPING_INDICATOR: process.env.TWILIO_WHATSAPP_TYPING_INDICATOR,
    WHATSAPP_AUTO_ACK_DELAY_MS: process.env.WHATSAPP_AUTO_ACK_DELAY_MS,
    WHATSAPP_AUTO_ACK_COOLDOWN_SECONDS: process.env.WHATSAPP_AUTO_ACK_COOLDOWN_SECONDS,
    WHATSAPP_AUTO_ACK_TEXT: process.env.WHATSAPP_AUTO_ACK_TEXT,
    META_APP_ID: process.env.META_APP_ID,
    META_APP_SECRET: process.env.META_APP_SECRET,
    TOKEN_ENCRYPTION_KEY: process.env.TOKEN_ENCRYPTION_KEY,
  });

  if (!serverResult.success) {
    const missing = serverResult.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`);
    throw new Error(`[env] Missing server environment variables:\n${missing.join("\n")}`);
  }
}

validateEnv();
