"use server";

import { redirect } from "next/navigation";
import { createCheckoutSession } from "@/lib/stripe";

export async function startEnrolmentCheckout(): Promise<void> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const res = await createCheckoutSession({
    successUrl: `${base}/pricing/success`,
    cancelUrl: `${base}/pricing?checkout=cancelled`,
  });
  if (!res.ok || !res.url) {
    console.error("[startEnrolmentCheckout] could not start checkout:", res.error);
    redirect(`/pricing?error=${encodeURIComponent("Sorry — we couldn't start checkout. Please try again.")}`);
  }
  redirect(res.url);
}
