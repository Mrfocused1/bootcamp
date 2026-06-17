import { getAiMessages } from "@/lib/queries";
import { replyToQuestionAction, markResolvedAction } from "@/app/(app)/admin/actions";

function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export default async function AdminQaPage() {
  const messages = await getAiMessages();

  // Group into user+assistant pairs
  const pairs: { question: (typeof messages)[0]; answer: (typeof messages)[0] | null }[] = [];
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].role === "user") {
      pairs.push({
        question: messages[i],
        answer: messages[i + 1]?.role === "assistant" ? messages[i + 1] : null,
      });
      if (messages[i + 1]?.role === "assistant") i++;
    }
  }

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
          Q&amp;A log
        </h1>
        <p className="text-sm" style={{ color: "var(--ua-ink)", opacity: 0.55 }}>
          All AI assistant conversations across students. Reply or mark as resolved.
        </p>
      </section>

      {pairs.length === 0 ? (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: "#fff" }}>
          <p className="text-sm" style={{ color: "var(--ua-ink)", opacity: 0.5 }}>
            No AI conversations yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pairs.map(({ question, answer }) => (
            <div
              key={question.id}
              className="rounded-2xl p-5 space-y-3"
              style={{ backgroundColor: "#fff" }}
            >
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "var(--ua-ink)", opacity: 0.4 }}
                >
                  {formatTime(question.created_at)}
                </span>
                {question.lesson_id && (
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-semibold"
                    style={{ backgroundColor: "var(--ua-sky)", color: "var(--ua-ink)" }}
                  >
                    {question.lesson_id}
                  </span>
                )}
              </div>

              {/* Question */}
              <div
                className="rounded-xl p-3"
                style={{ backgroundColor: "var(--ua-pink)" }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{ color: "var(--ua-ink)", opacity: 0.5 }}
                >
                  Student question
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--ua-ink)" }}>
                  {question.content}
                </p>
              </div>

              {/* AI reply */}
              {answer && (
                <div
                  className="rounded-xl p-3"
                  style={{ backgroundColor: "var(--ua-green)" }}
                >
                  <p
                    className="text-xs font-semibold uppercase tracking-widest mb-1"
                    style={{ color: "var(--ua-ink)", opacity: 0.5 }}
                  >
                    AI reply · {formatTime(answer.created_at)}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--ua-ink)" }}>
                    {answer.content}
                  </p>
                </div>
              )}

              {/* Admin reply form */}
              <div
                className="rounded-xl p-3 space-y-2"
                style={{ backgroundColor: "var(--ua-bg)", border: "1px solid rgba(20,20,20,0.1)" }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "var(--ua-ink)", opacity: 0.5 }}
                >
                  Admin reply
                </p>
                <form
                  id={`reply-${question.id}`}
                  action={replyToQuestionAction.bind(null, question.id)}
                  className="flex flex-col gap-2"
                >
                  <textarea
                    name="reply"
                    rows={3}
                    placeholder="Write a reply to escalate or clarify..."
                    required
                    className="rounded-xl border border-[var(--ua-ink)]/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ua-blue)] resize-none w-full"
                    style={{ color: "var(--ua-ink)" }}
                  />
                </form>
                <div className="flex items-center gap-2 justify-between">
                  <form action={markResolvedAction.bind(null, question.id)}>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold transition-opacity hover:opacity-80"
                      style={{
                        backgroundColor: "var(--ua-green)",
                        color: "var(--ua-ink)",
                        border: "1px solid rgba(20,20,20,0.1)",
                      }}
                    >
                      Mark resolved
                    </button>
                  </form>
                  <button
                    type="submit"
                    form={`reply-${question.id}`}
                    className="inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
                    style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
                  >
                    Send reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
