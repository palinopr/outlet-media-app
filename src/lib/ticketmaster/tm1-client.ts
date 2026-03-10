export const TM1_DEFAULT_BASE_URL = "https://one.ticketmaster.com";
export const TM1_DEFAULT_API_PREFIX = "/api/prd119/api/caui";
export const TM1_DEFAULT_EVENTBASE_API_PREFIX = "/api/events";
export const TM1_DEFAULT_EVENT_START = "2026-02-01";
export const TM1_DEFAULT_EVENT_END = "2029-12-31";
export const TM1_ETAG_HEADER = "etag";
export const TM1_EXTERNAL_EVENT_VERSION_HEADER = "Etag-external-event-version";
export const TM1_IF_MATCH_HEADER = "If-Match";
export const TM1_INVENTORY_ASSOCIATED_ACTION = "INVENTORY_ASSOCIATED_BACKEND_TO_OBJECT";
export const TM1_INVENTORY_SET_TYPE_ALLOCATION = "allocationAndSeatstatus";
export const TM1_OPEN_SEAT_STATUS = "Open";

type Tm1JsonPayload = Record<string, unknown> | unknown[];
type Tm1NumericPrimitive = number | string | null | undefined;

export type Tm1RequestMethod = "GET" | "POST";

export interface Tm1ClientConfig {
  apiPrefix?: string;
  baseUrl?: string;
  cookie: string;
  defaultEventEndDate?: string;
  defaultEventStartDate?: string;
  eventbaseApiPrefix?: string;
  tcode: string;
  timeoutMs?: number;
  xsrfToken?: string;
}

export interface Tm1EventMeta {
  city?: string;
  eventDate?: string;
  eventId: string;
  eventName?: string;
  state?: string;
  venueName?: string;
}

export interface Tm1NormalizedSummary {
  available: number | null;
  availableRevenue: number | null;
  comp: number | null;
  holds: number | null;
  netCapacity: number | null;
  opens: number | null;
  potentialRevenue: number | null;
  sold: number | null;
  soldToday: number | null;
  source: Record<string, unknown>;
  totalRevenue: number | null;
  totalRevenueToday: number | null;
  totalTickets: number | null;
}

export interface Tm1EventSnapshot {
  channels: Record<string, unknown> | null;
  event: Tm1EventMeta | null;
  eventId: string;
  pulledAt: string;
  raw?: {
    channels: Record<string, unknown> | null;
    events: Record<string, unknown> | null;
    summary: Record<string, unknown>;
  };
  summary: Tm1NormalizedSummary;
  tcode: string;
}

export type Tm1SelectionSource = unknown;

export interface Tm1ReservedSectionSelection {
  sectionId: string;
  source?: Tm1SelectionSource;
}

export interface Tm1RowSelection extends Tm1ReservedSectionSelection {
  rowId: string;
}

export interface Tm1PlaceSelection extends Tm1RowSelection {
  placeId: string;
}

export interface Tm1PartialGaSelection {
  sectionId: string;
  sources: Tm1SelectionSource[];
}

export interface Tm1FullGaSelection {
  sectionId: string;
  source: Tm1SelectionSource;
}

export interface Tm1BackendSelection {
  fullGaSelections?: Tm1FullGaSelection[];
  partialGaSelections?: Tm1PartialGaSelection[];
  placeSelections?: Tm1PlaceSelection[];
  rowSelections?: Tm1RowSelection[];
  rsSectionSelections?: Tm1ReservedSectionSelection[];
}

export interface Tm1MoveSelectionSuccessAction extends Record<string, unknown> {
  selections?: unknown;
  targetId?: string;
  targetType?: string;
  type: string;
}

export type Tm1MoveSelectionTarget =
  | {
      kind: "allocation";
      allocationDisplayName: string;
      successAction?: Tm1MoveSelectionSuccessAction;
      targetId: string;
    }
  | {
      kind: "open";
      successAction?: Tm1MoveSelectionSuccessAction;
    };

