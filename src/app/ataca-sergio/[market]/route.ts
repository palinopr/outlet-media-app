import { readFile } from "node:fs/promises";
import path from "node:path";

const allowedMarkets = new Set(["newark"]);

type RouteContext = {
  params: Promise<{
    market: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { market } = await context.params;
  if (!allowedMarkets.has(market)) {
    return new Response("Not found", { status: 404 });
  }

  const htmlPath = path.join(process.cwd(), "public", "ataca-sergio", market, "index.html");
  const html = await readFile(htmlPath, "utf8");
  const withBaseHref = html.replace(
    "<title>",
    `<base href="/ataca-sergio/${market}/" />\n    <title>`,
  );

  return new Response(withBaseHref, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
