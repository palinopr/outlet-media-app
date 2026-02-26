/**
 * cron-sweeps.ts -- Per-agent scheduled sweeps.
 *
 * Migrated from discord-routines.ts with additions.
 * Each sweep creates an AgentTask for audit trail and uses the
 * existing routine lock pattern for execution.
 *
 * All jobs start OFF by default. Enable via !enable <job> in #schedule.
 */

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { state } from "../state.js";
import { runClaude } from "../runner.js";
import { enqueueTask, completeTask, failTask } from "../services/queue-service.js";

// Lazy imports to avoid circular deps
async function postToChannel(target: string, text: string): Promise<void> {
  const { notifyChannel } = await import("../discord.js");
  await notifyChannel(target, text);
}

async function postToFeed(text: string): Promise<void> {
  await postToChannel("agent-feed", text);
}

// --- Data Loaders ---

interface EventData {
  name: string;
  date: string;
  venue?: string;
  city?: string;
  artist?: string;
  tickets_sold?: number;
  tickets_total?: number;
  status?: string;
}

interface CampaignData {
  name: string;
  status?: string;
  effective_status?: string;
  daily_budget?: string;
  daily_budget_cents?: number;
  spend?: string;
  roas?: string;
  purchase_roas?: string;
}

async function loadEvents(): Promise<EventData[]> {
  const path = "session/last-events.json";
  if (!existsSync(path)) return [];
  try {
    const raw = await readFile(path, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as EventData[];
    if (
      parsed &&
      typeof parsed === "object" &&
      "data" in parsed &&
      Array.isArray((parsed as { data: unknown }).data)
    ) {
      return (parsed as { data: EventData[] }).data;
    }
    return [];
  } catch {
    return [];
  }
}

async function loadCampaigns(): Promise<CampaignData[]> {
  const path = "session/last-campaigns.json";
  if (!existsSync(path)) return [];
  try {
    const raw = await readFile(path, "utf-8");
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

function todayCST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
}

function yesterdayCST(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
}

function tomorrowCST(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
}

function categorizeEvents(events: EventData[]) {
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

function canRun(): boolean {
  return !state.jobRunning && !state.thinkRunning && !state.discordAdminRunning;
}

function campaignsSummary(campaigns: CampaignData[]): string {
  if (campaigns.length === 0) return "No campaign data available.";
  return campaigns
    .map((c) => {
      const status = c.effective_status || c.status || "unknown";
      const spend = c.spend ? `$${parseFloat(c.spend).toFixed(2)}` : "--";
      const budget = c.daily_budget
        ? `$${(parseFloat(c.daily_budget) / 100).toFixed(2)}/day`
        : c.daily_budget_cents
          ? `$${(c.daily_budget_cents / 100).toFixed(2)}/day`
          : "--";
      const roas = c.purchase_roas || c.roas || "--";
      return `- ${c.name}: ${status} | spend=${spend} budget=${budget} roas=${roas}`;
    })
    .join("\n");
}

function eventsSummary(events: EventData[], label: string): string {
  if (events.length === 0) return `No ${label} events.`;
  return events
    .map((ev) => {
      const tickets =
        ev.tickets_sold != null && ev.tickets_total != null
          ? ` | ${ev.tickets_sold}/${ev.tickets_total} tickets`
          : "";
      return `- ${ev.name} @ ${ev.venue || "TBD"}, ${ev.city || ""}${tickets}`;
    })
    .join("\n");
}

// --- Routine Lock ---

let routineRunning = false;

async function withRoutineLock(
  name: string,
  agentKey: string,
  fn: () => Promise<string>,
): Promise<void> {
  if (routineRunning || !canRun()) {
    console.log(`[sweeps] Skipping ${name} -- another task is running`);
    return;
  }
  routineRunning = true;
  state.jobRunning = true;

  const task = enqueueTask("scheduler", agentKey, name, {}, "green");

  console.log(`[sweeps] Starting ${name} (task ${task.id})`);
  await postToFeed(`>> **${name}** started`).catch(() => {});

  try {
    const result = await fn();
    completeTask(task.id, { text: result });
    await postToFeed(`ok **${name}** finished`).catch(() => {});
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    failTask(task.id, msg);
    console.error(`[sweeps] ${name} failed:`, msg);
    await postToFeed(`x **${name}** failed: ${msg.slice(0, 200)}`).catch(() => {});
  } finally {
    routineRunning = false;
    state.jobRunning = false;
  }
}

// --- Sweeps ---

async function morningBriefing(): Promise<void> {
  await withRoutineLock("Morning Briefing", "boss", async () => {
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

    const result = await runClaude({ prompt, systemPromptName: "boss", maxTurns: 5 });
    const text = result.text?.trim() || "";
    if (text) {
      await postToChannel(
        "morning-briefing",
        `**Morning Briefing -- ${todayCST()}**\n\n${text}`,
      );
      await postToChannel("boss", `Morning briefing posted to #morning-briefing.`);
    }
    return text;
  });
}

async function showDayAutomation(): Promise<void> {
  const events = await loadEvents();
  const { today } = categorizeEvents(events);
  if (today.length === 0) return;

  await withRoutineLock("Show-Day Automation", "media-buyer", async () => {
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
    const text = result.text?.trim() || "";
    if (text) {
      await postToChannel(
        "media-buyer",
        `**Show-Day Automation -- ${todayCST()}**\n\n${text}`,
      );
      await postToChannel(
        "boss",
        `Show-day automation ran for ${today.length} show(s). Check #media-buyer.`,
      );
    }
    return text;
  });
}

async function showDayMonitor(): Promise<void> {
  const events = await loadEvents();
  const { today } = categorizeEvents(events);
  if (today.length === 0) return;

  await withRoutineLock("Show-Day Monitor", "media-buyer", async () => {
    const campaigns = await loadCampaigns();
    const prompt = `You are the Media Buyer agent for Outlet Media. Today is ${todayCST()}.

SHOW-DAY MONITOR CHECK -- ${today.length} show(s) today:
${eventsSummary(today, "today's")}

CAMPAIGNS:
${campaignsSummary(campaigns)}

Check the spend pace for today's show campaigns:
1. Pull current daily spend from Meta API (use curl with META_ACCESS_TOKEN)
2. Compare spend to daily budget
3. If underpacing, flag it. If overpacing, flag it.
4. Report a brief status update

Ad account: act_787610255314938
Keep the response concise.`;

    const result = await runClaude({
      prompt,
      systemPromptName: "media-buyer",
      maxTurns: 15,
    });
    const text = result.text?.trim() || "";
    if (text) await postToChannel("media-buyer", `**Show-Day Monitor**\n\n${text}`);
    return text;
  });
}

async function postShowRecap(): Promise<void> {
  const events = await loadEvents();
  const { yesterday } = categorizeEvents(events);
  if (yesterday.length === 0) return;

  await withRoutineLock("Post-Show Recap", "reporting", async () => {
    const campaigns = await loadCampaigns();
    const prompt = `You are the Reporting agent for Outlet Media. Today is ${todayCST()}.

POST-SHOW RECAP -- ${yesterday.length} show(s) happened yesterday (${yesterdayCST()}):
${eventsSummary(yesterday, "yesterday's")}

CAMPAIGNS:
${campaignsSummary(campaigns)}

Generate a post-show recap:
1. Pull final spend numbers from Meta API for yesterday's date range
2. Pull ticket sale numbers if available
3. Calculate cost per ticket and ROAS
4. For each completed show campaign, pause it
5. Post a summary

Ad account: act_787610255314938
Format as a Discord message with bold headers.`;

    const result = await runClaude({
      prompt,
      systemPromptName: "reporting-agent",
      maxTurns: 25,
    });
    const text = result.text?.trim() || "";
    if (text) {
      await postToChannel(
        "boss",
        `**Post-Show Recap -- ${yesterdayCST()}**\n\n${text}`,
      );
      await postToChannel(
        "dashboard",
        `**Post-Show Recap -- ${yesterdayCST()}**\n\n${text}`,
      );
    }
    return text;
  });
}

async function weeklyReport(): Promise<void> {
  await withRoutineLock("Weekly Report", "reporting", async () => {
    const campaigns = await loadCampaigns();
    const events = await loadEvents();
    const prompt = `You are the Reporting agent for Outlet Media. Today is ${todayCST()} (Monday).

Generate the weekly performance report. Pull last 7 days of campaign data.
Ad account: act_787610255314938

CACHED CAMPAIGNS:
${campaignsSummary(campaigns)}

CACHED EVENTS:
${events.length > 0 ? events.map((e) => `- ${e.name} on ${e.date}`).join("\n") : "No event data cached."}

Format as a polished Discord message.`;

    const result = await runClaude({
      prompt,
      systemPromptName: "reporting-agent",
      maxTurns: 25,
    });
    const text = result.text?.trim() || "";
    if (text) {
      await postToChannel(
        "boss",
        `**Weekly Report -- Week of ${todayCST()}**\n\n${text}`,
      );
    }
    return text;
  });
}

async function creativeFatigueCheck(): Promise<void> {
  await withRoutineLock("Creative Fatigue Check", "creative", async () => {
    const campaigns = await loadCampaigns();
    const active = campaigns.filter(
      (c) => (c.effective_status || c.status || "").toLowerCase() === "active",
    );
    if (active.length === 0) return "";

    const prompt = `You are the Creative agent for Outlet Media. Today is ${todayCST()}.

CREATIVE FATIGUE CHECK for ${active.length} active campaign(s).
Pull ad-level insights from Meta API. Flag ads where CTR dropped >20%, frequency >3.0, or CPC increased >30%.
Ad account: act_787610255314938

ACTIVE CAMPAIGNS:
${campaignsSummary(active)}

Only report if you find actual fatigue signals.`;

    const result = await runClaude({
      prompt,
      systemPromptName: "creative-agent",
      maxTurns: 20,
    });
    const text = result.text?.trim() || "";
    if (text) {
      const hasFindings =
        !text.toLowerCase().includes("everything looks healthy") &&
        !text.toLowerCase().includes("no fatigue");
      if (hasFindings) {
        await postToChannel("creative", `**Creative Fatigue Alert**\n\n${text}`);
        await postToChannel("boss", `Creative fatigue detected -- check #creative.`);
      } else {
        await postToFeed(`Creative fatigue check: all healthy`);
      }
    }
    return text;
  });
}

async function budgetPacing(): Promise<void> {
  await withRoutineLock("Budget Pacing", "media-buyer", async () => {
    const campaigns = await loadCampaigns();
    const active = campaigns.filter(
      (c) => (c.effective_status || c.status || "").toLowerCase() === "active",
    );
    if (active.length === 0) return "";

    const hourStr = new Date().toLocaleTimeString("en-US", {
      timeZone: "America/Chicago",
      hour12: false,
      hour: "2-digit",
    });
    const hour = parseInt(hourStr, 10);
    const fraction = hour / 24;

    const prompt = `You are the Media Buyer agent. Today is ${todayCST()}, ~${hour}:00 CST.

BUDGET PACING CHECK. Expected spend fraction: ~${(fraction * 100).toFixed(0)}%.
Ad account: act_787610255314938

ACTIVE CAMPAIGNS:
${campaignsSummary(active)}

Keep response concise. Only flag actual pacing issues.`;

    const result = await runClaude({
      prompt,
      systemPromptName: "media-buyer",
      maxTurns: 15,
    });
    const text = result.text?.trim() || "";
    if (text) {
      const hasIssue =
        text.toLowerCase().includes("underpacing") ||
        text.toLowerCase().includes("overpacing");
      if (hasIssue) {
        await postToChannel("media-buyer", `**Budget Pacing Alert**\n\n${text}`);
        await postToChannel("boss", `Budget pacing issue -- check #media-buyer.`);
      } else {
        await postToFeed(`Budget pacing: all on track`);
      }
    }
    return text;
  });
}

// --- NEW SWEEPS (from design doc) ---

async function ticketVelocity(): Promise<void> {
  await withRoutineLock("Ticket Velocity", "tm-agent", async () => {
    const events = await loadEvents();
    const { today, tomorrow, upcoming } = categorizeEvents(events);
    const relevant = [...today, ...tomorrow, ...upcoming.slice(0, 5)];
    if (relevant.length === 0) return "";

    const prompt = `You are the TM Data agent for Outlet Media. Today is ${todayCST()}.

TICKET VELOCITY CHECK for ${relevant.length} upcoming event(s):
${eventsSummary(relevant, "relevant")}

Tasks:
1. Check ticket velocity trends -- are sales accelerating or slowing?
2. Flag any events approaching 80% capacity
3. Flag any events with unusually slow sales
4. Report a brief status update

Keep response concise.`;

    const result = await runClaude({
      prompt,
      systemPromptName: "tm-agent",
      maxTurns: 15,
    });
    const text = result.text?.trim() || "";
    if (text) {
      await postToChannel("tm-data", `**Ticket Velocity Check**\n\n${text}`);
      if (text.toLowerCase().includes("80%") || text.toLowerCase().includes("alert")) {
        await postToChannel("boss", `Ticket velocity alert -- check #tm-data.`);
      }
    }
    return text;
  });
}

async function clientPulse(): Promise<void> {
  await withRoutineLock("Client Pulse", "client-manager", async () => {
    const campaigns = await loadCampaigns();
    const events = await loadEvents();

    const prompt = `You are the Client Manager agent for Outlet Media. Today is ${todayCST()}.

CLIENT PULSE CHECK -- daily health check across all clients.

CAMPAIGNS:
${campaignsSummary(campaigns)}

EVENTS:
${events.length > 0 ? events.slice(0, 15).map((e) => `- ${e.name} on ${e.date}`).join("\n") : "No events cached."}

Tasks:
1. For each client (Zamora, Kybba), summarize: active campaigns, upcoming shows, any concerns
2. Flag if any client has no active campaigns but has upcoming shows
3. Flag if any client's ROAS is declining across campaigns
4. Suggest proactive outreach topics

Keep response concise and actionable.`;

    const result = await runClaude({
      prompt,
      systemPromptName: "client-manager",
      maxTurns: 10,
    });
    const text = result.text?.trim() || "";
    if (text) {
      await postToChannel("boss", `**Client Pulse -- ${todayCST()}**\n\n${text}`);
    }
    return text;
  });
}

async function bossSupervision(): Promise<void> {
  await withRoutineLock("Boss Supervision", "boss", async () => {
    const prompt = `You are the Boss agent for Outlet Media. Today is ${todayCST()}.

SUPERVISION CYCLE -- review all agent activity.

Read session/activity-log.json to see what agents have been doing.
Read memory files for each agent to understand their current state.

Tasks:
1. Identify any agents that haven't been active recently
2. Check for any failed tasks or errors
3. Look for coordination gaps between agents
4. Generate a brief health report

Keep response concise. Only flag actual issues.`;

    const result = await runClaude({ prompt, systemPromptName: "boss", maxTurns: 15 });
    const text = result.text?.trim() || "";
    if (text) {
      await postToChannel("boss", `**Supervision Report**\n\n${text}`);
    }
    return text;
  });
}

// --- Runner Registry ---

export function getSweepRunners(): Record<string, () => void> {
  return {
    "morning-briefing": () => {
      morningBriefing();
    },
    "show-day-check": () => {
      showDayAutomation();
    },
    "show-day-monitor": () => {
      showDayMonitor();
    },
    "post-show-recap": () => {
      postShowRecap();
    },
    "weekly-report": () => {
      weeklyReport();
    },
    "creative-fatigue": () => {
      creativeFatigueCheck();
    },
    "budget-pacing": () => {
      budgetPacing();
    },
    "ticket-velocity": () => {
      ticketVelocity();
    },
    "client-pulse": () => {
      clientPulse();
    },
    "boss-supervision": () => {
      bossSupervision();
    },
  };
}
