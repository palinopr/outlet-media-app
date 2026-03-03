# Meta OAuth Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enable clients to connect their own Meta ad accounts via OAuth, manage campaigns through a self-service wizard, and meet Meta's App Review requirements.

**Architecture:** Facebook Login for Business OAuth flow with per-client encrypted tokens stored in Supabase. Clients get a 5-step campaign creation wizard and a settings page to manage connected ad accounts. Legal pages (privacy, terms) and a data deletion callback satisfy Meta review.

**Tech Stack:** Next.js 15 App Router, Supabase, Clerk auth, Zod validation, Node crypto (AES-256-GCM), Meta Graph API v21.0, Vitest

---

## Task 1: Token Encryption Module

**Files:**
- Create: `src/lib/crypto.ts`
- Test: `src/lib/crypto.test.ts`

**Step 1: Write the failing test**

```typescript
// src/lib/crypto.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock env to provide TOKEN_ENCRYPTION_KEY
vi.stubEnv("TOKEN_ENCRYPTION_KEY", "a]1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d");

describe("crypto", () => {
  it("encrypts and decrypts a token round-trip", async () => {
    const { encrypt, decrypt } = await import("./crypto");
    const token = "EAABsbCS1IXXBAO...fake-token";
    const encrypted = encrypt(token);
    expect(encrypted).not.toBe(token);
    expect(encrypted).toContain(":"); // iv:authTag:ciphertext format
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(token);
  });

  it("produces different ciphertext each time (random IV)", async () => {
    const { encrypt } = await import("./crypto");
    const token = "same-token";
    const a = encrypt(token);
    const b = encrypt(token);
    expect(a).not.toBe(b);
  });

  it("throws on tampered ciphertext", async () => {
    const { encrypt, decrypt } = await import("./crypto");
    const encrypted = encrypt("token");
    const parts = encrypted.split(":");
    parts[2] = "tampered" + parts[2];
    expect(() => decrypt(parts.join(":"))).toThrow();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/crypto.test.ts`
Expected: FAIL -- module not found

**Step 3: Write minimal implementation**

```typescript
// src/lib/crypto.ts
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function getKey(): Buffer {
  const key = process.env.TOKEN_ENCRYPTION_KEY;
  if (!key || key.length < 32) {
    throw new Error("TOKEN_ENCRYPTION_KEY must be at least 32 characters");
  }
  return Buffer.from(key.slice(0, 32), "utf8");
}

export function encrypt(plaintext: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, getKey(), iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
}

export function decrypt(ciphertext: string): string {
  const [ivHex, authTagHex, encryptedHex] = ciphertext.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const decipher = createDecipheriv(ALGORITHM, getKey(), iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(authTag);
  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]).toString("utf8");
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/crypto.test.ts`
Expected: PASS (3 tests)

**Step 5: Commit**

```bash
git add src/lib/crypto.ts src/lib/crypto.test.ts
git commit -m "feat: add AES-256-GCM token encryption module"
```

---

## Task 2: Environment Variables Update

**Files:**
- Modify: `src/lib/env.ts` (lines 11-25, server schema)
- Modify: `.env.example`

**Step 1: Add new env vars to Zod schema**

In `src/lib/env.ts`, add to the server schema object:

```typescript
META_APP_ID: z.string().optional(),
META_APP_SECRET: z.string().optional(),
TOKEN_ENCRYPTION_KEY: z.string().min(32).optional(),
```

**Step 2: Update .env.example**

Add:
```
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
TOKEN_ENCRYPTION_KEY=32_char_min_random_string_here!!
```

**Step 3: Commit**

```bash
git add src/lib/env.ts .env.example
git commit -m "feat: add Meta OAuth env vars to schema"
```

---

## Task 3: Supabase Migration -- client_accounts Table

**Files:**
- Create: `supabase/migrations/20260302_create_client_accounts.sql`
- Modify: `src/lib/database.types.ts` (regenerate after migration)

**Step 1: Write the migration SQL**

```sql
-- supabase/migrations/20260302_create_client_accounts.sql
CREATE TABLE IF NOT EXISTS client_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id text NOT NULL,
  client_slug text NOT NULL,
  meta_user_id text NOT NULL,
  ad_account_id text NOT NULL,
  ad_account_name text,
  access_token_encrypted text NOT NULL,
  token_expires_at timestamptz NOT NULL,
  scopes text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'revoked', 'expired')),
  connected_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_client_accounts_ad_account
  ON client_accounts (ad_account_id);

CREATE INDEX idx_client_accounts_clerk_user
  ON client_accounts (clerk_user_id);

CREATE INDEX idx_client_accounts_slug_status
  ON client_accounts (client_slug, status);
```

**Step 2: Apply migration to Supabase**

Run: `npx supabase db push` or apply via Supabase dashboard SQL editor.

**Step 3: Regenerate database types**

Run: `npx supabase gen types typescript --project-id dbznwsnteogovicllean > src/lib/database.types.ts`

If the CLI isn't set up, manually add the table type to `database.types.ts` following the existing pattern (see `meta_campaigns` at line 475 for reference).

**Step 4: Commit**

```bash
git add supabase/migrations/20260302_create_client_accounts.sql src/lib/database.types.ts
git commit -m "feat: add client_accounts table for Meta OAuth tokens"
```

---

## Task 4: Meta OAuth Helper Module

**Files:**
- Create: `src/lib/meta-oauth.ts`
- Test: `src/lib/meta-oauth.test.ts`

**Step 1: Write failing tests**

```typescript
// src/lib/meta-oauth.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.stubEnv("META_APP_ID", "123456");
vi.stubEnv("META_APP_SECRET", "test-secret");
vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://example.com");

describe("meta-oauth", () => {
  beforeEach(() => vi.resetAllMocks());

  it("buildAuthUrl returns a valid Facebook OAuth URL", async () => {
    const { buildAuthUrl } = await import("./meta-oauth");
    const url = buildAuthUrl("state-token-123");
    expect(url).toContain("facebook.com/v21.0/dialog/oauth");
    expect(url).toContain("client_id=123456");
    expect(url).toContain("redirect_uri=");
    expect(url).toContain("scope=ads_management");
    expect(url).toContain("state=state-token-123");
  });

  it("verifySignedRequest validates HMAC signature", async () => {
    const crypto = await import("node:crypto");
    const { verifySignedRequest } = await import("./meta-oauth");
    // Build a valid signed_request
    const payload = JSON.stringify({ user_id: "123", algorithm: "HMAC-SHA256", issued_at: Date.now() / 1000 });
    const encodedPayload = Buffer.from(payload).toString("base64url");
    const sig = crypto.createHmac("sha256", "test-secret").update(encodedPayload).digest();
    const encodedSig = sig.toString("base64url");
    const signedRequest = `${encodedSig}.${encodedPayload}`;

    const result = verifySignedRequest(signedRequest);
    expect(result).toEqual(expect.objectContaining({ user_id: "123" }));
  });

  it("verifySignedRequest rejects tampered payload", async () => {
    const { verifySignedRequest } = await import("./meta-oauth");
    expect(() => verifySignedRequest("bad.data")).toThrow();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/meta-oauth.test.ts`
Expected: FAIL -- module not found

**Step 3: Write implementation**

```typescript
// src/lib/meta-oauth.ts
import { createHmac, timingSafeEqual } from "node:crypto";
import { META_API_VERSION } from "./constants";

const SCOPES = "ads_management,ads_read,business_management";

function getAppId(): string {
  const id = process.env.META_APP_ID;
  if (!id) throw new Error("META_APP_ID not configured");
  return id;
}

function getAppSecret(): string {
  const secret = process.env.META_APP_SECRET;
  if (!secret) throw new Error("META_APP_SECRET not configured");
  return secret;
}

function getRedirectUri(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}/api/meta/callback`;
}

export function buildAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: getAppId(),
    redirect_uri: getRedirectUri(),
    scope: SCOPES,
    state,
    response_type: "code",
  });
  return `https://www.facebook.com/${META_API_VERSION}/dialog/oauth?${params}`;
}

export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string;
  expires_in: number;
}> {
  const params = new URLSearchParams({
    client_id: getAppId(),
    client_secret: getAppSecret(),
    redirect_uri: getRedirectUri(),
    code,
  });
  const res = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/oauth/access_token?${params}`
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Token exchange failed: ${err.error?.message ?? res.statusText}`);
  }
  return res.json();
}

export async function exchangeForLongLived(shortToken: string): Promise<{
  access_token: string;
  expires_in: number;
}> {
  const params = new URLSearchParams({
    grant_type: "fb_exchange_token",
    client_id: getAppId(),
    client_secret: getAppSecret(),
    fb_exchange_token: shortToken,
  });
  const res = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/oauth/access_token?${params}`
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Long-lived token exchange failed: ${err.error?.message ?? res.statusText}`);
  }
  return res.json();
}

