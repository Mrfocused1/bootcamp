import { AppNav } from "@/components/AppNav";
import { AppFooter } from "@/components/AppFooter";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-ua-bg">
      <AppNav />
      <main className="flex-1">{children}</main>
      <AppFooter />
    </div>
  );
}
