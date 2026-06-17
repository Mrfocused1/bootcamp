import Stripe from "stripe";
import { sendEmail } from "@/lib/email";
import { SITE } from "@/lib/marketing/content";

export const runtime = "nodejs";

export async function POST(req: Request): Promise<Response> {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    console.error("[stripe webhook] missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    return new Response("Webhook not configured", { status: 500 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(secretKey);
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed:", (err as Error).message);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const amount = ((session.amount_total ?? 0) / 100).toFixed(2);
    const currency = (session.currency ?? "gbp").toUpperCase();
    const email = session.customer_details?.email ?? "unknown";
    const name = session.customer_details?.name ?? "";
    await sendEmail({
      to: SITE.email,
      subject: `💷 New payment — ${currency} ${amount} from ${email}`,
      text: `You received a payment.\n\nAmount: ${currency} ${amount}\nCustomer: ${name || "(no name)"} <${email}>\nSession: ${session.id}`,
      replyTo: email !== "unknown" ? email : undefined,
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
