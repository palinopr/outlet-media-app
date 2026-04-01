type PromptPolicyResult =
  | { kind: "safe"; safePrompt: string }
  | { kind: "mixed"; safePrompt: string; refusalNote: string }
  | { kind: "refuse"; refusalMessage: string };

const REFUSED_PATTERN =
  /\b(strategy|structure|setup|set up|source|internal(?:ly)?|behind the scenes|ad sets?|prompts?|ledgers?|workflow state|diagnostics?)\b/i;

const REFUSAL_NOTE =
  "I can help with performance, but I can’t share strategy, setup, prompts, diagnostics, or account structure details.";

const REFUSAL_MESSAGE =
  "I can help with campaign and event performance, but I can’t share strategy, setup, prompts, diagnostics, or account structure details.";

export function evaluatePromptPolicy(message: string): PromptPolicyResult {
  const trimmed = message.trim();

  if (!REFUSED_PATTERN.test(trimmed)) {
    return { kind: "safe", safePrompt: trimmed };
  }

  const safePrompt = trimmed
    .split(/\band\b|,/i)
    .map((part) => part.trim())
    .find((part) => part.length > 0 && !REFUSED_PATTERN.test(part));

  if (safePrompt) {
    return {
      kind: "mixed",
      safePrompt,
      refusalNote: REFUSAL_NOTE,
    };
  }

  return {
    kind: "refuse",
    refusalMessage: REFUSAL_MESSAGE,
  };
}

export type { PromptPolicyResult };
