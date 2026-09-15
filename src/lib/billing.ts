import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import type { User } from "firebase/auth";

export type Plan = "free" | "pro";

export const FREE_TIER_SUBSCRIPTION_LIMIT = 5;

export async function choosePlanFree(uid: string) {
  await setDoc(doc(db, "users", uid), {
    plan: "free",
    updatedAt: new Date().toISOString(),
  });
}

async function callBillingApi(path: string, user: User): Promise<{ url: string }> {
  const idToken = await user.getIdToken();
  const res = await fetch(path, {
    method: "POST",
    headers: { Authorization: `Bearer ${idToken}` },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Billing request failed (${res.status})`);
  }
  return res.json();
}

export async function startProCheckout(user: User) {
  const { url } = await callBillingApi("/api/create-checkout-session", user);
  window.location.href = url;
}

export async function openBillingPortal(user: User) {
  const { url } = await callBillingApi("/api/create-billing-portal-session", user);
  window.location.href = url;
}
