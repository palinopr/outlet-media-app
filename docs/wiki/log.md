# Repo Wiki Log

## [2026-04-27] client-web | actual placement platform icons
- Replaced text-only placement badges in campaign detail with the shared Facebook and Instagram platform icons.
- Kept full readable placement names in the Markets & Placements panel so clients can still scan Feed, Stories, and Reels clearly.

## [2026-04-27] client-web | readable placement labels
- Replaced the campaign detail placement axis chart with a compact ranked bar list so platform and placement names are readable.
- Added platform badges such as `IG` and `FB`, while preserving percent-of-impressions, hover detail, clicks, impressions, and CTR context.
- Kept placement reporting client-facing and avoided adding targeting or strategy details.

## [2026-04-27] client-web | uncramp campaign markets section
- Moved campaign detail Markets & Placements out of the three-column row into a full-width section below timeline and hourly delivery.
- Kept top-level reporting as a two-panel row, then gave top markets and placements a wider side-by-side layout.
- Switched market spend cells to the shared USD formatter so values render as one coherent value.

## [2026-04-27] client-web | dark campaign list polish
- Restyled the client campaign list page to match the dark campaign detail direction with charcoal/navy cards, blue-violet controls, and compact reporting tables.
- Kept revenue/ROAS off the campaign list when no revenue attribution exists, replacing those fields with click and CPC reporting.
- Updated the campaign range filter active states so list and detail use the same dark blue selected-control language.

## [2026-04-27] client-web | dark campaign detail redesign
- Restyled client campaign detail toward the accepted dark Outlet Media mockup: charcoal/navy surfaces, blue-violet chart accents, and green reserved for active/positive signals.
- Reorganized the campaign detail reporting grid into metric cards, top insight strip, timeline, markets/placements, hourly delivery, creative performance, audience breakdown, and campaign requests.
- Kept the surface client-safe by avoiding strategy, targeting, interests, internal notes, and invented revenue/ROAS when unavailable.

## [2026-04-27] client-web | visual campaign detail graphs
- Reworked client campaign detail pages away from strategy/recommendation copy and toward metric-first visual reporting.
- Added top metric cards, clearer performance snapshot cards, larger timeline placement, and renamed sections for markets, hourly delivery, creative performance, and audience breakdown.
- Upgraded the performance timeline chart into metric toggles for Spend, Clicks, Impressions, CTR, CPC, and Revenue when available, with a useful Today single-day state.

## [2026-04-27] client-web | default campaign portal to today
- Changed client campaign list and detail pages so missing or retired `range=30` URLs resolve to Today by default.
- Kept 7d, Lifetime, and Custom as explicit client range choices while removing 30d from client detail controls and guidance copy.
- Added regression coverage for stale 30-day login redirects and assigned new-campaign detail access.

## [2026-04-27] client-web | campaign range picker and new-campaign detail fallback
- Changed the client Campaigns page default reporting window to Last 7 Days and added Today, Last 7 Days, Lifetime, and Custom range controls.
- Preserved selected standard/custom ranges when opening campaign detail and returning back to the campaign list.
- Allowed campaign detail to fall back to live Meta campaign info when a new campaign is visible from Meta but not yet synced into `meta_campaigns`.

## [2026-04-27] client-access | preserve assignments on invite acceptance
- Changed invite acceptance to reuse an existing `client_members` row instead of upserting over it, preserving assigned campaign/event rows tied to the member id.
- Changed the admin Users client-access add path to no-op when membership already exists, instead of recreating or overwriting membership data.
- Added regression tests for invite acceptance and admin user client assignment.

## [2026-04-27] admin-web | campaign assignment and support-module audit
- Confirmed the latest Railway deployment succeeded and smoke-checked signed-out client route redirects plus `/api/health`.
- Added an admin campaigns warning for rows still mapped to `unknown` so operators can assign them before client exposure.
- Restricted bulk campaign assignment to existing client accounts instead of arbitrary typed slugs.
- Audited assets, conversations, and operations-center feature modules as embedded support code rather than dead standalone surfaces.

