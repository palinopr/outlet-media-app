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
