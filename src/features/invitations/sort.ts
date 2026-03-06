import type { ActionableInvitationStatus } from "./types";

function toTimestamp(value: number | string | null | undefined) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return new Date(value).getTime();
  return 0;
}

export function invitationStatusPriority(
  status: ActionableInvitationStatus | null | undefined,
) {
  return status === "expired" ? 1 : 0;
}

export function compareActionableInvitationState(
  leftStatus: ActionableInvitationStatus | null | undefined,
  leftCreatedAt: number | string | null | undefined,
  rightStatus: ActionableInvitationStatus | null | undefined,
  rightCreatedAt: number | string | null | undefined,
) {
  const statusOrder =
    invitationStatusPriority(leftStatus) - invitationStatusPriority(rightStatus);
  if (statusOrder !== 0) return statusOrder;
  return toTimestamp(rightCreatedAt) - toTimestamp(leftCreatedAt);
}

export function countActionableInvitationStatuses(
  statuses: Array<ActionableInvitationStatus | null | undefined>,
) {
  return statuses.reduce(
    (counts, status) => {
      if (status === "expired") {
        counts.expired += 1;
      } else {
        counts.pending += 1;
      }
      return counts;
    },
    { expired: 0, pending: 0 },
  );
}
