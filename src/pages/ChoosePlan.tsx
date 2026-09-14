import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { choosePlanFree, startProCheckout } from "../lib/billing";
import { Navbar } from "../components/Navbar";

const PLANS = [
  {
    id: "free" as const,
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "Track up to 5 subscriptions",
      "Monthly & yearly spend summary",
      "Category spend breakdown",
      "Renewing-soon alerts",
    ],
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: "$4.99",
    period: "/month",
    features: [
      "Unlimited tracked subscriptions",
      "Everything in Free",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    id: "enterprise" as const,
    name: "Enterprise",
    price: "Contact us",
    period: "",
    features: [
      "Everything in Pro",
      "Team workspaces (coming soon)",
      "Dedicated onboarding",
    ],
  },
];

export function ChoosePlan() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChoose = async (planId: (typeof PLANS)[number]["id"]) => {
    if (!user) return;
    setError(null);

    if (planId === "enterprise") {
      window.location.href =
        "mailto:sales@subtrack.app?subject=Enterprise%20plan%20inquiry";
      return;
    }

    if (planId === "free") {
      choosePlanFree(user.uid).catch((err) => {
        console.error("Failed to set free plan:", err);
      });
      navigate("/dashboard");
      return;
    }

    setLoadingPlan(planId);
    try {
      await startProCheckout(user);
    } catch (err) {
      console.error("Failed to start checkout:", err);
      const isLocalDev = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
      setError(
        isLocalDev
          ? "Pro checkout needs the deployed backend, which isn't available on localhost. Try this on the live site instead: https://subtrack-blush-ten.vercel.app"
          : "Couldn't start checkout. Please try again in a moment.",
      );
      setLoadingPlan(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fffaf5]">
      <div className="gradient-blob -right-24 -top-24 h-96 w-96 bg-orange-300" />
      <div className="gradient-blob -left-32 top-60 h-80 w-80 bg-violet-300" />
      <Navbar />
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-center text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Choose your <span className="text-gradient">plan</span>
        </h1>
        <p className="mt-2 text-center text-slate-600">
          Start free. Upgrade any time.
        </p>

        {error && (
          <p className="mx-auto mt-6 max-w-md text-center text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl border bg-white p-7 transition hover:-translate-y-1 ${
                plan.highlighted
                  ? "border-transparent shadow-xl ring-2 ring-brand-500"
                  : "border-slate-100 shadow-sm"
              }`}
            >
              {plan.highlighted && (
                <span className="btn-gradient mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold text-white">
                  Most popular
                </span>
              )}
              <h2 className="font-display text-lg font-bold text-slate-900">{plan.name}</h2>
              <p className="mt-2">
                <span className="font-display text-3xl font-extrabold text-slate-900">
                  {plan.price}
                </span>
                <span className="text-sm text-slate-500"> {plan.period}</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="font-bold text-emerald-600">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleChoose(plan.id)}
                disabled={loadingPlan === plan.id}
                className={`mt-6 w-full rounded-full px-4 py-2.5 text-sm font-bold transition disabled:opacity-50 ${
                  plan.highlighted
                    ? "btn-gradient text-white shadow-md shadow-brand-500/25 hover:scale-105"
                    : "border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {loadingPlan === plan.id
                  ? "Loading..."
                  : plan.id === "enterprise"
                    ? "Contact sales"
                    : plan.id === "free"
                      ? "Start free"
                      : "Upgrade to Pro"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
