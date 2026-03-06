import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildPromptFromDiscordMessage,
  type DiscordAttachmentInput,
} from "./message-prompt.js";

describe("buildPromptFromDiscordMessage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("builds a prompt from an attachment-only text message", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue("Dream pop market map\nMexico City\nJakarta"),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await buildPromptFromDiscordMessage("", [
      {
        contentType: "text/plain",
        name: "strategy.txt",
        size: 8_192,
        url: "https://cdn.discordapp.com/attachments/1/2/strategy.txt",
      } satisfies DiscordAttachmentInput,
    ]);

    expect(result.fallbackMessage).toBeNull();
    expect(result.prompt).toContain("Attached text context:");
    expect(result.prompt).toContain("[attached file: strategy.txt]");
    expect(result.prompt).toContain("Dream pop market map");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("returns a fallback message when the message only has unreadable attachments", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const result = await buildPromptFromDiscordMessage("", [
      {
        contentType: "application/pdf",
        name: "brief.pdf",
        size: 24_000,
        url: "https://cdn.discordapp.com/attachments/1/2/brief.pdf",
      } satisfies DiscordAttachmentInput,
    ]);

    expect(result.prompt).toBeNull();
    expect(result.fallbackMessage).toContain(
      "upload a small `.txt`, `.md`, `.json`, `.csv`, or `.tsv` file",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("keeps inline content and reports attachment notes for skipped files", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue("Audience baseline"),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await buildPromptFromDiscordMessage("Tighten this for Siana.", [
      {
        contentType: "text/plain",
        name: "baseline.txt",
        size: 1_024,
        url: "https://cdn.discordapp.com/attachments/1/2/baseline.txt",
      },
      {
        contentType: "text/plain",
        name: "oversized.txt",
        size: 200_000,
        url: "https://cdn.discordapp.com/attachments/1/2/oversized.txt",
      },
      {
        contentType: "application/pdf",
        name: "deck.pdf",
        size: 32_000,
        url: "https://cdn.discordapp.com/attachments/1/2/deck.pdf",
      },
    ] satisfies DiscordAttachmentInput[]);

    expect(result.fallbackMessage).toBeNull();
    expect(result.prompt).toContain("Tighten this for Siana.");
    expect(result.prompt).toContain("Audience baseline");
    expect(result.prompt).toContain("Attachment notes:");
    expect(result.prompt).toContain("oversized.txt: too large to ingest");
    expect(result.prompt).toContain("deck.pdf: unsupported attachment type");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
