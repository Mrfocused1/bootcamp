import Link from "next/link";
import { IS_MOCK } from "@/lib/mock";
import { signIn } from "./actions";

// TODO(owner): swap for a real brand photo. IP-clean placeholder for now.
const HERO_IMG = "/marketing/placeholders/p2.png";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const sent = sp.sent === "1";
  const error = sp.error === "1";

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* ── Animated brand visual panel ── */}
      <div className="ua-anim-gradient relative hidden overflow-hidden p-12 text-white md:flex md:flex-col md:justify-between">
        {/* photo backdrop, brand-tinted */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `url("${HERO_IMG}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            mixBlendMode: "overlay",
            opacity: 0.35,
          }}
        />
        {/* floating colour blobs */}
        <span
          aria-hidden
          className="ua-blob"
          style={{ width: 240, height: 240, top: "-40px", left: "-50px", background: "var(--ua-pink)", animationDelay: "0s" }}
        />
        <span
          aria-hidden
          className="ua-blob"
          style={{ width: 200, height: 200, bottom: "60px", right: "-30px", background: "var(--ua-green)", animationDelay: "3s" }}
        />
        <span
          aria-hidden
          className="ua-blob"
          style={{ width: 160, height: 160, top: "45%", left: "20%", background: "var(--ua-orange)", animationDelay: "6s", opacity: 0.4 }}
        />
        {/* drifting stickers */}
        <span aria-hidden className="ua-sticker" style={{ top: "18%", right: "16%", animationDelay: "0s" }}>✨</span>
        <span aria-hidden className="ua-sticker" style={{ top: "60%", right: "26%", animationDelay: "1.5s" }}>🚀</span>
        <span aria-hidden className="ua-sticker" style={{ bottom: "16%", left: "14%", animationDelay: "2.5s" }}>💯</span>
        <span aria-hidden className="ua-sticker" style={{ top: "38%", left: "8%", animationDelay: "3.5s" }}>⚡</span>

        {/* content */}
        <div className="relative z-10 font-genty text-4xl leading-none">Urban AI</div>
        <div className="relative z-10 ua-pop">
          <h2
            className="text-4xl font-extrabold leading-[0.95] lowercase"
            style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif" }}
          >
            build real websites
            <br />
            with ai — in 5 days
          </h2>
          <p className="mt-4 max-w-sm text-base text-white/85">
            Log in to pick up where you left off, rewatch your lessons, and keep
            building.
          </p>
        </div>
      </div>

      {/* ── Form panel ── */}
      <div
        className="relative flex items-center justify-center overflow-hidden px-4 py-12"
        style={{ backgroundColor: "var(--ua-bg)" }}
      >
        {/* subtle moving blobs behind the card (also gives mobile some life) */}
        <span aria-hidden className="ua-blob" style={{ width: 220, height: 220, top: "-60px", right: "-40px", background: "var(--ua-sky)", opacity: 0.25 }} />
        <span aria-hidden className="ua-blob" style={{ width: 180, height: 180, bottom: "-50px", left: "-30px", background: "var(--ua-pink)", opacity: 0.3, animationDelay: "4s" }} />

        <div className="ua-pop relative z-10 flex w-full max-w-sm flex-col gap-6 rounded-2xl bg-white p-8 shadow-xl shadow-black/5">
          {/* Wordmark (mobile shows it here since the panel is hidden) */}
          <div className="text-center md:hidden">
            <span className="font-genty text-4xl leading-none" style={{ color: "var(--ua-blue)" }}>
              Urban AI
            </span>
          </div>

          {sent ? (
            <div className="flex flex-col gap-3 text-center">
              <p
                className="text-lg font-semibold"
                style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif", color: "var(--ua-ink)" }}
              >
                check your email
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--ua-ink)", opacity: 0.65 }}>
                We sent a login link to your inbox. Click it to access your course.
              </p>
              <Link href="/login" className="mt-2 text-sm underline underline-offset-2" style={{ color: "var(--ua-blue)" }}>
                Back to login
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1 text-center">
                <h1
                  className="text-2xl font-bold lowercase"
                  style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif", color: "var(--ua-ink)" }}
                >
                  welcome back
                </h1>
                <p className="text-sm" style={{ color: "var(--ua-ink)", opacity: 0.6 }}>
                  Log in to access your course.
                </p>
              </div>

              {error && (
                <p
                  className="rounded-xl px-4 py-2.5 text-center text-sm font-medium"
                  style={{ backgroundColor: "var(--ua-pink)", color: "var(--ua-ink)" }}
                  role="alert"
                >
                  Please enter a valid email address.
                </p>
              )}

              <form action={signIn} className="flex flex-col gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--ua-ink)", opacity: 0.5 }}>
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
                  className="mt-1 inline-flex w-full items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
                >
                  Send me a login link
                </button>
              </form>
            </div>
          )}

          {IS_MOCK && (
            <div className="flex flex-col gap-3">
              <div className="border-t" style={{ borderColor: "var(--ua-ink)", opacity: 0.1 }} />
              <Link
                href="/onboarding"
                className="inline-flex w-full items-center justify-center rounded-full border-2 px-6 py-2.5 text-sm font-semibold transition-colors hover:opacity-80"
                style={{ borderColor: "var(--ua-blue)", color: "var(--ua-blue)" }}
              >
                Start the demo →
              </Link>
              <p className="text-center text-xs" style={{ color: "var(--ua-ink)", opacity: 0.45 }}>
                <Link href="/admin" className="underline underline-offset-2 hover:opacity-70">
                  View admin demo
                </Link>{" "}
                <span className="font-mono">(set NEXT_PUBLIC_MOCK_ADMIN=1)</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
