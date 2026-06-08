import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { ScribbleTransition } from "@/components/marketing/ScribbleTransition";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScribbleTransition />
      <MarketingNav />
      <main>{children}</main>
      <MarketingFooter />
    </>
  );
}
