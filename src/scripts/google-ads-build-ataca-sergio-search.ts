import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

loadLocalEnv();

const { getGoogleAdsCredentials, googleAdsSearchStream, refreshGoogleAdsAccessToken } = await import(
  new URL("../lib/google-ads.ts", import.meta.url).href
);

interface GoogleAdsCredentialsLike {
  developerToken: string;
  loginCustomerId: string;
  customerId: string;
  apiVersion: string;
}

const FINAL_URL = "https://www.ticketmaster.com/festival-ataca-sergio-newark-new-jersey-05-30-2026/event/02006478E042F9B1";
const CAMPAIGN_NAME = "Ataca Sergio - Search - High Intent - 2026-04-08";
const DAILY_BUDGET_MICROS = 25_000_000;
const DEFAULT_CPC_BID_MICROS = 2_000_000;
const START_DATE = "20260408";
const END_DATE = "20260530";
const OUTPUT_PATH = resolve(process.cwd(), "../projects/meta ads manager wiki/outputs/ataca-sergio-google-search-build-2026-04-08.json");

const LOCATIONS = [
  { name: "New York", resourceName: "geoTargetConstants/21167", type: "State" },
  { name: "New Jersey", resourceName: "geoTargetConstants/21164", type: "State" },
  { name: "Philadelphia", resourceName: "geoTargetConstants/1025197", type: "City" },
] as const;

const AD_GROUPS = [
  {
    key: "brand",
    name: "Ataca Sergio - Brand",
    keywords: [
      { text: "ataca sergio tickets", matchType: "EXACT" },
      { text: "ataca sergio tickets", matchType: "PHRASE" },
      { text: "ataca sergio newark", matchType: "EXACT" },
      { text: "ataca sergio newark", matchType: "PHRASE" },
      { text: "festival ataca sergio", matchType: "EXACT" },
      { text: "festival ataca sergio", matchType: "PHRASE" },
      { text: "ataca sergio prudential center", matchType: "EXACT" },
      { text: "ataca sergio prudential center", matchType: "PHRASE" },
    ],
    headlines: [
      "Ataca Sergio Tickets",
      "Prudential Center May 30",
      "Festival Ataca Sergio",
      "Newark NJ Tickets",
      "Buy Official Tickets",
      "May 30 at Prudential",
      "Latin Music Live Newark",
      "Secure Your Seats Now",
    ],
    descriptions: [
      "Compra boletos oficiales para ATACA SERGIO en Prudential Center este 30 de mayo.",
      "Oscar D'Leon, La India, Huey Dunbar y mas en Newark. Compra tus boletos hoy.",
      "Festival latino en vivo con lineup fuerte. Entradas disponibles ahora.",
      "Buy official tickets now for ATACA SERGIO at Prudential Center in Newark.",
    ],
  },
  {
    key: "artists",
    name: "Ataca Sergio - Artists",
    keywords: [
      { text: "oscar d'leon tickets", matchType: "EXACT" },
      { text: "oscar d'leon tickets", matchType: "PHRASE" },
      { text: "oscar de leon tickets", matchType: "EXACT" },
      { text: "oscar de leon tickets", matchType: "PHRASE" },
      { text: "la india tickets", matchType: "EXACT" },
      { text: "la india tickets", matchType: "PHRASE" },
      { text: "huey dunbar tickets", matchType: "EXACT" },
      { text: "huey dunbar tickets", matchType: "PHRASE" },
      { text: "servando y florentino tickets", matchType: "EXACT" },
      { text: "servando y florentino tickets", matchType: "PHRASE" },
      { text: "oscar d'leon newark", matchType: "PHRASE" },
      { text: "la india newark", matchType: "PHRASE" },
      { text: "huey dunbar newark", matchType: "PHRASE" },
      { text: "servando y florentino newark", matchType: "PHRASE" },
    ],
    headlines: [
      "Oscar D'Leon in Newark",
      "La India in Newark",
      "Huey Dunbar Live",
      "Servando y Florentino",
      "Ataca Sergio Tickets",
      "May 30 Prudential Center",
      "Buy Tickets Today",
      "Festival Latino en Newark",
    ],
    descriptions: [
      "Busca boletos para Oscar D'Leon, La India, Huey Dunbar y mas en un solo show.",
      "ATACA SERGIO llega a Prudential Center el 30 de mayo. Compra boletos hoy.",
      "High-intent ticket buyers can secure seats now for the live Newark event.",
      "Official Ticketmaster event page. Compra entradas antes de que suba la demanda.",
    ],
  },
  {
    key: "venue",
    name: "Ataca Sergio - Venue",
    keywords: [
      { text: "prudential center may 30 concert", matchType: "EXACT" },
      { text: "prudential center may 30 concert", matchType: "PHRASE" },
      { text: "newark latin concert tickets", matchType: "EXACT" },
      { text: "newark latin concert tickets", matchType: "PHRASE" },
      { text: "prudential center latin concert", matchType: "EXACT" },
      { text: "prudential center latin concert", matchType: "PHRASE" },
      { text: "prudential center tickets may 30", matchType: "PHRASE" },
    ],
    headlines: [
      "Prudential Center May 30",
      "Newark Latin Music Event",
      "Ataca Sergio Tickets",
      "Buy Tickets for Newark",
      "Festival Ataca Sergio",
      "One Night in Newark",
      "Official Ticketmaster Page",
      "Secure Seats Today",
    ],
    descriptions: [
      "ATACA SERGIO en Prudential Center, Newark, este 30 de mayo. Compra boletos aqui.",
      "Lineup latino en vivo con fuerte demanda en NY, NJ y Philadelphia.",
      "Go straight to the official event page and secure your tickets now.",
      "Compra boletos antes del evento y asegura tu lugar para una sola noche.",
    ],
  },
] as const;

