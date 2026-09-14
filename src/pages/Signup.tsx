import { useRef, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Navbar } from "../components/Navbar";

function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  if (code.includes("email-already-in-use")) {
    return "An account with this email already exists.";
  }
  if (code.includes("weak-password")) {
    return "Password should be at least 6 characters.";
  }
  if (code.includes("invalid-email")) {
    return "Please enter a valid email address.";
  }
  return "Something went wrong. Please try again.";
}

export function Signup() {
  const { user, signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // True only while this form's own submit is driving the auth-state change
  // (which has its own explicit navigate() call) — distinguishes that from
  // arriving here already logged in from a persisted session, where auth
  // resolves asynchronously and we DO want to redirect away.
  const justSubmittedRef = useRef(false);

  if (user && !justSubmittedRef.current) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    justSubmittedRef.current = true;
    try {
      await signUp(email, password);
      navigate("/choose-plan");
    } catch (err) {
      justSubmittedRef.current = false;
      setError(friendlyAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fffaf5]">
      <div className="gradient-blob -right-24 top-20 h-80 w-80 bg-orange-300" />
      <div className="gradient-blob -left-24 top-72 h-72 w-72 bg-pink-300" />
      <Navbar />
      <div className="relative z-10 mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-lg">
          <h1 className="font-display text-2xl font-extrabold text-slate-900">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-slate-600">Free forever. No credit card required.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
            </div>
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="btn-gradient w-full rounded-full px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-500/25 transition hover:scale-[1.02] disabled:opacity-50"
            >
              {submitting ? "Creating account..." : "Sign up"}
            </button>
          </form>
          <p className="mt-5 text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
