export interface ClientAccountHealth {
  connectedAccountCount: number;
  connectionRiskAccounts: number;
  needsAttention: number;
}

export function getClientAttentionPressure(
  counts: Pick<ClientAccountHealth, "connectionRiskAccounts" | "needsAttention">,
) {
  return counts.needsAttention + counts.connectionRiskAccounts * 3;
}

export function hasClientAttention(
  counts: Pick<ClientAccountHealth, "connectionRiskAccounts" | "needsAttention">,
) {
  return getClientAttentionPressure(counts) > 0;
}

export function compareClientAccountHealth<
  T extends { name: string; totalSpend: number } & ClientAccountHealth,
>(left: T, right: T) {
  const rightPressure = getClientAttentionPressure(right);
  const leftPressure = getClientAttentionPressure(left);

  if (rightPressure !== leftPressure) {
    return rightPressure - leftPressure;
  }

  if (right.connectionRiskAccounts !== left.connectionRiskAccounts) {
    return right.connectionRiskAccounts - left.connectionRiskAccounts;
  }

  if (right.totalSpend !== left.totalSpend) {
    return right.totalSpend - left.totalSpend;
  }

  return left.name.localeCompare(right.name);
}
