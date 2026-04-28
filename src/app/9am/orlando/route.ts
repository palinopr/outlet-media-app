import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const htmlPath = path.join(process.cwd(), "public", "9am", "orlando", "index.html");
  const html = await readFile(htmlPath, "utf8");
  const withBaseHref = html.replace(
    "<title>",
    '<base href="/9am/orlando/" />\n    <title>',
  );

  return new Response(withBaseHref, {
    headers: {
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
