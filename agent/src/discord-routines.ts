/**
 * discord-routines.ts -- Autonomous proactive routines.
 *
 * These routines run on cron schedules and make the agents proactively
 * grow the company instead of waiting for Jaime to ask.
 *
 * Each routine builds a Claude prompt with relevant context, calls runClaude(),
 * and posts the result to the appropriate Discord channel.
 *
 * Architecture:
 *   - Each routine is an async function that returns void.
 *   - Routines check state locks before running (one Claude at a time).
 *   - Results are posted via notifyChannel() for text or direct channel.send() for embeds.
 *   - All routines are registered in getRoutineRunners() for scheduler.ts to wire up.
 *   - Jobs start OFF by default, enabled via `!enable <job>` in #schedule.
 */

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { state } from "./state.js";
import { runClaude } from "./runner.js";

// Lazy imports to avoid circular deps with discord.ts
async function postToChannel(target: string, text: string): Promise<void> {
  const { notifyChannel } = await import("./discord.js");
  await notifyChannel(target, text);
}

async function postToFeed(text: string): Promise<void> {
  await postToChannel("agent-feed", text);
}

// --- Shared Utilities -------------------------------------------------------

interface EventData {
  name: string;
  date: string;       // ISO date string or "YYYY-MM-DD"
  venue?: string;
  city?: string;
  artist?: string;
  tickets_sold?: number;
  tickets_total?: number;
  status?: string;
  tm1_id?: string;
}

interface CampaignData {
  id?: string;
  name: string;
  status?: string;
  effective_status?: string;
  daily_budget?: string;
  daily_budget_cents?: number;
  lifetime_budget?: string;
  spend?: string;
  impressions?: string;
  clicks?: string;
  ctr?: string;
  cpc?: string;
  roas?: string;
  purchase_roas?: string;
  reach?: string;
}

/**
 * Load events from session cache. Returns empty array if file missing.
 */
