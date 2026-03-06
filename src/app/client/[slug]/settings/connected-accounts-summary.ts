import type { ConnectedAccount } from "./data";

export type ConnectedAccountHealthKey =
  | "healthy"
  | "expiring_soon"
  | "stale"
  | "needs_reconnection";

export interface ConnectedAccountHealth {
  detail: string;
  key: ConnectedAccountHealthKey;
  label: string;
}

export interface ConnectedAccountsSummary {
  attentionCount: number;
  expiringSoonCount: number;
  healthyCount: number;
  needsReconnectionCount: number;
  staleCount: number;
  totalCount: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const EXPIRING_SOON_DAYS = 7;
const STALE_DAYS = 21;

function asDate(value: string | null | undefined) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function daysUntil(date: Date, now: Date) {
  return Math.max(0, Math.ceil((date.getTime() - now.getTime()) / DAY_MS));
}

export function getConnectedAccountHealth(
  account: ConnectedAccount,
  now: Date = new Date(),
): ConnectedAccountHealth {
  if (account.status !== "active") {
    return {
      detail: "Reconnect this ad account before campaign work can flow normally.",
      key: "needs_reconnection",
      label: "Needs reconnection",
    };
  }

  const expiry = asDate(account.token_expires_at);
  if (!expiry || expiry.getTime() <= now.getTime()) {
    return {
      detail: "The connection has expired and needs to be reconnected.",
      key: "needs_reconnection",
      label: "Needs reconnection",
    };
  }

  const daysRemaining = daysUntil(expiry, now);
  if (daysRemaining <= EXPIRING_SOON_DAYS) {
    return {
      detail: `Reconnect within ${daysRemaining} day${daysRemaining === 1 ? "" : "s"} to avoid interruptions.`,
      key: "expiring_soon",
      label: "Expiring soon",
    };
  }

  const recentActivity = asDate(account.last_used_at) ?? asDate(account.connected_at);
  if (recentActivity) {
    const inactiveDays = Math.floor((now.getTime() - recentActivity.getTime()) / DAY_MS);
    if (inactiveDays >= STALE_DAYS) {
      return {
        detail: "This connection has not been used recently. Verify it still matches active campaign work.",
        key: "stale",
        label: "Stale",
      };
    }
  }

  return {
    detail: "Healthy and ready for campaign work.",
    key: "healthy",
    label: "Healthy",
  };
}

export function buildConnectedAccountsSummary(
  accounts: ConnectedAccount[],
  now: Date = new Date(),
): ConnectedAccountsSummary {
  const counts = accounts.reduce(
    (accumulator, account) => {
      const health = getConnectedAccountHealth(account, now);
      accumulator.totalCount += 1;
      if (health.key === "healthy") accumulator.healthyCount += 1;
      if (health.key === "expiring_soon") accumulator.expiringSoonCount += 1;
      if (health.key === "stale") accumulator.staleCount += 1;
      if (health.key === "needs_reconnection") accumulator.needsReconnectionCount += 1;
      return accumulator;
    },
    {
      attentionCount: 0,
      expiringSoonCount: 0,
      healthyCount: 0,
      needsReconnectionCount: 0,
      staleCount: 0,
      totalCount: 0,
    },
  );

  return {
    ...counts,
    attentionCount:
      counts.expiringSoonCount + counts.staleCount + counts.needsReconnectionCount,
  };
}
