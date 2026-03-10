/**
 * cron-sweeps.ts -- Per-agent scheduled sweeps.
 *
 * Migrated from discord-routines.ts with additions.
 * Each sweep creates an AgentTask for audit trail and uses the
 * existing routine lock pattern for execution.
 *
 * All jobs start OFF by default. Enable via !enable <job> in #schedule.
 */

import { isAgentBusy, setAgentBusy, clearAgentBusy } from "../state.js";
import { runClaude } from "../runner.js";
import { enqueueTask, completeTask, failTask } from "../services/queue-service.js";
import { todayCST, yesterdayCST } from "../utils/date-helpers.js";
import { loadEvents, loadCampaigns, categorizeEvents } from "../utils/session-loader.js";
import { campaignsSummary, eventsSummary } from "../utils/prompt-formatters.js";

const META_AD_ACCOUNT = process.env.META_AD_ACCOUNT_ID ?? "act_787610255314938";

// Lazy imports to avoid circular deps
async function postToChannel(target: string, text: string, agentKey?: string): Promise<void> {
  if (agentKey && target !== "agent-feed") {
    const { sendAsAgent } = await import("../services/webhook-service.js");
    await sendAsAgent(agentKey, target, text);
    return;
  }
  const { notifyChannel } = await import("../discord/core/entry.js");
  await notifyChannel(target, text);
}

async function postToFeed(text: string): Promise<void> {
  await postToChannel("agent-feed", text);
}

// --- Routine Lock ---

async function withRoutineLock(
  name: string,
  agentKey: string,
  fn: () => Promise<string>,
): Promise<void> {
  const lockId = `sweep:${name.toLowerCase().replace(/\s+/g, "-")}`;
  if (isAgentBusy(lockId)) {
    console.log(`[sweeps] Skipping ${name} -- ${lockId} is already running`);
    return;
  }
  setAgentBusy(lockId);

  const task = enqueueTask("scheduler", agentKey, name, {}, "green");

  console.log(`[sweeps] Starting ${name} (task ${task.id})`);
  await postToFeed(`>> **${name}** started`);

  try {
    const result = await fn();
    completeTask(task.id, { text: result });
    await postToFeed(`ok **${name}** finished`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    failTask(task.id, msg);
    console.error(`[sweeps] ${name} failed:`, msg);
    await postToFeed(`x **${name}** failed: ${msg.slice(0, 200)}`);
  } finally {
    clearAgentBusy(lockId);
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
      await Promise.all([
        postToChannel("morning-briefing", `**Morning Briefing -- ${todayCST()}**\n\n${text}`, "boss"),
        postToChannel("boss", `Morning briefing posted to #morning-briefing.`, "boss"),
      ]);
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
Ad account: ${META_AD_ACCOUNT}
Use the Meta access token from the environment variable META_ACCESS_TOKEN.

Report all changes to this channel. Be specific about what you changed.`;

    const result = await runClaude({
      prompt,
      systemPromptName: "media-buyer",
      maxTurns: 25,
    });
    const text = result.text?.trim() || "";
    if (text) {
      await Promise.all([
        postToChannel("media-buyer", `**Show-Day Automation -- ${todayCST()}**\n\n${text}`, "media-buyer"),
        postToChannel("boss", `Show-day automation ran for ${today.length} show(s). Check #media-buyer.`, "scheduler"),
      ]);
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

Ad account: ${META_AD_ACCOUNT}
Keep the response concise.`;

    const result = await runClaude({
      prompt,
      systemPromptName: "media-buyer",
      maxTurns: 15,
    });
    const text = result.text?.trim() || "";
    if (text) await postToChannel("media-buyer", `**Show-Day Monitor**\n\n${text}`, "media-buyer");
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

Ad account: ${META_AD_ACCOUNT}
Format as a Discord message with bold headers.`;

    const result = await runClaude({
      prompt,
      systemPromptName: "reporting-agent",
      maxTurns: 25,
    });
    const text = result.text?.trim() || "";
    if (text) {
      const recap = `**Post-Show Recap -- ${yesterdayCST()}**\n\n${text}`;
      await Promise.all([
        postToChannel("boss", recap, "reporting"),
        postToChannel("dashboard", recap, "reporting"),
      ]);
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
Ad account: ${META_AD_ACCOUNT}

CACHED CAMPAIGNS:
${campaignsSummary(campaigns)}

CACHED EVENTS:
${events.length > 0 ? events.map((e) => `- ${e.name} on ${e.date ?? "unknown"}`).join("\n") : "No event data cached."}

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
        "reporting",
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
Ad account: ${META_AD_ACCOUNT}

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
        await Promise.all([
          postToChannel("creative", `**Creative Fatigue Alert**\n\n${text}`, "creative"),
          postToChannel("boss", `Creative fatigue detected -- check #creative.`, "creative"),
        ]);
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
Ad account: ${META_AD_ACCOUNT}

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
        await Promise.all([
          postToChannel("media-buyer", `**Budget Pacing Alert**\n\n${text}`, "media-buyer"),
          postToChannel("boss", `Budget pacing issue -- check #media-buyer.`, "media-buyer"),
        ]);
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
      const posts: Promise<void>[] = [
        postToChannel("tm-data", `**Ticket Velocity Check**\n\n${text}`, "tm-agent"),
      ];
      if (text.toLowerCase().includes("80%") || text.toLowerCase().includes("alert")) {
        posts.push(postToChannel("boss", `Ticket velocity alert -- check #tm-data.`, "tm-agent"));
      }
      await Promise.all(posts);
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
${events.length > 0 ? events.slice(0, 15).map((e) => `- ${e.name} on ${e.date ?? "unknown"}`).join("\n") : "No events cached."}

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
      await postToChannel("boss", `**Client Pulse -- ${todayCST()}**\n\n${text}`, "client-manager");
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
      await postToChannel("boss", `**Supervision Report**\n\n${text}`, "boss");
    }
    return text;
  });
}

async function creativeClassify(): Promise<void> {
  await withRoutineLock("Creative Classify", "creative", async () => {
    const { runCreativeClassify } = await import("./creative-classify.js");
    const result = await runCreativeClassify();
    if (result && !result.includes("No new assets")) {
      await postToChannel("creative", `**Asset Classification**\n\n${result}`);
      await postToFeed(`Creative classified assets: ${result.slice(0, 200)}`);
    } else {
      await postToFeed("Creative classify: no new assets");
    }
    return result;
  });
}

// --- Runner Registry ---

export function getSweepRunners(): Record<string, () => void> {
  return {
    "morning-briefing": () => {
      void morningBriefing();
    },
    "show-day-check": () => {
      void showDayAutomation();
    },
    "show-day-monitor": () => {
      void showDayMonitor();
    },
    "post-show-recap": () => {
      void postShowRecap();
    },
    "weekly-report": () => {
      void weeklyReport();
    },
    "creative-fatigue": () => {
      void creativeFatigueCheck();
    },
    "budget-pacing": () => {
      void budgetPacing();
    },
    "ticket-velocity": () => {
      void ticketVelocity();
    },
    "client-pulse": () => {
      void clientPulse();
    },
    "boss-supervision": () => {
      void bossSupervision();
    },
    "creative-classify": () => {
      void creativeClassify();
    },
  };
}
