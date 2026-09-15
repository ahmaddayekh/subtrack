import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { usePlan } from "../contexts/PlanContext";
import { openBillingPortal } from "../lib/billing";

export function Navbar() {
  const { user, logOut } = useAuth();
  const { plan } = usePlan();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate("/");
  };

  const handleManageBilling = async () => {
    if (!user) return;
    try {
      await openBillingPortal(user);
    } catch (err) {
      console.error("Failed to open billing portal:", err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="font-display shrink-0 text-lg font-extrabold text-slate-900"
        >
          Sub<span className="text-gradient">Track</span>
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1 sm:gap-x-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-xs font-bold text-slate-700 hover:text-slate-900 sm:text-sm"
              >
                Dashboard
              </Link>
              <span
                className={`hidden rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide sm:inline ${
                  plan === "pro"
                    ? "btn-gradient text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {plan}
              </span>
              <span className="hidden text-sm text-slate-500 sm:inline">
                {user.email}
              </span>
              {plan === "pro" ? (
                <button
                  onClick={handleManageBilling}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 sm:text-sm"
                >
                  <span className="sm:hidden">Billing</span>
                  <span className="hidden sm:inline">Manage billing</span>
                </button>
              ) : (
                <Link
                  to="/choose-plan"
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 sm:text-sm"
                >
                  Upgrade
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="rounded-full border-2 border-slate-200 px-3 py-1 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:px-4 sm:py-1.5 sm:text-sm"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-bold text-slate-700 hover:text-slate-900"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="btn-gradient rounded-full px-4 py-1.5 text-sm font-bold text-white shadow-md shadow-brand-500/25 transition hover:scale-105"
              >
                Sign up free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
