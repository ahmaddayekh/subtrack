import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { deleteAccount } from "../lib/billing";

export function DangerZone() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await deleteAccount(user);
      await logOut();
      navigate("/");
    } catch (err) {
      console.error("Failed to delete account:", err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <div className="mt-10 rounded-3xl border-2 border-dashed border-red-200 bg-red-50/40 p-6">
      <h3 className="font-display text-sm font-bold text-red-900">Danger zone</h3>
      <p className="mt-1 text-sm text-red-800">
        Deleting your account permanently removes all your tracked subscriptions and cancels
        any active Pro billing. This can't be undone.
      </p>

      {error && <p className="mt-3 text-sm font-medium text-red-700">{error}</p>}

      {confirming ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-red-900">Are you sure?</span>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Yes, delete everything"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={deleting}
            className="rounded-full border-2 border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="mt-4 rounded-full border-2 border-red-300 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100"
        >
          Delete my account
        </button>
      )}
    </div>
  );
}
