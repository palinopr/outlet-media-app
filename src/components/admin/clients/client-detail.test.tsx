import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ClientDetailView } from "./client-detail";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

afterEach(() => {
  cleanup();
});

const client = {
  activeCampaigns: 1,
  activeShows: 1,
  assetSources: [],
  assets: [
    {
      createdAt: "2026-03-01T00:00:00.000Z",
      fileName: "hero-ad.png",
      format: "image/png",
      id: "asset-1",
      labels: ["launch"],
      mediaType: "image",
      placement: "feed",
      publicUrl: null,
      status: "new",
    },
  ],
  assetsNeedingReview: 1,
  campaigns: [
    {
      id: "campaign-1",
      name: "Spring Launch",
      roas: 3.4,
      spend: 1250,
      status: "ACTIVE",
    },
  ],
  connectedAccounts: [
    {
      ad_account_id: "act_123",
      ad_account_name: "Acme Main",
      client_slug: "acme",
      connected_at: "2026-02-01T00:00:00.000Z",
      id: "acct-1",
      last_used_at: "2026-02-01T00:00:00.000Z",
      status: "active",
      token_expires_at: "2026-03-08T00:00:00.000Z",
    },
  ],
  createdAt: "2026-01-01T00:00:00.000Z",
  events: [
    {
      date: "2026-04-20",
      id: "event-1",
      name: "Arena Night",
      status: "onsale",
      venue: "United Center",
    },
  ],
  id: "client-1",
  memberCount: 1,
  members: [],
  name: "Acme Live",
  needsAttention: 3,
  openActionItems: 2,
  openDiscussions: 1,
  pendingInvites: [
    {
      createdAt: "2026-03-03T00:00:00.000Z",
      email: "invitee@acme.com",
      id: "invite-1",
      status: "pending" as const,
    },
  ],
  pendingApprovals: 1,
  roas: 3.4,
  services: [],
  slug: "acme",
  status: "active",
  totalCampaigns: 1,
  totalRevenue: 4250,
  totalSpend: 1250,
};

const opsSummary = {
  attentionCampaigns: [
    {
      attentionScore: 12,
      campaignId: "campaign-1",
      clientSlug: "acme",
      lastActivityAt: "2026-03-05T10:00:00.000Z",
      name: "Spring Launch",
      openActionItems: 2,
      openDiscussionThreads: 1,
      pendingApprovals: 1,
      recentUpdates: 2,
      status: "ACTIVE",
      urgentActionItems: 1,
    },
  ],
  campaignsNeedingAttention: 1,
  metrics: [
    {
      detail: "1 decision awaiting review",
      key: "pending_approvals" as const,
      label: "Pending approvals",
      value: 1,
    },
    {
      detail: "1 urgent item",
      key: "action_items" as const,
      label: "Urgent items",
      value: 1,
    },
    {
      detail: "1 active discussion thread",
      key: "open_discussions" as const,
      label: "Open threads",
      value: 1,
    },
    {
      detail: "2 updates in the last 7 days",
      key: "recent_updates" as const,
      label: "Recent updates",
      value: 2,
    },
  ],
  mode: "admin" as const,
};

const workQueue = {
  items: [
    {
      assigneeName: "Casey",
      clientSlug: "acme",
      contextId: "campaign-1",
      contextLabel: "Spring Launch",
      description: "Confirm creative rotation.",
      dueDate: "2026-03-08",
      href: "/admin/campaigns/campaign-1",
      id: "queue-1",
      kind: "campaign_action" as const,
      priority: "urgent" as const,
      status: "review" as const,
      title: "Approve launch ads",
      updatedAt: "2026-03-05T10:00:00.000Z",
    },
  ],
  metrics: [
    {
      detail: "Cross-app next steps still in motion.",
      key: "open_items" as const,
      label: "Open items",
      value: 1,
    },
    {
      detail: "High-pressure work that should move first.",
      key: "urgent_items" as const,
      label: "Urgent",
      value: 1,
    },
    {
      detail: "Items waiting for decisions or sign-off.",
      key: "in_review" as const,
      label: "In review",
      value: 1,
    },
    {
      detail: "Due within the next three days or overdue.",
      key: "due_soon" as const,
      label: "Due soon",
      value: 1,
    },
  ],
};

