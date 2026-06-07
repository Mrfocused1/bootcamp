import { getStudents } from "@/lib/queries";
import { sendBroadcast } from "@/app/(app)/admin/actions";
import { redirect } from "next/navigation";

export default async function AdminBroadcastPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const sent = sp.sent === "1";
  const recipientCount = typeof sp.count === "string" ? Number(sp.count) : null;

  const students = await getStudents();

  // Collect distinct cohort names for the dropdown
  const cohortMap = new Map<string, string>();
  for (const { cohort } of students) {
    cohortMap.set(cohort.id, cohort.name);
  }
  const cohorts = Array.from(cohortMap.entries()); // [id, name]

  // Server action wrapper: after sending, redirect with ?sent=1&count=N
  async function handleSend(formData: FormData) {
    "use server";
    const result = await sendBroadcast(formData);
    redirect(`/admin/broadcast?sent=1&count=${result.recipients}`);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="space-y-1">
        <h1
          className="text-3xl font-bold tracking-tight lowercase"
          style={{
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            color: "var(--ua-ink)",
          }}
        >
          broadcast email
        </h1>
        <p className="text-sm" style={{ color: "var(--ua-ink)", opacity: 0.55 }}>
          Compose and send an email to all students or a specific cohort.
        </p>
      </section>

      {/* Success banner */}
      {sent && (
        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{ backgroundColor: "var(--ua-green)" }}
        >
          <span className="text-sm font-semibold" style={{ color: "var(--ua-ink)" }}>
            Broadcast sent
            {recipientCount !== null ? ` to ${recipientCount} student${recipientCount !== 1 ? "s" : ""}.` : "."}
          </span>
        </div>
      )}

      {/* Composer form */}
      <div className="rounded-2xl p-5 space-y-5" style={{ backgroundColor: "#fff" }}>
        <h2
          className="font-bold text-lg lowercase"
          style={{
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            color: "var(--ua-ink)",
          }}
        >
          compose broadcast
        </h2>

        <form action={handleSend} className="space-y-4">
          {/* Recipient selector */}
          <fieldset className="space-y-2">
            <legend
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--ua-ink)", opacity: 0.5 }}
            >
              Recipients
            </legend>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="recipient_type"
                  value="all"
                  defaultChecked
                  className="accent-[var(--ua-blue)]"
                />
                <span className="text-sm" style={{ color: "var(--ua-ink)" }}>
                  All students ({students.length})
                </span>
              </label>
              {cohorts.length > 0 && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="recipient_type"
                    value="cohort"
                    className="accent-[var(--ua-blue)]"
                  />
                  <span className="text-sm" style={{ color: "var(--ua-ink)" }}>
                    Specific cohort
                  </span>
                </label>
              )}
            </div>
          </fieldset>

          {/* Cohort dropdown */}
          {cohorts.length > 0 && (
            <div className="flex flex-col gap-1">
              <label
                htmlFor="broadcast-cohort"
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--ua-ink)", opacity: 0.5 }}
              >
                Cohort (optional — only used when &quot;Specific cohort&quot; is selected)
              </label>
              <select
                id="broadcast-cohort"
                name="cohort"
                className="rounded-xl border border-[var(--ua-ink)]/20 bg-[var(--ua-bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ua-blue)]"
                style={{ color: "var(--ua-ink)" }}
              >
                <option value="">— select cohort —</option>
                {cohorts.map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Subject */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="broadcast-subject"
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--ua-ink)", opacity: 0.5 }}
            >
              Subject
            </label>
            <input
              id="broadcast-subject"
              name="subject"
              type="text"
              placeholder="Email subject line"
              required
              className="rounded-xl border border-[var(--ua-ink)]/20 bg-[var(--ua-bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ua-blue)]"
              style={{ color: "var(--ua-ink)" }}
            />
          </div>

          {/* Body */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="broadcast-body"
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--ua-ink)", opacity: 0.5 }}
            >
              Message body
            </label>
            <textarea
              id="broadcast-body"
              name="body"
              rows={6}
              placeholder="Write your message to students..."
              required
              className="rounded-xl border border-[var(--ua-ink)]/20 bg-[var(--ua-bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ua-blue)] resize-none"
              style={{ color: "var(--ua-ink)" }}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
            >
              Send broadcast
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
