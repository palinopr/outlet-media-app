/**
 * state.ts -- per-agent lock system.
 *
 * Instead of global booleans (jobRunning, thinkRunning, etc.) that block
 * unrelated agents, we track busy agents by ID in a Set. Each agent
 * acquires/releases its own lock independently.
 *
 * Callers that need "is anything busy?" use isAnyAgentBusy().
 */

/** Currently-busy agent IDs (e.g. "think", "tm-sync", "meta-sync", "sweep", "discord-admin"). */
const busyAgents = new Set<string>();

/** Epoch ms when each agent lock was acquired, for stale-lock detection. */
const lockTimestamps = new Map<string, number>();

/** Returns true if the given agent is currently busy. */
export function isAgentBusy(agentId: string): boolean {
  return busyAgents.has(agentId);
}

/** Mark an agent as busy. */
export function setAgentBusy(agentId: string): void {
  busyAgents.add(agentId);
  lockTimestamps.set(agentId, Date.now());
}

/** Release an agent's lock. */
export function clearAgentBusy(agentId: string): void {
  busyAgents.delete(agentId);
  lockTimestamps.delete(agentId);
}

/** Returns true if any agent is currently busy. */
export function isAnyAgentBusy(): boolean {
  return busyAgents.size > 0;
}

/** Default max lock age: 1 hour */
const DEFAULT_MAX_AGE_MS = 3_600_000;

/**
 * Check all held locks and force-release any older than maxAgeMs.
 * Logs a warning for each stale lock released.
 */
export function resetStaleLocks(maxAgeMs: number = DEFAULT_MAX_AGE_MS): void {
  const now = Date.now();
  for (const [agentId, acquiredAt] of lockTimestamps) {
    const heldMs = now - acquiredAt;
    if (heldMs > maxAgeMs) {
      const heldSec = Math.round(heldMs / 1000);
      console.warn(
        `[state] Stale lock on "${agentId}" -- held for ${heldSec}s (max ${Math.round(maxAgeMs / 1000)}s). Force-releasing.`,
      );
      clearAgentBusy(agentId);
    }
  }
}
