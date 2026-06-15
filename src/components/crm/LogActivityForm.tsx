"use client";

import { useState } from "react";
import { logActivity } from "@/app/(app)/admin/crm/actions";
import {
  ACTIVITY_TYPE_ORDER, ACTIVITY_TYPE_META, OUTCOME_ORDER, OUTCOME_LABELS,
} from "@/lib/crm-constants";
import type { ActivityType } from "@/lib/types";

const FIELD =
  "rounded-xl border-2 border-ua-ink/20 bg-ua-bg px-3 py-2 text-sm text-ua-ink focus:border-ua-blue focus:outline-none";
const LABEL = "text-[11px] font-bold uppercase tracking-widest text-ua-ink/50";

export function LogActivityForm({ leadId }: { leadId: string }) {
  const [type, setType] = useState<ActivityType>("call");
  const isNote = type === "note";

  return (
    <form action={logActivity} className="space-y-4">
      <input type="hidden" name="lead_id" value={leadId} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="type" className={LABEL}>Type</label>
          <select id="type" name="type" value={type} onChange={(e) => setType(e.target.value as ActivityType)} className={FIELD}>
            {ACTIVITY_TYPE_ORDER.map((t) => (
              <option key={t} value={t}>{ACTIVITY_TYPE_META[t].label}</option>
            ))}
          </select>
        </div>
        {!isNote && (
          <div className="flex flex-col gap-1">
            <label htmlFor="direction" className={LABEL}>Direction</label>
            <select id="direction" name="direction" defaultValue="outbound" className={FIELD}>
              <option value="outbound">Outbound</option>
              <option value="inbound">Inbound</option>
            </select>
          </div>
        )}
        {!isNote && (
          <div className="flex flex-col gap-1">
            <label htmlFor="outcome" className={LABEL}>Outcome</label>
            <select id="outcome" name="outcome" defaultValue="" className={FIELD}>
              <option value="">— select —</option>
              {OUTCOME_ORDER.map((o) => (
                <option key={o} value={o}>{OUTCOME_LABELS[o]}</option>
              ))}
            </select>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <label htmlFor="occurred_at" className={LABEL}>When</label>
          <input id="occurred_at" name="occurred_at" type="datetime-local" className={FIELD} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className={LABEL}>What happened?</label>
        <textarea id="notes" name="notes" rows={3} required placeholder="e.g. Spoke to the owner — wants memberships sold online, budget ~£2.5k. Sending a scope." className={`${FIELD} resize-y`} />
      </div>

      <div className="flex flex-col gap-1 sm:max-w-xs">
        <label htmlFor="follow_up_at" className={LABEL}>Schedule next follow-up (optional)</label>
        <input id="follow_up_at" name="follow_up_at" type="datetime-local" className={FIELD} />
      </div>

      <div className="flex justify-end">
        <button type="submit" className="rounded-full border-2 border-ua-ink bg-ua-blue px-6 py-2.5 text-sm font-bold text-white shadow-[4px_4px_0_var(--ua-ink)] transition-transform hover:-translate-y-0.5" style={{ fontFamily: "var(--font-epilogue)" }}>
          Log outreach
        </button>
      </div>
    </form>
  );
}
