import { Resend } from "resend";
import { getAuth } from "firebase-admin/auth";
import { getAdminApp, getAdminDb } from "../_lib/firebaseAdmin.js";
import { webpush } from "../_lib/webpush.js";

const REMINDER_WINDOW_DAYS = 2;

function targetDateISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + REMINDER_WINDOW_DAYS);
  return d.toISOString().slice(0, 10);
}

export default async function handler(req: any, res: any) {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const db = getAdminDb();
  const auth = getAuth(getAdminApp());
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

  const target = targetDateISO();
  const snap = await db.collection("subscriptions").where("renewalDate", "==", target).get();

  const results: Array<{ id: string; email: boolean; push: boolean; error?: string }> = [];

  for (const doc of snap.docs) {
    const sub = doc.data() as { name: string; price: number; currency: string; userId: string };
    const outcome = { id: doc.id, email: false, push: false } as {
      id: string;
      email: boolean;
      push: boolean;
      error?: string;
    };

    try {
      const [authUser, userDoc] = await Promise.all([
        auth.getUser(sub.userId),
        db.collection("users").doc(sub.userId).get(),
      ]);

      if (authUser.email && resend) {
        const { error } = await resend.emails.send({
          from: "SubTrack <onboarding@resend.dev>",
          to: authUser.email,
          subject: `Your ${sub.name} subscription renews in ${REMINDER_WINDOW_DAYS} days`,
          html: `<p>Your <strong>${sub.name}</strong> subscription (${sub.currency} ${sub.price.toFixed(2)}) is going to renew in ${REMINDER_WINDOW_DAYS} days.</p><p>If you want to continue, open SubTrack and hit <strong>Renew</strong> next to it. If not, hit <strong>Cancel</strong> and it'll be removed from your tracker.</p>`,
        });
        outcome.email = !error;
        if (error) outcome.error = JSON.stringify(error);
      }

      const pushSubscription = userDoc.data()?.pushSubscription;
      if (pushSubscription) {
        try {
          await webpush.sendNotification(
            pushSubscription,
            JSON.stringify({
              title: "SubTrack",
              body: `${sub.name} renews in ${REMINDER_WINDOW_DAYS} days — tap to renew or cancel`,
              subId: doc.id,
            }),
          );
          outcome.push = true;
        } catch (pushErr: any) {
          if (pushErr?.statusCode === 404 || pushErr?.statusCode === 410) {
            await db.collection("users").doc(sub.userId).update({ pushSubscription: null });
          }
          outcome.error = `${outcome.error ?? ""} push: ${pushErr?.message ?? pushErr}`.trim();
        }
      }
    } catch (err) {
      outcome.error = err instanceof Error ? err.message : String(err);
    }

    results.push(outcome);
  }

  res.status(200).json({ target, checked: snap.size, results });
}
