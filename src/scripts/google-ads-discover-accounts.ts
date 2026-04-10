import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

loadLocalEnv();

const rootCustomerIdArg = getCliValue("root") ?? getPositionalArg();

const googleAds = await import(new URL("../lib/google-ads.ts", import.meta.url).href) as typeof import("../lib/google-ads");
const {
  getGoogleAdsCredentials,
  googleAdsSearchStream,
  refreshGoogleAdsAccessToken,
  normalizeGoogleAdsCustomerId,
} = googleAds;

const credentials = getGoogleAdsCredentials();
const rootCustomerId = normalizeGoogleAdsCustomerId(rootCustomerIdArg ?? credentials.loginCustomerId);
const accessToken = (await refreshGoogleAdsAccessToken(credentials)).accessToken;

const visited = new Set<string>();
const managers: ManagerNode[] = [];
const leaves: LeafNode[] = [];

await walk(rootCustomerId, 0, null);

leaves.sort((a, b) => (b.last30d.costUsd ?? 0) - (a.last30d.costUsd ?? 0));

console.log(JSON.stringify({
  rootCustomerId,
  managers,
  leaves,
}, null, 2));

async function walk(customerId: string, depth: number, parentCustomerId: string | null) {
  const normalizedCustomerId = normalizeGoogleAdsCustomerId(customerId);
  if (visited.has(normalizedCustomerId)) return;
  visited.add(normalizedCustomerId);

  const customerRows = await googleAdsSearchStream<CustomerRow>([
    "SELECT",
    "  customer.id,",
    "  customer.descriptive_name,",
    "  customer.manager,",
    "  customer.currency_code,",
    "  customer.time_zone",
    "FROM customer",
    "LIMIT 1",
  ].join("\n"), {
    ...credentials,
    customerId: normalizedCustomerId,
    accessToken,
  });

  const customer = customerRows.rows[0]?.customer;
  if (!customer?.id) return;

  if (customer.manager) {
    const childRows = await googleAdsSearchStream<CustomerClientRow>([
      "SELECT",
      "  customer_client.client_customer,",
      "  customer_client.descriptive_name,",
      "  customer_client.manager,",
      "  customer_client.level,",
      "  customer_client.status",
      "FROM customer_client",
      "WHERE customer_client.level = 1",
      "ORDER BY customer_client.client_customer",
    ].join("\n"), {
      ...credentials,
      customerId: normalizedCustomerId,
      accessToken,
    });

    managers.push({
      customerId: normalizeGoogleAdsCustomerId(customer.id),
      descriptiveName: customer.descriptiveName ?? null,
      parentCustomerId,
      depth,
      childCount: childRows.rows.length,
    });

    for (const row of childRows.rows) {
      const childId = row.customerClient?.clientCustomer;
      if (!childId) continue;
      try {
        await walk(childId, depth + 1, normalizeGoogleAdsCustomerId(customer.id));
      } catch {
        // Ignore inaccessible / canceled branches during discovery.
      }
    }

    return;
  }

  const metricsRows = await googleAdsSearchStream<CustomerMetricsRow>([
    "SELECT",
    "  customer.id,",
    "  customer.descriptive_name,",
    "  metrics.impressions,",
    "  metrics.clicks,",
    "  metrics.cost_micros,",
    "  metrics.conversions",
    "FROM customer",
    "WHERE segments.date DURING LAST_30_DAYS",
  ].join("\n"), {
    ...credentials,
    customerId: normalizedCustomerId,
    accessToken,
  }).catch(() => ({ rows: [] as CustomerMetricsRow[] }));

  const metrics = metricsRows.rows[0]?.metrics;

  leaves.push({
    customerId: normalizeGoogleAdsCustomerId(customer.id),
    descriptiveName: customer.descriptiveName ?? null,
    parentCustomerId,
    depth,
    currencyCode: customer.currencyCode ?? null,
    timeZone: customer.timeZone ?? null,
    last30d: {
      impressions: numberOrNull(metrics?.impressions),
      clicks: numberOrNull(metrics?.clicks),
      costMicros: numberOrNull(metrics?.costMicros),
      costUsd: microsToUsd(numberOrNull(metrics?.costMicros)),
      conversions: numberOrNull(metrics?.conversions),
    },
  });
}

function numberOrNull(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function microsToUsd(value: number | null): number | null {
  return value === null ? null : value / 1_000_000;
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

function getCliValue(name: string): string | null {
  const prefix = `--${name}=`;
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith(prefix)) return arg.slice(prefix.length);
  }
  return null;
}

function getPositionalArg(): string | null {
  for (const arg of process.argv.slice(2)) {
    if (!arg.startsWith("--")) return arg;
  }
  return null;
}

type CustomerRow = {
  customer?: {
    id?: string;
    descriptiveName?: string;
    manager?: boolean;
    currencyCode?: string;
    timeZone?: string;
  };
};

type CustomerClientRow = {
  customerClient?: {
    clientCustomer?: string;
    descriptiveName?: string;
    manager?: boolean;
    level?: string | number;
    status?: string;
  };
};

type CustomerMetricsRow = {
  metrics?: {
    impressions?: string;
    clicks?: string;
    costMicros?: string;
    conversions?: string | number;
  };
};

type ManagerNode = {
  customerId: string;
  descriptiveName: string | null;
  parentCustomerId: string | null;
  depth: number;
  childCount: number;
};

type LeafNode = {
  customerId: string;
  descriptiveName: string | null;
  parentCustomerId: string | null;
  depth: number;
  currencyCode: string | null;
  timeZone: string | null;
  last30d: {
    impressions: number | null;
    clicks: number | null;
    costMicros: number | null;
    costUsd: number | null;
    conversions: number | null;
  };
};
