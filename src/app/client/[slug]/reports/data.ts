import type { ScopeFilter } from "@/lib/member-access";
export type { ReportsSummary } from "@/features/reports/summary";
export type { ReportsData } from "@/features/reports/server";
import { getReportsData as getSharedReportsData } from "@/features/reports/server";

export async function getReportsData(
  slug: string,
  scope?: ScopeFilter,
) {
  return getSharedReportsData({
    clientSlug: slug,
    scope,
  });
}
