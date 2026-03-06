/**
 * state.ts -- lightweight coordination for job locks and shared resources.
 *
 * Two lock types live here:
 * - agent locks: prevent duplicate runs of the same job
 * - resource locks: serialize access to shared resources like TM browser state
 */

/** Currently-busy agent IDs (e.g. "think", "tm-sync", "meta-sync", "sweep", "discord-admin"). */
const busyAgents = new Set<string>();

/** Epoch ms when each agent lock was acquired, for stale-lock detection. */
const lockTimestamps = new Map<string, number>();

interface ResourceLock {
  ownerId: string;
  acquiredAt: number;
}

const resourceLocks = new Map<string, ResourceLock>();
const ownerResources = new Map<string, Set<string>>();

export class ResourceBusyError extends Error {
  readonly ownerId: string;
  readonly resources: string[];
  readonly blockers: string[];

  constructor(ownerId: string, resources: string[], blockers: string[]) {
    super(`Resources busy for ${ownerId}: ${blockers.join(", ") || "unknown"}`);
    this.name = "ResourceBusyError";
    this.ownerId = ownerId;
    this.resources = resources;
    this.blockers = blockers;
  }
}

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

/** Returns the list of agent IDs currently holding locks. */
export function getBusyAgents(): string[] {
  return [...busyAgents];
}

/** Returns the list of currently-held exclusive resources. */
export function getBusyResources(): string[] {
  return [...resourceLocks.keys()];
}

function normalizeResources(resources: string[]): string[] {
  return [...new Set(resources.map((resource) => resource.trim()).filter(Boolean))];
}

export function acquireResourceLocks(ownerId: string, resources: string[]): {
  acquired: boolean;
  blockers: string[];
} {
  const requested = normalizeResources(resources);
  if (requested.length === 0) {
    return { acquired: true, blockers: [] };
  }

  const blockers = requested.filter((resource) => {
    const held = resourceLocks.get(resource);
    return held != null && held.ownerId !== ownerId;
  });

  if (blockers.length > 0) {
    return { acquired: false, blockers };
  }

  let owned = ownerResources.get(ownerId);
  if (!owned) {
    owned = new Set<string>();
    ownerResources.set(ownerId, owned);
  }

  const acquiredAt = Date.now();
  for (const resource of requested) {
    if (!resourceLocks.has(resource)) {
      resourceLocks.set(resource, { ownerId, acquiredAt });
    }
    owned.add(resource);
  }

  return { acquired: true, blockers: [] };
}

export function releaseResourceLocks(ownerId: string): void {
  const owned = ownerResources.get(ownerId);
  if (!owned) return;

  for (const resource of owned) {
    const held = resourceLocks.get(resource);
    if (held?.ownerId === ownerId) {
      resourceLocks.delete(resource);
    }
  }

  ownerResources.delete(ownerId);
}

export async function withResourceLocks<T>(
  ownerId: string,
  resources: string[],
  work: () => Promise<T>,
): Promise<T> {
  const requested = normalizeResources(resources);
  if (requested.length === 0) {
    return await work();
  }

  const claim = acquireResourceLocks(ownerId, requested);
  if (!claim.acquired) {
    throw new ResourceBusyError(ownerId, requested, claim.blockers);
  }

  try {
    return await work();
  } finally {
    releaseResourceLocks(ownerId);
  }
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

  for (const [ownerId, resources] of ownerResources) {
    let oldest = now;
    for (const resource of resources) {
      const held = resourceLocks.get(resource);
      if (held) {
        oldest = Math.min(oldest, held.acquiredAt);
      }
    }

    const heldMs = now - oldest;
    if (heldMs > maxAgeMs) {
      const heldSec = Math.round(heldMs / 1000);
      console.warn(
        `[state] Stale resource lock owner "${ownerId}" -- held for ${heldSec}s (max ${Math.round(maxAgeMs / 1000)}s). Force-releasing.`,
      );
      releaseResourceLocks(ownerId);
    }
  }
}
