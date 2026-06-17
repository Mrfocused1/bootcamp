import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Thank you — Bridgeway AI Bootcamp",
  description: "Your enrolment payment was received.",
};

export default function CheckoutSuccessPage() {
  return (
    <>
      <PageHero
        eyebrow="you're in"
        title="thank you"
        intro="Your payment was received — we'll email you shortly to set up your access."
        sticker="hundred"
      />
      <section className="bg-ua-bg px-6 py-24 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-lg text-ua-ink/80">
            Thanks for enrolling in the Bridgeway AI Bootcamp. Stripe has emailed you a
            receipt, and we&apos;ll be in touch with your access details and the schedule.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-ua-blue px-7 py-3 text-lg font-bold text-ua-bg hover:opacity-90"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            Back to home →
          </Link>
        </div>
      </section>
    </>
  );
}
