import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSpeechCapture } from "../lib/useSpeechCapture";
import { parseSubscriptionFromSpeech } from "../lib/parseSubscription";
import type { SubscriptionInput } from "../types/subscription";

interface VoiceAddButtonProps {
  onParsed: (data: SubscriptionInput) => void;
}

type Status = "idle" | "listening" | "thinking" | "error";

export function VoiceAddButton({ onParsed }: VoiceAddButtonProps) {
  const { user } = useAuth();
  const { supported, error, start, cancel } = useSpeechCapture();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  if (!supported) return null;

  const reset = () => setStatus("idle");

  const handleCancel = () => {
    if (status === "listening") cancel();
    if (status === "thinking") abortRef.current?.abort();
    reset();
  };

  const handleClick = () => {
    if (!user) return;

    if (status === "listening" || status === "thinking") {
      handleCancel();
      return;
    }

    setMessage(null);
    setStatus("listening");

    start(async (transcript) => {
      setStatus("thinking");
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const parsed = await parseSubscriptionFromSpeech(user, transcript, controller.signal);
        onParsed(parsed);
        setStatus("idle");
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Voice parse failed:", err);
        setMessage(err instanceof Error ? err.message : "Couldn't parse that. Try again.");
        setStatus("error");
      }
    });
  };

  const isBusy = status === "listening" || status === "thinking";

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {(message || error) && (
        <div className="max-w-xs rounded-2xl bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
          {message ?? error}
        </div>
      )}
      {status === "listening" && (
        <div className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
          🎙️ Listening... say something like "I subscribed to Netflix for $15.99 a month"
        </div>
      )}
      {status === "thinking" && (
        <div className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
          ✨ Got it — filling in the details...
        </div>
      )}
      {isBusy && (
        <button
          onClick={handleCancel}
          className="rounded-full border-2 border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 shadow-md hover:bg-slate-50"
        >
          Cancel
        </button>
      )}
      <button
        onClick={handleClick}
        aria-label={isBusy ? "Cancel voice input" : "Add subscription by voice"}
        className={`btn-gradient flex h-16 w-16 items-center justify-center rounded-full text-2xl text-white shadow-xl shadow-brand-500/40 transition hover:scale-105 ${
          status === "listening" ? "animate-pulse" : ""
        }`}
      >
        {isBusy ? "⏹" : "🎙️"}
      </button>
    </div>
  );
}
