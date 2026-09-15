import { Navbar } from "../components/Navbar";

export function Terms() {
  return (
    <div className="min-h-screen bg-[#fffaf5]">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-3xl font-extrabold text-slate-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: September 2026</p>

        <div className="prose-sm mt-8 space-y-6 text-slate-700">
          <section>
            <h2 className="font-display text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p className="mt-2">
              By creating an account or using SubTrack, you agree to these Terms of Service and
              our Privacy Policy. If you don't agree, please don't use the service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-slate-900">2. Description of Service</h2>
            <p className="mt-2">
              SubTrack lets you manually track recurring subscriptions, view spend summaries, and
              receive optional renewal reminders by email and push notification. Subscription
              data is entered by you (by typing or by voice) and is not automatically imported
              from your bank or any other account.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-slate-900">3. Your Account</h2>
            <p className="mt-2">
              You're responsible for keeping your login credentials secure and for all activity
              under your account. Notify us if you suspect unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-slate-900">4. Plans &amp; Billing</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><strong>Free plan:</strong> tracks up to 5 subscriptions at no cost.</li>
              <li><strong>Pro plan:</strong> a recurring monthly charge, billed and processed via Stripe. You can manage or cancel your subscription at any time from the "Manage billing" link in the app, which opens Stripe's billing portal.</li>
              <li><strong>Enterprise plan:</strong> currently handled by direct inquiry; no automated billing yet.</li>
              <li>Cancelling Pro stops future billing but does not retroactively refund the current billing period unless required by law.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-slate-900">5. AI-Assisted Input</h2>
            <p className="mt-2">
              The voice-add feature uses AI (Google's Gemini API) to turn what you say into
              structured subscription data. AI extraction can be inaccurate. We always show you
              the extracted fields for review before anything is saved — you're responsible for
              checking they're correct.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-slate-900">6. Acceptable Use</h2>
            <p className="mt-2">
              Don't use SubTrack to store unlawful content, attempt to disrupt or abuse the
              service, or try to access other users' data.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-slate-900">7. Disclaimer of Warranties</h2>
            <p className="mt-2">
              SubTrack is provided "as is" without warranties of any kind. We don't guarantee the
              service will be uninterrupted, error-free, or that renewal reminders will always be
              delivered — it's a helpful tool, not a substitute for checking your own bank or
              card statements.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-slate-900">8. Limitation of Liability</h2>
            <p className="mt-2">
              To the fullest extent permitted by law, SubTrack and its creator are not liable for
              any indirect, incidental, or consequential damages arising from your use of the
              service, including missed renewals or reminders that weren't delivered.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-slate-900">9. Termination</h2>
            <p className="mt-2">
              You can stop using SubTrack and request account deletion at any time. We may
              suspend or terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-slate-900">10. Changes to These Terms</h2>
            <p className="mt-2">
              We may update these terms from time to time. Continued use after a change means you
              accept the updated terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-slate-900">11. Contact</h2>
            <p className="mt-2">
              Questions about these terms? Email{" "}
              <a href="mailto:adayekh45@gmail.com" className="font-bold text-brand-600 hover:text-brand-700">
                adayekh45@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