const recentActivity = [
  {
    actorId: "user-1",
    actorName: "Casey",
    actorType: "user" as const,
    clientSlug: "acme",
    createdAt: "2026-03-05T12:00:00.000Z",
    detail: "Creative review requested by the media team.",
    entityId: "campaign-1",
    entityType: "campaign",
    eventName: "approval_requested",
    id: "event-1",
    metadata: {
      campaignId: "campaign-1",
      campaignName: "Spring Launch",
    },
    pageId: null,
    summary: "Approval requested for Spring Launch",
    taskId: null,
    visibility: "shared" as const,
  },
];

const eventOperations = {
  attentionEvents: [
    {
      attentionScore: 7,
      clientSlug: "acme",
      date: "2026-04-20",
      eventId: "event-1",
      lastActivityAt: "2026-03-05T11:00:00.000Z",
      name: "Arena Night",
      openDiscussions: 1,
      openFollowUps: 2,
      recentUpdates: 1,
      status: "onsale",
      urgentFollowUps: 1,
      venue: "United Center",
    },
  ],
  eventsNeedingAttention: 1,
  metrics: [
    {
      detail: "2 event next steps",
      key: "open_follow_ups" as const,
      label: "Open follow-ups",
      value: 2,
    },
    {
      detail: "1 urgent event item",
      key: "urgent_follow_ups" as const,
      label: "Urgent follow-ups",
      value: 1,
    },
    {
      detail: "1 active event thread",
      key: "open_discussions" as const,
      label: "Open discussions",
      value: 1,
    },
    {
      detail: "1 event update in the last 7 days",
      key: "recent_updates" as const,
      label: "Recent updates",
      value: 1,
    },
  ],
};

const crmOverview = {
  clients: [],
  contacts: [
    {
      clientSlug: "acme",
      company: "Acme Live",
      createdAt: "2026-03-01T00:00:00.000Z",
      email: "casey@acme.com",
      fullName: "Casey Rivera",
      id: "contact-1",
      lastContactedAt: "2026-03-04T10:00:00.000Z",
      leadScore: 88,
      lifecycleStage: "customer" as const,
      nextFollowUpAt: "2026-03-09T10:00:00.000Z",
      notes: "Needs final approval on launch plan.",
      ownerName: "Jaime",
      phone: "555-111-2222",
      source: "Referral",
      tags: ["vip"],
      updatedAt: "2026-03-05T10:00:00.000Z",
      visibility: "shared" as const,
    },
  ],
  recentContacts: [
    {
      clientSlug: "acme",
      company: "Acme Live",
      createdAt: "2026-03-01T00:00:00.000Z",
      email: "casey@acme.com",
      fullName: "Casey Rivera",
      id: "contact-1",
      lastContactedAt: "2026-03-04T10:00:00.000Z",
      leadScore: 88,
      lifecycleStage: "customer" as const,
      nextFollowUpAt: "2026-03-09T10:00:00.000Z",
      notes: "Needs final approval on launch plan.",
      ownerName: "Jaime",
      phone: "555-111-2222",
      source: "Referral",
      tags: ["vip"],
      updatedAt: "2026-03-05T10:00:00.000Z",
      visibility: "shared" as const,
    },
  ],
  recentEvents: recentActivity,
  summary: {
    dueFollowUps: 1,
    hotContacts: 1,
    sharedContacts: 1,
    stageBreakdown: [
      {
        count: 1,
        label: "Customer",
        stage: "customer" as const,
      },
    ],
    totalContacts: 1,
  },
  upcomingFollowUps: [
    {
      clientSlug: "acme",
      company: "Acme Live",
      createdAt: "2026-03-01T00:00:00.000Z",
      email: "casey@acme.com",
      fullName: "Casey Rivera",
      id: "contact-1",
      lastContactedAt: "2026-03-04T10:00:00.000Z",
      leadScore: 88,
      lifecycleStage: "customer" as const,
      nextFollowUpAt: "2026-03-09T10:00:00.000Z",
      notes: "Needs final approval on launch plan.",
      ownerName: "Jaime",
      phone: "555-111-2222",
      source: "Referral",
      tags: ["vip"],
      updatedAt: "2026-03-05T10:00:00.000Z",
      visibility: "shared" as const,
    },
  ],
};

