import type { TaskPriority } from "@/lib/workspace-types";

export type EventOperationsMetricKey =
  | "open_follow_ups"
  | "urgent_follow_ups"
  | "open_discussions"
  | "recent_updates";

export interface EventOperationsMetric {
  detail: string;
  key: EventOperationsMetricKey;
  label: string;
  value: number;
}

export interface EventOperationsEventRecord {
  clientSlug: string | null;
  date: string | null;
  eventId: string;
  name: string;
  status: string | null;
  venue: string | null;
}

export interface EventOperationsFollowUpRecord {
  clientSlug: string | null;
  eventId: string;
  priority: TaskPriority;
  updatedAt: string;
}

export interface EventOperationsCommentRecord {
  clientSlug: string | null;
  createdAt: string;
  eventId: string;
}

export interface EventOperationsUpdateRecord {
  clientSlug: string | null;
  createdAt: string;
  eventId: string;
}

export interface EventAttentionRecord {
  attentionScore: number;
  clientSlug: string | null;
  date: string | null;
  eventId: string;
  lastActivityAt: string | null;
  name: string;
  openDiscussions: number;
  openFollowUps: number;
  recentUpdates: number;
  status: string | null;
  urgentFollowUps: number;
  venue: string | null;
}

export interface EventOperationsSummary {
  attentionEvents: EventAttentionRecord[];
  eventsNeedingAttention: number;
  metrics: EventOperationsMetric[];
}

interface BuildEventOperationsSummaryInput {
  comments: EventOperationsCommentRecord[];
  events: EventOperationsEventRecord[];
  followUps: EventOperationsFollowUpRecord[];
  limit?: number;
  updates: EventOperationsUpdateRecord[];
}

function describeCount(value: number, singular: string, plural = `${singular}s`) {
  return `${value} ${value === 1 ? singular : plural}`;
}

function sortDateDesc(a: string | null, b: string | null) {
  return new Date(b ?? 0).getTime() - new Date(a ?? 0).getTime();
}

function ensureAggregate(
  aggregates: Map<string, EventAttentionRecord>,
  event: EventOperationsEventRecord,
) {
  const existing = aggregates.get(event.eventId);
  if (existing) return existing;

  const created: EventAttentionRecord = {
    attentionScore: 0,
    clientSlug: event.clientSlug,
    date: event.date,
    eventId: event.eventId,
    lastActivityAt: null,
    name: event.name,
    openDiscussions: 0,
    openFollowUps: 0,
    recentUpdates: 0,
    status: event.status,
    urgentFollowUps: 0,
    venue: event.venue,
  };
  aggregates.set(event.eventId, created);
  return created;
}

function bumpLastActivity(record: EventAttentionRecord, timestamp: string) {
  if (!record.lastActivityAt || new Date(timestamp).getTime() > new Date(record.lastActivityAt).getTime()) {
    record.lastActivityAt = timestamp;
  }
}

export function buildEventOperationsSummary(
  input: BuildEventOperationsSummaryInput,
): EventOperationsSummary {
  const aggregates = new Map<string, EventAttentionRecord>();

  for (const event of input.events) {
    ensureAggregate(aggregates, event);
  }

  for (const followUp of input.followUps) {
    const aggregate =
      aggregates.get(followUp.eventId) ??
      ensureAggregate(aggregates, {
        clientSlug: followUp.clientSlug,
        date: null,
        eventId: followUp.eventId,
        name: `Event ${followUp.eventId.slice(0, 8)}`,
        status: null,
        venue: null,
      });

    aggregate.openFollowUps += 1;
    if (followUp.priority === "urgent") {
      aggregate.urgentFollowUps += 1;
    }
    bumpLastActivity(aggregate, followUp.updatedAt);
  }

  for (const comment of input.comments) {
    const aggregate =
      aggregates.get(comment.eventId) ??
      ensureAggregate(aggregates, {
        clientSlug: comment.clientSlug,
        date: null,
        eventId: comment.eventId,
        name: `Event ${comment.eventId.slice(0, 8)}`,
        status: null,
        venue: null,
      });

    aggregate.openDiscussions += 1;
    bumpLastActivity(aggregate, comment.createdAt);
  }

  for (const update of input.updates) {
    const aggregate =
      aggregates.get(update.eventId) ??
      ensureAggregate(aggregates, {
        clientSlug: update.clientSlug,
        date: null,
        eventId: update.eventId,
        name: `Event ${update.eventId.slice(0, 8)}`,
        status: null,
        venue: null,
      });

    aggregate.recentUpdates += 1;
    bumpLastActivity(aggregate, update.createdAt);
  }

  const ranked = [...aggregates.values()]
    .map((event) => ({
      ...event,
      attentionScore:
        event.urgentFollowUps * 4 +
        Math.max(event.openFollowUps - event.urgentFollowUps, 0) * 2 +
        event.openDiscussions * 2 +
        Math.min(event.recentUpdates, 5),
    }))
    .filter((event) => event.attentionScore > 0)
    .sort((a, b) => {
      if (b.attentionScore !== a.attentionScore) {
        return b.attentionScore - a.attentionScore;
      }
      return sortDateDesc(a.lastActivityAt, b.lastActivityAt);
    });

  const openFollowUps = input.followUps.length;
  const urgentFollowUps = input.followUps.filter((item) => item.priority === "urgent").length;
  const openDiscussions = input.comments.length;
  const recentUpdates = input.updates.length;

  return {
    attentionEvents: ranked.slice(0, input.limit ?? 6),
    eventsNeedingAttention: ranked.length,
    metrics: [
      {
        key: "open_follow_ups",
        label: "Open follow-ups",
        value: openFollowUps,
        detail: describeCount(openFollowUps, "event next step"),
      },
      {
        key: "urgent_follow_ups",
        label: "Urgent follow-ups",
        value: urgentFollowUps,
        detail: describeCount(urgentFollowUps, "urgent event item"),
      },
      {
        key: "open_discussions",
        label: "Open discussions",
        value: openDiscussions,
        detail: describeCount(openDiscussions, "active event thread"),
      },
      {
        key: "recent_updates",
        label: "Recent updates",
        value: recentUpdates,
        detail: describeCount(recentUpdates, "event update in the last 7 days"),
      },
    ],
  };
}
