const CLIENT_RULES: Array<{ keywords: string[]; slug: string }> = [
  { keywords: ["arjona", "alofoke", "camila"], slug: "zamora" },
  { keywords: ["kybba"], slug: "kybba" },
  { keywords: ["beamina"], slug: "beamina" },
  { keywords: ["happy paws", "happy_paws"], slug: "happy_paws" },
  { keywords: ["don omar", "don_omar"], slug: "don_omar_bcn" },
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
