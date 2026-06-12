import Link from "next/link";
import { IS_MOCK } from "@/lib/mock";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { signIn } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const sent = sp.sent === "1";
  const error = sp.error === "1";

  return (
    <main data-nav-theme="dark" className="relative min-h-svh w-full overflow-hidden bg-ua-ink text-ua-bg">
      <MarketingNav hideLogin />
      {/* Homepage hero slide 2 as the backdrop (no dim) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/marketing/bridgeway-hero-2.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Login card pinned to one side so it never covers the photo's subject */}
      <div className="relative z-10 flex min-h-svh items-center justify-center px-6 py-28 md:justify-start md:px-16 lg:px-24">
        <div className="w-full max-w-sm rounded-3xl border-2 border-ua-ink bg-ua-bg p-8 text-ua-ink shadow-[8px_8px_0_var(--ua-ink)]">
          {sent ? (
            <div className="flex flex-col gap-3 text-center">
              <h1
                className="text-3xl font-black lowercase tracking-tight"
                style={{ fontFamily: "var(--font-epilogue)" }}
              >
                check your email
              </h1>
              <p className="text-ua-ink/70">
                We sent a login link to your inbox. Click it to access your course.
              </p>
              <Link
                href="/login"
                className="mt-2 text-sm font-bold text-ua-blue underline-offset-4 hover:underline"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <h1
                className="text-3xl font-black lowercase tracking-tight md:text-4xl"
                style={{ fontFamily: "var(--font-epilogue)" }}
              >
                welcome back
              </h1>
              <p className="mt-3 text-ua-ink/70">
                Log in to pick up where you left off, rewatch your lessons, and
                keep building.
              </p>

              {error && (
                <p
                  className="mt-6 rounded-xl bg-ua-pink px-4 py-2.5 text-sm font-medium text-ua-ink"
                  role="alert"
                >
                  Please enter a valid email address.
                </p>
              )}

              <form action={signIn} className="mt-7 flex flex-col gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-widest text-ua-ink/50">
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border-2 border-ua-ink/15 bg-white px-4 py-3 text-sm text-ua-ink outline-none transition placeholder:text-ua-ink/40 focus:border-ua-blue"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full bg-ua-blue px-6 py-3 text-base font-bold text-ua-bg transition hover:opacity-90"
                  style={{ fontFamily: "var(--font-epilogue)" }}
                >
                  Send me a login link →
                </button>
              </form>
            </>
          )}

          {IS_MOCK && (
            <div className="mt-6 flex flex-col gap-3">
              <div className="border-t border-ua-ink/10" />
              <Link
                href="/onboarding"
                className="inline-flex w-full items-center justify-center rounded-full border-2 border-ua-ink px-6 py-3 text-base font-bold text-ua-ink transition-colors hover:bg-ua-ink hover:text-ua-bg"
                style={{ fontFamily: "var(--font-epilogue)" }}
              >
                Start the demo →
              </Link>
              <p className="text-center text-xs text-ua-ink/45">
                <Link href="/admin" className="underline underline-offset-2 hover:text-ua-ink/70">
                  View admin demo
                </Link>{" "}
                <span className="font-mono">(set NEXT_PUBLIC_MOCK_ADMIN=1)</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
