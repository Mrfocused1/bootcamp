import { Hero } from "@/components/marketing/Hero";
import { HorizontalWords } from "@/components/marketing/sections/HorizontalWords";
import { Future } from "@/components/marketing/sections/Future";
import { Proof } from "@/components/marketing/sections/Proof";
import { Curriculum } from "@/components/marketing/sections/Curriculum";
import { Testimonials } from "@/components/marketing/sections/Testimonials";
import { Marquee } from "@/components/marketing/Marquee";
import { FinalCta } from "@/components/marketing/sections/FinalCta";
import { MARQUEE_ITEMS } from "@/lib/marketing/content";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HorizontalWords />
      <Future />
      <Proof />
      <Curriculum />
      <Marquee items={MARQUEE_ITEMS} />
      <Testimonials />
      <FinalCta />
    </>
  );
}