## [2026-04-27] client-web | admin event warnings and reset-doc cleanup
- Added admin-preview-only warnings when optional event detail reads fail, while keeping member-facing event pages available.
- Updated the architecture reset context so it reflects the current Campaigns/Reports/optional Events/optional Agent client package instead of the retired broad portal.
- Recorded the removed client overview support components in the dead-code audit page.
- Recorded the remaining unmapped live-campaign ownership issue as admin data cleanup instead of guessing client ownership in code.

## [2026-04-27] client-web | fix campaign range and event detail fallbacks
- Preserved the client campaign index's 30-day reporting window when opening campaign detail rows/cards.
- Changed client event detail loading so linked campaigns, snapshots, and demographics fail soft instead of making an existing event render as not found.
- Added focused regression coverage for campaign detail links and optional event-supporting read failures.
- Follow-up cleanup made the campaign range an explicit `campaigns?range=` route input, removed dead client overview/card/date/stat components, deleted the old aggregate portal loader, and disabled empty Events nav for `beamina` and `kybba`.

## [2026-04-27] campaigns | tolerate unavailable Supabase enrichment
- Diagnosed campaign list blanks caused by Supabase being unreachable while `fetchAllCampaigns` was reading optional enrichment data.
- Wrapped campaign overrides, client slugs, and campaign type reads with fallbacks so Meta campaign rows can still render when Supabase is paused or DNS is unavailable.
- Added `src/lib/meta-campaigns.test.ts` to verify Meta campaigns return even when optional Supabase queries reject.

## [2026-04-10] landing | add media-vs-ticketing comparison section and premium mobile sticky cta
- Extended the illustrative landing proof system beyond standalone metric cards.
- Updated `src/components/landing/sample-metric-card.tsx` so cards now carry a second visual axis for `media`, `ticketing`, or `system`, not just accent color. The card now renders track badges and subtle surface treatment so sample metrics feel like distinct operator modes instead of generic KPI tiles.
- Updated `src/components/landing/credibility.tsx` to add a new `media vs ticketing` comparison section with animated comparison bars that show how the two readings sit side by side on one board.
- Updated the hero, portal collage, and portal-agent overlays to use the richer card system with track-specific treatment.
- Reworked the mobile sticky CTA in `src/app/landing/page.tsx` so it matches the premium audit intake styling instead of reading like a generic floating button.
- Added reusable animated comparison-bar styles in `src/app/globals.css` for the new landing chart section.

## [2026-04-10] landing | add designed sample metric cards and richer portal overlays
- Upgraded the illustrative-metrics landing proof treatment so it feels more like a designed reporting surface instead of plain text tiles.
- Added `src/components/landing/sample-metric-card.tsx` as a reusable landing-only metric card with:
  - color-coded accents
  - inline sparkline trend visuals
  - delta pills
  - compact and default layouts for hero, portal overlays, and proof grids
- Replaced the remaining flat sample metric blocks in `src/components/landing/hero.tsx` and `src/components/landing/credibility.tsx` with the new card treatment.
- Added richer sample portal overlays to the hero composite, the KYBBA-style collage in the credibility section, and the portal/agent screenshot card in `src/components/landing/features.tsx` so the blurred product shots still feel alive without exposing real customer data.

## [2026-04-10] landing | switch proof blocks to illustrative metrics instead of blank placeholders
- Updated the public `/landing` proof sections again after deciding the marketing surface can use believable sample metrics as long as they are not real client numbers.
- Replaced the fully qualitative proof labels in `src/components/landing/hero.tsx` and `src/components/landing/credibility.tsx` with illustrative KPI-style numbers and sample metric cards.
- Kept the underlying screenshot blur/obscuration in place and shifted the section framing to make it clear these are illustrative metrics layered onto real product visuals, not exposed customer data.
- Updated the portal section copy in `src/components/landing/features.tsx` so the page now signals `metricas ilustrativas` instead of implying that the public view is showing actual live client numbers.