async function loadEvents(): Promise<EventData[]> {
  const path = "session/last-events.json";
  if (!existsSync(path)) return [];
  try {
    const raw = await readFile(path, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (parsed.data && Array.isArray(parsed.data)) return parsed.data;
    return [];
  } catch {
    return [];
  }
}

/**
 * Load campaigns from session cache. Returns empty array if file missing.
 */
async function loadCampaigns(): Promise<CampaignData[]> {
  const path = "session/last-campaigns.json";
  if (!existsSync(path)) return [];
  try {
    const raw = await readFile(path, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (parsed.data && Array.isArray(parsed.data)) return parsed.data;
    return [];
  } catch {
    return [];
  }
}

/**
 * Get today's date in CST (Central Time).
 * Returns YYYY-MM-DD string.
 */
function todayCST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
}

/**
 * Get yesterday's date in CST.
 */
function yesterdayCST(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
}

/**
 * Get tomorrow's date in CST.
 */
function tomorrowCST(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
}

/**
 * Categorize events by date relative to today (CST).
 */
function categorizeEvents(events: EventData[]): {
  today: EventData[];
  tomorrow: EventData[];
  yesterday: EventData[];
  upcoming: EventData[];
} {
  const t = todayCST();
  const y = yesterdayCST();
  const tm = tomorrowCST();

  const today: EventData[] = [];
  const tomorrow: EventData[] = [];
  const yesterday: EventData[] = [];
  const upcoming: EventData[] = [];

  for (const ev of events) {
    const d = ev.date?.slice(0, 10);
    if (d === t) today.push(ev);
    else if (d === tm) tomorrow.push(ev);
    else if (d === y) yesterday.push(ev);
    else if (d && d > t) upcoming.push(ev);
  }

  return { today, tomorrow, yesterday, upcoming };
}

/**
 * Check if another task is running. Returns true if safe to proceed.
 */
function canRun(): boolean {
  return !state.jobRunning && !state.thinkRunning && !state.discordAdminRunning;
}

/**
 * Format campaign data as a concise text block for injection into prompts.
 */
function campaignsSummary(campaigns: CampaignData[]): string {
  if (campaigns.length === 0) return "No campaign data available.";
  return campaigns.map(c => {
    const status = c.effective_status || c.status || "unknown";
    const spend = c.spend ? `$${parseFloat(c.spend).toFixed(2)}` : "--";
    const budget = c.daily_budget
      ? `$${(parseFloat(c.daily_budget) / 100).toFixed(2)}/day`
      : c.daily_budget_cents
        ? `$${(c.daily_budget_cents / 100).toFixed(2)}/day`
        : "--";
    const roas = c.purchase_roas || c.roas || "--";
    return `- ${c.name}: ${status} | spend=${spend} budget=${budget} roas=${roas}`;
  }).join("\n");
}

/**
 * Format event data as a text block for prompts.
 */
function eventsSummary(events: EventData[], label: string): string {
  if (events.length === 0) return `No ${label} events.`;
  return events.map(ev => {
    const tickets = ev.tickets_sold != null && ev.tickets_total != null
      ? ` | ${ev.tickets_sold}/${ev.tickets_total} tickets`
      : "";
    return `- ${ev.name} @ ${ev.venue || "TBD"}, ${ev.city || ""}${tickets}`;
  }).join("\n");
}

// --- Routine Lock -----------------------------------------------------------

let routineRunning = false;

async function withRoutineLock(
  name: string,
  fn: () => Promise<void>,
): Promise<void> {
  if (routineRunning || !canRun()) {
    console.log(`[routines] Skipping ${name} -- another task is running`);
    return;
  }
  routineRunning = true;
  state.jobRunning = true;
  console.log(`[routines] Starting ${name}`);
  await postToFeed(`>> **${name}** started`).catch(() => {});
  try {
    await fn();
    await postToFeed(`ok **${name}** finished`).catch(() => {});
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[routines] ${name} failed:`, msg);
    await postToFeed(`x **${name}** failed: ${msg.slice(0, 200)}`).catch(() => {});
  } finally {
    routineRunning = false;
    state.jobRunning = false;
  }
}

// --- 1. Morning Briefing (8am CST daily) ------------------------------------

async function morningBriefing(): Promise<void> {
  await withRoutineLock("Morning Briefing", async () => {
    const campaigns = await loadCampaigns();
    const events = await loadEvents();
    const { today, tomorrow, upcoming } = categorizeEvents(events);

    const prompt = `You are the Boss agent for Outlet Media. Today is ${todayCST()}.

Generate a concise morning briefing for Jaime. Cover:
1. Shows today (if any) -- call out urgency
2. Shows tomorrow (if any) -- prep needed
3. Active campaign status -- spend, ROAS, any concerns
4. Action items for today

DATA:

CAMPAIGNS:
${campaignsSummary(campaigns)}

TODAY'S SHOWS:
${eventsSummary(today, "today's")}

TOMORROW'S SHOWS:
${eventsSummary(tomorrow, "tomorrow's")}

UPCOMING (next 7 days):
${eventsSummary(upcoming.slice(0, 10), "upcoming")}

${events.length === 0 ? "NOTE: No event data cached. You may want to trigger a TM sync." : ""}

Format your response as a Discord message with bold headers and bullet points.
Keep it under 1500 characters. Be direct, no fluff.`;

    const result = await runClaude({
      prompt,
      systemPromptName: "boss",
      maxTurns: 5,
    });

    if (result.text?.trim()) {
      await postToChannel("boss", `**Morning Briefing -- ${todayCST()}**\n\n${result.text}`);
    }
  });
}

// --- 2. Show-Day Automation (9am CST, only if show today) -------------------

async function showDayAutomation(): Promise<void> {
  const events = await loadEvents();
  const { today } = categorizeEvents(events);

  if (today.length === 0) {
    console.log("[routines] No shows today -- skipping show-day automation");
    return;
  }

  await withRoutineLock("Show-Day Automation", async () => {
    const campaigns = await loadCampaigns();

    const prompt = `You are the Media Buyer agent for Outlet Media. Today is ${todayCST()}.

SHOW DAY -- there are ${today.length} show(s) today:
${eventsSummary(today, "today's")}

ACTIVE CAMPAIGNS:
${campaignsSummary(campaigns)}

Show-day tasks:
1. For each show today, identify the matching campaign by artist/event name
2. The campaign budget should be maxed to the spend cap for today
3. Ad creative messaging should switch to urgency: "ES HOY", "TONIGHT", "LAST CHANCE"
4. Report what changes you are making

Use curl to make actual Meta API calls to adjust budgets and ad status.
Ad account: act_787610255314938
Use the Meta access token from the environment variable META_ACCESS_TOKEN.

Report all changes to this channel. Be specific about what you changed.`;

    const result = await runClaude({
      prompt,
      systemPromptName: "media-buyer",
      maxTurns: 25,
    });

    if (result.text?.trim()) {
      await postToChannel("media-buyer", `**Show-Day Automation -- ${todayCST()}**\n\n${result.text}`);
      // Also notify boss
      await postToChannel("boss", `Show-day automation ran for ${today.length} show(s). Check #media-buyer for details.`);
    }
  });
}

