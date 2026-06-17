# Wave 2 — Production Auth — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Make magic-link login complete (`/auth/callback`) and protect the `(app)` routes with Supabase-SSR session middleware, without touching public pages, `/api`, or mock-mode review.

**Architecture:** Canonical `@supabase/ssr` pattern — a `/auth/callback` route exchanges the code for a session; `updateSession` refreshes the session in middleware; `src/middleware.ts` redirects unauthenticated users from a NARROW set of protected prefixes to `/login`, and no-ops in mock mode.

**Tech Stack:** Next.js 16 (modified — Task 0), `@supabase/ssr` v0.10.3, TypeScript, Vitest.

**Branch:** `feat/wave2-auth` (spec committed at `a842a4e`).

---

### Task 0: Pre-flight (Middleware + Supabase SSR)

- [ ] **Step 1:** `ls node_modules/next/dist/docs/` and read the **Middleware** guide + Route Handlers. Confirm: `middleware.ts` lives at `src/middleware.ts` (this app uses `src/`); `export async function middleware(request: NextRequest)`; `export const config = { matcher: [...] }` with path-pattern strings; `NextResponse.next({ request })`, `NextResponse.redirect(url)`, and `request.cookies.getAll()/set()` are valid. Note any deviation.
- [ ] **Step 2:** Confirm `@supabase/ssr` v0.10.3 exposes `createServerClient` with the `cookies: { getAll, setAll }` option shape, and that `supabase.auth.exchangeCodeForSession(code)` and `supabase.auth.getUser()` exist (grep `node_modules/@supabase/ssr` + `node_modules/@supabase/supabase-js` types). Report the exact shapes.

---

### Task 1: `/auth/callback` route (+ test)

**Files:** Create `src/app/auth/callback/route.ts`; Test `src/app/auth/__tests__/callback.test.ts`

- [ ] **Step 1: Failing test** — `src/app/auth/__tests__/callback.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const { exchangeMock } = vi.hoisted(() => ({ exchangeMock: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({ auth: { exchangeCodeForSession: exchangeMock } })),
}));

function req(qs: string) {
  return new Request(`https://x.com/auth/callback${qs}`);
}

describe("GET /auth/callback", () => {
  beforeEach(() => { vi.resetModules(); exchangeMock.mockReset(); });

  it("exchanges the code and redirects to /dashboard", async () => {
    exchangeMock.mockResolvedValue({ error: null });
    const { GET } = await import("@/app/auth/callback/route");
    const res = await GET(req("?code=abc"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://x.com/dashboard");
    expect(exchangeMock).toHaveBeenCalledWith("abc");
  });

  it("honours ?next", async () => {
    exchangeMock.mockResolvedValue({ error: null });
    const { GET } = await import("@/app/auth/callback/route");
    const res = await GET(req("?code=abc&next=/schedule"));
    expect(res.headers.get("location")).toBe("https://x.com/schedule");
  });

  it("redirects to /login?error=auth when code is missing (no exchange)", async () => {
    const { GET } = await import("@/app/auth/callback/route");
    const res = await GET(req(""));
    expect(res.headers.get("location")).toBe("https://x.com/login?error=auth");
    expect(exchangeMock).not.toHaveBeenCalled();
  });

  it("redirects to /login?error=auth when the exchange fails", async () => {
    exchangeMock.mockResolvedValue({ error: { message: "bad" } });
    const { GET } = await import("@/app/auth/callback/route");
    const res = await GET(req("?code=bad"));
    expect(res.headers.get("location")).toBe("https://x.com/login?error=auth");
  });
});
```

- [ ] **Step 2:** `npx vitest run "src/app/auth/__tests__/callback.test.ts"` → FAIL (module missing). (If `NextResponse.redirect` doesn't construct in the test env, STOP and report — but it returns a standard `Response` with status 307 + a `location` header and should work.)

- [ ] **Step 3: Implement** `src/app/auth/callback/route.ts`:
```ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard";

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
```

- [ ] **Step 4:** `npx vitest run "src/app/auth/__tests__/callback.test.ts"` → PASS (4). `npx tsc --noEmit` clean.

- [ ] **Step 5: Commit**
```bash
git add "src/app/auth/callback/route.ts" "src/app/auth/__tests__/callback.test.ts"
git commit -m "feat(auth): add /auth/callback to exchange magic-link code for a session"
```

---

### Task 2: `updateSession` middleware helper

**Files:** Create `src/lib/supabase/middleware.ts`

(No unit test — needs a real `NextRequest`/Supabase; verified by `tsc` + the build in Task 4.)

- [ ] **Step 1: Implement** `src/lib/supabase/middleware.ts`:
```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { User } from "@supabase/supabase-js";

export async function updateSession(
  request: NextRequest,
): Promise<{ response: NextResponse; user: User | null }> {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
```

- [ ] **Step 2:** `npx tsc --noEmit` → clean (confirms the `@supabase/ssr` cookie API + types). Confirm `User` is exported from `@supabase/supabase-js` (Task 0); if not, type `user` as `{ id: string } | null` or `Awaited<ReturnType<...>>` instead — keep the same runtime behavior.

- [ ] **Step 3: Commit**
```bash
git add src/lib/supabase/middleware.ts
git commit -m "feat(auth): add updateSession SSR middleware helper"
```

---

### Task 3: `src/middleware.ts` (gate protected routes)

**Files:** Create `src/middleware.ts`

(No unit test — middleware needs the Next runtime; verified by `tsc` + `npm run build` in Task 4, then a post-deploy live smoke check.)

- [ ] **Step 1: Implement** `src/middleware.ts`:
```ts
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

// Gate ONLY these prefixes. Must NOT include marketing pages, /login,
// /auth/callback, static assets, or /api/* (the Stripe webhook must stay public).
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
```

- [ ] **Step 2:** `npx tsc --noEmit` → clean. `npm run build` → succeeds and reports a Middleware entry. Do NOT widen the matcher.

- [ ] **Step 3: Commit**
```bash
git add src/middleware.ts
git commit -m "feat(auth): gate (app) routes via SSR middleware (mock-safe, narrow matcher)"
```

---

### Task 4: Full verification

- [ ] **Step 1:** `npx vitest run` → all green (incl. the 4 new callback tests).
- [ ] **Step 2:** `npx tsc --noEmit` → no errors.
- [ ] **Step 3:** `npm run build` → succeeds; confirm the build output lists a **Middleware** bundle and the `/auth/callback` route.
- [ ] **Step 4:** Confirm the matcher in `src/middleware.ts` is EXACTLY the six protected prefixes and nothing broader (no `/((?!...))` catch-all, no `/api`, no `/`).

---

## Post-merge live smoke check (controller does this after deploy)
On the deployed production site, verify the matcher is correct and nothing is locked out:
1. `GET /` and `/pricing` → 200 (public, NOT redirected to login).
2. `GET /api/stripe/webhook` → NOT a login redirect / 401 (still publicly reachable; a direct GET may 405/400, which is fine — the point is it's not auth-gated).
3. `GET /login` → 200.
4. `GET /dashboard` while logged out → redirects to `/login?next=/dashboard`.
If any public route or the webhook is redirected to login, the matcher is too broad — fix before declaring done.
