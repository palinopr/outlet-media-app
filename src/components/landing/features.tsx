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
