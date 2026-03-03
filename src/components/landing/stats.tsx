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
