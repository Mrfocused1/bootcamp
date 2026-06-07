import { getStudents } from "@/lib/queries";
import { setAccess } from "@/app/(app)/admin/actions";

export default async function AdminStudentsPage() {
  const students = await getStudents();

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
          students
        </h1>
        <p className="text-sm" style={{ color: "var(--ua-ink)", opacity: 0.55 }}>
          Manage student access and review progress.
        </p>
      </section>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: "#fff" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(20,20,20,0.1)" }}>
                {["Name", "Email", "Cohort", "Overall %", "Access"].map((h) => (
                  <th
                    key={h}
                    className="py-3 px-4 text-left font-semibold text-xs uppercase tracking-widest"
                    style={{ color: "var(--ua-ink)", opacity: 0.5 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map(({ profile, cohort, overallPercent }) => (
                <tr
                  key={profile.id}
                  style={{ borderBottom: "1px solid rgba(20,20,20,0.06)" }}
                >
                  <td className="py-3 px-4 font-medium" style={{ color: "var(--ua-ink)" }}>
                    {profile.name}
                  </td>
                  <td className="py-3 px-4" style={{ color: "var(--ua-ink)", opacity: 0.7 }}>
                    {profile.email}
                  </td>
                  <td className="py-3 px-4" style={{ color: "var(--ua-ink)", opacity: 0.7 }}>
                    {cohort.name}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 rounded-full flex-1 max-w-[80px]"
                        style={{ backgroundColor: "rgba(20,20,20,0.1)" }}
                      >
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${overallPercent}%`,
                            backgroundColor: "var(--ua-blue)",
                          }}
                        />
                      </div>
                      <span style={{ color: "var(--ua-ink)", opacity: 0.7 }}>
                        {overallPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <form action={setAccess.bind(null, profile.id, "active")}>
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold transition-opacity hover:opacity-80"
                          style={{ backgroundColor: "var(--ua-green)", color: "var(--ua-ink)" }}
                        >
                          Grant
                        </button>
                      </form>
                      <form action={setAccess.bind(null, profile.id, "revoked")}>
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold transition-opacity hover:opacity-80"
                          style={{ backgroundColor: "var(--ua-orange)", color: "#fff" }}
                        >
                          Revoke
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {students.length === 0 && (
          <p className="p-6 text-center text-sm" style={{ color: "var(--ua-ink)", opacity: 0.5 }}>
            No students enrolled yet.
          </p>
        )}
      </div>
    </div>
  );
}
