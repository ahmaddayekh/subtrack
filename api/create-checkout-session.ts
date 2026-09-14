import { getAdminDb } from "./_lib/firebaseAdmin.js";
import { stripe } from "./_lib/stripe.js";
import { requireUser } from "./_lib/auth.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const decoded = await requireUser(req);
    const uid = decoded.uid;
    const email = decoded.email;

    const db = getAdminDb();
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();
    let customerId = userSnap.data()?.stripeCustomerId as string | undefined;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { firebaseUid: uid },
      });
      customerId = customer.id;
      await userRef.set({ stripeCustomerId: customerId }, { merge: true });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: uid,
      line_items: [{ price: process.env.STRIPE_PRICE_ID_PRO, quantity: 1 }],
      success_url: `${process.env.APP_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.APP_URL}/choose-plan`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHENTICATED") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    console.error("createCheckoutSession failed:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
}