## [2026-04-10] landing | remove public customer metrics from landing proof
- Scrubbed exact customer metrics from the public `/landing` page after deciding that client numbers should not be exposed on the marketing surface.
- Updated `src/components/landing/hero.tsx`, `src/components/landing/credibility.tsx`, and `src/components/landing/features.tsx` to replace exact tickets / ROAS / revenue figures with qualitative proof language and generalized operator-facing labels.
- Soft-obscured the imported portal screenshots with stronger blur/overlay treatment so the product shape is still visible without showing sensitive customer numbers directly on the page.
- Updated the landing metadata copy to avoid leaning on client-specific quantified claims.

## [2026-04-10] landing | add subtle motion and founder-led final polish
- Ran a final landing polish pass focused on motion, composition, and sharper positioning voice.
- Updated `src/app/landing/page.tsx` so desktop feels more editorial instead of two evenly stacked panels:
  - increased the left/right asymmetry
  - pushed the right column lower on desktop for a clearer stagger
  - tightened the metadata description to match the current positioning
- Updated `src/components/landing/hero.tsx`, `src/components/landing/credibility.tsx`, `src/components/landing/features.tsx`, and `src/components/landing/contact-form.tsx` to:
  - shift the copy into a more direct founder-led voice
  - sharpen the hero promise around seeing what moves revenue
  - strengthen the founder/operator section and portal-agent explanation
  - tighten the CTA copy around immediate diagnostic value
  - add subtle motion-safe floating and hover-lift treatment on key hero and proof cards
- Added reusable landing polish motion classes in `src/app/globals.css` rather than scattering one-off inline animation strings across the route.

## [2026-04-10] landing | build standout hero composite and premium audit CTA
- Reworked the top and bottom conversion blocks on the public `/landing` page for a stronger first-screen impression and a more premium intake experience.
- Updated `src/components/landing/hero.tsx` to:
  - tighten the top-line positioning copy
  - replace the plain hero ending with a composite art-plus-analytics card using a real artist image and a layered KYBBA portal preview
  - shift the stat row to support that composite instead of carrying the whole hero by itself
- Updated `src/components/landing/contact-form.tsx` to:
  - tighten the CTA copy line by line
  - add explicit audit-outcome cards
  - wrap the inputs in a darker premium inner panel with a three-step intake strip
  - strengthen the submit button treatment so the bottom CTA feels more intentional than a generic form block

## [2026-04-10] landing | art direct proof visuals and add desktop portal collage
- Tightened the visual art direction of the public `/landing` proof sections after the previous repo-grounded proof rewrite.
- Rebuilt the credibility strip in `src/components/landing/credibility.tsx` into:
  - a featured artist/project mosaic with stronger image-first crops
  - a separate promoter/logo strip for Gallimbo Studios, 9AM, and Duars Live
  - a mobile-plus-desktop KYBBA portal collage that shows the product on both surfaces instead of repeating a single screenshot treatment
- Added `docs/screenshots/campaign-desktop.png` as a real landing dependency so the proof flow now shows both the compact client view and the fuller reporting surface.

## [2026-04-10] landing | replace generic proof with sourced wins and real portal AI messaging
- Reworked the public `/landing` proof and AI sections to reflect repo-grounded evidence instead of generic agency-style claims.
- Updated the landing hero and credibility sections so the visible success claims now lean on sourced internal examples already tracked in the repo, including:
  - Don Omar BCN ticket volume and ROAS
  - KYBBA live portal metrics from captured product screenshots
  - Alofoke / Arjona / Chris R quick-win metrics
- Rebuilt the proof area around larger client/artist visuals, a real portal screenshot, and stronger case-study cards instead of the earlier placeholder-style stat tiles.
- Added a more explicit `portal + agent` card in `src/components/landing/features.tsx` so the landing explains the actual client-safe conversational reporting model already present in the app.
- Added FAQ coverage clarifying that the portal agent is read-only reporting/help, not a fully autonomous campaign operator.