export async function fetchAdAccounts(token: string): Promise<
  Array<{ id: string; name: string; account_status: number }>
> {
  const res = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/me/adaccounts?fields=id,name,account_status&access_token=${token}`
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Failed to fetch ad accounts: ${err.error?.message ?? res.statusText}`);
  }
  const data = await res.json();
  return data.data ?? [];
}

export async function revokeToken(token: string): Promise<void> {
  const res = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/me/permissions?access_token=${token}`,
    { method: "DELETE" }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Token revocation failed: ${err.error?.message ?? res.statusText}`);
  }
}

export function verifySignedRequest(signedRequest: string): {
  user_id: string;
  algorithm: string;
  issued_at: number;
} {
  const [encodedSig, encodedPayload] = signedRequest.split(".");
  if (!encodedSig || !encodedPayload) {
    throw new Error("Invalid signed_request format");
  }
  const expectedSig = createHmac("sha256", getAppSecret())
    .update(encodedPayload)
    .digest();
  const actualSig = Buffer.from(encodedSig, "base64url");
  if (
    actualSig.length !== expectedSig.length ||
    !timingSafeEqual(actualSig, expectedSig)
  ) {
    throw new Error("Invalid signed_request signature");
  }
  return JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
}
```

**Step 4: Run tests**

Run: `npx vitest run src/lib/meta-oauth.test.ts`
Expected: PASS (3 tests)

**Step 5: Commit**

```bash
git add src/lib/meta-oauth.ts src/lib/meta-oauth.test.ts
git commit -m "feat: add Meta OAuth helper module"
```

---

## Task 5: OAuth API Routes -- Connect and Callback

**Files:**
- Create: `src/app/api/meta/connect/route.ts`
- Create: `src/app/api/meta/callback/route.ts`
- Test: `src/app/api/meta/connect/route.test.ts`
- Test: `src/app/api/meta/callback/route.test.ts`

**Step 1: Write failing test for connect route**

```typescript
// src/app/api/meta/connect/route.test.ts
import { describe, it, expect, vi } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn().mockResolvedValue({ userId: "user_123" }),
}));
vi.stubEnv("META_APP_ID", "123456");
vi.stubEnv("META_APP_SECRET", "secret");
vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://example.com");

describe("GET /api/meta/connect", () => {
  it("redirects to Facebook OAuth URL", async () => {
    const { GET } = await import("./route");
    const request = new Request("https://example.com/api/meta/connect?slug=zamora");
    const response = await GET(request);
    expect(response.status).toBe(302);
    const location = response.headers.get("location");
    expect(location).toContain("facebook.com");
    expect(location).toContain("dialog/oauth");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/api/meta/connect/route.test.ts`

**Step 3: Implement connect route**

```typescript
// src/app/api/meta/connect/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { randomBytes, createHmac } from "node:crypto";
import { buildAuthUrl } from "@/lib/meta-oauth";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 });
  }

  // Build state: HMAC-signed JSON with userId, slug, nonce
  const nonce = randomBytes(16).toString("hex");
  const statePayload = JSON.stringify({ userId, slug, nonce });
  const secret = process.env.META_APP_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Meta not configured" }, { status: 500 });
  }
  const sig = createHmac("sha256", secret).update(statePayload).digest("hex");
  const state = Buffer.from(`${sig}.${statePayload}`).toString("base64url");

  const authUrl = buildAuthUrl(state);
  return NextResponse.redirect(authUrl);
}
```

**Step 4: Implement callback route**

```typescript
// src/app/api/meta/callback/route.ts
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { encrypt } from "@/lib/crypto";
import {
  exchangeCodeForToken,
  exchangeForLongLived,
  fetchAdAccounts,
} from "@/lib/meta-oauth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const stateB64 = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // User denied permissions
  if (error) {
    const errorDesc = url.searchParams.get("error_description") ?? "Permission denied";
    return NextResponse.redirect(
      `${appUrl}/client/connect-error?error=${encodeURIComponent(errorDesc)}`
    );
  }

  if (!code || !stateB64) {
    return NextResponse.redirect(`${appUrl}/client/connect-error?error=missing_params`);
  }

  // Verify state
  const secret = process.env.META_APP_SECRET;
  if (!secret) {
    return NextResponse.redirect(`${appUrl}/client/connect-error?error=not_configured`);
  }

  let userId: string;
  let slug: string;
  try {
    const stateRaw = Buffer.from(stateB64, "base64url").toString("utf8");
    const dotIndex = stateRaw.indexOf(".");
    const sig = stateRaw.slice(0, dotIndex);
    const payload = stateRaw.slice(dotIndex + 1);
    const expectedSig = createHmac("sha256", secret).update(payload).digest("hex");

    if (
      sig.length !== expectedSig.length ||
      !timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))
    ) {
      throw new Error("Invalid state signature");
    }

    const parsed = JSON.parse(payload);
    userId = parsed.userId;
    slug = parsed.slug;
  } catch {
    return NextResponse.redirect(`${appUrl}/client/connect-error?error=invalid_state`);
  }

  try {
    // Exchange code for tokens
    const shortLived = await exchangeCodeForToken(code);
    const longLived = await exchangeForLongLived(shortLived.access_token);

    // Fetch ad accounts
    const adAccounts = await fetchAdAccounts(longLived.access_token);

    if (adAccounts.length === 0) {
      return NextResponse.redirect(
        `${appUrl}/client/${slug}/settings?error=no_ad_accounts`
      );
    }

    // If single account, connect directly; if multiple, redirect to picker
    if (adAccounts.length === 1) {
      const account = adAccounts[0];
      await storeAccount(userId, slug, longLived, account);
      return NextResponse.redirect(
        `${appUrl}/client/${slug}/settings?connected=${account.id}`
      );
    }

    // Multiple accounts: store token temporarily in a short-lived cookie,
    // redirect to account picker page
    const response = NextResponse.redirect(
      `${appUrl}/client/${slug}/connect?accounts=${encodeURIComponent(JSON.stringify(adAccounts))}`
    );
    // Store encrypted token in httpOnly cookie for the picker step (30 min TTL)
    response.cookies.set("meta_pending_token", encrypt(longLived.access_token), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 1800,
      path: "/",
    });
    response.cookies.set("meta_pending_expires", String(longLived.expires_in), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 1800,
      path: "/",
    });
    return response;
  } catch (err) {
    console.error("OAuth callback error:", err);
    return NextResponse.redirect(
      `${appUrl}/client/${slug}/settings?error=oauth_failed`
    );
  }
}

async function storeAccount(
  clerkUserId: string,
  clientSlug: string,
  tokenData: { access_token: string; expires_in: number },
  account: { id: string; name: string }
) {
  if (!supabaseAdmin) throw new Error("Database not configured");

  const expiresAt = new Date(
    Date.now() + tokenData.expires_in * 1000
  ).toISOString();

  const { error } = await supabaseAdmin.from("client_accounts").upsert(
    {
      clerk_user_id: clerkUserId,
      client_slug: clientSlug,
      meta_user_id: "", // filled later from /me endpoint
      ad_account_id: account.id,
      ad_account_name: account.name,
      access_token_encrypted: encrypt(tokenData.access_token),
      token_expires_at: expiresAt,
      scopes: ["ads_management", "ads_read", "business_management"],
      status: "active",
      connected_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "ad_account_id" }
  );

  if (error) throw new Error(`Failed to store account: ${error.message}`);
}

// Export for use by account picker
export { storeAccount };
```

**Step 5: Write test for callback (basic flow)**

```typescript
// src/app/api/meta/callback/route.test.ts
import { describe, it, expect, vi } from "vitest";

vi.stubEnv("META_APP_SECRET", "test-secret");
vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://example.com");

describe("GET /api/meta/callback", () => {
  it("redirects to error page when error param present", async () => {
    const { GET } = await import("./route");
    const request = new Request(
      "https://example.com/api/meta/callback?error=access_denied&error_description=User+denied"
    );
    const response = await GET(request);
    expect(response.status).toBe(307);
    const location = response.headers.get("location");
    expect(location).toContain("connect-error");
    expect(location).toContain("User+denied");
  });

  it("redirects to error page when missing code", async () => {
    const { GET } = await import("./route");
    const request = new Request("https://example.com/api/meta/callback");
    const response = await GET(request);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("missing_params");
  });
});
```

**Step 6: Run tests**

Run: `npx vitest run src/app/api/meta/connect/route.test.ts src/app/api/meta/callback/route.test.ts`
Expected: PASS

**Step 7: Commit**

```bash
git add src/app/api/meta/connect/ src/app/api/meta/callback/
git commit -m "feat: add OAuth connect and callback API routes"
```

---

## Task 6: Disconnect and Data Deletion Routes

**Files:**
- Create: `src/app/api/meta/disconnect/route.ts`
- Create: `src/app/api/meta/data-deletion/route.ts`
- Test: `src/app/api/meta/data-deletion/route.test.ts`

**Step 1: Write failing test for data deletion**

```typescript
// src/app/api/meta/data-deletion/route.test.ts
import { describe, it, expect, vi } from "vitest";
import { createHmac } from "node:crypto";

