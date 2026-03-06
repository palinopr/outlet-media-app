import type { ClientSummary } from "@/app/admin/clients/data";
import type { UserRow } from "@/app/admin/users/data";

export interface UsersAccessSummary {
  clientsNeedingCoverage: ClientSummary[];
  pendingInvites: UserRow[];
  unassignedClientUsers: UserRow[];
}

function compareCreatedAtDesc(left: { created_at?: string | null }, right: { created_at?: string | null }) {
  return new Date(right.created_at ?? 0).getTime() - new Date(left.created_at ?? 0).getTime();
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
  const pendingInvites = users
    .filter((user) => user.status === "invited")
    .sort(compareCreatedAtDesc)
    .slice(0, 5);

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
    pendingInvites,
    unassignedClientUsers,
  };
}