## [2026-04-10] landing | tighten typography scale and spacing rhythm
- Ran a focused visual cleanup pass on the public `/landing` page after the broader proof-layout redesign.
- Tightened typography and vertical rhythm across the landing route and section components:
  - adjusted hero spacing, heading width, body size, pill sizing, and proof-stat card rhythm
  - normalized section `py` spacing across proof, operator, process, FAQ, and CTA blocks
  - softened a few oversized mobile headings and gave long text blocks clearer max widths
  - improved accordion, proof-card, and CTA spacing so the page reads more like one composed surface instead of stacked feature cards
- Updated the main landing route spacing so mobile has more comfortable bottom room above the sticky CTA and desktop panels keep a cleaner stagger.

## [2026-04-10] landing | remove wireframe feel and strengthen proof layout
- Reworked the public `/landing` page presentation to feel closer to a finished campaign page instead of a labeled mock.
- Updated the landing hero, proof sections, operator profile, process section, FAQ, CTA form, and desktop column balance:
  - removed wireframe-style section labels like `Hero`, `Trust strip`, `Differentiator`, and `Operator profile`
  - tightened the hero so more proof appears above the fold on mobile
  - replaced the text-only proof strip with asset-backed tiles from `public/images/landing/`
  - rebuilt the signature result cards with stronger stats, media blocks, and clearer hierarchy
  - removed duplicate mid-page CTA buttons so the page now centers on the hero CTA, sticky mobile CTA, and final form CTA
  - strengthened the operator image crop/overlay, FAQ open state, and desktop asymmetry
- Updated the audit form copy and inputs so the CTA block reads like final product copy instead of placeholder field treatment.

## [2026-04-10] landing | make dark background fill mobile viewport
- Updated `src/app/landing/page.tsx` so the dark landing background fills the full phone viewport on mobile instead of leaving the bright desktop backdrop visible around the content.
- Kept the bright studio-style outer backdrop for larger screens only, where it still helps sell the mock-inspired presentation.
- Flattened the mobile outer spacing so the landing sections read as a full-screen page on actual phones rather than dark cards floating on a light canvas.

## [2026-04-10] admin-web | add client request handling tabs on campaign and event detail
- Added a shared admin `ClientRequestsPanel` in `src/components/admin/client-requests-panel.tsx` so admins can handle client request threads directly from the owning campaign or event.
- Added real admin request tabs on:
  - `src/app/admin/campaigns/[campaignId]/page.tsx`
  - `src/app/admin/events/[eventId]/page.tsx`
- The new admin request surface now lets Outlet:
  - see shared client request threads in one place
  - reply directly back onto the same thread
  - resolve and reopen request threads
- Extended `src/app/api/event-comments/route.ts` with `PATCH` support so event request threads can now be resolved or reopened from admin.
- Extended `src/features/events/server.ts` so admin event detail can load event comments for the new request tab.
- Added coverage for the new admin request panel, both admin detail pages, and the new event comment `PATCH` flow.

## [2026-04-10] landing | remove device-frame shell from public page
- Corrected the public `/landing` presentation after the previous pass misread the reference as an actual in-page phone mock.
- Removed `src/components/landing/phone-shell.tsx` and changed `src/app/landing/page.tsx` back to plain dark content panels on the bright landing backdrop.
- Kept the stronger visual treatment from the redesign while removing the literal device frame so the page reads as a normal landing layout.

## [2026-04-10] landing | mobile-phone shell redesign and wiki refresh
- Reworked the public `/landing` page to match the provided mobile mock more closely:
  - added a new `src/components/landing/phone-shell.tsx` wrapper for the dual phone presentation
  - updated the hero, credibility, operator profile, how-it-works, FAQ, and audit form sections for the tighter dark-on-light composition
  - kept the existing contact flow and local verification loop intact while changing the presentation layer
- Regenerated the repo catalog with `python3 docs/wiki/tools/generate_repo_catalog.py` so the new landing component and current working-tree state are reflected across the generated pages.
- Updated `docs/wiki/index.md` so it includes links to the generated schema-object and impact-map pages that are already part of the catalog output.

