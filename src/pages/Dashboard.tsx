import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Navbar } from "../components/Navbar";
import { SpendSummary } from "../components/SpendSummary";
import { CategoryChart } from "../components/CategoryChart";
import { SubscriptionTable } from "../components/SubscriptionTable";
import { SubscriptionForm } from "../components/SubscriptionForm";
import { VoiceAddButton } from "../components/VoiceAddButton";
import { NotificationPrompt } from "../components/NotificationPrompt";
import {
  addSubscription,
  deleteSubscription,
  subscribeToSubscriptions,
  updateSubscription,
} from "../lib/subscriptions";
import { FREE_TIER_SUBSCRIPTION_LIMIT } from "../lib/billing";
import { usePlan } from "../contexts/PlanContext";
import { useIsStandalone } from "../lib/useIsStandalone";
import { nextRenewalDate } from "../lib/spend";
import type { Subscription, SubscriptionInput } from "../types/subscription";

export function Dashboard() {
  const { user } = useAuth();
  const { plan } = usePlan();
  const isStandalone = useIsStandalone();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [voicePrefill, setVoicePrefill] = useState<Partial<SubscriptionInput> | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightId = searchParams.get("renewId");
  const highlightedRef = useRef(false);

  const atFreeLimit = plan === "free" && subscriptions.length >= FREE_TIER_SUBSCRIPTION_LIMIT;

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToSubscriptions(user.uid, (subs) => {
      setSubscriptions(subs);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  // Deep link from a push notification: scroll to and briefly highlight the
  // subscription it was about, then drop the query param.
  useEffect(() => {
    if (!highlightId || loading || highlightedRef.current) return;
    const row = document.querySelector(`[data-sub-id="${highlightId}"]`);
    if (row) {
      row.scrollIntoView({ behavior: "smooth", block: "center" });
      highlightedRef.current = true;
      const timeout = setTimeout(() => {
        setSearchParams((params) => {
          params.delete("renewId");
          return params;
        });
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [highlightId, loading, setSearchParams]);

  const handleAdd = () => {
    setEditing(null);
    setVoicePrefill(null);
    setFormOpen(true);
  };

  const handleVoiceParsed = (data: SubscriptionInput) => {
    setEditing(null);
    setVoicePrefill(data);
    setFormOpen(true);
  };

  const handleEdit = (sub: Subscription) => {
    setEditing(sub);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this subscription?")) {
      await deleteSubscription(id);
    }
  };

  const handleRenew = (sub: Subscription) => {
    const { id, userId, createdAt, ...input } = sub;
    void userId;
    void createdAt;
    updateSubscription(id, { ...input, renewalDate: nextRenewalDate(sub) }).catch((err) => {
      console.error("Failed to renew subscription:", err);
    });
  };

  const handleSubmit = (input: SubscriptionInput) => {
    if (!user) return;
    const write = editing
      ? updateSubscription(editing.id, input)
      : addSubscription(user.uid, input);
    write.catch((err) => {
      console.error("Failed to save subscription:", err);
    });
  };

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-2xl font-extrabold text-slate-900">
            Your subscriptions
          </h1>
          <button
            onClick={handleAdd}
            disabled={atFreeLimit}
            className="btn-gradient rounded-full px-4 py-2 text-sm font-bold text-white shadow-md shadow-brand-500/25 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            + Add subscription
          </button>
        </div>

        <NotificationPrompt />

        {atFreeLimit && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
            <span>
              You've reached the Free plan's {FREE_TIER_SUBSCRIPTION_LIMIT}-subscription limit.
            </span>
            <Link to="/choose-plan" className="font-bold underline">
              Upgrade to Pro
            </Link>
          </div>
        )}

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : (
          <div className="space-y-6">
            <SpendSummary subscriptions={subscriptions} />
            <CategoryChart subscriptions={subscriptions} />
            <SubscriptionTable
              subscriptions={subscriptions}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRenew={handleRenew}
              highlightId={highlightId}
            />
          </div>
        )}
      </div>

      {formOpen && (
        <SubscriptionForm
          initial={editing}
          prefill={voicePrefill}
          onSubmit={handleSubmit}
          onClose={() => {
            setFormOpen(false);
            setVoicePrefill(null);
          }}
        />
      )}

      {isStandalone && !atFreeLimit && <VoiceAddButton onParsed={handleVoiceParsed} />}
    </div>
  );
}
