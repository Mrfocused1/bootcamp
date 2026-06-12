import { getAllCohorts, getAllRecordings } from "@/lib/queries";
import { RecordingUploadForm } from "@/components/admin/RecordingUploadForm";
import { deleteRecordingAction } from "@/app/(app)/admin/actions";
import { Reveal } from "@/components/marketing/Reveal";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminRecordingsPage() {
  const [cohorts, recordings] = await Promise.all([getAllCohorts(), getAllRecordings()]);
  const cohortName = new Map(cohorts.map((c) => [c.id, c.name]));

  return (
    <div className="space-y-10">
      <Reveal>
        <h1
          className="text-4xl font-black tracking-tight text-ua-ink md:text-5xl"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          recordings
        </h1>
        <p className="mt-3 text-ua-ink/55">
          Upload each Zoom session here — enrolled students see it on that day&rsquo;s page.
        </p>
      </Reveal>

      <Reveal>
        <RecordingUploadForm cohorts={cohorts.map((c) => ({ id: c.id, name: c.name }))} />
      </Reveal>

      <section className="space-y-4">
        <h2 className="text-2xl font-black lowercase text-ua-ink" style={{ fontFamily: "var(--font-epilogue)" }}>
          uploaded ({recordings.length})
        </h2>
        {recordings.length === 0 ? (
          <p className="rounded-3xl border-2 border-dashed border-ua-ink/20 p-8 text-center text-ua-ink/50">
            No recordings yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {recordings.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-ua-ink bg-white p-4 shadow-[4px_4px_0_var(--ua-ink)]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ua-blue text-sm font-bold text-ua-bg">
                  {r.day_index}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-ua-ink" style={{ fontFamily: "var(--font-epilogue)" }}>
                    {r.title}
                  </p>
                  <p className="text-xs text-ua-ink/55">
                    {cohortName.get(r.cohort_id) ?? "—"} · Day {r.day_index} · {formatDate(r.recorded_at)}
                  </p>
                </div>
                <form action={deleteRecordingAction.bind(null, r.id)}>
                  <button
                    type="submit"
                    className="rounded-full border-2 border-ua-ink px-4 py-1.5 text-sm font-bold text-ua-ink transition-colors hover:bg-ua-ink hover:text-ua-bg"
                  >
                    Delete
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
