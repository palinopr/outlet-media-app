import { NextResponse, type NextRequest } from "next/server";
import { adminGuard, apiError, parseJsonBody } from "@/lib/api-helpers";
import { updateCrmContact } from "@/features/crm/server";
import type { CrmLifecycleStage } from "@/features/crm/summary";

interface UpdateCrmContactBody {
  lastContactedAt?: string | null;
  leadScore?: number | null;
  lifecycleStage?: CrmLifecycleStage;
  nextFollowUpAt?: string | null;
  notes?: string | null;
  ownerName?: string | null;
}

function normalizeOptional(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const guard = await adminGuard();
  if (guard) return guard;

  const { id } = await context.params;
  if (!id) return apiError("Contact id is required", 400);

  const parsed = await parseJsonBody<UpdateCrmContactBody>(request);
  if (parsed instanceof Response) return parsed;

  if (
    parsed.leadScore != null &&
    (!Number.isFinite(parsed.leadScore) || parsed.leadScore < 0 || parsed.leadScore > 100)
  ) {
    return apiError("leadScore must be between 0 and 100", 400);
  }

  const contact = await updateCrmContact({
    contactId: id,
    lastContactedAt: normalizeOptional(parsed.lastContactedAt),
    leadScore:
      typeof parsed.leadScore === "number" && Number.isFinite(parsed.leadScore)
        ? parsed.leadScore
        : parsed.leadScore ?? undefined,
    lifecycleStage: parsed.lifecycleStage,
    nextFollowUpAt: normalizeOptional(parsed.nextFollowUpAt),
    notes: normalizeOptional(parsed.notes),
    ownerName: normalizeOptional(parsed.ownerName),
  });

  if (!contact) return apiError("Failed to update CRM contact", 500);

  return NextResponse.json({ contact });
}
