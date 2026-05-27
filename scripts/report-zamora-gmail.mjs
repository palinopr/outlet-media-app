import {
  MANIFEST_PATH,
  compactThreadMeta,
  loadManifest,
} from "./gmail-zamora-lib.mjs";

async function main() {
  const manifest = await loadManifest();
  const threads = compactThreadMeta(manifest);
  const needsReply = threads.filter((thread) => thread.needsReply);
  const documents = threads.filter((thread) => thread.attachmentCount > 0);
  const latest = threads.slice(0, 10);

  console.log(JSON.stringify({
    ok: true,
    mailbox: manifest.mailbox,
    manifestPath: MANIFEST_PATH,
    lastRunAt: manifest.lastRunAt,
    totals: {
      trackedThreads: threads.length,
      trackedMessages: threads.reduce((sum, thread) => sum + (thread.messageCount ?? 0), 0),
      needsReply: needsReply.length,
      documentThreads: documents.length,
      attachmentSignals: threads.reduce((sum, thread) => sum + (thread.attachmentCount ?? 0), 0),
    },
    latest,
    needsReply,
    documentThreads: documents,
  }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
});
