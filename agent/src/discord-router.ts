/**
 * discord-router.ts -- Agent routing configuration.
 *
 * Maps Discord channel names to specialist agent configs.
 * Each agent has its own prompt file, max turns, and description.
 * The thin router in discord.ts uses this to decide which Claude CLI
 * session to spawn for each incoming message.
 */

export interface AgentConfig {
  /** Which prompts/*.txt file to load (without extension) */
  promptFile: string;
  /** Max Claude CLI turns for this agent */
  maxTurns: number;
  /** Short description for logging */
  description: string;
  /** If true, inject live server snapshot into the prompt via {{SERVER_SNAPSHOT}} */
  injectSnapshot?: boolean;
  /** If true, this channel is read-only (scheduler posts here, no agent responds) */
  readOnly?: boolean;
}

/**
 * Channel name -> agent config.
 * Keys are Discord channel names (kebab-case).
 */
const AGENT_ROUTES: Record<string, AgentConfig> = {
  // Server management -- curl-based Discord REST API
  "bot-admin": {
    promptFile: "server-admin",
    maxTurns: 25,
    description: "server-admin",
    injectSnapshot: true,
  },

  // Meta Ads specialist
  "meta-api": {
    promptFile: "meta-agent",
    maxTurns: 20,
    description: "meta-ads",
  },
  "performance-reports": {
    promptFile: "meta-agent",
    maxTurns: 20,
    description: "meta-ads",
  },

  // Ticketmaster specialist
  "tm-one-data": {
    promptFile: "tm-agent",
    maxTurns: 50,
    description: "tm-monitor",
  },

  // Campaign strategy
  "campaigns-general": {
    promptFile: "campaign-agent",
    maxTurns: 15,
    description: "campaign-strategy",
  },
  "campaign-updates": {
    promptFile: "campaign-agent",
    maxTurns: 15,
    description: "campaign-strategy",
  },
  "ad-creative": {
    promptFile: "campaign-agent",
    maxTurns: 15,
    description: "campaign-strategy",
  },
  "copy-review": {
    promptFile: "campaign-agent",
    maxTurns: 15,
    description: "campaign-strategy",
  },

  // Read-only channels (scheduler posts, no agent response)
  "active-jobs": {
    promptFile: "chat",
    maxTurns: 5,
    description: "read-only",
    readOnly: true,
  },
  "bot-logs": {
    promptFile: "chat",
    maxTurns: 5,
    description: "read-only",
    readOnly: true,
  },
};

/** Default agent config for channels not in the routing table */
const DEFAULT_AGENT: AgentConfig = {
  promptFile: "chat",
  maxTurns: 10,
  description: "general-chat",
};

/**
 * Look up the agent config for a given channel name.
 * Returns the default chat agent if no specific route exists.
 */
export function getAgentForChannel(channelName: string): AgentConfig {
  return AGENT_ROUTES[channelName] ?? DEFAULT_AGENT;
}

/**
 * Check if a channel triggers a manual job instead of a conversation.
 * Returns the job name if the message matches a trigger pattern, null otherwise.
 *
 * Patterns:
 *   "run meta sync" in #meta-api -> triggers Meta sync
 *   "run tm sync" in #tm-one-data -> triggers TM One sync
 *   "run think" in any channel -> triggers think loop
 */
export function matchManualTrigger(
  channelName: string,
  message: string,
): string | null {
  const lower = message.toLowerCase().trim();

  if (channelName === "meta-api" && /^run\s+meta\s+sync$/i.test(lower)) {
    return "meta-sync";
  }
  if (channelName === "tm-one-data" && /^run\s+tm\s+sync$/i.test(lower)) {
    return "tm-sync";
  }
  if (/^run\s+think$/i.test(lower)) {
    return "think";
  }

  return null;
}
