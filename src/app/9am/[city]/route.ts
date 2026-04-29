import { readFile } from "node:fs/promises";
import path from "node:path";

const allowedCities = new Set(["philadelphia", "dc", "orlando", "atlanta"]);

type RouteContext = {
  params: Promise<{
    city: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { city } = await context.params;
  if (!allowedCities.has(city)) {
    return new Response("Not found", { status: 404 });
  }

  const htmlPath = path.join(process.cwd(), "public", "9am", city, "index.html");
  const html = await readFile(htmlPath, "utf8");
  const withBaseHref = html.replace(
    "<title>",
    `<base href="/9am/${city}/" />\n    <title>`,
  );

  return new Response(withBaseHref, {
    headers: {
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
