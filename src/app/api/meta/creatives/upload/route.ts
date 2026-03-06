import { NextResponse } from "next/server";
import { authGuard, apiError } from "@/lib/api-helpers";
import { getClientToken } from "@/lib/client-token";
import { META_API_VERSION } from "@/lib/constants";
import { requireClientOwner } from "@/features/client-portal/ownership";

export async function POST(request: Request) {
  const { userId, error: authErr } = await authGuard();
  if (authErr) return authErr;

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const slug = formData.get("slug") as string | null;
  const accountId = formData.get("account_id") as string | null;

  if (!file || !slug || !accountId) {
    return apiError("Missing file, slug, or account_id", 400);
  }
  const ownerGuard = await requireClientOwner(userId, slug, "upload Meta creatives");
  if (ownerGuard) return ownerGuard;

  const token = await getClientToken(slug, accountId);
  if (!token) return apiError("Ad account not connected", 403);

  const rawAccountId = accountId.replace(/^act_/, "");
  const bytes = await file.arrayBuffer();

  const uploadForm = new FormData();
  uploadForm.set("access_token", token);
  uploadForm.set("filename", file.name);
  uploadForm.set(
    "bytes",
    new Blob([bytes], { type: file.type }),
    file.name
  );

  const res = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/act_${rawAccountId}/adimages`,
    { method: "POST", body: uploadForm }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return apiError(`Upload failed: ${err.error?.message ?? "Unknown"}`, 400);
  }

  const data = await res.json();
  const images = data.images ?? {};
  const first = Object.values(images)[0] as
    | { hash: string; url: string }
    | undefined;

  if (!first) return apiError("No image returned from Meta", 500);

  return NextResponse.json({ hash: first.hash, url: first.url });
}
