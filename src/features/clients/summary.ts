export interface ClientWorkflowCounts {
  assetsNeedingReview: number;
  openActionItems: number;
  openDiscussions: number;
  pendingApprovals: number;
}

export interface ClientWorkflowHealth extends ClientWorkflowCounts {
  needsAttention: number;
}

export function buildClientWorkflowHealth(
  counts: ClientWorkflowCounts,
): ClientWorkflowHealth {
  return {
    ...counts,
    needsAttention:
      counts.pendingApprovals * 3 +
      counts.openDiscussions * 2 +
      counts.openActionItems * 2 +
      counts.assetsNeedingReview,
  };
}

export function compareClientWorkflowHealth<T extends { totalSpend: number } & ClientWorkflowHealth>(
  left: T,
  right: T,
) {
  if (right.needsAttention !== left.needsAttention) {
    return right.needsAttention - left.needsAttention;
  }

  if (right.pendingApprovals !== left.pendingApprovals) {
    return right.pendingApprovals - left.pendingApprovals;
  }

  if (right.openDiscussions !== left.openDiscussions) {
    return right.openDiscussions - left.openDiscussions;
  }

  if (right.openActionItems !== left.openActionItems) {
    return right.openActionItems - left.openActionItems;
  }

  return right.totalSpend - left.totalSpend;
}
