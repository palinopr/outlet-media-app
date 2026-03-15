import { describe, expect, it, vi } from "vitest";

// Mock email-types to avoid module-level fileURLToPath calls that fail under Vitest
vi.mock("./email-types.js", async () => {
  return {
    SERVICE_ACCOUNT_PATH: "/mock/service-account.json",
    MANAGED_LABELS_PATH: "/mock/gmail-managed-labels.json",
    OWNER_CORRECTIONS_PATH: "/mock/email-owner-corrections.json",
    GMAIL_IMPERSONATE_USER: "jaime@outletmedia.net",
    MY_EMAIL: "jaime@outletmedia.net",
    MAX_BODY_CHARS: 8_000,
    MAX_STYLE_EXAMPLES: 3,
    MAX_THREAD_MESSAGES: 5,
    MAX_ACTIVITY_ENTRIES: 5,
    MANUAL_SWEEP_LIMIT: 5,
    PUSH_RECOVERY_LIMIT: 20,
    WATCHED_MAILBOX_LABELS: new Set(["INBOX", "SENT"]),
    IMPORTANCE_RANK: { low: 0, normal: 1, high: 2, urgent: 3 } as const,
    TEAM_DOMAINS: new Set(["outletmedia.net"]),
    CLIENT_DOMAINS: new Set([
      "zamorausa.com", "touringco.com", "eoentertainment.com",
      "atgentertainment.com", "thepg.com", "seminolehardrock.com",
      "shrss.com", "aegpresents.com",
    ]),
    VENUE_DOMAINS: new Set([
      "goldenstate.com", "acrisurearena.com", "ocvibe.com",
      "maverikcenter.com", "pechangaarenasd.com", "cvfirebirds.com",
      "cajinapro.com", "ticketera.com",
    ]),
    FINANCE_DOMAINS: new Set(["brodriguezcpa.com"]),
    TECH_ALERT_DOMAINS: new Set([
      "github.com", "vercel.com", "railway.app", "render.com",
      "supabase.co", "sentry.io", "discord.com", "google.com",
    ]),
    VIP_SENDERS: new Set([
      "mirna@zamorausa.com", "ivan.gonzalez@zamorausa.com",
      "lida@zamorausa.com", "jesus.guzman@zamorausa.com",
      "omar.rodriguez@zamorausa.com", "alexandra@outletmedia.net",
      "isabel@outletmedia.net", "natalie@outletmedia.net",
    ]),
    getManagedLabels: () => [],
  };
});

import type { EmailDraftPlan, EmailMessageDetail, EmailTriageDecision } from "./email-types.js";
import {
  getDomain,
  uniqueStrings,
  clip,
  stripHtml,
  decodeBody,
  parseAddress,
  parseAddressList,
  extractJsonObject,
  normalizeImportance,
  stripLegacyCodeFormatting,
  classifyTopic,
  inferClientSlug,
  inferTourLabel,
  classifyInboundMessage,
  classifyOutboundMessage,
  coerceDraftPlan,
  formatEmailLog,
  formatEmailParty,
  formatThreadContext,
  formatBusinessContext,
  formatStyleExamples,
  formatOwnerNotification,
  buildOwnerAlertCard,
  looksLikeBulkPromo,
  shouldPushOwnerAlert,
  detectLanguage,
} from "./email-classify.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeMessage(overrides: Partial<EmailMessageDetail> = {}): EmailMessageDetail {
  return {
    id: "msg_1",
    threadId: "thread_1",
    subject: "Test subject",
    snippet: "snippet",
    bodyText: "Hello, this is a test email.",
    date: "2026-03-10T10:00:00Z",
    receivedAtIso: "2026-03-10T10:00:00.000Z",
    from: { name: "Alice", email: "alice@example.com" },
    to: [{ name: "Jaime", email: "jaime@outletmedia.net" }],
    cc: [],
    labelIds: ["INBOX"],
    attachmentNames: [],
    headers: {},
    direction: "inbound",
    ...overrides,
  };
}

