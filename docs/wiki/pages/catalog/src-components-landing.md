# src/components / landing

Generated from the current working tree on 2026-04-28 02:31:12.

- Files: 12
- File kinds: React/TSX module (12)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/components/landing/contact-form.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / landing
- Ownership: landing page UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 221
- Bytes: 8529
- Imports (packages): react, framer-motion
- Imported by: __tests__/lib/contact-form.test.ts, src/app/landing/page.tsx
- Used by groups: Tests / Lib, src/app / root routes
- Route owners: src/app/landing/page.tsx
- Routes related (direct): src/app/landing/page.tsx
- Tests related: __tests__/lib/contact-form.test.ts
- Tests related (direct): __tests__/lib/contact-form.test.ts
- Exports: buildLandingContactPayload, ContactForm
- Symbol details: function buildLandingContactPayload (exported), function ContactForm (exported), function formString, const INPUT_CLS, const TEXTAREA_CLS, const RAW_BOOKING_URL, const BOOKING_EMBED_URL, const WHATSAPP_AUDIT_URL
- Defines: formString, buildLandingContactPayload, ContactForm, handleSubmit, INPUT_CLS, TEXTAREA_CLS, RAW_BOOKING_URL, BOOKING_EMBED_URL, WHATSAPP_AUDIT_URL, value, name, phone, … (+8 more)
- Contents summary: contains `use client`; exports: buildLandingContactPayload, ContactForm; package imports: 2

## `src/components/landing/credibility.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / landing
- Ownership: landing page UI components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 539
- Bytes: 21517
- Imports (internal): docs/screenshots/campaign-desktop.png, docs/screenshots/campaign-mobile-viewport.png, src/components/landing/sample-metric-card.tsx
- Imports (packages): react, next/image, lucide-react
- Depends on groups: Docs / Screenshots, src/components / landing
- Exports: LandingCredibility
- Symbol details: function LandingCredibility (exported), const FEATURED_VISUALS, const PARTNER_ITEMS, const DIFFERENTIATORS, const QUICK_WINS, const PORTAL_METRICS, const TOUR_METRICS, const COMPARISON_ROWS, type LandingBarStyle
- Defines: LandingCredibility, FEATURED_VISUALS, PARTNER_ITEMS, DIFFERENTIATORS, QUICK_WINS, PORTAL_METRICS, TOUR_METRICS, COMPARISON_ROWS, LandingBarStyle
- Contents summary: exports: LandingCredibility; internal imports: 3; package imports: 3

## `src/components/landing/faq.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / landing
- Ownership: landing page UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 64
- Bytes: 2831
- Imports (packages): framer-motion
- Imported by: src/app/landing/page.tsx
- Used by groups: src/app / root routes
- Route owners: src/app/landing/page.tsx
- Routes related (direct): src/app/landing/page.tsx
- Exports: LandingFAQ
- Symbol details: function LandingFAQ (exported), const QA
- Defines: LandingFAQ, QA
- Contents summary: contains `use client`; exports: LandingFAQ; package imports: 1

## `src/components/landing/features.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / landing
- Ownership: landing page UI components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 176
- Bytes: 7488
- Imports (internal): docs/screenshots/campaign-mobile-creatives.png, src/components/landing/sample-metric-card.tsx
- Imports (packages): next/image, lucide-react
- Depends on groups: Docs / Screenshots, src/components / landing
- Exports: LandingFeatures
- Symbol details: function LandingFeatures (exported), const PORTAL_FEATURES
- Defines: LandingFeatures, PORTAL_FEATURES, Icon
- Contents summary: exports: LandingFeatures; internal imports: 2; package imports: 2

## `src/components/landing/footer.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / landing
- Ownership: landing page UI components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 35
- Bytes: 1384
- Imports (packages): next/link
- Exports: LandingFooter
- Symbol details: function LandingFooter (exported)
- Defines: LandingFooter
- Contents summary: exports: LandingFooter; package imports: 1

## `src/components/landing/hero.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / landing
- Ownership: landing page UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 106
- Bytes: 4438
- Imports (packages): next/image, framer-motion
- Imported by: src/app/landing/page.tsx
- Used by groups: src/app / root routes
- Route owners: src/app/landing/page.tsx
- Routes related (direct): src/app/landing/page.tsx
- Exports: LandingHero
- Symbol details: function LandingHero (exported), const fadeUp, const stagger
- Defines: LandingHero, fadeUp, stagger
- Contents summary: contains `use client`; exports: LandingHero; package imports: 2

