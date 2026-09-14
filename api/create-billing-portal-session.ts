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

    const db = getAdminDb();
    const userSnap = await db.collection("users").doc(uid).get();
    const customerId = userSnap.data()?.stripeCustomerId as string | undefined;
    if (!customerId) {
      res.status(400).json({ error: "No billing account on file." });
      return;
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.APP_URL}/dashboard`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHENTICATED") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    console.error("createBillingPortalSession failed:", err);
    res.status(500).json({ error: "Failed to create billing portal session" });
  }
}