vi.stubEnv("META_APP_SECRET", "test-secret");
vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://example.com");

// Mock supabase
vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from: () => ({
      delete: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    }),
  },
}));

describe("POST /api/meta/data-deletion", () => {
  it("returns confirmation code for valid signed_request", async () => {
    const { POST } = await import("./route");

    const payload = JSON.stringify({
      user_id: "fb_user_123",
      algorithm: "HMAC-SHA256",
      issued_at: Math.floor(Date.now() / 1000),
    });
    const encodedPayload = Buffer.from(payload).toString("base64url");
    const sig = createHmac("sha256", "test-secret")
      .update(encodedPayload)
      .digest();
    const encodedSig = sig.toString("base64url");
    const signedRequest = `${encodedSig}.${encodedPayload}`;

    const formData = new FormData();
    formData.set("signed_request", signedRequest);

    const request = new Request("https://example.com/api/meta/data-deletion", {
      method: "POST",
      body: formData,
    });
    const response = await POST(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.url).toContain("deletion-status");
    expect(body.confirmation_code).toBeTruthy();
  });

  it("rejects invalid signature", async () => {
    const { POST } = await import("./route");
    const formData = new FormData();
    formData.set("signed_request", "invalid.data");
    const request = new Request("https://example.com/api/meta/data-deletion", {
      method: "POST",
      body: formData,
    });
    const response = await POST(request);
    expect(response.status).toBe(403);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/api/meta/data-deletion/route.test.ts`

**Step 3: Implement disconnect route**

```typescript
// src/app/api/meta/disconnect/route.ts
import { NextResponse } from "next/server";
import { authGuard, apiError, parseJsonBody } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import { decrypt } from "@/lib/crypto";
import { revokeToken } from "@/lib/meta-oauth";
import { z } from "zod/v4";

const DisconnectSchema = z.object({
  ad_account_id: z.string().min(1),
});

export async function POST(request: Request) {
  const { userId, error: authErr } = await authGuard();
  if (authErr) return authErr;
  if (!supabaseAdmin) return apiError("Database not configured", 500);

  const raw = await parseJsonBody<unknown>(request);
  if (raw instanceof Response) return raw;

  const parsed = DisconnectSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Fetch account to get token
  const { data: account, error: fetchErr } = await supabaseAdmin
    .from("client_accounts")
    .select("access_token_encrypted, status")
    .eq("clerk_user_id", userId)
    .eq("ad_account_id", parsed.data.ad_account_id)
    .single();

  if (fetchErr || !account) {
    return apiError("Account not found", 404);
  }

  // Revoke token on Meta's side
  try {
    const token = decrypt(account.access_token_encrypted);
    await revokeToken(token);
  } catch {
    // Token may already be invalid; continue with local cleanup
  }

  // Mark as revoked locally
  const { error: updateErr } = await supabaseAdmin
    .from("client_accounts")
    .update({ status: "revoked", updated_at: new Date().toISOString() })
    .eq("clerk_user_id", userId)
    .eq("ad_account_id", parsed.data.ad_account_id);

  if (updateErr) return apiError("Failed to disconnect", 500);

  return NextResponse.json({ ok: true });
}
```

**Step 4: Implement data deletion route**

```typescript
// src/app/api/meta/data-deletion/route.ts
import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { verifySignedRequest } from "@/lib/meta-oauth";

export async function POST(request: Request) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  let signedRequest: string;
  try {
    const formData = await request.formData();
    signedRequest = formData.get("signed_request") as string;
    if (!signedRequest) throw new Error("Missing signed_request");
  } catch {
    return NextResponse.json(
      { error: "Missing signed_request" },
      { status: 400 }
    );
  }

  let payload: { user_id: string };
  try {
    payload = verifySignedRequest(signedRequest);
  } catch {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 403 }
    );
  }

  const confirmationCode = `del_${randomBytes(12).toString("hex")}`;

  // Delete user's data from client_accounts
  if (supabaseAdmin) {
    await supabaseAdmin
      .from("client_accounts")
      .delete()
      .eq("meta_user_id", payload.user_id);
  }

  return NextResponse.json({
    url: `${appUrl}/deletion-status/${confirmationCode}`,
    confirmation_code: confirmationCode,
  });
}
```

**Step 5: Run tests**

Run: `npx vitest run src/app/api/meta/data-deletion/route.test.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add src/app/api/meta/disconnect/ src/app/api/meta/data-deletion/
git commit -m "feat: add disconnect and data deletion API routes"
```

---

## Task 7: Middleware Update -- Public Routes

**Files:**
- Modify: `src/proxy.ts` (lines 5-12, createRouteMatcher array)

**Step 1: Add new public routes to the matcher**

Add these entries to the `createRouteMatcher` array in `src/proxy.ts`:

```typescript
"/privacy",
"/terms",
"/deletion-status(.*)",
"/api/meta/callback(.*)",
"/api/meta/data-deletion(.*)",
```

**Step 2: Verify the app builds**

Run: `npx next build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/proxy.ts
git commit -m "feat: add legal and OAuth routes to public route matcher"
```

---

## Task 8: Client Settings Page (Connected Accounts)

**Files:**
- Create: `src/app/client/[slug]/settings/page.tsx`
- Create: `src/app/client/[slug]/settings/data.ts`
- Modify: `src/app/client/[slug]/components/client-nav.tsx` (add Settings link)

**Step 1: Create data fetching function**

```typescript
// src/app/client/[slug]/settings/data.ts
import { supabaseAdmin } from "@/lib/supabase";

export interface ConnectedAccount {
  id: string;
  ad_account_id: string;
  ad_account_name: string | null;
  status: string;
  connected_at: string;
  token_expires_at: string;
  last_used_at: string | null;
}

export async function getConnectedAccounts(
  clerkUserId: string,
  clientSlug: string
): Promise<ConnectedAccount[]> {
  if (!supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from("client_accounts")
    .select(
      "id, ad_account_id, ad_account_name, status, connected_at, token_expires_at, last_used_at"
    )
    .eq("clerk_user_id", clerkUserId)
    .eq("client_slug", clientSlug)
    .order("connected_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch connected accounts:", error.message);
    return [];
  }

  return (data ?? []) as ConnectedAccount[];
}
```

**Step 2: Create the settings page**

```typescript
// src/app/client/[slug]/settings/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getConnectedAccounts } from "./data";
import { ConnectedAccountsList } from "./connected-accounts-list";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const accounts = await getConnectedAccounts(userId, slug);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your connected ad accounts
        </p>
      </div>

      <ConnectedAccountsList
        accounts={accounts}
        slug={slug}
        connectUrl={`/api/meta/connect?slug=${slug}`}
      />
    </div>
  );
}
```

**Step 3: Create the connected accounts client component**

```typescript
// src/app/client/[slug]/settings/connected-accounts-list.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { ConnectedAccount } from "./data";

