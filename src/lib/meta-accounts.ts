export interface MetaAccountConfig {
  accountId: string;
  rawAccountId: string;
  clientSlug: string | null;
}

function normalizeAdAccountId(value: string) {
  return value.trim().replace(/^act_/, "");
}

function normalizeClientSlug(value: string) {
  const slug = value.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "");
  return slug.length > 0 ? slug : null;
}

function accountConfigFromEntry(entry: string): MetaAccountConfig | null {
  const trimmed = entry.trim();
  if (!trimmed) return null;

  const separator = trimmed.indexOf(":");
  const hasClientPrefix = separator > 0 && !trimmed.slice(0, separator).startsWith("act_");
  const clientSlug = hasClientPrefix ? normalizeClientSlug(trimmed.slice(0, separator)) : null;
  const rawAccount = hasClientPrefix ? trimmed.slice(separator + 1) : trimmed;
  const accountId = normalizeAdAccountId(rawAccount);

  if (!accountId) return null;
  return { accountId, rawAccountId: `act_${accountId}`, clientSlug };
}

function uniqueAccounts(accounts: MetaAccountConfig[]) {
  const seen = new Set<string>();
  return accounts.filter((account) => {
    if (seen.has(account.accountId)) return false;
    seen.add(account.accountId);
    return true;
  });
}

export function getMetaAccessToken() {
  return process.env.META_ACCESS_TOKEN;
}

export function getMetaAccountConfigs(): MetaAccountConfig[] {
  const explicitAccounts = process.env.META_AD_ACCOUNTS
    ?.split(",")
    .map(accountConfigFromEntry)
    .filter((account): account is MetaAccountConfig => Boolean(account));

  if (explicitAccounts?.length) return uniqueAccounts(explicitAccounts);

  const accountIds = process.env.META_AD_ACCOUNT_IDS
    ?.split(",")
    .map(accountConfigFromEntry)
    .filter((account): account is MetaAccountConfig => Boolean(account));

  if (accountIds?.length) return uniqueAccounts(accountIds);

  const fallback = process.env.META_AD_ACCOUNT_ID
    ? accountConfigFromEntry(process.env.META_AD_ACCOUNT_ID)
    : null;
  return fallback ? [fallback] : [];
}

export function getDefaultMetaAdAccountId() {
  return getMetaAccountConfigs()[0]?.rawAccountId ?? null;
}
