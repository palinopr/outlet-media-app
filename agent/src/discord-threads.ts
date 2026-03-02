/**
 * discord-threads.ts -- Auto-thread support for client channels.
 *
 * In #zamora and #kybba, messages that reference a specific event or campaign
 * get routed into a thread. This keeps the main channel clean and organizes
 * conversations by topic.
 *
 * Thread creation:
 * - User types "thread: <name>" or "new thread: <name>" -> creates a named thread
 * - Otherwise, responses stay in the main channel (no forced threading)
 *
 * Thread reuse:
 * - If a thread with that name already exists and is active, route to it
 */

import { type Message, type TextChannel } from "discord.js";

/** Channels that support auto-threading */
const THREAD_CHANNELS = new Set(["zamora", "kybba"]);

/**
 * Check if a message should create or route to a thread.
 * Returns the thread if one was created/found, null otherwise.
 */
export async function maybeCreateThread(
  msg: Message,
  channelName: string,
): Promise<{ threadId: string; threadName: string } | null> {
  if (!THREAD_CHANNELS.has(channelName)) return null;

  const content = msg.content.trim();

  // Explicit thread creation: "thread: Arjona Miami 2026"
  const threadMatch = content.match(/^(?:new\s+)?thread:\s*(.+)$/i);
  if (!threadMatch) return null;

  const threadName = threadMatch[1].trim().slice(0, 100); // Discord max 100 chars
  if (!threadName) return null;

  const channel = msg.channel as TextChannel;

  // Check for existing active thread with same name
  const existingThreads = await channel.threads.fetchActive();
  const existing = existingThreads.threads.find(
    t => t.name.toLowerCase() === threadName.toLowerCase()
  );

  if (existing) {
    return { threadId: existing.id, threadName: existing.name };
  }

  // Create new thread from this message
  const thread = await msg.startThread({
    name: threadName,
    autoArchiveDuration: 10080, // 7 days
  });

  return { threadId: thread.id, threadName: thread.name };
}

/**
 * List active threads in a client channel.
 * Returns formatted text for display.
 */
export async function listThreads(channel: TextChannel): Promise<string> {
  const active = await channel.threads.fetchActive();
  const archived = await channel.threads.fetchArchived({ limit: 10 });

  const lines: string[] = [];

  if (active.threads.size > 0) {
    lines.push("**Active threads:**");
    for (const [, thread] of active.threads) {
      const msgCount = thread.messageCount ?? 0;
      lines.push(`  - ${thread.name} (${msgCount} messages)`);
    }
  }

  if (archived.threads.size > 0) {
    lines.push("\n**Recent archived threads:**");
    for (const [, thread] of archived.threads) {
      lines.push(`  - ${thread.name} (archived)`);
    }
  }

  if (lines.length === 0) {
    return "No threads yet. Create one with `thread: Event Name`.";
  }

  return lines.join("\n");
}
