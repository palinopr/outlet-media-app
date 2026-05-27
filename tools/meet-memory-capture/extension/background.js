const STORAGE_KEY = "outletMeetMemorySessions";

async function getSessions() {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  return stored[STORAGE_KEY] || {};
}

async function saveSession(tabId, session) {
  const sessions = await getSessions();
  sessions[String(tabId)] = {
    ...session,
    savedAt: new Date().toISOString(),
  };
  await chrome.storage.local.set({ [STORAGE_KEY]: sessions });
}

async function getActiveMeetTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url?.startsWith("https://meet.google.com/")) {
    return null;
  }
  return tab;
}

async function askTab(tabId, message) {
  try {
    return await chrome.tabs.sendMessage(tabId, message);
  } catch (_error) {
    return null;
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    if (message?.type === "OUTLET_MEET_SESSION_UPDATE" && sender.tab?.id) {
      await saveSession(sender.tab.id, message.session);
      sendResponse({ ok: true });
      return;
    }

    if (message?.type === "OUTLET_MEET_GET_ACTIVE_STATE") {
      const tab = await getActiveMeetTab();
      if (!tab) {
        sendResponse({ ok: false, error: "Open a Google Meet tab first." });
        return;
      }

      const live = await askTab(tab.id, { type: "OUTLET_MEET_GET_STATE" });
      if (live?.ok) {
        await saveSession(tab.id, live.session);
        sendResponse({ ok: true, tabId: tab.id, tabUrl: tab.url, session: live.session });
        return;
      }

      const sessions = await getSessions();
      sendResponse({
        ok: true,
        tabId: tab.id,
        tabUrl: tab.url,
        session: sessions[String(tab.id)] || null,
      });
      return;
    }

    if (message?.type === "OUTLET_MEET_SEND_TO_ACTIVE_TAB") {
      const tab = await getActiveMeetTab();
      if (!tab) {
        sendResponse({ ok: false, error: "Open a Google Meet tab first." });
        return;
      }

      const response = await askTab(tab.id, message.payload);
      sendResponse(response || { ok: false, error: "Meet capture script is not ready. Refresh the Meet tab." });
      return;
    }

    sendResponse({ ok: false, error: "Unknown message." });
  })();

  return true;
});
