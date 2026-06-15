"use client";

import { deleteLead } from "@/app/(app)/admin/crm/actions";

export function DeleteLeadButton({ leadId, company }: { leadId: string; company: string }) {
  return (
    <form
      action={deleteLead}
      onSubmit={(e) => {
        if (!confirm(`Delete "${company}"? This removes the lead and its entire outreach history. This can't be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={leadId} />
      <button
        type="submit"
        className="rounded-full border-2 border-ua-orange px-4 py-2 text-sm font-bold text-ua-orange transition-colors hover:bg-ua-orange hover:text-white"
      >
        Delete lead
      </button>
    </form>
  );
}