// --- 3. Show-Day Monitor (every 2h, only on show days) ----------------------

async function showDayMonitor(): Promise<void> {
  const events = await loadEvents();
  const { today } = categorizeEvents(events);

  if (today.length === 0) {
    // Not a show day -- skip silently (no log spam)
    return;
  }

  await withRoutineLock("Show-Day Monitor", async () => {
    const campaigns = await loadCampaigns();

    const prompt = `You are the Media Buyer agent for Outlet Media. Today is ${todayCST()}.

SHOW-DAY MONITOR CHECK -- ${today.length} show(s) today:
${eventsSummary(today, "today's")}

CAMPAIGNS:
${campaignsSummary(campaigns)}

Check the spend pace for today's show campaigns:
1. Pull current daily spend from Meta API (use curl with META_ACCESS_TOKEN)
2. Compare spend to daily budget
3. If underpacing (spent less than expected for this time of day), flag it
4. If overpacing, flag it
5. Report a brief status update

Ad account: act_787610255314938

Keep the response concise -- this runs every 2 hours on show days.`;

    const result = await runClaude({
      prompt,
      systemPromptName: "media-buyer",
      maxTurns: 15,
    });

    if (result.text?.trim()) {
      await postToChannel("media-buyer", `**Show-Day Monitor**\n\n${result.text}`);
    }
  });
}

// --- 4. Post-Show Recap (9am CST, only if show was yesterday) ---------------

async function postShowRecap(): Promise<void> {
  const events = await loadEvents();
  const { yesterday } = categorizeEvents(events);

  if (yesterday.length === 0) {
    console.log("[routines] No shows yesterday -- skipping post-show recap");
    return;
  }

  await withRoutineLock("Post-Show Recap", async () => {
    const campaigns = await loadCampaigns();

    const prompt = `You are the Reporting agent for Outlet Media. Today is ${todayCST()}.

POST-SHOW RECAP -- ${yesterday.length} show(s) happened yesterday (${yesterdayCST()}):
${eventsSummary(yesterday, "yesterday's")}

CAMPAIGNS:
${campaignsSummary(campaigns)}

Generate a post-show recap:
1. Pull final spend numbers from Meta API for yesterday's date range (use curl with META_ACCESS_TOKEN)
2. Pull ticket sale numbers if available from the event data
3. Calculate cost per ticket and ROAS
4. For each completed show campaign, pause it (use curl to update campaign status to PAUSED)
5. Post a summary with:
   - Total spend
   - Tickets sold (if known)
   - Cost per ticket
   - ROAS
   - Whether campaign was paused

Ad account: act_787610255314938

Format as a Discord embed-style message with bold headers.`;

    const result = await runClaude({
      prompt,
      systemPromptName: "reporting-agent",
      maxTurns: 25,
    });

    if (result.text?.trim()) {
      // Post to boss and relevant client channels
      await postToChannel("boss", `**Post-Show Recap -- ${yesterdayCST()}**\n\n${result.text}`);
      await postToChannel("dashboard", `**Post-Show Recap -- ${yesterdayCST()}**\n\n${result.text}`);

      // Try to post to client channels based on event artist names
      for (const ev of yesterday) {
        const artist = (ev.artist || ev.name || "").toLowerCase();
        if (artist.includes("zamora") || artist.includes("alofoke")) {
          await postToChannel("zamora", `**Post-Show Recap -- ${ev.name}**\n\n${result.text}`);
        }
        if (artist.includes("kybba")) {
          await postToChannel("kybba", `**Post-Show Recap -- ${ev.name}**\n\n${result.text}`);
        }
      }
    }
  });
}

