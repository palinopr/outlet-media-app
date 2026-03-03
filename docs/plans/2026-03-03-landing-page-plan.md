# Landing Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a public marketing landing page at `/landing` with hero, features, how-it-works, stats, contact form (Supabase + Resend), and footer.

**Architecture:** Server component page at `src/app/landing/page.tsx` composes section components. Contact form is the only `"use client"` component. Contact submissions go to a new API route that writes to Supabase and sends a notification email via Resend. Root page redirects unauthenticated visitors to `/landing`.

**Tech Stack:** Next.js 15 App Router, Tailwind v4, shadcn/ui (Button, Input), lucide-react, Resend, Supabase, Zod, sonner (toasts).

---

### Task 1: Install Resend and add env vars

**Files:**
- Modify: `package.json`
- Modify: `.env.example` (add `RESEND_API_KEY`)

**Step 1: Install resend**

Run: `npm install resend`

**Step 2: Add env var to .env.example**

Add to `.env.example`:
```
RESEND_API_KEY=re_xxxxxxxxxxxx
```

**Step 3: Commit**

```bash
git add package.json package-lock.json .env.example
git commit -m "chore: add resend dependency for contact form emails"
```

---

### Task 2: Create Supabase `contact_submissions` table

**Files:**
- None (Supabase dashboard or SQL)

**Step 1: Run migration SQL**

Execute in Supabase SQL editor:
```sql
CREATE TABLE contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
-- Service role key bypasses RLS, no policies needed for server-only access.
```

**Step 2: Verify table exists**

Run in SQL editor: `SELECT * FROM contact_submissions LIMIT 1;`
Expected: empty result set, no error.

---

### Task 3: Contact form Zod schema

**Files:**
- Modify: `src/lib/api-schemas.ts`
- Test: `tests/lib/api-schemas.test.ts`

**Step 1: Write the failing test**

Create `tests/lib/api-schemas.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { ContactFormSchema } from "@/lib/api-schemas";

describe("ContactFormSchema", () => {
  it("accepts valid submission", () => {
    const result = ContactFormSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "I'd like a demo.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing email", () => {
    const result = ContactFormSchema.safeParse({
      name: "Jane",
      message: "Hello",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = ContactFormSchema.safeParse({
      name: "Jane",
      email: "not-an-email",
      message: "Hello",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = ContactFormSchema.safeParse({
      name: "",
      email: "jane@example.com",
      message: "Hello",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty message", () => {
    const result = ContactFormSchema.safeParse({
      name: "Jane",
      email: "jane@example.com",
      message: "",
    });
    expect(result.success).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/lib/api-schemas.test.ts`
Expected: FAIL -- `ContactFormSchema` is not exported.

**Step 3: Add schema to api-schemas.ts**

Add at the end of `src/lib/api-schemas.ts`:

```typescript
// ─── Contact form ────────────────────────────────────────────────────────────

export const ContactFormSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  message: z.string().min(1).max(5000),
});
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run tests/lib/api-schemas.test.ts`
Expected: 5 tests PASS.

**Step 5: Commit**

```bash
git add src/lib/api-schemas.ts tests/lib/api-schemas.test.ts
git commit -m "feat: add ContactFormSchema with validation tests"
```

---

### Task 4: Contact API route

**Files:**
- Create: `src/app/api/contact/route.ts`

**Step 1: Create the API route**

Create `src/app/api/contact/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";
import { ContactFormSchema } from "@/lib/api-schemas";
import { apiError, parseJsonBody } from "@/lib/api-helpers";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: Request) {
  const raw = await parseJsonBody<unknown>(request);
  if (raw instanceof Response) return raw;

  const parsed = ContactFormSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { name, email, message } = parsed.data;

  // 1. Store in Supabase
  if (supabaseAdmin) {
    const { error } = await supabaseAdmin
      .from("contact_submissions")
      .insert({ name, email, message });

    if (error) {
      console.error("contact insert error:", error);
      return apiError("Failed to save submission", 500);
    }
  }

  // 2. Send notification email via Resend
  if (resend) {
    try {
      await resend.emails.send({
        from: "Outlet Media <onboarding@resend.dev>",
        to: "support@outletmedia.co",
        subject: `New contact form: ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Message:`,
          message,
        ].join("\n"),
      });
    } catch (err) {
      // Log but don't fail the request -- the submission is already saved
      console.error("resend email error:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
```

