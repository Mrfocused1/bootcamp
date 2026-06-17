"use server";

import { redirect } from "next/navigation";
import { sendEmail } from "@/lib/email";
import { SITE } from "@/lib/marketing/content";

function field(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export async function submitContactForm(formData: FormData): Promise<void> {
  // Honeypot: bots fill the hidden "company" field; real users never see it.
  if (field(formData, "company")) redirect("/contact?sent=1");

  const name = field(formData, "name");
  const email = field(formData, "email");
  const message = field(formData, "message");

  if (!email || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    redirect(`/contact?error=${encodeURIComponent("Please add a valid email and a message.")}`);
  }

  const res = await sendEmail({
    to: SITE.email,
    subject: `New enquiry from ${name || email}`,
    text: `Name: ${name || "(not given)"}\nEmail: ${email}\n\nMessage:\n${message}`,
    replyTo: email,
  });

  if (!res.ok) {
    console.error("[submitContactForm] send failed:", res.error);
    redirect(`/contact?error=${encodeURIComponent("Sorry — your message didn't send. Please email us directly.")}`);
  }
  redirect("/contact?sent=1");
}
