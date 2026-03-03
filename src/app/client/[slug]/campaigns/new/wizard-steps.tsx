"use client";

import { Input } from "@/components/ui/input";
import type { WizardData } from "./use-wizard";

const OBJECTIVES = [
  { value: "OUTCOME_AWARENESS", label: "Awareness" },
  { value: "OUTCOME_TRAFFIC", label: "Traffic" },
  { value: "OUTCOME_ENGAGEMENT", label: "Engagement" },
  { value: "OUTCOME_SALES", label: "Sales" },
];

const CTA_OPTIONS = [
  "LEARN_MORE",
  "SHOP_NOW",
  "SIGN_UP",
  "BOOK_TRAVEL",
  "CONTACT_US",
  "GET_OFFER",
  "LISTEN_NOW",
  "BUY_TICKETS",
];

interface StepProps {
  data: WizardData;
  update: (partial: Partial<WizardData>) => void;
}

export function StepBasics({ data, update }: StepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Campaign Basics</h2>
      <div className="space-y-2">
        <label className="text-sm font-medium">Campaign Name</label>
        <Input
          value={data.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="e.g. Summer Concert Promo"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Objective</label>
        <div className="grid grid-cols-2 gap-2">
          {OBJECTIVES.map((obj) => (
            <button
              key={obj.value}
              onClick={() => update({ objective: obj.value })}
              className={`glass-card p-3 text-left transition-colors ${
                data.objective === obj.value
                  ? "border-primary bg-primary/10"
                  : "hover:border-primary/50"
              }`}
            >
              {obj.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Daily Budget (USD)</label>
        <Input
          type="number"
          min={1}
          step={1}
          value={data.daily_budget}
          onChange={(e) => update({ daily_budget: Number(e.target.value) })}
        />
      </div>
    </div>
  );
}

export function StepAudience({ data, update }: StepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Audience Targeting</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Min Age</label>
          <Input
            type="number"
            min={18}
            max={65}
            value={data.age_min}
            onChange={(e) => update({ age_min: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Max Age</label>
          <Input
            type="number"
            min={18}
            max={65}
            value={data.age_max}
            onChange={(e) => update({ age_max: Number(e.target.value) })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Gender</label>
        <div className="flex gap-2">
          {[
            { value: 0, label: "All" },
            { value: 1, label: "Male" },
            { value: 2, label: "Female" },
          ].map((g) => (
            <button
              key={g.value}
              onClick={() =>
                update({ genders: g.value === 0 ? [] : [g.value] })
              }
              className={`glass-card px-4 py-2 transition-colors ${
                (g.value === 0 && data.genders.length === 0) ||
                data.genders.includes(g.value)
                  ? "border-primary bg-primary/10"
                  : "hover:border-primary/50"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Countries</label>
        <Input
          value={data.countries.join(", ")}
          onChange={(e) =>
            update({
              countries: e.target.value
                .split(",")
                .map((s) => s.trim().toUpperCase())
                .filter(Boolean),
            })
          }
          placeholder="US, CA, MX"
        />
        <p className="text-xs text-muted-foreground">
          Comma-separated ISO country codes
        </p>
      </div>
    </div>
  );
}

export function StepPlacements({ data, update }: StepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Placements</h2>
      <div className="space-y-3">
        <button
          onClick={() => update({ auto_placements: true })}
          className={`glass-card p-4 w-full text-left transition-colors ${
            data.auto_placements
              ? "border-primary bg-primary/10"
              : "hover:border-primary/50"
          }`}
        >
          <p className="font-medium">Automatic Placements</p>
          <p className="text-sm text-muted-foreground">
            Let Meta optimize where your ads appear
          </p>
        </button>
        <button
          onClick={() => update({ auto_placements: false })}
          className={`glass-card p-4 w-full text-left transition-colors ${
            !data.auto_placements
              ? "border-primary bg-primary/10"
              : "hover:border-primary/50"
          }`}
        >
          <p className="font-medium">Manual Placements</p>
          <p className="text-sm text-muted-foreground">
            Choose specific platforms and positions
          </p>
        </button>
      </div>
      {!data.auto_placements && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Facebook Positions</label>
            {["feed", "right_hand_column", "marketplace"].map((pos) => (
              <label key={pos} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={data.facebook_positions.includes(pos)}
                  onChange={(e) => {
                    const positions = e.target.checked
                      ? [...data.facebook_positions, pos]
                      : data.facebook_positions.filter((p) => p !== pos);
                    update({ facebook_positions: positions });
                  }}
                />
                {pos.replace(/_/g, " ")}
              </label>
            ))}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Instagram Positions</label>
            {["stream", "story", "reels", "explore"].map((pos) => (
              <label key={pos} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={data.instagram_positions.includes(pos)}
                  onChange={(e) => {
                    const positions = e.target.checked
                      ? [...data.instagram_positions, pos]
                      : data.instagram_positions.filter((p) => p !== pos);
                    update({ instagram_positions: positions });
                  }}
                />
                {pos}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function StepCreative({ data, update }: StepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Ad Creative</h2>
      <div className="space-y-2">
        <label className="text-sm font-medium">Primary Text</label>
        <textarea
          className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px]"
          value={data.primary_text}
          onChange={(e) => update({ primary_text: e.target.value })}
          placeholder="The main text of your ad..."
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Headline</label>
        <Input
          value={data.headline}
          onChange={(e) => update({ headline: e.target.value })}
          placeholder="Short attention-grabbing headline"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input
          value={data.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="Additional description text"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Link URL</label>
        <Input
          type="url"
          value={data.link_url}
          onChange={(e) => update({ link_url: e.target.value })}
          placeholder="https://example.com/landing-page"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Call to Action</label>
        <div className="flex flex-wrap gap-2">
          {CTA_OPTIONS.map((cta) => (
            <button
              key={cta}
              onClick={() => update({ call_to_action: cta })}
              className={`glass-card px-3 py-1.5 text-sm transition-colors ${
                data.call_to_action === cta
                  ? "border-primary bg-primary/10"
                  : "hover:border-primary/50"
              }`}
            >
              {cta.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StepReview({
  data,
  submitting,
}: {
  data: WizardData;
  submitting: boolean;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Review Campaign</h2>
      <div className="glass-card p-4 space-y-3">
        <Row label="Name" value={data.name} />
        <Row
          label="Objective"
          value={data.objective.replace("OUTCOME_", "")}
        />
        <Row label="Daily Budget" value={`$${data.daily_budget}`} />
        <Row label="Age" value={`${data.age_min} - ${data.age_max}`} />
        <Row label="Countries" value={data.countries.join(", ")} />
        <Row
          label="Placements"
          value={data.auto_placements ? "Automatic" : "Manual"}
        />
        <Row label="CTA" value={data.call_to_action.replace(/_/g, " ")} />
      </div>
      <div className="glass-card p-4">
        <p className="text-sm font-medium mb-2">Ad Preview</p>
        <p className="text-sm">{data.primary_text}</p>
        {data.headline && (
          <p className="font-semibold mt-1">{data.headline}</p>
        )}
        {data.description && (
          <p className="text-sm text-muted-foreground">{data.description}</p>
        )}
      </div>
      {submitting && (
        <p className="text-sm text-muted-foreground">Creating campaign...</p>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
