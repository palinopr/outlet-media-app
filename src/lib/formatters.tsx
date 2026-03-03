/**
 * Shared utility module extracted from duplicated helpers across admin and client pages.
 * All formatting logic (currency, dates, labels, status badges) lives here as the
 * single source of truth — do NOT duplicate these in page files.
 */

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
  return "$" + Math.round(n).toLocaleString("en-US");
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
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
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

// ─── Time ───────────────────────────────────────────────────────────────────

/** Human-readable time distance from an ISO timestamp. Returns "never" for null. */
export function timeAgo(iso: string | null): string {
  if (!iso) return "never";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
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

// ─── Status badges ──────────────────────────────────────────────────────────

interface BadgeEntry {
  label: string;
  classes: string;
}

const STATUS_MAP: Record<string, BadgeEntry> = {
  // Campaign / client statuses
  active:    { label: "Active",    classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  paused:    { label: "Paused",    classes: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  inactive:  { label: "Inactive",  classes: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
  archived:  { label: "Archived",  classes: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
  deleted:   { label: "Deleted",   classes: "bg-red-500/10 text-red-400 border-red-500/20" },
  // Event statuses
  onsale:    { label: "On Sale",   classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  presale:   { label: "Presale",   classes: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  soldout:   { label: "Sold Out",  classes: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  offsale:   { label: "Off Sale",  classes: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
  cancelled: { label: "Cancelled", classes: "bg-red-500/10 text-red-400 border-red-500/20" },
  published: { label: "Published", classes: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
};

const FALLBACK_BADGE: BadgeEntry = {
  label: "",
  classes: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

/**
 * Render a coloured status badge for any entity (campaign, client, event).
 * Input is normalised to lowercase with underscores stripped so that
 * "ACTIVE", "active", "on_sale", and "onsale" all resolve correctly.
 */
// ─── Campaign helpers ────────────────────────────────────────────────────

/** Format a Meta campaign objective enum into a human-readable label. */
export function fmtObjective(raw: string | null): string | null {
  if (!raw) return null;
  return raw.replace(/^OUTCOME_/, "").replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export interface SnapshotPoint {
  snapshot_date: string;
  roas: number | null;
  spend: number | null;
}

/** Compute marginal ROAS from a series of snapshot points (spend in cents). */
export function computeMarginalRoas(points: SnapshotPoint[]): number | null {
  if (points.length < 2) return null;
  const sorted = [...points].sort((a, b) => a.snapshot_date.localeCompare(b.snapshot_date));
  const first = sorted[0], last = sorted[sorted.length - 1];
  if (first.spend == null || last.spend == null || first.roas == null || last.roas == null) return null;
  const deltaSpend = (last.spend - first.spend) / 100;
  if (deltaSpend <= 0) return null;
  const revFirst = (first.spend / 100) * first.roas;
  const revLast = (last.spend / 100) * last.roas;
  return (revLast - revFirst) / deltaSpend;
}

// ─── Status badges ──────────────────────────────────────────────────────

export function statusBadge(s: string) {
  const normalised = (s ?? "").toLowerCase().replace(/_/g, "");
  const entry = STATUS_MAP[normalised] ?? { ...FALLBACK_BADGE, label: s };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${entry.classes}`}
    >
      {entry.label}
    </span>
  );
}