const crmFollowUpItems = [
  {
    assigneeId: null,
    assigneeName: "Jaime",
    clientSlug: "acme",
    contactId: "contact-1",
    contactName: "Casey Rivera",
    createdAt: "2026-03-05T10:00:00.000Z",
    createdBy: "user-1",
    description: "Call to confirm approval timing.",
    dueDate: "2026-03-09",
    id: "crm-follow-up-1",
    position: 0,
    priority: "high" as const,
    sourceEntityId: null,
    sourceEntityType: null,
    status: "todo" as const,
    title: "Confirm launch approval",
    updatedAt: "2026-03-05T10:00:00.000Z",
    visibility: "shared" as const,
  },
];

const crmDiscussions = [
  {
    authorName: "Casey",
    clientSlug: "acme",
    contactId: "contact-1",
    contactName: "Casey Rivera",
    content: "Can we move the approval deadline to Friday?",
    createdAt: "2026-03-05T10:00:00.000Z",
    id: "crm-thread-1",
  },
];

describe("ClientDetailView", () => {
  it("defaults to the operating overview tab", () => {
    render(
      <ClientDetailView
        agentOutcomes={[]}
        client={client}
        crmDiscussions={crmDiscussions}
        crmFollowUpItems={crmFollowUpItems}
        crmOverview={crmOverview}
        eventOperations={eventOperations}
        opsSummary={opsSummary}
        recentActivity={recentActivity}
        workQueue={workQueue}
      />,
    );

    expect(screen.getByText("Client workflow overview")).toBeInTheDocument();
    expect(screen.getByText("Client work queue")).toBeInTheDocument();
    expect(screen.getByText("Connection health")).toBeInTheDocument();
    expect(screen.getByText("Acme Main")).toBeInTheDocument();
    expect(screen.getByText("acme activity")).toBeInTheDocument();
  });

  it("renders event operations when the Events tab is selected", () => {
    render(
      <ClientDetailView
        agentOutcomes={[]}
        client={client}
        crmDiscussions={crmDiscussions}
        crmFollowUpItems={crmFollowUpItems}
        crmOverview={crmOverview}
        eventOperations={eventOperations}
        opsSummary={opsSummary}
        recentActivity={recentActivity}
        workQueue={workQueue}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Events/i }));

    expect(screen.getByText("Event operations")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Arena Night" })).toHaveAttribute(
      "href",
      "/admin/events/event-1",
    );
  });

  it("renders CRM workflow when the CRM tab is selected", () => {
    render(
      <ClientDetailView
        agentOutcomes={[]}
        client={client}
        crmDiscussions={crmDiscussions}
        crmFollowUpItems={crmFollowUpItems}
        crmOverview={crmOverview}
        eventOperations={eventOperations}
        opsSummary={opsSummary}
        recentActivity={recentActivity}
        workQueue={workQueue}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /CRM/i }));

    expect(screen.getByText("CRM next steps")).toBeInTheDocument();
    expect(screen.getByText("Relationship discussion")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Casey Rivera" })).toHaveAttribute(
      "href",
      "/admin/crm/contact-1",
    );
  });

  it("renders pending invites on the Members tab", () => {
    render(
      <ClientDetailView
        agentOutcomes={[]}
        client={client}
        crmDiscussions={crmDiscussions}
        crmFollowUpItems={crmFollowUpItems}
        crmOverview={crmOverview}
        eventOperations={eventOperations}
        opsSummary={opsSummary}
        recentActivity={recentActivity}
        workQueue={workQueue}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Members/i }));

    expect(screen.getByText("Access invites")).toBeInTheDocument();
    expect(screen.getByText("invitee@acme.com")).toBeInTheDocument();
    expect(screen.getByText("1 pending • 0 expired")).toBeInTheDocument();
  });
});