**Step 2: Add `/api/contact` to public routes in proxy.ts**

In `src/proxy.ts`, add `"/api/contact(.*)"` to the `isPublicRoute` matcher array so the endpoint doesn't require auth.

**Step 3: Verify build**

Run: `npx next build`
Expected: builds without errors.

**Step 4: Commit**

```bash
git add src/app/api/contact/route.ts src/proxy.ts
git commit -m "feat: add POST /api/contact route (Supabase + Resend)"
```

---

### Task 5: Landing page navigation component

**Files:**
- Create: `src/components/landing/nav.tsx`

**Step 1: Create nav component**

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Contact", href: "#contact" },
] as const;

export function LandingNav() {
  return (
    <nav className="sticky top-0 z-50 glass-card rounded-none border-x-0 border-t-0">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/landing" className="text-lg font-bold tracking-tight">
          Outlet Media
        </Link>
        <div className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              {link.label}
            </a>
          ))}
          <Button variant="outline" size="sm" asChild>
            <Link href="/sign-in">Log In</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/landing/nav.tsx
git commit -m "feat: add landing page navigation component"
```

---

### Task 6: Hero section component

**Files:**
- Create: `src/components/landing/hero.tsx`

**Step 1: Create hero component**

```tsx
import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      {/* Gradient accent line */}
      <div className="gradient-bar mb-12 h-1 w-24" />
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
        Your Ads, On Autopilot
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted-foreground">
        AI-managed Meta campaigns built for music promoters. We handle the
        targeting, budgets, and optimization so you can focus on the show.
      </p>
      <div className="mt-10 flex gap-4">
        <Button size="lg" asChild>
          <a href="#contact">Book a Demo</a>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <a href="/sign-in">Log In</a>
        </Button>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/landing/hero.tsx
git commit -m "feat: add landing page hero section"
```

---

### Task 7: Features section component

**Files:**
- Create: `src/components/landing/features.tsx`

**Step 1: Create features component**

```tsx
import { Bot, LineChart, Ticket, Users } from "lucide-react";

const FEATURES = [
  {
    icon: Bot,
    title: "AI-Powered Campaigns",
    description:
      "Our agents create, optimize, and manage your Meta ad campaigns around the clock.",
  },
  {
    icon: LineChart,
    title: "Real-Time ROAS Tracking",
    description:
      "See exactly how every dollar performs with live return-on-ad-spend dashboards.",
  },
  {
    icon: Ticket,
    title: "Ticketmaster Integration",
    description:
      "Connect event data directly so campaigns adapt to ticket velocity and demand.",
  },
  {
    icon: Users,
    title: "Audience Optimization",
    description:
      "Automated targeting refinement based on demographics, interests, and performance.",
  },
] as const;

export function LandingFeatures() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <p className="section-label text-center">Features</p>
      <h2 className="mt-2 text-center text-3xl font-bold tracking-tight">
        Everything you need to sell out shows
      </h2>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="glass-card p-6">
            <f.icon className="size-8 text-cyan-400" />
            <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/landing/features.tsx
