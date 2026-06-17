# Wave 2 — Production Auth — Design Spec

- **Date:** 2026-06-17
- **Status:** Approved (fix-all mandate)
- **Author:** Paul (Bridgeway Ai Bootcamp) with Claude

## Context
The app uses `@supabase/ssr` (v0.10.3). `src/lib/supabase/server.ts` already creates a
cookie-bound `createServerClient`, and its `setAll` comment says "session refresh is
handled in middleware" — but **no `middleware.ts` exists**. Login (`src/app/login/actions.ts`)
sends a magic link to `${NEXT_PUBLIC_APP_URL}/auth/callback`, but **no `/auth/callback`
route exists**, so real login never completes. The `(app)` route group
(`(app)/layout.tsx`) has no auth gate (only `/admin/*` checks the admin role). Result in
production (real mode): login is broken and protected pages aren't protected.

This wave finishes the standard Supabase-SSR auth wiring. `IS_MOCK = !NEXT_PUBLIC_SUPABASE_URL`;
mock mode must remain a no-op so local review (`NEXT_PUBLIC_MOCK_ADMIN=1`) is unaffected.

## Goal
Real magic-link login completes and lands on `/dashboard`; unauthenticated users hitting
protected pages are redirected to `/login`; public pages, the Stripe webhook, and mock-mode
review are untouched.

## In scope (3 files)

### 1. `src/app/auth/callback/route.ts` (new)
- `export async function GET(request: Request): Promise<Response>`.
- Read `code` (and optional `next`) from the URL. If `code` present: `createClient()`
  (from `@/lib/supabase/server`) → `await supabase.auth.exchangeCodeForSession(code)`.
  On success → `NextResponse.redirect(new URL(next ?? "/dashboard", request.url))`.
- On missing code or error → redirect to `/login?error=auth`.

### 2. `src/lib/supabase/middleware.ts` (new) — `updateSession(request: NextRequest)`
Canonical `@supabase/ssr` middleware client (binds cookies to the request + a `NextResponse`),
calls `supabase.auth.getUser()` to refresh the session, returns `{ response, user }`:
```
let response = NextResponse.next({ request });
const supabase = createServerClient(URL, ANON, { cookies: {
  getAll: () => request.cookies.getAll(),
  setAll: (toSet) => { toSet.forEach(({name,value}) => request.cookies.set(name,value));
    response = NextResponse.next({ request });
    toSet.forEach(({name,value,options}) => response.cookies.set(name,value,options)); },
}});
const { data: { user } } = await supabase.auth.getUser();
return { response, user };
```

### 3. `src/middleware.ts` (new)
- If `IS_MOCK` → `return NextResponse.next();` (no Supabase, no gate — local review unaffected).
- Else `const { response, user } = await updateSession(request);` and if `!user` →
  redirect to `/login?next=${pathname}` (carry over the refreshed cookies on the redirect);
  else return `response`.
- **`export const config = { matcher: [...] }`** that runs ONLY on the protected prefixes:
  `/dashboard/:path*`, `/day/:path*`, `/schedule/:path*`, `/book/:path*`, `/onboarding/:path*`,
  `/admin/:path*`.
  - This positive matcher is the safety boundary: it deliberately does NOT match marketing
    pages, `/login`, `/auth/callback`, static assets, or **`/api/*`** (the Stripe webhook must
    stay publicly reachable — gating it would break payment emails and return 401 to Stripe).

## Out of scope
"Skip onboarding if already onboarded" (login action's existing TODO); role logic beyond the
existing admin check; sign-out flow changes; any non-auth wave.

## Data flow
Magic link → `/auth/callback?code=…` → `exchangeCodeForSession` sets the session cookie →
redirect `/dashboard`. Request to a protected page → middleware refreshes session via
`getUser()` → if no user, redirect `/login?next=<path>`; else continue. Public pages + `/api`
never hit the gate.

## Error handling & mock mode
- Callback with no/invalid code → `/login?error=auth` (no crash).
- Middleware in mock mode → pure `NextResponse.next()` (never constructs Supabase).
- A Supabase/network hiccup in `getUser()` returns no user → treated as unauthenticated
  (redirect to login) rather than crashing.

## Testing + rollout safety
- Unit-test `/auth/callback`: mock `@/lib/supabase/server` so `exchangeCodeForSession`
  resolves/throws; assert redirect to `/dashboard` on success and `/login?error=auth` on
  missing code / failure. (Mock `next/server` `NextResponse.redirect` or assert the returned
  `Response`'s `Location`/status.)
- Middleware is impractical to unit-test (NextRequest internals); verified by `tsc` + `npm run build`
  + a **post-deploy live smoke check**: confirm marketing (`/`, `/pricing`), `/login`, and
  `/api/stripe/webhook` still respond (not redirected/401), and that a protected route (e.g.
  `/dashboard`) redirects to `/login` when unauthenticated.

## Constraints / risks
- **Modified Next.js 16 (`AGENTS.md`):** read `node_modules/next/dist/docs` — especially the
  **Middleware** guide (matcher syntax, `NextResponse`, cookie handling) and Route Handlers —
  before coding.
- **Highest-risk wave:** a wrong matcher could lock everyone out or gate the webhook. The
  positive matcher + mock no-op + the post-deploy smoke check are the guardrails. Do NOT widen
  the matcher to a catch-all.
- Confirm `@supabase/ssr` v0.10.3 exposes `exchangeCodeForSession` and the middleware cookie
  API shape used above before coding.
