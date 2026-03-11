import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (error) {
    const errorDesc =
      url.searchParams.get("error_description") ?? "Permission denied";
    return NextResponse.redirect(
      `${appUrl}/connect-error?code=${encodeURIComponent(error)}&error=${encodeURIComponent(errorDesc)}`,
    );
  }

  if (!url.searchParams.get("code") || !url.searchParams.get("state")) {
    return NextResponse.redirect(
      `${appUrl}/connect-error?code=missing_params`,
    );
  }

  return NextResponse.redirect(
    `${appUrl}/connect-error?code=retired_client_flow`,
  );
}
