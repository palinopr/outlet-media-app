import { expect, test, type Page } from "@playwright/test";

const clerkSecretKey = process.env.E2E_CLERK_SECRET_KEY ?? process.env.CLERK_SECRET_KEY;
const baseURL = trimTrailingSlash(
  process.env.E2E_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000",
);
const clientPortalSlug = process.env.E2E_CLIENT_SLUG ?? "sienna";

type ClerkUser = {
  id: string;
};

type ClerkSignInToken = {
  url: string;
};

let tempUser: ClerkUser | null = null;

test.describe("authenticated production smoke", () => {
  test.skip(!clerkSecretKey, "Set E2E_CLERK_SECRET_KEY or CLERK_SECRET_KEY to run authenticated smoke tests.");

  test.beforeAll(async () => {
    tempUser = await createTemporaryAdminUser();
  });

  test.afterAll(async () => {
    if (tempUser) {
      await deleteClerkUser(tempUser.id);
      tempUser = null;
    }
  });

  test("admin and client surfaces stay narrow and usable", async ({ page }) => {
    if (!tempUser) throw new Error("Temporary Clerk admin user was not created.");

    await signInWithToken(page, tempUser.id);

    await expect(page).toHaveURL(/\/admin\/dashboard(?:[/?#]|$)/);
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

    await assertAdminNavigation(page);
    await assertSettingsIsTechnicalOnly(page);
    await assertClientsOwnClientCreation(page);
    await assertCampaignDetailIsPerformanceOnly(page);
    await assertClientPortalIsCampaignsOnly(page, clientPortalSlug);
    await assertRetiredRoutesRedirect(page, clientPortalSlug);
  });
});

async function signInWithToken(page: Page, userId: string) {
  const token = await clerkRequest<ClerkSignInToken>("/sign_in_tokens", {
    method: "POST",
    body: JSON.stringify({
      expires_in_seconds: 600,
      user_id: userId,
    }),
  });

  const signInUrl = rewriteUrlOrigin(token.url, baseURL);
  await page.goto(signInUrl, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/admin\/dashboard(?:[/?#]|$)/, { timeout: 45_000 });
  await page.waitForLoadState("networkidle").catch(() => undefined);
}

async function assertAdminNavigation(page: Page) {
  const desktopNav = page.locator("aside nav").first();
  await expect(desktopNav.getByRole("link")).toHaveText([
    "Dashboard",
    "Campaigns",
    "Clients",
    "Users",
    "Settings",
  ]);
  await expect(desktopNav).not.toContainText(/Agents|Events|Reports|Approvals|Requests|Conversations/i);
}

async function assertSettingsIsTechnicalOnly(page: Page) {
  await page.goto(appUrl("/admin/settings"), { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  await expect(page.getByText("Environment configuration and integration health")).toBeVisible();
  await expect(page.getByText("API keys", { exact: true })).toBeVisible();
  await expect(page.getByText("Meta account health", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /create client/i })).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText(/onboard|create client|new client|client creation form/i);
}

async function assertClientsOwnClientCreation(page: Page) {
  await page.goto(appUrl("/admin/clients"), { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Clients" })).toBeVisible();
  await expect(page.getByRole("button", { name: /create client/i })).toBeVisible();
  await expect(page.getByPlaceholder("Search clients...")).toBeVisible();
}

async function assertCampaignDetailIsPerformanceOnly(page: Page) {
  await page.goto(appUrl("/admin/campaigns"), { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Campaigns" })).toBeVisible();

  const firstCampaignLink = page.locator('table a[href^="/admin/campaigns/"]').first();
  await expect(firstCampaignLink).toBeVisible();
  await firstCampaignLink.click();

  await expect(page).toHaveURL(/\/admin\/campaigns\/[^/?#]+(?:[/?#]|$)/);
  const main = page.locator("main");
  await expect(main).toContainText("Campaign snapshot");
  await expect(main).toContainText("Spend");
  await expect(main).toContainText("ROAS");
  await expect(main).toContainText("Clicks");
  await expect(main).toContainText("Daily budget");
  await expect(main).not.toContainText(/Client requests|Approval requests|Approvals|Conversations|Action items|Creative review|review load/i);
}

async function assertClientPortalIsCampaignsOnly(page: Page, slug: string) {
  await page.goto(appUrl(`/client/${slug}`), { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(new RegExp(`/client/${slug}/campaigns(?:[/?#]|$)`));
  await expect(page.getByRole("heading", { name: new RegExp(`${slugToTitle(slug)} Campaigns`, "i") })).toBeVisible();

  const clientNav = page.getByLabel("Client navigation");
  await expect(clientNav.locator(`a[href="/client/${slug}/campaigns"]`)).toHaveText("Campaigns");
  await expect(clientNav.locator(`a[href^="/client/${slug}/"]`)).toHaveCount(1);
  await expect(clientNav).not.toContainText(/Events|Reports|Agent|Approvals|Requests|Conversations/i);
}

async function assertRetiredRoutesRedirect(page: Page, slug: string) {
  await page.goto(appUrl("/admin/events"), { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/admin\/dashboard(?:[/?#]|$)/);

  await page.goto(appUrl("/admin/events/e2e-retired-event"), { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/admin\/dashboard(?:[/?#]|$)/);

  await page.goto(appUrl("/admin/reports"), { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/admin\/dashboard(?:[/?#]|$)/);

  await page.goto(appUrl(`/client/${slug}/events`), { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(new RegExp(`/client/${slug}/campaigns(?:[/?#]|$)`));

  await page.goto(appUrl(`/client/${slug}/event/e2e-retired-event`), { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(new RegExp(`/client/${slug}/campaigns(?:[/?#]|$)`));

  await page.goto(appUrl(`/client/${slug}/reports`), { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(new RegExp(`/client/${slug}/campaigns(?:[/?#]|$)`));
}

async function createTemporaryAdminUser(): Promise<ClerkUser> {
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const email = `outlet-e2e-${stamp}@outletmedia.net`;
  const password = `OutletE2E-${stamp}-Pass!`;

  return clerkRequest<ClerkUser>("/users", {
    method: "POST",
    body: JSON.stringify({
      email_address: [email],
      first_name: "Outlet",
      last_name: "E2E",
      password,
      public_metadata: { role: "admin" },
      skip_password_checks: true,
    }),
  });
}

async function deleteClerkUser(userId: string) {
  await clerkRequest(`/users/${userId}`, { method: "DELETE" });
}

async function clerkRequest<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  if (!clerkSecretKey) throw new Error("Missing Clerk secret key for E2E smoke tests.");

  const response = await fetch(`https://api.clerk.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${clerkSecretKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Clerk API request failed (${response.status}): ${text}`);
  }
  return (text ? JSON.parse(text) : null) as T;
}

function appUrl(path: string) {
  return `${baseURL}${path}`;
}

function rewriteUrlOrigin(url: string, origin: string) {
  const nextUrl = new URL(url);
  const nextOrigin = new URL(origin);
  nextUrl.protocol = nextOrigin.protocol;
  nextUrl.host = nextOrigin.host;
  return nextUrl.toString();
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

function slugToTitle(slug: string) {
  return slug
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