## [2026-04-10] client-events | replace empty operating-loop shell with request-first UI
- Reworked `src/app/client/[slug]/components/event-operating-panel.tsx` so the client event detail no longer opens with the heavy multi-card "operating loop" shell.
- The client event surface is now request-first:
  - one primary `Event requests` area
  - simpler composer copy in `event-discussion-form.tsx`
  - supporting workflow blocks only render when approvals, follow-up items, agent outcomes, or recent activity actually exist
- Added coverage proving the event panel stays minimal when there is no workflow data and that the old operating-loop copy is gone.

## [2026-04-10] client-campaign | replace empty operating-loop shell with request-first UI
- Reworked `src/app/client/[slug]/components/campaign-operating-panel.tsx` so the client campaign detail no longer opens with the big empty "operating loop" shell.
- The client campaign surface is now request-first:
  - one primary `Campaign requests` area
  - simpler composer copy in `campaign-discussion-form.tsx`
  - supporting workflow blocks only render when approvals, next steps, agent outcomes, or recent activity actually exist
- Added coverage proving the campaign panel stays minimal when there is no workflow data and that the old operating-loop copy is gone.

## [2026-04-10] client-events | operating loop slice on event detail
- Added the client event operating-loop slice to the shipped web surface:
  - new shared event workflow loader in `src/features/events/client-operating.ts`
  - new shared event comment reader/access module in `src/features/event-comments/server.ts`
  - new client workflow UI in `src/app/client/[slug]/components/event-operating-panel.tsx`
  - new event discussion composer in `src/app/client/[slug]/components/event-discussion-form.tsx`
  - client event detail now combines ticketing analytics with approvals, shared discussion, event follow-up items, linked agent follow-through, and recent activity
- Added `GET`/`POST` support for shared event discussion via `src/app/api/event-comments/route.ts`, including scope-aware access checks, system events, notifications, agent triage requests, and workflow revalidation.
- Extended approval and system-event helpers so event operating views can include event-linked and linked-campaign context without rebuilding route-local filtering.
- Added component and route coverage for the new event operating panel, event discussion form, event comments API, and approval helper behavior.

## [2026-04-10] client-campaign | operating loop slice and verification hygiene
- Added the first client campaign operating-loop slice to the shipped web surface:
  - new shared client campaign workflow loader in `src/features/campaigns/server.ts`
  - new client workflow UI in `src/app/client/[slug]/components/campaign-operating-panel.tsx`
  - new comment composer in `src/app/client/[slug]/components/campaign-discussion-form.tsx`
  - client campaign detail now combines analytics with approvals, shared discussion, open action items, agent follow-through, and recent activity
- Added component coverage for the new client operating panel and campaign discussion form.
- Fixed repo verification hygiene by excluding `tmp-playwright/**` from Vitest so `npm run check:web` no longer fails on local scratch Playwright files.
- Regenerated the wiki catalog with `python3 docs/wiki/tools/generate_repo_catalog.py` and updated the overview/audit pages to reflect the shipped client operating slice and the resolved Vitest mismatch.

## [2026-04-10] guides | service boundaries and human read-order pages
- Expanded `docs/wiki/tools/generate_repo_catalog.py` again so the generated wiki now also emits:
  - `docs/wiki/pages/catalog/service-boundaries.md`
  - `docs/wiki/pages/catalog/onboarding-guides.md`
  - nested generated pages under `docs/wiki/pages/catalog/guide-pages/`
- Added a service-boundary page summarizing web vs agent vs database ownership and the shared bridge files that connect those systems.
- Added human-oriented onboarding/read-order guides for admin web work, client portal work, agent runtime work, auth/access work, and reporting/ingest work.
- Updated `docs/wiki/index.md` and `docs/wiki/AGENTS.md` so these generated pages are treated as first-class entrypoints.

