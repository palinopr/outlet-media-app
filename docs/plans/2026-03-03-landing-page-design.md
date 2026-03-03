# Landing Page Design

Date: 2026-03-03

## Goal

Public marketing landing page for Outlet Media. Serves prospective clients (music promoters), existing clients, and the general public as the brand's front door.

## Routing

- New route: `src/app/landing/page.tsx`
- Root `page.tsx` updated: unauthenticated visitors redirect to `/landing` instead of `/sign-in`
- Authenticated users continue to redirect to admin/client portal as today
- Landing page has no auth dependencies

## Page Sections

### 1. Navigation Bar
- Outlet Media wordmark (left)
- Anchor links: Features, How It Works, Contact (smooth-scroll)
- "Log In" button (right, secondary style) -> `/sign-in`
- Sticky on scroll with glass-card backdrop blur

### 2. Hero
- Headline (placeholder: "Your Ads, On Autopilot")
- Subtext: AI-managed Meta campaigns for music promoters
- Primary CTA: "Book a Demo" (scrolls to contact section)
- Secondary: "Log In" link
- Gradient accent animation (reuse existing `gradient-slide` keyframes)

### 3. Features (4 cards)
- AI-Powered Campaign Management
- Real-Time ROAS Tracking
- Ticketmaster Data Integration
- Automated Audience Optimization
- Glass-card styling, lucide-react icons

### 4. How It Works (3 steps)
1. Connect your ad account
2. We set up and optimize your campaigns
3. Track performance in your dashboard
- Numbered steps with connecting visual (line or dots)

### 5. Social Proof / Stats
- Placeholder metrics: campaigns managed, average ROAS, events tracked
- Swappable with real numbers later

### 6. Contact Form
- Fields: name, email, message
- Submit -> `POST /api/contact`
- Toast on success (sonner, already installed)
- Separate `"use client"` component

### 7. Footer
- Links: Privacy Policy (`/privacy`), Terms of Service (`/terms`)
- Copyright line
- support@outletmedia.co

## Visual Style

- Dark theme matching existing client dashboard
- Glass-card effects (`.glass-card` already in globals.css)
- Gradient accents (cyan-to-violet, existing keyframes)
- Geist Sans / Geist Mono fonts
- Lucide icons

## Contact Form Backend

### API Route: `POST /api/contact`

Request body:
```json
{
  "name": "string",
  "email": "string",
  "message": "string"
}
```

Two actions on submit:
1. Insert into Supabase `contact_submissions` table
2. Send notification email to support@outletmedia.co via Resend

### Supabase Table: `contact_submissions`

| Column     | Type        | Notes                    |
|------------|-------------|--------------------------|
| id         | uuid        | PK, gen_random_uuid()    |
| name       | text        | required                 |
| email      | text        | required                 |
| message    | text        | required                 |
| created_at | timestamptz | default now()            |

### Email Service: Resend

- Package: `resend`
- API key in env: `RESEND_API_KEY`
- From address: onboarding@resend.dev (or custom domain later)
- To: support@outletmedia.co
- Simple text email with submission details

## SEO

- This page: `robots: { index: true, follow: true }` (overrides site-wide noindex)
- OpenGraph title/description specific to landing page
- metadataBase already set in root layout

## File Structure

```
src/app/landing/
  page.tsx          -- server component, page layout + sections
src/components/landing/
  nav.tsx           -- sticky navigation bar
  hero.tsx          -- hero section
  features.tsx      -- feature cards grid
  how-it-works.tsx  -- 3-step process
  stats.tsx         -- social proof numbers
  contact-form.tsx  -- "use client" form component
  footer.tsx        -- footer links
src/app/api/contact/
  route.ts          -- POST handler (Supabase + Resend)
```

## Dependencies

- `resend` -- npm package for email sending
- Everything else already in the project (tailwind, shadcn, lucide, sonnet, supabase)

## Out of Scope

- Logo/brand assets (wordmark is text-only for now)
- Animations beyond existing gradient keyframes
- Mobile app download links
- Blog or content pages
- Pricing section (no self-serve pricing model yet)
