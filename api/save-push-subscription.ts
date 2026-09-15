import { getAdminDb } from "./_lib/firebaseAdmin.js";
import { requireUser } from "./_lib/auth.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const decoded = await requireUser(req);
    const subscription = req.body?.subscription;
    if (!subscription?.endpoint) {
      res.status(400).json({ error: "Missing push subscription" });
      return;
    }

    const db = getAdminDb();
    await db
      .collection("users")
      .doc(decoded.uid)
      .set({ pushSubscription: subscription }, { merge: true });

    res.status(200).json({ ok: true });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHENTICATED") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    console.error("savePushSubscription failed:", err);
    res.status(500).json({ error: "Failed to save push subscription" });
  }
}
