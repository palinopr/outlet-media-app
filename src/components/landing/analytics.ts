"use client";

export type LandingEventPayload = Record<
  string,
  string | number | boolean | null | undefined
>;

function normalizePayload(payload: LandingEventPayload) {
  return Object.fromEntries(
    Object.entries(payload)
      .filter(([, value]) => value !== null && value !== undefined && value !== "")
      .map(([key, value]) => [key, String(value)]),
  ) as Record<string, string>;
}

export function trackLandingEvent(
  eventName: string,
  payload: LandingEventPayload = {},
) {
  if (typeof window === "undefined") return;

  const normalizedPayload = normalizePayload(payload);
  const w = window as typeof window & {
    dataLayer?: Record<string, unknown>[];
    fbq?: (
      eventType: "track" | "trackCustom",
      name: string,
      data?: Record<string, string>,
    ) => void;
  };

  w.dataLayer?.push({ event: eventName, ...normalizedPayload });

  if (eventName === "LeadFormSubmitted") {
    w.fbq?.("track", "Lead", normalizedPayload);
    return;
  }

  w.fbq?.("trackCustom", eventName, normalizedPayload);
}