export function ConnectedAccountsList({
  accounts,
  slug,
  connectUrl,
}: {
  accounts: ConnectedAccount[];
  slug: string;
  connectUrl: string;
}) {
  const router = useRouter();
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  async function handleDisconnect(adAccountId: string) {
    setDisconnecting(adAccountId);
    try {
      const res = await fetch("/api/meta/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ad_account_id: adAccountId }),
      });
      if (!res.ok) throw new Error("Disconnect failed");
      toast.success("Ad account disconnected");
      router.refresh();
    } catch {
      toast.error("Failed to disconnect account");
    } finally {
      setDisconnecting(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Connected Ad Accounts</h2>
        <a href={connectUrl}>
          <Button>Connect Ad Account</Button>
        </a>
      </div>

      {accounts.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-muted-foreground">No ad accounts connected yet.</p>
          <a href={connectUrl}>
            <Button className="mt-4">Connect Your First Ad Account</Button>
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="glass-card p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">
                  {account.ad_account_name ?? account.ad_account_id}
                </p>
                <p className="text-sm text-muted-foreground">
                  {account.ad_account_id}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={account.status === "active" ? "default" : "destructive"}
                >
                  {account.status}
                </Badge>
                {account.status === "active" && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={disconnecting === account.ad_account_id}
                    onClick={() => handleDisconnect(account.ad_account_id)}
                  >
                    {disconnecting === account.ad_account_id
                      ? "Disconnecting..."
                      : "Disconnect"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 4: Add Settings to client nav**

In `src/app/client/[slug]/components/client-nav.tsx`, add a Settings nav item alongside Overview and Campaigns. Add a link to `/client/${slug}/settings` using the same pattern as existing nav items.

**Step 5: Commit**

```bash
git add src/app/client/[slug]/settings/ src/app/client/[slug]/components/client-nav.tsx
git commit -m "feat: add client settings page with connected accounts"
```

---

## Task 9: Ad Account Picker Page

**Files:**
- Create: `src/app/client/[slug]/connect/page.tsx`

**Step 1: Create the account picker page**

This page is shown after OAuth when the user has multiple ad accounts. The token is stored in an httpOnly cookie from the callback route.

```typescript
// src/app/client/[slug]/connect/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AdAccount {
  id: string;
  name: string;
  account_status: number;
}

export default function ConnectPage({
  params,
}: {
  params: { slug: string };
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  let accounts: AdAccount[] = [];
  try {
    accounts = JSON.parse(searchParams.get("accounts") ?? "[]");
  } catch {
    accounts = [];
  }

  async function handleSelect(accountId: string) {
    setSelected(accountId);
    setSubmitting(true);
    try {
      const res = await fetch("/api/meta/connect/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ad_account_id: accountId,
          slug: params.slug,
        }),
      });
      if (!res.ok) throw new Error("Failed to connect");
      toast.success("Ad account connected");
      router.push(`/client/${params.slug}/settings?connected=${accountId}`);
    } catch {
      toast.error("Failed to connect account");
      setSubmitting(false);
      setSelected(null);
    }
  }

  if (accounts.length === 0) {
    return (
      <div className="space-y-4 text-center py-12">
        <h1 className="text-2xl font-semibold">No Ad Accounts Found</h1>
        <p className="text-muted-foreground">
          We couldn't find any ad accounts on your Facebook profile.
        </p>
        <Button onClick={() => router.push(`/client/${params.slug}/settings`)}>
          Back to Settings
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">Select an Ad Account</h1>
        <p className="text-muted-foreground mt-1">
          Choose which ad account to connect to your portal.
        </p>
      </div>
      <div className="space-y-3">
        {accounts.map((account) => (
          <button
            key={account.id}
            onClick={() => handleSelect(account.id)}
            disabled={submitting}
            className={`glass-card p-4 w-full text-left transition-colors hover:border-primary/50 ${
              selected === account.id ? "border-primary" : ""
            }`}
          >
            <p className="font-medium">{account.name}</p>
            <p className="text-sm text-muted-foreground">{account.id}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Create finalize API route**

```typescript
// src/app/api/meta/connect/finalize/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { encrypt, decrypt } from "@/lib/crypto";
import { fetchAdAccounts } from "@/lib/meta-oauth";
import { z } from "zod/v4";
import { apiError, parseJsonBody } from "@/lib/api-helpers";

const FinalizeSchema = z.object({
  ad_account_id: z.string().min(1),
  slug: z.string().min(1),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return apiError("Unauthorized", 401);
  if (!supabaseAdmin) return apiError("Database not configured", 500);

  const raw = await parseJsonBody<unknown>(request);
  if (raw instanceof Response) return raw;

  const parsed = FinalizeSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Retrieve pending token from cookie
  const cookieStore = await cookies();
  const pendingToken = cookieStore.get("meta_pending_token")?.value;
  const pendingExpires = cookieStore.get("meta_pending_expires")?.value;

  if (!pendingToken || !pendingExpires) {
    return apiError("Session expired, please reconnect", 400);
  }

  const token = decrypt(pendingToken);
  const expiresIn = parseInt(pendingExpires, 10);
  const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

  // Verify the selected account belongs to this user
  const adAccounts = await fetchAdAccounts(token);
  const account = adAccounts.find((a) => a.id === parsed.data.ad_account_id);
  if (!account) {
    return apiError("Ad account not found on your profile", 403);
  }

  // Store in database
  const { error } = await supabaseAdmin.from("client_accounts").upsert(
    {
      clerk_user_id: userId,
      client_slug: parsed.data.slug,
      meta_user_id: "",
      ad_account_id: account.id,
      ad_account_name: account.name,
      access_token_encrypted: encrypt(token),
      token_expires_at: expiresAt,
      scopes: ["ads_management", "ads_read", "business_management"],
      status: "active",
      connected_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "ad_account_id" }
  );

  if (error) return apiError(`Failed to store account: ${error.message}`, 500);

  // Clear pending cookies
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("meta_pending_token");
  response.cookies.delete("meta_pending_expires");
  return response;
}
```

**Step 3: Commit**

```bash
git add src/app/client/[slug]/connect/ src/app/api/meta/connect/finalize/
git commit -m "feat: add ad account picker and finalize route"
```

---

## Task 10: Legal Pages (Privacy Policy, Terms, Deletion Status)

**Files:**
- Create: `src/app/privacy/page.tsx`
- Create: `src/app/terms/page.tsx`
- Create: `src/app/deletion-status/[code]/page.tsx`

**Step 1: Create privacy policy page**

```typescript
// src/app/privacy/page.tsx
export const metadata = {
  title: "Privacy Policy - Outlet Media",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 prose prose-invert">
      <h1>Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: March 2, 2026</p>

      <h2>1. Who We Are</h2>
      <p>
        Outlet Media ("we", "us", "our") operates the Outlet Media advertising
        management platform at{" "}
        <a href="https://outlet-media-app-production.up.railway.app">
          outlet-media-app-production.up.railway.app
        </a>
        . Contact us at: [YOUR_EMAIL_ADDRESS].
      </p>

      <h2>2. What Data We Collect</h2>
      <p>When you connect your Meta (Facebook) ad account, we access:</p>
      <ul>
        <li>Your Facebook user ID (for account linking)</li>
        <li>Ad account ID and name</li>
        <li>
          Campaign performance data: spend, impressions, clicks, click-through
          rate, cost per click, cost per thousand impressions, purchase return on
          ad spend
        </li>
        <li>Campaign configuration: name, status, daily budget, start date</li>
        <li>Ad creative metadata: thumbnail URL, title text, body text</li>
        <li>Audience breakdown data: age, gender, placement performance</li>
      </ul>
      <p>
        We also collect your email address and name when you create an account
        via our authentication provider (Clerk).
      </p>

      <h2>3. How We Use Your Data</h2>
      <ul>
        <li>
          Display your campaign performance metrics in your portal dashboard
        </li>
        <li>
          Create, edit, pause, and manage advertising campaigns on your behalf
          when you use our campaign management tools
        </li>
        <li>Generate performance insights and recommendations</li>
        <li>Send you notifications about campaign performance changes</li>
      </ul>
      <p>
        We do not use your data for advertising profiling, sale to third
        parties, or any purpose other than providing the services described
        above.
      </p>

      <h2>4. Data Sharing</h2>
      <p>
        We share your data only with the following service providers, strictly
        for operating our platform:
      </p>
      <ul>
        <li>Supabase (database hosting)</li>
        <li>Clerk (authentication)</li>
        <li>Railway (application hosting)</li>
        <li>Meta (Facebook) Ads API (campaign management)</li>
      </ul>
      <p>We do not sell your data to any third party.</p>

      <h2>5. Data Retention</h2>
      <p>
        We retain your data for as long as your account is active. Campaign
        performance snapshots are stored daily for historical trend analysis.
        When you disconnect your ad account, we stop accessing new data but
        retain historical snapshots unless you request deletion.
      </p>

      <h2>6. Your Right to Delete Your Data</h2>
      <p>
        You can request deletion of all your data at any time, regardless of
        your location. There are no fees, no approval process, and no geographic
        restrictions. To request deletion:
      </p>
      <ul>
        <li>
          Disconnect your ad account in Settings, then contact us at
          [YOUR_EMAIL_ADDRESS] to request full data deletion
        </li>
        <li>
          Or use Facebook's data deletion request (we process these
          automatically within 48 hours)
        </li>
      </ul>
      <p>
        Upon deletion, we remove your encrypted access token, cached campaign
        data, and account records from our database.
      </p>

      <h2>7. Data Security</h2>
      <p>
        Access tokens are encrypted at rest using AES-256-GCM. All
        communication uses HTTPS. We follow the principle of least privilege for
        data access.
      </p>

      <h2>8. Changes to This Policy</h2>
      <p>
        We will update this page when our practices change. The "last updated"
        date at the top reflects the most recent revision.
      </p>
    </div>
  );
}
```

**Step 2: Create terms of service page**

```typescript
// src/app/terms/page.tsx
export const metadata = {
  title: "Terms of Service - Outlet Media",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 prose prose-invert">
      <h1>Terms of Service</h1>
      <p className="text-muted-foreground">Last updated: March 2, 2026</p>

      <h2>1. Service Description</h2>
      <p>
        Outlet Media provides an advertising management platform that allows
        users to connect their Meta (Facebook) ad accounts, view campaign
        performance data, and create and manage advertising campaigns.
      </p>

      <h2>2. Account and Access</h2>
      <p>
        You must have a valid Meta ad account to use our campaign management
        features. You are responsible for maintaining the security of your
        account credentials. You grant us permission to access your ad account
        data when you connect via Facebook Login.
      </p>

      <h2>3. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Violate Meta's advertising policies through our platform</li>
        <li>Provide false or misleading information</li>
        <li>Attempt to access other users' data</li>
        <li>Use the platform for any unlawful purpose</li>
      </ul>

      <h2>4. Data Ownership</h2>
      <p>
        You retain ownership of your ad account and all campaign data. We do not
        claim ownership of any data accessed through your connected ad account.
        You can disconnect and remove your data at any time.
      </p>

      <h2>5. Billing and Payments</h2>
      <p>
        Ad spend is billed directly by Meta to the payment method on your ad
        account. Outlet Media does not process ad spend payments. Any fees for
        our platform services will be communicated separately.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        Outlet Media is not responsible for: campaign performance outcomes, Meta
        API availability or changes, ad account suspensions by Meta, or data
        loss caused by third-party services. Our platform is provided "as is"
        without warranty of any kind.
      </p>

      <h2>7. Termination</h2>
      <p>
        Either party can terminate access at any time. You can disconnect your
        ad account and request data deletion. We may suspend access if you
        violate these terms.
      </p>

      <h2>8. Changes to These Terms</h2>
      <p>
        We will update this page when our terms change. Continued use of the
        platform after changes constitutes acceptance.
      </p>
    </div>
  );
}
```

**Step 3: Create deletion status page**

```typescript
// src/app/deletion-status/[code]/page.tsx
export const metadata = {
  title: "Data Deletion Status - Outlet Media",
};

export default async function DeletionStatusPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return (
    <div className="max-w-xl mx-auto px-6 py-12 text-center space-y-4">
      <h1 className="text-2xl font-semibold">Data Deletion Request</h1>
      <p className="text-muted-foreground">
        Your data deletion request has been received and processed.
      </p>
      <div className="glass-card p-4 inline-block">
        <p className="text-sm text-muted-foreground">Confirmation code</p>
        <p className="font-mono text-lg">{code}</p>
      </div>
      <p className="text-sm text-muted-foreground">
        All associated data has been removed from our systems. If you have
        questions, contact us at [YOUR_EMAIL_ADDRESS].
      </p>
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add src/app/privacy/ src/app/terms/ src/app/deletion-status/
git commit -m "feat: add privacy policy, terms of service, and deletion status pages"
```

---

## Task 11: Client Token Lookup Helper

**Files:**
- Create: `src/lib/client-token.ts`
- Test: `src/lib/client-token.test.ts`

This module replaces the global `META_ACCESS_TOKEN` lookup with per-client token retrieval.

**Step 1: Write failing test**

```typescript
// src/lib/client-token.test.ts
import { describe, it, expect, vi } from "vitest";

vi.stubEnv("TOKEN_ENCRYPTION_KEY", "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6");

const mockFrom = vi.fn();
vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: { from: (...args: unknown[]) => mockFrom(...args) },
}));

describe("getClientToken", () => {
  it("returns decrypted token for active account", async () => {
    const { encrypt } = await import("./crypto");
    const encrypted = encrypt("test-token-123");

    mockFrom.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: () =>
              Promise.resolve({
                data: {
                  access_token_encrypted: encrypted,
                  ad_account_id: "act_123",
                },
                error: null,
              }),
          }),
        }),
      }),
    });

    const { getClientToken } = await import("./client-token");
    const result = await getClientToken("slug", "act_123");
    expect(result).toBe("test-token-123");
  });

  it("returns null when no account found", async () => {
    mockFrom.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: () =>
              Promise.resolve({ data: null, error: { message: "not found" } }),
          }),
        }),
      }),
    });

    const { getClientToken } = await import("./client-token");
    const result = await getClientToken("slug", "act_999");
    expect(result).toBeNull();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/client-token.test.ts`

**Step 3: Write implementation**

```typescript
// src/lib/client-token.ts
import { supabaseAdmin } from "./supabase";
import { decrypt } from "./crypto";

