export const GOOGLE_ADS_API_VERSION = "v22";

export interface GoogleAdsCredentials {
  developerToken: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  loginCustomerId: string;
  customerId: string;
  apiVersion: string;
}

export interface GoogleAdsAccessToken {
  accessToken: string;
  expiresIn: number;
  scope: string | null;
  tokenType: string | null;
  refreshTokenExpiresIn: number | null;
}

export interface GoogleAdsSearchStreamChunk<Row extends object> {
  results?: Row[];
  fieldMask?: string;
  requestId?: string;
  summaryRow?: Row;
  queryResourceConsumption?: string;
}

export interface GoogleAdsSearchStreamResult<Row extends object> {
  rows: Row[];
  fieldMask: string | null;
  requestId: string | null;
  summaryRow: Row | null;
  queryResourceConsumption: number | null;
  chunks: GoogleAdsSearchStreamChunk<Row>[];
}

export interface GoogleAdsSearchOptions extends Partial<GoogleAdsCredentials> {
  accessToken?: string;
}

interface GoogleAdsTokenResponse {
  access_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  refresh_token_expires_in?: number | string;
  error?: string | { message?: string };
  error_description?: string;
}

interface GoogleAdsApiErrorBody {
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
  message?: string;
}

interface GoogleAdsCustomerQueryRow {
  customer?: {
    resourceName?: string;
    id?: string;
    descriptiveName?: string;
    manager?: boolean;
    currencyCode?: string;
    timeZone?: string;
  };
}

interface GoogleAdsChildAccountQueryRow {
  customerClient?: {
    clientCustomer?: string;
    descriptiveName?: string;
    manager?: boolean;
    level?: number | string;
    status?: string;
    currencyCode?: string;
    timeZone?: string;
    hidden?: boolean;
  };
}

interface GoogleAdsCampaignQueryRow {
  campaign?: {
    id?: string;
    name?: string;
    status?: string;
    advertisingChannelType?: string;
  };
  metrics?: {
    impressions?: string;
    clicks?: string;
    costMicros?: string;
    conversions?: number | string;
  };
}

export interface GoogleAdsCustomerSnapshot {
  customerId: string;
  descriptiveName: string | null;
  manager: boolean;
  currencyCode: string | null;
  timeZone: string | null;
}

export interface GoogleAdsChildAccountSnapshot {
  customerId: string;
  descriptiveName: string | null;
  manager: boolean;
  level: number | null;
  status: string | null;
  currencyCode: string | null;
  timeZone: string | null;
  hidden: boolean;
}

export interface GoogleAdsCampaignSnapshot {
  campaignId: string;
  name: string | null;
  status: string | null;
  advertisingChannelType: string | null;
  impressions: number | null;
  clicks: number | null;
  costMicros: number | null;
  costUsd: number | null;
  conversions: number | null;
}

export interface GoogleAdsFirstReadSnapshot {
  apiVersion: string;
  loginCustomerId: string;
  customerId: string;
  tokenScope: string | null;
  tokenExpiresIn: number;
  refreshTokenExpiresIn: number | null;
  customer: GoogleAdsCustomerSnapshot | null;
  childAccounts: GoogleAdsChildAccountSnapshot[];
  topCampaignsLast30Days: GoogleAdsCampaignSnapshot[];
  requestIds: {
    customer: string | null;
    childAccounts: string | null;
    topCampaignsLast30Days: string | null;
  };
}

export class GoogleAdsApiError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "GoogleAdsApiError";
    this.status = status;
    this.body = body;
  }
}

