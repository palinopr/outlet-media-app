interface BitlyShortenResponse {
  link?: string;
}

export async function shortenBitlyUrl(longUrl: string): Promise<string> {
  const accessToken = process.env.BITLY_ACCESS_TOKEN?.trim();
  if (!accessToken) {
    return longUrl;
  }

  try {
    const response = await fetch("https://api-ssl.bitly.com/v4/shorten", {
      body: JSON.stringify({
        ...(process.env.BITLY_DOMAIN?.trim()
          ? { domain: process.env.BITLY_DOMAIN.trim() }
          : {}),
        ...(process.env.BITLY_GROUP_GUID?.trim()
          ? { group_guid: process.env.BITLY_GROUP_GUID.trim() }
          : {}),
        long_url: longUrl,
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      return longUrl;
    }

    const payload = (await response.json()) as BitlyShortenResponse;
    return typeof payload.link === "string" && payload.link.trim().length > 0
      ? payload.link.trim()
      : longUrl;
  } catch {
    return longUrl;
  }
}
