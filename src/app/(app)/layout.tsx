import { AppNav } from "@/components/AppNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppNav />
      <main className="flex-1">{children}</main>
    </>
  );
}
