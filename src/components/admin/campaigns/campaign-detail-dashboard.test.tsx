import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CampaignDetailDashboard } from "./campaign-detail-dashboard";
import type { CampaignOperatingData } from "@/features/campaigns/server";

const data = {
  actionItems: [
    {
      id: "action_1",
      campaignId: "campaign_1",
      clientSlug: "zamora",
      title: "Refresh weekend creative rotation",
      description: "Swap in the new Barcelona short-form cut before Friday.",
      status: "review",
      priority: "high",
      visibility: "shared",
      assigneeId: null,
      assigneeName: "Jaime",
      dueDate: "2026-04-05",
      createdBy: "system",
      position: 0,
      sourceEntityId: null,
      sourceEntityType: null,
      createdAt: "2026-04-03T10:00:00.000Z",
      updatedAt: "2026-04-03T10:00:00.000Z",
    },
  ],
  approvals: [
    {
      id: "approval_1",
      createdAt: "2026-04-03T09:00:00.000Z",
      updatedAt: "2026-04-03T09:00:00.000Z",
      clientSlug: "zamora",
      audience: "shared",
      requestType: "creative_review",
      status: "pending",
      title: "Approve Barcelona launch creative",
      summary: "Need client sign-off before publishing the new cut.",
      entityType: "campaign",
      entityId: "campaign_1",
      pageId: null,
      taskId: null,
      requestedById: null,
      requestedByName: "Outlet Team",
      decidedById: null,
      decidedByName: null,
      decidedAt: null,
      decisionNote: null,
      metadata: {},
    },
  ],
  assets: [
    {
      id: "asset_1",
      fileName: "barcelona-story-v2.mp4",
      publicUrl: null,
      mediaType: "video",
      placement: "story",
      format: "mp4",
      folder: "barcelona",
      labels: [],
      status: "ready",
      createdAt: "2026-04-03T08:00:00.000Z",
      width: 1080,
      height: 1920,
    },
  ],
  campaign: {
    campaignId: "campaign_1",
    name: "Don Omar Barcelona",
    status: "active",
    objective: "sales",
    clientSlug: "zamora",
    campaignType: "sales",
    spend: 4200,
    roas: 3.4,
    revenue: 14280,
    impressions: 120000,
    clicks: 4200,
    ctr: 3.5,
    cpc: 1,
    cpm: 35,
    dailyBudget: 500,
    startTime: "2026-03-25",
  },
  linkedEvents: [
    {
      id: "event_1",
      avgTicketPrice: 86,
      artist: "Don Omar",
      city: "Barcelona",
      clientSlug: "zamora",
      date: "2026-04-18",
      gross: 120000,
      name: "Barcelona Arena Night",
      status: "onsale",
      ticketsAvailable: 2200,
      ticketsSold: 1800,
      tm1Number: "TM1-123",
      updatedAt: "2026-04-03T07:00:00.000Z",
      url: null,
      venue: "Palau Sant Jordi",
    },
  ],
  systemEvents: [
    {
      id: "eventlog_1",
      createdAt: "2026-04-03T12:00:00.000Z",
      occurredAt: "2026-04-03T12:00:00.000Z",
      eventName: "campaign_action_item_created",
      eventVersion: 1,
      visibility: "shared",
      actorType: "system",
      actorId: null,
      actorName: "Outlet Team",
      clientSlug: "zamora",
      source: "app",
      summary: "Created campaign action item",
      detail: "Added a concise next step for the team.",
      entityType: "campaign",
      entityId: "campaign_1",
      pageId: null,
      taskId: null,
      correlationId: null,
      causationId: null,
      idempotencyKey: null,
      metadata: {},
    },
  ],
} satisfies CampaignOperatingData;

describe("CampaignDetailDashboard", () => {
  it("renders real operating sections and removes the placeholder dashboard copy", () => {
    render(<CampaignDetailDashboard data={data} />);

    expect(screen.getByRole("heading", { name: "Pending approvals" })).toBeInTheDocument();
    expect(screen.getByText("Approve Barcelona launch creative")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Action items" })).toBeInTheDocument();
    expect(screen.getByText("Refresh weekend creative rotation")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Linked events" })).toBeInTheDocument();
    expect(screen.getByText("Barcelona Arena Night")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Recent activity" })).toBeInTheDocument();
    expect(screen.getByText("Created campaign action item")).toBeInTheDocument();

    expect(screen.queryByText("Campaign Intelligence Brief")).not.toBeInTheDocument();
    expect(screen.queryByText("Performance Timeline")).not.toBeInTheDocument();
    expect(screen.queryByText("AI Helper / Ask Outlet")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Unresolved discussion" })).not.toBeInTheDocument();
  });
});
