import { isFirebaseConfigured } from "../firebase/config";

export function ConfigBanner() {
  if (isFirebaseConfigured) return null;

  return (
    <div className="bg-amber-100 px-4 py-2 text-center text-sm text-amber-900">
      Firebase isn't configured yet — sign up/login won't work until you set the{" "}
      <code className="rounded bg-amber-200 px-1">VITE_FIREBASE_*</code> vars in{" "}
      <code className="rounded bg-amber-200 px-1">.env</code>. See README.md.
    </div>
  );
}