git commit -m "feat: add landing page features section"
```

---

### Task 8: How It Works section component

**Files:**
- Create: `src/components/landing/how-it-works.tsx`

**Step 1: Create how-it-works component**

```tsx
const STEPS = [
  {
    number: "01",
    title: "Connect Your Ad Account",
    description:
      "Link your Meta ad account in a few clicks. We handle the permissions and setup.",
  },
  {
    number: "02",
    title: "We Build & Optimize",
    description:
      "Our AI agents create campaigns, set budgets, and continuously optimize targeting.",
  },
  {
    number: "03",
    title: "Track Your Results",
    description:
      "Monitor ROAS, ticket sales, and audience insights from your personal dashboard.",
  },
] as const;

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-4xl px-6 py-24">
      <p className="section-label text-center">How It Works</p>
      <h2 className="mt-2 text-center text-3xl font-bold tracking-tight">
        Three steps to better ads
      </h2>
      <div className="mt-14 space-y-10">
        {STEPS.map((step) => (
          <div key={step.number} className="flex gap-6">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-lg font-bold text-cyan-400">
              {step.number}
            </span>
            <div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/landing/how-it-works.tsx
git commit -m "feat: add landing page how-it-works section"
```

---

### Task 9: Stats section component

**Files:**
- Create: `src/components/landing/stats.tsx`

**Step 1: Create stats component**

```tsx
const STATS = [
  { value: "50+", label: "Campaigns Managed" },
  { value: "4.2x", label: "Average ROAS" },
  { value: "30+", label: "Events Tracked" },
] as const;

export function LandingStats() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <div className="glass-card hero-stat-card grid gap-8 p-10 sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/landing/stats.tsx
git commit -m "feat: add landing page stats section"
```

---

### Task 10: Contact form component

**Files:**
- Create: `src/components/landing/contact-form.tsx`

**Step 1: Create the client component**

```tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export function ContactForm() {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong");
      }

      toast.success("Message sent! We'll be in touch soon.");
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-xl px-6 py-24">
      <p className="section-label text-center">Contact</p>
      <h2 className="mt-2 text-center text-3xl font-bold tracking-tight">
        Book a Demo
      </h2>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Tell us about your events and we'll show you what Outlet Media can do.
      </p>
      <form onSubmit={handleSubmit} className="mt-10 space-y-4">
        <Input name="name" placeholder="Your name" required maxLength={200} />
        <Input
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          maxLength={320}
        />
        <textarea
          name="message"
          placeholder="Tell us about your upcoming events..."
          required
          maxLength={5000}
          rows={4}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30 dark:border-input"
        />
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          <Send className="size-4" />
          {pending ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/landing/contact-form.tsx
git commit -m "feat: add landing page contact form component"
```

---

### Task 11: Footer component

**Files:**
- Create: `src/components/landing/footer.tsx`

**Step 1: Create footer component**

```tsx
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-border/40 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Outlet Media. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms of Service
          </Link>
          <a href="mailto:support@outletmedia.co" className="hover:text-foreground">
            support@outletmedia.co
          </a>
        </div>
      </div>
    </footer>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/landing/footer.tsx
git commit -m "feat: add landing page footer component"
```

---

### Task 12: Assemble landing page

**Files:**
- Create: `src/app/landing/page.tsx`

**Step 1: Create the page**

```tsx
import type { Metadata } from "next";
import { LandingNav } from "@/components/landing/nav";
import { LandingHero } from "@/components/landing/hero";
import { LandingFeatures } from "@/components/landing/features";
import { LandingHowItWorks } from "@/components/landing/how-it-works";
import { LandingStats } from "@/components/landing/stats";
import { ContactForm } from "@/components/landing/contact-form";
import { LandingFooter } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Outlet Media -- AI-Powered Ads for Music Promoters",
  description:
    "Autonomous Meta ad campaigns managed by AI agents. Real-time ROAS tracking, Ticketmaster integration, and audience optimization for music promoters.",
  robots: { index: true, follow: true },
};

export default function LandingPage() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <LandingNav />
      <LandingHero />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingStats />
      <ContactForm />
      <LandingFooter />
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/landing/page.tsx
git commit -m "feat: assemble landing page from section components"
```

---

### Task 13: Update root page redirect

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/proxy.ts`

**Step 1: Update root page**

In `src/app/page.tsx`, change the unauthenticated redirect from `/sign-in` to `/landing`:

```typescript
// Before:
  if (!userId) {
    redirect("/sign-in");
  }

// After:
  if (!userId) {
    redirect("/landing");
  }
```

**Step 2: Add `/landing` to public routes**

In `src/proxy.ts`, add `"/landing"` to the `isPublicRoute` matcher:

```typescript
const isPublicRoute = createRouteMatcher([
  "/",
  "/landing",
  "/sign-in(.*)",
  // ... rest unchanged
]);
```

**Step 3: Verify build**

Run: `npx next build`
Expected: builds without errors.

**Step 4: Commit**

```bash
git add src/app/page.tsx src/proxy.ts
git commit -m "feat: redirect unauthenticated visitors to /landing"
```

---

### Task 14: Verify end-to-end

**Step 1: Run type-check**

Run: `npm run type-check`
Expected: no errors.

**Step 2: Run all tests**

Run: `npm test`
Expected: all tests pass.

**Step 3: Run dev server and test manually**

Run: `npm run dev`

Verify:
- Visit `http://localhost:3000` -- should redirect to `/landing`
- All 7 sections render
- Nav links scroll to correct sections
- "Log In" button goes to `/sign-in`
- Contact form submits (check Supabase table for new row)
- Toast appears on successful submit
- Form validates empty fields client-side

**Step 4: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: landing page polish and fixes"
```
