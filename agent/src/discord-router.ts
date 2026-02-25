/**
 * discord-router.ts -- Agent routing configuration.
 *
 * Maps Discord channel names to specialist agent configs.
 * Each agent gets its own category with: work channel, memory, skills.
 *
 * Layout (21 channels, 7 categories):
 *   Boss:         boss, boss-memory, boss-skills
 *   Media Buyer:  media-buyer, mb-memory, mb-skills
 *   TM Data:      tm-data, tm-memory, tm-skills
 *   Creative:     creative, creative-memory, creative-skills
 *   Reporting:    dashboard, reporting-memory, reporting-skills
 *   Clients:      zamora, kybba, clients-memory, clients-skills
 *   HQ:           general, agent-feed (read-only), schedule (read-only)
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
  /** If true, this channel is read-only (bot posts here, no agent responds) */
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

  // --- Read-only channels (bot output, no agent response) ---
  "agent-feed": {
    promptFile: "chat",
    maxTurns: 5,
    description: "read-only",
    readOnly: true,
  },
  "schedule": {
    promptFile: "chat",
    maxTurns: 5,
    description: "schedule-control",
    /** Not readOnly -- handled by discord-schedule.ts command handler */
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

// --- Agent Internals Mapping -----------------------------------------------

/**
 * Maps agent identifiers to their file system paths for memory + skills.
 * Used by the deploy-internals system to sync agent state to Discord channels.
 */
export interface AgentInternals {
  /** Agent display name */
  name: string;
  /** Memory file path relative to agent/ */
  memoryFile: string;
  /** Skills directory path relative to agent/ */
  skillsDir: string;
  /** Prompt file name (without extension) */
  promptFile: string;
  /** Discord memory channel name */
  memoryChannel: string;
  /** Discord skills channel name */
  skillsChannel: string;
  /** Tools this agent has access to */
  tools: string[];
}

export const AGENT_INTERNALS: Record<string, AgentInternals> = {
  boss: {
    name: "Boss",
    memoryFile: "memory/boss.md",
    skillsDir: "skills/boss",
    promptFile: "boss",
    memoryChannel: "boss-memory",
    skillsChannel: "boss-skills",
    tools: ["curl (Discord REST, Meta Graph, Supabase)", "activity-log.json reader", "all agent delegation"],
  },
  "media-buyer": {
    name: "Media Buyer",
    memoryFile: "memory/media-buyer.md",
    skillsDir: "skills/media-buyer",
    promptFile: "media-buyer",
    memoryChannel: "mb-memory",
    skillsChannel: "mb-skills",
    tools: ["curl (Meta Graph API v21.0)", "curl (Supabase REST)", "curl (Ingest endpoint)"],
  },
  "tm-agent": {
    name: "TM Data",
    memoryFile: "memory/tm-agent.md",
    skillsDir: "skills/tm-agent",
    promptFile: "tm-agent",
    memoryChannel: "tm-memory",
    skillsChannel: "tm-skills",
    tools: ["Playwright (browser automation)", "curl (Supabase REST)", "curl (Ingest endpoint)"],
  },
  creative: {
    name: "Creative",
    memoryFile: "memory/creative.md",
    skillsDir: "skills/creative",
    promptFile: "creative-agent",
    memoryChannel: "creative-memory",
    skillsChannel: "creative-skills",
    tools: ["curl (Meta Graph API - creative uploads)", "curl (Supabase REST)"],
  },
  reporting: {
    name: "Reporting",
    memoryFile: "memory/reporting.md",
    skillsDir: "skills/reporting",
    promptFile: "reporting-agent",
    memoryChannel: "reporting-memory",
    skillsChannel: "reporting-skills",
    tools: ["curl (Supabase REST)", "curl (Meta Graph API - read)", "curl (Ingest/Alerts)"],
  },
  "client-manager": {
    name: "Client Manager",
    memoryFile: "memory/client-manager.md",
    skillsDir: "skills/client-manager",
    promptFile: "client-manager",
    memoryChannel: "clients-memory",
    skillsChannel: "clients-skills",
    tools: ["curl (Supabase REST)", "curl (Meta Graph API - read)"],
  },
};

/**
 * Memory and skills channels are bot-managed (read-only for display).
 * Messages in these channels are ignored by the agent router.
 */
const INTERNAL_CHANNELS = new Set(
  Object.values(AGENT_INTERNALS).flatMap(a => [a.memoryChannel, a.skillsChannel])
);

/** Check if a channel is an agent-internal channel (memory/skills) */
export function isInternalChannel(channelName: string): boolean {
  return INTERNAL_CHANNELS.has(channelName);
}

/** Check if a channel is a config channel (legacy -- now replaced by internal channels) */
export function isConfigChannel(channelName: string): boolean {
  return channelName.startsWith("cfg-");
}
