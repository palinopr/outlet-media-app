const WRITER_URL = "http://127.0.0.1:7766/captures";

const elements = {
  status: document.getElementById("status"),
  badge: document.getElementById("badge"),
  title: document.getElementById("title"),
  consent: document.getElementById("consent"),
  start: document.getElementById("start"),
  stop: document.getElementById("stop"),
  lineCount: document.getElementById("lineCount"),
  pendingCount: document.getElementById("pendingCount"),
  summary: document.getElementById("summary"),
  decisions: document.getElementById("decisions"),
  actions: document.getElementById("actions"),
  followUp: document.getElementById("followUp"),
  send: document.getElementById("send"),
  download: document.getElementById("download"),
  clear: document.getElementById("clear"),
  preview: document.getElementById("preview"),
  message: document.getElementById("message"),
};

let activeSession = null;
let activeTabId = null;
let refreshing = false;

function setMessage(text, type = "") {
  elements.message.textContent = text || "";
  elements.message.className = `message ${type}`.trim();
}

function getNotesFromForm() {
  return {
    summary: elements.summary.value.trim(),
    decisions: elements.decisions.value.trim(),
    actions: elements.actions.value.trim(),
    followUp: elements.followUp.value.trim(),
  };
}

function getTitleFromForm() {
  return elements.title.value.trim();
}

function sessionForWrite() {
  return {
    ...activeSession,
    consentConfirmed: elements.consent.checked,
    meeting: {
      ...(activeSession?.meeting || {}),
      title: getTitleFromForm() || activeSession?.meeting?.title || "Google Meet",
    },
    notes: getNotesFromForm(),
  };
}

function render(session, tabId, tabUrl) {
  activeSession = session;
  activeTabId = tabId;

  const isMeet = Boolean(tabUrl);
  const active = Boolean(session?.active);
  elements.status.textContent = isMeet
    ? active
      ? "Capturing visible Meet captions."
      : "Ready on Google Meet. Turn captions on if needed."
    : "Open a Google Meet tab.";

  elements.badge.textContent = active ? "Live" : "Idle";
  elements.badge.classList.toggle("active", active);

  const transcript = session?.transcript || [];
  elements.lineCount.textContent = String(transcript.length);
  elements.pendingCount.textContent = String(session?.pendingCount || 0);

  if (document.activeElement !== elements.title) {
    elements.title.value = elements.title.value || session?.meeting?.title || "";
  }
  if (document.activeElement !== elements.summary) elements.summary.value = elements.summary.value || session?.notes?.summary || "";
  if (document.activeElement !== elements.decisions) elements.decisions.value = elements.decisions.value || session?.notes?.decisions || "";
  if (document.activeElement !== elements.actions) elements.actions.value = elements.actions.value || session?.notes?.actions || "";
  if (document.activeElement !== elements.followUp) elements.followUp.value = elements.followUp.value || session?.notes?.followUp || "";
  elements.consent.checked = Boolean(elements.consent.checked || session?.consentConfirmed);

  elements.start.disabled = !isMeet || active;
  elements.stop.disabled = !isMeet || !active;
  elements.send.disabled = !transcript.length && !hasReviewedNotes();
  elements.download.disabled = !transcript.length;
  elements.clear.disabled = !session;

  elements.preview.replaceChildren(
    ...transcript.slice(-6).reverse().map((entry) => {
      const item = document.createElement("li");
      const speaker = document.createElement("strong");
      speaker.textContent = entry.speaker || "Unknown";
      item.append(speaker, document.createTextNode(`: ${entry.text || ""}`));
      return item;
    })
  );
}

function hasReviewedNotes() {
  return Object.values(getNotesFromForm()).some(Boolean);
}

async function refresh() {
  if (refreshing) return;
  refreshing = true;
  try {
    const response = await chrome.runtime.sendMessage({ type: "OUTLET_MEET_GET_ACTIVE_STATE" });
    if (!response?.ok) {
      render(null, null, null);
      setMessage(response?.error || "Open a Google Meet tab.", "error");
      return;
    }
    render(response.session, response.tabId, response.tabUrl);
  } finally {
    refreshing = false;
  }
}

async function sendToActiveTab(payload) {
  const response = await chrome.runtime.sendMessage({
    type: "OUTLET_MEET_SEND_TO_ACTIVE_TAB",
    payload,
  });

  if (!response?.ok) {
    throw new Error(response?.error || "Meet tab did not respond.");
  }
  render(response.session, activeTabId, activeSession?.meeting?.url || "https://meet.google.com/");
  return response.session;
}

