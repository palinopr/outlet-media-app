import { extname } from "node:path";

export interface DiscordAttachmentInput {
  contentType: string | null;
  name: string;
  size: number;
  url: string;
}

export interface MessagePromptBuildResult {
  prompt: string | null;
  fallbackMessage: string | null;
}

const MAX_ATTACHMENTS = 3;
const MAX_ATTACHMENT_BYTES = 128 * 1024;
const MAX_ATTACHMENT_CHARS = 12_000;
const MAX_TOTAL_ATTACHMENT_CHARS = 24_000;
const ATTACHMENT_FETCH_TIMEOUT_MS = 15_000;

const TEXT_EXTENSIONS = new Set([
  ".csv",
  ".json",
  ".md",
  ".markdown",
  ".text",
  ".tsv",
  ".txt",
  ".yaml",
  ".yml",
]);

const TEXT_CONTENT_TYPES = new Set([
  "application/json",
  "application/ld+json",
  "application/xml",
  "application/yaml",
]);

function isReadableTextAttachment(attachment: DiscordAttachmentInput): boolean {
  const contentType = attachment.contentType?.split(";")[0]?.trim().toLowerCase() ?? "";
  if (contentType.startsWith("text/")) return true;
  if (TEXT_CONTENT_TYPES.has(contentType)) return true;

  return TEXT_EXTENSIONS.has(extname(attachment.name).toLowerCase());
}

function truncateText(text: string, limit: number): { text: string; truncated: boolean } {
  if (text.length <= limit) {
    return { text, truncated: false };
  }

  return {
    text: text.slice(0, Math.max(0, limit - 32)).trimEnd(),
    truncated: true,
  };
}

async function fetchAttachmentText(attachment: DiscordAttachmentInput): Promise<string> {
  const response = await fetch(attachment.url, {
    signal: AbortSignal.timeout(ATTACHMENT_FETCH_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.text();
}

export async function buildPromptFromDiscordMessage(
  content: string,
  attachments: Iterable<DiscordAttachmentInput>,
): Promise<MessagePromptBuildResult> {
  const trimmedContent = content.trim();
  const attachmentList = [...attachments];
  const readableSections: string[] = [];
  const notes: string[] = [];
  let remainingChars = MAX_TOTAL_ATTACHMENT_CHARS;

  for (const attachment of attachmentList.slice(0, MAX_ATTACHMENTS)) {
    if (!isReadableTextAttachment(attachment)) {
      notes.push(`${attachment.name}: unsupported attachment type`);
      continue;
    }

    if (attachment.size > MAX_ATTACHMENT_BYTES) {
      notes.push(`${attachment.name}: too large to ingest (${attachment.size} bytes)`);
      continue;
    }

    if (remainingChars <= 0) {
      notes.push(`${attachment.name}: omitted because the prompt attachment budget was exhausted`);
      continue;
    }

    try {
      const rawText = (await fetchAttachmentText(attachment)).replace(/\r\n/g, "\n").trim();
      if (!rawText) {
        notes.push(`${attachment.name}: empty file`);
        continue;
      }

      const limit = Math.min(MAX_ATTACHMENT_CHARS, remainingChars);
      const truncated = truncateText(rawText, limit);
      remainingChars -= truncated.text.length;

      readableSections.push([
        `[attached file: ${attachment.name}]`,
        truncated.text,
        truncated.truncated ? "[attachment truncated]" : null,
        `[end attached file: ${attachment.name}]`,
      ].filter(Boolean).join("\n"));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      notes.push(`${attachment.name}: could not be fetched (${message})`);
    }
  }

  if (attachmentList.length > MAX_ATTACHMENTS) {
    notes.push(`Ignored ${attachmentList.length - MAX_ATTACHMENTS} additional attachment(s) after the first ${MAX_ATTACHMENTS}`);
  }

  const promptSections = [trimmedContent];
  if (readableSections.length > 0) {
    promptSections.push([
      "Attached text context:",
      readableSections.join("\n\n"),
    ].join("\n\n"));
  }
  if ((trimmedContent || readableSections.length > 0) && notes.length > 0) {
    promptSections.push([
      "Attachment notes:",
      notes.map((note) => `- ${note}`).join("\n"),
    ].join("\n"));
  }

  const prompt = promptSections
    .filter(Boolean)
    .join("\n\n")
    .trim();

  if (prompt) {
    return {
      prompt,
      fallbackMessage: null,
    };
  }

  if (attachmentList.length > 0) {
    return {
      prompt: null,
      fallbackMessage: "I couldn't read that attachment. Paste the text in the message or upload a small `.txt`, `.md`, `.json`, `.csv`, or `.tsv` file.",
    };
  }

  return {
    prompt: null,
    fallbackMessage: null,
  };
}
