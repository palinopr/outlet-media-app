import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const staleDays = Number(process.env.DATA_AUDIT_STALE_SNAPSHOT_DAYS ?? "3");

if (!url || !key) {
  console.error("FAIL missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

const clientRules = [
  { keywords: ["arjona", "alofoke", "camila"], slug: "zamora" },
  { keywords: ["kybba"], slug: "kybba" },
  { keywords: ["beamina"], slug: "beamina" },
  { keywords: ["happy paws", "happy_paws"], slug: "happy_paws" },
  { keywords: ["don omar", "don_omar"], slug: "don_omar_bcn" },
  { keywords: ["distill", "destilado", "destilero"], slug: "distill_pr" },
  { keywords: ["vaz vil", "vaz_vil"], slug: "vaz_vil_enterprise" },
  { keywords: ["sienna"], slug: "sienna" },
  { keywords: ["9am", "9 am"], slug: "9am" },
  { keywords: ["outlet media"], slug: "outlet_media" },
  { keywords: ["chris r", "chris_r"], slug: "chris_r" },
  { keywords: ["proteccion final", "protección final"], slug: "proteccion_final" },
];

function guessClientSlug(campaignName) {
  const lower = String(campaignName ?? "").toLowerCase();
  const rule = clientRules.find((entry) => entry.keywords.some((keyword) => lower.includes(keyword)));
  return rule?.slug ?? null;
}

function toNumber(value) {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isWholeNonNegativeNumber(value) {
  const parsed = toNumber(value);
  return parsed == null || (Number.isInteger(parsed) && parsed >= 0);
}

function isNonNegativeFiniteNumber(value) {
  const parsed = toNumber(value);
  return parsed == null || parsed >= 0;
}

function daysBetween(isoDate) {
  if (!isoDate) return null;
  const time = new Date(`${isoDate}T00:00:00.000Z`).getTime();
  if (!Number.isFinite(time)) return null;
  return Math.floor((Date.now() - time) / 86_400_000);
}

function add(map, key) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function printGroup(label, rows, formatRow, limit = 20) {
  console.log(`${label}: ${rows.length}`);
  for (const row of rows.slice(0, limit)) {
    console.log(`  - ${formatRow(row)}`);
  }
  if (rows.length > limit) {
    console.log(`  ... ${rows.length - limit} more`);
  }
}

async function readTable(table, select, options = {}) {
  const pageSize = options.pageSize ?? 1000;
  const rows = [];
  const orderBy = (Array.isArray(options.orderBy) ? options.orderBy : [options.orderBy ?? "id"])
    .map((order) => (
      typeof order === "string"
        ? { ascending: true, column: order }
        : order
    ));

  for (let from = 0; ; from += pageSize) {
    let query = supabase
      .from(table)
      .select(select)
      .range(from, from + pageSize - 1);

    for (const order of orderBy) {
      query = query.order(order.column, { ascending: order.ascending });
    }

    const { data, error } = await query;
    if (error) throw new Error(`${table}: ${error.message}`);
    rows.push(...(data ?? []));
    if (!data || data.length < pageSize) return rows;
  }
}

const [
  clients,
  campaigns,
  snapshots,
  overrides,
  accounts,
  members,
] = await Promise.all([
  readTable("clients", "id, name, slug, status", { orderBy: "id" }),
  readTable("meta_campaigns", "campaign_id, name, status, client_slug, spend, roas, daily_budget", {
    orderBy: "campaign_id",
  }),
  readTable("campaign_snapshots", "campaign_id, snapshot_date", {
    orderBy: [
      { column: "snapshot_date", ascending: false },
      { column: "campaign_id", ascending: true },
    ],
  }),
  readTable("campaign_client_overrides", "campaign_id, client_slug", { orderBy: "campaign_id" }),
  readTable("client_accounts", "id, client_slug, status, token_expires_at", { orderBy: "id" }),
  readTable("client_members", "id, client_id", { orderBy: "id" }),
]);

const clientBySlug = new Map(clients.map((client) => [client.slug, client]));
const activeClients = clients.filter((client) => client.status === "active");
const activeClientSlugs = new Set(activeClients.map((client) => client.slug));
const overrideByCampaignId = new Map(overrides.map((override) => [override.campaign_id, override.client_slug]));
const campaignsByEffectiveSlug = new Map();
const snapshotByCampaignId = new Map();
const membersByClientId = new Map();
const accountsBySlug = new Map();
const healthyAccountsBySlug = new Map();

for (const snapshot of snapshots) {
  const previous = snapshotByCampaignId.get(snapshot.campaign_id);
  if (!previous || snapshot.snapshot_date > previous) {
    snapshotByCampaignId.set(snapshot.campaign_id, snapshot.snapshot_date);
  }
}

for (const member of members) add(membersByClientId, member.client_id);
const unhealthyAccounts = [];
for (const account of accounts) {
  const slug = account.client_slug ?? "unknown";
  add(accountsBySlug, slug);
  const expiresAt = account.token_expires_at ? new Date(account.token_expires_at).getTime() : NaN;
  const hasHealthyStatus = account.status === "active";
  const hasValidToken = Number.isFinite(expiresAt) && expiresAt > Date.now();
  if (hasHealthyStatus && hasValidToken) {
    add(healthyAccountsBySlug, slug);
  } else {
    unhealthyAccounts.push({
      ...account,
      issue: !hasHealthyStatus ? `status=${account.status}` : "token expired or invalid",
    });
  }
}

const activeOrPausedCampaigns = campaigns.filter((campaign) => (
  campaign.status === "ACTIVE" || campaign.status === "PAUSED"
));

const activeAssignmentIssues = [];
const pausedAssignmentIssues = [];
const moneyIssues = [];
const snapshotIssues = [];

for (const campaign of activeOrPausedCampaigns) {
  const guessedSlug = guessClientSlug(campaign.name);
  const effectiveSlug = overrideByCampaignId.get(campaign.campaign_id) ?? campaign.client_slug ?? guessedSlug;
  if (effectiveSlug) add(campaignsByEffectiveSlug, effectiveSlug);

  let assignmentIssue = null;
  if (!effectiveSlug || effectiveSlug === "unknown") {
    assignmentIssue = "missing effective client assignment";
  } else if (!clientBySlug.has(effectiveSlug)) {
    assignmentIssue = "client slug does not exist";
  } else if (!activeClientSlugs.has(effectiveSlug)) {
    assignmentIssue = "client is inactive";
  }

  if (assignmentIssue) {
    const row = { ...campaign, effectiveSlug, issue: assignmentIssue };
    if (campaign.status === "ACTIVE") {
      activeAssignmentIssues.push(row);
    } else {
      pausedAssignmentIssues.push(row);
    }
  }

  if (!isWholeNonNegativeNumber(campaign.spend)) {
    moneyIssues.push({ ...campaign, field: "spend", value: campaign.spend });
  }
  if (!isWholeNonNegativeNumber(campaign.daily_budget)) {
    moneyIssues.push({ ...campaign, field: "daily_budget", value: campaign.daily_budget });
  }
  if (!isNonNegativeFiniteNumber(campaign.roas)) {
    moneyIssues.push({ ...campaign, field: "roas", value: campaign.roas });
  }

  const latestSnapshot = snapshotByCampaignId.get(campaign.campaign_id) ?? null;
  const ageDays = daysBetween(latestSnapshot);
  if (ageDays == null) {
    snapshotIssues.push({ ...campaign, issue: "missing snapshot", latestSnapshot, ageDays });
  } else if (ageDays > staleDays) {
    snapshotIssues.push({ ...campaign, issue: `snapshot older than ${staleDays} days`, latestSnapshot, ageDays });
  }
}

const activeClientsWithZeroCampaigns = activeClients.filter((client) => (
  (campaignsByEffectiveSlug.get(client.slug) ?? 0) === 0
));
const activeClientsWithNoMembers = activeClients.filter((client) => (
  (membersByClientId.get(client.id) ?? 0) === 0
));
const activeClientsWithNoAccounts = activeClients.filter((client) => (
  (healthyAccountsBySlug.get(client.slug) ?? 0) === 0
));

console.log("Campaign Data Quality Audit");
console.log(`clients=${clients.length} active_clients=${activeClients.length}`);
console.log(`campaigns=${campaigns.length} active_or_paused_campaigns=${activeOrPausedCampaigns.length}`);
console.log(`snapshots=${snapshots.length} overrides=${overrides.length} client_accounts=${accounts.length} client_members=${members.length}`);
console.log("");

printGroup(
  "FIX NOW active campaign assignment issues",
  activeAssignmentIssues,
  (row) => `${row.campaign_id} status=${row.status} effective=${row.effectiveSlug ?? "null"} issue=${row.issue} name=${row.name}`,
);
printGroup(
  "WATCH paused campaign assignment issues",
  pausedAssignmentIssues,
  (row) => `${row.campaign_id} status=${row.status} effective=${row.effectiveSlug ?? "null"} issue=${row.issue} name=${row.name}`,
);
printGroup(
  "FIX NOW money shape issues",
  moneyIssues,
  (row) => `${row.campaign_id} field=${row.field} value=${row.value} name=${row.name}`,
);
printGroup(
  "WATCH stale or missing snapshots",
  snapshotIssues,
  (row) => `${row.campaign_id} status=${row.status} latest=${row.latestSnapshot ?? "none"} age_days=${row.ageDays ?? "n/a"} name=${row.name}`,
);
printGroup(
  "WATCH active clients with zero campaigns",
  activeClientsWithZeroCampaigns,
  (row) => `${row.slug} name=${row.name}`,
);
printGroup(
  "WATCH active clients with no portal members",
  activeClientsWithNoMembers,
  (row) => `${row.slug} name=${row.name}`,
);
printGroup(
  "WATCH active clients with no healthy connected Meta account rows",
  activeClientsWithNoAccounts,
  (row) => `${row.slug} name=${row.name} total_account_rows=${accountsBySlug.get(row.slug) ?? 0}`,
);
printGroup(
  "WATCH unhealthy connected Meta account rows",
  unhealthyAccounts,
  (row) => `${row.client_slug ?? "unknown"} account=${row.id} issue=${row.issue}`,
);

console.log("");
console.log("Read-only audit complete. Classify rows as fix now, watch, or intentional/inactive before making data changes.");
