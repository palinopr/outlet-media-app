import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { google } from "googleapis";
import { fileURLToPath } from "node:url";
import { notifyOwnerImportant } from "./owner-discord-service.js";
import { notifyChannel } from "../discord/core/entry.js";

const SA_KEY_PATH = fileURLToPath(new URL("../../service-account.json", import.meta.url));
const IMPERSONATE_USER = process.env.GMAIL_IMPERSONATE_USER ?? "jaime@outletmedia.net";
const CALENDAR_AUTH_MODE = (process.env.GOOGLE_CALENDAR_AUTH ?? "oauth-first").toLowerCase();
const OAUTH_REDIRECT_URI = process.env.GOOGLE_OAUTH_REDIRECT_URI ?? "http://localhost:9876";
const DEFAULT_TIMEZONE = process.env.MEETING_TIMEZONE ?? "America/Chicago";
const DEFAULT_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID ?? "primary";
const REMINDER_WINDOW_MINUTES = 6;

const CALENDAR_SCOPES = ["https://www.googleapis.com/auth/calendar"];

const notifiedEventIds = new Map<string, number>();

export interface MeetingEventInput {
  title: string;
  startIso: string;
  durationMinutes?: number;
  location?: string;
  attendeeEmails?: string[];
  description?: string;
  noMeet?: boolean;
}

interface CalendarEventResult {
  eventId: string;
  htmlLink: string;
  conferenceLink: string;
  summary: string;
}

function loadServiceAccountKey(): { client_email: string; private_key: string } {
  return JSON.parse(readFileSync(SA_KEY_PATH, "utf-8")) as { client_email: string; private_key: string };
}

function hasOAuthRefreshConfig(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN,
  );
}

function getCalendarAuth() {
  const preferOAuth = CALENDAR_AUTH_MODE !== "service-account";
  if (preferOAuth && hasOAuthRefreshConfig()) {
    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      OAUTH_REDIRECT_URI,
    );
    client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    return client;
  }

  const key = loadServiceAccountKey();
  return new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: CALENDAR_SCOPES,
    subject: IMPERSONATE_USER,
  });
}

function getCalendar() {
  const auth = getCalendarAuth();
  return google.calendar({ version: "v3", auth });
}

function normalizeDateTime(iso: string): { dateTime: string; timeZone?: string } {
  const trimmed = iso.trim();
  if (/[zZ]$|[+-]\d{2}:\d{2}$/.test(trimmed)) {
    return { dateTime: trimmed };
  }

  const normalized = trimmed.includes("T") ? trimmed : trimmed.replace(" ", "T");
  const withSeconds = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(normalized)
    ? `${normalized}:00`
    : normalized;

  return { dateTime: withSeconds, timeZone: DEFAULT_TIMEZONE };
}

function computeEnd(startIso: string, durationMinutes: number): { dateTime: string; timeZone?: string } {
  const start = normalizeDateTime(startIso);
  const match = start.dateTime.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
  if (!match) throw new Error(`Invalid start datetime: ${startIso}`);

  const [y, mo, d, h, mi, s] = match.slice(1).map(Number);
  const dt = new Date(y, mo - 1, d, h, mi + durationMinutes, s);
  const pad = (n: number) => String(n).padStart(2, "0");
  const endStr = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;

  return start.timeZone
    ? { dateTime: endStr, timeZone: start.timeZone }
    : { dateTime: endStr };
}

function extractConferenceLink(event: {
  hangoutLink?: string | null;
  conferenceData?: { entryPoints?: Array<{ entryPointType?: string | null; uri?: string | null }> } | null;
}): string {
  if (event.hangoutLink) return event.hangoutLink;
  const videoEntry = event.conferenceData?.entryPoints?.find((ep) => ep.entryPointType === "video");
  return videoEntry?.uri ?? "";
}

export async function createCalendarEvent(input: MeetingEventInput): Promise<CalendarEventResult> {
  const calendar = getCalendar();
  const duration = input.durationMinutes ?? 30;
  const start = normalizeDateTime(input.startIso);
  const end = computeEnd(input.startIso, duration);
  const includeMeet = !input.noMeet;

  const attendees = (input.attendeeEmails ?? [])
    .filter(Boolean)
    .map((email) => ({ email }));

  const response = await calendar.events.insert({
    calendarId: DEFAULT_CALENDAR_ID,
    conferenceDataVersion: includeMeet ? 1 : 0,
    sendUpdates: "all",
    requestBody: {
      summary: input.title,
      description: input.description,
      location: input.location,
      start,
      end,
      attendees,
      conferenceData: includeMeet
        ? {
            createRequest: {
              requestId: randomUUID(),
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          }
        : undefined,
    },
  });

  const event = response.data;
  return {
    eventId: event.id ?? "",
    htmlLink: event.htmlLink ?? "",
    conferenceLink: extractConferenceLink(event),
    summary: event.summary ?? input.title,
  };
}

function cleanupNotifiedSet(): void {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [eventId, timestamp] of notifiedEventIds) {
    if (timestamp < oneHourAgo) {
      notifiedEventIds.delete(eventId);
    }
  }
}

function formatEventTime(event: { start?: { dateTime?: string | null; date?: string | null } }): string {
  const dt = event.start?.dateTime ?? event.start?.date ?? "unknown";
  try {
    return new Date(dt).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: DEFAULT_TIMEZONE,
    });
  } catch {
    return dt;
  }
}

export async function checkMeetingReminders(): Promise<string> {
  cleanupNotifiedSet();

  const calendar = getCalendar();
  const now = new Date();
  const windowEnd = new Date(now.getTime() + REMINDER_WINDOW_MINUTES * 60_000);

  const response = await calendar.events.list({
    calendarId: DEFAULT_CALENDAR_ID,
    timeMin: now.toISOString(),
    timeMax: windowEnd.toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });

  const events = response.data.items ?? [];
  // Only notify for events that haven't started yet (filters out in-progress events)
  const futureEvents = events.filter((ev) => {
    const startStr = ev.start?.dateTime ?? ev.start?.date;
    if (!startStr) return false;
    return new Date(startStr).getTime() > now.getTime();
  });
  const dedupKey = (ev: { id?: string | null; start?: { dateTime?: string | null } }) =>
    `${ev.id ?? ""}:${ev.start?.dateTime ?? ""}`;
  const newEvents = futureEvents.filter((ev) => ev.id && !notifiedEventIds.has(dedupKey(ev)));

  if (newEvents.length === 0) {
    return "No upcoming meetings in the next few minutes.";
  }

  const notifications: string[] = [];
  for (const event of newEvents) {
    if (!event.id) continue;

    const link = extractConferenceLink(event) || event.htmlLink || "";
    const time = formatEventTime(event);
    const message = [
      `Meeting in ~5 min: ${event.summary ?? "(no title)"}`,
      `Time: ${time}`,
      `Link: ${link}`,
    ].join("\n");

    await Promise.all([
      notifyOwnerImportant(message, { channel: "boss" }),
      notifyChannel("meetings", message),
    ]);
    notifiedEventIds.set(dedupKey(event), Date.now());
    notifications.push(event.summary ?? "(no title)");
  }

  return `Sent ${notifications.length} meeting reminder(s): ${notifications.join(", ")}`;
}
