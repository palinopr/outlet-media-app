import { NextResponse, type NextRequest } from "next/server";
import { adminGuard, apiError, parseJsonBody } from "@/lib/api-helpers";
import { updateCrmContact } from "@/features/crm/server";
import type { CrmContactVisibility, CrmLifecycleStage } from "@/features/crm/summary";

interface UpdateCrmContactBody {
  company?: string | null;
  email?: string | null;
  fullName?: string;
  lastContactedAt?: string | null;
  leadScore?: number | null;
  lifecycleStage?: CrmLifecycleStage;
  nextFollowUpAt?: string | null;
  notes?: string | null;
  ownerName?: string | null;
  phone?: string | null;
  source?: string | null;
  visibility?: CrmContactVisibility;
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
    company: normalizeOptional(parsed.company),
    contactId: id,
    email: normalizeOptional(parsed.email),
    fullName: normalizeOptional(parsed.fullName) ?? undefined,
    lastContactedAt: normalizeOptional(parsed.lastContactedAt),
    leadScore:
      typeof parsed.leadScore === "number" && Number.isFinite(parsed.leadScore)
        ? parsed.leadScore
        : parsed.leadScore ?? undefined,
    lifecycleStage: parsed.lifecycleStage,
    nextFollowUpAt: normalizeOptional(parsed.nextFollowUpAt),
    notes: normalizeOptional(parsed.notes),
    ownerName: normalizeOptional(parsed.ownerName),
    phone: normalizeOptional(parsed.phone),
    source: normalizeOptional(parsed.source),
    visibility: parsed.visibility,
  });

  if (!contact) return apiError("Failed to update CRM contact", 500);

  return NextResponse.json({ contact });
}