export function normalizeGoogleAdsCustomerId(value: string): string {
  return value.trim().replace(/^customers\//, "").replace(/-/g, "");
}

export function googleAdsSearchStreamUrl(customerId: string, apiVersion = GOOGLE_ADS_API_VERSION): string {
  const normalizedCustomerId = normalizeGoogleAdsCustomerId(customerId);
  return `https://googleads.googleapis.com/${apiVersion}/customers/${normalizedCustomerId}/googleAds:searchStream`;
}

export function getGoogleAdsCredentials(overrides: Partial<GoogleAdsCredentials> = {}): GoogleAdsCredentials {
  const developerToken = overrides.developerToken ?? process.env.GOOGLE_ADS_DEVELOPER_TOKEN ?? "";
  const clientId = overrides.clientId ?? process.env.GOOGLE_ADS_CLIENT_ID ?? "";
  const clientSecret = overrides.clientSecret ?? process.env.GOOGLE_ADS_CLIENT_SECRET ?? "";
  const refreshToken = overrides.refreshToken ?? process.env.GOOGLE_ADS_REFRESH_TOKEN ?? "";
  const rawCustomerId = overrides.customerId ?? process.env.GOOGLE_ADS_CUSTOMER_ID ?? process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID ?? "";
  const rawLoginCustomerId = overrides.loginCustomerId ?? process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID ?? rawCustomerId;
  const customerId = normalizeGoogleAdsCustomerId(rawCustomerId);
  const loginCustomerId = normalizeGoogleAdsCustomerId(rawLoginCustomerId);
  const apiVersion = overrides.apiVersion ?? GOOGLE_ADS_API_VERSION;

  const missing = [
    ["GOOGLE_ADS_DEVELOPER_TOKEN", developerToken],
    ["GOOGLE_ADS_CLIENT_ID", clientId],
    ["GOOGLE_ADS_CLIENT_SECRET", clientSecret],
    ["GOOGLE_ADS_REFRESH_TOKEN", refreshToken],
    ["GOOGLE_ADS_CUSTOMER_ID", customerId],
  ].filter(([, value]) => !value).map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing Google Ads configuration: ${missing.join(", ")}`);
  }

  return {
    developerToken,
    clientId,
    clientSecret,
    refreshToken,
    loginCustomerId: loginCustomerId || customerId,
    customerId,
    apiVersion,
  };
}

export async function refreshGoogleAdsAccessToken(
  overrides: Partial<GoogleAdsCredentials> = {},
): Promise<GoogleAdsAccessToken> {
  const credentials = getGoogleAdsCredentials(overrides);
  const body = new URLSearchParams({
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    refresh_token: credentials.refreshToken,
    grant_type: "refresh_token",
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const parsed = await parseJsonResponse<GoogleAdsTokenResponse>(response);
  if (!response.ok || !parsed?.access_token) {
    throw new GoogleAdsApiError(
      getGoogleAdsErrorMessage(parsed) || "Failed to refresh Google Ads access token",
      response.status,
      parsed,
    );
  }

  return {
    accessToken: parsed.access_token,
    expiresIn: parsed.expires_in ?? 0,
    scope: parsed.scope ?? null,
    tokenType: parsed.token_type ?? null,
    refreshTokenExpiresIn: toNumber(parsed.refresh_token_expires_in),
  };
}

export function flattenGoogleAdsSearchStream<Row extends object>(
  payload: unknown,
): GoogleAdsSearchStreamResult<Row> {
  if (!Array.isArray(payload)) {
    throw new Error("Google Ads searchStream response was not an array");
  }

  const chunks = payload as GoogleAdsSearchStreamChunk<Row>[];
  const rows: Row[] = [];
  let fieldMask: string | null = null;
  let requestId: string | null = null;
  let summaryRow: Row | null = null;
  let queryResourceConsumption: number | null = null;

  for (const chunk of chunks) {
    if (chunk.results) rows.push(...chunk.results);
    if (!fieldMask && chunk.fieldMask) fieldMask = chunk.fieldMask;
    if (!requestId && chunk.requestId) requestId = chunk.requestId;
    if (!summaryRow && chunk.summaryRow) summaryRow = chunk.summaryRow;
    if (queryResourceConsumption === null && chunk.queryResourceConsumption) {
      queryResourceConsumption = toNumber(chunk.queryResourceConsumption);
    }
  }

  return {
    rows,
    fieldMask,
    requestId,
    summaryRow,
    queryResourceConsumption,
    chunks,
  };
}

export async function googleAdsSearchStream<Row extends object>(
  query: string,
  options: GoogleAdsSearchOptions = {},
): Promise<GoogleAdsSearchStreamResult<Row>> {
  const credentials = getGoogleAdsCredentials(options);
  const accessToken = options.accessToken ?? (await refreshGoogleAdsAccessToken(credentials)).accessToken;
  const response = await fetch(googleAdsSearchStreamUrl(credentials.customerId, credentials.apiVersion), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "developer-token": credentials.developerToken,
      "login-customer-id": credentials.loginCustomerId,
    },
    body: JSON.stringify({ query }),
  });

  const parsed = await parseJsonResponse<GoogleAdsSearchStreamChunk<Row>[] | GoogleAdsApiErrorBody>(response);
  if (!response.ok) {
    throw new GoogleAdsApiError(
      getGoogleAdsErrorMessage(parsed) || "Google Ads searchStream request failed",
      response.status,
      parsed,
    );
  }

  return flattenGoogleAdsSearchStream<Row>(parsed);
}

export async function fetchGoogleAdsFirstReadSnapshot(
  overrides: Partial<GoogleAdsCredentials> = {},
): Promise<GoogleAdsFirstReadSnapshot> {
  const credentials = getGoogleAdsCredentials(overrides);
  const token = await refreshGoogleAdsAccessToken(credentials);

  const customerQuery = [
    "SELECT",
    "  customer.id,",
    "  customer.descriptive_name,",
    "  customer.manager,",
    "  customer.currency_code,",
    "  customer.time_zone",
    "FROM customer",
    "LIMIT 1",
  ].join("\n");

  const customerResponse = await googleAdsSearchStream<GoogleAdsCustomerQueryRow>(customerQuery, {
    ...credentials,
    accessToken: token.accessToken,
  });

  const customer = mapGoogleAdsCustomer(customerResponse.rows[0]?.customer, credentials.customerId);

  let childAccounts: GoogleAdsChildAccountSnapshot[] = [];
  let childAccountsRequestId: string | null = null;
  let topCampaignsLast30Days: GoogleAdsCampaignSnapshot[] = [];
  let topCampaignsRequestId: string | null = null;

  if (customer?.manager) {
    const childAccountsQuery = [
      "SELECT",
      "  customer_client.client_customer,",
      "  customer_client.descriptive_name,",
      "  customer_client.manager,",
      "  customer_client.level,",
      "  customer_client.status,",
      "  customer_client.currency_code,",
      "  customer_client.time_zone,",
      "  customer_client.hidden",
      "FROM customer_client",
      "WHERE customer_client.level <= 1",
      "ORDER BY customer_client.level, customer_client.client_customer",
      "LIMIT 50",
    ].join("\n");

    const childAccountsResponse = await googleAdsSearchStream<GoogleAdsChildAccountQueryRow>(childAccountsQuery, {
      ...credentials,
      customerId: customer.customerId,
      accessToken: token.accessToken,
    });

    childAccountsRequestId = childAccountsResponse.requestId;
    childAccounts = childAccountsResponse.rows
      .map((row) => mapGoogleAdsChildAccount(row.customerClient))
      .filter((row): row is GoogleAdsChildAccountSnapshot => row !== null);
  } else {
    const campaignsQuery = [
      "SELECT",
      "  campaign.id,",
      "  campaign.name,",
      "  campaign.status,",
      "  campaign.advertising_channel_type,",
      "  metrics.impressions,",
      "  metrics.clicks,",
      "  metrics.cost_micros,",
      "  metrics.conversions",
      "FROM campaign",
      "WHERE segments.date DURING LAST_30_DAYS",
      "ORDER BY metrics.cost_micros DESC",
      "LIMIT 10",
    ].join("\n");

    const campaignsResponse = await googleAdsSearchStream<GoogleAdsCampaignQueryRow>(campaignsQuery, {
      ...credentials,
      customerId: customer?.customerId ?? credentials.customerId,
      accessToken: token.accessToken,
    });

    topCampaignsRequestId = campaignsResponse.requestId;
    topCampaignsLast30Days = campaignsResponse.rows
      .map((row) => mapGoogleAdsCampaign(row))
      .filter((row): row is GoogleAdsCampaignSnapshot => row !== null);
  }

  return {
    apiVersion: credentials.apiVersion,
    loginCustomerId: credentials.loginCustomerId,
    customerId: customer?.customerId ?? credentials.customerId,
    tokenScope: token.scope,
    tokenExpiresIn: token.expiresIn,
    refreshTokenExpiresIn: token.refreshTokenExpiresIn,
    customer,
    childAccounts,
    topCampaignsLast30Days,
    requestIds: {
      customer: customerResponse.requestId,
      childAccounts: childAccountsRequestId,
      topCampaignsLast30Days: topCampaignsRequestId,
    },
  };
}

function mapGoogleAdsCustomer(
  customer: GoogleAdsCustomerQueryRow["customer"] | undefined,
  fallbackCustomerId: string,
): GoogleAdsCustomerSnapshot | null {
  if (!customer) return null;
  return {
    customerId: normalizeGoogleAdsCustomerId(customer.id ?? customer.resourceName ?? fallbackCustomerId),
    descriptiveName: customer.descriptiveName ?? null,
    manager: Boolean(customer.manager),
    currencyCode: customer.currencyCode ?? null,
    timeZone: customer.timeZone ?? null,
  };
}

function mapGoogleAdsChildAccount(
  customerClient: GoogleAdsChildAccountQueryRow["customerClient"] | undefined,
): GoogleAdsChildAccountSnapshot | null {
  if (!customerClient?.clientCustomer) return null;
  return {
    customerId: normalizeGoogleAdsCustomerId(customerClient.clientCustomer),
    descriptiveName: customerClient.descriptiveName ?? null,
    manager: Boolean(customerClient.manager),
    level: toNumber(customerClient.level),
    status: customerClient.status ?? null,
    currencyCode: customerClient.currencyCode ?? null,
    timeZone: customerClient.timeZone ?? null,
    hidden: Boolean(customerClient.hidden),
  };
}

function mapGoogleAdsCampaign(row: GoogleAdsCampaignQueryRow): GoogleAdsCampaignSnapshot | null {
  if (!row.campaign?.id) return null;
  const costMicros = toNumber(row.metrics?.costMicros);
  return {
    campaignId: row.campaign.id,
    name: row.campaign.name ?? null,
    status: row.campaign.status ?? null,
    advertisingChannelType: row.campaign.advertisingChannelType ?? null,
    impressions: toNumber(row.metrics?.impressions),
    clicks: toNumber(row.metrics?.clicks),
    costMicros,
    costUsd: costMicros === null ? null : costMicros / 1_000_000,
    conversions: toNumber(row.metrics?.conversions),
  };
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function getGoogleAdsErrorMessage(body: unknown): string | null {
  if (!body) return null;
  if (typeof body === "string") return body;
  if (typeof body !== "object") return null;

  const tokenBody = body as GoogleAdsTokenResponse;
  if (typeof tokenBody.error_description === "string") return tokenBody.error_description;
  if (typeof tokenBody.error === "string") return tokenBody.error;
  if (tokenBody.error && typeof tokenBody.error === "object" && typeof tokenBody.error.message === "string") {
    return tokenBody.error.message;
  }

  const apiBody = body as GoogleAdsApiErrorBody;
  if (typeof apiBody.message === "string") return apiBody.message;
  if (apiBody.error?.message) return apiBody.error.message;

  return null;
}

async function parseJsonResponse<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
