import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/queries";
import { isAdmin } from "@/lib/admin";
import { AdminNav } from "@/components/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!isAdmin(profile)) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 md:py-12">
      <AdminNav />
      {children}
    </div>
  );
}