async function main() {
  const credentials = getGoogleAdsCredentials();
  const token = await refreshGoogleAdsAccessToken(credentials);

  const existingCampaign = await googleAdsSearchStream(
    [
      "SELECT",
      "  campaign.id,",
      "  campaign.name",
      "FROM campaign",
      `WHERE campaign.name = '${CAMPAIGN_NAME.replace(/'/g, "''")}'`,
      "LIMIT 1",
    ].join("\n"),
    {
      ...credentials,
      accessToken: token.accessToken,
    },
  );

  if (existingCampaign.rows.length > 0) {
    throw new Error(`Campaign already exists: ${CAMPAIGN_NAME}`);
  }

  const budgetName = `${CAMPAIGN_NAME} - Budget`;
  const budgetResponse = await mutate<{ results?: Array<{ resourceName?: string }> }>(
    credentials,
    token.accessToken,
    "campaignBudgets:mutate",
    {
      operations: [
        {
          create: {
            name: budgetName,
            amountMicros: DAILY_BUDGET_MICROS,
            deliveryMethod: "STANDARD",
            explicitlyShared: false,
          },
        },
      ],
    },
  );
  const budgetResourceName = budgetResponse.results?.[0]?.resourceName;
  if (!budgetResourceName) {
    throw new Error("Failed to create campaign budget");
  }

  const campaignResponse = await mutate<{ results?: Array<{ resourceName?: string }> }>(
    credentials,
    token.accessToken,
    "campaigns:mutate",
    {
      operations: [
        {
          create: {
            name: CAMPAIGN_NAME,
            status: "ENABLED",
            advertisingChannelType: "SEARCH",
            campaignBudget: budgetResourceName,
            manualCpc: {},
            networkSettings: {
              targetGoogleSearch: true,
              targetSearchNetwork: false,
              targetContentNetwork: false,
              targetPartnerSearchNetwork: false,
            },
            containsEuPoliticalAdvertising: "DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING",
            startDate: START_DATE,
            endDate: END_DATE,
          },
        },
      ],
    },
  );
  const campaignResourceName = campaignResponse.results?.[0]?.resourceName;
  if (!campaignResourceName) {
    throw new Error("Failed to create campaign");
  }

  const locationResponse = await mutate<{ results?: Array<{ resourceName?: string }> }>(
    credentials,
    token.accessToken,
    "campaignCriteria:mutate",
    {
      operations: LOCATIONS.map((location) => ({
        create: {
          campaign: campaignResourceName,
          location: {
            geoTargetConstant: location.resourceName,
          },
        },
      })),
    },
  );

  const adGroupResponse = await mutate<{ results?: Array<{ resourceName?: string }> }>(
    credentials,
    token.accessToken,
    "adGroups:mutate",
    {
      operations: AD_GROUPS.map((group) => ({
        create: {
          name: group.name,
          campaign: campaignResourceName,
          status: "ENABLED",
          type: "SEARCH_STANDARD",
          cpcBidMicros: DEFAULT_CPC_BID_MICROS,
        },
      })),
    },
  );

  const adGroupResources = AD_GROUPS.map((group, index) => {
    const resourceName = adGroupResponse.results?.[index]?.resourceName;
    if (!resourceName) {
      throw new Error(`Failed to create ad group: ${group.name}`);
    }
    return { ...group, resourceName };
  });

  const keywordResults: Array<{ adGroup: string; criteria: string[] }> = [];
  for (const group of adGroupResources) {
    const keywordResponse = await mutate<{ results?: Array<{ resourceName?: string }> }>(
      credentials,
      token.accessToken,
      "adGroupCriteria:mutate",
      {
        operations: group.keywords.map((keyword) => ({
          create: {
            adGroup: group.resourceName,
            status: "ENABLED",
            keyword: {
              text: keyword.text,
              matchType: keyword.matchType,
            },
          },
        })),
      },
    );

    keywordResults.push({
      adGroup: group.name,
      criteria: (keywordResponse.results ?? []).map((result) => result.resourceName ?? "").filter(Boolean),
    });
  }

  const adResults: Array<{ adGroup: string; ads: string[] }> = [];
  for (const group of adGroupResources) {
    const adResponse = await mutate<{ results?: Array<{ resourceName?: string }> }>(
      credentials,
      token.accessToken,
      "adGroupAds:mutate",
      {
        operations: [
          {
            create: {
              adGroup: group.resourceName,
              status: "ENABLED",
              ad: {
                finalUrls: [FINAL_URL],
                responsiveSearchAd: {
                  headlines: group.headlines.map((text) => ({ text })),
                  descriptions: group.descriptions.map((text) => ({ text })),
                  path1: "tickets",
                  path2: "newark",
                },
              },
            },
          },
        ],
      },
    );

    adResults.push({
      adGroup: group.name,
      ads: (adResponse.results ?? []).map((result) => result.resourceName ?? "").filter(Boolean),
    });
  }

  const artifact = {
    date: "2026-04-08",
    loginCustomerId: credentials.loginCustomerId,
    customerId: credentials.customerId,
    campaign: {
      name: CAMPAIGN_NAME,
      resourceName: campaignResourceName,
      dailyBudgetMicros: DAILY_BUDGET_MICROS,
      dailyBudgetUsd: DAILY_BUDGET_MICROS / 1_000_000,
      bidding: "MANUAL_CPC",
      startDate: START_DATE,
      endDate: END_DATE,
      finalUrl: FINAL_URL,
    },
    locations: LOCATIONS,
    budgetResourceName,
    adGroups: adGroupResources.map((group) => ({
      name: group.name,
      resourceName: group.resourceName,
      keywordCount: group.keywords.length,
      keywords: group.keywords,
      headlines: group.headlines,
      descriptions: group.descriptions,
    })),
    createdLocationCriteria: (locationResponse.results ?? []).map((result) => result.resourceName ?? "").filter(Boolean),
    createdKeywords: keywordResults,
    createdAds: adResults,
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(artifact, null, 2));
  console.log(JSON.stringify(artifact, null, 2));
}

