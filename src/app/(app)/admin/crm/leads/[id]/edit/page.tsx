import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentProfile } from "@/lib/queries";
import { getLeadById, getCrmTeam } from "@/lib/crm";
import { updateLead } from "@/app/(app)/admin/crm/actions";
import { LeadForm } from "@/components/crm/LeadForm";
import { Reveal } from "@/components/marketing/Reveal";

export const metadata = { title: "Edit lead — CRM" };

export default async function EditLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [profile, lead, team] = await Promise.all([
    getCurrentProfile(),
    getLeadById(id),
    getCrmTeam(),
  ]);
  if (!lead) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Reveal>
        <Link href={`/admin/crm/leads/${id}`} className="text-sm font-bold text-ua-blue hover:underline">← Back to {lead.company}</Link>
        <h1 className="mt-2 text-3xl font-black lowercase tracking-tight text-ua-ink md:text-4xl" style={{ fontFamily: "var(--font-epilogue)" }}>
          edit lead
        </h1>
      </Reveal>
      <Reveal>
        <LeadForm lead={lead} team={team} action={updateLead} submitLabel="Save changes" currentUserId={profile.id} />
      </Reveal>
    </div>
  );
}