export async function getClientToken(
  clientSlug: string,
  adAccountId: string
): Promise<string | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from("client_accounts")
    .select("access_token_encrypted")
    .eq("client_slug", clientSlug)
    .eq("ad_account_id", adAccountId)
    .eq("status", "active")
    .single();

  if (error || !data) return null;

  try {
    return decrypt(data.access_token_encrypted);
  } catch {
    console.error(`Failed to decrypt token for ${adAccountId}`);
    return null;
  }
}

export async function getActiveAccountsForSlug(
  clientSlug: string
): Promise<Array<{ ad_account_id: string; ad_account_name: string | null }>> {
  if (!supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from("client_accounts")
    .select("ad_account_id, ad_account_name")
    .eq("client_slug", clientSlug)
    .eq("status", "active");

  if (error || !data) return [];
  return data;
}
```

**Step 4: Run tests**

Run: `npx vitest run src/lib/client-token.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/client-token.ts src/lib/client-token.test.ts
git commit -m "feat: add per-client token lookup helper"
```

---

## Task 12: Update Client Portal Data Fetching

**Files:**
- Modify: `src/app/client/[slug]/data.ts`

**Context:** Currently `data.ts` uses `process.env.META_ACCESS_TOKEN` (global). Change it to first look up the client's own token from `client_accounts`, falling back to the global token, then to Supabase cached data.

**Step 1: Import the new helper**

Add at the top of `data.ts`:
```typescript
import { getClientToken, getActiveAccountsForSlug } from "@/lib/client-token";
```

**Step 2: Update the token resolution logic**

Find where `META_ACCESS_TOKEN` is read from `process.env` and replace with:

```typescript
// Get client's connected ad accounts
const clientAccounts = await getActiveAccountsForSlug(slug);

// If client has connected accounts, use their token
let metaToken: string | null = null;
let accountId: string | null = null;

if (clientAccounts.length > 0) {
  // Use the first active account
  const account = clientAccounts[0];
  accountId = account.ad_account_id;
  metaToken = await getClientToken(slug, account.ad_account_id);
}

// Fall back to global token (for Outlet Media's own account)
if (!metaToken) {
  metaToken = process.env.META_ACCESS_TOKEN ?? null;
  accountId = process.env.META_AD_ACCOUNT_ID ?? null;
}
```

Replace all uses of `process.env.META_ACCESS_TOKEN` and `process.env.META_AD_ACCOUNT_ID` in `data.ts` with `metaToken` and `accountId`.

**Step 3: Update last_used_at on successful API call**

After a successful Meta API call, update the timestamp:
```typescript
if (clientAccounts.length > 0 && supabaseAdmin) {
  await supabaseAdmin
    .from("client_accounts")
    .update({ last_used_at: new Date().toISOString() })
    .eq("ad_account_id", accountId);
}
```

**Step 4: Verify the build**

Run: `npx next build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add src/app/client/[slug]/data.ts
git commit -m "feat: switch client portal to per-client token lookup"
```

---

## Task 13: Campaign Creation API Route

**Files:**
- Create: `src/app/api/meta/campaigns/route.ts`
- Create: `src/lib/api-schemas.ts` (add CampaignCreateSchema)

**Step 1: Add Zod schema for campaign creation**

Add to `src/lib/api-schemas.ts`:

```typescript
export const CampaignCreateSchema = z.object({
  ad_account_id: z.string().min(1),
  client_slug: z.string().min(1),
  name: z.string().min(1).max(400),
  objective: z.enum([
    "OUTCOME_AWARENESS",
    "OUTCOME_TRAFFIC",
    "OUTCOME_ENGAGEMENT",
    "OUTCOME_SALES",
  ]),
  daily_budget: z.number().int().min(100), // cents, min $1
  targeting: z.object({
    geo_locations: z.object({
      countries: z.array(z.string()).optional(),
      cities: z.array(z.object({ key: z.string() })).optional(),
    }),
    age_min: z.number().int().min(18).max(65).optional(),
    age_max: z.number().int().min(18).max(65).optional(),
    genders: z.array(z.number().int().min(0).max(2)).optional(),
    flexible_spec: z
      .array(z.object({ interests: z.array(z.object({ id: z.string(), name: z.string() })) }))
      .optional(),
  }),
  placements: z
    .object({
      publisher_platforms: z.array(z.string()).optional(),
      facebook_positions: z.array(z.string()).optional(),
      instagram_positions: z.array(z.string()).optional(),
    })
    .optional(),
  creative: z.object({
    primary_text: z.string().min(1),
    headline: z.string().optional(),
    description: z.string().optional(),
    call_to_action: z.string().optional(),
    image_hash: z.string().optional(),
    video_id: z.string().optional(),
    link_url: z.string().url().optional(),
  }),
});

export type CampaignCreatePayload = z.infer<typeof CampaignCreateSchema>;
```

**Step 2: Create the campaign creation route**

```typescript
// src/app/api/meta/campaigns/route.ts
import { NextResponse } from "next/server";
import { authGuard, apiError, parseJsonBody } from "@/lib/api-helpers";
import { getClientToken } from "@/lib/client-token";
import { CampaignCreateSchema } from "@/lib/api-schemas";
import { META_API_VERSION } from "@/lib/constants";

export async function POST(request: Request) {
  const { userId, error: authErr } = await authGuard();
  if (authErr) return authErr;

  const raw = await parseJsonBody<unknown>(request);
  if (raw instanceof Response) return raw;

  const parsed = CampaignCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { ad_account_id, client_slug, name, objective, daily_budget, targeting, placements, creative } =
    parsed.data;

  const token = await getClientToken(client_slug, ad_account_id);
  if (!token) {
    return apiError("Ad account not connected or token expired", 403);
  }

  const accountId = ad_account_id.replace(/^act_/, "");

  try {
    // Step 1: Create campaign
    const campaignRes = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/act_${accountId}/campaigns`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          access_token: token,
          name,
          objective,
          status: "PAUSED",
          special_ad_categories: "[]",
        }),
      }
    );
    if (!campaignRes.ok) {
      const err = await campaignRes.json().catch(() => ({}));
      return apiError(`Campaign creation failed: ${err.error?.message ?? "Unknown error"}`, 400);
    }
    const { id: campaignId } = await campaignRes.json();

    // Step 2: Create ad set
    const adSetBody: Record<string, string> = {
      access_token: token,
      campaign_id: campaignId,
      name: `${name} - Ad Set`,
      daily_budget: String(daily_budget),
      billing_event: "IMPRESSIONS",
      optimization_goal: objective === "OUTCOME_SALES" ? "OFFSITE_CONVERSIONS" : "LINK_CLICKS",
      bid_strategy: "LOWEST_COST_WITHOUT_CAP",
      targeting: JSON.stringify(targeting),
      status: "PAUSED",
    };
    if (placements) {
      adSetBody.targeting = JSON.stringify({ ...targeting, ...placements });
    }

    const adSetRes = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/act_${accountId}/adsets`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(adSetBody),
      }
    );
    if (!adSetRes.ok) {
      const err = await adSetRes.json().catch(() => ({}));
      return apiError(`Ad set creation failed: ${err.error?.message ?? "Unknown error"}`, 400);
    }
    const { id: adSetId } = await adSetRes.json();

    // Step 3: Create ad with creative
    const adCreative: Record<string, unknown> = {
      object_story_spec: {
        page_id: process.env.META_PAGE_ID ?? "",
        link_data: {
          message: creative.primary_text,
          link: creative.link_url ?? "",
          name: creative.headline ?? "",
          description: creative.description ?? "",
          call_to_action: creative.call_to_action
            ? { type: creative.call_to_action }
            : undefined,
          image_hash: creative.image_hash,
        },
      },
    };

    const adRes = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/act_${accountId}/ads`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          access_token: token,
          adset_id: adSetId,
          name: `${name} - Ad`,
          status: "PAUSED",
          creative: JSON.stringify(adCreative),
        }),
      }
    );
    if (!adRes.ok) {
      const err = await adRes.json().catch(() => ({}));
      return apiError(`Ad creation failed: ${err.error?.message ?? "Unknown error"}`, 400);
    }
    const { id: adId } = await adRes.json();

    return NextResponse.json({
      campaign_id: campaignId,
      adset_id: adSetId,
      ad_id: adId,
    });
  } catch (err) {
    console.error("Campaign creation error:", err);
    return apiError("Campaign creation failed", 500);
  }
}
```

**Step 3: Commit**

```bash
git add src/app/api/meta/campaigns/ src/lib/api-schemas.ts
git commit -m "feat: add campaign creation API route"
```

---

## Task 14: Campaign Status and Budget API Routes

**Files:**
- Create: `src/app/api/meta/campaigns/[id]/status/route.ts`
- Create: `src/app/api/meta/campaigns/[id]/route.ts`

**Step 1: Create status toggle route**

```typescript
// src/app/api/meta/campaigns/[id]/status/route.ts
import { NextResponse } from "next/server";
import { authGuard, apiError, parseJsonBody } from "@/lib/api-helpers";
import { getClientToken } from "@/lib/client-token";
import { META_API_VERSION } from "@/lib/constants";
import { z } from "zod/v4";

const StatusSchema = z.object({
  ad_account_id: z.string().min(1),
  client_slug: z.string().min(1),
  status: z.enum(["ACTIVE", "PAUSED"]),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authErr } = await authGuard();
  if (authErr) return authErr;

  const { id: campaignId } = await params;
  const raw = await parseJsonBody<unknown>(request);
  if (raw instanceof Response) return raw;

  const parsed = StatusSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const token = await getClientToken(parsed.data.client_slug, parsed.data.ad_account_id);
  if (!token) return apiError("Ad account not connected", 403);

  const res = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/${campaignId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        access_token: token,
        status: parsed.data.status,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return apiError(`Status update failed: ${err.error?.message ?? "Unknown"}`, 400);
  }

  return NextResponse.json({ ok: true, status: parsed.data.status });
}
```

**Step 2: Create campaign update route**

```typescript
// src/app/api/meta/campaigns/[id]/route.ts
import { NextResponse } from "next/server";
import { authGuard, apiError, parseJsonBody } from "@/lib/api-helpers";
import { getClientToken } from "@/lib/client-token";
import { META_API_VERSION } from "@/lib/constants";
import { z } from "zod/v4";

const UpdateSchema = z.object({
  ad_account_id: z.string().min(1),
  client_slug: z.string().min(1),
  name: z.string().min(1).optional(),
  daily_budget: z.number().int().min(100).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authErr } = await authGuard();
  if (authErr) return authErr;

  const { id: campaignId } = await params;
  const raw = await parseJsonBody<unknown>(request);
  if (raw instanceof Response) return raw;

  const parsed = UpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const token = await getClientToken(parsed.data.client_slug, parsed.data.ad_account_id);
  if (!token) return apiError("Ad account not connected", 403);

  const body: Record<string, string> = { access_token: token };
  if (parsed.data.name) body.name = parsed.data.name;
  if (parsed.data.daily_budget) body.daily_budget = String(parsed.data.daily_budget);

  const res = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/${campaignId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(body),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return apiError(`Update failed: ${err.error?.message ?? "Unknown"}`, 400);
  }

  return NextResponse.json({ ok: true });
}
```

**Step 3: Commit**

```bash
git add src/app/api/meta/campaigns/[id]/
git commit -m "feat: add campaign status and update API routes"
```

---

## Task 15: Targeting Search Proxy

**Files:**
- Create: `src/app/api/meta/targeting/search/route.ts`

**Step 1: Create targeting search route**

```typescript
// src/app/api/meta/targeting/search/route.ts
import { NextResponse } from "next/server";
import { authGuard, apiError } from "@/lib/api-helpers";
import { getClientToken } from "@/lib/client-token";
import { META_API_VERSION } from "@/lib/constants";

export async function GET(request: Request) {
  const { error: authErr } = await authGuard();
  if (authErr) return authErr;

  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const slug = url.searchParams.get("slug");
  const accountId = url.searchParams.get("account_id");

  if (!q || !slug || !accountId) {
    return apiError("Missing q, slug, or account_id", 400);
  }

  const token = await getClientToken(slug, accountId);
  if (!token) return apiError("Ad account not connected", 403);

  const res = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/search?type=adinterest&q=${encodeURIComponent(q)}&access_token=${token}`
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return apiError(`Search failed: ${err.error?.message ?? "Unknown"}`, 400);
  }

  const data = await res.json();
  return NextResponse.json(data);
}
```

**Step 2: Commit**

```bash
git add src/app/api/meta/targeting/
git commit -m "feat: add targeting interest search proxy"
```

---

## Task 16: Campaign Creation Wizard UI

**Files:**
- Create: `src/app/client/[slug]/campaigns/new/page.tsx`
- Create: `src/app/client/[slug]/campaigns/new/wizard-steps.tsx`
- Create: `src/app/client/[slug]/campaigns/new/use-wizard.ts`

This is the largest UI task. The wizard has 5 steps: Basics, Audience, Placements, Creative, Review.

**Step 1: Create the wizard state hook**

```typescript
// src/app/client/[slug]/campaigns/new/use-wizard.ts
"use client";

