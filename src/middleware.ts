import { NextResponse, type NextRequest } from "next/server";
import { IS_MOCK } from "@/lib/mock";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // Mock/local review: no Supabase, no gate.
  if (IS_MOCK) return NextResponse.next();

  const { response, user } = await updateSession(request);
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return response;
}

// Gate ONLY these prefixes. Must NOT include marketing, /login, /auth/callback,
// static assets, or /api/* (the Stripe webhook must stay public).
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/day/:path*",
    "/schedule/:path*",
    "/book/:path*",
    "/onboarding/:path*",
    "/admin/:path*",
  ],
};
