import { META_API_VERSION } from "@/lib/constants";

function getMetaCredentials() {
  const token = process.env.META_ACCESS_TOKEN;
  const rawAccountId = process.env.META_AD_ACCOUNT_ID;
  if (!token || !rawAccountId) throw new Error("Meta API credentials not configured");
  return { token, accountId: rawAccountId.replace(/^act_/, "") };
}

export async function syncCampaignStatus(campaignId: string, status: string) {
  const { token } = getMetaCredentials();
  const url = `https://graph.facebook.com/${META_API_VERSION}/${campaignId}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ access_token: token, status }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error?.message ?? "Meta API error: " + res.status);
  }
}

export async function syncCampaignBudget(campaignId: string, dailyBudgetCents: number) {
  const { token } = getMetaCredentials();
  const url = `https://graph.facebook.com/${META_API_VERSION}/${campaignId}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      access_token: token,
      daily_budget: String(dailyBudgetCents),
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error?.message ?? "Meta API error: " + res.status);
  }
}
