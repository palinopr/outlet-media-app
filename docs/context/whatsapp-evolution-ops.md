# WhatsApp Evolution Ops

This note captures the current preferred WhatsApp transport for Outlet.

## Why Evolution Is The Current Default

- Outlet needs real direct chats and real WhatsApp groups on the same account.
- The current operating surface is still Discord-first, but the transport has to behave like a real WhatsApp participant.
- Twilio remains useful as historical reference, but it is not the preferred live path for native group behavior.

## Preferred Shape

- Use a dedicated phone with WhatsApp Business installed.
- Pair that phone into one Evolution instance.
- Point the Evolution webhook at Outlet:
  - `/api/whatsapp/evolution`
- Keep outbound sends inside Outlet through:
  - `/api/whatsapp/send`

The app remains the source of truth for:
- `whatsapp_accounts`
- `whatsapp_contacts`
- `whatsapp_conversations`
- `whatsapp_messages`
- `system_events`
- approval and policy state

## Security

- Preferred webhook auth: configure Evolution to send `Authorization: Bearer <EVOLUTION_WEBHOOK_SECRET>`.
- Fallback: match the Evolution `apikey` against `EVOLUTION_API_KEY`.
- Do not leave the webhook open without either a bearer secret or API-key validation.

## Runtime Rules

- Use one shared ledger for direct chats and group chats.
- Group chats are higher risk than 1:1 chats:
  - deny by default
  - Jaime must explicitly allow them
  - approved groups stay `mention_only` by default
- Direct chats can be approved separately from groups.
- Customer-facing outbound replies still go through Boss and the customer-whatsapp-agent.

## Current Transport Contract

- Inbound Evolution webhook -> normalize into the shared WhatsApp ledger.
- New inbound message -> bounded agent task for WhatsApp triage.
- Boss supervises cross-agent customer work.
- Specialists provide the customer-safe slice only.
- customer-whatsapp-agent is the customer-facing mouthpiece.

## Group-Specific Guidance

- Persist the group JID as the conversation/contact identity.
- Persist the participant who actually spoke on each inbound group message.
- When a group mention wakes the agent, load recent group transcript context before responding.
- Do not wake on every group message just because the group is approved.

## Direct-Message Guidance

- Direct chats on the same phone-linked account should use the same policy model as Twilio-backed direct chats:
  - blocked until allowed
  - then `shadow`, `draft_only`, `assisted`, or `live`
- For approved live direct chats, the quick acknowledgment loop should stay:
  - ingest inbound
  - wait about 1-2 seconds
  - send `Got it. Working on it now.`
  - let the real agent pipeline produce the final answer
- Repeated inbound messages in the same conversation should collapse onto one latest pending `triage-conversation` task instead of stacking duplicate pending jobs behind the same chat lock.

## Local Runtime Discipline

- The local Discord/WhatsApp worker should run under a restart loop, not an ad hoc foreground shell.
- Preferred local command:
  - `cd agent && npm run daemon`
- Reason: if the local worker dies, inbound WhatsApp still lands in the ledger, but delegated follow-up work stalls until the agent process comes back.

## Operational Note

- Keep Twilio docs for historical fallback only.
- Future WhatsApp work should load this note and `docs/context/agent-patterns.md` first, not default back to the Twilio sender path.
