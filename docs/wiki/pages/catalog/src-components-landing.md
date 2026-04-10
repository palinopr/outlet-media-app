# src/components / landing

Generated from the current working tree on 2026-04-10 16:52:39.

- Files: 10
- File kinds: React/TSX module (10)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/components/landing/contact-form.tsx`
- Status: modified
- System: web
- Group: src/components / landing
- Ownership: landing page UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 109
- Bytes: 4224
- Imports (internal): src/components/ui/button.tsx, src/components/ui/input.tsx
- Imports (packages): react, sonner
- Imported by: src/app/landing/page.tsx
- Depends on groups: src/components / ui
- Used by groups: src/app / root routes
- Route owners: src/app/landing/page.tsx
- Routes related (direct): src/app/landing/page.tsx
- Exports: ContactForm
- Symbol details: function ContactForm (exported)
- Defines: ContactForm, handleSubmit, form, data, res, body
- Contents summary: contains `use client`; exports: ContactForm; internal imports: 2; package imports: 2

## `src/components/landing/credibility.tsx`
- Status: modified
- System: web
- Group: src/components / landing
- Ownership: landing page UI components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 131
- Bytes: 5461
- Imports (packages): lucide-react
- Imported by: src/app/landing/page.tsx
- Used by groups: src/app / root routes
- Route owners: src/app/landing/page.tsx
- Routes related (direct): src/app/landing/page.tsx
- Exports: LandingCredibility
- Symbol details: function LandingCredibility (exported), const TRUST_NAMES, const RESULT_CARDS, const DIFFERENTIATORS
- Defines: LandingCredibility, TRUST_NAMES, RESULT_CARDS, DIFFERENTIATORS
- Contents summary: exports: LandingCredibility; package imports: 1

## `src/components/landing/faq.tsx`
- Status: modified
- System: web
- Group: src/components / landing
- Ownership: landing page UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 61
- Bytes: 2350
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
- Lines: 39
- Bytes: 1777
- Imports (packages): next/image
- Imported by: src/app/landing/page.tsx
- Used by groups: src/app / root routes
- Route owners: src/app/landing/page.tsx
- Routes related (direct): src/app/landing/page.tsx
- Exports: LandingFeatures
- Symbol details: function LandingFeatures (exported)
- Defines: LandingFeatures
- Contents summary: exports: LandingFeatures; package imports: 1

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
- Lines: 52
- Bytes: 2761
- Imported by: src/app/landing/page.tsx
- Used by groups: src/app / root routes
- Route owners: src/app/landing/page.tsx
- Routes related (direct): src/app/landing/page.tsx
- Exports: LandingHero
- Symbol details: function LandingHero (exported), const PROOF_PILLS
- Defines: LandingHero, PROOF_PILLS
- Contents summary: exports: LandingHero

## `src/components/landing/how-it-works.tsx`
- Status: modified
- System: web
- Group: src/components / landing
- Ownership: landing page UI components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 49
- Bytes: 1762
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

## `src/components/landing/phone-shell.tsx`
- Status: untracked
- System: web
- Group: src/components / landing
- Ownership: landing page UI components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 35
- Bytes: 1492
- Imports (internal): src/lib/utils.ts
- Imports (packages): react
- Imported by: src/app/landing/page.tsx
- Depends on groups: src/lib
- Used by groups: src/app / root routes
- Route owners: src/app/landing/page.tsx
- Routes related (direct): src/app/landing/page.tsx
- Exports: LandingPhoneShell
- Symbol details: function LandingPhoneShell (exported), interface LandingPhoneShellProps
- Defines: LandingPhoneShell, LandingPhoneShellProps
- Contents summary: exports: LandingPhoneShell; internal imports: 1; package imports: 1

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
