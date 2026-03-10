import type { Client } from "discord.js";
import { createLedgerTask, updateLedgerTask, type LedgerTask } from "./ledger-service.js";
import { getServiceSupabase } from "./supabase-service.js";
import { enqueueTask, waitForTaskTerminal } from "./queue-service.js";
import { evaluateTier } from "./approval-service.js";
import { sendAsAgent } from "./webhook-service.js";
import type { ScheduledCopySwapParams } from "./meta-copy-swap-service.js";

const DEFAULT_TIME_ZONE = process.env.DEFAULT_TIMEZONE ?? "America/Chicago";
const SCHEDULED_AGENT_HANDOFF_ACTION = "scheduled-agent-handoff";
const SCHEDULED_BUDGET_ACTION = "scheduled-budget-handoff";
const SCHEDULED_COPY_SWAP_ACTION = "scheduled-copy-swap";
const MAX_DUE_HANDOFFS = 20;

const dateFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: DEFAULT_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
});
const offsetFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: DEFAULT_TIME_ZONE, timeZoneName: "shortOffset",
});
const labelFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: DEFAULT_TIME_ZONE,
  weekday: "short", month: "short", day: "numeric",
  hour: "numeric", minute: "2-digit", hour12: true, timeZoneName: "short",
});

let sweepInFlight = false;

interface ScheduledTaskRow {
  id: string;
  action: string;
  from_agent: string;
  params: Record<string, unknown> | null;
  status: string;
  to_agent: string;
}

interface ScheduledBudgetRequestInput {
  deliverAt: Date;
  originalRequest: string;
  requester: string;
  sourceChannel: string;
}

interface ScheduledMediaBuyerRequestInput extends ScheduledBudgetRequestInput {
  extraParams?: Record<string, unknown>;
  requestType: string;
  scheduledAction: string;
}

type ScheduledCopySwapRequestInput = ScheduledBudgetRequestInput & ScheduledCopySwapParams;

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function normalizeIntentText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function hasScheduledTime(text: string): boolean {
  return (
    /\b\d{1,2}(?::\d{2})?\s?(am|pm)\b/.test(text) ||
    /\b(?:[01]?\d|2[0-3]):[0-5]\d\b/.test(text) ||
    /\bmidnight\b|\bnoon\b/.test(text)
  );
}

function hasMoneySignal(text: string): boolean {
  return (
    /\$\s*\d[\d,]*(?:\.\d{1,2})?\b/.test(text) ||
    /\b\d[\d,]*(?:\.\d{1,2})?\s*(?:usd|dollars?|bucks?)\b/.test(text)
  );
}

function hasBudgetSignal(text: string): boolean {
  return (
    /\bbudget\b|\bbuget\b|\bpresupuesto\b/.test(text) ||
    /\bdaily\s+budget\b|\bdaily\s+spent\b|\bdaily\s+spend\b/.test(text) ||
    /\bspend\s+per\s+day\b|\bspent\s+per\s+day\b/.test(text) ||
    /\bpor\s+dia\b|\bal\s+dia\b|\b\/day\b|\bdaily\b/.test(text)
  );
}

function hasChangeSignal(text: string): boolean {
  return (
    /\bupdate\b|\bupdated\b|\bchange\b|\badjust\b|\bincrease\b|\bdecrease\b|\braise\b|\blower\b|\bset\b|\bfix\b|\bactualiz\b/.test(text) ||
    /\bsubir\b|\bsube\b|\baumenta\b|\baumentar\b|\bbajar\b|\bbaja\b|\breduce\b|\breducir\b/.test(text) ||
    /\bpon\b|\bponer\b|\bdeja\b|\bdejar\b|\blleva\b|\bllevar\b|\bmove\b|\bmake\s+it\b|\btake\s+it\b/.test(text)
  );
}

function hasCampaignSignal(text: string): boolean {
  return /\bcampaign\b|\bcampghn\b|\bcampana\b|\bcity\b|\bshow\b|\bciudad\b/.test(text);
}

function hasCreativeSignal(text: string): boolean {
  return (
    /\bcopy\b|\bcreative\b|\bcreativ[oa]\b|\btexto\b|\bad\b|\bads\b|\banuncio\b/.test(text) ||
    /\bpost\b|\bstory\b|\bheadline\b|\bcaption\b/.test(text)
  );
}