## [2026-04-10] profiles | business rules and per-table pages
- Expanded `docs/wiki/tools/generate_repo_catalog.py` again so the generated wiki now also emits:
  - `docs/wiki/pages/catalog/business-rules.md`
  - nested generated pages under `docs/wiki/pages/catalog/business-rule-pages/`
  - `docs/wiki/pages/catalog/table-profiles.md`
  - nested generated pages under `docs/wiki/pages/catalog/table-pages/`
- Added business-rule pages that group files, DB objects, routes, tests, docs, auth signals, and behavior signals around major rule areas such as access, campaign scope, approvals, client-agent read-only behavior, agent runtime recovery, and reporting from the shared backbone.
- Added per-table pages for migration-discovered tables with migrations, reference counts, route/feature/lib/agent usage, mutation-oriented files, and behavior/auth signals from referencing code.
- Updated `docs/wiki/index.md` and `docs/wiki/AGENTS.md` so these deeper generated pages are treated as first-class entrypoints.

## [2026-04-10] maps | env/integrations and lifecycle narratives
- Expanded `docs/wiki/tools/generate_repo_catalog.py` again so the generated wiki now also emits:
  - `docs/wiki/pages/catalog/env-integrations.md`
  - `docs/wiki/pages/catalog/workflow-lifecycles.md`
  - nested generated pages under `docs/wiki/pages/catalog/lifecycle-pages/`
- Added an env/integration map that groups environment variables by integration service and shows which routes, features, libs, agent files, tests, and docs reference them.
- Added lifecycle pages that group routes, features, libs, tests, docs, and DB objects around major system flows such as access/invites, agent runtime, campaign discussion/action items, event follow-up, client-agent conversations, approvals/shared timeline, and ingest/snapshots.
- Updated `docs/wiki/index.md` and `docs/wiki/AGENTS.md` so these generated pages are treated as first-class entrypoints.

## [2026-04-10] maps | auth/access, workflow, and mutations
- Expanded `docs/wiki/tools/generate_repo_catalog.py` again so the generated wiki now also emits:
  - `docs/wiki/pages/catalog/auth-access.md`
  - `docs/wiki/pages/catalog/workflow-events.md`
  - `docs/wiki/pages/catalog/mutation-surfaces.md`
- Added an auth/access map for route files, code files, and DB objects tied to authentication, membership, invites, and scope.
- Added a workflow/event map for workflow-bearing DB objects and the code files that orchestrate them.
- Added a mutation-surface map for API mutation routes, admin actions, and mutation-oriented helpers/runtime files.
- Updated `docs/wiki/index.md` and `docs/wiki/AGENTS.md` so these generated pages are treated as first-class entrypoints.

## [2026-04-10] profiles | deep route and feature pages
- Expanded `docs/wiki/tools/generate_repo_catalog.py` again so the generated wiki now also emits:
  - `docs/wiki/pages/catalog/route-profiles.md`
  - `docs/wiki/pages/catalog/feature-profiles.md`
  - nested generated pages under `docs/wiki/pages/catalog/route-pages/`
  - nested generated pages under `docs/wiki/pages/catalog/feature-pages/`
- Added deeper semantic/behavior summaries for each route file, including auth signals, behavior signals, DB objects touched, tests, and grouped dependency stacks.
- Added deeper feature-module summaries for each `src/features/*` module, including entry files, server/client split, route users, DB objects touched, tests, auth/access signals, behavior signals, and exporting files.
- Updated `docs/wiki/index.md` and `docs/wiki/AGENTS.md` so these deeper generated pages are treated as first-class entrypoints.

## [2026-04-10] maps | api contracts, schema grouping, and component trees
- Expanded `docs/wiki/tools/generate_repo_catalog.py` again so the generated wiki now also emits:
  - `docs/wiki/pages/catalog/supabase-schema.md`
  - `docs/wiki/pages/catalog/api-contracts.md`
  - `docs/wiki/pages/catalog/component-trees.md`
