import { getLatestAnnouncement } from "@/lib/queries";
import { postAnnouncement } from "@/app/(app)/admin/actions";

function formatDate(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function AdminAnnouncementsPage() {
  const latest = await getLatestAnnouncement();

  return (
    <div className="space-y-8">
      <section className="space-y-1">
        <h1
          className="text-3xl font-bold tracking-tight lowercase"
          style={{
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            color: "var(--ua-ink)",
          }}
        >
          announcements
        </h1>
        <p className="text-sm" style={{ color: "var(--ua-ink)", opacity: 0.55 }}>
          Broadcast messages to all students.
        </p>
      </section>

      {/* Latest announcement */}
      {latest ? (
        <div className="rounded-2xl p-5 space-y-2" style={{ backgroundColor: "var(--ua-pink)" }}>
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--ua-ink)", opacity: 0.5 }}
          >
            Latest · {formatDate(latest.created_at)}
          </p>
          <h2
            className="font-bold text-xl"
            style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif", color: "var(--ua-ink)" }}
          >
            {latest.title}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--ua-ink)", opacity: 0.75 }}>
            {latest.body}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: "#fff" }}>
          <p className="text-sm" style={{ color: "var(--ua-ink)", opacity: 0.5 }}>
            No announcements yet.
          </p>
        </div>
      )}

      {/* Post new announcement */}
      <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: "#fff" }}>
        <h2
          className="font-bold text-lg"
          style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif", color: "var(--ua-ink)" }}
        >
          Post new announcement
        </h2>
        <form action={postAnnouncement} className="space-y-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="ann-title"
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--ua-ink)", opacity: 0.5 }}
            >
              Title
            </label>
            <input
              id="ann-title"
              name="title"
              placeholder="Announcement title"
              required
              className="rounded-xl border border-[var(--ua-ink)]/20 bg-[var(--ua-bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ua-blue)]"
              style={{ color: "var(--ua-ink)" }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="ann-body"
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--ua-ink)", opacity: 0.5 }}
            >
              Body
            </label>
            <textarea
              id="ann-body"
              name="body"
              rows={4}
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
              Post announcement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
