import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
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
