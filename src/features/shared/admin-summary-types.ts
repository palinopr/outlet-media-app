import type { ActionableInvitationStatus } from "@/features/invitations/types";

export const CLIENT_SUMMARY_FIELDS = [
  "assetsNeedingReview",
  "id",
  "name",
  "slug",
  "status",
  "memberCount",
  "needsAttention",
  "connectedAccountCount",
  "connectionRiskAccounts",
  "activeCampaigns",
  "openActionItems",
  "openDiscussions",
  "pendingApprovals",
  "totalCampaigns",
  "activeShows",
  "totalSpend",
  "totalRevenue",
  "roas",
  "createdAt",
] as const;

export interface ClientSummaryLike {
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

export const USER_ROW_FIELDS = [
  "id",
  "name",
  "email",
  "role",
  "client_slug",
  "client_slugs",
  "created_at",
  "status",
  "invite_status",
] as const;

export interface UserRowLike {
  id: string;
  name: string;
  email: string;
  role: string | null;
  client_slug: string | null;
  client_slugs: string[];
  created_at: string;
  status: "active" | "invited";
  invite_status: ActionableInvitationStatus | null;
}
