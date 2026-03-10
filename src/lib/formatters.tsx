/**
 * Shared utility module extracted from duplicated helpers across admin and client pages.
 * All formatting logic (currency, dates, labels, status badges) lives here as the
 * single source of truth — do NOT duplicate these in page files.
 */

import type { ActionableInvitationStatus } from "@/features/invitations/types";
import { getCampaignStatusCfg, getEventStatusCfg } from "./status";

// ─── Number / Currency ─────────────────────────────────────────────────────

/** Convert a cent-denominated value to USD (or null → null). */
export function centsToUsd(cents: number | null): number | null {
  return cents == null ? null : cents / 100;
}

/** Format a dollar amount with optional K/M abbreviation. */
export function fmtUsd(n: number | null): string {
  if (n == null) return "--";
  if (Math.abs(n) >= 1_000_000) return "$" + (n / 1_000_000).toFixed(1) + "M";
  if (Math.abs(n) >= 1_000) return "$" + (n / 1_000).toFixed(1) + "K";
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Format a number with K/M abbreviation. */
export function fmtNum(n: number | null): string {
  if (n == null) return "--";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString("en-US");
}

// ─── Date ───────────────────────────────────────────────────────────────────

/** Format an ISO date string as "Jan 5, 2025". */
export function fmtDate(d: string | null): string {
  if (!d) return "--";
  // Append noon to date-only strings to avoid UTC midnight off-by-one in western timezones
  const date = new Date(d.includes("T") ? d : d + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Format today's date as "Monday, March 10". */
export function fmtTodayLong(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

// ─── Strings ────────────────────────────────────────────────────────────────

/** Convert an underscore-separated slug to a Title Case label. */
export function slugToLabel(slug: string | null): string {
  if (!slug) return "--";
  return slug
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function getInvitationStatusCfg(
  status: ActionableInvitationStatus | null | undefined,
) {
  if (status === "expired") {
    return {
      label: "Expired",
      detail: "Invite expired",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-400",
    };
  }

  return {
    label: "Pending",
    detail: "Invite pending",
    bg: "bg-blue-500/20",
    border: "border-blue-500/20",
    text: "text-blue-400",
  };
}

// ─── Time ───────────────────────────────────────────────────────────────────

/** Human-readable time distance from an ISO timestamp. Returns "never" for null. */
export function timeAgo(iso: string | null): string {
  if (!iso) return "never";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "unknown";
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── ROAS ────────────────────────────────────────────────────────────────────

/** Tailwind color class for a ROAS value. Thresholds: >=4 green, >=2 amber, else red. */
export function roasColor(roas: number | null): string {
  if (roas == null) return "text-white/40";
  if (roas >= 4) return "text-emerald-400";
  if (roas >= 2) return "text-amber-400";
  return "text-red-400";
}

// ─── Campaign helpers ────────────────────────────────────────────────────

/** Format a Meta campaign objective enum into a human-readable label. */
export function fmtObjective(raw: string | null): string | null {
  if (!raw) return null;
  return raw.replace(/^OUTCOME_/, "").replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export interface MarginalRoasPoint {
  date: string;
  roas: number | null;
  spend: number | null;
}

/** Compute marginal ROAS from a time series. Unit-agnostic (cents or dollars). */
export function computeMarginalRoas(points: MarginalRoasPoint[]): number | null {
  if (points.length < 2) return null;
  const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date));
  const first = sorted[0], last = sorted[sorted.length - 1];
  if (first.date === last.date) return null;
  if (first.spend == null || last.spend == null || first.roas == null || last.roas == null) return null;
  const deltaSpend = last.spend - first.spend;
  if (deltaSpend <= 0) return null;
  return (last.spend * last.roas - first.spend * first.roas) / deltaSpend;
}

// ─── Blended ROAS ───────────────────────────────────────────────────────

interface SpendRoasItem {
  spend: number;
  roas: number | null;
}

/** Compute spend-weighted blended ROAS. Returns null if no spend has ROAS. */
export function computeBlendedRoas(items: SpendRoasItem[]): number | null {
  let weightedRoas = 0;
  let spendWithRoas = 0;
  for (const item of items) {
    if (item.roas != null && item.spend > 0) {
      weightedRoas += item.roas * item.spend;
      spendWithRoas += item.spend;
    }
  }
  return spendWithRoas > 0 ? weightedRoas / spendWithRoas : null;
}

// ─── Status badges ──────────────────────────────────────────────────────

const CAMPAIGN_STATUSES = new Set(["active", "paused", "deleted", "archived"]);

/**
 * Render a coloured status badge for any entity (campaign, client, event).
 * Delegates to getCampaignStatusCfg / getEventStatusCfg from status.ts.
 */
export function statusBadge(s: string) {
  const normalised = (s ?? "").toLowerCase().replace(/_/g, "");
  const cfg = CAMPAIGN_STATUSES.has(normalised)
    ? getCampaignStatusCfg(s)
    : getEventStatusCfg(s);
  const border = cfg.bg.replace("/10", "/20").replace("bg-", "border-");
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cfg.text} ${cfg.bg} ${border}`}
    >
      {cfg.label}
    </span>
  );
}

// ─── Pluralization ──────────────────────────────────────────────────────

/** Return a human-readable count string like "3 items" or "1 item". */
export function describeCount(
  n: number,
  singular: string,
  plural = `${singular}s`,
): string {
  return `${n} ${n === 1 ? singular : plural}`;
}
