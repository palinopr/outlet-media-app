/**
 * discord-router.ts -- Agent routing configuration.
 *
 * Maps Discord channel names to specialist agent configs.
 * Each channel IS the agent -- talk in it, the agent responds.
 *
 * Layout (16 channels, 6 categories):
 *   Boss:         boss
 *   HQ:           general, dashboard
 *   Agents:       media-buyer, tm-data, creative
 *   Clients:      zamora, kybba
 *   Control Room: cfg-media-buyer, cfg-tm-data, cfg-creative, cfg-reporting,
 *                 cfg-discord, cfg-client-mgr, cfg-general
 *   Feed:         agent-feed (read-only)
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
  // --- Boss / Orchestrator (supervisor of all agents) ---
  "boss": {
    promptFile: "boss",
    maxTurns: 25,
    description: "boss-orchestrator",
    injectSnapshot: true,
  },

  // --- Media Buyer (Meta Ads -- analysis + execution) ---
  "media-buyer": {
    promptFile: "media-buyer",
    maxTurns: 25,
    description: "media-buyer",
  },

  // --- TM Agent (Ticketmaster One) ---
  "tm-data": {
    promptFile: "tm-agent",
    maxTurns: 50,
    description: "tm-agent",
  },

  // --- Creative Agent (ad creative + copy review) ---
  "creative": {
    promptFile: "creative-agent",
    maxTurns: 20,
    description: "creative-agent",
  },

  // --- Client Manager (per-client channels) ---
  "zamora": {
    promptFile: "client-manager",
    maxTurns: 15,
    description: "client-manager",
  },
  "kybba": {
    promptFile: "client-manager",
    maxTurns: 15,
    description: "client-manager",
  },

  // --- Dashboard (reporting agent, responds if asked) ---
  "dashboard": {
    promptFile: "reporting-agent",
    maxTurns: 25,
    description: "reporting-agent",
  },

  // --- Read-only feed (bot output, no agent response) ---
  "agent-feed": {
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
 *   "run meta sync" in #media-buyer -> triggers Meta sync
 *   "run tm sync" in #tm-data -> triggers TM One sync
 *   "run think" in any channel -> triggers think loop
 */
export function matchManualTrigger(
  channelName: string,
  message: string,
): string | null {
  const lower = message.toLowerCase().trim();

  if (channelName === "media-buyer" && /^run\s+meta\s+sync$/i.test(lower)) {
    return "meta-sync";
  }
  if (channelName === "tm-data" && /^run\s+tm\s+sync$/i.test(lower)) {
    return "tm-sync";
  }
  if (/^run\s+think$/i.test(lower)) {
    return "think";
  }

  return null;
}

// --- Config Channel Mapping -----------------------------------------------

export interface ConfigChannelInfo {
  /** The prompt file this config channel manages (without extension) */
  promptFile: string;
  /** Human-readable agent name */
  agentName: string;
  /** The work channel this agent powers (null if no direct work channel) */
  workChannel: string | null;
}

/**
 * Maps cfg-* channel names to the agent files they manage.
 * Used by discord-config.ts to post/update agent context.
 */
export const CONFIG_CHANNELS: Record<string, ConfigChannelInfo> = {
  "cfg-media-buyer": {
    promptFile: "media-buyer",
    agentName: "Media Buyer",
    workChannel: "media-buyer",
  },
  "cfg-tm-data": {
    promptFile: "tm-agent",
    agentName: "TM Data",
    workChannel: "tm-data",
  },
  "cfg-creative": {
    promptFile: "creative-agent",
    agentName: "Creative",
    workChannel: "creative",
  },
  "cfg-reporting": {
    promptFile: "reporting-agent",
    agentName: "Reporting",
    workChannel: "dashboard",
  },
  "cfg-discord": {
    promptFile: "discord-agent",
    agentName: "Discord Agent",
    workChannel: null,
  },
  "cfg-client-mgr": {
    promptFile: "client-manager",
    agentName: "Client Manager",
    workChannel: "zamora",
  },
  "cfg-general": {
    promptFile: "chat",
    agentName: "General Chat",
    workChannel: "general",
  },
};

/** Check if a channel name is a config channel */
export function isConfigChannel(channelName: string): boolean {
  return channelName in CONFIG_CHANNELS;
}

/** Get config info for a channel name, or null */
export function getConfigInfo(channelName: string): ConfigChannelInfo | null {
  return CONFIG_CHANNELS[channelName] ?? null;
}