function requireConsent() {
  if (!elements.consent.checked) {
    throw new Error("Confirm participants were notified before capturing or sending notes.");
  }
}

async function startCapture() {
  requireConsent();
  const session = await sendToActiveTab({
    type: "OUTLET_MEET_START",
    payload: {
      title: getTitleFromForm(),
      consentConfirmed: elements.consent.checked,
      notes: getNotesFromForm(),
    },
  });
  setMessage(`Capture started. Lines: ${session.transcript.length}`, "success");
}

async function stopCapture() {
  const session = await sendToActiveTab({
    type: "OUTLET_MEET_STOP",
    payload: { notes: getNotesFromForm() },
  });
  setMessage(`Capture stopped. Lines: ${session.transcript.length}`, "success");
}

async function updateNotes() {
  if (!activeTabId) return;
  try {
    await sendToActiveTab({
      type: "OUTLET_MEET_UPDATE_NOTES",
      payload: {
        title: getTitleFromForm(),
        consentConfirmed: elements.consent.checked,
        notes: getNotesFromForm(),
      },
    });
  } catch (_error) {
    // The popup should remain editable even if the tab is temporarily unreachable.
  }
}

async function clearSession() {
  await sendToActiveTab({ type: "OUTLET_MEET_CLEAR" });
  elements.title.value = "";
  elements.summary.value = "";
  elements.decisions.value = "";
  elements.actions.value = "";
  elements.followUp.value = "";
  elements.consent.checked = false;
  setMessage("Session cleared.", "success");
}

async function sendToMemory() {
  requireConsent();
  const payload = sessionForWrite();
  if (!payload?.transcript?.length && !hasReviewedNotes()) {
    throw new Error("No transcript or reviewed notes to send.");
  }

  const response = await fetch(WRITER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.ok) {
    throw new Error(result.error || `Writer returned HTTP ${response.status}`);
  }

  setMessage(`Saved Raw Inbox note: ${result.memoryNotePath}`, "success");
}

function formatMarkdown(session) {
  const meeting = session.meeting || {};
  const notes = session.notes || {};
  const lines = [
    `# ${meeting.title || "Google Meet"} Transcript`,
    "",
    `- URL: ${meeting.url || ""}`,
    `- Meet code: ${meeting.meetCode || ""}`,
    `- Started: ${meeting.startedAt || ""}`,
    `- Ended: ${meeting.endedAt || ""}`,
    `- Timezone: ${meeting.timezone || ""}`,
    "",
    "## Reviewed Notes",
    "",
    "### Summary",
    notes.summary || "_Not reviewed yet._",
    "",
    "### Decisions",
    notes.decisions || "_Not reviewed yet._",
    "",
    "### Action Items",
    notes.actions || "_Not reviewed yet._",
    "",
    "### Follow-up Agenda",
    notes.followUp || "_Not reviewed yet._",
    "",
    "## Transcript",
    "",
    ...(session.transcript || []).map((entry) => {
      const offset = formatOffset(entry.offsetMs || 0);
      return `- [${offset}] **${entry.speaker || "Unknown"}:** ${entry.text || ""}`;
    }),
    "",
  ];
  return lines.join("\n");
}

function formatOffset(ms) {
  const total = Math.floor(ms / 1000);
  const minutes = String(Math.floor(total / 60)).padStart(2, "0");
  const seconds = String(total % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function downloadMarkdown() {
  const payload = sessionForWrite();
  const blob = new Blob([formatMarkdown(payload)], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${safeFilename(payload.meeting?.title || "google-meet")}.md`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function safeFilename(value) {
  return String(value || "google-meet")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "google-meet";
}

async function handle(action) {
  setMessage("");
  try {
    await action();
    await refresh();
  } catch (error) {
    setMessage(error.message || String(error), "error");
  }
}

elements.start.addEventListener("click", () => handle(startCapture));
elements.stop.addEventListener("click", () => handle(stopCapture));
elements.send.addEventListener("click", () => handle(sendToMemory));
elements.download.addEventListener("click", () => handle(downloadMarkdown));
elements.clear.addEventListener("click", () => handle(clearSession));

for (const element of [elements.title, elements.summary, elements.decisions, elements.actions, elements.followUp, elements.consent]) {
  element.addEventListener("change", updateNotes);
  element.addEventListener("blur", updateNotes);
}

refresh();
setInterval(refresh, 1500);
