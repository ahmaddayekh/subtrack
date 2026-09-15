import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export function EmailVerificationBanner() {
  const { user, resendVerificationEmail } = useAuth();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!user || user.emailVerified) return null;

  const handleResend = async () => {
    setStatus("sending");
    setErrorMessage(null);
    try {
      await resendVerificationEmail();
      setStatus("sent");
    } catch (err) {
      console.error("Failed to resend verification email:", err);
      const code = (err as { code?: string })?.code ?? "";
      setErrorMessage(
        code.includes("too-many-requests")
          ? "A verification email was already sent recently — check your inbox (and spam folder) before requesting another."
          : "Couldn't send that. Please try again in a moment.",
      );
      setStatus("error");
    }
  };

  const handleRefresh = async () => {
    await user.reload().catch(() => {});
    window.location.reload();
  };

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <span>
        {status === "sent"
          ? "Verification email sent — check your inbox, then refresh."
          : status === "error" && errorMessage
            ? errorMessage
            : "📧 Please verify your email so renewal reminders actually reach you."}
      </span>
      <div className="flex gap-3">
        <button onClick={handleRefresh} className="font-bold underline">
          I've verified — refresh
        </button>
        {status !== "sent" && (
          <button onClick={handleResend} disabled={status === "sending"} className="font-bold underline disabled:opacity-50">
            {status === "sending" ? "Sending..." : "Resend email"}
          </button>
        )}
      </div>
    </div>
  );
}
