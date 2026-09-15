import { useCallback, useEffect, useState } from "react";
import type { User } from "firebase/auth";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(new ArrayBuffer(rawData.length));
  for (let i = 0; i < rawData.length; i++) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export type PushStatus = "checking" | "idle" | "subscribing" | "subscribed" | "denied" | "unsupported" | "error";

export function usePushNotifications(user: User | null) {
  const [status, setStatus] = useState<PushStatus>("checking");

  // On mount, find out whether this browser is already subscribed instead of
  // assuming "idle" every time — otherwise the enable prompt reappears on
  // every visit even after the user already turned it on.
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setStatus("denied");
      return;
    }

    let cancelled = false;
    navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => {
        if (!cancelled) setStatus(subscription ? "subscribed" : "idle");
      })
      .catch(() => {
        if (!cancelled) setStatus("idle");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const enable = useCallback(async () => {
    if (!user) return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }

    setStatus("subscribing");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY,
        ) as BufferSource,
      });

      const idToken = await user.getIdToken();
      const res = await fetch("/api/save-push-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });
      if (!res.ok) throw new Error(`Failed to save subscription (${res.status})`);
      setStatus("subscribed");
    } catch (err) {
      console.error("Failed to enable push notifications:", err);
      setStatus("error");
    }
  }, [user]);

  return { status, enable };
}
