const CLIENT_RULES: Array<{ keywords: string[]; slug: string }> = [
  { keywords: ["arjona", "alofoke", "camila"], slug: "zamora" },
  { keywords: ["kybba"], slug: "kybba" },
  { keywords: ["beamina"], slug: "beamina" },
  { keywords: ["happy paws", "happy_paws"], slug: "happy_paws" },
  { keywords: ["don omar", "don_omar"], slug: "don_omar_bcn" },
  { keywords: ["distill", "destilado", "destilero"], slug: "distill_pr" },
  { keywords: ["vaz vil", "vaz_vil"], slug: "vaz_vil_enterprise" },
  { keywords: ["sienna"], slug: "sienna" },
  { keywords: ["9am", "9 am"], slug: "9am" },
  { keywords: ["outlet media"], slug: "outlet_media" },
  { keywords: ["chris r", "chris_r"], slug: "chris_r" },
  { keywords: ["proteccion final", "protección final"], slug: "proteccion_final" },
];

export function guessClientSlug(campaignName: string): string {
  const lower = campaignName.toLowerCase();
  for (const rule of CLIENT_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.slug;
    }
  }
  return "unknown";
}
