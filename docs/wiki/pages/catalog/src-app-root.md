# src/app / root routes

Generated from the current working tree on 2026-04-10 21:27:09.

- Files: 18
- File kinds: Next.js page (8), binary asset (3), React/TSX module (2), test file (2), Markdown doc (1), file (.css) (1), Next.js layout (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/app/AGENTS.md`
- Status: tracked-clean
- System: web
- Group: src/app / root routes
- Ownership: web root/shared route surface
- Type: Markdown doc
- Construction: markdown document
- Route context: /
- Lines: 8
- Bytes: 663
- Headings: App Routes
- Contents summary: headings: App Routes

## `src/app/apple-icon.png`
- Status: tracked-clean
- System: web
- Group: src/app / root routes
- Ownership: web root/shared route surface
- Type: binary asset
- Construction: asset file
- Bytes: 20555
- Contents summary: asset/binary file; size: 20555 bytes

## `src/app/connect-error/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / root routes
- Ownership: web root/shared route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /connect-error
- Lines: 105
- Bytes: 4082
- Imports (packages): next/link, lucide-react
- Exports: ConnectErrorPage, default
- Symbol details: default function ConnectErrorPage (exported), interface Props
- Defines: ConnectErrorPage, key, copy, detail, Props
- Contents summary: Next.js page for `/connect-error`; exports: ConnectErrorPage, default; package imports: 2

## `src/app/deletion-status/[code]/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / root routes
- Ownership: web root/shared route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /deletion-status/[code]
- Lines: 28
- Bytes: 894
- Exports: DeletionStatusPage, metadata, default
- Symbol details: default function DeletionStatusPage (exported), const metadata (exported)
- Defines: DeletionStatusPage, metadata
- Contents summary: Next.js page for `/deletion-status/[code]`; exports: DeletionStatusPage, metadata, default

## `src/app/favicon.ico`
- Status: tracked-clean
- System: web
- Group: src/app / root routes
- Ownership: web root/shared route surface
- Type: binary asset
- Construction: asset file
- Bytes: 25931
- Contents summary: asset/binary file; size: 25931 bytes

## `src/app/global-error.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / root routes
- Ownership: web root/shared route surface
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Route context: /
- Lines: 40
- Bytes: 1240
- Imports (packages): react
- Exports: GlobalError, default
- Symbol details: default function GlobalError (exported)
- Defines: GlobalError
- Contents summary: contains `use client`; exports: GlobalError, default; package imports: 1

## `src/app/globals.css`
- Status: tracked-clean
- System: web
- Group: src/app / root routes
- Ownership: web root/shared route surface
- Type: file (.css)
- Route context: /
- Lines: 226
- Bytes: 5813
- Imported by: src/app/layout.tsx
- Used by groups: src/app / root routes
- Route owners: src/app/layout.tsx
- Routes related (direct): src/app/layout.tsx
- Contents summary: text lines: @import "tailwindcss"; \| @import "tw-animate-css"; \| @import "shadcn/tailwind.css"; \| @custom-variant dark (&:is(.dark *)); \| @theme inline { \| --color-background: var(--background);

## `src/app/icon.png`
- Status: tracked-clean
- System: web
- Group: src/app / root routes
- Ownership: web root/shared route surface
- Type: binary asset
- Construction: asset file
- Bytes: 64202
- Contents summary: asset/binary file; size: 64202 bytes

## `src/app/landing/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / root routes
- Ownership: web root/shared route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /landing
- Lines: 67
- Bytes: 4107
- Imports (internal): src/components/landing/hero.tsx, src/components/landing/credibility.tsx, src/components/landing/features.tsx, src/components/landing/how-it-works.tsx, src/components/landing/faq.tsx, src/components/landing/contact-form.tsx
- Imports (packages): next, next/font/google, lucide-react
- Depends on groups: src/components / landing
- Exports: LandingPage, metadata, default
- Symbol details: default function LandingPage (exported), const landingFont
- Defines: LandingPage, landingFont
- Contents summary: Next.js page for `/landing`; exports: LandingPage, metadata, default; internal imports: 6; package imports: 3

## `src/app/layout.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / root routes
- Ownership: web root/shared route surface
- Type: Next.js layout
- Construction: App Router layout, component/UI-oriented module
- Route: /
- Lines: 63
- Bytes: 1551
- Imports (internal): src/app/globals.css
- Imports (packages): next, next/font/google, @clerk/nextjs, sonner
- Depends on groups: src/app / root routes
- Exports: RootLayout, metadata, default
- Symbol details: default function RootLayout (exported), const geistSans, const geistMono
- Defines: RootLayout, geistSans, geistMono, publishableKey, content
- Contents summary: Next.js layout for `/`; exports: RootLayout, metadata, default; internal imports: 1; package imports: 4

## `src/app/not-found.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / root routes
- Ownership: web root/shared route surface
- Type: React/TSX module
- Construction: component/UI-oriented module
- Route context: /
- Lines: 24
- Bytes: 934
- Imports (packages): next/link
- Exports: NotFound, default
- Symbol details: default function NotFound (exported)
- Defines: NotFound
- Contents summary: exports: NotFound, default; package imports: 1

## `src/app/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / root routes
- Ownership: web root/shared route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /
- Lines: 47
- Bytes: 1147
- Imports (internal): src/features/client-portal/entry.ts
- Imports (packages): @clerk/nextjs/server, next/navigation
- Depends on groups: src/features / client-portal
- Exports: RootPage, default
- Symbol details: default function RootPage (exported), interface RootPageProps
- Defines: RootPage, clerkEnabled, meta, params, entry, RootPageProps
- Contents summary: Next.js page for `/`; exports: RootPage, default; internal imports: 1; package imports: 2

## `src/app/privacy/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / root routes
- Ownership: web root/shared route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /privacy
- Lines: 69
- Bytes: 3647
- Exports: PrivacyPage, metadata, default
- Symbol details: default function PrivacyPage (exported), const metadata (exported)
- Defines: PrivacyPage, metadata
- Contents summary: Next.js page for `/privacy`; exports: PrivacyPage, metadata, default

## `src/app/shell-import-smoke.test.ts`
- Status: tracked-clean
- System: web
- Group: src/app / root routes
- Ownership: web root/shared route surface
- Type: test file
- Construction: test specification
- Route context: /
- Lines: 26
- Bytes: 1643
- Imports (internal): src/app/admin/dashboard/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/reports/page.tsx, src/app/admin/events/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/agents/page.tsx, src/app/admin/dashboard/data.ts, src/app/admin/campaigns/data.ts, … (+9 more)
- Imports (packages): vitest
- Depends on groups: src/app / admin, src/app / client
- Tests / describe labels: shell import smoke, imports the active admin and client surfaces plus shared data modules
- Contents summary: tests/describes: shell import smoke; imports the active admin and client surfaces plus shared data modules; internal imports: 19; package imports: 1

## `src/app/sign-in/[[...sign-in]]/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / root routes
- Ownership: web root/shared route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /sign-in/[[...sign-in]]
- Lines: 27
- Bytes: 767
- Imports (packages): @clerk/nextjs
- Exports: SignInPage, dynamic, default
- Symbol details: default function SignInPage (exported), const dynamic (exported), interface SignInPageProps
- Defines: SignInPage, dynamic, params, inviteId, forceRedirectUrl, SignInPageProps
- Contents summary: Next.js page for `/sign-in/[[...sign-in]]`; exports: SignInPage, dynamic, default; package imports: 1

## `src/app/sign-up/[[...sign-up]]/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / root routes
- Ownership: web root/shared route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /sign-up/[[...sign-up]]
- Lines: 27
- Bytes: 707
- Imports (packages): @clerk/nextjs
- Imported by: src/app/sign-up/invite-flow.test.tsx
- Used by groups: src/app / root routes
- Tests related: src/app/sign-up/invite-flow.test.tsx
- Tests related (direct): src/app/sign-up/invite-flow.test.tsx
- Exports: SignUpPage, dynamic, default
- Symbol details: default function SignUpPage (exported), const dynamic (exported), interface SignUpPageProps
- Defines: SignUpPage, dynamic, params, inviteId, forceRedirectUrl, SignUpPageProps
- Contents summary: Next.js page for `/sign-up/[[...sign-up]]`; exports: SignUpPage, dynamic, default; package imports: 1

## `src/app/sign-up/invite-flow.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / root routes
- Ownership: web root/shared route surface
- Type: test file
- Construction: test specification
- Route context: /sign-up
- Lines: 29
- Bytes: 875
- Imports (internal): src/app/sign-up/[[...sign-up]]/page.tsx
- Imports (packages): vitest, @testing-library/react, @clerk/nextjs
- Depends on groups: src/app / root routes
- Symbol details: const signUpMock
- Defines: signUpMock, element
- Tests / describe labels: SignUp invite flow, preserves invite_id in the post-signup redirect
- Contents summary: tests/describes: SignUp invite flow; preserves invite_id in the post-signup redirect; internal imports: 1; package imports: 3

## `src/app/terms/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / root routes
- Ownership: web root/shared route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /terms
- Lines: 45
- Bytes: 2465
- Exports: TermsPage, metadata, default
- Symbol details: default function TermsPage (exported), const metadata (exported)
- Defines: TermsPage, metadata
- Contents summary: Next.js page for `/terms`; exports: TermsPage, metadata, default
