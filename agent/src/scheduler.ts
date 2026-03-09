import cron from "node-cron";
import { readFileSync, existsSync, unlinkSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { runClaude } from "./runner.js";
import { discordClient, notifyChannel } from "./discord/core/entry.js";
import {
  ResourceBusyError,
  clearAgentBusy,
  isAgentBusy,
  resetStaleLocks,
  setAgentBusy,
  withResourceLocks,
} from "./state.js";
import { getSweepRunners } from "./jobs/cron-sweeps.js";
import { ensureManagedEmailLabels, sweepUnreadInboxDetailed } from "./services/email-intelligence-service.js";
import { createLedgerTask, updateLedgerTask, type LedgerTask } from "./services/ledger-service.js";
import { notifyOwner, notifyOwnerEmailAlert, notifyOwnerImportant } from "./services/owner-discord-service.js";
import { ensureGmailWatch, pollGmailHistory } from "./services/gmail-watch-service.js";
import { dispatchDueScheduledHandoffs } from "./services/scheduled-handoff-service.js";

const SESSION_DIR = join(import.meta.dirname ?? ".", "..", "session");
const TM_SYNC_SCRIPT = join(SESSION_DIR, "tm1-http-sync.mjs");
const TM_COOKIE_SCRIPT = join(SESSION_DIR, "tm1-cookie-refresh.mjs");
const EATA_SYNC_SCRIPT = join(SESSION_DIR, "eata-http-sync.mjs");
const EATA_COOKIE_SCRIPT = join(SESSION_DIR, "eata-cookie-refresh.mjs");

const CHECK_CRON = process.env.CHECK_CRON ?? "0 */2 * * *";
const META_CRON = "0 */6 * * *";
const THINK_CRON = "*/30 8-22 * * *";
const HEARTBEAT_CRON = "*/1 * * * *";
const DISCORD_HEALTH_CRON = "0 */12 * * *";
const TM_COOKIE_CRON = "0 */6 * * *";
const EATA_CRON = "10 */2 * * *";
const EATA_COOKIE_CRON = "10 */6 * * *";
const EMAIL_HISTORY_POLL_CRON = process.env.EMAIL_HISTORY_POLL_CRON ?? "*/1 8-22 * * *";
const EMAIL_WATCH_RENEW_CRON = "0 */6 * * *";
const SCHEDULED_HANDOFF_CRON = "*/1 * * * *";

const EMAIL_NOTIFY_DISCORD = (process.env.EMAIL_NOTIFY_DISCORD ?? "false").toLowerCase() === "true";
const SCHEDULED_OWNER_NOTIFICATIONS = (process.env.SCHEDULED_OWNER_NOTIFICATIONS ?? "false").toLowerCase() === "true";
const TM_SCHEDULER_ENABLED = (process.env.TM_SCHEDULER_ENABLED ?? "false").toLowerCase() === "true";
const EATA_SCHEDULER_ENABLED = (process.env.EATA_SCHEDULER_ENABLED ?? "false").toLowerCase() === "true";
const GMAIL_PUSH_ENABLED = Boolean(process.env.GMAIL_PUBSUB_TOPIC);
const INGEST_URL = process.env.INGEST_URL?.replace("/api/ingest", "");

const META_TASK = "Run the Meta Ads sync: pull all active campaigns and last-30-day insights for ad account act_787610255314938, save to session/last-campaigns.json, POST to the ingest endpoint. Report spend and ROAS summary.";
const THINK_TASK = "Run your proactive self-improvement cycle. Read LEARNINGS.md first to pick which priority to focus on this cycle.";

export interface JobRunOptions {
  notify?: boolean;
  audit?: boolean;
  source?: string;
}

interface SyncConfig {
  lockKey: string;
  label: string;
  scriptPath: string;
  refreshFn: () => Promise<void>;
  resources?: string[];
  notifyChannel: string;
  auditAgent: string;
  formatSummary: (summary: Record<string, unknown>) => string;
}

function withDefaults(options?: JobRunOptions): Required<JobRunOptions> {
  return {
    notify: options?.notify ?? true,
    audit: options?.audit ?? true,
    source: options?.source ?? "scheduler",
  };
}

async function beginAuditTask(
  options: Required<JobRunOptions>,
  to: string,
  action: string,
  params: Record<string, unknown> = {},
): Promise<LedgerTask | null> {
  if (!options.audit) return null;

  return await createLedgerTask({
    from: options.source,
    to,
    action,
    params,
    tier: "green",
    status: "running",
    startedAt: new Date().toISOString(),
  });
}

async function finishAuditTask(task: LedgerTask | null, status: "completed" | "failed", payload: string): Promise<void> {
  if (!task) return;

  await updateLedgerTask(task.id, {
    status,
    completed_at: new Date().toISOString(),
    ...(status === "completed"
      ? { result: { text: payload } }
      : { error: payload }),
  });
}

export function startScheduler(): void {
  cron.schedule(HEARTBEAT_CRON, () => { void pingHeartbeat(); });
  cron.schedule(META_CRON, () => { void runMetaSync({ notify: SCHEDULED_OWNER_NOTIFICATIONS }); });
  cron.schedule(THINK_CRON, () => { void runThinkCycle({ notify: SCHEDULED_OWNER_NOTIFICATIONS }); }, { timezone: "America/Los_Angeles" });
  cron.schedule(DISCORD_HEALTH_CRON, () => { void runDiscordHealthCheck(); });
  cron.schedule(SCHEDULED_HANDOFF_CRON, () => { void dispatchDueScheduledHandoffs(discordClient); });

  if (TM_SCHEDULER_ENABLED) {
    cron.schedule(CHECK_CRON, () => { void runTmCheck({ notify: SCHEDULED_OWNER_NOTIFICATIONS }); });
    cron.schedule(TM_COOKIE_CRON, () => { void refreshTmCookies(); });
  } else {
    console.log("[scheduler] TM1 core cron disabled (set TM_SCHEDULER_ENABLED=true to re-enable)");
  }

  if (EATA_SCHEDULER_ENABLED) {
    cron.schedule(EATA_CRON, () => { void runEataSync({ notify: SCHEDULED_OWNER_NOTIFICATIONS }); });
    cron.schedule(EATA_COOKIE_CRON, () => { void refreshEataCookies(); });
  } else {
    console.log("[scheduler] EATA core cron disabled (set EATA_SCHEDULER_ENABLED=true to re-enable)");
  }

  if (GMAIL_PUSH_ENABLED) {
    cron.schedule(EMAIL_WATCH_RENEW_CRON, () => {
      void renewGmailWatch();
    }, { timezone: "America/Los_Angeles" });
    void renewGmailWatch();
    console.log("[scheduler] Gmail push enabled; cron email polling disabled");
  } else {
    cron.schedule(EMAIL_HISTORY_POLL_CRON, () => {
      void runEmailHistoryPoll({ notify: false });
    }, { timezone: "America/Los_Angeles" });
    console.log(`[scheduler] Gmail push unavailable; using incremental email history polling (${EMAIL_HISTORY_POLL_CRON})`);
  }

  if (!SCHEDULED_OWNER_NOTIFICATIONS) {
    console.log("[scheduler] Background scheduler owner notifications disabled (manual runs still notify)");
  }

  const coreJobs = [
    "heartbeat",
    TM_SCHEDULER_ENABLED ? "tm" : null,
    "meta",
    "think",
    "health-check",
    TM_SCHEDULER_ENABLED ? "tm-cookie" : null,
    EATA_SCHEDULER_ENABLED ? "eata" : null,
    EATA_SCHEDULER_ENABLED ? "eata-cookie" : null,
    GMAIL_PUSH_ENABLED ? "gmail-watch" : "email-history-poll",
    "scheduled-handoffs",
  ].filter(Boolean).join(", ");

  console.log(`[scheduler] Core jobs started (${coreJobs})`);
}

export function triggerManualJob(jobName: string): void {
  switch (jobName) {
    case "meta-sync":
      void runMetaSync();
      break;
    case "tm-sync":
      void runTmCheck();
      break;
    case "think":
      void runThinkCycle();
      break;
    case "tm-cookie-refresh":
      void refreshTmCookies();
      break;
    case "eata-sync":
      void runEataSync();
      break;
    case "eata-cookie-refresh":
      void refreshEataCookies();
      break;
    case "email-check":
      void runEmailCheck();
      break;
    case "email-history-poll":
      void runEmailHistoryPoll();
      break;
    default: {
      const sweeps = getSweepRunners();
      if (sweeps[jobName]) {
        sweeps[jobName]();
      } else {
        console.warn(`[scheduler] Unknown manual trigger: ${jobName}`);
      }
    }
  }
}

async function pingHeartbeat() {
  if (!INGEST_URL) {
    console.error("[scheduler] INGEST_URL not set, skipping heartbeat");
    return;
  }

  try {
    await fetch(`${INGEST_URL}/api/agents/heartbeat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: process.env.INGEST_SECRET }),
    });
  } catch {
    // ignore
  }
}

async function renewGmailWatch(): Promise<void> {
  try {
    const summary = await withResourceLocks("gmail-watch-renew", ["gmail-inbox"], async () => {
      await ensureManagedEmailLabels();
      return await ensureGmailWatch();
    });
    console.log("[scheduler]", summary);
  } catch (err) {
    if (err instanceof ResourceBusyError) {
      console.log(`[scheduler] Gmail watch renewal deferred; busy resources: ${err.blockers.join(", ")}`);
      return;
    }
    const message = err instanceof Error ? err.message : String(err);
    console.error("[scheduler] Gmail watch renewal failed:", message);
    if (SCHEDULED_OWNER_NOTIFICATIONS) {
      await notifyOwnerImportant(`[Email Watch -- failed]\n${message}`, { channel: "email" }).catch(() => {});
    }
  }
}

async function runExternalSync(cfg: SyncConfig, options?: JobRunOptions): Promise<string> {
  const job = withDefaults(options);
  if (isAgentBusy(cfg.lockKey)) {
    return `${cfg.label} is already running.`;
  }

  setAgentBusy(cfg.lockKey);
  const auditTask = await beginAuditTask(job, cfg.auditAgent, cfg.lockKey, { label: cfg.label });
  console.log(`[scheduler] Running ${cfg.label}...`);
  if (job.notify) {
    await notifyChannel("active-jobs", `>> **${cfg.label}** started`).catch(() => {});
  }

  try {
    return await withResourceLocks(cfg.lockKey, cfg.resources ?? [], async () => {
      let output: string;
      try {
        output = execFileSync("node", [cfg.scriptPath], {
          timeout: 60_000, encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"],
        });
      } catch (execErr: unknown) {
        const err = execErr as { status?: number; stdout?: string; stderr?: string };
        if (err.status === 2) {
          if (job.notify) {
            await notifyChannel("active-jobs", `>> **${cfg.label}** refreshing auth...`).catch(() => {});
          }
          await cfg.refreshFn();
          output = execFileSync("node", [cfg.scriptPath], {
            timeout: 60_000, encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"],
          });
        } else {
          throw new Error(err.stderr || err.stdout || `${cfg.label} failed`);
        }
      }

      const lines = output.trim().split("\n");
      let summary: Record<string, unknown> = {};
      try {
        summary = JSON.parse(lines[lines.length - 1]) as Record<string, unknown>;
      } catch {
        // keep empty summary
      }

      const message = cfg.formatSummary(summary);
      await finishAuditTask(auditTask, "completed", message);

      if (job.notify) {
        await notifyChannel("active-jobs", `ok **${cfg.label}** finished`).catch(() => {});
      await Promise.all([
        notifyOwner(`[${cfg.label}]\n\n${message}`),
        notifyChannel(cfg.notifyChannel, `**${cfg.label} Update**\n\n${message}`),
        ]);
      }

      return message;
    });
  } catch (err) {
    if (err instanceof ResourceBusyError) {
      const message = `${cfg.label} deferred; busy resources: ${err.blockers.join(", ")}`;
      console.log(`[scheduler] ${message}`);
      await finishAuditTask(auditTask, "completed", message);
      return message;
    }

    const message = err instanceof Error ? err.message : String(err);
    await finishAuditTask(auditTask, "failed", message);

    if (job.notify) {
      await notifyChannel("active-jobs", `x **${cfg.label}** failed: ${message.slice(0, 200)}`).catch(() => {});
      await Promise.all([
        notifyOwnerImportant(`[${cfg.label} -- failed]\n${message}`).catch(() => {}),
        notifyChannel("agent-alerts", `**${cfg.label} failed**\n${message}`).catch(() => {}),
      ]);
    }

    throw err;
  } finally {
    clearAgentBusy(cfg.lockKey);
  }
}

async function runTokenRefresh(
  label: string,
  scriptPath: string,
  ownerId: string,
  resources: string[],
): Promise<void> {
  console.log(`[scheduler] Refreshing ${label} auth...`);
  try {
    await withResourceLocks(ownerId, resources, async () => {
      execFileSync("node", [scriptPath], {
        timeout: 120_000, encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"],
      });
    });
  } catch (err) {
    if (err instanceof ResourceBusyError) {
      console.log(`[scheduler] ${label} auth refresh deferred; busy resources: ${err.blockers.join(", ")}`);
      return;
    }
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[scheduler] ${label} auth refresh failed:`, message);
    await notifyChannel("agent-alerts", `**${label} auth refresh failed**\n${message.slice(0, 200)}`).catch(() => {});
  }
}

export function runTmCheck(options?: JobRunOptions): Promise<string> {
  return runExternalSync({
    lockKey: "tm-sync",
    label: "TM One sync",
    scriptPath: TM_SYNC_SCRIPT,
    refreshFn: () => refreshTmCookies("tm-sync"),
    resources: ["tm-browser"],
    notifyChannel: "tm-data",
    auditAgent: "tm-monitor",
    formatSummary: (summary) => {
      const events = summary.events_updated ?? 0;
      const demographics = summary.demographics_updated ?? 0;
      return `Updated ${events} events, ${demographics} demographics in ${summary.duration_ms ?? 0}ms`;
    },
  }, options);
}

function refreshTmCookies(ownerId = "tm-cookie-refresh") {
  return runTokenRefresh("TM One", TM_COOKIE_SCRIPT, ownerId, ["tm-browser"]);
}

async function runEataSync(options?: JobRunOptions): Promise<string> {
  return runExternalSync({
    lockKey: "eata-sync",
    label: "EATA sync",
    scriptPath: EATA_SYNC_SCRIPT,
    refreshFn: () => refreshEataCookies("eata-sync"),
    resources: ["eata-browser"],
    notifyChannel: "don-omar-tickets",
    auditAgent: "don-omar-agent",
    formatSummary: (summary) =>
      `Updated ${summary.events_updated ?? 0} EATA events in ${summary.duration_ms ?? 0}ms`,
  }, options);
}

function refreshEataCookies(ownerId = "eata-cookie-refresh") {
  return runTokenRefresh("EATA", EATA_COOKIE_SCRIPT, ownerId, ["eata-browser"]);
}

export async function runEmailCheck(options?: JobRunOptions): Promise<string> {
  const job = withDefaults(options);
  if (isAgentBusy("email-check")) {
    return "Email check is already running.";
  }

  setAgentBusy("email-check");
  const auditTask = await beginAuditTask(job, "email-agent", "email-check", { mode: "poll" });

  try {
    const sweep = await withResourceLocks("email-check", ["gmail-inbox"], async () => {
      await ensureManagedEmailLabels();
      return await sweepUnreadInboxDetailed(5);
    });
    await finishAuditTask(auditTask, "completed", sweep.summary);

    if (job.notify) {
      const notifications: Promise<unknown>[] = [];

      const relevantAlerts = sweep.results.filter((result) => result.direction === "inbound" && result.notifiedOwner && result.ownerAlert);
      const quietHandledCount = Math.max(0, sweep.inboundCount - relevantAlerts.length);

      notifications.push(
        notifyOwner(
          [
            "Inbox sweep finished.",
            `Reviewed ${sweep.reviewedCount} unread email(s).`,
            `Sent ${relevantAlerts.length} relevant owner alert(s).`,
            quietHandledCount > 0 ? `Handled ${quietHandledCount} lower-signal email(s) quietly.` : null,
          ].filter(Boolean).join("\n"),
          { channel: "email" },
        ),
      );

      for (const alert of relevantAlerts) {
        notifications.push(notifyOwnerEmailAlert(alert.ownerAlert!));
      }

      if (EMAIL_NOTIFY_DISCORD) {
        notifications.push(
          notifyChannel("email", `**Email Check**\n\n${sweep.summary}`),
        );
      }

      await Promise.all(notifications);
    }

    return sweep.summary;
  } catch (err) {
    if (err instanceof ResourceBusyError) {
      const message = `Email check deferred; busy resources: ${err.blockers.join(", ")}`;
      await finishAuditTask(auditTask, "completed", message);
      return message;
    }
    const message = err instanceof Error ? err.message : String(err);
    await finishAuditTask(auditTask, "failed", message);
    if (job.notify) {
      await notifyChannel("agent-alerts", `**Email check failed**\n${message.slice(0, 200)}`).catch(() => {});
    }
    throw err;
  } finally {
    clearAgentBusy("email-check");
  }
}

export async function runEmailHistoryPoll(options?: JobRunOptions): Promise<string> {
  const job = withDefaults(options);
  if (isAgentBusy("email-history-poll")) {
    return "Email history poll is already running.";
  }

  setAgentBusy("email-history-poll");
  const auditTask = await beginAuditTask(job, "email-agent", "email-history-poll", { mode: "history-poll" });

  try {
    const message = await withResourceLocks("email-history-poll", ["gmail-inbox"], async () => {
      return await pollGmailHistory();
    });
    await finishAuditTask(auditTask, "completed", message);
    return message;
  } catch (err) {
    if (err instanceof ResourceBusyError) {
      const message = `Email history poll deferred; busy resources: ${err.blockers.join(", ")}`;
      await finishAuditTask(auditTask, "completed", message);
      return message;
    }
    const message = err instanceof Error ? err.message : String(err);
    await finishAuditTask(auditTask, "failed", message);
    if (job.notify) {
      await notifyChannel("agent-alerts", `**Email history poll failed**\n${message.slice(0, 200)}`).catch(() => {});
    }
    throw err;
  } finally {
    clearAgentBusy("email-history-poll");
  }
}

export async function runMetaSync(options?: JobRunOptions): Promise<string> {
  const job = withDefaults(options);
  if (isAgentBusy("meta-sync")) {
    return "Meta sync is already running.";
  }

  setAgentBusy("meta-sync");
  const auditTask = await beginAuditTask(job, "meta-ads", "meta-sync");
  if (job.notify) {
    await notifyChannel("active-jobs", ">> **Meta Ads sync** started").catch(() => {});
  }

  try {
    const result = await runClaude({ prompt: META_TASK, maxTurns: 20 });
    if (!result.success && result.error) {
      throw new Error(result.error);
    }

    const message = result.text?.trim() || "Meta sync completed.";
    await finishAuditTask(auditTask, "completed", message);

    if (job.notify) {
      await notifyChannel("active-jobs", "ok **Meta Ads sync** finished").catch(() => {});
      await Promise.all([
        notifyOwner(`[Meta Ads]\n\n${message}`),
        notifyChannel("performance", `**Meta Ads Sync**\n\n${message}`),
      ]);
    }

    try {
      const { discordClient } = await import("./discord/core/entry.js");
      if (discordClient) {
        const { updateDashboard } = await import("./discord/commands/dashboard.js");
        await updateDashboard(discordClient);
      }
    } catch {
      // best-effort
    }

    return message;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await finishAuditTask(auditTask, "failed", message);
    if (job.notify) {
      await notifyChannel("active-jobs", `x **Meta Ads sync** failed: ${message.slice(0, 200)}`).catch(() => {});
      await Promise.all([
        notifyOwnerImportant(`[Meta Ads -- failed]\n${message}`).catch(() => {}),
        notifyChannel("agent-alerts", `**Meta sync failed**\n${message}`).catch(() => {}),
      ]);
    }
    throw err;
  } finally {
    clearAgentBusy("meta-sync");
  }
}

export function getJobRunners(): Record<string, () => void> {
  const sweeps = getSweepRunners();
  return {
    "meta-sync": () => { void runMetaSync(); },
    "tm-sync": () => { void runTmCheck(); },
    "think": () => { void runThinkCycle(); },
    heartbeat: () => { void pingHeartbeat(); },
    "health-check": () => { void runDiscordHealthCheck(); },
    "tm-cookie-refresh": () => { void refreshTmCookies(); },
    "eata-sync": () => { void runEataSync(); },
    "eata-cookie-refresh": () => { void refreshEataCookies(); },
    "email-check": () => { void runEmailCheck(); },
    "email-history-poll": () => { void runEmailHistoryPoll(); },
    ...sweeps,
  };
}

async function runDiscordHealthCheck() {
  resetStaleLocks();

  try {
    const { runChannelHealthCheck } = await import("./discord/commands/admin.js");
    await runChannelHealthCheck();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[scheduler] Discord health check failed:", message);
  }
}

export async function runThinkCycle(options?: JobRunOptions): Promise<string> {
  const job = withDefaults(options);
  if (isAgentBusy("think")) {
    return "Think loop is already running.";
  }

  setAgentBusy("think");
  const auditTask = await beginAuditTask(job, "think", "think");
  if (job.notify) {
    await notifyChannel("active-jobs", ">> **Think loop** started").catch(() => {});
  }

  try {
    const result = await withResourceLocks("think", ["memory-write"], async () => {
      return await runClaude({
        prompt: THINK_TASK,
        systemPromptName: "think",
        maxTurns: 15,
      });
    });

    if (!result.success && result.error) {
      throw new Error(result.error);
    }

    const draftPath = "/tmp/outlet-media-owner-note.txt";
    if (existsSync(draftPath)) {
      const draft = readFileSync(draftPath, "utf8").trim();
      if (draft && job.notify) {
        await Promise.all([
          notifyOwner(`[Proactive]\n\n${draft}`),
          notifyChannel("agent-alerts", `**Proactive Alert**\n\n${draft}`),
        ]);
      }
      unlinkSync(draftPath);
    }

    const message = result.text?.trim() || "Think loop completed.";
    await finishAuditTask(auditTask, "completed", message);
    if (job.notify) {
      await notifyChannel("active-jobs", "ok **Think loop** finished").catch(() => {});
    }
    return message;
  } catch (err) {
    if (err instanceof ResourceBusyError) {
      const message = `Think loop deferred; busy resources: ${err.blockers.join(", ")}`;
      await finishAuditTask(auditTask, "completed", message);
      return message;
    }
    const message = err instanceof Error ? err.message : String(err);
    await finishAuditTask(auditTask, "failed", message);
    if (job.notify) {
      await notifyChannel("active-jobs", `x **Think loop** failed: ${message.slice(0, 200)}`).catch(() => {});
    }
    throw err;
  } finally {
    clearAgentBusy("think");
  }
}
