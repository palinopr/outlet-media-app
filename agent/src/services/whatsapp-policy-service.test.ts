import { describe, expect, it } from "vitest";

import {
  isOwnerWhatsAppNumber,
  parseOwnerControlMessage,
  parseConversationPolicy,
  shouldWakeApprovedGroup,
} from "./whatsapp-policy-service.js";

describe("parseConversationPolicy", () => {
  it("defaults new conversations to pending direct mention-only policy", () => {
    const policy = parseConversationPolicy(null, {
      clientSlug: "zamora",
      contactName: "Alexandra",
    });

    expect(policy.accessStatus).toBe("pending");
    expect(policy.approvalRequestedAt).toBeNull();
    expect(policy.chatKind).toBe("direct");
    expect(policy.groupPolicy).toBe("mention_only");
    expect(policy.company).toBe("zamora");
    expect(policy.label).toBe("Alexandra");
  });

  it("preserves explicit approved group policy from metadata", () => {
    const policy = parseConversationPolicy({
      access: {
        requestedAt: "2026-03-07T18:00:00.000Z",
        status: "approved",
      },
      chat: {
        company: "kybba",
        kind: "group",
        label: "Kybba Launch Team",
      },
      group: {
        policy: "live",
      },
    });

    expect(policy.accessStatus).toBe("approved");
    expect(policy.approvalRequestedAt).toBe("2026-03-07T18:00:00.000Z");
    expect(policy.chatKind).toBe("group");
    expect(policy.groupPolicy).toBe("live");
    expect(policy.company).toBe("kybba");
    expect(policy.label).toBe("Kybba Launch Team");
  });
});

describe("shouldWakeApprovedGroup", () => {
  const approvedMentionOnlyGroup = parseConversationPolicy({
    access: { status: "approved" },
    chat: { kind: "group", label: "Zamora Team" },
  });

  it("ignores ordinary chatter in mention-only groups", () => {
    expect(shouldWakeApprovedGroup(approvedMentionOnlyGroup, "seguimos con eso luego")).toBe(false);
  });

  it("wakes when the agent is explicitly mentioned in mention-only groups", () => {
    expect(shouldWakeApprovedGroup(approvedMentionOnlyGroup, "@Meta Agent puedes ayudar con esto?")).toBe(true);
  });

  it("wakes when WhatsApp mention metadata is present even if the text only contains a numeric tag", () => {
    expect(
      shouldWakeApprovedGroup(
        approvedMentionOnlyGroup,
        "@73796631441427 how are the ads for Kybba performing",
        {
          mentionedJids: ["73796631441427@lid"],
        },
      ),
    ).toBe(true);
  });

  it("always wakes for direct chats", () => {
    const directPolicy = parseConversationPolicy({
      access: { status: "approved" },
      chat: { kind: "direct", label: "Isabel" },
    });

    expect(shouldWakeApprovedGroup(directPolicy, "hola")).toBe(true);
  });
});

describe("owner WhatsApp controls", () => {
  it("recognizes configured owner WhatsApp numbers", () => {
    process.env.WHATSAPP_OWNER_NUMBERS = "13054870475,+1 (787) 555-1212";

    expect(isOwnerWhatsAppNumber("13054870475")).toBe(true);
    expect(isOwnerWhatsAppNumber("+1 787-555-1212")).toBe(true);
    expect(isOwnerWhatsAppNumber("13050000000")).toBe(false);
  });

  it("parses strict owner-control prefixes only", () => {
    expect(parseOwnerControlMessage("!boss whitelist tomas")).toBe("whitelist tomas");
    expect(parseOwnerControlMessage("/whatsapp allow b74afd0b")).toBe("allow b74afd0b");
    expect(parseOwnerControlMessage("boss whitelist tomas")).toBeNull();
    expect(parseOwnerControlMessage("hola normal")).toBeNull();
  });
});
