import Link from "next/link";
import { getCurrentProfile } from "@/lib/queries";
import { getCrmTeam } from "@/lib/crm";
import { createLead } from "@/app/(app)/admin/crm/actions";
import { LeadForm } from "@/components/crm/LeadForm";
import { Reveal } from "@/components/marketing/Reveal";

export const metadata = { title: "New lead — CRM" };

export default async function NewLeadPage({
  searchParams,
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? sp.error : null;
  const [profile, team] = await Promise.all([getCurrentProfile(), getCrmTeam()]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Reveal>
        <Link href="/admin/crm/leads" className="text-sm font-bold text-ua-blue hover:underline">← Back to leads</Link>
        <h1 className="mt-2 text-3xl font-black lowercase tracking-tight text-ua-ink md:text-4xl" style={{ fontFamily: "var(--font-epilogue)" }}>
          new lead
        </h1>
        <p className="mt-2 text-sm text-ua-ink/60">
          Log a potential client so the whole team can see who&apos;s on it — no double-contacting.
        </p>
      </Reveal>

      {error && (
        <div className="rounded-2xl border-2 border-ua-ink bg-ua-orange/20 p-4 text-sm font-semibold text-ua-ink">
          Couldn&apos;t save: {error}
        </div>
      )}

      <Reveal>
        <LeadForm team={team} action={createLead} submitLabel="Create lead" currentUserId={profile.id} />
      </Reveal>
    </div>
  );
}
