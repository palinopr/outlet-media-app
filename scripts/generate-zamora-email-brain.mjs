import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  ATTACHMENTS_DIR,
  PRIVATE_ROOT,
  RAW_THREADS_DIR,
  VAULT_ROOT,
  compactThreadMeta,
  getHeader,
  headersFromMessage,
  isEphemeralSecuritySubject,
  loadManifest,
  needsReply,
  safeFile,
  sanitizeText,
} from "./gmail-zamora-lib.mjs";

const COMMAND_CENTER = path.join(VAULT_ROOT, "00 Email Command Center/Zamora Email Brain.md");
const PROJECT_DIR = path.join(VAULT_ROOT, "30 Clients/Zamora/Projects");
const PEOPLE_DIR = path.join(VAULT_ROOT, "20 Entities/People/Zamora");
const ORG_DIR = path.join(VAULT_ROOT, "20 Entities/Organizations");
const THREAD_DIR = path.join(VAULT_ROOT, "40 Campaigns/Zamora Email Threads");
const DOC_DIR = path.join(VAULT_ROOT, "50 Sources/External Source Pointers/Zamora Documents");
const STYLE_DIR = path.join(VAULT_ROOT, "10 Doctrine/Zamora Email Drafting Style");
const FOLLOWUP_DIR = path.join(VAULT_ROOT, "80 Logs/Zamora Follow-ups");
let personPathByName = new Map();

function wiki(pathName, label = path.basename(pathName, ".md")) {
  return `[[${pathName.replace(/\.md$/, "")}|${label}]]`;
}

function slugDate(value) {
  return String(value || new Date().toISOString()).slice(0, 10);
}

function senderName(from = "") {
  const clean = from.replace(/<[^>]+>/g, "").replace(/"/g, "").trim();
  if (clean) return sanitizeText(clean);
  const email = from.match(/<([^>]+)>/)?.[1] ?? from;
  return sanitizeText(email.split("@")[0] || "Unknown");
}

function senderDomain(from = "") {
  return from.match(/@([^>\s]+)/)?.[1]?.toLowerCase() ?? "unknown";
}

function classifyProject(subject = "") {
  const s = subject.toLowerCase();
  if (/montaner/.test(s)) return "Ricardo Montaner 2026";
  if (/bronco/.test(s)) return "Bronco Tour 2026";
  if (/tigres|ltdn/.test(s)) return "Los Tigres del Norte 2026";
  if (/arjona/.test(s)) return "Arjona 2026";
  if (/fifa/.test(s)) return "FIFA 2026";
  if (/cantina|rooftop/.test(s)) return "Cantina Rooftop";
  if (/tm1|digital director|bienvenida|information|api tm/.test(s)) return "Zamora Onboarding and Access";
  return "Zamora General";
}

function classifyCategory(subject = "", attachmentCount = 0) {
  const s = subject.toLowerCase();
  if (/security|one-time code|code/.test(s)) return "Security";
  if (/information|i-9|w-4/.test(s) || attachmentCount > 1) return "Documents and HR";
  if (/invitation|meeting|recording|revision|touring|api tm/.test(s)) return "Meetings";
  if (/tm1|digital director|bienvenida|welcome/.test(s)) return "Access and Tools";
  if (/montaner|bronco|tigres|arjona|fifa|tour|marketing|mkt|campaign|campa|spreadsheet shared|presentation shared/.test(s)) return "Tour Marketing";
  return "General";
}

function isDocumentSignal(subject = "", attachmentCount = 0) {
  return attachmentCount > 0 || /spreadsheet shared|presentation shared|invitation|information|fifa/i.test(subject);
}

function threadWikiPath(thread) {
  return thread.threadWikiPath ?? `40 Campaigns/Zamora Email Threads/${thread.noteName}`;
}

function projectWikiPath(project) {
  return `30 Clients/Zamora/Projects/${project}.md`;
}

function personWikiPath(person) {
  return personPathByName.get(person) ?? `20 Entities/People/Zamora/${safeFile(person)}.md`;
}

function docWikiPath(thread) {
  return thread.docWikiPath ?? `50 Sources/External Source Pointers/Zamora Documents/${safeFile(`${thread.project} - ${thread.subject}`)}.md`;
}

async function listMarkdownFiles(dir) {
  const out = [];
  try {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) out.push(...await listMarkdownFiles(full));
      if (entry.isFile() && entry.name.endsWith(".md")) out.push(full);
    }
  } catch {
    return out;
  }
  return out;
}

function relVaultPath(fullPath) {
  return path.relative(VAULT_ROOT, fullPath).replace(/\\/g, "/");
}

