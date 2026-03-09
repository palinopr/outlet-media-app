import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildEvolutionMessagePreview,
  planConversationTaskEnqueue,
  buildWhatsAppMessagePreview,
  extractWhatsAppWebhookBatches,
  parseTwilioWebhookPayload,
  shouldAutoAcknowledgeWhatsAppInbound,
  verifyEvolutionWebhookRequest,
  verifyTwilioWebhookSignature,
  verifyWhatsAppWebhookSignature,
} from "@/features/whatsapp/server";

describe("WhatsApp webhook helpers", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("extracts normalized batches from Meta webhook payloads", () => {
    const batches = extractWhatsAppWebhookBatches({
      entry: [
        {
          changes: [
            {
              field: "messages",
              value: {
                contacts: [
                  {
                    profile: { name: "Isa" },
                    wa_id: "17865551234",
                  },
                ],
                messages: [
                  {
                    from: "17865551234",
                    id: "wamid.123",
                    text: { body: "Hola" },
                    timestamp: "1758254144",
                    type: "text",
                  },
                ],
                metadata: {
                  display_phone_number: "15551234567",
                  phone_number_id: "123456789",
                },
                statuses: [
                  {
                    id: "wamid.outbound",
                    recipient_id: "17865551234",
                    status: "delivered",
                    timestamp: "1758254200",
                  },
                ],
              },
            },
          ],
          id: "waba_1",
        },
      ],
      object: "whatsapp_business_account",
    });

    expect(batches).toHaveLength(1);
    expect(batches[0]).toMatchObject({
      displayPhoneNumber: "15551234567",
      phoneNumberId: "123456789",
      wabaId: "waba_1",
    });
    expect(batches[0].contacts.get("17865551234")?.profile?.name).toBe("Isa");
    expect(batches[0].messages[0]?.id).toBe("wamid.123");
    expect(batches[0].statuses[0]?.status).toBe("delivered");
  });

  it("builds readable previews for non-text WhatsApp messages", () => {
    expect(
      buildWhatsAppMessagePreview({
        document: {
          filename: "brief.pdf",
        },
        type: "document",
      }),
    ).toBe("brief.pdf");

    expect(
      buildWhatsAppMessagePreview({
        interactive: {
          button_reply: {
            title: "Yes, let's do it",
          },
        },
        type: "interactive",
      }),
    ).toBe("[interactive] Yes, let's do it");
  });

  it("builds readable previews for Evolution text messages", () => {
    expect(
      buildEvolutionMessagePreview({
        data: {
          message: {
            extendedTextMessage: {
              text: "Hola desde Evolution",
            },
          },
          messageType: "extendedTextMessage",
        },
        event: "messages.upsert",
        instance: "outlet-phone",
      }),
    ).toBe("Hola desde Evolution");
  });

  it("validates webhook signatures when an app secret is configured", () => {
    vi.stubEnv("WHATSAPP_APP_SECRET", "top-secret");
    const body = JSON.stringify({ object: "whatsapp_business_account" });
    const signature = `sha256=${createHmac("sha256", "top-secret").update(body).digest("hex")}`;

    expect(verifyWhatsAppWebhookSignature(body, signature)).toBe(true);
    expect(verifyWhatsAppWebhookSignature(body, "sha256=bad")).toBe(false);
  });

  it("validates Evolution webhooks using the configured bearer secret", () => {
    vi.stubEnv("EVOLUTION_WEBHOOK_SECRET", "evolution-secret");

    expect(
      verifyEvolutionWebhookRequest(
        new Headers({
          authorization: "Bearer evolution-secret",
        }),
        {
          event: "messages.upsert",
          instance: "outlet-phone",
        },
      ),
    ).toBe(true);

    expect(
      verifyEvolutionWebhookRequest(
        new Headers({
          authorization: "Bearer wrong",
        }),
        {
          event: "messages.upsert",
          instance: "outlet-phone",
        },
      ),
    ).toBe(false);
  });

  it("parses Twilio WhatsApp webhook payloads into a normalized shape", () => {
    const payload = parseTwilioWebhookPayload(
      new URLSearchParams({
        Body: "Hola equipo",
        From: "whatsapp:+13054870475",
        MessageSid: "SM123",
        MessageStatus: "received",
        NumMedia: "0",
        ProfileName: "Jaime",
        To: "whatsapp:+13157435653",
        WaId: "13054870475",
      }),
    );

    expect(payload).toMatchObject({
      body: "Hola equipo",
      from: "whatsapp:+13054870475",
      mediaCount: 0,
      messageSid: "SM123",
      messageStatus: "received",
      profileName: "Jaime",
      to: "whatsapp:+13157435653",
      waId: "13054870475",
    });
  });

  it("validates Twilio signatures using the request URL and form params", () => {
    vi.stubEnv("TWILIO_AUTH_TOKEN", "twilio-secret");

    const requestUrl = "https://www.outletmedia.net/api/whatsapp/twilio";
    const params = new URLSearchParams({
      Body: "Hi",
      From: "whatsapp:+13054870475",
      MessageSid: "SM123",
      To: "whatsapp:+13157435653",
      WaId: "13054870475",
    });

    const expectedPayload = `${requestUrl}BodyHiFromwhatsapp:+13054870475MessageSidSM123Towhatsapp:+13157435653WaId13054870475`;
    const signature = createHmac("sha1", "twilio-secret").update(expectedPayload).digest("base64");

    expect(verifyTwilioWebhookSignature(requestUrl, params, signature)).toBe(true);
    expect(verifyTwilioWebhookSignature(requestUrl, params, "bad-signature")).toBe(false);
  });

  it("auto-acknowledges approved live direct chats", () => {
    expect(
      shouldAutoAcknowledgeWhatsAppInbound({
        accessStatus: "approved",
        chatKind: "direct",
        lastOutboundMessageAt: null,
        mode: "live",
        textBody: "How are campaigns doing?",
        waId: "13054870475",
      }),
    ).toBe(true);
  });

  it("auto-acknowledges approved live group chats only when the agent was explicitly mentioned", () => {
    expect(
      shouldAutoAcknowledgeWhatsAppInbound({
        accessStatus: "approved",
        chatKind: "group",
        lastOutboundMessageAt: null,
        messageMetadata: {
          mentionedJids: ["73796631441427@lid"],
        },
        mode: "live",
        textBody: "@73796631441427 how are the ads performing?",
        waId: "120363422574816715",
      }),
    ).toBe(true);

    expect(
      shouldAutoAcknowledgeWhatsAppInbound({
        accessStatus: "approved",
        chatKind: "group",
        lastOutboundMessageAt: null,
        messageMetadata: {},
        mode: "live",
        textBody: "How are the ads performing?",
        waId: "120363422574816715",
      }),
    ).toBe(false);
  });

  it("does not auto-acknowledge owner control messages", () => {
    vi.stubEnv("WHATSAPP_OWNER_NUMBERS", "13054870475");

    expect(
      shouldAutoAcknowledgeWhatsAppInbound({
        accessStatus: "approved",
        chatKind: "direct",
        lastOutboundMessageAt: null,
        mode: "live",
        textBody: "!boss whitelist tomas",
        waId: "13054870475",
      }),
    ).toBe(false);
  });

  it("does not auto-acknowledge when a recent outbound message already exists", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-07T18:30:00.000Z"));

    expect(
      shouldAutoAcknowledgeWhatsAppInbound({
        accessStatus: "approved",
        chatKind: "direct",
        lastOutboundMessageAt: "2026-03-07T18:29:40.000Z",
        mode: "live",
        textBody: "Hola",
        waId: "13054870475",
      }),
    ).toBe(false);

    vi.useRealTimers();
  });

  it("coalesces repeat conversation tasks onto the latest pending job", () => {
    const plan = planConversationTaskEnqueue("conv_1", "wamid.latest", "kybba", [
      {
        created_at: "2026-03-07T21:00:00.000Z",
        id: "whatsapp_old",
        params: {
          conversationId: "conv_1",
          discordChannelName: "dashboard",
          messageId: "wamid.old",
        },
        status: "pending",
      },
      {
        created_at: "2026-03-07T21:01:00.000Z",
        id: "whatsapp_extra",
        params: {
          conversationId: "conv_1",
          discordChannelName: "dashboard",
          messageId: "wamid.extra",
        },
        status: "pending",
      },
    ]);

    expect(plan).toMatchObject({
      kind: "update",
      supersededTaskIds: ["whatsapp_extra"],
      taskId: "whatsapp_old",
    });
    expect(plan.params).toMatchObject({
      conversationId: "conv_1",
      discordChannelName: "kybba",
      messageId: "wamid.latest",
    });
  });

  it("does not enqueue a duplicate task when the same message is already running", () => {
    const plan = planConversationTaskEnqueue("conv_1", "wamid.same", "kybba", [
      {
        created_at: "2026-03-07T21:00:00.000Z",
        id: "whatsapp_running",
        params: {
          conversationId: "conv_1",
          discordChannelName: "kybba",
          messageId: "wamid.same",
        },
        status: "running",
      },
      {
        created_at: "2026-03-07T21:01:00.000Z",
        id: "whatsapp_stale",
        params: {
          conversationId: "conv_1",
          discordChannelName: "kybba",
          messageId: "wamid.old",
        },
        status: "pending",
      },
    ]);

    expect(plan).toMatchObject({
      kind: "noop",
      supersededTaskIds: ["whatsapp_stale"],
      taskId: "whatsapp_running",
    });
  });
});
