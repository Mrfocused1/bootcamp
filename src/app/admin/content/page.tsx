import { getDays, getLessons } from "@/lib/queries";
import { saveLesson } from "@/app/admin/actions";
import type { Lesson } from "@/lib/types";

function LessonEditForm({ lesson }: { lesson: Lesson }) {
  return (
    <form
      action={saveLesson}
      className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3"
    >
      <input type="hidden" name="id" value={lesson.id} />

      <div className="flex flex-col gap-1">
        <label
          htmlFor={`title-${lesson.id}`}
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--ua-ink)", opacity: 0.5 }}
        >
          Title
        </label>
        <input
          id={`title-${lesson.id}`}
          name="title"
          defaultValue={lesson.title}
          required
          className="rounded-xl border border-[var(--ua-ink)]/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ua-blue)]"
          style={{ color: "var(--ua-ink)" }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor={`provider-${lesson.id}`}
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--ua-ink)", opacity: 0.5 }}
        >
          Provider
        </label>
        <input
          id={`provider-${lesson.id}`}
          name="video_provider"
          defaultValue={lesson.video_provider ?? ""}
          className="rounded-xl border border-[var(--ua-ink)]/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ua-blue)]"
          style={{ color: "var(--ua-ink)" }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor={`video-id-${lesson.id}`}
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--ua-ink)", opacity: 0.5 }}
        >
          Video ID / URL
        </label>
        <input
          id={`video-id-${lesson.id}`}
          name="video_id"
          defaultValue={lesson.video_id ?? ""}
          className="rounded-xl border border-[var(--ua-ink)]/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ua-blue)]"
          style={{ color: "var(--ua-ink)" }}
        />
      </div>

      <div className="sm:col-span-3 flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
        >
          Save lesson
        </button>
      </div>
    </form>
  );
}

export default async function AdminContentPage() {
  const [days, lessons] = await Promise.all([getDays(), getLessons()]);

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
          content
        </h1>
        <p className="text-sm" style={{ color: "var(--ua-ink)", opacity: 0.55 }}>
          Edit lesson titles, video providers, and video IDs.
        </p>
      </section>

      <div className="space-y-6">
        {days.map((day) => {
          const dayLessons = lessons.filter((l) => l.day_id === day.id);
          return (
            <div
              key={day.id}
              className="rounded-2xl p-5"
              style={{ backgroundColor: "#fff" }}
            >
              <h2
                className="font-bold text-lg mb-4"
                style={{
                  fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                  color: "var(--ua-ink)",
                }}
              >
                Day {day.day_index} — {day.title}
              </h2>

              {dayLessons.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--ua-ink)", opacity: 0.5 }}>
                  No lessons for this day.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse mb-4">
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(20,20,20,0.1)" }}>
                        <th className="py-2 pr-4 text-left font-semibold text-xs uppercase tracking-widest" style={{ opacity: 0.5, color: "var(--ua-ink)" }}>Title</th>
                        <th className="py-2 pr-4 text-left font-semibold text-xs uppercase tracking-widest" style={{ opacity: 0.5, color: "var(--ua-ink)" }}>Provider</th>
                        <th className="py-2 pr-4 text-left font-semibold text-xs uppercase tracking-widest" style={{ opacity: 0.5, color: "var(--ua-ink)" }}>Video ID</th>
                        <th className="py-2 text-left font-semibold text-xs uppercase tracking-widest" style={{ opacity: 0.5, color: "var(--ua-ink)" }}>Order</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dayLessons.map((lesson) => (
                        <tr
                          key={lesson.id}
                          style={{ borderBottom: "1px solid rgba(20,20,20,0.06)" }}
                        >
                          <td className="py-2 pr-4" style={{ color: "var(--ua-ink)" }}>{lesson.title}</td>
                          <td className="py-2 pr-4" style={{ color: "var(--ua-ink)", opacity: 0.7 }}>{lesson.video_provider ?? "—"}</td>
                          <td
                            className="py-2 pr-4 max-w-[200px] truncate"
                            style={{ color: "var(--ua-ink)", opacity: 0.7 }}
                            title={lesson.video_id ?? ""}
                          >
                            {lesson.video_id ?? "—"}
                          </td>
                          <td className="py-2" style={{ color: "var(--ua-ink)", opacity: 0.7 }}>{lesson.order}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Inline edit forms */}
                  <div className="space-y-6">
                    {dayLessons.map((lesson) => (
                      <div
                        key={`edit-${lesson.id}`}
                        className="rounded-xl p-4"
                        style={{ backgroundColor: "var(--ua-bg)" }}
                      >
                        <p
                          className="text-xs font-semibold uppercase tracking-widest mb-2"
                          style={{ color: "var(--ua-ink)", opacity: 0.5 }}
                        >
                          Edit: {lesson.title}
                        </p>
                        <LessonEditForm lesson={lesson} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
