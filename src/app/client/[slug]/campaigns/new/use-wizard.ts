"use client";

import { useState, useCallback } from "react";

export interface WizardData {
  name: string;
  objective: string;
  daily_budget: number;
  countries: string[];
  age_min: number;
  age_max: number;
  genders: number[];
  interests: Array<{ id: string; name: string }>;
  auto_placements: boolean;
  publisher_platforms: string[];
  facebook_positions: string[];
  instagram_positions: string[];
  primary_text: string;
  headline: string;
  description: string;
  call_to_action: string;
  image_hash: string;
  video_id: string;
  link_url: string;
}

const INITIAL: WizardData = {
  name: "",
  objective: "OUTCOME_TRAFFIC",
  daily_budget: 10,
  countries: ["US"],
  age_min: 18,
  age_max: 65,
  genders: [],
  interests: [],
  auto_placements: true,
  publisher_platforms: ["facebook", "instagram"],
  facebook_positions: ["feed"],
  instagram_positions: ["stream", "story", "reels"],
  primary_text: "",
  headline: "",
  description: "",
  call_to_action: "LEARN_MORE",
  image_hash: "",
  video_id: "",
  link_url: "",
};

export function useWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(INITIAL);

  const update = useCallback(
    (partial: Partial<WizardData>) =>
      setData((prev) => ({ ...prev, ...partial })),
    []
  );

  const next = useCallback(() => setStep((s) => Math.min(s + 1, 4)), []);
  const prev = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  return { step, data, update, next, prev, setStep };
}
