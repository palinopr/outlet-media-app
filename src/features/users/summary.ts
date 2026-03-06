import type { ClientSummary } from "@/app/admin/clients/data";
import type { UserRow } from "@/app/admin/users/data";
import { compareActionableInvitationState } from "@/features/invitations/sort";

export interface UsersAccessSummary {
  clientsNeedingCoverage: ClientSummary[];
  accessInvites: UserRow[];
  expiredInviteCount: number;
  pendingInviteCount: number;
  unassignedClientUsers: UserRow[];
}

function compareCreatedAtDesc(left: { created_at?: string | null }, right: { created_at?: string | null }) {
  return new Date(right.created_at ?? 0).getTime() - new Date(left.created_at ?? 0).getTime();
}

function compareAccessInvitePriority(left: UserRow, right: UserRow) {
  return compareActionableInvitationState(
    left.invite_status,
    left.created_at,
    right.invite_status,
    right.created_at,
  );
}

function compareClientCoverage(left: ClientSummary, right: ClientSummary) {
  if (left.memberCount !== right.memberCount) return left.memberCount - right.memberCount;
  if (left.needsAttention !== right.needsAttention) return Number(right.needsAttention) - Number(left.needsAttention);
  return left.name.localeCompare(right.name);
}

export function buildUsersAccessSummary(
  users: UserRow[],
  clients: ClientSummary[],
): UsersAccessSummary {
  const accessInvites = users
    .filter((user) => user.status === "invited")
    .sort(compareAccessInvitePriority)
    .slice(0, 5);
  const pendingInviteCount = users.filter(
    (user) => user.status === "invited" && user.invite_status !== "expired",
  ).length;
  const expiredInviteCount = users.filter(
    (user) => user.status === "invited" && user.invite_status === "expired",
  ).length;

  const unassignedClientUsers = users
    .filter(
      (user) =>
        user.status === "active" &&
        user.role !== "admin" &&
        user.client_slugs.length === 0,
    )
    .sort(compareCreatedAtDesc)
    .slice(0, 5);

  const clientsNeedingCoverage = [...clients]
    .filter((client) => client.memberCount <= 1)
    .sort(compareClientCoverage)
    .slice(0, 5);

  return {
    clientsNeedingCoverage,
    accessInvites,
    expiredInviteCount,
    pendingInviteCount,
    unassignedClientUsers,
  };
}
