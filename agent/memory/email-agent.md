# Email Agent Memory

## Account
- Email: jaime@outletmedia.net
- Auth: Service account with domain-wide delegation (google-auth.mjs)
- Tools: session/gmail-reader.mjs (search/read), session/gmail-sender.mjs (send/reply), session/gmail-admin.mjs (labels/filters/archive/mark-read)
- Event backbone: `email_events` (triage ledger), `email_drafts` (suggested replies), `email_reply_examples` (Jaime's sent-mail style memory)

## Contact Directory

### Outlet Media Team
- Alexandra Colon <alexandra@outletmedia.net> -- team lead
- Isabel Leal <isabel@outletmedia.net> -- team
- Natalie Vila <natalie@outletmedia.net> -- team (also nataliemarie66@gmail.com)

### Zamora (Client -- music promoter)
- Mirna Gonzalez <mirna@zamorausa.com> -- Director Tour Marketing, main contact
- Ivan Gonzalez <ivan.gonzalez@zamorausa.com>
- Jesus Guzman <jesus.guzman@zamorausa.com>
- Lida Caballero <lida@zamorausa.com>
- Omar Rodriguez <omar.rodriguez@zamorausa.com>

### Venue Contacts (Arjona Tour 2026)
- **Anaheim** (OC Vibe): Kishore Ramlagan <kramlagan@ocvibe.com> -- Director, Marketing
- **Palm Desert** (Acrisure Arena): Jason Gurzi <jgurzi@cvfirebirds.com> -- Dir Integrated Mktg; Melissa Suarez <msuarez@acrisurearena.com>
- **Salt Lake City** (Maverik Center): Casey Mills <cmills@maverikcenter.com> -- Director of Marketing
- **San Francisco** (Golden State): Steph Krutolow <SKrutolow@goldenstate.com> -- Manager, Venue Marketing
- **San Diego** (Pechanga Arena): Taylor Henderson <THenderson@pechangaarenasd.com> -- Marketing & PR Manager
- **Puerto Rico**: Eduardo Cajina <cajinae@gmail.com>, Amanda Cajina <amanda@cajinapro.com>

### Other Clients
- Bobby Mack <bobby@touringco.com>, Jeff Lawson <jeffl@touringco.com> -- Touring Co
- Eduardo Osorio <edu@eoentertainment.com> -- EO Entertainment
- Donna Arevalo <donnaarevalo@atgentertainment.com> -- ATG Entertainment
- Anabel Martinez <anabel.martinez@thepg.com> -- PG
- Christopher Leeper <christopher.leeper@seminolehardrock.com>, Victor Sanchez <victor.sanchez@shrss.com> -- Seminole Hard Rock

### Business
- Benjamin Rodriguez <benjamin@brodriguezcpa.com> -- CPA
- Edith Montes <edith.montes@brodriguezcpa.com> -- CPA office
- Meta Accounts Receivable <ar@meta.com>

## Pixel IDs
- Ricardo Arjona: 879345548404130
- San Diego (Pechanga Arena / AXS): 2005949343681464
- Sienna (purchase optimization): 1553637492361321
- Sienna pixel: 918875103967661

## Email Format Rules
- 1 person: "Hi [Name],"  |  Multiple: "Hi everyone,"
- Blank line after greeting, blank line before sign-off
- Never say "TM1" -- say "Meta pixel ID"
- Keep it platform-agnostic
- Sign off: "Thank you,\nJaime"
- Short and direct, no corporate fluff

## Label Structure
| Label | Color | Use |
|-------|-------|-----|
| Tours/Arjona | Dark Green #076239 | Arjona tour + venue emails |
| Tours/Camila | Green #149e60 | Camila tour emails |
| Tours/Don Omar | Teal #2da2bb | Don Omar BCN |
| Tours/Other | Light Green #a2dcc1 | Other Zamora tour stuff |
| Outlet Media/Team | Blue #4986e7 | Alexandra, Isabel, Natalie |
| Outlet Media/Invoices | Light Blue #b6cff5 | Meta invoices, billing |
| Clients | Purple #8e63ce | External client contacts |
| Cuentas | Orange #ffad47 | CPA / accounting |
| Importantes | Red #ac2b16 | Urgent/important |
| Insurance | Yellow #f2c960 | Insurance stuff |
| Life Insurance | Mint #c2e7da | Life insurance leads, policy updates, underwriting, annuities |
| Meetings | Pink #e07798 | Meeting invites |
| Viajes | Coral #fb4c2f | Travel |
| Tech/Alerts | Gray #666666 | Dev notifications |

## Learned Patterns
- **ALWAYS read the full thread from start to finish before summarizing or replying.** Never skim or skip earlier messages. Understand the full context — who started it, what was asked, what was answered — before saying anything. This is non-negotiable.
- Mirna introduces Jaime to venues, then Jaime shares pixel ID
- Venue asks "what pixel?" -> reply with Meta pixel ID, short and clean
- When venue asks about OTT/OOH -> "My role is strictly on the media buying side"
- Palm Desert access confirmed by Melissa Suarez (Mar 5)
- SF pixel being added by Steph's team (Mar 5)
- SLC pixel being placed by Casey (Mar 5)
- Life insurance is a real Jaime business line. Emails about life insurance leads, policy changes, underwriting, quotes, premiums, annuities, mortgage protection, and final expense are owner-relevant.
- Do not treat life insurance emails as junk just because they come from generic marketing, CRM, carrier, or automated senders.
- Label life insurance emails with `Life Insurance` and keep that context visible to Jaime.
- Railway build notifications (from railway.app) are no-reply automated alerts. Auto-archive + Tech/Alerts, do NOT flag for review. Filter created Mar 6.
- When done processing an email (archived, labeled, or no action needed), ALWAYS mark it as read. Never leave handled emails unread.

## Last Check State
- Last full audit: 2026-03-05
- Inbox cleaned: 9617 -> ~4250
- Filters created: 73 auto-archive filters
- Unread: 0 as of last check

## Operating Notes
- Watch both `INBOX` and `SENT`. Inbound mail is triaged and labeled; sent mail is mainly for learning Jaime's tone.
- Use `gmail-admin.mjs ensure` to keep the managed label set present.
- Use `gmail-admin.mjs filter-create` when a repeatable archive/tagging pattern becomes obvious.
- Owner corrections from Discord replies and button actions are stored in `session/email-owner-corrections.json` and should influence future triage for the same sender/domain/topic.


<!-- auto-learned 2026-03-06 -->
- `gmail-admin.mjs mark-read <messageId>` — marks a message as read (removes UNREAD label). Added Mar 6.

<!-- auto-learned 2026-03-06 -->
- gmail-sender.mjs fixed: now converts literal `\n` in --body arg to real newlines before sending
- FORMAT CONFIRMED WORKING (Mar 6): Use `\n\n` for paragraph breaks in --body arg. The sender script converts them to real newlines. Jaime verified the test email rendered correctly in Gmail. NEVER change this behavior.

<!-- auto-learned 2026-03-06 -->
- SLC Maverik Center pixel confirmed placed by Casey Mills (Mar 6)
- Acrisure Arena Meta portfolio invite from Melissa Sandoval, expires Apr 4 — needs acceptance
- Anaheim: Kishore Ramlagan awaiting confirmation that pixel is a Meta pixel
- TRIAGE RULE: When Jaime has already replied in a thread and the ball is on someone else (venue contact, third party), do NOT flag as "reply needed." Just monitor. Only flag reply needed when Jaime is the one being asked to respond.

<!-- auto-learned 2026-03-06 -->
- Arjona Tour pixel ID: 879345548404130 (all venues except San Diego)
- Palm Desert Acrisure Arena: access granted, thread closed (Mar 6)
- Acrisure contacts: Melissa Suarez (Sr Mgr) + Jason Gurzi (Dir)

<!-- auto-learned 2026-03-06 -->
- Anaheim Honda Center pixel placed Mar 5, Kishore screenshot confirmed Mar 6
- Chase Center (SF) pixel added via text msg to Steph Krutolow — confirmed done
- San Diego Pechanga: Taylor Henderson submitted to AXS Mar 5, 4-5 day wait
- Puerto Rico pixel: no email thread exists yet, status unknown

<!-- auto-learned 2026-03-06 -->
- Amazon Seller Central: credit card update needed, payments suspended
- Arjona SD: Jesus Guzman approved iHeartMedia radio buy ($2500 split 50/50 Pechanga/Zamora)
- Arjona SD: influencer proposal — Hispanic TikToker 17K followers wants 2 GA tix for giveaway+video

<!-- auto-learned 2026-03-07 -->
- TM One account username: jaime@outletmedia.net (sent to Melissa Cubit & Ashley Weltner on Mar 7)
- TM One permissions upgrade pending: Mirna asked Jaime to send account details to TM team (Mar 7)
- Arjona SD: Edgar Gallego (Channel 33 Tijuana, 38K IG) offered 2 tix for social push
- iHeartMedia SD radio spots running Mar 7–12 (pre-logs received)
- Facebook data access renewal completed for Outlet Media Method

<!-- auto-learned 2026-03-09 -->
- San Diego Pechanga pixel confirmed live Mar 9 (Taylor Henderson rushed it)
- All Arjona tour venue pixels now confirmed placed
- Amazon Developer account identity verification needed (jaime@outletmedia.net)
- Amazon Seller bank account updated successfully (US, CA, MX)

<!-- auto-learned 2026-03-09 -->
- Benjamin Rodriguez CPA sent tax proposal for Jaime & Natalie
- Abundance Energy: Natalie has autopay update pending
- Alexandra scheduled Reunion Outlet Media (Mar 9 5pm)
- Isabel scheduled Outlet Media x Sienna meeting (Mar 10 3:45pm)
- Alexandra scheduled Reunion AI Idea (Mar 10 4pm)

<!-- auto-learned 2026-03-09 -->
- Gmail service account broken: invalid_grant/Invalid signature (Mar 9)
- Fix: re-download JSON key from Google Cloud Console for service account

<!-- auto-learned 2026-03-09 -->
- Service account key exposed on GitHub; Google disabled it (root cause of invalid_grant)
- TM pricing contact: Kelly Eastman (added by Melissa Cubit)
- Mirna asks Jaime to explain 30% dynamic pricing strategy to TM team