export interface Tm1MoveSelectionContext {
  event: Record<string, unknown>;
  eventId: string;
  externalEventVersion: number | null;
  inventory: Record<string, unknown>;
  inventoryVersion: number;
  layout: Record<string, unknown>;
  layoutVersion: string;
}

export interface Tm1MoveSelectionOptions {
  eventId: string;
  externalEventVersion?: number | null;
  inventoryVersion?: number;
  layoutVersion?: string;
  selection: Tm1BackendSelection;
  target: Tm1MoveSelectionTarget;
}

export interface Tm1MoveSelectionResult {
  eventId: string;
  externalEventVersion: number | null;
  inventoryVersion: number;
  layoutVersion: string;
  nonMovedSeats: unknown[];
  raw: Record<string, unknown>;
  requestPath: string;
  target: Tm1MoveSelectionTarget;
  totalMovedSeats: number | null;
}

interface Tm1RequestOptions {
  apiPrefix?: string;
  body?: unknown;
  headers?: Record<string, string>;
  method?: Tm1RequestMethod;
  params?: Record<string, string | number | boolean | null | undefined>;
}

interface Tm1Response<T> {
  data: T;
  headers: Headers;
  requestPath: string;
  status: number;
}

export class Tm1ClientError extends Error {
  readonly body: string;
  readonly path: string;
  readonly status: number;

