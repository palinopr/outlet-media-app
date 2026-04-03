export interface AgentConfig {
  promptFile: string;
  maxTurns: number;
  description: string;
  readOnly?: boolean;
}

const AGENT: AgentConfig = {
  promptFile: "agent",
  maxTurns: 25,
  description: "outlet-agent",
};

const READ_ONLY: AgentConfig = {
  promptFile: "agent",
  maxTurns: 5,
  description: "read-only",
  readOnly: true,
};

const READ_ONLY_CHANNELS = new Set([
  "agent-feed",
  "morning-briefing",
  "email-log",
  "approvals",
  "audit-log",
]);

export function getAgentForChannel(channelName: string): AgentConfig {
  if (READ_ONLY_CHANNELS.has(channelName)) return READ_ONLY;
  return AGENT;
}

export function hasAgentRoute(): boolean {
  return true;
}

export function isInternalChannel(): boolean {
  return false;
}

export function isConfigChannel(): boolean {
  return false;
}
