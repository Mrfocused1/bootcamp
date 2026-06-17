"use client";

import { useState } from "react";
import { sendLeadEmail } from "@/app/(app)/admin/crm/actions";

const FIELD =
  "rounded-xl border-2 border-ua-ink/20 bg-ua-bg px-3 py-2 text-sm text-ua-ink focus:border-ua-blue focus:outline-none";
const LABEL = "text-[11px] font-bold uppercase tracking-widest text-ua-ink/50";

export interface RenderedTemplate {
  id: string;
  label: string;
  subject: string;
  body: string;
}

export function SendEmailForm({
  leadId,
  hasEmail,
  templates,
}: {
  leadId: string;
  hasEmail: boolean;
  templates: RenderedTemplate[];
}) {
  const first = templates[0];
  const [subject, setSubject] = useState(first?.subject ?? "");
  const [body, setBody] = useState(first?.body ?? "");

  function pick(id: string) {
    const t = templates.find((x) => x.id === id);
    if (t) {
      setSubject(t.subject);
      setBody(t.body);
    }
  }

  return (
    <form action={sendLeadEmail} className="space-y-4">
      <input type="hidden" name="lead_id" value={leadId} />

      <div className="flex flex-col gap-1">
        <label htmlFor="template" className={LABEL}>Template</label>
        <select id="template" defaultValue={first?.id} onChange={(e) => pick(e.target.value)} className={FIELD}>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="subject" className={LABEL}>Subject</label>
        <input id="subject" name="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required className={FIELD} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="body" className={LABEL}>Message</label>
        <textarea id="body" name="body" value={body} onChange={(e) => setBody(e.target.value)} rows={12} required className={`${FIELD} resize-y`} />
      </div>

      <div className="flex flex-col gap-1 sm:max-w-xs">
        <label htmlFor="follow_up_at" className={LABEL}>Schedule follow-up (optional)</label>
        <input id="follow_up_at" name="follow_up_at" type="datetime-local" className={FIELD} />
      </div>

      <div className="flex items-center justify-end gap-3">
        {!hasEmail && <span className="text-xs text-ua-ink/50">Add an email to this lead to send.</span>}
        <button
          type="submit"
          disabled={!hasEmail}
          className="rounded-full border-2 border-ua-ink bg-ua-blue px-6 py-2.5 text-sm font-bold text-white shadow-[4px_4px_0_var(--ua-ink)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          Send email
        </button>
      </div>
    </form>
  );
}
