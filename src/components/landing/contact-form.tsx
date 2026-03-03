"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
    <section id="contact" className="mx-auto max-w-xl px-6 py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="section-label text-center">Contact</p>
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Book a Demo
        </h2>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Tell us about your events and we&apos;ll show you what Outlet Media can do.
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
      </motion.div>
    </section>
  );
}
