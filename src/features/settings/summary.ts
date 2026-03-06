import type { ClientSummary } from "@/app/admin/clients/data";
import type { UserRow } from "@/app/admin/users/data";
import { compareActionableInvitationState } from "@/features/invitations/sort";
import {
  buildConnectedAccountsSummary,
  getConnectedAccountHealth,
  type ConnectedAccount,
} from "@/features/settings/connected-accounts";

export interface PlatformKeyStatus {
  configured: boolean;
}

export type PlatformSettingsMetricKey =
  | "configured_integrations"
  | "missing_integrations"
  | "client_accounts"
  | "pending_access"
  | "connections_needing_attention";

export interface PlatformSettingsMetric {
  detail: string;
  key: PlatformSettingsMetricKey;
  label: string;
  value: number;
}

export interface PlatformSettingsSummary {
  accessInvites: UserRow[];
  connectionRiskClients: Array<{
    attentionAccounts: number;
    clientId: string;
    healthyAccounts: number;
    name: string;
    slug: string;
    totalAccounts: number;
  }>;
  connectionSummary: ReturnType<typeof buildConnectedAccountsSummary>;
  clientsNeedingSetup: ClientSummary[];
  expiredInviteCount: number;
  metrics: PlatformSettingsMetric[];
  pendingInviteCount: number;
}

export function buildPlatformSettingsSummary(input: {
  apiKeys: PlatformKeyStatus[];
  clients: ClientSummary[];
  connectedAccounts: ConnectedAccount[];
  users: UserRow[];
}): PlatformSettingsSummary {
  const configuredIntegrations = input.apiKeys.filter((key) => key.configured).length;
  const missingIntegrations = input.apiKeys.length - configuredIntegrations;
  const connectionSummary = buildConnectedAccountsSummary(input.connectedAccounts);
  const accessInvites = input.users
    .filter((user) => user.status === "invited")
    .sort(
      (left, right) =>
        compareActionableInvitationState(
          left.invite_status,
          left.created_at,
          right.invite_status,
          right.created_at,
        ),
    )
    .slice(0, 5);
  const pendingInviteCount = input.users.filter(
    (user) => user.status === "invited" && user.invite_status !== "expired",
  ).length;
  const expiredInviteCount = input.users.filter(
    (user) => user.status === "invited" && user.invite_status === "expired",
  ).length;
  const clientsNeedingSetup = [...input.clients]
    .filter((client) => client.memberCount === 0 || client.needsAttention > 0)
    .sort((left, right) => {
      if (left.memberCount !== right.memberCount) return left.memberCount - right.memberCount;
      return right.needsAttention - left.needsAttention;
    })
    .slice(0, 5);
  const accountsBySlug = new Map<string, ConnectedAccount[]>();
  for (const account of input.connectedAccounts) {
    if (!account.client_slug) continue;
    const existing = accountsBySlug.get(account.client_slug) ?? [];
    existing.push(account);
    accountsBySlug.set(account.client_slug, existing);
  }
  const connectionRiskClients = input.clients
    .map((client) => {
      const accounts = accountsBySlug.get(client.slug) ?? [];
      const healthyAccounts = accounts.filter(
        (account) => getConnectedAccountHealth(account).key === "healthy",
      ).length;
      const attentionAccounts = accounts.length - healthyAccounts;

      return {
        attentionAccounts,
        clientId: client.id,
        healthyAccounts,
        name: client.name,
        slug: client.slug,
        totalAccounts: accounts.length,
      };
    })
    .filter((client) => client.attentionAccounts > 0)
    .sort((left, right) => {
      if (right.attentionAccounts !== left.attentionAccounts) {
        return right.attentionAccounts - left.attentionAccounts;
      }
      return left.name.localeCompare(right.name);
    })
    .slice(0, 5);

  return {
    accessInvites,
    connectionRiskClients,
    connectionSummary,
    clientsNeedingSetup,
    expiredInviteCount,
    metrics: [
      {
        detail: "Configured environment-backed integrations.",
        key: "configured_integrations",
        label: "Configured integrations",
        value: configuredIntegrations,
      },
      {
        detail: "Missing keys or host configuration still blocking features.",
        key: "missing_integrations",
        label: "Missing integrations",
        value: missingIntegrations,
      },
      {
        detail: "Client accounts currently tracked in Outlet.",
        key: "client_accounts",
        label: "Client accounts",
        value: input.clients.length,
      },
      {
        detail: "Open access invites plus client accounts still needing setup attention.",
        key: "pending_access",
        label: "Setup pressure",
        value: pendingInviteCount + expiredInviteCount + clientsNeedingSetup.length,
      },
      {
        detail: "Meta ad account links that are expiring, stale, or disconnected.",
        key: "connections_needing_attention",
        label: "Connection risk",
        value: connectionSummary.attentionCount,
      },
    ],
    pendingInviteCount,
  };
}
