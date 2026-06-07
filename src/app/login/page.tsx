import Link from "next/link";
import { IS_MOCK } from "@/lib/mock";
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
    <div
      className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-12"
      style={{ backgroundColor: "var(--ua-bg)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 shadow-sm flex flex-col gap-6"
        style={{ backgroundColor: "#fff" }}
      >
        {/* Wordmark */}
        <div className="text-center">
          <span
            className="font-genty text-4xl leading-none"
            style={{ color: "var(--ua-blue)" }}
          >
            Urban AI
          </span>
        </div>

        {sent ? (
          /* Success state */
          <div className="flex flex-col gap-3 text-center">
            <p
              className="text-lg font-semibold"
              style={{
                fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                color: "var(--ua-ink)",
              }}
            >
              check your email
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--ua-ink)", opacity: 0.65 }}
            >
              We sent a login link to your inbox. Click it to access your
              course.
            </p>
            <Link
              href="/login"
              className="mt-2 text-sm underline underline-offset-2"
              style={{ color: "var(--ua-blue)" }}
            >
              Back to login
            </Link>
          </div>
        ) : (
          /* Form state */
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1 text-center">
              <h1
                className="text-2xl font-bold lowercase"
                style={{
                  fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                  color: "var(--ua-ink)",
                }}
              >
                welcome back
              </h1>
              <p
                className="text-sm"
                style={{ color: "var(--ua-ink)", opacity: 0.6 }}
              >
                Log in to access your course.
              </p>
            </div>

            {error && (
              <p
                className="rounded-xl px-4 py-2.5 text-sm text-center font-medium"
                style={{
                  backgroundColor: "var(--ua-pink)",
                  color: "var(--ua-ink)",
                }}
                role="alert"
              >
                Please enter a valid email address.
              </p>
            )}

            <form action={signIn} className="flex flex-col gap-3">
              <label className="flex flex-col gap-1.5">
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "var(--ua-ink)", opacity: 0.5 }}
                >
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-[var(--ua-ink)]/15 bg-[var(--ua-bg)] px-4 py-2.5 text-sm outline-none transition focus:border-[var(--ua-blue)] focus:ring-2 focus:ring-[var(--ua-blue)]/20"
                  style={{ color: "var(--ua-ink)" }}
                />
              </label>

              <button
                type="submit"
                className="mt-1 w-full inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition-colors hover:opacity-85"
                style={{
                  backgroundColor: "var(--ua-blue)",
                  color: "#fff",
                }}
              >
                Send me a login link
              </button>
            </form>
          </div>
        )}

        {/* Mock mode affordance */}
        {IS_MOCK && (
          <div className="flex flex-col gap-3">
            <div
              className="border-t"
              style={{ borderColor: "var(--ua-ink)", opacity: 0.1 }}
            />
            <div
              className="border-t -mt-3"
              style={{ borderColor: "transparent" }}
            />
            <Link
              href="/dashboard"
              className="w-full inline-flex items-center justify-center rounded-full border-2 px-6 py-2.5 text-sm font-semibold transition-colors hover:opacity-80"
              style={{
                borderColor: "var(--ua-blue)",
                color: "var(--ua-blue)",
              }}
            >
              Enter demo dashboard →
            </Link>
            <p
              className="text-xs text-center"
              style={{ color: "var(--ua-ink)", opacity: 0.45 }}
            >
              <Link
                href="/admin"
                className="underline underline-offset-2 hover:opacity-70"
              >
                View admin demo
              </Link>{" "}
              <span className="font-mono">(set NEXT_PUBLIC_MOCK_ADMIN=1)</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