// --- 5. Weekly Report (Monday 9am CST) --------------------------------------

async function weeklyReport(): Promise<void> {
  await withRoutineLock("Weekly Report", async () => {
    const campaigns = await loadCampaigns();
    const events = await loadEvents();

    const prompt = `You are the Reporting agent for Outlet Media. Today is ${todayCST()} (Monday).

Generate the weekly performance report.

1. Pull last 7 days of campaign data from Meta API:
   - Use curl with META_ACCESS_TOKEN
   - Ad account: act_787610255314938
   - Time range: last 7 days
   - Get: spend, impressions, clicks, CTR, CPC, ROAS, conversions by campaign

2. Organize by client:
   - Zamora / Alofoke campaigns
   - Kybba campaigns
   - Any other active campaigns

3. For each client, include:
   - Total spend this week
   - Total impressions and clicks
   - Average ROAS
   - Top performing ad sets or markets
   - Shows that happened this week (from event data below)
   - Recommendations for next week

CACHED CAMPAIGNS:
${campaignsSummary(campaigns)}

CACHED EVENTS:
${events.length > 0 ? events.map(e => `- ${e.name} on ${e.date}`).join("\n") : "No event data cached."}

Format as a polished Discord message. Use bold headers, bullet points, and emoji sparingly.
This goes to Jaime as the weekly business summary.`;

    const result = await runClaude({
      prompt,
      systemPromptName: "reporting-agent",
      maxTurns: 25,
    });

    if (result.text?.trim()) {
      await postToChannel("boss", `**Weekly Report -- Week of ${todayCST()}**\n\n${result.text}`);
      // Post client-specific sections to their channels
      await postToChannel("zamora", `**Weekly Report**\n\n${result.text}`);
      await postToChannel("kybba", `**Weekly Report**\n\n${result.text}`);
    }
  });
}

// --- 6. Creative Fatigue Check (every 6h) -----------------------------------

async function creativeFatigueCheck(): Promise<void> {
  await withRoutineLock("Creative Fatigue Check", async () => {
    const campaigns = await loadCampaigns();

    const activeCampaigns = campaigns.filter(
      c => (c.effective_status || c.status || "").toLowerCase() === "active"
    );

    if (activeCampaigns.length === 0) {
      console.log("[routines] No active campaigns -- skipping fatigue check");
      return;
    }

    const prompt = `You are the Creative agent for Outlet Media. Today is ${todayCST()}.

CREATIVE FATIGUE CHECK for ${activeCampaigns.length} active campaign(s).

1. For each active campaign, pull ad-level insights from Meta API:
   - Use curl with META_ACCESS_TOKEN
   - Ad account: act_787610255314938
   - Get CTR, impressions, frequency for each ad over the last 7 days
   - Compare to the previous 7 days if possible

2. Flag any ads where:
   - CTR dropped more than 20% over the last 3 days
   - Frequency is above 3.0 (audience is seeing the same ad too often)
   - CPC increased by more than 30%

3. For flagged ads, recommend:
   - Whether to pause and replace the creative
   - What kind of new creative angle to try
   - Whether the audience needs refreshing

ACTIVE CAMPAIGNS:
${campaignsSummary(activeCampaigns)}

Only report if you find actual fatigue signals. If everything looks healthy, say so briefly.`;

    const result = await runClaude({
      prompt,
      systemPromptName: "creative-agent",
      maxTurns: 20,
    });

    if (result.text?.trim()) {
      // Only post to channels if there are actual findings
      const hasFindings = !result.text.toLowerCase().includes("everything looks healthy") &&
                          !result.text.toLowerCase().includes("no fatigue") &&
                          !result.text.toLowerCase().includes("all good");
      if (hasFindings) {
        await postToChannel("creative", `**Creative Fatigue Alert**\n\n${result.text}`);
        await postToChannel("boss", `Creative fatigue detected -- check #creative for details.`);
      } else {
        // Just log to feed, don't spam boss
        await postToFeed(`Creative fatigue check: all healthy`);
      }
    }
  });
}