import { useState, useCallback } from "react";

export interface WizardData {
  // Step 1: Basics
  name: string;
  objective: string;
  daily_budget: number; // dollars, converted to cents on submit
  // Step 2: Audience
  countries: string[];
  age_min: number;
  age_max: number;
  genders: number[];
  interests: Array<{ id: string; name: string }>;
  // Step 3: Placements
  auto_placements: boolean;
  publisher_platforms: string[];
  facebook_positions: string[];
  instagram_positions: string[];
  // Step 4: Creative
  primary_text: string;
  headline: string;
  description: string;
  call_to_action: string;
  image_hash: string;
  video_id: string;
  link_url: string;
}

const INITIAL: WizardData = {
  name: "",
  objective: "OUTCOME_TRAFFIC",
  daily_budget: 10,
  countries: ["US"],
  age_min: 18,
  age_max: 65,
  genders: [],
  interests: [],
  auto_placements: true,
  publisher_platforms: ["facebook", "instagram"],
  facebook_positions: ["feed"],
  instagram_positions: ["stream", "story", "reels"],
  primary_text: "",
  headline: "",
  description: "",
  call_to_action: "LEARN_MORE",
  image_hash: "",
  video_id: "",
  link_url: "",
};

export function useWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(INITIAL);

  const update = useCallback(
    (partial: Partial<WizardData>) =>
      setData((prev) => ({ ...prev, ...partial })),
    []
  );

  const next = useCallback(() => setStep((s) => Math.min(s + 1, 4)), []);
  const prev = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  return { step, data, update, next, prev, setStep };
}
```

**Step 2: Create the wizard steps component**

```typescript
// src/app/client/[slug]/campaigns/new/wizard-steps.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { WizardData } from "./use-wizard";