function makeTriage(overrides: Partial<EmailTriageDecision> = {}): EmailTriageDecision {
  return {
    classification: "routine",
    importance: "normal",
    clientSlug: null,
    contactEmail: "alice@example.com",
    suggestedLabels: [],
    shouldNotifyOwner: false,
    shouldArchive: false,
    needsReply: false,
    topic: null,
    ...overrides,
  };
}

function makePlan(overrides: Partial<EmailDraftPlan> = {}): EmailDraftPlan {
  return {
    why_it_matters: "Test reason.",
    suggested_reply_subject: null,
    suggested_reply_body: null,
    rationale: null,
    classification: "routine",
    importance: "normal",
    suggested_labels: [],
    should_archive: false,
    needs_reply: false,
    language: null,
    confidence: null,
    topic: null,
    meeting_details: null,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// String utilities
// ---------------------------------------------------------------------------

describe("getDomain", () => {
  it("extracts domain from standard email", () => {
    expect(getDomain("alice@example.com")).toBe("example.com");
  });

  it("returns empty string for null/undefined", () => {
    expect(getDomain(null)).toBe("");
    expect(getDomain(undefined)).toBe("");
  });

  it("returns empty string for bare string without @", () => {
    expect(getDomain("noemail")).toBe("");
  });

  it("lowercases the domain", () => {
    expect(getDomain("Alice@EXAMPLE.COM")).toBe("example.com");
  });
});

describe("uniqueStrings", () => {
  it("deduplicates and trims", () => {
    expect(uniqueStrings(["a", " a ", "b", null, undefined, ""])).toEqual(["a", "b"]);
  });

  it("returns empty array for all nullish", () => {
    expect(uniqueStrings([null, undefined, ""])).toEqual([]);
  });
});

describe("clip", () => {
  it("returns short text unchanged", () => {
    expect(clip("hello", 10)).toBe("hello");
  });

  it("truncates with ellipsis at limit", () => {
    const result = clip("abcdefghij", 5);
    expect(result).toHaveLength(5);
    expect(result.endsWith("\u2026")).toBe(true);
  });

  it("returns exact-length text unchanged", () => {
    expect(clip("abcde", 5)).toBe("abcde");
  });
});

describe("stripHtml", () => {
  it("removes tags and decodes entities", () => {
    expect(stripHtml("<p>Hello &amp; world</p>")).toBe("Hello & world");
  });

  it("converts br/p/div to newlines", () => {
    const result = stripHtml("<p>First</p><br/><div>Second</div>");
    expect(result).toContain("First");
    expect(result).toContain("Second");
  });

  it("strips style and script blocks", () => {
    expect(stripHtml("<style>.x{color:red}</style>visible")).toBe("visible");
    expect(stripHtml("<script>alert(1)</script>visible")).toBe("visible");
  });
});

describe("decodeBody", () => {
  it("decodes base64url content", () => {
    const encoded = Buffer.from("Hello world").toString("base64url");
    expect(decodeBody({ body: { data: encoded } })).toBe("Hello world");
  });

  it("returns empty for missing body", () => {
    expect(decodeBody({})).toBe("");
    expect(decodeBody({ body: { data: null } })).toBe("");
  });
});

// ---------------------------------------------------------------------------
// Email parsing
// ---------------------------------------------------------------------------

describe("parseAddress", () => {
  it("parses angle bracket format", () => {
    expect(parseAddress("Alice <alice@example.com>")).toEqual({
      name: "Alice",
      email: "alice@example.com",
    });
  });

  it("parses bare email", () => {
    expect(parseAddress("alice@example.com")).toEqual({
      name: null,
      email: "alice@example.com",
    });
  });

  it("parses quoted name", () => {
    expect(parseAddress('"Alice B" <alice@example.com>')).toEqual({
      name: "Alice B",
      email: "alice@example.com",
    });
  });

  it("returns null for empty string", () => {
    expect(parseAddress("")).toBeNull();
  });
});

describe("parseAddressList", () => {
  it("splits comma-separated addresses", () => {
    const result = parseAddressList("alice@a.com, bob@b.com");
    expect(result).toHaveLength(2);
    expect(result[0].email).toBe("alice@a.com");
    expect(result[1].email).toBe("bob@b.com");
  });

  it("handles single address", () => {
    expect(parseAddressList("alice@a.com")).toHaveLength(1);
  });
});

describe("extractJsonObject", () => {
  it("extracts JSON from surrounding text", () => {
    const text = 'Here is the plan: {"key": "value"} done.';
    expect(extractJsonObject(text)).toBe('{"key": "value"}');
  });

  it("handles nested braces", () => {
    const text = '{"outer": {"inner": 1}}';
    expect(extractJsonObject(text)).toBe('{"outer": {"inner": 1}}');
  });

  it("returns null when no JSON found", () => {
    expect(extractJsonObject("no json here")).toBeNull();
  });

  it("handles braces inside strings", () => {
    const text = '{"msg": "hello {world}"}';
    expect(extractJsonObject(text)).toBe('{"msg": "hello {world}"}');
  });
});

describe("normalizeImportance", () => {
  it("keeps value when higher than fallback", () => {
    expect(normalizeImportance("urgent", "normal")).toBe("urgent");
  });

  it("returns fallback when value is lower", () => {
    expect(normalizeImportance("low", "high")).toBe("high");
  });

  it("returns fallback for invalid value", () => {
    expect(normalizeImportance("invalid", "normal")).toBe("normal");
  });
});

describe("stripLegacyCodeFormatting", () => {
  it("removes code fences", () => {
    expect(stripLegacyCodeFormatting("```json\n{}\n```")).toBe("{}");
  });

  it("removes inline backticks", () => {
    expect(stripLegacyCodeFormatting("use `this` value")).toBe("use this value");
  });
});

describe("detectLanguage", () => {
  it("detects Spanish hints", () => {
    expect(detectLanguage("Hola, gracias por tu ayuda")).toBe("es");
  });

  it("defaults to English", () => {
    expect(detectLanguage("Thanks for your help")).toBe("en");
  });
});

// ---------------------------------------------------------------------------
// Classification
// ---------------------------------------------------------------------------

describe("classifyTopic", () => {
  it("detects finance topic", () => {
    expect(classifyTopic(makeMessage({ subject: "Invoice #1234" }))).toBe("finance");
  });

  it("detects meeting topic", () => {
    expect(classifyTopic(makeMessage({ subject: "Calendar invite" }))).toBe("meeting");
  });

  it("detects life_insurance topic", () => {
    expect(classifyTopic(makeMessage({ bodyText: "Your term life policy update" }))).toBe("life_insurance");
  });

  it("detects campaign topic", () => {
    expect(classifyTopic(makeMessage({ subject: "Campaign ROAS update" }))).toBe("campaign");
  });

  it("detects pixel topic", () => {
    expect(classifyTopic(makeMessage({ subject: "Meta Pixel setup" }))).toBe("pixel");
  });

  it("detects travel topic", () => {
    expect(classifyTopic(makeMessage({ subject: "Your flight confirmation" }))).toBe("travel");
  });

  it("returns null for unrecognized content", () => {
    expect(classifyTopic(makeMessage({ subject: "Hello", bodyText: "How are you?" }))).toBeNull();
  });
});

describe("inferClientSlug", () => {
  it("infers zamora from arjona mention", () => {
    expect(inferClientSlug(makeMessage({ subject: "Arjona tour update" }))).toBe("zamora");
  });

  it("infers zamora from zamorausa.com sender", () => {
    expect(inferClientSlug(makeMessage({ from: { name: "Mirna", email: "mirna@zamorausa.com" } }))).toBe("zamora");
  });

  it("infers zamora from camila mention", () => {
    expect(inferClientSlug(makeMessage({ subject: "Camila Anaheim tickets" }))).toBe("zamora");
  });

  it("infers don_omar_bcn", () => {
    expect(inferClientSlug(makeMessage({ subject: "Don Omar Barcelona" }))).toBe("don_omar_bcn");
  });

  it("infers kybba", () => {
    expect(inferClientSlug(makeMessage({ subject: "KYBBA Miami delivery" }))).toBe("kybba");
  });

  it("infers happy_paws", () => {
    expect(inferClientSlug(makeMessage({ bodyText: "Happy Paws campaign" }))).toBe("happy_paws");
  });

  it("returns null for unknown sender", () => {
    expect(inferClientSlug(makeMessage())).toBeNull();
  });
});

describe("inferTourLabel", () => {
  it("infers Don Omar tour label", () => {
    expect(inferTourLabel(makeMessage(), "don_omar_bcn")).toBe("Tours/Don Omar");
  });

  it("infers Camila from body text", () => {
    expect(inferTourLabel(makeMessage({ bodyText: "Camila tour dates" }), null)).toBe("Tours/Camila");
  });

  it("infers Arjona from body text", () => {
    expect(inferTourLabel(makeMessage({ bodyText: "arjona merch" }), null)).toBe("Tours/Arjona");
  });

  it("falls back to Tours/Other for zamora slug", () => {
    expect(inferTourLabel(makeMessage(), "zamora")).toBe("Tours/Other");
  });

  it("returns null for non-client", () => {
    expect(inferTourLabel(makeMessage(), null)).toBeNull();
  });
});

describe("classifyInboundMessage", () => {
  it("classifies finance email from ar@meta.com", () => {
    const result = classifyInboundMessage(makeMessage({
      from: { name: "Meta", email: "ar@meta.com" },
    }));
    expect(result.classification).toBe("finance");
    expect(result.importance).toBe("high");
    expect(result.shouldNotifyOwner).toBe(true);
    expect(result.suggestedLabels).toContain("Outlet Media/Invoices");
  });

  it("classifies team email from outletmedia.net", () => {
    const result = classifyInboundMessage(makeMessage({
      from: { name: "Alex", email: "alexandra@outletmedia.net" },
    }));
    expect(result.classification).toBe("team");
    expect(result.importance).toBe("high");
    expect(result.suggestedLabels).toContain("Outlet Media/Team");
  });

  it("classifies VIP sender", () => {
    const result = classifyInboundMessage(makeMessage({
      from: { name: "Mirna", email: "mirna@zamorausa.com" },
    }));
    expect(result.classification).toBe("vip");
    expect(result.importance).toBe("high");
    expect(result.suggestedLabels).toContain("Clients");
  });

  it("classifies client domain", () => {
    const result = classifyInboundMessage(makeMessage({
      from: { name: "Someone", email: "someone@touringco.com" },
    }));
    expect(result.classification).toBe("client");
    expect(result.shouldNotifyOwner).toBe(true);
  });

  it("classifies noreply as notification and archives", () => {
    const result = classifyInboundMessage(makeMessage({
      from: { name: null, email: "noreply@randomsite.com" },
    }));
    expect(result.classification).toBe("notification");
    expect(result.importance).toBe("low");
    expect(result.shouldArchive).toBe(true);
  });

  it("upgrades tech alert to high when critical terms present", () => {
    const result = classifyInboundMessage(makeMessage({
      from: { name: "GitHub", email: "noreply@github.com" },
      subject: "Deploy failed",
    }));
    expect(result.classification).toBe("notification");
    expect(result.importance).toBe("high");
    expect(result.shouldNotifyOwner).toBe(true);
    expect(result.suggestedLabels).toContain("Importantes");
  });

  it("classifies junk with unsubscribe + view in browser", () => {
    const result = classifyInboundMessage(makeMessage({
      from: { name: "Promo", email: "promo@store.com" },
      bodyText: "Buy now! unsubscribe view in browser",
    }));
    expect(result.classification).toBe("junk");
    expect(result.shouldArchive).toBe(true);
  });

  it("marks urgent when subject contains urgent", () => {
    const result = classifyInboundMessage(makeMessage({
      from: { name: "Someone", email: "someone@vendor.com" },
      subject: "URGENT: please respond",
    }));
    expect(result.importance).toBe("urgent");
    expect(result.shouldNotifyOwner).toBe(true);
  });

  it("sets needsReply for pixel-related emails", () => {
    const result = classifyInboundMessage(makeMessage({
      from: { name: "Venue", email: "info@goldenstate.com" },
      subject: "Meta pixel ID needed",
    }));
    expect(result.needsReply).toBe(true);
  });

  it("adds client and tour labels when client slug detected", () => {
    const result = classifyInboundMessage(makeMessage({
      from: { name: "Ivan", email: "ivan.gonzalez@zamorausa.com" },
      subject: "Arjona Anaheim tickets sold",
    }));
    expect(result.suggestedLabels).toContain("Clients");
    expect(result.suggestedLabels).toContain("Tours/Arjona");
    expect(result.clientSlug).toBe("zamora");
  });

  it("adds life insurance labels", () => {
    const result = classifyInboundMessage(makeMessage({
      from: { name: "Agent", email: "agent@broker.com" },
      bodyText: "Your term life policy has been updated. Please review beneficiary.",
    }));
    expect(result.classification).toBe("client");
    expect(result.suggestedLabels).toContain("Life Insurance");
  });

  it("adds Viajes label for travel topics", () => {
    const result = classifyInboundMessage(makeMessage({
      from: { name: "Airline", email: "noreply@airline.com" },
      subject: "Your flight itinerary",
    }));
    expect(result.suggestedLabels).toContain("Viajes");
  });
});

describe("classifyOutboundMessage", () => {
  it("returns routine classification with inferred client slug", () => {
    const result = classifyOutboundMessage(makeMessage({
      direction: "outbound",
      from: { name: "Jaime", email: "jaime@outletmedia.net" },
      to: [{ name: "Mirna", email: "mirna@zamorausa.com" }],
      subject: "Arjona budget",
    }));
    expect(result.classification).toBe("routine");
    expect(result.clientSlug).toBe("zamora");
    expect(result.shouldNotifyOwner).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Draft plan coercion
// ---------------------------------------------------------------------------

describe("coerceDraftPlan", () => {
  const fallback = makeTriage();

  it("parses valid JSON plan", () => {
    const json = JSON.stringify({
      why_it_matters: "Client needs budget update",
      classification: "client",
      importance: "high",
      suggested_labels: ["Clients"],
      needs_reply: true,
      should_archive: false,
    });
    const result = coerceDraftPlan(json, fallback);
    expect(result.why_it_matters).toBe("Client needs budget update");
    expect(result.classification).toBe("client");
    expect(result.importance).toBe("high");
    expect(result.needs_reply).toBe(true);
  });

  it("extracts JSON from surrounding text", () => {
    const raw = 'Here is my analysis: {"why_it_matters": "Important email"} that is all.';
    const result = coerceDraftPlan(raw, fallback);
    expect(result.why_it_matters).toBe("Important email");
  });

  it("falls back when no JSON found", () => {
    const result = coerceDraftPlan("Just a plain text response with no JSON", fallback);
    expect(result.classification).toBe(fallback.classification);
    expect(result.importance).toBe(fallback.importance);
    expect(result.why_it_matters).toContain("Just a plain text response");
  });

  it("falls back on malformed JSON", () => {
    const result = coerceDraftPlan('{"broken": json here}', fallback);
    expect(result.classification).toBe(fallback.classification);
  });

  it("strips legacy code formatting from why_it_matters", () => {
    const json = JSON.stringify({ why_it_matters: "```json\nimportant\n```" });
    const result = coerceDraftPlan(json, fallback);
    expect(result.why_it_matters).not.toContain("```");
  });

  it("does not downgrade importance below fallback", () => {
    const highFallback = makeTriage({ importance: "high" });
    const json = JSON.stringify({ importance: "low" });
    const result = coerceDraftPlan(json, highFallback);
    expect(result.importance).toBe("high");
  });

  it("parses meeting_details when valid", () => {
    const json = JSON.stringify({
      why_it_matters: "Meeting invite",
      meeting_details: {
        title: "Standup",
        start_iso: "2026-03-10T15:00:00-06:00",
        duration_minutes: 30,
        location: "Zoom",
        attendee_emails: ["bob@test.com"],
        meeting_link: "https://zoom.us/j/123",
      },
    });
    const result = coerceDraftPlan(json, fallback);
    expect(result.meeting_details).not.toBeNull();
    expect(result.meeting_details!.title).toBe("Standup");
    expect(result.meeting_details!.attendee_emails).toEqual(["bob@test.com"]);
  });

  it("sets meeting_details to null when missing required fields", () => {
    const json = JSON.stringify({
      why_it_matters: "Email",
      meeting_details: { location: "Office" },
    });
    const result = coerceDraftPlan(json, fallback);
    expect(result.meeting_details).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Owner notification logic
// ---------------------------------------------------------------------------

describe("looksLikeBulkPromo", () => {
  it("detects list-unsubscribe header", () => {
    const message = makeMessage({ headers: { "list-unsubscribe": "<mailto:unsub@x.com>" } });
    expect(looksLikeBulkPromo(message, makePlan())).toBe(true);
  });

  it("detects promo terms in body", () => {
    const message = makeMessage({ bodyText: "Check our weekly digest" });
    expect(looksLikeBulkPromo(message, makePlan())).toBe(true);
  });

  it("returns false for plain business email", () => {
    const message = makeMessage({ bodyText: "Please review the attached contract" });
    expect(looksLikeBulkPromo(message, makePlan())).toBe(false);
  });
});

describe("shouldPushOwnerAlert", () => {
  it("returns false for junk", () => {
    expect(shouldPushOwnerAlert(
      makeMessage(),
      makePlan({ classification: "junk" }),
      makeTriage(),
    )).toBe(false);
  });

  it("returns true when needs_reply", () => {
    expect(shouldPushOwnerAlert(
      makeMessage(),
      makePlan({ needs_reply: true }),
      makeTriage(),
    )).toBe(true);
  });

  it("returns true for life_insurance topic", () => {
    expect(shouldPushOwnerAlert(
      makeMessage(),
      makePlan(),
      makeTriage({ topic: "life_insurance" }),
    )).toBe(true);
  });

  it("returns true when triage says notify", () => {
    expect(shouldPushOwnerAlert(
      makeMessage(),
      makePlan(),
      makeTriage({ shouldNotifyOwner: true }),
    )).toBe(true);
  });

  it("returns true for VIP classification", () => {
    expect(shouldPushOwnerAlert(
      makeMessage(),
      makePlan({ classification: "vip" }),
      makeTriage(),
    )).toBe(true);
  });

  it("returns true for finance classification", () => {
    expect(shouldPushOwnerAlert(
      makeMessage(),
      makePlan({ classification: "finance" }),
      makeTriage(),
    )).toBe(true);
  });

  it("suppresses low-importance bulk promo notification", () => {
    const message = makeMessage({
      bodyText: "Check our weekly digest and unsubscribe if needed",
      headers: { "list-unsubscribe": "<mailto:unsub@x.com>" },
    });
    expect(shouldPushOwnerAlert(
      message,
      makePlan({ classification: "notification", importance: "low" }),
      makeTriage(),
    )).toBe(false);
  });

  it("returns true for action-required terms even in notifications", () => {
    const message = makeMessage({ subject: "Action required: verify account" });
    expect(shouldPushOwnerAlert(
      message,
      makePlan({ classification: "notification", importance: "low" }),
      makeTriage(),
    )).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

describe("formatEmailParty", () => {
  it("combines name and email", () => {
    expect(formatEmailParty("Alice", "alice@a.com")).toBe("Alice <alice@a.com>");
  });

  it("returns email only when no name", () => {
    expect(formatEmailParty(null, "alice@a.com")).toBe("alice@a.com");
  });

  it("returns unknown for null/null", () => {
    expect(formatEmailParty(null, null)).toBe("unknown sender");
  });
});

describe("formatEmailLog", () => {
  it("formats a complete log record", () => {
    const log = formatEmailLog("inbound-handled", {
      sender: "Alice <alice@a.com>",
      subject: "Test",
      classification: "client",
      importance: "high",
      appliedLabels: ["Clients"],
      archived: false,
      draftedReply: true,
    });
    expect(log).toContain("[Email Log] inbound-handled");
    expect(log).toContain("From: Alice <alice@a.com>");
    expect(log).toContain("type=client");
    expect(log).toContain("importance=high");
    expect(log).toContain("labels=Clients");
    expect(log).toContain("drafted_reply=yes");
  });
});

describe("formatThreadContext", () => {
  it("formats prior messages excluding current", () => {
    const messages = [
      makeMessage({ id: "msg_1", from: { name: null, email: "bob@b.com" }, direction: "inbound" }),
      makeMessage({ id: "msg_2", direction: "outbound" }),
    ];
    const result = formatThreadContext(messages, "msg_2");
    expect(result).toContain("bob@b.com");
    expect(result).not.toContain("Jaime");
  });

  it("labels outbound messages as Jaime", () => {
    const messages = [
      makeMessage({ id: "msg_1", direction: "outbound" }),
      makeMessage({ id: "msg_current" }),
    ];
    const result = formatThreadContext(messages, "msg_current");
    expect(result).toContain("Jaime");
  });
});

describe("formatBusinessContext", () => {
  it("shows no client match", () => {
    expect(formatBusinessContext({ clientSlug: null, campaigns: [], events: [] })).toBe("No client match.");
  });

  it("shows client slug with campaigns and events", () => {
    const result = formatBusinessContext({
      clientSlug: "zamora",
      campaigns: ["Arjona SLC (ACTIVE)"],
      events: ["Arjona SLC (2026-04-15)"],
    });
    expect(result).toContain("Client slug: zamora");
    expect(result).toContain("Arjona SLC (ACTIVE)");
    expect(result).toContain("Arjona SLC (2026-04-15)");
  });
});

describe("formatStyleExamples", () => {
  it("returns placeholder when empty", () => {
    expect(formatStyleExamples([])).toBe("No stored sent examples yet.");
  });

  it("formats examples with index and date", () => {
    const result = formatStyleExamples([{
      subject: "Re: Budget",
      body_text: "Sounds good, let's do $500.",
      created_at: "2026-03-09T10:00:00Z",
      contact_email: "mirna@zamorausa.com",
    }]);
    expect(result).toContain("Example 1");
    expect(result).toContain("2026-03-09");
    expect(result).toContain("mirna@zamorausa.com");
  });
});

describe("formatOwnerNotification", () => {
  it("includes action heading when owner attention needed", () => {
    const result = formatOwnerNotification(
      makeMessage(),
      makePlan({ why_it_matters: "Client asking about budget" }),
      true,
      { clientSlug: "zamora", campaigns: ["Arjona SLC"], events: [] },
      ["Clients"],
    );
    expect(result).toContain("[Email - Action Needed]");
    expect(result).toContain("Client asking about budget");
    expect(result).toContain("Client: zamora");
  });

  it("includes FYI heading when no action needed", () => {
    const result = formatOwnerNotification(
      makeMessage(),
      makePlan(),
      false,
      { clientSlug: null, campaigns: [], events: [] },
      [],
    );
    expect(result).toContain("[Email - Handled FYI]");
  });

  it("includes suggested reply when present", () => {
    const result = formatOwnerNotification(
      makeMessage(),
      makePlan({
        suggested_reply_subject: "Re: Test",
        suggested_reply_body: "Thanks for reaching out.",
      }),
      true,
      { clientSlug: null, campaigns: [], events: [] },
      [],
    );
    expect(result).toContain("Suggested reply:");
    expect(result).toContain("Thanks for reaching out.");
  });
});

describe("buildOwnerAlertCard", () => {
  it("builds a complete alert card", () => {
    const card = buildOwnerAlertCard(
      makeMessage({ from: { name: "Alice", email: "alice@a.com" } }),
      makePlan({ classification: "client", importance: "high", why_it_matters: "Budget question" }),
      true,
      { clientSlug: "zamora", campaigns: [], events: [] },
      ["Clients"],
    );
    expect(card.sender).toBe("Alice <alice@a.com>");
    expect(card.classification).toBe("client");
    expect(card.importance).toBe("high");
    expect(card.needsOwnerAttention).toBe(true);
    expect(card.clientSlug).toBe("zamora");
    expect(card.appliedLabels).toEqual(["Clients"]);
    expect(card.whyItMatters).toContain("Budget question");
  });
});