  constructor(message: string, details: { body?: string; path: string; status: number }) {
    super(message);
    this.name = "Tm1ClientError";
    this.body = details.body ?? "";
    this.path = details.path;
    this.status = details.status;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toNumber(value: number | string | null | undefined): number | null {
  if (value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function extractNumericValue(value: unknown): Tm1NumericPrimitive {
  if (value == null || typeof value === "number" || typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && "value" in value) {
    const nested = value.value;
    if (nested == null || typeof nested === "number" || typeof nested === "string") {
      return nested;
    }
  }

  return undefined;
}

function firstNumericValue(value: unknown): number | null {
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    return toNumber(extractNumericValue(value[0]));
  }

  return toNumber(extractNumericValue(value));
}

function parseEtagVersion(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number(value.replace(/"/g, "").replace(/W\//g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function encodeIfMatch(version: number): string {
  return `"${version}"`;
}

function ensureRecordPayload(payload: unknown, label: string): Record<string, unknown> {
  if (!isRecord(payload)) {
    throw new Error(`TM1 ${label} payload was not a JSON object.`);
  }
  return payload;
}

function extractInventoryVersion(payload: Record<string, unknown>): number | null {
  const direct = firstNumericValue(payload.version);
  if (direct != null) return direct;

  const nestedInventory = isRecord(payload.inventory) ? payload.inventory : null;
  return nestedInventory ? firstNumericValue(nestedInventory.version) : null;
}

function extractLayoutVersion(payload: Record<string, unknown>): string | null {
  const direct = extractNumericValue(payload.version);
  if (typeof direct === "string" || typeof direct === "number") {
    return String(direct);
  }

  const nestedLayout = isRecord(payload.layout) ? payload.layout : null;
  const nested = nestedLayout ? extractNumericValue(nestedLayout.version) : undefined;
  if (typeof nested === "string" || typeof nested === "number") {
    return String(nested);
  }

  return null;
}

function extractExternalEventVersion(
  payload: Record<string, unknown>,
  headers: Headers,
): number | null {
  const headerVersion = parseEtagVersion(headers.get(TM1_EXTERNAL_EVENT_VERSION_HEADER));
  if (headerVersion != null) return headerVersion;

  return firstNumericValue(payload.externalEventVersion);
}

function withQuery(
  path: string,
  params: Record<string, string | number | boolean | null | undefined> | undefined,
): string {
  if (!params) return path;
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value == null) continue;
    qs.set(key, String(value));
  }
  const query = qs.toString();
  return query.length > 0 ? `${path}?${query}` : path;
}

function sanitizeSuccessAction(
  action: Tm1MoveSelectionSuccessAction,
): Tm1MoveSelectionSuccessAction {
  const sanitized = { ...action };
  if ("selections" in sanitized) {
    delete sanitized.selections;
  }
  return sanitized;
}

function defaultSuccessAction(target: Tm1MoveSelectionTarget): Tm1MoveSelectionSuccessAction {
  if (target.kind === "allocation") {
    return {
      type: TM1_INVENTORY_ASSOCIATED_ACTION,
      targetType: TM1_INVENTORY_SET_TYPE_ALLOCATION,
      targetId: target.targetId,
    };
  }

  return {
    type: TM1_INVENTORY_ASSOCIATED_ACTION,
    targetType: TM1_INVENTORY_SET_TYPE_ALLOCATION,
    targetId: TM1_OPEN_SEAT_STATUS,
  };
}

function normalizeMoveSelectionBody(
  eventId: string,
  selection: Tm1BackendSelection,
  layoutVersion: string,
  target: Tm1MoveSelectionTarget,
): { body: Record<string, unknown>; path: string } {
  const successAction = sanitizeSuccessAction(target.successAction ?? defaultSuccessAction(target));
  const baseBody: Record<string, unknown> = {
    selection,
    layoutVersion,
    successAction,
  };

  if (target.kind === "allocation") {
    return {
      path: `/events/${eventId}/inventory/moveSelection/allocation/${target.targetId}`,
      body: {
        allocationDisplayName: target.allocationDisplayName,
        ...baseBody,
      },
    };
  }

  return {
    path: `/events/${eventId}/inventory/moveSelection/standardOfferAllocation`,
    body: baseBody,
  };
}

export function normalizeTm1Summary(summary: Record<string, unknown>): Tm1NormalizedSummary {
  const figures =
    summary.figures && typeof summary.figures === "object"
      ? (summary.figures as Record<string, unknown>)
      : {};

  const sold = firstNumericValue(figures.sold) ?? firstNumericValue(figures.totalSold);
  const totalTickets = firstNumericValue(figures.totalTickets) ?? firstNumericValue(figures.totalSold);
  const netCapacity = firstNumericValue(figures.netCapacity) ?? firstNumericValue(figures.capacity);

  let opens = firstNumericValue(figures.opens) ?? firstNumericValue(figures.open);
  const holds = firstNumericValue(figures.holds) ?? firstNumericValue(figures.hold);
  let available = firstNumericValue(figures.available);

  if (available == null && opens != null && holds != null) {
    available = opens + holds;
  }
  if (opens == null && available != null && holds != null) {
    opens = Math.max(available - holds, 0);
  }

  const totalRevenue =
    firstNumericValue(figures.totalRevenue) ?? firstNumericValue(figures.ticketRevenue);
  const potentialRevenue = firstNumericValue(figures.potentialRevenue);
  let availableRevenue = firstNumericValue(figures.availableRevenue);
  if (availableRevenue == null && totalRevenue != null && potentialRevenue != null) {
    availableRevenue = potentialRevenue - totalRevenue;
  }

  const source =
    summary.source && typeof summary.source === "object"
      ? (summary.source as Record<string, unknown>)
      : {};

  return {
    sold,
    totalTickets,
    netCapacity,
    opens,
    holds,
    available,
    comp: firstNumericValue(figures.comp),
    soldToday: firstNumericValue(figures.ticketsSoldToday),
    totalRevenue,
    totalRevenueToday: firstNumericValue(figures.totalRevenueToday),
    potentialRevenue,
    availableRevenue,
    source,
  };
}

export class Tm1Client {
  private readonly apiPrefix: string;
  private readonly baseUrl: string;
  private readonly cookie: string;
  private readonly defaultEventEndDate: string;
  private readonly defaultEventStartDate: string;
  private readonly eventbaseApiPrefix: string;
  readonly tcode: string;
  private readonly timeoutMs: number;
  private readonly xsrfToken?: string;

  constructor(config: Tm1ClientConfig) {
    this.apiPrefix = config.apiPrefix ?? TM1_DEFAULT_API_PREFIX;
    this.baseUrl = config.baseUrl ?? TM1_DEFAULT_BASE_URL;
    this.cookie = config.cookie;
    this.defaultEventEndDate = config.defaultEventEndDate ?? TM1_DEFAULT_EVENT_END;
    this.defaultEventStartDate = config.defaultEventStartDate ?? TM1_DEFAULT_EVENT_START;
    this.eventbaseApiPrefix = config.eventbaseApiPrefix ?? TM1_DEFAULT_EVENTBASE_API_PREFIX;
    this.tcode = config.tcode;
    this.timeoutMs = config.timeoutMs ?? 20_000;
    this.xsrfToken = config.xsrfToken;
  }

  private async requestWithResponse<T extends Tm1JsonPayload>(
    path: string,
    options: Tm1RequestOptions = {},
  ): Promise<Tm1Response<T>> {
    const method = options.method ?? "GET";
    const apiPrefix = options.apiPrefix ?? this.apiPrefix;
    const requestPath = withQuery(`${apiPrefix}${path}`, options.params);
    const url = new URL(requestPath, this.baseUrl);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const headers = new Headers({
        accept: "application/json,text/plain,*/*",
        cookie: this.cookie,
      });

      if (this.xsrfToken) {
        headers.set("x-xsrf-token", this.xsrfToken);
      }

      if (options.headers) {
        for (const [key, value] of Object.entries(options.headers)) {
          headers.set(key, value);
        }
      }

      let body: string | undefined;
      if (options.body != null) {
        headers.set("content-type", "application/json");
        body = JSON.stringify(options.body);
      }

      const response = await fetch(url, {
        method,
        headers,
        body,
        signal: controller.signal,
      });
      const raw = await response.text();
      let parsed: unknown = {};
      if (raw.trim().length > 0) {
        try {
          parsed = JSON.parse(raw);
        } catch {
          parsed = null;
        }
      }

      if (!response.ok) {
        throw new Tm1ClientError(`TM1 request failed ${response.status} for ${requestPath}`, {
          status: response.status,
          path: requestPath,
          body: raw.slice(0, 500),
        });
      }

      if (parsed == null || (!Array.isArray(parsed) && typeof parsed !== "object")) {
        throw new Tm1ClientError(`TM1 returned non-JSON for ${requestPath}`, {
          status: response.status,
          path: requestPath,
          body: raw.slice(0, 500),
        });
      }

      return {
        data: parsed as T,
        headers: response.headers,
        requestPath,
        status: response.status,
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  async request<T extends Record<string, unknown>>(
    path: string,
    options: Tm1RequestOptions = {},
  ): Promise<T> {
    return (await this.requestWithResponse<T>(path, options)).data;
  }

  async getEvents(options: {
    eventEndDate?: string;
    eventStartDate?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ events?: Tm1EventMeta[] } & Record<string, unknown>> {
    return this.request("/events", {
      method: "POST",
      params: {
        tcode: this.tcode,
        eventStartDate: options.eventStartDate ?? this.defaultEventStartDate,
        eventEndDate: options.eventEndDate ?? this.defaultEventEndDate,
        offset: options.offset ?? 0,
        limit: options.limit ?? 500,
      },
      body: {},
    });
  }

  async getSalesAuditSummary(options: {
    eventEndDate?: string;
    eventId: string;
    eventStartDate?: string;
  }): Promise<Record<string, unknown>> {
    return this.request("/sales/audit/summary/v2", {
      params: {
        eventId: options.eventId,
        tcode: this.tcode,
        eventStartDate: options.eventStartDate ?? this.defaultEventStartDate,
        eventEndDate: options.eventEndDate ?? this.defaultEventEndDate,
      },
    });
  }

  async getSalesChannels(options: {
    eventEndDate?: string;
    eventId: string;
    eventStartDate?: string;
    reportEndDate?: string;
    reportStartDate?: string;
  }): Promise<Record<string, unknown>> {
    return this.request("/sales/channels", {
      params: {
        eventId: options.eventId,
        tcode: this.tcode,
        eventStartDate: options.eventStartDate ?? this.defaultEventStartDate,
        eventEndDate: options.eventEndDate ?? this.defaultEventEndDate,
        reportStartDate: options.reportStartDate ?? this.defaultEventStartDate,
        reportEndDate: options.reportEndDate ?? this.defaultEventEndDate,
      },
    });
  }

  async getEventbaseInventory(eventId: string): Promise<Record<string, unknown>> {
    const response = await this.requestWithResponse<Record<string, unknown>>(
      `/events/${eventId}/inventory`,
      { apiPrefix: this.eventbaseApiPrefix },
    );
    return ensureRecordPayload(response.data, "inventory");
  }

  async getEventbaseLayout(eventId: string): Promise<Record<string, unknown>> {
    const response = await this.requestWithResponse<Record<string, unknown>>(
      `/events/${eventId}/geometry`,
      { apiPrefix: this.eventbaseApiPrefix },
    );
    return ensureRecordPayload(response.data, "layout");
  }

  async getEventbaseEvent(eventId: string): Promise<Record<string, unknown>> {
    const response = await this.requestWithResponse<Record<string, unknown>>(
      `/events/${eventId}`,
      { apiPrefix: this.eventbaseApiPrefix },
    );
    return ensureRecordPayload(response.data, "event");
  }

  async getMoveSelectionContext(eventId: string): Promise<Tm1MoveSelectionContext> {
    const [inventoryResponse, layoutResponse, eventResponse] = await Promise.all([
      this.requestWithResponse<Record<string, unknown>>(`/events/${eventId}/inventory`, {
        apiPrefix: this.eventbaseApiPrefix,
      }),
      this.requestWithResponse<Record<string, unknown>>(`/events/${eventId}/geometry`, {
        apiPrefix: this.eventbaseApiPrefix,
      }),
      this.requestWithResponse<Record<string, unknown>>(`/events/${eventId}`, {
        apiPrefix: this.eventbaseApiPrefix,
      }),
    ]);

    const inventory = ensureRecordPayload(inventoryResponse.data, "inventory");
    const layout = ensureRecordPayload(layoutResponse.data, "layout");
    const event = ensureRecordPayload(eventResponse.data, "event");

    const inventoryVersion = extractInventoryVersion(inventory);
    if (inventoryVersion == null) {
      throw new Error(`TM1 inventory version was missing for event ${eventId}.`);
    }

    const layoutVersion = extractLayoutVersion(layout);
    if (!layoutVersion) {
      throw new Error(`TM1 layout version was missing for event ${eventId}.`);
    }

    return {
      eventId,
      inventory,
      layout,
      event,
      inventoryVersion,
      layoutVersion,
      externalEventVersion: extractExternalEventVersion(event, eventResponse.headers),
    };
  }

  async moveSelection(options: Tm1MoveSelectionOptions): Promise<Tm1MoveSelectionResult> {
    const needsContext =
      options.inventoryVersion == null ||
      options.layoutVersion == null ||
      options.externalEventVersion === undefined;

    const context = needsContext ? await this.getMoveSelectionContext(options.eventId) : null;
    const inventoryVersion = options.inventoryVersion ?? context?.inventoryVersion;
    const layoutVersion = options.layoutVersion ?? context?.layoutVersion;
    const externalEventVersion =
      options.externalEventVersion === undefined
        ? (context?.externalEventVersion ?? null)
        : options.externalEventVersion;

    if (inventoryVersion == null) {
      throw new Error(`TM1 inventory version was not available for event ${options.eventId}.`);
    }
    if (!layoutVersion) {
      throw new Error(`TM1 layout version was not available for event ${options.eventId}.`);
    }

    const { body, path } = normalizeMoveSelectionBody(
      options.eventId,
      options.selection,
      layoutVersion,
      options.target,
    );
    const headers: Record<string, string> = {
      [TM1_IF_MATCH_HEADER]: encodeIfMatch(inventoryVersion),
    };

    if (externalEventVersion != null) {
      headers[TM1_EXTERNAL_EVENT_VERSION_HEADER] = String(externalEventVersion);
    }

    const response = await this.requestWithResponse<Record<string, unknown>>(path, {
      apiPrefix: this.eventbaseApiPrefix,
      method: "POST",
      body,
      headers,
    });
    const raw = ensureRecordPayload(response.data, "moveSelection");

    return {
      eventId: options.eventId,
      target: options.target,
      requestPath: response.requestPath,
      inventoryVersion,
      layoutVersion,
      externalEventVersion,
      nonMovedSeats: Array.isArray(raw.rolledbackAllocationSelections)
        ? raw.rolledbackAllocationSelections
        : [],
      totalMovedSeats: firstNumericValue(raw.totalMovedSeats),
      raw,
    };
  }

  async getEventSnapshot(options: {
    eventEndDate?: string;
    eventId: string;
    eventStartDate?: string;
    includeRaw?: boolean;
    reportEndDate?: string;
    reportStartDate?: string;
  }): Promise<Tm1EventSnapshot> {
    const [eventsPayload, summaryPayload, channelsPayload] = await Promise.all([
      this.getEvents({
        eventStartDate: options.eventStartDate,
        eventEndDate: options.eventEndDate,
      }),
      this.getSalesAuditSummary({
        eventId: options.eventId,
        eventStartDate: options.eventStartDate,
        eventEndDate: options.eventEndDate,
      }),
      this.getSalesChannels({
        eventId: options.eventId,
        eventStartDate: options.eventStartDate,
        eventEndDate: options.eventEndDate,
        reportStartDate: options.reportStartDate,
        reportEndDate: options.reportEndDate,
      }).catch(() => null),
    ]);

    const events = Array.isArray(eventsPayload.events) ? eventsPayload.events : [];
    const event =
      events.find((candidate) => String(candidate.eventId) === String(options.eventId)) ?? null;

    return {
      pulledAt: new Date().toISOString(),
      eventId: options.eventId,
      tcode: this.tcode,
      event,
      summary: normalizeTm1Summary(summaryPayload),
      channels: channelsPayload,
      raw: options.includeRaw
        ? {
            events: eventsPayload,
            summary: summaryPayload,
            channels: channelsPayload,
          }
        : undefined,
    };
  }
}

export function createTm1ClientFromEnv(): Tm1Client {
  const cookie = process.env.TM1_COOKIE;
  const tcode = process.env.TM1_TCODE;

  if (!cookie || cookie.trim().length === 0) {
    throw new Error("TM1_COOKIE is required for browserless TM1 access.");
  }
  if (!tcode || tcode.trim().length === 0) {
    throw new Error("TM1_TCODE is required for browserless TM1 access.");
  }

  return new Tm1Client({
    baseUrl: process.env.TM1_BASE_URL,
    apiPrefix: process.env.TM1_API_PREFIX,
    cookie,
    defaultEventStartDate: process.env.TM1_DEFAULT_EVENT_START,
    defaultEventEndDate: process.env.TM1_DEFAULT_EVENT_END,
    eventbaseApiPrefix: process.env.TM1_EVENTBASE_API_PREFIX,
    timeoutMs: process.env.TM1_TIMEOUT_MS && Number.isFinite(Number(process.env.TM1_TIMEOUT_MS)) ? Number(process.env.TM1_TIMEOUT_MS) : undefined,
    tcode,
    xsrfToken: process.env.TM1_XSRF_TOKEN,
  });
}
