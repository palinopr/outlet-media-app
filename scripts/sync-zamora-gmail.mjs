import { mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import {
  MANIFEST_PATH,
  REPORTS_DIR,
  VAULT_ROOT,
  compactThreadMeta,
  loadManifest,
} from "./gmail-zamora-lib.mjs";

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? process.cwd(),
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
      if (!options.quiet) process.stdout.write(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
      if (!options.quiet) process.stderr.write(chunk);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`${command} ${args.join(" ")} exited ${code}: ${stderr || stdout}`));
      }
    });
  });
}

function parseJsonOutput(output, name) {
  const trimmed = output.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error(`${name} did not emit JSON output`);
  return JSON.parse(trimmed.slice(start, end + 1));
}

function reportName(date = new Date()) {
  return `${date.toISOString().replace(/[:.]/g, "-")}-zamora-gmail-sync.json`;
}

async function main() {
  const queryIndex = process.argv.indexOf("--query");
  const query = queryIndex === -1 ? "" : process.argv[queryIndex + 1] ?? "";
  const ingestArgs = ["scripts/ingest-zamora-gmail.mjs"];
  if (query) ingestArgs.push("--query", query);

  const ingest = parseJsonOutput((await run(process.execPath, ingestArgs)).stdout, "ingest");
  const labels = parseJsonOutput((await run(process.execPath, ["scripts/label-zamora-gmail.mjs"])).stdout, "label");

  const vaultIngest = await run("python3", ["scripts/wiki_tool.py", "ingest-raw", "--apply", "--log"], {
    cwd: VAULT_ROOT,
    quiet: true,
  });
  const closeoutAudit = parseJsonOutput((await run("python3", ["scripts/wiki_tool.py", "closeout-audit"], {
    cwd: VAULT_ROOT,
    quiet: true,
  })).stdout, "closeout-audit");

  const manifest = await loadManifest();
  const threads = compactThreadMeta(manifest);
  const needsReply = threads.filter((thread) => thread.needsReply);
  const documents = threads.filter((thread) => thread.attachmentCount > 0);
  await mkdir(REPORTS_DIR, { recursive: true });
  const reportPath = path.join(REPORTS_DIR, reportName());
  const brain = parseJsonOutput((await run(process.execPath, ["scripts/generate-zamora-email-brain.mjs", "--latest-report", reportPath])).stdout, "generate-zamora-email-brain");
  const report = {
    ok: true,
    generatedAt: new Date().toISOString(),
    mailbox: manifest.mailbox,
    query: query || "all",
    manifestPath: MANIFEST_PATH,
    vaultRoot: VAULT_ROOT,
    ingest: {
      messageCount: ingest.messageCount,
      threadCount: ingest.threadCount,
      ingestedThreadCount: ingest.ingestedThreadCount,
    },
    labels: {
      labelsCreatedOrFound: labels.labelsCreatedOrFound,
      threadsLabeled: labels.threadsLabeled,
      needsReplyCount: labels.needsReplyCount,
    },
    vault: {
      rawIngestLog: vaultIngest.stdout.trim(),
      closeoutFailures: closeoutAudit.failures ?? [],
      pendingRawInboxCount: closeoutAudit.pending_raw_inbox_count,
      unpromotedRawInboxSourceCount: closeoutAudit.unpromoted_raw_inbox_source_count,
    },
    brain,
    totals: {
      trackedThreads: threads.length,
      needsReply: needsReply.length,
      documentThreads: documents.length,
      attachmentSignals: threads.reduce((sum, thread) => sum + (thread.attachmentCount ?? 0), 0),
    },
    latestThreads: threads.slice(0, 10),
    needsReply,
    documentThreads: documents,
  };

  await writeFile(reportPath, JSON.stringify(report, null, 2));

  console.log(JSON.stringify({
    ok: true,
    mailbox: report.mailbox,
    trackedThreads: report.totals.trackedThreads,
    needsReply: report.totals.needsReply,
    documentThreads: report.totals.documentThreads,
    attachmentSignals: report.totals.attachmentSignals,
    reportPath,
    vaultPendingRawInbox: report.vault.pendingRawInboxCount,
    vaultUnpromotedRawInboxSources: report.vault.unpromotedRawInboxSourceCount,
  }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
});