function hasRelativeCopySwapSignal(text: string): boolean {
  return (
    /\bfrom\s+tomorrow\s+to\s+today\b/.test(text) ||
    /\bde\s+manana\s+a\s+hoy\b/.test(text) ||
    /\btomorrow\b.*\btoday\b/.test(text) ||
    /\bmanana\b.*\bhoy\b/.test(text)
  );
}

export function looksLikeScheduledBudgetRequest(content: string): boolean {
  const normalized = normalizeIntentText(content);
  if (!hasScheduledTime(normalized)) return false;

  const money = hasMoneySignal(normalized);
  const budget = hasBudgetSignal(normalized);
  const change = hasChangeSignal(normalized);
  const campaign = hasCampaignSignal(normalized);

  const score =
    (money ? 2 : 0) +
    (budget ? 2 : 0) +
    (change ? 2 : 0) +
    (campaign ? 1 : 0);

  return (change || budget) && score >= 4;
}

export function looksLikeScheduledCopySwapRequest(content: string): boolean {
  const normalized = normalizeIntentText(content);
  if (!hasScheduledTime(normalized)) return false;

  const creative = hasCreativeSignal(normalized);
  const change = hasChangeSignal(normalized);
  const relativeSwap = hasRelativeCopySwapSignal(normalized);
  const campaign = hasCampaignSignal(normalized);

  return creative && campaign && (change || relativeSwap);
}

function extractIdForPattern(content: string, pattern: RegExp): string | null {
  const match = content.match(pattern);
  return match?.[1] ?? null;
}