async function existingPathMaps() {
  const threadById = new Map();
  for (const file of await listMarkdownFiles(THREAD_DIR)) {
    const content = await readFile(file, "utf8");
    const threadId = content.match(/^thread_id:\s*(.+)$/m)?.[1]?.trim() ?? content.match(/Gmail thread id:\s*`([^`]+)`/)?.[1]?.trim();
    if (threadId) threadById.set(threadId, relVaultPath(file));
  }

  const docById = new Map();
  for (const file of await listMarkdownFiles(DOC_DIR)) {
    const content = await readFile(file, "utf8");
    const threadId = content.match(/Gmail thread id:\s*`([^`]+)`/)?.[1]?.trim();
    if (threadId) docById.set(threadId, relVaultPath(file));
  }

  const personByName = new Map();
  for (const file of await listMarkdownFiles(PEOPLE_DIR)) {
    const content = await readFile(file, "utf8");
    const name = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
    if (name) {
      personByName.set(name, relVaultPath(file));
      personByName.set(name.replace(/"+$/g, ""), relVaultPath(file));
    }
  }
  return { threadById, docById, personByName };
}

async function loadThreads(manifest, existing) {
  const rows = [];
  for (const meta of compactThreadMeta(manifest)) {
    const raw = JSON.parse(await readFile(path.join(RAW_THREADS_DIR, `${meta.threadId}.json`), "utf8"));
    const headers = raw.messages.map(headersFromMessage);
    const subject = sanitizeText(getHeader(headers[0] ?? {}, "subject") || meta.subject || "(no subject)");
    if (isEphemeralSecuritySubject(subject)) continue;
    const dates = headers.map((h) => new Date(getHeader(h, "date")).toISOString()).filter(Boolean).sort();
    const froms = headers.map((h) => getHeader(h, "from")).filter(Boolean);
    const people = [...new Set(froms.map(senderName))].filter(Boolean).sort();
    const project = classifyProject(subject);
    const existingThreadPath = existing.threadById.get(meta.threadId);
    const noteName = existingThreadPath ? path.basename(existingThreadPath) : `${slugDate(dates[0] ?? meta.firstDate)} ${project} - ${safeFile(subject)}.md`;
    rows.push({
      ...meta,
      raw,
      subject,
      firstDate: dates[0] ?? meta.firstDate,
      lastDate: dates.at(-1) ?? meta.lastDate,
      people,
      lastSender: senderName(froms.at(-1) ?? ""),
      lastSenderDomain: senderDomain(froms.at(-1) ?? ""),
      project,
      category: classifyCategory(subject, meta.attachmentCount),
      noteName,
      notePath: existingThreadPath ? path.join(VAULT_ROOT, existingThreadPath) : path.join(THREAD_DIR, noteName),
      threadWikiPath: existingThreadPath,
      docWikiPath: existing.docById.get(meta.threadId),
      rawThreadPath: path.join(RAW_THREADS_DIR, `${meta.threadId}.json`),
      attachmentDir: path.join(ATTACHMENTS_DIR, meta.threadId),
      needsReply: needsReply(raw),
      jaimeReplied: froms.some((from) => /jaime\.ortiz@zamorausa\.com/i.test(from)),
      documentSignal: isDocumentSignal(subject, meta.attachmentCount),
    });
  }
  return rows.sort((a, b) => String(b.lastDate ?? "").localeCompare(String(a.lastDate ?? "")));
}

function frontmatter(type, tags) {
  return `---\ntype: ${type}\nstatus: active\ncreated: 2026-05-27\nupdated: ${new Date().toISOString().slice(0, 10)}\ntags:\n${tags.map((tag) => `  - ${tag}`).join("\n")}\nprivacy: internal\n---\n\n`;
}

async function writeThread(thread) {
  const projectLink = wiki(projectWikiPath(thread.project), thread.project);
  await writeFile(thread.notePath, `${frontmatter("email-thread", ["zamora", "gmail", "email-thread"])}# ${thread.subject}

## Current State

- Project: ${projectLink}
- Category: \`${thread.category}\`
- Gmail thread id: \`${thread.threadId}\`
- Message count: \`${thread.messageCount}\`
- Last message: \`${thread.lastDate || "unknown"}\`
- Last sender: \`${thread.lastSender}\` from \`${thread.lastSenderDomain}\`
- Needs Jaime reply: \`${thread.needsReply ? "maybe" : "no"}\`
- Jaime has replied in thread: \`${thread.jaimeReplied ? "yes" : "no"}\`
- Attachments/documents detected: \`${thread.attachmentCount}\`

## Source Pointers

- Private raw thread JSON: \`${thread.rawThreadPath}\`
- Private attachment folder: \`${thread.attachmentDir}\`
- Raw Inbox note: \`${thread.rawInboxPath}\`

## Agent Summary

This thread belongs to ${thread.project}. The current known context comes from Gmail metadata and safe source indexes; raw body/document review requires Jaime's explicit request.

## People

${thread.people.map((person) => `- ${wiki(personWikiPath(person), person)}`).join("\n") || "- Unknown"}

## Open Loops

${thread.needsReply ? "- Reply status: `maybe`\n- Next action: Review raw thread and draft a reply for Jaime approval." : "- No reply required by current metadata."}

## Related

- ${wiki("00 Email Command Center/Zamora Email Brain.md", "Zamora Email Brain")}
- ${projectLink}
`);
}

async function main() {
  const latestReportIndex = process.argv.indexOf("--latest-report");
  const latestReport = latestReportIndex === -1 ? "" : process.argv[latestReportIndex + 1] ?? "";
  const manifest = await loadManifest();
  const existing = await existingPathMaps();
  personPathByName = existing.personByName;
  const threads = await loadThreads(manifest, existing);
  const projects = Map.groupBy(threads, (thread) => thread.project);
  const people = Map.groupBy(threads.flatMap((thread) => thread.people.map((person) => ({ person, thread }))), (row) => row.person);
  const docs = threads.filter((thread) => thread.documentSignal);

  await Promise.all([COMMAND_CENTER, PROJECT_DIR, PEOPLE_DIR, ORG_DIR, THREAD_DIR, DOC_DIR, STYLE_DIR, FOLLOWUP_DIR].map((target) => mkdir(path.extname(target) ? path.dirname(target) : target, { recursive: true })));
  for (const thread of threads) await writeThread(thread);

  for (const [project, projectThreads] of [...projects.entries()].sort()) {
    const needs = projectThreads.filter((thread) => thread.needsReply);
    const projectDocs = projectThreads.filter((thread) => thread.documentSignal);
    await writeFile(path.join(PROJECT_DIR, `${project}.md`), `${frontmatter("project", ["zamora", "email-project"])}# ${project}

## Email State

- Thread count: \`${projectThreads.length}\`
- Latest thread: ${wiki(threadWikiPath(projectThreads[0]), projectThreads[0].subject)}
- Needs reply / review: \`${needs.length}\`
- Documents or shares: \`${projectDocs.length}\`

## Threads

${projectThreads.map((thread) => `- ${wiki(threadWikiPath(thread), thread.subject)} - ${thread.category}; reply: ${thread.needsReply ? "maybe" : "no"}; last: ${thread.lastDate}`).join("\n")}

## Documents

${projectDocs.map((thread) => `- ${wiki(docWikiPath(thread), thread.subject)}`).join("\n") || "- None detected."}

## Open Loops

${needs.map((thread) => `- Review ${wiki(threadWikiPath(thread), thread.subject)}`).join("\n") || "- None by current metadata."}
`);
  }

  for (const [person, rows] of [...people.entries()].sort()) {
    const personThreads = rows.map((row) => row.thread);
    const personPath = personPathByName.get(person) ?? `20 Entities/People/Zamora/${safeFile(person)}.md`;
    await writeFile(path.join(VAULT_ROOT, personPath), `${frontmatter("person", ["zamora", "email-person"])}# ${person}

## Context

- Seen in Zamora Gmail metadata.
- Thread count: \`${personThreads.length}\`

## Projects

${[...new Set(personThreads.map((thread) => thread.project))].sort().map((project) => `- ${wiki(projectWikiPath(project), project)}`).join("\n")}

## Threads

${personThreads.slice(0, 20).map((thread) => `- ${wiki(threadWikiPath(thread), thread.subject)}`).join("\n")}
`);
  }

  await writeFile(path.join(ORG_DIR, "Zamora.md"), `${frontmatter("organization", ["zamora", "organization"])}# Zamora

## Email Brain

- Command center: ${wiki("00 Email Command Center/Zamora Email Brain.md", "Zamora Email Brain")}
- Mailbox: \`${manifest.mailbox}\`
- Tracked threads: \`${threads.length}\`

## Projects

${[...projects.keys()].sort().map((project) => `- ${wiki(projectWikiPath(project), project)}`).join("\n")}
`);

  for (const thread of docs) {
    await writeFile(path.join(VAULT_ROOT, docWikiPath(thread)), `${frontmatter("external-source-pointer", ["zamora", "email-document"])}# ${thread.subject}

## Pointer

- Project: ${wiki(projectWikiPath(thread.project), thread.project)}
- Thread: ${wiki(threadWikiPath(thread), thread.subject)}
- Gmail thread id: \`${thread.threadId}\`
- Attachment/document signal count: \`${thread.attachmentCount}\`
- Private attachment folder: \`${thread.attachmentDir}\`

## Privacy

This note is a pointer only. It does not store attachment contents or raw email bodies.
`);
  }

  const openLoops = threads.filter((thread) => thread.needsReply);
  await writeFile(path.join(FOLLOWUP_DIR, "Zamora Email Open Loops.md"), `${frontmatter("follow-up-index", ["zamora", "email-followups"])}# Zamora Email Open Loops

## Needs Review / Possible Reply

${openLoops.map((thread) => `- ${wiki(threadWikiPath(thread), thread.subject)} - project: ${wiki(projectWikiPath(thread.project), thread.project)}, last: ${thread.lastDate}`).join("\n") || "- None by current metadata."}

## Rule

Agents may draft replies, but sending email requires Jaime approval.
`);

  await writeFile(path.join(STYLE_DIR, "Zamora Email Style.md"), `${frontmatter("doctrine", ["zamora", "email-style"])}# Zamora Email Style

## Drafting Defaults

- Keep drafts concise, direct, and operational.
- Use bilingual context only when the thread already uses Spanish or Spanglish.
- Do not send email automatically; prepare drafts for Jaime approval.
- Before drafting, read the project page, the thread note, and private raw content only when Jaime explicitly asks for exact content.
`);

  await writeFile(COMMAND_CENTER, `${frontmatter("command-center", ["zamora", "email-brain", "gmail"])}# Zamora Email Brain

## Zero Context Agent Boot

Read this page first. Then read active project pages, open loops, and only inspect private raw Gmail files when Jaime explicitly asks for exact email or document content.

## Current Mailbox Snapshot

- Mailbox: \`${manifest.mailbox}\`
- Indexed threads: \`${threads.length}\`
- Indexed messages: \`${threads.reduce((sum, thread) => sum + thread.messageCount, 0)}\`
- Indexed attachment/document signals: \`${threads.reduce((sum, thread) => sum + thread.attachmentCount, 0)}\`
- Private raw store: \`${PRIVATE_ROOT}\`
${latestReport ? `- Latest sync report: \`${latestReport}\`\n` : ""}- Latest indexed thread: ${threads[0] ? wiki(threadWikiPath(threads[0]), threads[0].subject) : "None"}

## Sync Runbook

- App branch/workspace: \`/Users/jaimeortiz/outlet-media-app\`
- Command: \`npm run zamora:gmail:sync\`
- Brain-only refresh command: \`npm run zamora:gmail:brain\`
- Read-only report command: \`npm run zamora:gmail:report\`
- The sync command reads Gmail with local \`ZAMORA_*\` OAuth env variables, refreshes private raw thread JSON, downloads document/calendar attachments, applies Gmail labels, registers Raw Inbox source notes, regenerates this email brain, and writes a private JSON report.
- The report command reads the local private manifest only; it does not call Gmail or mutate labels.
- Do not store OAuth values, raw email bodies, or attachment contents in Obsidian.
- Use private raw paths only when Jaime explicitly asks for exact email/document content.

## Active Projects

${[...projects.entries()].sort((a, b) => String(b[1][0]?.lastDate ?? "").localeCompare(String(a[1][0]?.lastDate ?? ""))).map(([project, projectThreads]) => `- ${wiki(projectWikiPath(project), project)} - ${projectThreads.length} threads, latest ${projectThreads[0]?.lastDate ?? "unknown"}`).join("\n")}

## Important People

${[...people.keys()].sort().map((person) => `- ${wiki(personWikiPath(person), person)}`).join("\n")}

## Open Loops

- ${wiki("80 Logs/Zamora Follow-ups/Zamora Email Open Loops.md", "Zamora Email Open Loops")}

## Documents

${docs.map((thread) => `- ${wiki(docWikiPath(thread), thread.subject)} - ${wiki(projectWikiPath(thread.project), thread.project)}`).join("\n") || "- None detected."}

## Drafting

- ${wiki("10 Doctrine/Zamora Email Drafting Style/Zamora Email Style.md", "Zamora Email Style")}

## Gmail Label Taxonomy

- \`Zamora/Inbox Review\`
- \`Zamora/Tour Marketing\`
- \`Zamora/Meetings\`
- \`Zamora/Documents\`
- \`Zamora/Access & Tools\`
- \`Zamora/Security\`
- \`Zamora/Needs Reply\`
- \`Zamora/Waiting\`
- \`Zamora/Archive Reviewed\`
`);

  console.log(JSON.stringify({ ok: true, threads: threads.length, projects: projects.size, people: people.size, documents: docs.length, openLoops: openLoops.length }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
});
