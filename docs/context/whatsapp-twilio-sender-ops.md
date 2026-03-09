# WhatsApp Twilio Sender Ops (Legacy Reference)

This note captures the durable lessons from getting a regular Twilio WhatsApp sender online for Outlet.
It is now historical reference only. The current preferred WhatsApp transport is Evolution on a phone-linked WhatsApp account.

## Why This Exists

Twilio WhatsApp sender setup crosses four systems:
- Meta Business Manager / WhatsApp Business Accounts
- Meta OAuth and popup-based onboarding
- Twilio phone-number ownership across parent accounts and subaccounts
- Twilio Messaging senders and callback routing

The operational failure mode is that one UI claims failure while another layer already succeeded. Future sessions should not repeat that loop.

## Durable Rules

- Treat the Twilio Senders API as the source of truth for sender status. The Console onboarding wizard is not trustworthy enough to use as the final verdict.
- Separate sender truth from phone-number truth. A sender can be live while the phone number still belongs to a different Twilio account scope with different callbacks.
- Separate transport truth from Outlet integration truth. A sender can be online and still not be connected to Outlet if its inbound callback points somewhere else.
- Prefer voice verification if SMS verification does not arrive on the Twilio number.
- Restore temporary OTP-capture or debugging webhook changes before closing the task.
- Keep Twilio's WhatsApp typing-indicator call disabled by default in Outlet. In this setup it returns `invalid messageId format`, so the reliable customer-facing acknowledgement is a short delayed auto-reply like `Got it. Working on it now.` instead of a real typing bubble.

## What Worked

- A regular Twilio number, `+1 315-743-5653`, was successfully registered as a WhatsApp sender.
- The sender reached `ONLINE` state in the Twilio Senders API even though the Twilio Console wizard still showed a generic error.
- Meta popup completion plus a voice verification path were enough to finish the registration.

## What Failed Along The Way

- Meta Cloud API test-number creation was rate-limited on the Meta side and could not be relied on.
- Existing Outlet Media WABAs in Meta had restriction / partner-share issues and were not a clean onboarding base.
- Earlier legacy senders in Twilio were tied to stale Meta WABAs and showed `OFFLINE`.
- SMS-based verification was not dependable in this setup.

## Current Verified State

- There is a real regular-number Twilio WhatsApp sender online now.
- That sender is `+1 315-743-5653`.
- Outlet now has the expected app endpoints for Twilio-backed WhatsApp:
  - inbound callback: `/api/whatsapp/twilio`
  - outbound status callback: `/api/whatsapp/twilio/status`
  - agent/app internal send path: `/api/whatsapp/send`
- The sender is only "in Outlet" once the Twilio sender callback is repointed to the Outlet inbound route.
- A second number used for debugging, `+1 833-415-0776`, was restored to its prior baseline after the verification work.

## Standard Operating Procedure

1. Check Meta-side restrictions first.
If the target WABA is restricted, rejected, partner-sharing fails, or Meta is rate-limiting onboarding, stop and document it.

2. Run sender registration through the Twilio Console.
Use the Console to drive the flow, but do not trust its success / failure banner.

3. Prefer voice verification over SMS if codes do not appear.
Use the least-destructive path possible and clean up any temporary recorder or debug webhook afterward.

4. Re-check the Senders API immediately after every wizard failure.
If the sender exists and is `ONLINE`, accept that as the real state.

5. Check number ownership and callback routing separately.
Confirm where the underlying Twilio number lives and where the sender callback points before declaring Outlet integration complete.

6. Only then point the live sender at Outlet.
Changing the callback is the final product integration step, not part of transport proof.

7. Keep the app as the ledger owner.
Agent-side outbound sends should call Outlet's secret-guarded `/api/whatsapp/send` route instead of writing Twilio message rows directly from `agent/`.

## Impact On Outlet Agent Architecture

- Customer WhatsApp remains Discord-first.
- Twilio or Meta transport setup should be treated as the ingress layer behind that Discord operating surface, not as a reason to build a web inbox.
- Future WhatsApp transport work should load this note and the `twilio-whatsapp-sender-ops` repo skill before touching production senders or callbacks.
- For approved live direct chats, the first feedback loop should be: ingest inbound message, wait about 1-2 seconds, send the quick acknowledgment, then let the specialist/Boss pipeline produce the real answer. Do not spam a new quick acknowledgment for every back-to-back message in the same burst.
