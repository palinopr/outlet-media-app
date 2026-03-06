import { NextResponse, type NextRequest } from "next/server";
import { adminGuard, apiError, parseJsonBody } from "@/lib/api-helpers";
import { createCrmContact } from "@/features/crm/server";
import type { CrmContactVisibility, CrmLifecycleStage } from "@/features/crm/summary";

interface CreateCrmContactBody {
  clientSlug?: string;
  company?: string | null;
  email?: string | null;
  fullName?: string;
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

export async function POST(request: NextRequest) {
  const guard = await adminGuard();
  if (guard) return guard;

  const parsed = await parseJsonBody<CreateCrmContactBody>(request);
  if (parsed instanceof Response) return parsed;

  const clientSlug = normalizeOptional(parsed.clientSlug);
  const fullName = normalizeOptional(parsed.fullName);
  if (!clientSlug) return apiError("clientSlug is required", 400);
  if (!fullName) return apiError("fullName is required", 400);

  if (
    parsed.leadScore != null &&
    (!Number.isFinite(parsed.leadScore) || parsed.leadScore < 0 || parsed.leadScore > 100)
  ) {
    return apiError("leadScore must be between 0 and 100", 400);
  }

  const contact = await createCrmContact({
    clientSlug,
    company: normalizeOptional(parsed.company),
    email: normalizeOptional(parsed.email),
    fullName,
    leadScore:
      typeof parsed.leadScore === "number" && Number.isFinite(parsed.leadScore)
        ? parsed.leadScore
        : null,
    lifecycleStage: parsed.lifecycleStage,
    nextFollowUpAt: normalizeOptional(parsed.nextFollowUpAt),
    notes: normalizeOptional(parsed.notes),
    ownerName: normalizeOptional(parsed.ownerName),
    phone: normalizeOptional(parsed.phone),
    source: normalizeOptional(parsed.source),
    visibility: parsed.visibility,
  });

  if (!contact) return apiError("Failed to create CRM contact", 500);

  return NextResponse.json({ contact }, { status: 201 });
}
