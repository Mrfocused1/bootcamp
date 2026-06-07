import { Hero } from "@/components/marketing/Hero";
import { HorizontalWords } from "@/components/marketing/sections/HorizontalWords";
import { Marquee } from "@/components/marketing/Marquee";
import { Features } from "@/components/marketing/sections/Features";
import { Syllabus } from "@/components/marketing/sections/Syllabus";
import { JoinClub } from "@/components/marketing/sections/JoinClub";
import { FinalCta } from "@/components/marketing/sections/FinalCta";
import { MARQUEE_ITEMS } from "@/lib/marketing/content";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HorizontalWords />
      <Marquee items={MARQUEE_ITEMS} />
      <Features />
      <Syllabus />
      <JoinClub />
      <FinalCta />
    </>
  );
}
