(function () {
  "use strict";

  const ATTRIBUTION_KEYS = [
    "campaign_id",
    "campaign_name",
    "adset_id",
    "adset_name",
    "ad_id",
    "ad_name",
    "placement",
    "site_source",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "fbclid",
    "fbp",
    "fbc",
  ];
  const SCROLL_DEPTHS = [25, 50, 75, 100];

  function cleanSlug(value, fallback) {
    const text = typeof value === "string" ? value.trim().toLowerCase() : "";
    const cleaned = text.replace(/[^a-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 120);
    return cleaned || fallback;
  }

  function randomId(prefix) {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return `${prefix}_${window.crypto.randomUUID()}`;
    }
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }

  function storageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Ignore blocked storage.
    }
  }

  function readCookie(name) {
    return document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${name}=`))
      ?.split("=")
      .slice(1)
      .join("=") || "";
  }

  function safeDecode(value) {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  function safeUrl(value, includeAllowedParams) {
    try {
      const parsed = new URL(value, window.location.origin);
      const safe = new URL(parsed.pathname, parsed.origin);
      if (includeAllowedParams) {
        ATTRIBUTION_KEYS.concat(["cta", "click_id", "om_click_id", "om_session_id", "omc", "oms", "utm_city"]).forEach((key) => {
          const paramValue = parsed.searchParams.get(key);
          if (paramValue) safe.searchParams.set(key, paramValue.slice(0, 500));
        });
      }
      return safe.toString();
    } catch {
      return undefined;
    }
  }

  function safeReferrer() {
    if (!document.referrer) return undefined;
    try {
      return new URL(document.referrer).origin;
    } catch {
      return undefined;
    }
  }

  function readAttribution(storageKey) {
    const incoming = new URLSearchParams(window.location.search);
    let stored = {};
    if (storageKey) {
      try {
        stored = JSON.parse(storageGet(storageKey) || "{}");
      } catch {
        stored = {};
      }
    }

    const attribution = { ...stored };
    ATTRIBUTION_KEYS.forEach((key) => {
      const value = incoming.get(key);
      if (value) attribution[key] = value;
    });

    const fbp = readCookie("_fbp");
    const fbc = readCookie("_fbc");
    if (fbp) attribution.fbp = safeDecode(fbp);
    if (fbc) attribution.fbc = safeDecode(fbc);

    if (storageKey) storageSet(storageKey, JSON.stringify(attribution));
    return attribution;
  }

  function getSessionId(key) {
    const storageKey = key || "om_funnel_session_id";
    const existing = storageGet(storageKey);
    if (existing) return existing;
    const created = randomId("oms");
    storageSet(storageKey, created);
    return created;
  }

  function deviceType(width) {
    if (width < 768) return "mobile";
    if (width < 1024) return "tablet";
    return "desktop";
  }

  function viewportPayload() {
    const width = Math.max(1, Math.round(window.innerWidth || document.documentElement.clientWidth || 0));
    const height = Math.max(1, Math.round(window.innerHeight || document.documentElement.clientHeight || 0));
    return {
      device_type: deviceType(width),
      viewport_height: height,
      viewport_orientation: width >= height ? "landscape" : "portrait",
      viewport_width: width,
    };
  }

  function send(endpoint, payload) {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
      return;
    }
    fetch(endpoint, {
      body,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      method: "POST",
    }).catch(() => {});
  }

  function maxScrollDepthPct() {
    const doc = document.documentElement;
    const total = Math.max(1, doc.scrollHeight);
    const viewedBottom = window.scrollY + (window.innerHeight || doc.clientHeight || 0);
    return Math.min(100, Math.round((viewedBottom / total) * 100));
  }

  function start(userConfig) {
    const config = userConfig || {};
    const sampleRate = typeof config.sampleRate === "number" && config.sampleRate > 0 && config.sampleRate <= 1
      ? config.sampleRate
      : 1;
    if (Math.random() > sampleRate) return { sampled: false };

    const endpoint = config.endpoint || "/api/attribution/funnel";
    const funnel = cleanSlug(config.funnel, "unknown");
    const market = cleanSlug(config.market, undefined);
    const sessionId = getSessionId(config.sessionStorageKey || `om_${funnel}_${market || "default"}_session_id`);
    const attributionStorageKey = config.attributionStorageKey || `om_${funnel}_${market || "default"}_attribution`;
    const allowOptionalHeatmap = window.navigator.globalPrivacyControl !== true;
    const sectionSelector = config.sectionSelector || "[data-om-section]";
    const ctaSelector = config.ctaSelector || "[data-cta]";
    const attribution = () => readAttribution(attributionStorageKey);

    function eventPayload(eventName, extra) {
      return {
        ...viewportPayload(),
        ...extra,
        attribution: attribution(),
        client_event_id: randomId("ome"),
        event_name: eventName,
        funnel,
        landing_url: safeUrl(window.location.href, true),
        market,
        page_url: safeUrl(window.location.href, true),
        referrer: safeReferrer(),
        sample_rate: sampleRate,
        session_id: sessionId,
      };
    }

    function fire(eventName, extra) {
      send(endpoint, eventPayload(eventName, extra || {}));
    }

    if (config.sendPageView) fire("page_view");

    if (allowOptionalHeatmap && config.sendScrollDepth !== false) {
      const firedDepths = new Set();
      function checkDepth() {
        const pct = maxScrollDepthPct();
        SCROLL_DEPTHS.forEach((depth) => {
          if (pct >= depth && !firedDepths.has(depth)) {
            firedDepths.add(depth);
            fire("scroll_depth", {
              metadata: { source: "om_funnel_analytics" },
              scroll_depth_pct: depth,
            });
          }
        });
      }
      window.addEventListener("scroll", checkDepth, { passive: true });
      window.addEventListener("load", checkDepth, { once: true });
      checkDepth();
    }

    if (allowOptionalHeatmap && "IntersectionObserver" in window) {
      function hasMeaningfulSectionVisibility(entry) {
        const visiblePixels = entry.intersectionRect?.height || 0;
        const pixelThreshold = Math.min(180, Math.max(96, (window.innerHeight || 0) * 0.18));
        return entry.isIntersecting && (entry.intersectionRatio >= 0.25 || visiblePixels >= pixelThreshold);
      }

      const seenSections = new Set();
      const sectionTimers = new WeakMap();
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const sectionId = cleanSlug(entry.target.getAttribute("data-om-section"), undefined);
            if (!sectionId || seenSections.has(sectionId)) return;
            if (hasMeaningfulSectionVisibility(entry)) {
              if (sectionTimers.has(entry.target)) return;
              const timer = window.setTimeout(() => {
                seenSections.add(sectionId);
                sectionObserver.unobserve(entry.target);
                fire("section_visible", {
                  metadata: { source: "om_funnel_analytics" },
                  section_id: sectionId,
                  visible_ratio: Math.min(1, Math.max(0, entry.intersectionRatio || 0.25)),
                });
              }, 1000);
              sectionTimers.set(entry.target, timer);
            } else {
              const timer = sectionTimers.get(entry.target);
              if (timer) window.clearTimeout(timer);
              sectionTimers.delete(entry.target);
            }
          });
        },
        { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
      );
      document.querySelectorAll(sectionSelector).forEach((section) => sectionObserver.observe(section));

      const seenCtas = new Set();
      const ctaObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const cta = cleanSlug(entry.target.getAttribute("data-cta"), undefined);
            if (!cta || seenCtas.has(cta) || !entry.isIntersecting || entry.intersectionRatio < 0.5) return;
            seenCtas.add(cta);
            ctaObserver.unobserve(entry.target);
            fire("cta_impression", {
              cta,
              metadata: { source: "om_funnel_analytics" },
              visible_ratio: Math.min(1, Math.max(0, entry.intersectionRatio || 0.5)),
            });
          });
        },
        { threshold: [0, 0.5, 0.75, 1] },
      );
      document.querySelectorAll(ctaSelector).forEach((cta) => ctaObserver.observe(cta));
    }

    if (config.sendTicketClick) {
      document.querySelectorAll(ctaSelector).forEach((link) => {
        link.addEventListener("click", () => {
          const cta = cleanSlug(link.getAttribute("data-cta"), "unknown");
          const clickId = link.getAttribute("data-om-click-id") || randomId("omc");
          link.setAttribute("data-om-click-id", clickId);
          fire("ticket_click", {
            click_id: clickId,
            cta,
            metadata: {
              destination: config.destination || "ticketing",
              source: "om_funnel_analytics",
            },
          });
        });
      });
    }

    return { sampled: true, sessionId };
  }

  window.OmFunnelAnalytics = { start };
})();
