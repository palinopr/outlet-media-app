/**
 * state.ts — shared runtime flags for the agent.
 *
 * Both jobs.ts and scheduler.ts import from here to avoid circular dependencies
 * and to ensure symmetric blocking: neither think nor a job starts while the
 * other is already running.
 */

export const state = {
  jobRunning: false,
  thinkRunning: false,
  discordAdminRunning: false,
  tmRunning: false,
  metaRunning: false,

  /** Epoch ms when jobRunning was last set to true, or null if idle */
  jobStartedAt: null as number | null,
};

/** Default max lock age: 1 hour */
const DEFAULT_MAX_AGE_MS = 3_600_000;

/**
 * Returns true if jobRunning is true and the lock has been held longer than maxAgeMs.
 */
export function isLockStale(maxAgeMs: number = DEFAULT_MAX_AGE_MS): boolean {
  if (!state.jobRunning || state.jobStartedAt === null) return false;
  return Date.now() - state.jobStartedAt > maxAgeMs;
}

/**
 * Checks jobRunning/agentBusy flags and resets them if the lock is stale.
 * Logs a warning when a stale lock is force-released.
 */
export function resetStaleLocks(maxAgeMs: number = DEFAULT_MAX_AGE_MS): void {
  if (!isLockStale(maxAgeMs)) return;

  const heldFor = state.jobStartedAt !== null
    ? Math.round((Date.now() - state.jobStartedAt) / 1000)
    : 0;

  console.warn(
    `[state] Stale lock detected -- jobRunning held for ${heldFor}s (max ${Math.round(maxAgeMs / 1000)}s). Force-releasing.`,
  );

  state.jobRunning = false;
  state.thinkRunning = false;
  state.jobStartedAt = null;
}
