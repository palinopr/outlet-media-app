import type { ClientSummary } from "@/app/admin/clients/data";
import type { UserRow } from "@/app/admin/users/data";
import { compareActionableInvitationState } from "@/features/invitations/sort";

export interface PlatformKeyStatus {
  configured: boolean;
}

export type PlatformSettingsMetricKey =
  | "configured_integrations"
  | "missing_integrations"
  | "client_accounts"
  | "pending_access";

export interface PlatformSettingsMetric {
  detail: string;
  key: PlatformSettingsMetricKey;
  label: string;
  value: number;
}

export interface PlatformSettingsSummary {
  accessInvites: UserRow[];
  clientsNeedingSetup: ClientSummary[];
  expiredInviteCount: number;
  metrics: PlatformSettingsMetric[];
  pendingInviteCount: number;
}

export function buildPlatformSettingsSummary(input: {
  apiKeys: PlatformKeyStatus[];
  clients: ClientSummary[];
  users: UserRow[];
}): PlatformSettingsSummary {
  const configuredIntegrations = input.apiKeys.filter((key) => key.configured).length;
  const missingIntegrations = input.apiKeys.length - configuredIntegrations;
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

  return {
    accessInvites,
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
    ],
    pendingInviteCount,
  };
}
