import "dotenv/config";
import { Bot, type Context } from "grammy";
import { runClaude } from "./runner.js";
import { state } from "./state.js";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("TELEGRAM_BOT_TOKEN not set in .env");

/** Convert common markdown patterns to Telegram HTML */
function mdToHtml(text: string): string {
  return text
    // Escape bare & < > that aren't already part of HTML tags
    .replace(/&(?!amp;|lt;|gt;|quot;)/g, "&amp;")
    // **bold** or __bold__ → <b>bold</b>
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/__(.+?)__/g, "<b>$1</b>")
    // *italic* or _italic_ (but not inside URLs or already-converted tags)
    .replace(/(?<![<\w])_([^_]+?)_(?![>\w])/g, "<i>$1</i>")
    .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, "<i>$1</i>")
    // `code` → <code>code</code>
    .replace(/`([^`]+?)`/g, "<code>$1</code>")
    // ```block``` → <pre>block</pre>
    .replace(/```[\w]*\n?([\s\S]*?)```/g, "<pre>$1</pre>")
    // ## headers → just bold the text
    .replace(/^#{1,3}\s+(.+)$/gm, "<b>$1</b>");
}

export const bot = new Bot(token);

// Track running agent tasks so we don't run two at once
let agentBusy = false;

bot.command("start", async (ctx) => {
  await ctx.reply(
    "Outlet Media Agent online.\n\nI monitor Ticketmaster One and keep your dashboard up to date.\n\nYou can ask me anything:\n• \"Check TM One now\"\n• \"What are the ticket counts for all shows?\"\n• \"How many tickets sold for the Miami show?\"\n• \"What changed since yesterday?\""
  );
});

bot.command("status", async (ctx) => {
  await ctx.reply(agentBusy ? "Agent is busy running a task." : "Agent is idle and ready.");
});

bot.command("check", async (ctx) => {
  await handleMessage(ctx, "Check TM One for any updates. Compare against the last saved state and report what changed.");
});

// Handle any text message as a prompt to the agent
bot.on("message:text", async (ctx) => {
  await handleMessage(ctx, ctx.message.text);
});

async function handleMessage(ctx: Context, prompt: string) {
  // Block if Telegram is already handling a message OR if a scheduled job/think cycle
  // is running (both would compete for the claude CLI subprocess)
  if (agentBusy || state.jobRunning || state.thinkRunning) {
    await ctx.reply("Agent is busy. Try again in a moment.");
    return;
  }

  agentBusy = true;

  // Send typing indicator and keep refreshing it every 4s while working
  const chatId = ctx.chat!.id;
  await ctx.api.sendChatAction(chatId, "typing");
  const typingInterval = setInterval(() => {
    ctx.api.sendChatAction(chatId, "typing").catch(() => {});
  }, 4000);

  const workingMsg = await ctx.reply("Working on it...");

  let buffer = "";
  let lastEdit = Date.now();

  try {
    const result = await runClaude({
      prompt,
      systemPromptName: "chat",
      onChunk: async (chunk: string) => {
        buffer += chunk;
        // Throttle edits to avoid Telegram rate limits (max 1 edit/sec)
        if (Date.now() - lastEdit > 1200 && buffer.trim()) {
          try {
            await ctx.api.editMessageText(
              workingMsg.chat.id,
              workingMsg.message_id,
              mdToHtml(buffer.slice(-4000)),
              { parse_mode: "HTML" }
            );
            lastEdit = Date.now();
          } catch {
            // Edit can fail if message hasn't changed - ignore
          }
        }
      },
    });

    // Final message — convert any leftover markdown to HTML
    const finalText = mdToHtml((result.text || "Done.").slice(0, 4096));
    try {
      await ctx.api.editMessageText(
        workingMsg.chat.id,
        workingMsg.message_id,
        finalText,
        { parse_mode: "HTML" }
      );
    } catch {
      await ctx.reply(finalText, { parse_mode: "HTML" });
    }

    // If response was long, send rest as follow-up
    if (result.text.length > 4096) {
      const chunks = chunkText(result.text.slice(4096), 4096);
      for (const chunk of chunks) {
        await ctx.reply(mdToHtml(chunk), { parse_mode: "HTML" });
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await ctx.reply(`Something went wrong: ${msg}`);
  } finally {
    clearInterval(typingInterval);
    agentBusy = false;
  }
}

/** Split long text into Telegram-safe chunks */
function chunkText(text: string, maxLen: number): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + maxLen));
    i += maxLen;
  }
  return chunks;
}

/**
 * Send a proactive message to the owner's chat (for scheduled checks).
 * TELEGRAM_CHAT_ID must be set in .env.
 */
export async function notifyOwner(text: string): Promise<void> {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!chatId) {
    console.warn("[bot] TELEGRAM_CHAT_ID not set - skipping notification");
    return;
  }
  await bot.api.sendMessage(chatId, mdToHtml(text.slice(0, 4096)), { parse_mode: "HTML" });
}
