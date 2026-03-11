export interface ClientSummary {
  assetsNeedingReview: number;
  id: string;
  name: string;
  slug: string;
  status: string;
  memberCount: number;
  needsAttention: number;
  connectedAccountCount: number;
  connectionRiskAccounts: number;
  activeCampaigns: number;
  openActionItems: number;
  openDiscussions: number;
  pendingApprovals: number;
  totalCampaigns: number;
  activeShows: number;
  totalSpend: number;
  totalRevenue: number;
  roas: number;
  createdAt: string;
}

export interface ClientDetail extends ClientSummary {
  members: ClientMember[];
  pendingInvites: ClientPendingInvite[];
  campaigns: ClientCampaign[];
  eventsEnabled: boolean;
  events: ClientEvent[];
}

export interface ClientPendingInvite {
  id: string;
  email: string;
  createdAt: string;
  status: "pending" | "expired";
}

export interface ClientMember {
  id: string;
  clerkUserId: string;
  role: string;
  scope: string;
  name: string;
  email: string;
  createdAt: string;
  assignedCampaignIds: string[];
  assignedEventIds: string[];
}

export interface ClientEvent {
  id: string;
  name: string;
  venue: string;
  date: string;
  status: string;
}

export interface ClientCampaign {
  id: string;
  name: string;
  status: string;
  spend: number;
  roas: number;
}
