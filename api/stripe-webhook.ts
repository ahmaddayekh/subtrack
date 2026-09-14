import { getAdminDb } from "./_lib/firebaseAdmin.js";
import { stripe } from "./_lib/stripe.js";
import type Stripe from "stripe";

export const config = {
  api: { bodyParser: false },
};

function readRawBody(req: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req: any, res: any) {
  const db = getAdminDb();
  const signature = req.headers["stripe-signature"];
  const rawBody = await readRawBody(req);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? "",
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    res.status(400).send("Invalid signature");
    return;
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const uid = session.client_reference_id;
      if (uid) {
        await db.collection("users").doc(uid).set(
          {
            plan: "pro",
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            subscriptionStatus: "active",
            updatedAt: new Date().toISOString(),
          },
          { merge: true },
        );
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const usersQuery = await db
        .collection("users")
        .where("stripeCustomerId", "==", customerId)
        .limit(1)
        .get();
      if (!usersQuery.empty) {
        const isActive =
          subscription.status === "active" || subscription.status === "trialing";
        await usersQuery.docs[0].ref.set(
          {
            plan: isActive ? "pro" : "free",
            subscriptionStatus: subscription.status,
            updatedAt: new Date().toISOString(),
          },
          { merge: true },
        );
      }
      break;
    }
    default:
      break;
  }

  res.status(200).send("ok");
}
