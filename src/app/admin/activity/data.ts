import { supabaseAdmin } from "@/lib/supabase";

export interface ActivityRow {
  id: number;
  created_at: string;
  user_id: string;
  user_email: string;
  event_type: string;
  page: string | null;
  detail: string | null;
  metadata: Record<string, unknown> | null;
}

export interface ActivityStats {
  totalToday: number;
  activeUsersToday: number;
  errorsToday: number;
  mostActivePage: string | null;
}

export interface ActivityData {
  rows: ActivityRow[];
  stats: ActivityStats;
  users: string[];
  fromDb: boolean;
}

export async function getActivity(filters: {
  user?: string | null;
  eventType?: string | null;
  range?: string | null;
}): Promise<ActivityData> {
  const empty: ActivityData = {
    rows: [],
    stats: { totalToday: 0, activeUsersToday: 0, errorsToday: 0, mostActivePage: null },
    users: [],
    fromDb: false,
  };

  if (!supabaseAdmin) return empty;

  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayIso = todayStart.toISOString();

  // Determine date filter
  let sinceIso: string | null = null;
  switch (filters.range) {
    case "today":
      sinceIso = todayIso;
      break;
    case "7d":
      sinceIso = new Date(Date.now() - 7 * 86_400_000).toISOString();
      break;
    case "30d":
      sinceIso = new Date(Date.now() - 30 * 86_400_000).toISOString();
      break;
    default:
      sinceIso = new Date(Date.now() - 7 * 86_400_000).toISOString();
  }

  // Build main query
  let query = supabaseAdmin
    .from("admin_activity")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (sinceIso) query = query.gte("created_at", sinceIso);
  if (filters.user) query = query.eq("user_email", filters.user);
  if (filters.eventType) query = query.eq("event_type", filters.eventType);

  // Fetch today's data for stats (always unfiltered by user/type)
  const [{ data: rows, error }, { data: todayRows }] = await Promise.all([
    query,
    supabaseAdmin
      .from("admin_activity")
      .select("user_email, event_type, page")
      .gte("created_at", todayIso),
  ]);

  if (error) return empty;

  // Compute stats from today's rows
  const todayData = todayRows ?? [];
  const uniqueUsers = new Set(todayData.map((r) => r.user_email));
  const errorsToday = todayData.filter((r) => r.event_type === "error").length;

  // Most active page
  const pageCounts: Record<string, number> = {};
  for (const r of todayData) {
    if (r.page) pageCounts[r.page] = (pageCounts[r.page] ?? 0) + 1;
  }
  const mostActivePage =
    Object.entries(pageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  // Distinct user emails for the filter dropdown
  const allUsersRes = await supabaseAdmin
    .from("admin_activity")
    .select("user_email")
    .limit(1000);
  const users = [...new Set((allUsersRes.data ?? []).map((r) => r.user_email))].sort();

  return {
    rows: (rows ?? []) as ActivityRow[],
    stats: {
      totalToday: todayData.length,
      activeUsersToday: uniqueUsers.size,
      errorsToday,
      mostActivePage,
    },
    users,
    fromDb: true,
  };
}
