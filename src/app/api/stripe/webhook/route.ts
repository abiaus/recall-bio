import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: "Missing signature or secret" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed.", err.message);
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    // Initialize Supabase admin client to bypass RLS for profile updates
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.customer && session.subscription) {
          // Verify customer exists in our DB, if not, find by email from session or metadata
          const customerId = session.customer as string;
          const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("id")
            .eq("stripe_customer_id", customerId)
            .maybeSingle();

          if (profile) {
            await supabaseAdmin
              .from("profiles")
              .update({
                plan: "premium",
                stripe_subscription_id: session.subscription as string,
              })
              .eq("id", profile.id);
          } else if (session.client_reference_id) {
             // Fallback if client_reference_id was passed
             await supabaseAdmin
              .from("profiles")
              .update({
                plan: "premium",
                stripe_customer_id: customerId,
                stripe_subscription_id: session.subscription as string,
              })
              .eq("id", session.client_reference_id);
          }
        }
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const status = subscription.status;
        const customerId = subscription.customer as string;

        // If not active or trialing, revert to free
        if (status !== "active" && status !== "trialing") {
          await supabaseAdmin
            .from("profiles")
            .update({
              plan: "free",
              stripe_subscription_id: null,
            })
            .eq("stripe_customer_id", customerId);
        } else {
          await supabaseAdmin
            .from("profiles")
            .update({
              plan: "premium",
              stripe_subscription_id: subscription.id,
            })
            .eq("stripe_customer_id", customerId);
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await supabaseAdmin
          .from("profiles")
          .update({
            plan: "free",
            stripe_subscription_id: null,
          })
          .eq("stripe_customer_id", customerId);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook processing failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
