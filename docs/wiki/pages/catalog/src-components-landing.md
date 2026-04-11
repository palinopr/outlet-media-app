# src/components / landing

Generated from the current working tree on 2026-04-10 22:12:57.

- Files: 10
- File kinds: React/TSX module (10)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/components/landing/contact-form.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / landing
- Ownership: landing page UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 176
- Bytes: 6997
- Imports (internal): src/components/ui/button.tsx, src/components/ui/input.tsx
- Imports (packages): react, lucide-react, sonner
- Imported by: src/app/landing/page.tsx
- Depends on groups: src/components / ui
- Used by groups: src/app / root routes
- Route owners: src/app/landing/page.tsx
- Routes related (direct): src/app/landing/page.tsx
- Exports: ContactForm
- Symbol details: function ContactForm (exported), const CTA_OUTCOMES, const CTA_STEPS
- Defines: ContactForm, handleSubmit, CTA_OUTCOMES, CTA_STEPS, form, data, res, body
- Contents summary: contains `use client`; exports: ContactForm; internal imports: 2; package imports: 3

## `src/components/landing/credibility.tsx`
- Status: modified
- System: web
- Group: src/components / landing
- Ownership: landing page UI components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 398
- Bytes: 15649
- Imports (internal): docs/screenshots/campaign-desktop.png, docs/screenshots/campaign-mobile-viewport.png, src/components/landing/sample-metric-card.tsx
- Imports (packages): next/image, lucide-react
- Imported by: src/app/landing/page.tsx
- Depends on groups: Docs / Screenshots, src/components / landing
- Used by groups: src/app / root routes
- Route owners: src/app/landing/page.tsx
- Routes related (direct): src/app/landing/page.tsx
- Exports: LandingCredibility
- Symbol details: function LandingCredibility (exported), const FEATURED_VISUALS, const PARTNER_ITEMS, const DIFFERENTIATORS, const QUICK_WINS, const PORTAL_METRICS, const TOUR_METRICS
- Defines: LandingCredibility, FEATURED_VISUALS, PARTNER_ITEMS, DIFFERENTIATORS, QUICK_WINS, PORTAL_METRICS, TOUR_METRICS
- Contents summary: exports: LandingCredibility; internal imports: 3; package imports: 2

## `src/components/landing/faq.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / landing
- Ownership: landing page UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 78
- Bytes: 3360
- Imports (packages): react, lucide-react
- Imported by: src/app/landing/page.tsx
- Used by groups: src/app / root routes
- Route owners: src/app/landing/page.tsx
- Routes related (direct): src/app/landing/page.tsx
- Exports: LandingFAQ
- Symbol details: function LandingFAQ (exported), const FAQS
- Defines: LandingFAQ, FAQS, open
- Contents summary: contains `use client`; exports: LandingFAQ; package imports: 2

## `src/components/landing/features.tsx`
- Status: modified
- System: web
- Group: src/components / landing
- Ownership: landing page UI components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 174
- Bytes: 7422
- Imports (internal): docs/screenshots/campaign-mobile-creatives.png, src/components/landing/sample-metric-card.tsx
- Imports (packages): next/image, lucide-react
- Imported by: src/app/landing/page.tsx
- Depends on groups: Docs / Screenshots, src/components / landing
- Used by groups: src/app / root routes
- Route owners: src/app/landing/page.tsx
- Routes related (direct): src/app/landing/page.tsx
- Exports: LandingFeatures
- Symbol details: function LandingFeatures (exported), const AGENT_FEATURES
- Defines: LandingFeatures, AGENT_FEATURES, Icon
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
- Status: modified
- System: web
- Group: src/components / landing
- Ownership: landing page UI components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 178
- Bytes: 8031
- Imports (internal): docs/screenshots/campaign-mobile-viewport.png, src/components/landing/sample-metric-card.tsx
- Imports (packages): next/image
- Imported by: src/app/landing/page.tsx
- Depends on groups: Docs / Screenshots, src/components / landing
- Used by groups: src/app / root routes
- Route owners: src/app/landing/page.tsx
- Routes related (direct): src/app/landing/page.tsx
- Exports: LandingHero
- Symbol details: function LandingHero (exported), const PROOF_PILLS, const HERO_STATS
- Defines: LandingHero, PROOF_PILLS, HERO_STATS
- Contents summary: exports: LandingHero; internal imports: 2; package imports: 1

## `src/components/landing/how-it-works.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / landing
- Ownership: landing page UI components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 57
- Bytes: 2286
- Imports (packages): lucide-react
- Imported by: src/app/landing/page.tsx
- Used by groups: src/app / root routes
- Route owners: src/app/landing/page.tsx
- Routes related (direct): src/app/landing/page.tsx
- Exports: LandingHowItWorks
- Symbol details: function LandingHowItWorks (exported), const STEPS
- Defines: LandingHowItWorks, STEPS, Icon
- Contents summary: exports: LandingHowItWorks; package imports: 1

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
- Status: untracked
- System: web
- Group: src/components / landing
- Ownership: landing page UI components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 136
- Bytes: 4391
- Imports (internal): src/lib/utils.ts
- Imports (packages): react
- Imported by: src/components/landing/credibility.tsx, src/components/landing/features.tsx, src/components/landing/hero.tsx
- Depends on groups: src/lib
- Used by groups: src/components / landing
- Route owners: src/app/landing/page.tsx
- Exports: LandingSampleMetricCard
- Symbol details: function LandingSampleMetricCard (exported), type LandingMetricAccent, type LandingMetricSize, interface LandingSampleMetricCardProps
- Defines: LandingSampleMetricCard, gradientId, accentStyle, compact, LandingMetricAccent, LandingMetricSize, LandingSampleMetricCardProps
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
