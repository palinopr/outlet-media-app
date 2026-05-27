import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

export const PRIVATE_ROOT = path.join(process.cwd(), ".local/zamora-gmail");
export const RAW_THREADS_DIR = path.join(PRIVATE_ROOT, "raw-threads");
export const ATTACHMENTS_DIR = path.join(PRIVATE_ROOT, "attachments");
export const MANIFEST_PATH = path.join(PRIVATE_ROOT, "manifest.json");
export const REPORTS_DIR = path.join(PRIVATE_ROOT, "reports");
export const VAULT_ROOT = process.env.DIA_VAULT_ROOT || "/Users/jaimeortiz/projects/Oulet Media Memory/Outlet Media Memory";
export const RAW_INBOX = path.join(VAULT_ROOT, "50 Sources/Raw Inbox");

export function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export function decodeBase64Url(data) {
  return Buffer.from(data.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

export function redactCodes(value = "") {
  return String(value)
    .replace(/\b(one[-\s]?time code|verification code|security code|passcode|otp)[:\s-]*\d{4,8}\b/gi, "$1 [redacted-code]")
    .replace(/\b\d{4,8}\b(?=\s*(?:is your|was your)?\s*(?:one[-\s]?time|verification|security|login|sign[-\s]?in)\s*code\b)/gi, "[redacted-code]");
}

export function sanitizeText(value = "") {
  return redactCodes(value)
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]")
    .replace(/\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/g, "[redacted-phone]")
    .replace(/https?:\/\/\S+/gi, "[redacted-url]")
    .replace(/\s+/g, " ")
    .trim();
}

export function safeFile(value) {
  return sanitizeText(value)
    .replace(/[/:\\?%*"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 140) || "gmail-thread";
}

export function headersFromMessage(message) {
  return Object.fromEntries((message.payload?.headers ?? []).map((header) => [header.name.toLowerCase(), header.value]));
}

export function getHeader(headers, name) {
  return headers[name.toLowerCase()] ?? "";
}

export function walkParts(payload, parts = []) {
  if (!payload) return parts;
  parts.push(payload);
  for (const part of payload.parts ?? []) walkParts(part, parts);
  return parts;
}

export function isDocumentAttachment(part) {
  if (!part.filename || !part.body?.attachmentId) return false;
  if (/^(application\/|text\/csv)/.test(part.mimeType ?? "")) return true;
  return /\.(pdf|doc|docx|xls|xlsx|csv|ppt|pptx|txt|rtf|zip|ics)$/i.test(part.filename);
}

export function categoryLabels(subject, attachmentCount) {
  const s = String(subject || "").toLowerCase();
  const out = ["Zamora/Inbox Review"];
  if (/security|one-time code|code/.test(s)) out.push("Zamora/Security");
  if (/information|i-9|w-4/.test(s) || attachmentCount > 1) out.push("Zamora/Documents");
  if (/invitation|meeting|recording|revision|touring|api tm/.test(s)) out.push("Zamora/Meetings");
  if (/tm1|digital director|bienvenida|welcome/.test(s)) out.push("Zamora/Access & Tools");
  if (/montaner|bronco|tigres|arjona|fifa|tour|marketing|mkt|campaign|campa|spreadsheet shared|presentation shared/.test(s)) out.push("Zamora/Tour Marketing");
  if (/get the official gmail|tips for/.test(s)) out.push("Zamora/Archive Reviewed");
  return [...new Set(out)];
}

export function isEphemeralSecuritySubject(subject = "") {
  return /\b(one-time code|verification code|security code|passcode|otp|security alert)\b/i.test(String(subject || ""));
}

export function needsReply(thread) {
  const messages = thread.messages ?? [];
  const last = headersFromMessage(messages.at(-1) ?? {});
  const from = getHeader(last, "from");
  const subject = getHeader(last, "subject").toLowerCase();
  if (/jaime\.ortiz@zamorausa\.com/i.test(from)) return false;
  if (/no-?reply|noreply|google|calendar-notification|drive-shares/i.test(from)) return false;
  if (/invitation|notification|security|one-time code|spreadsheet shared|presentation shared|get the official gmail|tips for/.test(subject)) return false;
  return true;
}

export async function getAccessToken() {
  const body = new URLSearchParams({
    client_id: requireEnv("ZAMORA_GOOGLE_CLIENT_ID"),
    client_secret: requireEnv("ZAMORA_GOOGLE_CLIENT_SECRET"),
    refresh_token: requireEnv("ZAMORA_GOOGLE_REFRESH_TOKEN"),
    grant_type: "refresh_token",
  });
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", body });
  const json = await response.json();
  if (!response.ok || !json.access_token) throw new Error(`OAuth refresh failed: ${json.error_description ?? json.error ?? response.statusText}`);
  return json.access_token;
}

export async function gmailFetch(accessToken, url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Gmail API ${response.status}: ${json.error?.message ?? response.statusText}`);
  return json;
}

export async function assertZamoraProfile(accessToken) {
  const profile = await gmailFetch(accessToken, "https://gmail.googleapis.com/gmail/v1/users/me/profile");
  if (profile.emailAddress !== requireEnv("ZAMORA_GMAIL_USER")) {
    throw new Error(`Wrong Gmail profile: expected ${requireEnv("ZAMORA_GMAIL_USER")}, got ${profile.emailAddress}`);
  }
  return profile;
}

export async function listAllMessages(accessToken, query = "") {
  const messages = [];
  let pageToken;
  do {
    const url = new URL("https://gmail.googleapis.com/gmail/v1/users/me/messages");
    url.searchParams.set("maxResults", "500");
    if (query) url.searchParams.set("q", query);
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const page = await gmailFetch(accessToken, url);
    messages.push(...(page.messages ?? []));
    pageToken = page.nextPageToken;
  } while (pageToken);
  return messages;
}

export async function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) return { ingestedThreads: {} };
  return JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
}

export async function saveManifest(manifest) {
  await mkdir(PRIVATE_ROOT, { recursive: true });
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

export function compactThreadMeta(manifest) {
  return Object.entries(manifest.ingestedThreads ?? {})
    .map(([threadId, meta]) => ({
      threadId,
      subject: meta.subject,
      messageCount: meta.messageCount ?? 0,
      attachmentCount: meta.attachmentCount ?? 0,
      firstDate: meta.firstDate,
      lastDate: meta.lastDate,
      rawInboxPath: meta.rawInboxPath,
      needsReply: meta.needsReply ?? false,
      labels: meta.labels ?? [],
      updatedAt: meta.updatedAt,
    }))
    .sort((a, b) => String(b.lastDate ?? "").localeCompare(String(a.lastDate ?? "")));
}
