export type ActionableInvitationStatus = "pending" | "expired";

export interface ActionableInvitation {
  clientRole: string | null;
  clientSlug: string | null;
  createdAt: string;
  email: string;
  id: string;
  role: string | null;
  status: ActionableInvitationStatus;
}