// --- 7. Budget Pacing (every 4h) --------------------------------------------

async function budgetPacing(): Promise<void> {
  await withRoutineLock("Budget Pacing", async () => {
    const campaigns = await loadCampaigns();

    const activeCampaigns = campaigns.filter(
      c => (c.effective_status || c.status || "").toLowerCase() === "active"
    );

    if (activeCampaigns.length === 0) {
      console.log("[routines] No active campaigns -- skipping budget pacing");
      return;
    }

    const now = new Date().toLocaleTimeString("en-US", {
      timeZone: "America/Chicago",
      hour12: false,
      hour: "2-digit",
    });
    const hourOfDay = parseInt(now, 10);
    // Expected spend fraction: if it's 2pm (14h), we expect ~14/24 = 58% of daily budget spent
    const expectedFraction = hourOfDay / 24;

    const prompt = `You are the Media Buyer agent for Outlet Media. Today is ${todayCST()}, current time is approximately ${hourOfDay}:00 CST.

BUDGET PACING CHECK for ${activeCampaigns.length} active campaign(s).

1. Pull today's spend for each active campaign from Meta API:
   - Use curl with META_ACCESS_TOKEN
   - Ad account: act_787610255314938
   - Date range: today only (${todayCST()})

2. Compare each campaign's today-spend vs daily budget:
   - Expected spend fraction at this hour: ~${(expectedFraction * 100).toFixed(0)}%
   - Flag UNDERPACING if spend is less than ${((expectedFraction - 0.15) * 100).toFixed(0)}% of budget
   - Flag OVERPACING if spend is more than ${((expectedFraction + 0.15) * 100).toFixed(0)}% of budget

3. For flagged campaigns, suggest adjustments

ACTIVE CAMPAIGNS:
${campaignsSummary(activeCampaigns)}

Keep response concise. Only flag actual pacing issues. If all campaigns are on track, say so in one line.`;

    const result = await runClaude({
      prompt,
      systemPromptName: "media-buyer",
      maxTurns: 15,
    });

    if (result.text?.trim()) {
      const hasPacingIssue = result.text.toLowerCase().includes("underpacing") ||
                              result.text.toLowerCase().includes("overpacing") ||
                              result.text.toLowerCase().includes("flag");

      if (hasPacingIssue) {
        await postToChannel("media-buyer", `**Budget Pacing Alert**\n\n${result.text}`);
        await postToChannel("boss", `Budget pacing issue detected -- check #media-buyer.`);
      } else {
        await postToFeed(`Budget pacing check: all on track`);
      }
    }
  });
}

// --- Runner Registry --------------------------------------------------------

/**
 * Get all routine runner functions keyed by job name.
 * These are wired into scheduler.ts and discord-schedule.ts.
 */
export function getRoutineRunners(): Record<string, () => void> {
  return {
    "morning-briefing":   () => { morningBriefing(); },
    "show-day-check":     () => { showDayAutomation(); },
    "show-day-monitor":   () => { showDayMonitor(); },
    "post-show-recap":    () => { postShowRecap(); },
    "weekly-report":      () => { weeklyReport(); },
    "creative-fatigue":   () => { creativeFatigueCheck(); },
    "budget-pacing":      () => { budgetPacing(); },
  };
}
