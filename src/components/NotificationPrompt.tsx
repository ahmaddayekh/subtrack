import { useAuth } from "../contexts/AuthContext";
import { usePushNotifications } from "../lib/usePushNotifications";

export function NotificationPrompt() {
  const { user } = useAuth();
  const { status, enable } = usePushNotifications(user);

  if (status === "checking" || status === "unsupported" || status === "subscribed") return null;

  return (
    <div className="mb-6 flex items-center justify-between rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-900">
      <span>
        {status === "denied"
          ? "Notifications are blocked — enable them in your browser's site settings to get renewal reminders."
          : "🔔 Get an email + push notification 2 days before anything renews."}
      </span>
      {status !== "denied" && (
        <button
          onClick={enable}
          disabled={status === "subscribing"}
          className="shrink-0 font-bold text-brand-700 underline disabled:opacity-50"
        >
          {status === "subscribing" ? "Enabling..." : "Enable"}
        </button>
      )}
    </div>
  );
}