export function extractScheduledCopySwapParams(content: string): ScheduledCopySwapParams | null {
  const normalized = normalizeIntentText(content);
  const activateAdId =
    extractIdForPattern(content, /\bactivate\b[\s\S]{0,80}?\bad\b[\s#:]*([0-9]{8,})\b/i) ??
    extractIdForPattern(content, /\b(?:new|today|hoy)\s+ad\b[\s#:]*([0-9]{8,})\b/i);

  const pauseAdId =
    extractIdForPattern(content, /\bpause\b[\s\S]{0,80}?\bad\b[\s#:]*([0-9]{8,})\b/i) ??
    extractIdForPattern(content, /\b(?:old|tomorrow|manana)\s+ad\b[\s#:]*([0-9]{8,})\b/i);

  if (!activateAdId || !pauseAdId) {
    return null;
  }

  return {
    activateAdId,
    activateLabel: /\bhoy\b|\btoday\b/.test(normalized) ? "Hoy" : undefined,
    pauseAdId,
    pauseLabel: /\bmanana\b|\btomorrow\b/.test(normalized) ? "Mañana" : undefined,
  };
}

export function parseScheduledDispatchTime(content: string, now: Date = new Date()): Date | null {
  const lower = normalizeIntentText(content);

  let hours: number;
  let minutes = 0;

  if (/\bmidnight\b/.test(lower)) {
    hours = 0;
  } else if (/\bnoon\b/.test(lower)) {
    hours = 12;
  } else {
    const meridiemMatch = lower.match(/\b(?:at|for|around|by)?\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/);
    if (meridiemMatch) {
      const parsedHours = Number(meridiemMatch[1]);
      const parsedMinutes = meridiemMatch[2] ? Number(meridiemMatch[2]) : 0;
      if (!Number.isInteger(parsedHours) || parsedHours < 1 || parsedHours > 12) {
        return null;
      }
      if (!Number.isInteger(parsedMinutes) || parsedMinutes < 0 || parsedMinutes > 59) {
        return null;
      }

      hours = parsedHours % 12;
      if (meridiemMatch[3] === "pm") hours += 12;
      minutes = parsedMinutes;
    } else {
      const twentyFourHourMatch = lower.match(/\b(?:at|for|around|by)?\s*((?:[01]?\d|2[0-3])):(\d{2})\b/);
      if (!twentyFourHourMatch) return null;

      const parsedHours = Number(twentyFourHourMatch[1]);
      const parsedMinutes = Number(twentyFourHourMatch[2]);
      if (!Number.isInteger(parsedHours) || parsedHours < 0 || parsedHours > 23) {
        return null;
      }
      if (!Number.isInteger(parsedMinutes) || parsedMinutes < 0 || parsedMinutes > 59) {
        return null;
      }

      hours = parsedHours;
      minutes = parsedMinutes;
    }
  }

  let dateStr = dateFmt.format(now);

  const wantsTomorrow = /\btomorrow\b|\bmanana\b/.test(lower);
  const wantsToday = /\btoday\b|\btonight\b|\bhoy\b|\besta noche\b/.test(lower);

  if (wantsTomorrow) {
    dateStr = dateFmt.format(new Date(now.getTime() + 86_400_000));
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  const isoLike = `${dateStr}T${pad(hours)}:${pad(minutes)}:00`;

  const parts = offsetFmt.formatToParts(now);
  const offsetVal = parts.find(p => p.type === "timeZoneName")?.value ?? "GMT";
  const offMatch = offsetVal.match(/GMT([+-]?)(\d{1,2})(?::?(\d{2}))?/);
  let tzSuffix = "Z";
  if (offMatch) {
    const sign = offMatch[1] || "+";
    tzSuffix = `${sign}${offMatch[2].padStart(2, "0")}:${(offMatch[3] ?? "0").padStart(2, "0")}`;
  }

  const target = new Date(`${isoLike}${tzSuffix}`);

  if (!wantsTomorrow && !wantsToday && target.getTime() <= now.getTime()) {
    target.setTime(target.getTime() + 86_400_000);
  }

  return target;
}

export function formatScheduledTimeLabel(date: Date): string {
  return labelFmt.format(date);
}

async function scheduleMediaBuyerHandoff(
  input: ScheduledMediaBuyerRequestInput,
): Promise<LedgerTask> {
  return await createLedgerTask({
    from: "boss",
    to: "scheduler",
    action: SCHEDULED_AGENT_HANDOFF_ACTION,
    params: {
      deliverAt: input.deliverAt.toISOString(),
      deliverToAgent: "media-buyer",
      deliverToChannel: "media-buyer",
      originalRequest: input.originalRequest,
      replyChannel: input.sourceChannel,
      requestType: input.requestType,
      requester: input.requester,
      scheduledAction: input.scheduledAction,
      sourceChannel: input.sourceChannel,
      ...(input.extraParams ?? {}),
    },
    status: "pending",
    tier: "green",
  });
}

export async function scheduleBudgetUpdateHandoff(
  input: ScheduledBudgetRequestInput,
): Promise<LedgerTask> {
  return await scheduleMediaBuyerHandoff({
    ...input,
    requestType: "budget-update",
    scheduledAction: SCHEDULED_BUDGET_ACTION,
  });
}

export async function scheduleCopySwapHandoff(
  input: ScheduledCopySwapRequestInput,
): Promise<LedgerTask> {
  return await scheduleMediaBuyerHandoff({
    ...input,
    extraParams: {
      activateAdId: input.activateAdId,
      activateLabel: input.activateLabel,
      campaignName: input.campaignName,
      city: input.city,
      pauseAdId: input.pauseAdId,
      pauseLabel: input.pauseLabel,
    },
    requestType: "copy-swap",
    scheduledAction: SCHEDULED_COPY_SWAP_ACTION,
  });
}

function parseDeliverAt(params: Record<string, unknown> | null): Date | null {
  const raw = params?.deliverAt;
  if (typeof raw !== "string") return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

async function claimScheduledTask(id: string): Promise<ScheduledTaskRow | null> {
  const supabase = getServiceSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("agent_tasks")
    .update({
      status: "running",
      started_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "pending")
    .select("id, from_agent, to_agent, action, params, status")
    .maybeSingle();

  if (error) {
    console.error(`[scheduled-handoff] claim failed for ${id}:`, error.message);
    return null;
  }

  return (data as ScheduledTaskRow | null) ?? null;
}

async function fetchPendingScheduledTasks(): Promise<ScheduledTaskRow[]> {
  const supabase = getServiceSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("agent_tasks")
    .select("id, from_agent, to_agent, action, params, status")
    .eq("to_agent", "scheduler")
    .eq("status", "pending")
    .eq("action", SCHEDULED_AGENT_HANDOFF_ACTION)
    .order("created_at", { ascending: true })
    .limit(MAX_DUE_HANDOFFS);

  if (error) {
    console.error("[scheduled-handoff] fetch failed:", error.message);
    return [];
  }

  return (data as ScheduledTaskRow[] | null) ?? [];
}

function buildSchedulerDispatchMessage(task: ScheduledTaskRow, deliverAt: Date): string {
  const params = isRecord(task.params) ? task.params : {};
  const requester = typeof params.requester === "string" ? params.requester : "Unknown requester";
  const sourceChannel = typeof params.sourceChannel === "string" ? params.sourceChannel : "unknown";
  const originalRequest = typeof params.originalRequest === "string" ? params.originalRequest : "";

  return [
    "**Scheduled handoff from Boss**",
    `Task: ${task.id}`,
    `Requester: ${requester}`,
    `Asked in: #${sourceChannel}`,
    `Scheduled for: ${formatScheduledTimeLabel(deliverAt)}`,
    `Original request: "${originalRequest}"`,
    "Media Buyer, handle this now.",
  ].join("\n");
}

async function dispatchScheduledTask(client: Client, scheduledTask: ScheduledTaskRow): Promise<void> {
  const params = isRecord(scheduledTask.params) ? scheduledTask.params : {};
  const deliverAt = parseDeliverAt(params);
  if (!deliverAt) {
    await updateLedgerTask(scheduledTask.id, {
      completed_at: new Date().toISOString(),
      error: "Missing or invalid deliverAt timestamp",
      status: "failed",
    });
    return;
  }

  const targetAgent = typeof params.deliverToAgent === "string" ? params.deliverToAgent : "media-buyer";
  const targetChannel = typeof params.deliverToChannel === "string" ? params.deliverToChannel : "media-buyer";
  const scheduledAction = typeof params.scheduledAction === "string" ? params.scheduledAction : SCHEDULED_BUDGET_ACTION;

  await sendAsAgent(
    "scheduler",
    "schedule",
    `Dispatching ${scheduledTask.id} to #${targetChannel} for ${formatScheduledTimeLabel(deliverAt)}.`,
  ).catch((e) => console.warn("[handoff] dispatch notify failed:", e));

  await sendAsAgent("scheduler", targetChannel, buildSchedulerDispatchMessage(scheduledTask, deliverAt)).catch((e) => console.warn("[handoff] dispatch message failed:", e));

  const delegatedTask = enqueueTask(
    "scheduler",
    targetAgent,
    scheduledAction,
    {
      ...params,
      _queueDepth: 0,
      _queueNotifySource: false,
      _queueSourceChannel: "schedule",
    },
    "green",
  );
  const decision = evaluateTier(delegatedTask);
  if (decision !== "execute") {
    await updateLedgerTask(scheduledTask.id, {
      completed_at: new Date().toISOString(),
      error: `Scheduler escalation required for ${scheduledAction}`,
      status: "escalated",
    });
    return;
  }

  try {
    const terminalTask = await waitForTaskTerminal(delegatedTask.id, 10 * 60 * 1000);
    if (terminalTask.status !== "completed") {
      throw new Error(terminalTask.error ?? `Scheduled handoff ended with status ${terminalTask.status}`);
    }

    const resultPayload =
      terminalTask.result && typeof terminalTask.result === "object"
        ? (terminalTask.result as Record<string, unknown>)
        : null;
    const resultText =
      typeof resultPayload?.text === "string"
        ? resultPayload.text
        : typeof terminalTask.result === "string"
          ? terminalTask.result
          : "Scheduled handoff completed.";

    await updateLedgerTask(scheduledTask.id, {
      completed_at: new Date().toISOString(),
      result: {
        delegated_task_id: delegatedTask.id,
        text: resultText,
      },
      status: "completed",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await updateLedgerTask(scheduledTask.id, {
      completed_at: new Date().toISOString(),
      error: message,
      status: "failed",
    });
  }
}

export async function dispatchDueScheduledHandoffs(client: Client | null): Promise<void> {
  if (!client || !client.guilds.cache.first() || sweepInFlight) return;

  sweepInFlight = true;
  try {
    const pending = await fetchPendingScheduledTasks();
    if (pending.length === 0) return;

    const now = Date.now();
    for (const task of pending) {
      const params = isRecord(task.params) ? task.params : null;
      const deliverAt = parseDeliverAt(params);
      if (!deliverAt || deliverAt.getTime() > now) continue;

      const claimed = await claimScheduledTask(task.id);
      if (!claimed) continue;
      await dispatchScheduledTask(client, claimed);
    }
  } finally {
    sweepInFlight = false;
  }
}
