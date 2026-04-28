export interface ClientSummary {
  id: string;
  name: string;
  slug: string;
  status: string;
  memberCount: number;
  needsAttention: number;
  connectedAccountCount: number;
  connectionRiskAccounts: number;
  activeCampaigns: number;
  totalCampaigns: number;
  totalSpend: number;
  totalRevenue: number;
  roas: number;
  createdAt: string;
}

export interface ClientDetail extends ClientSummary {
  brandName: string | null;
  logoAlt: string | null;
  logoUrl: string | null;
  members: ClientMember[];
  pendingInvites: ClientPendingInvite[];
  campaigns: ClientCampaign[];
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
}

export interface ClientCampaign {
  id: string;
  name: string;
  status: string;
  spend: number;
  roas: number;
}
