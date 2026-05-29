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
  META_AD_ACCOUNTS: z.string().optional(),
  META_AD_ACCOUNT_IDS: z.string().optional(),
  META_AD_ACCOUNT_ID: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().optional(),
  CONTACT_FORM_TO_EMAIL: z.string().optional(),
  APPLICATION_ERROR_ALERT_WINDOW_MINUTES: z.string().optional(),

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
    META_AD_ACCOUNTS: process.env.META_AD_ACCOUNTS,
    META_AD_ACCOUNT_IDS: process.env.META_AD_ACCOUNT_IDS,
    META_AD_ACCOUNT_ID: process.env.META_AD_ACCOUNT_ID,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    CONTACT_FORM_TO_EMAIL: process.env.CONTACT_FORM_TO_EMAIL,
    APPLICATION_ERROR_ALERT_WINDOW_MINUTES: process.env.APPLICATION_ERROR_ALERT_WINDOW_MINUTES,
    META_APP_SECRET: process.env.META_APP_SECRET,
  });

  if (!serverResult.success) {
    const missing = serverResult.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`);
    throw new Error(`[env] Missing server environment variables:\n${missing.join("\n")}`);
  }
}

validateEnv();
