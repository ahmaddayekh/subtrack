import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";

const FEATURES = [
  {
    emoji: "📊",
    bg: "bg-violet-100",
    title: "See everything in one place",
    description:
      "Every subscription you're paying for, listed with price, billing cycle, and renewal date.",
  },
  {
    emoji: "⏰",
    bg: "bg-orange-100",
    title: "Never get surprised again",
    description:
      "Renewals coming up in the next 7 days are flagged automatically on your dashboard.",
  },
  {
    emoji: "💸",
    bg: "bg-emerald-100",
    title: "Know where your money goes",
    description:
      "A category breakdown shows exactly what you're spending on streaming, software, and more each month.",
  },
];

const PLAN_TEASERS = [
  { name: "Free", price: "$0", blurb: "Up to 5 subscriptions", highlighted: false },
  { name: "Pro", price: "$4.99/mo", blurb: "Unlimited subscriptions", highlighted: true },
  { name: "Enterprise", price: "Contact us", blurb: "Built for teams", highlighted: false },
];

export function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fffaf5]">
      <Navbar />

      <section className="relative overflow-hidden px-4 py-24 sm:px-6">
        <div className="gradient-blob -right-24 -top-24 h-96 w-96 bg-orange-300" />
        <div className="gradient-blob -left-32 top-40 h-80 w-80 bg-violet-300" />
        <div className="gradient-blob left-1/2 top-96 h-72 w-72 bg-pink-300" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-sm ring-1 ring-brand-100">
            🎉 Free forever — no credit card required
          </span>

          <h1 className="font-display mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
            You're losing money to{" "}
            <span className="text-gradient">subscriptions you forgot about.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            SubTrack gives you one colorful dashboard for every recurring charge, so
            nothing renews without you knowing about it.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="btn-gradient rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition hover:scale-105 hover:shadow-xl"
              >
                Go to your dashboard →
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="btn-gradient rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition hover:scale-105 hover:shadow-xl"
                >
                  Start tracking for free →
                </Link>
                <Link
                  to="/login"
                  className="rounded-full border-2 border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${f.bg}`}>
                {f.emoji}
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-pink-700 px-4 py-20 text-center sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="font-display text-4xl font-extrabold text-white sm:text-5xl">
            The average person has 12+ subscriptions.
          </p>
          <p className="mt-2 font-display text-4xl font-extrabold text-orange-300 sm:text-5xl">
            Most can't name half of them.
          </p>
          <p className="mx-auto mt-6 max-w-xl text-brand-100">
            Free trials silently convert to paid plans, "just in case" tools keep
            charging years after you stopped using them, and banks don't flag any of
            it. SubTrack fixes that with one always up-to-date view of every
            subscription and when it renews.
          </p>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-display text-3xl font-extrabold text-slate-900">
            Simple, honest pricing
          </h2>
          <p className="mt-2 text-slate-600">Start free. Upgrade whenever you outgrow it.</p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {PLAN_TEASERS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl border bg-white p-6 text-left ${
                  plan.highlighted
                    ? "border-transparent shadow-xl ring-2 ring-brand-500"
                    : "border-slate-100 shadow-sm"
                }`}
              >
                <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                  {plan.name}
                </p>
                <p className="font-display mt-1 text-2xl font-extrabold text-slate-900">
                  {plan.price}
                </p>
                <p className="mt-1 text-sm text-slate-600">{plan.blurb}</p>
              </div>
            ))}
          </div>

          <Link
            to={user ? "/dashboard" : "/signup"}
            className="btn-gradient mt-10 inline-block rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition hover:scale-105 hover:shadow-xl"
          >
            {user ? "Go to your dashboard →" : "Get started free →"}
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-100 px-4 py-8 text-center text-sm text-slate-500 sm:px-6">
        <p>
          <span className="font-display font-bold text-slate-700">
            Sub<span className="text-brand-600">Track</span>
          </span>
          {" "}— never lose money to a forgotten subscription.
        </p>
        <p className="mt-3">
          <Link to="/privacy" className="hover:text-slate-700">Privacy Policy</Link>
          <span className="mx-2">·</span>
          <Link to="/terms" className="hover:text-slate-700">Terms of Service</Link>
        </p>
      </footer>
    </div>
  );
}
