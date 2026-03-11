"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent, type ReactNode } from "react";

interface ConnectedAccountOption {
  ad_account_id: string;
  ad_account_name: string | null;
}

interface Props {
  accounts: ConnectedAccountOption[];
  slug: string;
}

type Objective =
  | "OUTCOME_AWARENESS"
  | "OUTCOME_TRAFFIC"
  | "OUTCOME_ENGAGEMENT"
  | "OUTCOME_SALES";

type GenderChoice = "all" | "men" | "women";

const FEED_ONLY_PLACEMENTS = {
  facebook_positions: ["feed"],
  instagram_positions: ["stream"],
  publisher_platforms: ["facebook", "instagram"],
};

export function CampaignCreateForm({ accounts, slug }: Props) {
  const router = useRouter();
  const [adAccountId, setAdAccountId] = useState(accounts[0]?.ad_account_id ?? "");
  const [name, setName] = useState("");
  const [objective, setObjective] = useState<Objective>("OUTCOME_SALES");
  const [dailyBudgetUsd, setDailyBudgetUsd] = useState("25");
  const [country, setCountry] = useState("US");
  const [ageMin, setAgeMin] = useState("18");
  const [ageMax, setAgeMax] = useState("54");
  const [gender, setGender] = useState<GenderChoice>("all");
  const [primaryText, setPrimaryText] = useState("");
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [callToAction, setCallToAction] = useState("LEARN_MORE");
  const [creativeFile, setCreativeFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function numberFromString(value: string) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : NaN;
  }

  function currentGenderSelection() {
    if (gender === "men") return [1];
    if (gender === "women") return [2];
    return undefined;
  }

  async function uploadCreative() {
    if (!creativeFile) {
      throw new Error("Upload a creative image before creating the campaign.");
    }

    const formData = new FormData();
    formData.set("file", creativeFile);
    formData.set("slug", slug);
    formData.set("account_id", adAccountId);

    const response = await fetch("/api/meta/creatives/upload", {
      body: formData,
      method: "POST",
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      throw new Error(body?.error ?? "The creative image could not be uploaded to Meta.");
    }

    const body = (await response.json()) as { hash?: string };
    if (!body.hash) {
      throw new Error("Meta did not return an image hash for the uploaded creative.");
    }

    return body.hash;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(() => {
      void (async () => {
        setError(null);
        setStatus("Uploading creative to Meta...");

        const dailyBudgetCents = Math.round(numberFromString(dailyBudgetUsd) * 100);
        const ageMinValue = Math.round(numberFromString(ageMin));
        const ageMaxValue = Math.round(numberFromString(ageMax));

        if (!adAccountId) {
          setError("Choose an ad account before creating a campaign.");
          setStatus(null);
          return;
        }
        if (!name.trim()) {
          setError("Campaign name is required.");
          setStatus(null);
          return;
        }
        if (!primaryText.trim()) {
          setError("Primary text is required.");
          setStatus(null);
          return;
        }
        if (!linkUrl.trim()) {
          setError("Destination URL is required.");
          setStatus(null);
          return;
        }
        if (!Number.isFinite(dailyBudgetCents) || dailyBudgetCents < 100) {
          setError("Daily budget must be at least $1.00.");
          setStatus(null);
          return;
        }
        if (
          !Number.isFinite(ageMinValue) ||
          !Number.isFinite(ageMaxValue) ||
          ageMinValue < 18 ||
          ageMaxValue < ageMinValue
        ) {
          setError("Choose a valid age range.");
          setStatus(null);
          return;
        }

        try {
          const imageHash = await uploadCreative();
          setStatus("Creating campaign, ad set, and ad...");

          const response = await fetch("/api/meta/campaigns", {
            body: JSON.stringify({
              ad_account_id: adAccountId,
              client_slug: slug,
              creative: {
                call_to_action: callToAction,
                description: description.trim() || undefined,
                headline: headline.trim() || undefined,
                image_hash: imageHash,
                link_url: linkUrl.trim(),
                primary_text: primaryText.trim(),
              },
              daily_budget: dailyBudgetCents,
              name: name.trim(),
              objective,
              placements: FEED_ONLY_PLACEMENTS,
              targeting: {
                age_max: ageMaxValue,
                age_min: ageMinValue,
                genders: currentGenderSelection(),
                geo_locations: {
                  countries: [country.trim().toUpperCase()],
                },
              },
            }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
          });

          if (!response.ok) {
            const body = (await response.json().catch(() => null)) as
              | { error?: string }
              | null;
            throw new Error(body?.error ?? "Meta campaign creation failed.");
          }

          const body = (await response.json()) as { campaign_id?: string };
          if (!body.campaign_id) {
            throw new Error("Meta campaign creation did not return a campaign id.");
          }

          router.push(
            `/client/${slug}/campaign/${body.campaign_id}/edit?ad_account_id=${encodeURIComponent(adAccountId)}&created=1`,
          );
        } catch (submitError) {
          setError(
            submitError instanceof Error
              ? submitError.message
              : "The campaign could not be created.",
          );
          setStatus(null);
        }
      })();
    });
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Ad account">
          <select
            value={adAccountId}
            onChange={(event) => setAdAccountId(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
          >
            {accounts.map((account) => (
              <option key={account.ad_account_id} value={account.ad_account_id}>
                {account.ad_account_name ?? account.ad_account_id}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Objective">
          <select
            value={objective}
            onChange={(event) => setObjective(event.target.value as Objective)}
            className="w-full rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
          >
            <option value="OUTCOME_SALES">Sales</option>
            <option value="OUTCOME_TRAFFIC">Traffic</option>
            <option value="OUTCOME_ENGAGEMENT">Engagement</option>
            <option value="OUTCOME_AWARENESS">Awareness</option>
          </select>
        </Field>

        <Field label="Campaign name">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Spring launch campaign"
            className="w-full rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-300/50"
          />
        </Field>

        <Field label="Daily budget (USD)">
          <input
            value={dailyBudgetUsd}
            onChange={(event) => setDailyBudgetUsd(event.target.value)}
            inputMode="decimal"
            placeholder="25"
            className="w-full rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-300/50"
          />
        </Field>

        <Field label="Country">
          <input
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            maxLength={2}
            placeholder="US"
            className="w-full rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm uppercase text-white outline-none transition placeholder:text-white/25 focus:border-cyan-300/50"
          />
        </Field>

        <Field label="Gender">
          <select
            value={gender}
            onChange={(event) => setGender(event.target.value as GenderChoice)}
            className="w-full rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
          >
            <option value="all">All genders</option>
            <option value="women">Women</option>
            <option value="men">Men</option>
          </select>
        </Field>

        <Field label="Age minimum">
          <input
            value={ageMin}
            onChange={(event) => setAgeMin(event.target.value)}
            inputMode="numeric"
            className="w-full rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
          />
        </Field>

        <Field label="Age maximum">
          <input
            value={ageMax}
            onChange={(event) => setAgeMax(event.target.value)}
            inputMode="numeric"
            className="w-full rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
          />
        </Field>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Primary text">
          <textarea
            value={primaryText}
            onChange={(event) => setPrimaryText(event.target.value)}
            rows={5}
            placeholder="Tell the audience what this campaign is promoting."
            className="min-h-32 w-full rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-300/50"
          />
        </Field>

        <div className="grid gap-4">
          <Field label="Headline">
            <input
              value={headline}
              onChange={(event) => setHeadline(event.target.value)}
              placeholder="Main offer headline"
              className="w-full rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-300/50"
            />
          </Field>

          <Field label="Description">
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Short supporting line"
              className="w-full rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-300/50"
            />
          </Field>

          <Field label="Call to action">
            <select
              value={callToAction}
              onChange={(event) => setCallToAction(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
            >
              <option value="LEARN_MORE">Learn more</option>
              <option value="SHOP_NOW">Shop now</option>
              <option value="BOOK_TRAVEL">Book now</option>
              <option value="SIGN_UP">Sign up</option>
            </select>
          </Field>

          <Field label="Destination URL">
            <input
              value={linkUrl}
              onChange={(event) => setLinkUrl(event.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-300/50"
            />
          </Field>
        </div>
      </div>

      <Field
        label="Creative image"
        hint="The current review flow uploads a single image to Meta and keeps placements on feeds only."
      >
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setCreativeFile(event.target.files?.[0] ?? null)}
          className="block w-full rounded-2xl border border-dashed border-white/14 bg-[#0b1020] px-4 py-4 text-sm text-white/70 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[#0b1020] hover:border-cyan-300/35"
        />
      </Field>

      {status ? (
        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">
          {status}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#0b1020] transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Creating campaign..." : "Create campaign"}
        </button>
        <p className="text-xs uppercase tracking-[0.18em] text-white/35">
          Feeds-only placements are used in this flow.
        </p>
      </div>
    </form>
  );
}

function Field({
  children,
  hint,
  label,
}: {
  children: ReactNode;
  hint?: string;
  label: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
        {label}
      </span>
      {children}
      {hint ? <p className="text-xs text-white/38">{hint}</p> : null}
    </label>
  );
}
