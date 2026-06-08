"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";
import { Scribble } from "@/components/marketing/Scribble";
import { prefersReducedMotion } from "@/lib/marketing/reducedMotion";

gsap.registerPlugin(ScrollTrigger);

const TARGET = 50;

export function Proof() {
  // Animated count-up number node — kept separate from the static heading text
  // so the heading always contains the literal words "real websites".
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const numEl = numberRef.current;
    if (numEl) {
      if (prefersReducedMotion()) {
        numEl.textContent = `${TARGET}+`;
      } else {
        const counter = { val: 0 };
        const ctx = gsap.context(() => {
          gsap.to(counter, {
            val: TARGET,
            duration: 1.6,
            ease: "power2.out",
            snap: { val: 1 },
            onUpdate: () => {
              numEl.textContent = `${Math.round(counter.val)}+`;
            },
            scrollTrigger: { trigger: numEl, start: "top 85%", once: true },
          });
        }, numEl);
        return () => ctx.revert();
      }
    }
  }, []);

  return (
    <section className="relative overflow-hidden bg-ua-bg px-6 py-28 md:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Centered results statement */}
        <div className="relative mx-auto max-w-4xl text-center">
          <Sticker
            name="hundred"
            size={96}
            rotate={-12}
            className="absolute -top-10 left-0 z-10 hidden sm:block md:-left-6"
          />
          <Sticker
            name="smiley"
            size={88}
            rotate={14}
            className="absolute -top-12 right-0 z-10 hidden sm:block md:-right-6"
          />

          <Reveal>
            <h2
              className="text-4xl font-black leading-[1.05] tracking-tight text-ua-ink sm:text-5xl md:text-6xl"
              style={{ fontFamily: "var(--font-epilogue)" }}
            >
              We&apos;ve helped clients build over{" "}
              <span className="relative inline-block">
                <span ref={numberRef} className="text-ua-blue">
                  {TARGET}+
                </span>
                {/* Hand-drawn underline under the number */}
                <Scribble
                  color="var(--ua-blue)"
                  strokeWidth={10}
                  className="pointer-events-none absolute -bottom-6 left-0 h-6 w-full"
                />
              </span>{" "}
              real websites.
            </h2>
          </Reveal>

          <Reveal>
            <p
              className="mt-12 inline-block -rotate-3 text-2xl text-ua-ink/80 md:text-3xl"
              style={{ fontFamily: "var(--font-lora)" }}
            >
              not to brag!
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
