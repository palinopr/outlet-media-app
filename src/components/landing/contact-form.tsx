"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <section id="contact" className="mx-auto max-w-7xl px-6 pb-24 pt-20 sm:pb-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.05] p-6 sm:p-8 lg:p-10"
      >
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
          <div>
            <p className="section-label text-[#9bd0ff]">Contact</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              If the current agency feels slow, generic, or invisible, bring us the next 90 days.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              Tours, nightlife calendars, venue on-sales, artist campaigns, ecommerce pushes, brand
              launches. If the goal is stronger movement and clearer visibility, we&apos;ll show you
              exactly where Outlet can create leverage.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Strategy, creative, and paid media tied to actual revenue goals",
                "Client-facing visibility without the usual agency blackout",
                "AI-backed speed without losing human accountability",
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-1 size-4 shrink-0 text-[#9bd0ff]" />
                  <p className="text-sm leading-6 text-slate-300">{item}</p>
                </div>
              ))}
            </div>

            <a
              href="mailto:support@outletmedia.co"
              className="mt-8 inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white"
            >
              <Mail className="size-4 text-[#9bd0ff]" />
              support@outletmedia.co
            </a>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[28px] border border-white/10 bg-[#081421]/90 p-5 sm:p-7"
          >
            <div className="space-y-4">
              <Input
                name="name"
                placeholder="Your name"
                required
                maxLength={200}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-slate-100 placeholder:text-slate-500"
              />
              <Input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                maxLength={320}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 text-slate-100 placeholder:text-slate-500"
              />
              <textarea
                name="message"
                placeholder="Tell us what you are pushing, what the revenue goal is, who the audience is, and where the current agency or team is falling short."
                required
                maxLength={5000}
                rows={6}
                className="min-h-40 w-full rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-[box-shadow,border-color] focus-visible:border-[#4aa8ff]/50 focus-visible:ring-4 focus-visible:ring-[#4aa8ff]/15"
              />
              <Button
                type="submit"
                size="lg"
                className="h-12 w-full rounded-full bg-[#4aa8ff] text-base font-semibold text-[#06111d] hover:bg-[#72beff]"
                disabled={pending}
              >
                <Send className="size-4" />
                {pending ? "Sending..." : "Request a Strategy Call"}
              </Button>
              <p className="text-xs leading-6 text-slate-400">
                Every inquiry gets read by the team. No generic lead routing. No fake automation. No
                maze.
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
