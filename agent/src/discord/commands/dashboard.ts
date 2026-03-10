/**
 * discord-dashboard.ts -- Campaign status embed panel.
 *
 * Reads session/last-campaigns.json, builds a rich embed with campaign cards
 * (name, status, ROAS, spend, daily budget), and posts to #dashboard.
 *
 * Edits the message in-place on subsequent calls (stores message ID).
 * Triggered by `!dashboard` command, also callable after each Meta sync.
 */

import { EmbedBuilder, type Client, type TextChannel } from "discord.js";
import { readFile, writeFile } from "node:fs/promises";
import { dashboardButtons } from "../features/buttons.js";
import { toErrorMessage } from "../../utils/error-helpers.js";

const CAMPAIGNS_FILE = "session/last-campaigns.json";
const DASHBOARD_STATE_FILE = "session/dashboard-state.json";
const GUILD_ID = process.env.DISCORD_GUILD_ID;
const DASHBOARD_CHANNEL_NAME = "dashboard";

interface CampaignData {
  id?: string;
  name: string;
  status?: string;
  effective_status?: string;
  daily_budget?: string;
  lifetime_budget?: string;
  spend?: string;
  impressions?: string;
  clicks?: string;
  ctr?: string;
  cpc?: string;
  cpm?: string;
  roas?: string;
  purchase_roas?: string;
  conversions?: string;
  actions?: Array<{ action_type: string; value: string }>;
  insights?: { data?: Array<Record<string, unknown>> };
}

interface DashboardState {
  messageId: string | null;
  lastUpdated: string;
}

async function loadCampaigns(): Promise<CampaignData[]> {
  try {
    const raw = await readFile(CAMPAIGNS_FILE, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as CampaignData[];
    if (
      parsed &&
      typeof parsed === "object" &&
      "data" in parsed &&
      Array.isArray((parsed as { data: unknown }).data)
    ) {
      return (parsed as { data: CampaignData[] }).data;
    }
    return [];
  } catch {
    return [];
  }
}

async function loadDashboardState(): Promise<DashboardState> {
  try {
    const raw = await readFile(DASHBOARD_STATE_FILE, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && "messageId" in parsed) {
      return parsed as DashboardState;
    }
    return { messageId: null, lastUpdated: "" };
  } catch {
    return { messageId: null, lastUpdated: "" };
  }
}

async function saveDashboardState(state: DashboardState): Promise<void> {
  await writeFile(DASHBOARD_STATE_FILE, JSON.stringify(state, null, 2));
}

function formatCurrency(val: string | undefined): string {
  if (!val) return "--";
  const num = parseFloat(val);
  if (isNaN(num)) return val;
  return `$${num.toFixed(2)}`;
}

function formatNumber(val: string | undefined): string {
  if (!val) return "--";
  const num = parseInt(val, 10);
  if (isNaN(num)) return val;
  return num.toLocaleString();
}

function statusEmoji(status: string | undefined): string {
  if (!status) return "\u26aa"; // white circle
  const s = status.toLowerCase();
  if (s === "active") return "\ud83d\udfe2"; // green circle
  if (s === "paused") return "\ud83d\udfe1"; // yellow circle
  if (s.includes("deleted") || s.includes("archived")) return "\ud83d\udd34"; // red circle
  return "\u26aa";
}

/**
 * Build the dashboard embed from campaign data.
 */
function buildDashboardEmbed(campaigns: CampaignData[]): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle("Campaign Dashboard")
    .setColor(0x1976d2)
    .setTimestamp()
    .setFooter({ text: "Last updated" });

  if (campaigns.length === 0) {
    embed.setDescription(
      "No campaign data available.\n\n" +
      "Run `run meta sync` in #media-buyer to pull the latest data, " +
      "then run `!dashboard` again."
    );
    return embed;
  }

  // Totals
  let totalSpend = 0;
  let totalImpressions = 0;
  let totalClicks = 0;
  let activeCount = 0;

  for (const c of campaigns) {
    if (c.spend) totalSpend += parseFloat(c.spend) || 0;
    if (c.impressions) totalImpressions += parseInt(c.impressions, 10) || 0;
    if (c.clicks) totalClicks += parseInt(c.clicks, 10) || 0;
    const st = (c.effective_status || c.status || "").toLowerCase();
    if (st === "active") activeCount++;
  }

  embed.setDescription(
    `**${campaigns.length}** campaigns | **${activeCount}** active | ` +
    `Total spend: **$${totalSpend.toFixed(2)}** | ` +
    `Impressions: **${totalImpressions.toLocaleString()}** | ` +
    `Clicks: **${totalClicks.toLocaleString()}**`
  );

  // Individual campaign cards (max 25 fields in an embed)
  const displayCampaigns = campaigns.slice(0, 20);
  for (const c of displayCampaigns) {
    const st = c.effective_status || c.status || "unknown";
    const emoji = statusEmoji(st);
    const roas = c.purchase_roas || c.roas;

    const lines = [
      `Status: ${emoji} ${st}`,
      `Spend: ${formatCurrency(c.spend)} | Budget: ${formatCurrency(c.daily_budget || c.lifetime_budget)}/day`,
      `Impressions: ${formatNumber(c.impressions)} | Clicks: ${formatNumber(c.clicks)}`,
    ];

    if (roas) {
      const roasVal = parseFloat(roas);
      if (!isNaN(roasVal)) lines.push(`ROAS: **${roasVal.toFixed(2)}x**`);
    }
    if (c.ctr) {
      const ctrVal = parseFloat(c.ctr);
      if (!isNaN(ctrVal)) lines.push(`CTR: ${ctrVal.toFixed(2)}% | CPC: ${formatCurrency(c.cpc)}`);
    }

    embed.addFields({
      name: c.name || `Campaign ${c.id}`,
      value: lines.join("\n"),
      inline: false,
    });
  }

  if (campaigns.length > 20) {
    embed.addFields({
      name: "...",
      value: `+${campaigns.length - 20} more campaigns not shown`,
      inline: false,
    });
  }

  return embed;
}

