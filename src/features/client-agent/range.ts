import {
  type ResolvedRange,
  ResolvedRangePresetSchema,
  ResolvedRangeSchema,
} from "./types";

type NormalizeRangeOptions = {
  now?: Date;
  timezone: string;
};

const RANGE_ALIASES = new Map<string, string>([
  ["today", "today"],
  ["yesterday", "yesterday"],
  ["last 7 days", "last_7_days"],
  ["last_7_days", "last_7_days"],
  ["last 30 days", "last_30_days"],
  ["last_30_days", "last_30_days"],
  ["this week", "this_week"],
  ["this_week", "this_week"],
  ["this month", "this_month"],
  ["this_month", "this_month"],
  ["this quarter", "this_quarter"],
  ["this_quarter", "this_quarter"],
]);

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(timezone: string) {
  let formatter = formatterCache.get(timezone);

  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    formatterCache.set(timezone, formatter);
  }

  return formatter;
}

function getLocalDateString(now: Date, timezone: string) {
  const parts = getFormatter(timezone).formatToParts(now);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error(`Unable to resolve local date for timezone ${timezone}`);
  }

  return `${year}-${month}-${day}`;
}

function parseDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  if (!year || !month || !day) {
    throw new Error(`Invalid date: ${date}`);
  }

  return { year, month, day };
}

function formatDate(parts: { year: number; month: number; day: number }) {
  const month = String(parts.month).padStart(2, "0");
  const day = String(parts.day).padStart(2, "0");

  return `${parts.year}-${month}-${day}`;
}

function addDays(date: string, delta: number) {
  const { year, month, day } = parseDate(date);
  const utcDate = new Date(Date.UTC(year, month - 1, day + delta));

  return formatDate({
    year: utcDate.getUTCFullYear(),
    month: utcDate.getUTCMonth() + 1,
    day: utcDate.getUTCDate(),
  });
}

function startOfWeek(date: string) {
  const { year, month, day } = parseDate(date);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  const dayOfWeek = utcDate.getUTCDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  return addDays(date, -daysFromMonday);
}

function startOfMonth(date: string) {
  const { year, month } = parseDate(date);

  return formatDate({ year, month, day: 1 });
}

function startOfQuarter(date: string) {
  const { year, month } = parseDate(date);
  const quarterMonth = Math.floor((month - 1) / 3) * 3 + 1;

  return formatDate({ year, month: quarterMonth, day: 1 });
}

export function normalizeRange(input: string, options: NormalizeRangeOptions): ResolvedRange {
  const normalizedInput = RANGE_ALIASES.get(input.trim().toLowerCase());

  if (!normalizedInput) {
    throw new Error(`Unsupported range: ${input}`);
  }

  const preset = ResolvedRangePresetSchema.parse(normalizedInput);
  const timezone = options.timezone;
  const today = getLocalDateString(options.now ?? new Date(), timezone);
  let startDate = today;
  let endDate = today;

  switch (preset) {
    case "today":
      break;
    case "yesterday":
      startDate = addDays(today, -1);
      endDate = startDate;
      break;
    case "last_7_days":
      startDate = addDays(today, -6);
      break;
    case "last_30_days":
      startDate = addDays(today, -29);
      break;
    case "this_week":
      startDate = startOfWeek(today);
      break;
    case "this_month":
      startDate = startOfMonth(today);
      break;
    case "this_quarter":
      startDate = startOfQuarter(today);
      break;
    case "custom":
      throw new Error("Custom ranges must provide explicit start and end dates");
  }

  return ResolvedRangeSchema.parse({
    preset,
    startDate,
    endDate,
    timezone,
  });
}

export function resolveRangeFromMessage(
  message: string,
  options: NormalizeRangeOptions,
): ResolvedRange | null {
  const lowerMessage = message.toLowerCase();
  const supportedRanges = [
    "last 30 days",
    "last 7 days",
    "this quarter",
    "this month",
    "this week",
    "yesterday",
    "today",
  ];

  const matchedPhrases = supportedRanges.filter((phrase) => lowerMessage.includes(phrase));

  if (matchedPhrases.length !== 1) {
    return null;
  }

  return normalizeRange(matchedPhrases[0], options);
}
