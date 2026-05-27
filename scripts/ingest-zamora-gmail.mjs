import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  ATTACHMENTS_DIR,
  MANIFEST_PATH,
  RAW_INBOX,
  RAW_THREADS_DIR,
  assertZamoraProfile,
  decodeBase64Url,
  getAccessToken,
  getHeader,
  gmailFetch,
  headersFromMessage,
  isDocumentAttachment,
  listAllMessages,
  loadManifest,
  needsReply,
  safeFile,
  sanitizeText,
  saveManifest,
  walkParts,
} from "./gmail-zamora-lib.mjs";

function dateSlug(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

async function downloadAttachment(accessToken, messageId, attachmentId, targetPath) {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/attachments/${attachmentId}`;
  const attachment = await gmailFetch(accessToken, url);
  await writeFile(targetPath, decodeBase64Url(attachment.data ?? ""));
}

function threadNote({ thread, threadId, subject, firstDate, lastDate, labels, privateThreadPath, privateAttachmentDir, attachmentCount }) {
  return `---\ntype: raw-inbox\nstatus: pending\ncreated: ${dateSlug()}\ntags:\n  - gmail\n  - zamora\n  - email-thread\nsource_type: gmail-thread-index\nmailbox: zamora\nprivacy: internal\nraw_private_location: ${privateThreadPath}\nthread_id: ${threadId}\nmessage_count: ${thread.messages?.length ?? 0}\n---\n\n# Zamora Gmail Thread - ${sanitizeText(subject || "(no subject)")}\n\n## Safe Index\n\n- Mailbox: \`jaime.ortiz@zamorausa.com\`\n- Gmail thread id: \`${threadId}\`\n- Message count: \`${thread.messages?.length ?? 0}\`\n- First message date: \`${firstDate || "unknown"}\`\n- Last message date: \`${lastDate || "unknown"}\`\n- Gmail labels: ${labels.length ? labels.map((label) => `\`${label}\``).join(", ") : "None"}\n- Needs reply by metadata: \`${needsReply(thread) ? "maybe" : "no"}\`\n- Private raw thread JSON: \`${privateThreadPath}\`\n- Private attachment folder: \`${privateAttachmentDir}\`\n\n## Attachments\n\n- Document or calendar attachment count: \`${attachmentCount}\`\n\n## Agent Notes\n\nThis is a privacy-safe Gmail thread index. Raw message bodies, attachment filenames, and attachment contents are not stored in Obsidian. Agents should inspect private local paths only when Jaime explicitly asks for exact email or document content.\n`;
}

async function main() {
  const query = process.argv.includes("--query") ? process.argv[process.argv.indexOf("--query") + 1] : "";
  await mkdir(RAW_INBOX, { recursive: true });
  await mkdir(RAW_THREADS_DIR, { recursive: true });
  await mkdir(ATTACHMENTS_DIR, { recursive: true });

  const accessToken = await getAccessToken();
  const profile = await assertZamoraProfile(accessToken);
  const messages = await listAllMessages(accessToken, query);
  const threadIds = [...new Set(messages.map((message) => message.threadId))];
  const manifest = await loadManifest();
  manifest.mailbox = profile.emailAddress;
  manifest.lastRunAt = new Date().toISOString();
  manifest.query = query || "all";
  manifest.ingestedThreads ??= {};

  const results = [];
  for (const threadId of threadIds) {
    const thread = await gmailFetch(accessToken, `https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadId}?format=full`);
    const messageHeaders = thread.messages.map(headersFromMessage);
    const dates = messageHeaders.map((headers) => new Date(getHeader(headers, "date")).toISOString()).filter(Boolean).sort();
    const subject = getHeader(messageHeaders[0], "subject") || "(no subject)";
    const labels = [...new Set(thread.messages.flatMap((message) => message.labelIds ?? []))].sort();
    const threadDir = path.join(ATTACHMENTS_DIR, threadId);
    await mkdir(threadDir, { recursive: true });

    let attachmentCount = 0;
    for (const message of thread.messages) {
      for (const part of walkParts(message.payload)) {
        if (!isDocumentAttachment(part)) continue;
        attachmentCount += 1;
        const targetPath = path.join(threadDir, `${message.id}-${safeFile(part.filename || "attachment")}`);
        await downloadAttachment(accessToken, message.id, part.body.attachmentId, targetPath);
      }
    }

    const privateThreadPath = path.join(RAW_THREADS_DIR, `${threadId}.json`);
    await writeFile(privateThreadPath, JSON.stringify(thread, null, 2));
    const previousRawInboxPath = manifest.ingestedThreads[threadId]?.rawInboxPath;
    const rawInboxPath = previousRawInboxPath ?? path.join(RAW_INBOX, `${dateSlug()}-zamora-gmail-thread-${threadId}-${safeFile(subject)}.md`);
    await writeFile(rawInboxPath, threadNote({
      thread,
      threadId,
      subject,
      firstDate: dates[0],
      lastDate: dates.at(-1),
      labels,
      privateThreadPath,
      privateAttachmentDir: threadDir,
      attachmentCount,
    }));
    manifest.ingestedThreads[threadId] = {
      subject: sanitizeText(subject),
      messageCount: thread.messages.length,
      firstDate: dates[0],
      lastDate: dates.at(-1),
      labels,
      needsReply: needsReply(thread),
      rawInboxPath,
      privateThreadPath,
      attachmentCount,
      updatedAt: new Date().toISOString(),
    };
    results.push({ threadId, messageCount: thread.messages.length, attachmentCount, rawInboxPath });
  }

  await saveManifest(manifest);
  console.log(JSON.stringify({ ok: true, mailbox: profile.emailAddress, messageCount: messages.length, threadCount: threadIds.length, ingestedThreadCount: results.length, privateManifest: MANIFEST_PATH, results }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
});
