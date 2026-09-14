import type { User } from "firebase/auth";
import type { SubscriptionInput } from "../types/subscription";

export async function parseSubscriptionFromSpeech(
  user: User,
  transcript: string,
  signal?: AbortSignal,
): Promise<SubscriptionInput> {
  const idToken = await user.getIdToken();
  const res = await fetch("/api/parse-subscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ transcript }),
    signal,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Failed to parse (${res.status})`);
  }

  const { subscription } = await res.json();
  return subscription as SubscriptionInput;
}
