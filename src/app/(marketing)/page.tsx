import { Hero } from "@/components/marketing/Hero";
import { HorizontalWords } from "@/components/marketing/sections/HorizontalWords";
import { Future } from "@/components/marketing/sections/Future";
import { Build } from "@/components/marketing/sections/Build";
import { Proof } from "@/components/marketing/sections/Proof";
import { Curriculum } from "@/components/marketing/sections/Curriculum";
import { Marquee } from "@/components/marketing/Marquee";
import { Features } from "@/components/marketing/sections/Features";
import { JoinClub } from "@/components/marketing/sections/JoinClub";
import { FinalCta } from "@/components/marketing/sections/FinalCta";
import { MARQUEE_ITEMS } from "@/lib/marketing/content";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HorizontalWords />
      <Future />
      <Build />
      <Proof />
      <Curriculum />
      <Marquee items={MARQUEE_ITEMS} />
      <Features />
      <JoinClub />
      <FinalCta />
    </>
  );
}
