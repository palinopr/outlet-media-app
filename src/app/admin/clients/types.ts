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

export interface ClientAsset {
  id: string;
  fileName: string;
  publicUrl: string | null;
  mediaType: string;
  placement: string | null;
  format: string | null;
  labels: string[];
  status: string;
  createdAt: string;
}

export interface ClientAssetSource {
  id: string;
  provider: string;
  folderUrl: string;
  folderName: string | null;
  lastSyncedAt: string | null;
  fileCount: number;
}

export interface ClientDetail extends ClientSummary {
  members: ClientMember[];
  pendingInvites: ClientPendingInvite[];
  connectedAccounts: import("@/features/settings/connected-accounts").ConnectedAccount[];
  campaigns: ClientCampaign[];
  eventsEnabled: boolean;
  events: ClientEvent[];
  assets: ClientAsset[];
  assetSources: ClientAssetSource[];
  services: import("@/lib/client-services").ClientService[];
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
