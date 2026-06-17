import Stripe from "stripe";
import { IS_MOCK } from "@/lib/mock";

export interface CheckoutResult {
  ok: boolean;
  url?: string;
  error?: string;
  mocked?: boolean;
}

export async function createCheckoutSession(input: {
  successUrl: string;
  cancelUrl: string;
}): Promise<CheckoutResult> {
  if (IS_MOCK) return { ok: true, url: input.successUrl, mocked: true };

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) return { ok: false, error: "STRIPE_PRICE_ID is not set" };

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return { ok: false, error: "STRIPE_SECRET_KEY is not set" };

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
    });
    if (!session.url) return { ok: false, error: "Stripe did not return a checkout URL" };
    return { ok: true, url: session.url };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
