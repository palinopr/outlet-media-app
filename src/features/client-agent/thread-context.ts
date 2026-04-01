import { z } from "zod";

import { ReferencedEntitySchema, ResolvedRangeSchema } from "./types";

export const ThreadContextPayloadSchema = z.object({
  primaryDomain: z.enum(["ads", "events", "mixed"]),
  referencedEntities: z.array(ReferencedEntitySchema),
  resolvedRange: ResolvedRangeSchema.nullable(),
  comparisonSet: z.array(z.string().min(1)),
  pronounTargets: z.array(z.string().min(1)),
});

export type ThreadContextPayload = z.infer<typeof ThreadContextPayloadSchema>;
