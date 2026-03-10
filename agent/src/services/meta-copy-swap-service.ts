import { withResourceLocks } from "../state.js";
import { toErrorMessage } from "../utils/error-helpers.js";

const META_API_VERSION = process.env.META_API_VERSION ?? "v21.0";
const META_WRITE_RESOURCE = "meta-ads-write";

type MetaAdStatus = "ACTIVE" | "PAUSED";

export interface ScheduledCopySwapParams {
  activateAdId?: string;
  activateLabel?: string;
  campaignName?: string;
  city?: string;
  pauseAdId?: string;
  pauseLabel?: string;
}

interface ValidatedCopySwapParams {
  activateAdId: string;
  activateLabel?: string;
  campaignName?: string;
  city?: string;
  pauseAdId: string;
  pauseLabel?: string;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function validateCopySwapParams(rawParams: Record<string, unknown>): ValidatedCopySwapParams {
  const activateAdId = readString(rawParams.activateAdId);
  const pauseAdId = readString(rawParams.pauseAdId);

  if (!activateAdId || !pauseAdId) {
    throw new Error(
      "Scheduled copy swap is missing ad IDs. Use `/schedule-copy-swap` or provide both activate and pause ad IDs.",
    );
  }

  if (activateAdId === pauseAdId) {
    throw new Error("Scheduled copy swap requires two different ad IDs.");
  }

  return {
    activateAdId,
    activateLabel: readString(rawParams.activateLabel),
    campaignName: readString(rawParams.campaignName),
    city: readString(rawParams.city),
    pauseAdId,
    pauseLabel: readString(rawParams.pauseLabel),
  };
}

function getMetaAccessToken(): string {
  const token = process.env.META_ACCESS_TOKEN?.trim();
  if (!token) {
    throw new Error("META_ACCESS_TOKEN is not configured.");
  }

  return token;
}

async function setAdStatus(adId: string, status: MetaAdStatus, accessToken: string): Promise<void> {
  const body = new URLSearchParams({
    access_token: accessToken,
    status,
  });

  const response = await fetch(`https://graph.facebook.com/${META_API_VERSION}/${adId}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const payload = await response.json().catch(() => ({})) as {
    error?: { message?: string };
    success?: boolean;
  };

  if (!response.ok || payload.error) {
    const message = payload.error?.message ?? `Meta API returned ${response.status}`;
    throw new Error(`${status} ${adId} failed: ${message}`);
  }

  if (payload.success !== true) {
    throw new Error(`${status} ${adId} did not return success.`);
  }
}

function formatAdLabel(label: string | undefined, adId: string): string {
  return label ? `${label} (\`${adId}\`)` : `\`${adId}\``;
}

function buildContextLabel(params: ValidatedCopySwapParams): string {
  const parts = [params.campaignName, params.city].filter(Boolean);
  return parts.length > 0 ? ` for ${parts.join(" / ")}` : "";
}

export async function executeScheduledCopySwap(
  taskId: string,
  rawParams: Record<string, unknown>,
): Promise<{
  activateAdId: string;
  pauseAdId: string;
  rollbackPerformed: boolean;
  text: string;
}> {
  const params = validateCopySwapParams(rawParams);
  const accessToken = getMetaAccessToken();

  return await withResourceLocks(taskId, [META_WRITE_RESOURCE], async () => {
    let activateSucceeded = false;
    let rollbackPerformed = false;

    try {
      await setAdStatus(params.activateAdId, "ACTIVE", accessToken);
      activateSucceeded = true;

      await setAdStatus(params.pauseAdId, "PAUSED", accessToken);

      return {
        activateAdId: params.activateAdId,
        pauseAdId: params.pauseAdId,
        rollbackPerformed,
        text: [
          `Executed scheduled copy swap${buildContextLabel(params)}.`,
          `Activated ${formatAdLabel(params.activateLabel, params.activateAdId)}.`,
          `Paused ${formatAdLabel(params.pauseLabel, params.pauseAdId)}.`,
        ].join("\n"),
      };
    } catch (error) {
      const message = toErrorMessage(error);

      if (activateSucceeded) {
        try {
          await setAdStatus(params.activateAdId, "PAUSED", accessToken);
          rollbackPerformed = true;
        } catch (rollbackError) {
          const rollbackMessage = toErrorMessage(rollbackError);
          throw new Error(
            `Scheduled copy swap failed after activating ${params.activateAdId}; rollback also failed: ${rollbackMessage}. Root error: ${message}`,
          );
        }

        throw new Error(
          `Scheduled copy swap failed after activating ${params.activateAdId}; reverted the new ad back to PAUSED. Root error: ${message}`,
        );
      }

      throw new Error(`Scheduled copy swap failed before completion: ${message}`);
    }
  });
}