const OBJECTIVES = [
  { value: "OUTCOME_AWARENESS", label: "Awareness" },
  { value: "OUTCOME_TRAFFIC", label: "Traffic" },
  { value: "OUTCOME_ENGAGEMENT", label: "Engagement" },
  { value: "OUTCOME_SALES", label: "Sales" },
];

const CTA_OPTIONS = [
  "LEARN_MORE",
  "SHOP_NOW",
  "SIGN_UP",
  "BOOK_TRAVEL",
  "CONTACT_US",
  "GET_OFFER",
  "LISTEN_NOW",
  "BUY_TICKETS",
];

interface StepProps {
  data: WizardData;
  update: (partial: Partial<WizardData>) => void;
}

export function StepBasics({ data, update }: StepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Campaign Basics</h2>
      <div className="space-y-2">
        <label className="text-sm font-medium">Campaign Name</label>
        <Input
          value={data.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="e.g. Summer Concert Promo"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Objective</label>
        <div className="grid grid-cols-2 gap-2">
          {OBJECTIVES.map((obj) => (
            <button
              key={obj.value}
              onClick={() => update({ objective: obj.value })}
              className={`glass-card p-3 text-left transition-colors ${
                data.objective === obj.value
                  ? "border-primary bg-primary/10"
                  : "hover:border-primary/50"
              }`}
            >
              {obj.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Daily Budget (USD)</label>
        <Input
          type="number"
          min={1}
          step={1}
          value={data.daily_budget}
          onChange={(e) => update({ daily_budget: Number(e.target.value) })}
        />
      </div>
    </div>
  );
}

export function StepAudience({ data, update }: StepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Audience Targeting</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Min Age</label>
          <Input
            type="number"
            min={18}
            max={65}
            value={data.age_min}
            onChange={(e) => update({ age_min: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Max Age</label>
          <Input
            type="number"
            min={18}
            max={65}
            value={data.age_max}
            onChange={(e) => update({ age_max: Number(e.target.value) })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Gender</label>
        <div className="flex gap-2">
          {[
            { value: 0, label: "All" },
            { value: 1, label: "Male" },
            { value: 2, label: "Female" },
          ].map((g) => (
            <button
              key={g.value}
              onClick={() => update({ genders: g.value === 0 ? [] : [g.value] })}
              className={`glass-card px-4 py-2 transition-colors ${
                (g.value === 0 && data.genders.length === 0) ||
                data.genders.includes(g.value)
                  ? "border-primary bg-primary/10"
                  : "hover:border-primary/50"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Countries</label>
        <Input
          value={data.countries.join(", ")}
          onChange={(e) =>
            update({
              countries: e.target.value
                .split(",")
                .map((s) => s.trim().toUpperCase())
                .filter(Boolean),
            })
          }
          placeholder="US, CA, MX"
        />
        <p className="text-xs text-muted-foreground">
          Comma-separated ISO country codes
        </p>
      </div>
    </div>
  );
}

export function StepPlacements({ data, update }: StepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Placements</h2>
      <div className="space-y-3">
        <button
          onClick={() => update({ auto_placements: true })}
          className={`glass-card p-4 w-full text-left transition-colors ${
            data.auto_placements ? "border-primary bg-primary/10" : "hover:border-primary/50"
          }`}
        >
          <p className="font-medium">Automatic Placements</p>
          <p className="text-sm text-muted-foreground">
            Let Meta optimize where your ads appear
          </p>
        </button>
        <button
          onClick={() => update({ auto_placements: false })}
          className={`glass-card p-4 w-full text-left transition-colors ${
            !data.auto_placements ? "border-primary bg-primary/10" : "hover:border-primary/50"
          }`}
        >
          <p className="font-medium">Manual Placements</p>
          <p className="text-sm text-muted-foreground">
            Choose specific platforms and positions
          </p>
        </button>
      </div>
      {!data.auto_placements && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Facebook Positions</label>
            {["feed", "right_hand_column", "marketplace"].map((pos) => (
              <label key={pos} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={data.facebook_positions.includes(pos)}
                  onChange={(e) => {
                    const positions = e.target.checked
                      ? [...data.facebook_positions, pos]
                      : data.facebook_positions.filter((p) => p !== pos);
                    update({ facebook_positions: positions });
                  }}
                />
                {pos.replace(/_/g, " ")}
              </label>
            ))}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Instagram Positions</label>
            {["stream", "story", "reels", "explore"].map((pos) => (
              <label key={pos} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={data.instagram_positions.includes(pos)}
                  onChange={(e) => {
                    const positions = e.target.checked
                      ? [...data.instagram_positions, pos]
                      : data.instagram_positions.filter((p) => p !== pos);
                    update({ instagram_positions: positions });
                  }}
                />
                {pos}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function StepCreative({ data, update }: StepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Ad Creative</h2>
      <div className="space-y-2">
        <label className="text-sm font-medium">Primary Text</label>
        <textarea
          className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px]"
          value={data.primary_text}
          onChange={(e) => update({ primary_text: e.target.value })}
          placeholder="The main text of your ad..."
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Headline</label>
        <Input
          value={data.headline}
          onChange={(e) => update({ headline: e.target.value })}
          placeholder="Short attention-grabbing headline"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input
          value={data.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="Additional description text"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Link URL</label>
        <Input
          type="url"
          value={data.link_url}
          onChange={(e) => update({ link_url: e.target.value })}
          placeholder="https://example.com/landing-page"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Call to Action</label>
        <div className="flex flex-wrap gap-2">
          {CTA_OPTIONS.map((cta) => (
            <button
              key={cta}
              onClick={() => update({ call_to_action: cta })}
              className={`glass-card px-3 py-1.5 text-sm transition-colors ${
                data.call_to_action === cta
                  ? "border-primary bg-primary/10"
                  : "hover:border-primary/50"
              }`}
            >
              {cta.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StepReview({
  data,
  submitting,
}: {
  data: WizardData;
  submitting: boolean;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Review Campaign</h2>
      <div className="glass-card p-4 space-y-3">
        <Row label="Name" value={data.name} />
        <Row
          label="Objective"
          value={data.objective.replace("OUTCOME_", "")}
        />
        <Row label="Daily Budget" value={`$${data.daily_budget}`} />
        <Row label="Age" value={`${data.age_min} - ${data.age_max}`} />
        <Row label="Countries" value={data.countries.join(", ")} />
        <Row
          label="Placements"
          value={data.auto_placements ? "Automatic" : "Manual"}
        />
        <Row label="CTA" value={data.call_to_action.replace(/_/g, " ")} />
      </div>
      <div className="glass-card p-4">
        <p className="text-sm font-medium mb-2">Ad Preview</p>
        <p className="text-sm">{data.primary_text}</p>
        {data.headline && (
          <p className="font-semibold mt-1">{data.headline}</p>
        )}
        {data.description && (
          <p className="text-sm text-muted-foreground">{data.description}</p>
        )}
      </div>
      {submitting && (
        <p className="text-sm text-muted-foreground">Creating campaign...</p>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
```

**Step 3: Create the wizard page**

```typescript
// src/app/client/[slug]/campaigns/new/page.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useWizard } from "./use-wizard";
import {
  StepBasics,
  StepAudience,
  StepPlacements,
  StepCreative,
  StepReview,
} from "./wizard-steps";

const STEP_LABELS = ["Basics", "Audience", "Placements", "Creative", "Review"];

export default function NewCampaignPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { step, data, update, next, prev } = useWizard();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      // TODO: get ad_account_id from connected accounts
      const res = await fetch("/api/meta/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ad_account_id: "", // filled from connected account
          client_slug: slug,
          name: data.name,
          objective: data.objective,
          daily_budget: Math.round(data.daily_budget * 100), // dollars to cents
          targeting: {
            geo_locations: { countries: data.countries },
            age_min: data.age_min,
            age_max: data.age_max,
            genders: data.genders.length > 0 ? data.genders : undefined,
            flexible_spec: data.interests.length > 0
              ? [{ interests: data.interests }]
              : undefined,
          },
          placements: data.auto_placements
            ? undefined
            : {
                publisher_platforms: data.publisher_platforms,
                facebook_positions: data.facebook_positions,
                instagram_positions: data.instagram_positions,
              },
          creative: {
            primary_text: data.primary_text,
            headline: data.headline || undefined,
            description: data.description || undefined,
            call_to_action: data.call_to_action,
            image_hash: data.image_hash || undefined,
            video_id: data.video_id || undefined,
            link_url: data.link_url || undefined,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Creation failed");
      }

      toast.success("Campaign created");
      router.push(`/client/${slug}/campaigns`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create campaign");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Step indicator */}
      <div className="flex gap-1">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex-1">
            <div
              className={`h-1 rounded-full ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
            <p
              className={`text-xs mt-1 ${
                i === step ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Current step */}
      {step === 0 && <StepBasics data={data} update={update} />}
      {step === 1 && <StepAudience data={data} update={update} />}
      {step === 2 && <StepPlacements data={data} update={update} />}
      {step === 3 && <StepCreative data={data} update={update} />}
      {step === 4 && <StepReview data={data} submitting={submitting} />}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={prev}
          disabled={step === 0}
        >
          Back
        </Button>
        {step < 4 ? (
          <Button onClick={next}>Continue</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Creating..." : "Create Campaign"}
          </Button>
        )}
      </div>
    </div>
  );
}
```

**Step 4: Add "Create Campaign" button to campaigns list**

In `src/app/client/[slug]/campaigns/page.tsx`, add a link/button near the page header:

```typescript
import Link from "next/link";
// In the header section:
<Link href={`/client/${slug}/campaigns/new`}>
  <Button>Create Campaign</Button>
</Link>
```

**Step 5: Commit**

```bash
git add src/app/client/[slug]/campaigns/new/
git commit -m "feat: add 5-step campaign creation wizard"
```

---

## Task 17: Creative Upload Route

**Files:**
- Create: `src/app/api/meta/creatives/upload/route.ts`

**Step 1: Create upload route**

```typescript
// src/app/api/meta/creatives/upload/route.ts
import { NextResponse } from "next/server";
import { authGuard, apiError } from "@/lib/api-helpers";
import { getClientToken } from "@/lib/client-token";
import { META_API_VERSION } from "@/lib/constants";

export async function POST(request: Request) {
  const { error: authErr } = await authGuard();
  if (authErr) return authErr;

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const slug = formData.get("slug") as string | null;
  const accountId = formData.get("account_id") as string | null;

  if (!file || !slug || !accountId) {
    return apiError("Missing file, slug, or account_id", 400);
  }

  const token = await getClientToken(slug, accountId);
  if (!token) return apiError("Ad account not connected", 403);

  const rawAccountId = accountId.replace(/^act_/, "");
  const bytes = await file.arrayBuffer();

  // Upload to Meta
  const uploadForm = new FormData();
  uploadForm.set("access_token", token);
  uploadForm.set("filename", file.name);
  uploadForm.set(
    "bytes",
    new Blob([bytes], { type: file.type }),
    file.name
  );

  const res = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/act_${rawAccountId}/adimages`,
    { method: "POST", body: uploadForm }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return apiError(`Upload failed: ${err.error?.message ?? "Unknown"}`, 400);
  }

  const data = await res.json();
  // Meta returns { images: { [filename]: { hash, url, ... } } }
  const images = data.images ?? {};
  const first = Object.values(images)[0] as
    | { hash: string; url: string }
    | undefined;

  if (!first) return apiError("No image returned from Meta", 500);

  return NextResponse.json({ hash: first.hash, url: first.url });
}
```

**Step 2: Commit**

```bash
git add src/app/api/meta/creatives/
git commit -m "feat: add creative image upload route"
```

---

## Task 18: Add NEXT_PUBLIC_APP_URL to Environment

**Files:**
- Modify: `src/lib/env.ts` (add to public schema)
- Modify: `.env.example`

**Step 1: Add to public env schema**

In `src/lib/env.ts`, add to the public schema:

```typescript
NEXT_PUBLIC_APP_URL: z.string().url().optional(),
```

**Step 2: Update .env.example**

Add:
```
NEXT_PUBLIC_APP_URL=https://outlet-media-app-production.up.railway.app
```

**Step 3: Commit**

```bash
git add src/lib/env.ts .env.example
git commit -m "feat: add NEXT_PUBLIC_APP_URL to env schema"
```

---

## Task 19: End-to-End Verification

**Step 1: Run all tests**

```bash
npx vitest run
```
Expected: All tests pass

**Step 2: Build the app**

```bash
npx next build
```
Expected: Build succeeds with no errors

**Step 3: Verify new routes are accessible**

- `/privacy` -- renders without auth
- `/terms` -- renders without auth
- `/deletion-status/test-code` -- renders without auth
- `/client/zamora/settings` -- renders with auth

**Step 4: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address build and test issues from Meta OAuth integration"
```

---

## Summary of All New Files

```
src/lib/
  crypto.ts                          -- AES-256-GCM encrypt/decrypt
  crypto.test.ts                     -- Crypto tests
  meta-oauth.ts                      -- OAuth URL builder, token exchange, signed request verification
  meta-oauth.test.ts                 -- OAuth helper tests
  client-token.ts                    -- Per-client token lookup from client_accounts
  client-token.test.ts               -- Token lookup tests

src/app/api/meta/
  connect/route.ts                   -- Initiates OAuth redirect
  connect/finalize/route.ts          -- Finalizes multi-account selection
  callback/route.ts                  -- Handles Meta OAuth callback
  disconnect/route.ts                -- Revokes token + marks account revoked
  data-deletion/route.ts             -- Meta data deletion callback
  campaigns/route.ts                 -- Campaign creation (POST)
  campaigns/[id]/route.ts            -- Campaign update (PATCH)
  campaigns/[id]/status/route.ts     -- Campaign status toggle (POST)
  targeting/search/route.ts          -- Interest targeting autocomplete
  creatives/upload/route.ts          -- Image upload to Meta

src/app/client/[slug]/
  settings/page.tsx                  -- Connected accounts management
  settings/data.ts                   -- Fetch connected accounts
  settings/connected-accounts-list.tsx -- Client component for account list
  connect/page.tsx                   -- Ad account picker (multi-account)
  campaigns/new/page.tsx             -- Campaign creation wizard
  campaigns/new/wizard-steps.tsx     -- Wizard step components
  campaigns/new/use-wizard.ts        -- Wizard state management

src/app/
  privacy/page.tsx                   -- Privacy policy
  terms/page.tsx                     -- Terms of service
  deletion-status/[code]/page.tsx    -- Deletion status check

supabase/migrations/
  20260302_create_client_accounts.sql -- New table
```

## Modified Files

```
src/lib/env.ts                       -- New env vars (META_APP_ID, META_APP_SECRET, TOKEN_ENCRYPTION_KEY, NEXT_PUBLIC_APP_URL)
src/lib/api-schemas.ts               -- CampaignCreateSchema
src/proxy.ts                         -- Public route additions
src/app/client/[slug]/data.ts        -- Per-client token lookup
src/app/client/[slug]/components/client-nav.tsx -- Settings nav link
src/app/client/[slug]/campaigns/page.tsx -- Create Campaign button
.env.example                         -- New env var placeholders
src/lib/database.types.ts            -- Regenerated with client_accounts
```
