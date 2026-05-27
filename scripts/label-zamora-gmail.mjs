import path from "node:path";
import { readFile } from "node:fs/promises";
import {
  RAW_THREADS_DIR,
  assertZamoraProfile,
  categoryLabels,
  getAccessToken,
  gmailFetch,
  loadManifest,
  needsReply,
  saveManifest,
} from "./gmail-zamora-lib.mjs";

const LABEL_NAMES = [
  "Zamora/Inbox Review",
  "Zamora/Tour Marketing",
  "Zamora/Meetings",
  "Zamora/Documents",
  "Zamora/Access & Tools",
  "Zamora/Security",
  "Zamora/Needs Reply",
  "Zamora/Waiting",
  "Zamora/Archive Reviewed",
];

async function main() {
  const accessToken = await getAccessToken();
  const profile = await assertZamoraProfile(accessToken);
  const manifest = await loadManifest();
  const existing = await gmailFetch(accessToken, "https://gmail.googleapis.com/gmail/v1/users/me/labels");
  const byName = new Map((existing.labels ?? []).map((label) => [label.name, label]));

  for (const name of LABEL_NAMES) {
    if (!byName.has(name)) {
      const label = await gmailFetch(accessToken, "https://gmail.googleapis.com/gmail/v1/users/me/labels", {
        method: "POST",
        body: JSON.stringify({ name, labelListVisibility: "labelShow", messageListVisibility: "show" }),
      });
      byName.set(name, label);
    }
  }

  const labelIds = Object.fromEntries(LABEL_NAMES.map((name) => [name, byName.get(name).id]));
  const results = [];
  for (const [threadId, meta] of Object.entries(manifest.ingestedThreads ?? {})) {
    const thread = JSON.parse(await readFile(path.join(RAW_THREADS_DIR, `${threadId}.json`), "utf8"));
    const labels = categoryLabels(meta.subject, meta.attachmentCount);
    if (needsReply(thread)) labels.push("Zamora/Needs Reply");
    const addLabelIds = [...new Set(labels)].map((name) => labelIds[name]).filter(Boolean);
    await gmailFetch(accessToken, `https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadId}/modify`, {
      method: "POST",
      body: JSON.stringify({ addLabelIds, removeLabelIds: [] }),
    });
    manifest.ingestedThreads[threadId] = {
      ...meta,
      gmailLabelsApplied: labels,
      needsReply: labels.includes("Zamora/Needs Reply"),
      labeledAt: new Date().toISOString(),
    };
    results.push({ threadId, labels });
  }

  await saveManifest(manifest);

  console.log(JSON.stringify({
    ok: true,
    mailbox: profile.emailAddress,
    labelsCreatedOrFound: LABEL_NAMES.length,
    threadsLabeled: results.length,
    needsReplyCount: results.filter((result) => result.labels.includes("Zamora/Needs Reply")).length,
  }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
});
