export interface TypingHeartbeatHandle {
  stop: () => Promise<void>;
}

export function startTypingHeartbeat(input: {
  intervalMs?: number;
  sendTyping: () => Promise<void>;
}): TypingHeartbeatHandle {
  const intervalMs = input.intervalMs ?? 20_000;
  let stopped = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let inFlight: Promise<void> | null = null;

  const tick = async () => {
    if (stopped) return;
    const current = input.sendTyping();
    inFlight = current;
    await current.finally(() => {
      if (inFlight === current) {
        inFlight = null;
      }
    });

    if (!stopped) {
      timer = setTimeout(() => {
        void tick();
      }, intervalMs);
    }
  };

  void tick();

  return {
    stop: async () => {
      stopped = true;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      await inFlight;
    },
  };
}

export async function runWithTypingHeartbeat<T>(input: {
  intervalMs?: number;
  sendTyping: () => Promise<void>;
  task: () => Promise<T>;
}): Promise<T> {
  const heartbeat = startTypingHeartbeat({
    intervalMs: input.intervalMs,
    sendTyping: input.sendTyping,
  });

  try {
    return await input.task();
  } finally {
    await heartbeat.stop();
  }
}

