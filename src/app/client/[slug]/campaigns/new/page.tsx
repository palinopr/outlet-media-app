"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useWizard } from "./use-wizard";
import {
  StepBasics,
  StepAudience,
  StepPlacements,
  StepCreative,
  StepReview,
} from "./wizard-steps";

const STEP_LABELS = ["Basics", "Audience", "Placements", "Creative", "Review"];

export default function NewCampaignPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { step, data, update, next, prev } = useWizard();
  const [submitting, setSubmitting] = useState(false);
  const [adAccountId, setAdAccountId] = useState<string>("");

  useEffect(() => {
    fetch(`/api/meta/connect/accounts?slug=${slug}`)
      .then((res) => res.json())
      .then((accounts: Array<{ ad_account_id: string }>) => {
        if (accounts.length > 0) {
          setAdAccountId(accounts[0].ad_account_id);
        }
      })
      .catch(() => {});
  }, [slug]);

  async function handleSubmit() {
    if (!adAccountId) {
      toast.error("No ad account connected. Go to Settings to connect one.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/meta/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ad_account_id: adAccountId,
          client_slug: slug,
          name: data.name,
          objective: data.objective,
          daily_budget: Math.round(data.daily_budget * 100),
          targeting: {
            geo_locations: { countries: data.countries },
            age_min: data.age_min,
            age_max: data.age_max,
            genders: data.genders.length > 0 ? data.genders : undefined,
            flexible_spec:
              data.interests.length > 0
                ? [{ interests: data.interests }]
                : undefined,
          },
          placements: data.auto_placements
            ? undefined
            : {
                publisher_platforms: data.publisher_platforms,
                facebook_positions: data.facebook_positions,
                instagram_positions: data.instagram_positions,
              },
          creative: {
            primary_text: data.primary_text,
            headline: data.headline || undefined,
            description: data.description || undefined,
            call_to_action: data.call_to_action,
            image_hash: data.image_hash || undefined,
            video_id: data.video_id || undefined,
            link_url: data.link_url || undefined,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          (err as { error?: string }).error ?? "Creation failed"
        );
      }

      toast.success("Campaign created");
      router.push(`/client/${slug}/campaigns`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create campaign"
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex gap-1">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex-1">
            <div
              className={`h-1 rounded-full ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
            <p
              className={`text-xs mt-1 ${
                i === step ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      {step === 0 && <StepBasics data={data} update={update} />}
      {step === 1 && <StepAudience data={data} update={update} />}
      {step === 2 && <StepPlacements data={data} update={update} />}
      {step === 3 && <StepCreative data={data} update={update} />}
      {step === 4 && <StepReview data={data} submitting={submitting} />}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prev} disabled={step === 0}>
          Back
        </Button>
        {step < 4 ? (
          <Button onClick={next}>Continue</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Creating..." : "Create Campaign"}
          </Button>
        )}
      </div>
    </div>
  );
}
