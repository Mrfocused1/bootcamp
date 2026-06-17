import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  // Only allow same-origin relative paths to prevent open redirects.
  // Must start with a single "/" not followed by "/" or "\" (rejects
  // //evil.com, /\evil.com, and absolute URLs like https://evil.com).
  const raw = url.searchParams.get("next") ?? "/dashboard";
  const next = /^\/(?![/\\])/.test(raw) ? raw : "/dashboard";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=auth", request.url));
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(new URL("/login?error=auth", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login?error=auth", request.url));
  }

  return NextResponse.redirect(new URL(next, request.url));
}
