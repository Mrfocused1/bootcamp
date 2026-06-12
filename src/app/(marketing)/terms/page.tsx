import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { LegalBody, type LegalSection } from "@/components/marketing/LegalBody";
import { SITE } from "@/lib/marketing/content";

export const metadata: Metadata = {
  title: "Terms of Service — Bridgeway AI Bootcamp",
  description:
    "The terms that govern your use of Bridgeway AI Bootcamp — enrolment, payment, refunds, acceptable use, and intellectual property.",
};

const SECTIONS: LegalSection[] = [
  {
    heading: "agreement to these terms",
    paras: [
      `These terms govern your access to and use of the Bridgeway AI Bootcamp website, course and related services ("the Service"). By enrolling, creating an account, or using the Service, you agree to these terms. If you do not agree, please do not use the Service.`,
    ],
  },
  {
    heading: "the service",
    paras: [
      "Bridgeway AI Bootcamp is a live, online course that teaches you how to build and ship websites with AI. It includes live sessions, recordings, course materials, a student dashboard and Q&A support, as described on our website at the time of purchase.",
      "We may update or improve the course content and platform over time. We aim to keep the core of what you bought available to you, but specific tools, schedules or features may change.",
    ],
  },
  {
    heading: "your account",
    paras: [
      "You must provide accurate information and keep your login secure. You're responsible for activity that happens under your account. Access is for you personally — please don't share your login or course access with others.",
      "You must be old enough to enter a binding contract in your country to enrol.",
    ],
  },
  {
    heading: "payment and refunds",
    paras: [
      "Prices are shown at checkout and are payable in full to enrol, unless a payment plan is offered. Payments are handled by our third-party payment provider.",
      "If something isn't right with your purchase, contact us and we'll look into it. Nothing in these terms affects any rights you have under applicable consumer law.",
    ],
  },
  {
    heading: "acceptable use",
    paras: [
      "You agree not to misuse the Service — including by disrupting live sessions, harassing other students or staff, attempting to access areas or accounts you're not authorised to, or using the Service for anything unlawful.",
      "We may suspend or end your access if you breach these terms or behave in a way that harms other students, our staff, or the Service.",
    ],
  },
  {
    heading: "intellectual property",
    paras: [
      "All course materials — including videos, recordings, slides, templates, prompts and written content — are owned by Bridgeway or our licensors and are provided for your personal learning only.",
      "You may not copy, record, redistribute, resell, publish or share the course materials, in whole or in part, without our written permission. You keep ownership of the projects and websites you build during the course.",
    ],
  },
  {
    heading: "limitation of liability",
    paras: [
      "The Service is provided on an “as is” and “as available” basis. To the fullest extent permitted by law, Bridgeway is not liable for any indirect or consequential loss arising from your use of the Service. Nothing in these terms limits liability that cannot be limited by law.",
    ],
  },
  {
    heading: "termination",
    paras: [
      "You can stop using the Service at any time. We may suspend or terminate access if you breach these terms. Some provisions — including intellectual property, disclaimers and limitation of liability — survive termination.",
    ],
  },
  {
    heading: "governing law",
    paras: [
      "These terms are governed by the laws of England and Wales, and the courts of England and Wales will have jurisdiction, unless local consumer law in your country provides otherwise.",
    ],
  },
  {
    heading: "changes and contact",
    paras: [
      "We may update these terms from time to time; the “last updated” date above will reflect any changes, and continued use of the Service means you accept the updated terms.",
      `Questions about these terms? Email us at ${SITE.email}.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="the rules"
        title="terms of service"
        intro="The plain-language terms for enrolling in and using Bridgeway AI Bootcamp."
        sticker="hundred"
        underlineColor="text-ua-green"
      />
      <LegalBody
        lastUpdated="8 June 2026"
        intro="These terms set out the deal between you and Bridgeway AI Bootcamp when you enrol. We've kept them as clear as we can."
        sections={SECTIONS}
      />
    </>
  );
}
