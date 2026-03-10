import { beforeEach, describe, expect, it, vi } from "vitest";

const { updateGrowthPublishAttempt, sendAsAgent, notifyChannel } = vi.hoisted(() => ({
  updateGrowthPublishAttempt: vi.fn(),
  sendAsAgent: vi.fn(),
  notifyChannel: vi.fn(),
}));

vi.mock("../../services/growth-ledger-service.js", () => ({
  updateGrowthPublishAttempt,
}));

vi.mock("../../services/webhook-service.js", () => ({
  sendAsAgent,
}));

vi.mock("../core/entry.js", () => ({
  notifyChannel,
}));

import {
  TIKTOK_PUBLISH_CHANNEL,
  canConfirmGrowthPublishInChannel,
  confirmGrowthPublish,
  failGrowthPublish,
} from "./growth-publish.js";

describe("growth publish commands", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    updateGrowthPublishAttempt.mockResolvedValue({
      id: "attempt_live_1",
      platform: "tiktok",
      post_target_id: "target_1",
      status: "published",
    });
    sendAsAgent.mockResolvedValue(undefined);
    notifyChannel.mockResolvedValue(undefined);
  });

  it("limits manual publish confirmation to the TikTok publish channel", () => {
    expect(canConfirmGrowthPublishInChannel(TIKTOK_PUBLISH_CHANNEL)).toBe(true);
    expect(canConfirmGrowthPublishInChannel("general")).toBe(false);
  });

  it("marks a manual publish attempt as published and posts the outcome", async () => {
    const result = await confirmGrowthPublish({
      actorName: "Jaime",
      attemptRef: "attempt_live_1",
      channelName: TIKTOK_PUBLISH_CHANNEL,
      note: "Pinned CTA comment too.",
      platformPostId: "12345",
      publishUrl: "https://www.tiktok.com/@outletmedia/video/12345",
    });

    expect(updateGrowthPublishAttempt).toHaveBeenCalledWith({
      actorName: "Jaime",
      attemptRef: "attempt_live_1",
      note: "Pinned CTA comment too.",
      platformPostId: "12345",
      publishUrl: "https://www.tiktok.com/@outletmedia/video/12345",
      source: "discord-slash",
      status: "published",
    });
    expect(sendAsAgent).toHaveBeenCalledWith(
      "publisher-tiktok",
      TIKTOK_PUBLISH_CHANNEL,
      expect.stringContaining("Manual TikTok publish confirmed."),
    );
    expect(notifyChannel).toHaveBeenCalledWith(
      "dashboard",
      expect.stringContaining("TikTok publish live"),
    );
    expect(result.reply).toContain("published");
  });

  it("marks a manual publish attempt as failed and posts the outcome", async () => {
    updateGrowthPublishAttempt.mockResolvedValue({
      id: "attempt_live_1",
      platform: "tiktok",
      post_target_id: "target_1",
      status: "failed",
    });

    const result = await failGrowthPublish({
      actorName: "Jaime",
      attemptRef: "attempt_live_1",
      channelName: TIKTOK_PUBLISH_CHANNEL,
      errorMessage: "TikTok rejected the upload during processing.",
      note: "Will retry after exporting a fresh file.",
    });

    expect(updateGrowthPublishAttempt).toHaveBeenCalledWith({
      actorName: "Jaime",
      attemptRef: "attempt_live_1",
      errorMessage: "TikTok rejected the upload during processing.",
      note: "Will retry after exporting a fresh file.",
      source: "discord-slash",
      status: "failed",
    });
    expect(sendAsAgent).toHaveBeenCalledWith(
      "publisher-tiktok",
      TIKTOK_PUBLISH_CHANNEL,
      expect.stringContaining("TikTok publish attempt failed."),
    );
    expect(notifyChannel).toHaveBeenCalledWith(
      "dashboard",
      expect.stringContaining("TikTok publish failed"),
    );
    expect(result.reply).toContain("failed");
  });

  it("rejects publish confirmation when the URL is not a TikTok URL", async () => {
    await expect(() =>
      confirmGrowthPublish({
        actorName: "Jaime",
        attemptRef: "attempt_live_1",
        channelName: TIKTOK_PUBLISH_CHANNEL,
        publishUrl: "https://example.com/not-tiktok",
      }),
    ).rejects.toThrow("Publish URL must point to TikTok.");

    expect(updateGrowthPublishAttempt).not.toHaveBeenCalled();
    expect(sendAsAgent).not.toHaveBeenCalled();
    expect(notifyChannel).not.toHaveBeenCalled();
  });
});
