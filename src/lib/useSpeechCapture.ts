import { useCallback, useRef, useState } from "react";

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useSpeechCapture() {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const cancelledRef = useRef(false);

  const supported = getSpeechRecognitionCtor() !== null;

  const start = useCallback((onResult: (transcript: string) => void) => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setError("Voice input isn't supported in this browser.");
      return;
    }
    setError(null);
    cancelledRef.current = false;
    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript as string;
      // Release the mic immediately rather than waiting on the browser's
      // own auto-stop timing, which is inconsistent across implementations.
      recognition.stop();
      if (!cancelledRef.current) onResult(transcript);
    };
    recognition.onerror = (event: any) => {
      if (event.error !== "aborted") {
        setError(
          event.error === "not-allowed"
            ? "Microphone permission denied."
            : "Couldn't hear that. Try again.",
        );
      }
      setListening(false);
    };
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  // Cancel: discard whatever's been heard so far, no onResult callback fires.
  const cancel = useCallback(() => {
    cancelledRef.current = true;
    recognitionRef.current?.abort();
    setListening(false);
  }, []);

  return { supported, listening, error, start, stop, cancel };
}
