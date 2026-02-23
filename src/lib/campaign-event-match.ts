// Match Meta campaigns to TM One events by extracting artist + city from campaign names.
// Campaign naming convention: "Zamora - Artist - City - Version"

export type MatchableCampaign = {
  name: string;
  status: string;
  spend: number | null;
  roas: number | null;
};

export type MatchableEvent = {
  artist: string | null;
  city: string | null;
};

const CITY_KEYWORDS = [
  "Seattle", "Portland", "Inglewood", "Boston", "San Jose", "San Diego",
  "Phoenix", "West Valley", "Palm Desert", "Anaheim", "Sacramento",
  "San Francisco", "Glendale", "San Antonio", "Austin", "Miami",
  "Nashville", "Atlanta", "Washington", "Reading", "Denver", "Dallas",
];

function campaignCity(name: string): string | null {
  const lower = name.toLowerCase();
  return CITY_KEYWORDS.find((c) => lower.includes(c.toLowerCase())) ?? null;
}

function campaignArtist(name: string): string | null {
  const lower = name.toLowerCase();
  if (lower.includes("arjona")) return "Ricardo Arjona";
  if (lower.includes("camila")) return "Camila";
  if (lower.includes("alofoke")) return "Alofoke";
  if (lower.includes("kybba")) return "KYBBA";
  return null;
}

export function matchedCampaigns<T extends MatchableCampaign>(
  campaigns: T[],
  event: MatchableEvent,
): T[] {
  const eventArtist = (event.artist ?? "").toLowerCase();
  const eventCity   = (event.city ?? "").toLowerCase();
  return campaigns.filter((c) => {
    const cArtist = campaignArtist(c.name)?.toLowerCase();
    if (!cArtist || !eventArtist.includes(cArtist.split(" ")[0])) return false;
    const cCity = campaignCity(c.name);
    if (cCity) return eventCity.includes(cCity.toLowerCase());
    return true; // no city → matches all events of that artist
  });
}