- Added schema grouping documentation that organizes migration-discovered database objects by kind.
- Added API contract documentation that summarizes route methods, request/response signals, validation symbols, dependency context, and related tests for `src/app/api/**/route.ts` files.
- Added component tree documentation for admin and client surface entry files, including direct components, transitive component categories, feature modules, libs, and related tests.
- Updated `docs/wiki/index.md` and `docs/wiki/AGENTS.md` so these generated pages are treated as first-class entrypoints.

## [2026-04-10] maps | database references and test coverage
- Expanded `docs/wiki/tools/generate_repo_catalog.py` again so the generated wiki now also emits:
  - `docs/wiki/pages/catalog/database-to-code.md`
  - `docs/wiki/pages/catalog/test-coverage.md`
- Added database-to-code documentation that maps database objects discovered in migrations back to routes, features, libs, agent files, tests, docs, and other mentions.
- Added test coverage documentation that maps code files to exact direct and transitive linked tests.
- Improved import extraction to include dynamic `import()`, `vi.mock()`, and `require()` patterns so test-to-source links are captured more accurately.
- Updated `docs/wiki/index.md` and `docs/wiki/AGENTS.md` so these generated pages are treated as first-class entrypoints.

## [2026-04-10] maps | route stacks and key file symbols
- Expanded `docs/wiki/tools/generate_repo_catalog.py` again so the generated wiki now also emits:
  - `docs/wiki/pages/catalog/route-stacks.md`
  - `docs/wiki/pages/catalog/key-file-symbols.md`
- Added route stack documentation that maps each Next.js special route file to its direct and transitive internal dependency stack, touched groups, touched feature modules, related libs, and related tests.
- Added key-file symbol documentation that lists exported symbols, symbol details, definitions, route owners, and related tests for important route, feature, lib, component, and agent runtime files.
- Updated `docs/wiki/index.md` and `docs/wiki/AGENTS.md` so these generated pages are treated as first-class entrypoints.

## [2026-04-10] cross-links | tests, routes, and dependency maps
- Expanded `docs/wiki/tools/generate_repo_catalog.py` so the generated catalog now adds cross-links for imported-by relationships, test links, route-owner links, dependency groups, and feature-module labels.
- Added generated dependency overview pages:
  - `docs/wiki/pages/catalog/group-dependencies.md`
  - `docs/wiki/pages/catalog/feature-dependencies.md`
- Improved internal import resolution so alias imports and agent `.js` runtime-style imports resolve back to source files when possible.
- Updated `docs/wiki/index.md` and `docs/wiki/AGENTS.md` to reflect the stronger catalog shape.

## [2026-04-10] catalog | generated file-by-file repo catalog
- Re-scoped the wiki toward documentation-first coverage.
- Added `docs/wiki/tools/generate_repo_catalog.py` to generate folder-level catalog pages from the current working tree.
- Generated `docs/wiki/pages/catalog/manifest.md` plus per-folder pages covering source files, docs, tests, migrations, config, and public assets.
- Generated `docs/wiki/pages/catalog/working-tree.md` to document modified and untracked paths currently present.
- Expanded catalog detail so each file entry now captures path, status, system, group, ownership, type, construction, route/route-context when relevant, line count, byte size, imports, exports, symbol definitions, and format-specific details such as tests, headings, JSON keys, and SQL objects.
- Updated `docs/wiki/index.md` and `docs/wiki/AGENTS.md` so the file catalog is now the primary entrypoint.
- Current generated catalog scope: 709 files from the current working tree, excluding dependency/build/local-output directories and the generated catalog pages themselves.

## [2026-04-10] bootstrap | initial repo understanding wiki
- Created `docs/wiki/` as the repo-understanding layer.
- Read current durable context docs:
  - `docs/context/product-direction.md`
  - `docs/context/engineering-principles.md`
  - `docs/context/agent-patterns.md`
  - `docs/context/current-priorities.md`
  - `docs/context/repo-organization.md`
- Read root `README.md` and `package.json`.
- Inventoried current routes, feature modules, and agent runtime files.
- Created initial overview, inventory, and secondary audit pages as starter structure.
