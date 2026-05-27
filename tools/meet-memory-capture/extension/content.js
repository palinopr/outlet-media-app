(() => {
  "use strict";

  const LOG_PREFIX = "[OutletMeetMemory]";
  const COMMIT_DELAY_MS = 1300;
  const SCAN_INTERVAL_MS = 650;
  const UPDATE_BROADCAST_DELAY_MS = 300;

  const state = {
    active: false,
    consentConfirmed: false,
    sessionId: null,
    startedAt: null,
    endedAt: null,
    title: "",
    notes: {
      summary: "",
      decisions: "",
      actions: "",
      followUp: "",
    },
    transcript: [],
    pendingBySpeaker: new Map(),
    recentKeys: [],
    observer: null,
    bodyObserver: null,
    scanTimer: null,
    broadcastTimer: null,
  };

  function log(...args) {
    console.log(LOG_PREFIX, ...args);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function getMeetCode() {
    const match = window.location.pathname.match(/\/([a-z]{3}-[a-z]{4}-[a-z]{3})/i);
    return match ? match[1] : "";
  }

  function getMeetingTitle() {
    const title = document.title.replace(/\s*-\s*Google Meet\s*$/i, "").trim();
    return title && title !== "Google Meet" ? title : getMeetCode() || "Google Meet";
  }

  function normalizeText(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .replace(/\s+([,.!?;:])/g, "$1")
      .trim();
  }

  function normalizeKey(speaker, text) {
    return `${normalizeText(speaker).toLowerCase()}\u0000${normalizeText(text).toLowerCase()}`;
  }

  function rememberKey(key) {
    state.recentKeys.push(key);
    if (state.recentKeys.length > 160) {
      state.recentKeys.shift();
    }
  }

  function isRecent(key) {
    return state.recentKeys.includes(key);
  }

  function getOffsetMs() {
    if (!state.startedAt) return 0;
    return Math.max(0, Date.now() - new Date(state.startedAt).getTime());
  }

  function serializeSession() {
    return {
      schemaVersion: 1,
      sessionId: state.sessionId,
      active: state.active,
      consentConfirmed: state.consentConfirmed,
      meeting: {
        title: state.title || getMeetingTitle(),
        url: window.location.href,
        meetCode: getMeetCode(),
        startedAt: state.startedAt,
        endedAt: state.endedAt,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
      },
      notes: { ...state.notes },
      transcript: state.transcript.map((entry) => ({ ...entry })),
      pendingCount: state.pendingBySpeaker.size,
    };
  }

  function scheduleBroadcast() {
    if (state.broadcastTimer) clearTimeout(state.broadcastTimer);
    state.broadcastTimer = setTimeout(() => {
      chrome.runtime.sendMessage({
        type: "OUTLET_MEET_SESSION_UPDATE",
        session: serializeSession(),
      }).catch(() => {});
    }, UPDATE_BROADCAST_DELAY_MS);
  }

  function startCapture(payload = {}) {
    if (state.active) {
      state.consentConfirmed = Boolean(payload.consentConfirmed ?? state.consentConfirmed);
      state.notes = { ...state.notes, ...(payload.notes || {}) };
      scheduleBroadcast();
      return serializeSession();
    }

    state.active = true;
    state.consentConfirmed = Boolean(payload.consentConfirmed);
    state.sessionId = `meet-${Date.now()}`;
    state.startedAt = nowIso();
    state.endedAt = null;
    state.title = payload.title || getMeetingTitle();
    state.notes = { ...state.notes, ...(payload.notes || {}) };
    state.transcript = [];
    state.pendingBySpeaker.clear();
    state.recentKeys = [];

    ensureCaptionsEnabled();
    attachObservers();
    scanCaptions();
    state.scanTimer = setInterval(scanCaptions, SCAN_INTERVAL_MS);
    scheduleBroadcast();
    return serializeSession();
  }

  function stopCapture(payload = {}) {
    state.notes = { ...state.notes, ...(payload.notes || {}) };
    flushPending(true);
    state.active = false;
    state.endedAt = nowIso();
    detachObservers();
    scheduleBroadcast();
    return serializeSession();
  }

  function clearCapture() {
    detachObservers();
    state.active = false;
    state.sessionId = null;
    state.startedAt = null;
    state.endedAt = null;
    state.title = "";
    state.notes = { summary: "", decisions: "", actions: "", followUp: "" };
    state.transcript = [];
    state.pendingBySpeaker.clear();
    state.recentKeys = [];
    scheduleBroadcast();
    return serializeSession();
  }

  function ensureCaptionsEnabled() {
    const buttons = Array.from(document.querySelectorAll("button[aria-label], div[role='button'][aria-label]"));
    const captionsButton = buttons.find((button) => {
      const label = button.getAttribute("aria-label") || "";
      return /turn on captions|show captions|captions/i.test(label) && !/turn off captions|hide captions/i.test(label);
    });

    if (captionsButton) {
      captionsButton.click();
      return;
    }

    document.dispatchEvent(new KeyboardEvent("keydown", {
      key: "c",
      code: "KeyC",
      bubbles: true,
      cancelable: true,
    }));
  }

  function findCaptionRegion() {
    const direct = document.querySelector(
      '[role="region"][aria-label*="caption" i], [role="region"][aria-label*="subtitle" i], [jsname="tgaKEf"], [jsname="DS9Ooe"]'
    );
    if (direct && direct.textContent.trim()) return direct;

    const candidates = Array.from(document.querySelectorAll('[aria-live="polite"], [aria-live="assertive"]'))
      .filter((element) => {
        const text = normalizeText(element.textContent);
        if (!text || text.length < 2) return false;
        if (element.querySelector("button, input, textarea, [role='button']")) return false;
        return element.children.length > 0 || text.length > 30;
      })
      .sort((a, b) => b.textContent.length - a.textContent.length);

    return candidates[0] || null;
  }

  function attachObservers() {
    detachObservers();

    state.bodyObserver = new MutationObserver(() => {
      if (!state.active) return;
      const region = findCaptionRegion();
      if (region && !state.observer) observeRegion(region);
    });
    state.bodyObserver.observe(document.body, { childList: true, subtree: true });

    const region = findCaptionRegion();
    if (region) observeRegion(region);
  }

  function observeRegion(region) {
    if (state.observer) state.observer.disconnect();
    state.observer = new MutationObserver(() => scanCaptions());
    state.observer.observe(region, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    log("Caption region attached", region.getAttribute("aria-label") || region.getAttribute("jsname") || region.tagName);
  }

  function detachObservers() {
    if (state.observer) state.observer.disconnect();
    if (state.bodyObserver) state.bodyObserver.disconnect();
    if (state.scanTimer) clearInterval(state.scanTimer);
    state.observer = null;
    state.bodyObserver = null;
    state.scanTimer = null;
  }

  function scanCaptions() {
    if (!state.active) return;
    const region = findCaptionRegion();
    if (!region) {
      flushPending(false);
      return;
    }

    if (!state.observer) observeRegion(region);
    const entries = extractCaptionEntries(region);
    if (!entries.length) {
      flushPending(false);
      return;
    }

    for (const entry of entries) {
      queueCaption(entry.speaker, entry.text);
    }
    flushPending(false);
  }

  function extractCaptionEntries(region) {
    const byJsname = extractByJsname(region);
    if (byJsname.length) return byJsname;

    const structured = extractByStructure(region);
    if (structured.length) return structured;

    const text = normalizeText(region.textContent);
    return text ? [{ speaker: "Unknown", text }] : [];
  }

  function extractByJsname(region) {
    const blocks = Array.from(region.querySelectorAll('[jsname="YSxPC"], [data-speaker-id]'));
    const entries = [];

    for (const block of blocks) {
      const speaker = normalizeText(
        block.querySelector('[jsname="r4nke"], [data-self-name], [data-participant-id]')?.textContent
      );
      const text = normalizeText(
        block.querySelector('[jsname="bVV8Bd"]')?.textContent || block.textContent
      );
      const cleanedText = speaker && text.startsWith(speaker)
        ? normalizeText(text.slice(speaker.length))
        : text;

      if (cleanedText) entries.push({ speaker: speaker || "Unknown", text: cleanedText });
    }

    return dedupeEntries(entries);
  }

  function extractByStructure(region) {
    const container = drillToEntryContainer(region);
    const children = Array.from(container.children || []);
    const entries = [];

    for (const child of children.length ? children : [container]) {
      const leaves = [];
      collectTextLeaves(child, leaves);
      if (!leaves.length) continue;

      const split = splitLeavesIntoCaption(leaves);
      if (split.text) entries.push(split);
    }

    return dedupeEntries(entries);
  }

  function drillToEntryContainer(region) {
    let element = region;
    while (element.children?.length === 1 && element.children[0].children?.length > 0) {
      element = element.children[0];
    }
    return element;
  }

  function collectTextLeaves(element, out) {
    if (!element || element instanceof SVGElement) return;
    if (["BUTTON", "INPUT", "TEXTAREA", "SVG", "IMG"].includes(element.tagName)) return;
    if (element.getAttribute?.("aria-hidden") === "true") return;
    if (element.getAttribute?.("role") === "button") return;

    const className = typeof element.className === "string" ? element.className : "";
    if (/material-icons|google-symbols|google-material-icons/i.test(className)) return;

    if (!element.children || element.children.length === 0) {
      const text = normalizeText(element.textContent);
      if (text && !isJunkText(text)) {
        let fontSize = 14;
        let isBold = false;
        try {
          const style = window.getComputedStyle(element);
          fontSize = Number.parseFloat(style.fontSize) || 14;
          isBold = Number.parseInt(style.fontWeight, 10) >= 500;
        } catch (_error) {}
        out.push({ text, fontSize, isBold });
      }
      return;
    }

    for (const child of element.children) {
      collectTextLeaves(child, out);
    }
  }

  function splitLeavesIntoCaption(leaves) {
    if (leaves.length === 1) {
      return { speaker: "Unknown", text: leaves[0].text };
    }

    const fontSizes = leaves.map((leaf) => leaf.fontSize);
    const maxFont = Math.max(...fontSizes);
    const markerIndex = leaves.findIndex((leaf, index) => {
      if (index > 2) return false;
      if (leaf.text.length > 60) return false;
      if (leaf.isBold) return true;
      return maxFont - leaf.fontSize > 0.5;
    });

    if (markerIndex >= 0 && leaves[markerIndex + 1]) {
      return {
        speaker: leaves[markerIndex].text,
        text: normalizeText(leaves.slice(markerIndex + 1).map((leaf) => leaf.text).join(" ")),
      };
    }

    const first = leaves[0].text;
    const rest = normalizeText(leaves.slice(1).map((leaf) => leaf.text).join(" "));
    if (first.length <= 60 && rest) {
      return { speaker: first, text: rest };
    }

    return { speaker: "Unknown", text: normalizeText(leaves.map((leaf) => leaf.text).join(" ")) };
  }

  function isJunkText(text) {
    const normalized = text.toLowerCase();
    return [
      "close",
      "more_vert",
      "expand_more",
      "expand_less",
      "arrow_downward",
      "arrow_upward",
      "jump to bottom",
    ].includes(normalized);
  }

  function dedupeEntries(entries) {
    const seen = new Set();
    const result = [];

    for (const entry of entries) {
      const speaker = normalizeText(entry.speaker) || "Unknown";
      const text = normalizeText(entry.text);
      if (!text) continue;
      const key = normalizeKey(speaker, text);
      if (seen.has(key)) continue;
      seen.add(key);
      result.push({ speaker, text });
    }

    return result;
  }

  function queueCaption(rawSpeaker, rawText) {
    const speaker = normalizeText(rawSpeaker) || "Unknown";
    const text = normalizeText(rawText);
    if (!text) return;

    const pending = state.pendingBySpeaker.get(speaker);
    if (pending?.text === text) return;

    state.pendingBySpeaker.set(speaker, {
      speaker,
      text,
      firstSeenAt: pending?.firstSeenAt || Date.now(),
      lastChangedAt: Date.now(),
    });
  }

  function flushPending(force) {
    const currentTime = Date.now();

    for (const [speaker, pending] of state.pendingBySpeaker.entries()) {
      if (!force && currentTime - pending.lastChangedAt < COMMIT_DELAY_MS) continue;

      commitCaption(pending.speaker, pending.text);
      state.pendingBySpeaker.delete(speaker);
    }
  }

  function commitCaption(speaker, text) {
    const key = normalizeKey(speaker, text);
    if (isRecent(key)) return;

    const last = state.transcript[state.transcript.length - 1];
    if (
      last &&
      last.speaker === speaker &&
      Math.abs(Date.now() - new Date(last.capturedAt).getTime()) < 10000 &&
      (text.startsWith(last.text) || last.text.startsWith(text))
    ) {
      last.text = text.length >= last.text.length ? text : last.text;
      last.capturedAt = nowIso();
      rememberKey(normalizeKey(last.speaker, last.text));
      scheduleBroadcast();
      return;
    }

    state.transcript.push({
      speaker,
      text,
      capturedAt: nowIso(),
      offsetMs: getOffsetMs(),
    });
    rememberKey(key);
    scheduleBroadcast();
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "OUTLET_MEET_START") {
      sendResponse({ ok: true, session: startCapture(message.payload || {}) });
      return true;
    }

    if (message?.type === "OUTLET_MEET_STOP") {
      sendResponse({ ok: true, session: stopCapture(message.payload || {}) });
      return true;
    }

    if (message?.type === "OUTLET_MEET_CLEAR") {
      sendResponse({ ok: true, session: clearCapture() });
      return true;
    }

    if (message?.type === "OUTLET_MEET_UPDATE_NOTES") {
      state.notes = { ...state.notes, ...(message.payload?.notes || {}) };
      state.consentConfirmed = Boolean(message.payload?.consentConfirmed ?? state.consentConfirmed);
      state.title = message.payload?.title || state.title;
      scheduleBroadcast();
      sendResponse({ ok: true, session: serializeSession() });
      return true;
    }

    if (message?.type === "OUTLET_MEET_GET_STATE") {
      flushPending(false);
      sendResponse({ ok: true, session: serializeSession() });
      return true;
    }

    return false;
  });

  log("Ready");
})();