main().catch((error) => {
  console.error("[google:ataca-sergio:search] failed");
  if (error instanceof Error) {
    console.error(error.message);
    const body = (error as { body?: unknown }).body;
    if (body) console.error(JSON.stringify(body, null, 2));
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});

async function mutate<T>(
  credentials: GoogleAdsCredentialsLike,
  accessToken: string,
  endpointPath: string,
  body: unknown,
): Promise<T> {
  const response = await fetch(
    `https://googleads.googleapis.com/${credentials.apiVersion}/customers/${credentials.customerId}/${endpointPath}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "developer-token": credentials.developerToken,
        "login-customer-id": credentials.loginCustomerId,
      },
      body: JSON.stringify(body),
    },
  );

  const text = await response.text();
  const parsed = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error = new Error(parsed?.error?.message ?? `Google Ads mutate failed at ${endpointPath}`) as Error & {
      status?: number;
      body?: unknown;
    };
    error.status = response.status;
    error.body = parsed;
    throw error;
  }

  return parsed as T;
}

function loadLocalEnv() {
  for (const fileName of [".env.local", ".env"]) {
    const filePath = resolve(process.cwd(), fileName);
    if (!existsSync(filePath)) continue;

    const content = readFileSync(filePath, "utf8");
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const separatorIndex = line.indexOf("=");
      if (separatorIndex === -1) continue;

      const key = line.slice(0, separatorIndex).trim();
      if (!key || process.env[key]) continue;

      let value = line.slice(separatorIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  }
}
