export type ConversationThreadKind = "asset" | "campaign" | "crm" | "event";

export interface ConversationThread {
  authorName: string | null;
  clientSlug: string | null;
  content: string;
  createdAt: string;
  id: string;
  kind: ConversationThreadKind;
  targetId: string;
  targetName: string | null;
}

export interface ConversationMetric {
  detail: string;
  key:
    | "asset_threads"
    | "campaign_threads"
    | "crm_threads"
    | "event_threads"
    | "open_threads";
  label: string;
  value: number;
}

export interface ConversationsSummary {
  metrics: ConversationMetric[];
  totalThreads: number;
}

function describeCount(value: number, singular: string, plural = `${singular}s`) {
  return `${value} ${value === 1 ? singular : plural}`;
}

export function buildConversationsSummary(threads: ConversationThread[]): ConversationsSummary {
  const counts = {
    asset: threads.filter((thread) => thread.kind === "asset").length,
    campaign: threads.filter((thread) => thread.kind === "campaign").length,
    crm: threads.filter((thread) => thread.kind === "crm").length,
    event: threads.filter((thread) => thread.kind === "event").length,
  };

  return {
    metrics: [
      {
        detail: describeCount(threads.length, "open conversation"),
        key: "open_threads",
        label: "Open threads",
        value: threads.length,
      },
      {
        detail: describeCount(counts.campaign, "campaign thread"),
        key: "campaign_threads",
        label: "Campaigns",
        value: counts.campaign,
      },
      {
        detail: describeCount(counts.crm, "CRM thread"),
        key: "crm_threads",
        label: "CRM",
        value: counts.crm,
      },
      {
        detail: describeCount(counts.asset, "asset thread"),
        key: "asset_threads",
        label: "Assets",
        value: counts.asset,
      },
      {
        detail: describeCount(counts.event, "event thread"),
        key: "event_threads",
        label: "Events",
        value: counts.event,
      },
    ],
    totalThreads: threads.length,
  };
}
