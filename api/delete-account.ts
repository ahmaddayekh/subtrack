import { getAuth } from "firebase-admin/auth";
import { getAdminApp, getAdminDb } from "./_lib/firebaseAdmin.js";
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

    const userDoc = await db.collection("users").doc(uid).get();
    const stripeSubscriptionId = userDoc.data()?.stripeSubscriptionId as string | undefined;

    if (stripeSubscriptionId) {
      await stripe.subscriptions.cancel(stripeSubscriptionId).catch((err) => {
        console.error("Failed to cancel Stripe subscription during account deletion:", err);
      });
    }

    const subsSnap = await db.collection("subscriptions").where("userId", "==", uid).get();
    await Promise.all(subsSnap.docs.map((doc) => doc.ref.delete()));

    await db.collection("users").doc(uid).delete();
    await getAuth(getAdminApp()).deleteUser(uid);

    res.status(200).json({ ok: true });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHENTICATED") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    console.error("deleteAccount failed:", err);
    res.status(500).json({ error: "Failed to delete account" });
  }
}