## `src/components/landing/how-it-works.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / landing
- Ownership: landing page UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 61
- Bytes: 2463
- Imports (packages): framer-motion
- Imported by: src/app/landing/page.tsx
- Used by groups: src/app / root routes
- Route owners: src/app/landing/page.tsx
- Routes related (direct): src/app/landing/page.tsx
- Exports: LandingHowItWorks
- Symbol details: function LandingHowItWorks (exported), const STEPS
- Defines: LandingHowItWorks, STEPS
- Contents summary: contains `use client`; exports: LandingHowItWorks; package imports: 1

## `src/components/landing/lead-funnel.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / landing
- Ownership: landing page UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 431
- Bytes: 17988
- Imports (packages): next/image, framer-motion
- Imported by: src/app/landing/page.tsx
- Used by groups: src/app / root routes
- Route owners: src/app/landing/page.tsx
- Routes related (direct): src/app/landing/page.tsx
- Exports: LandingProofStats, LandingProblemSection, LandingAuditDeliverables, LandingProofCarousel, LandingMidPageCTA, LandingFounderTrust, LandingScarcitySection, LandingBookingSection
- Symbol details: function LandingProofStats (exported), function LandingProblemSection (exported), function LandingAuditDeliverables (exported), function LandingProofCarousel (exported), function LandingMidPageCTA (exported), function LandingFounderTrust (exported), function LandingScarcitySection (exported), function LandingBookingSection (exported), const STATS, const PROBLEMS, const DELIVERABLES, const PROOF_CARDS, const RAW_BOOKING_URL, const BOOKING_EMBED_URL, const WHATSAPP_AUDIT_URL, const reveal
- Defines: LandingProofStats, LandingProblemSection, LandingAuditDeliverables, LandingProofCarousel, LandingMidPageCTA, LandingFounderTrust, LandingScarcitySection, LandingBookingSection, STATS, PROBLEMS, DELIVERABLES, PROOF_CARDS, … (+4 more)
- Contents summary: contains `use client`; exports: LandingProofStats, LandingProblemSection, LandingAuditDeliverables, LandingProofCarousel, LandingMidPageCTA, LandingFounderTrust, LandingScarcitySection, LandingBookingSection; package imports: 2

## `src/components/landing/nav.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / landing
- Ownership: landing page UI components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 37
- Bytes: 1320
- Imports (packages): next/image, next/link
- Exports: LandingNav
- Symbol details: function LandingNav (exported)
- Defines: LandingNav
- Contents summary: exports: LandingNav; package imports: 2

## `src/components/landing/sample-metric-card.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / landing
- Ownership: landing page UI components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 177
- Bytes: 5881
- Imports (internal): src/lib/utils.ts
- Imports (packages): react
- Imported by: src/components/landing/credibility.tsx, src/components/landing/features.tsx
- Depends on groups: src/lib
- Used by groups: src/components / landing
- Exports: LandingSampleMetricCard
- Symbol details: function LandingSampleMetricCard (exported), type LandingMetricAccent, type LandingMetricSize, type LandingMetricTrack, interface LandingSampleMetricCardProps
- Defines: LandingSampleMetricCard, gradientId, accentStyle, trackStyle, compact, LandingMetricAccent, LandingMetricSize, LandingMetricTrack, LandingSampleMetricCardProps
- Contents summary: exports: LandingSampleMetricCard; internal imports: 1; package imports: 1

## `src/components/landing/stats.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / landing
- Ownership: landing page UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 105
- Bytes: 3720
- Imports (packages): framer-motion, lucide-react
- Exports: LandingStats
- Symbol details: function LandingStats (exported), const PRINCIPLES, const FIT_MARKETS
- Defines: LandingStats, PRINCIPLES, FIT_MARKETS, Icon
- Contents summary: contains `use client`; exports: LandingStats; package imports: 2

## `src/components/landing/sticky-cta.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / landing
- Ownership: landing page UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 85
- Bytes: 2267
- Imports (packages): react
- Imported by: src/app/landing/page.tsx
- Used by groups: src/app / root routes
- Route owners: src/app/landing/page.tsx
- Routes related (direct): src/app/landing/page.tsx
- Exports: LandingStickyCTA
- Symbol details: function LandingStickyCTA (exported)
- Defines: LandingStickyCTA, heroCta, booking, form, recompute, io
- Contents summary: contains `use client`; exports: LandingStickyCTA; package imports: 1
