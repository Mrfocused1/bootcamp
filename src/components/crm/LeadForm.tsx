import type { Lead, CrmMember } from "@/lib/types";
import {
  STATUS_ORDER, STATUS_META, SOURCE_ORDER, SOURCE_LABELS, PRIORITY_ORDER, PRIORITY_META,
} from "@/lib/crm-constants";

const FIELD =
  "rounded-xl border-2 border-ua-ink/20 bg-ua-bg px-3 py-2 text-sm text-ua-ink focus:border-ua-blue focus:outline-none";
const LABEL = "text-[11px] font-bold uppercase tracking-widest text-ua-ink/50";

/** ISO → value for <input type="datetime-local"> (local time). */
function toLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function LeadForm({
  lead,
  team,
  action,
  submitLabel,
  currentUserId,
}: {
  lead?: Lead | null;
  team: CrmMember[];
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  currentUserId: string;
}) {
  return (
    <form action={action} className="space-y-6 rounded-3xl border-2 border-ua-ink bg-white p-5 shadow-[6px_6px_0_var(--ua-ink)] md:p-7">
      {lead && <input type="hidden" name="id" value={lead.id} />}

      {/* Identity */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1 md:col-span-2">
          <label htmlFor="company" className={LABEL}>Company / organisation *</label>
          <input id="company" name="company" required defaultValue={lead?.company ?? ""} placeholder="e.g. Northside Boxing Club" className={FIELD} />
        </div>
        <div className="flex flex-col gap-1 md:col-span-2">
          <label htmlFor="website" className={LABEL}>Website</label>
          <input id="website" name="website" type="url" defaultValue={lead?.website ?? ""} placeholder="https://example.co.uk" className={FIELD} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="contact_name" className={LABEL}>Contact name</label>
          <input id="contact_name" name="contact_name" defaultValue={lead?.contact_name ?? ""} placeholder="Full name" className={FIELD} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className={LABEL}>Email</label>
          <input id="email" name="email" type="email" defaultValue={lead?.email ?? ""} placeholder="name@example.co.uk" className={FIELD} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className={LABEL}>Phone</label>
          <input id="phone" name="phone" type="tel" defaultValue={lead?.phone ?? ""} placeholder="+44 …" className={FIELD} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="est_value" className={LABEL}>Estimated value (£)</label>
          <input id="est_value" name="est_value" type="number" min="0" step="50" defaultValue={lead?.est_value ?? 0} className={FIELD} />
        </div>
      </div>

      {/* Pipeline */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="status" className={LABEL}>Stage</label>
          <select id="status" name="status" defaultValue={lead?.status ?? "new"} className={FIELD}>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>{STATUS_META[s].label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="source" className={LABEL}>Source</label>
          <select id="source" name="source" defaultValue={lead?.source ?? "other"} className={FIELD}>
            {SOURCE_ORDER.map((s) => (
              <option key={s} value={s}>{SOURCE_LABELS[s]}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="priority" className={LABEL}>Priority</label>
          <select id="priority" name="priority" defaultValue={lead?.priority ?? "medium"} className={FIELD}>
            {PRIORITY_ORDER.map((p) => (
              <option key={p} value={p}>{PRIORITY_META[p].label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="assigned_to" className={LABEL}>Assigned to</label>
          <select id="assigned_to" name="assigned_to" defaultValue={lead?.assigned_to ?? currentUserId} className={FIELD}>
            {team.map((m) => (
              <option key={m.id} value={m.id}>{m.name}{m.crm_role === "owner" ? " (owner)" : ""}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 md:col-span-2">
          <label htmlFor="next_follow_up_at" className={LABEL}>Next follow-up</label>
          <input id="next_follow_up_at" name="next_follow_up_at" type="datetime-local" defaultValue={toLocalInput(lead?.next_follow_up_at)} className={FIELD} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className={LABEL}>Notes</label>
        <textarea id="notes" name="notes" rows={4} defaultValue={lead?.notes ?? ""} placeholder="What do they need? Budget, timeline, who referred them…" className={`${FIELD} resize-y`} />
      </div>

      <div className="flex items-center justify-end gap-3">
        <button type="submit" className="rounded-full border-2 border-ua-ink bg-ua-blue px-6 py-2.5 text-sm font-bold text-white shadow-[4px_4px_0_var(--ua-ink)] transition-transform hover:-translate-y-0.5" style={{ fontFamily: "var(--font-epilogue)" }}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