/**
 * Find the #dashboard channel in the guild.
 */
async function findDashboardChannel(client: Client): Promise<TextChannel | null> {
  if (!GUILD_ID) {
    console.warn("[dashboard] DISCORD_GUILD_ID not set -- cannot find dashboard channel");
    return null;
  }
  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) return null;

  const channel = guild.channels.cache.find(
    (c) => c.name === DASHBOARD_CHANNEL_NAME && c.isTextBased()
  );

  return (channel as TextChannel) ?? null;
}

/**
 * Post or update the dashboard embed.
 * If a previous dashboard message exists, edit it in-place.
 * Otherwise, send a new message and save its ID.
 */
export async function updateDashboard(client: Client): Promise<string> {
  const campaigns = await loadCampaigns();
  const embed = buildDashboardEmbed(campaigns);
  const channel = await findDashboardChannel(client);

  if (!channel) {
    return "Could not find #dashboard channel.";
  }

  const dashState = await loadDashboardState();

  // Try to edit existing message
  if (dashState.messageId) {
    try {
      const existing = await channel.messages.fetch(dashState.messageId);
      await existing.edit({ embeds: [embed], components: [dashboardButtons()] });
      dashState.lastUpdated = new Date().toISOString();
      await saveDashboardState(dashState);
      return `Dashboard updated (edited message ${dashState.messageId}).`;
    } catch {
      // Message was deleted or not found -- send new one
    }
  }

  // Send new message with action buttons
  const sent = await channel.send({ embeds: [embed], components: [dashboardButtons()] });
  dashState.messageId = sent.id;
  dashState.lastUpdated = new Date().toISOString();
  await saveDashboardState(dashState);

  return `Dashboard posted (new message ${sent.id}).`;
}

/**
 * Handle the !dashboard command from discord.ts.
 */
export async function handleDashboardCommand(
  client: Client,
): Promise<{ text: string; embed?: EmbedBuilder }> {
  try {
    const result = await updateDashboard(client);
    return { text: result };
  } catch (err) {
    const msg = toErrorMessage(err);
    return { text: `Dashboard update failed: ${msg}` };
  }
}
