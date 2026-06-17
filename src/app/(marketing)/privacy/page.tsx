import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { LegalBody, type LegalSection } from "@/components/marketing/LegalBody";
import { SITE } from "@/lib/marketing/content";

export const metadata: Metadata = {
  title: "Privacy Policy — Bridgeway AI Bootcamp",
  description:
    "How Bridgeway AI Bootcamp collects, uses and protects your personal data, and the rights you have over it.",
};

const SECTIONS: LegalSection[] = [
  {
    heading: "who we are",
    paras: [
      `Bridgeway AI Bootcamp ("Bridgeway", "we", "us") provides a live, online course that teaches people how to build and ship websites with AI. This policy explains what personal data we collect when you use our website and course, how we use it, and the choices you have.`,
      `If you have any questions about this policy or your data, contact us at ${SITE.email}.`,
    ],
  },
  {
    heading: "information we collect",
    paras: [
      "Account details you give us: your name and email address when you enrol or create an account, and any information you choose to share when you contact us.",
      "Course activity: which lessons you watch, your progress and completion, and your chosen schedule — so we can run the course and show you your progress.",
      "Payment information: payments are processed by our third-party payment provider. We do not see or store your full card details — only a confirmation that a payment was made.",
      "Technical data: basic information your browser sends automatically, such as device type, and limited analytics about how the site is used.",
    ],
  },
  {
    heading: "how we use your data",
    paras: [
      "To deliver the course — give you access to lessons, recordings, live sessions and your dashboard, and to track your progress.",
      "To communicate with you — send login links, schedule and session reminders, important course updates, and replies to your enquiries.",
      "To improve the course and website, keep them secure, and meet our legal and accounting obligations.",
    ],
  },
  {
    heading: "who we share it with",
    paras: [
      "We do not sell your personal data. We share it only with the service providers we need to run the course — for example our payment processor, email provider, video-call platform (for live sessions), and hosting infrastructure.",
      "These providers may only use your data to perform services for us, and we share the minimum needed. We may also disclose data where required by law.",
    ],
  },
  {
    heading: "cookies",
    paras: [
      "We use a small number of cookies and similar technologies to keep you signed in, remember your preferences, and understand how the site is used. You can control cookies through your browser settings, though some features may not work without them.",
    ],
  },
  {
    heading: "how long we keep it",
    paras: [
      "We keep your account and course data for as long as you have an account and your lifetime access to the recordings, and as long as needed to meet legal and accounting requirements. You can ask us to delete your account at any time.",
    ],
  },
  {
    heading: "your rights",
    paras: [
      "Depending on where you live (including under UK and EU data protection law), you have the right to access the personal data we hold about you, to correct it, to ask us to delete it, and to object to or restrict certain processing.",
      `To exercise any of these rights, email us at ${SITE.email} and we'll respond within a reasonable time.`,
    ],
  },
  {
    heading: "security",
    paras: [
      "We take reasonable technical and organisational measures to protect your data. No method of transmission or storage is completely secure, but we work to keep your information safe and to limit who can access it.",
    ],
  },
  {
    heading: "children",
    paras: [
      "The course is intended for adults. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, contact us and we will delete it.",
    ],
  },
  {
    heading: "changes to this policy",
    paras: [
      "We may update this policy from time to time. When we do, we'll change the “last updated” date above, and significant changes will be communicated to enrolled students.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="your data"
        title="privacy policy"
        intro="What we collect, how we use it, and the control you have over your information."
        sticker="heart"
        underlineColor="text-ua-sky"
      />
      <LegalBody
        lastUpdated="8 June 2026"
        intro="We keep this short and human. Here's exactly what data Bridgeway AI Bootcamp collects and why — and how to reach us if you have any questions."
        sections={SECTIONS}
      />
    </>
  );
}
