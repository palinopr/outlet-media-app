/**
 * creative-classify.ts -- Asset classification using the Claude Agent SDK.
 *
 * Picks up assets with status='new', sends them to Claude with vision,
 * and updates placement/folder/labels in Supabase. Posts a summary
 * to #creative on Discord.
 *
 * Triggered by: cron sweep, manual "run creative-classify" in Discord,
 * or the import API route via POST /api/agents/classify.
 */

import { query, tool, createSdkMcpServer, type SDKUserMessage } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const AGENT_DIR = join(import.meta.dirname ?? ".", "..");
const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// ─── Supabase helpers ────────────────────────────────────────────────────────

async function supabaseQuery(
  table: string,
  params: string,
): Promise<unknown> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase GET ${table}: ${res.status}`);
  return res.json();
}

async function supabaseUpdate(
  table: string,
  id: string,
  body: Record<string, unknown>,
): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Supabase PATCH ${table}/${id}: ${res.status}`);
}

// ─── Image fetching ──────────────────────────────────────────────────────────

async function fetchImageAsBase64(
  url: string,
): Promise<{ data: string; mediaType: string } | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const mediaType = res.headers.get("content-type") ?? "image/png";
    return { data: buf.toString("base64"), mediaType };
  } catch (err) {
    console.log(`[creative-classify] image fetch failed for ${url}: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

// ─── MCP tools for the creative agent ────────────────────────────────────────

function buildTools() {
  return createSdkMcpServer({
    name: "creative-tools",
    version: "1.0.0",
    tools: [
      tool(
        "update_asset",
        "Update an asset's classification in Supabase (placement, folder, labels, status)",
        {
          id: z.string().describe("Asset UUID"),
          placement: z.enum(["post", "story", "feed", "both"]).describe("Ad placement type"),
          folder: z.string().describe("Folder path like 'Don Omar Barcelona/Post'"),
          labels: z.array(z.string()).describe("Classification labels"),
        },
        async (args) => {
          await supabaseUpdate("ad_assets", args.id, {
            placement: args.placement,
            folder: args.folder,
            labels: args.labels,
            status: "labeled",
          });
          return {
            content: [{ type: "text" as const, text: `Updated asset ${args.id}: ${args.placement}, ${args.folder}` }],
          };
        },
      ),
      tool(
        "get_client_events",
        "Get events for a client from Supabase",
        {
          client_slug: z.string().describe("Client slug"),
        },
        async (args) => {
          const events = await supabaseQuery(
            "tm_events",
            `client_slug=eq.${args.client_slug}&select=name,date,venue,status`,
          );
          return {
            content: [{ type: "text" as const, text: JSON.stringify(events) }],
          };
        },
      ),
      tool(
        "get_client_campaigns",
        "Get Meta campaigns for a client",
        {
          client_slug: z.string().describe("Client slug"),
        },
        async (args) => {
          const campaigns = await supabaseQuery(
            "meta_campaigns",
            `client_slug=eq.${args.client_slug}&select=name,status,effective_status`,
          );
          return {
            content: [{ type: "text" as const, text: JSON.stringify(campaigns) }],
          };
        },
      ),
    ],
  });
}

// ─── Main classification job ─────────────────────────────────────────────────

interface NewAsset {
  id: string;
  client_slug: string;
  file_name: string;
  public_url: string | null;
  media_type: string;
  width: number | null;
  height: number | null;
}

export async function runCreativeClassify(): Promise<string> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return "Supabase not configured, skipping classification";
  }

  // 1. Fetch new assets
  const assets = (await supabaseQuery(
    "ad_assets",
    "status=eq.new&select=id,client_slug,file_name,public_url,media_type,width,height&order=created_at.asc&limit=20",
  )) as NewAsset[];

  if (assets.length === 0) return "No new assets to classify";

  // 2. Group by client
  const byClient = new Map<string, NewAsset[]>();
  for (const a of assets) {
    const list = byClient.get(a.client_slug);
    if (list) list.push(a);
    else byClient.set(a.client_slug, [a]);
  }

  const results: string[] = [];

  const creativeTools = buildTools();
  const systemPrompt = readFileSync(join(AGENT_DIR, "prompts", "creative-agent.txt"), "utf-8");

  for (const [clientSlug, clientAssets] of byClient) {
    // 3. Build prompt with vision content blocks
    const contentBlocks: Array<
      | { type: "text"; text: string }
      | { type: "image"; source: { type: "base64"; media_type: string; data: string } }
    > = [];

    contentBlocks.push({
      type: "text",
      text: `You are the Creative Agent for Outlet Media. Classify these ${clientAssets.length} new assets for client "${clientSlug}".

For each asset, determine:
1. **Placement**: post (1:1, 4:5 feed images), story (9:16 vertical, reels), feed (1.91:1 link ads), or both (unclear)
2. **Folder**: "{Event or Show Name}/{Placement}" -- match against the client's events using the get_client_events tool
3. **Labels**: descriptive tags like the event name, placement, content description (e.g. "poster", "reel", "countdown")

Use the get_client_events and get_client_campaigns tools to understand what this client is working on.
Then call update_asset for each asset with your classification.

Here are the assets:`,
    });

    // Fetch all images in parallel, then assemble content blocks
    const imageAssets = clientAssets.filter((a) => a.media_type === "image" && a.public_url);
    const imageResults = await Promise.all(
      imageAssets.map(async (a) => ({ id: a.id, img: await fetchImageAsBase64(a.public_url!) })),
    );
    const imageMap = new Map(imageResults.map((r) => [r.id, r.img]));

    for (const asset of clientAssets) {
      contentBlocks.push({
        type: "text",
        text: `\n---\nAsset ID: ${asset.id}\nFilename: ${asset.file_name}\nType: ${asset.media_type}\nDimensions: ${asset.width ?? "unknown"}x${asset.height ?? "unknown"}`,
      });

      const img = imageMap.get(asset.id);
      if (img) {
        contentBlocks.push({
          type: "image",
          source: {
            type: "base64",
            media_type: img.mediaType,
            data: img.data,
          },
        });
      }
    }

    contentBlocks.push({
      type: "text",
      text: "\n\nClassify all assets above. Call update_asset for each one. Be specific with labels -- describe what you see in each image.",
    });

    // 4. Run the Agent SDK with vision + tools
    let resultText = "";

    async function* prompt(): AsyncGenerator<SDKUserMessage> {
      yield {
        type: "user" as const,
        message: {
          role: "user" as const,
          content: contentBlocks,
        },
        parent_tool_use_id: null,
        session_id: "",
      };
    }

    try {
      for await (const msg of query({
        prompt: prompt(),
        options: {
          cwd: AGENT_DIR,
          maxTurns: 10,
          permissionMode: "bypassPermissions" as const,
          allowDangerouslySkipPermissions: true,
          settingSources: ["local"],
          systemPrompt,
          mcpServers: { "creative-tools": creativeTools },
          allowedTools: [
            "mcp__creative-tools__update_asset",
            "mcp__creative-tools__get_client_events",
            "mcp__creative-tools__get_client_campaigns",
          ],
        },
      })) {
        if (msg.type === "assistant") {
          const content = (msg as { message?: { content?: Array<{ type: string; text?: string }> } }).message?.content;
          if (Array.isArray(content)) {
            for (const block of content) {
              if (block.type === "text" && block.text) {
                resultText += block.text;
              }
            }
          }
        }
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      results.push(`${clientSlug}: classification failed -- ${errMsg}`);
      continue;
    }

    results.push(`${clientSlug}: classified ${clientAssets.length} asset(s)`);
  }

  return results.join("\n");
}
