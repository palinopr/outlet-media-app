(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/src_1f257c44._.js",
"[project]/src/lib/env.ts [instrumentation-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [instrumentation-edge] (ecmascript) <export * as z>");
;
/**
 * Validates environment variables at startup. Import this module early
 * (e.g. in layout.tsx or instrumentation.ts) to fail fast on missing config.
 *
 * Server-only vars are validated at runtime (not available during build).
 * Public vars are validated always.
 */ const serverSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    // Required for auth
    CLERK_SECRET_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "CLERK_SECRET_KEY is required"),
    // Required for database writes
    SUPABASE_SERVICE_ROLE_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
    // Required for agent ingest auth -- without this, ingest/alerts auth is bypassed
    INGEST_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(8, "INGEST_SECRET must be at least 8 characters"),
    // Optional integrations
    META_ACCESS_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    META_AD_ACCOUNT_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    TICKETMASTER_API_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    TM1_API_PREFIX: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    TM1_BASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional(),
    TM1_COOKIE: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    TM1_DEFAULT_EVENT_END: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    TM1_DEFAULT_EVENT_START: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    TM1_TIMEOUT_MS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    TM1_TCODE: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    TM1_XSRF_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    EVOLUTION_API_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    EVOLUTION_API_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional(),
    EVOLUTION_INSTANCE_NAME: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    EVOLUTION_WEBHOOK_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    WHATSAPP_APP_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    WHATSAPP_CLOUD_API_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    WHATSAPP_CLOUD_API_VERSION: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    WHATSAPP_PHONE_NUMBER_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    WHATSAPP_WEBHOOK_VERIFY_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    TWILIO_ACCOUNT_SID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    TWILIO_AUTH_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    TWILIO_VALIDATE_SIGNATURE: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    TWILIO_WHATSAPP_FROM: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    TWILIO_WHATSAPP_STATUS_CALLBACK_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional(),
    TWILIO_WHATSAPP_TYPING_INDICATOR: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    WHATSAPP_AUTO_ACK_DELAY_MS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    WHATSAPP_AUTO_ACK_COOLDOWN_SECONDS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    WHATSAPP_AUTO_ACK_TEXT: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    // Meta OAuth (optional until OAuth flow is enabled)
    META_APP_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    META_APP_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    TOKEN_ENCRYPTION_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(32).optional()
});
const publicSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    NEXT_PUBLIC_SUPABASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required"),
    NEXT_PUBLIC_APP_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional()
});
function validateEnv() {
    // Public vars are always available
    const publicResult = publicSchema.safeParse({
        NEXT_PUBLIC_SUPABASE_URL: ("TURBOPACK compile-time value", "https://dbznwsnteogovicllean.supabase.co"),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiem53c250ZW9nb3ZpY2xsZWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDc3NzMsImV4cCI6MjA4NTI4Mzc3M30._6liw2kfW9MCwVrpq5QCGSodjzqAE2H7zDCwwx5CK2Y"),
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ("TURBOPACK compile-time value", "pk_test_Y29zbWljLW1pdGUtMjYuY2xlcmsuYWNjb3VudHMuZGV2JA"),
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL
    });
    if (!publicResult.success) {
        const missing = publicResult.error.issues.map((i)=>`  - ${i.path.join(".")}: ${i.message}`);
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
        TOKEN_ENCRYPTION_KEY: process.env.TOKEN_ENCRYPTION_KEY
    });
    if (!serverResult.success) {
        const missing = serverResult.error.issues.map((i)=>`  - ${i.path.join(".")}: ${i.message}`);
        throw new Error(`[env] Missing server environment variables:\n${missing.join("\n")}`);
    }
}
validateEnv();
}),
"[project]/src/instrumentation.ts [instrumentation-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Next.js instrumentation hook -- runs once when the server starts.
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
__turbopack_context__.s([
    "register",
    ()=>register
]);
async function register() {
    // Validate environment variables on startup
    await Promise.resolve().then(()=>__turbopack_context__.i("[project]/src/lib/env.ts [instrumentation-edge] (ecmascript)"));
}
}),
]);

//# sourceMappingURL=src_1f257c44._.js.map