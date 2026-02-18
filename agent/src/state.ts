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
};
