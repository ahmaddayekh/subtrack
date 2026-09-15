import { Navbar } from "../components/Navbar";

export function Privacy() {
  return (
    <div className="min-h-screen bg-[#fffaf5]">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: September 2026</p>

        <div className="prose-sm mt-8 space-y-6 text-slate-700">
          <section>
            <h2 className="font-display text-lg font-bold text-slate-900">1. Introduction</h2>
            <p className="mt-2">
              SubTrack ("we", "us", "our") provides a subscription-tracking application. This
              policy explains what information we collect, how we use it, and who we share it
              with. By using SubTrack, you agree to the collection and use of information as
              described here.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-slate-900">2. Information We Collect</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><strong>Account information:</strong> your email address and password (stored securely by Firebase Authentication; we never see your plaintext password).</li>
              <li><strong>Subscription data you enter:</strong> the name, price, currency, billing cycle, category, renewal date, and optional notes for each subscription you track.</li>
              <li><strong>Billing information:</strong> if you upgrade to Pro, payment processing is handled entirely by Stripe — we never receive or store your card details.</li>
              <li><strong>Voice input (optional):</strong> if you use the voice-add feature, your spoken words are transcribed by your browser and the resulting text is sent to Google's Gemini API to extract subscription details. Audio is not stored by us.</li>
              <li><strong>Push notification data:</strong> if you enable renewal reminders, we store a browser-issued push subscription token so we can deliver notifications to your device.</li>
              <li><strong>Usage data:</strong> basic technical information (such as browser type) that's a normal part of operating a web application.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-slate-900">3. How We Use Your Information</h2>
            <p className="mt-2">We use your information to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Provide and maintain your subscription dashboard.</li>
              <li>Send you email and/or push notifications when a tracked subscription is about to renew.</li>
              <li>Process payments and manage your billing plan.</li>
              <li>Improve and maintain the reliability of the service.</li>
            </ul>
            <p className="mt-2">We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-slate-900">4. Third-Party Services</h2>
            <p className="mt-2">We rely on the following third-party services to operate SubTrack, each of which processes data on our behalf under their own privacy terms:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><strong>Firebase (Google):</strong> authentication and database storage.</li>
              <li><strong>Stripe:</strong> payment processing for paid plans.</li>
              <li><strong>Google Gemini API:</strong> parses voice-transcribed text into structured subscription data.</li>
              <li><strong>Resend:</strong> delivers renewal-reminder emails.</li>
              <li><strong>Vercel:</strong> application hosting.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-slate-900">5. Data Storage &amp; Security</h2>
            <p className="mt-2">
              Your data is stored in Firebase Firestore, secured by access rules that ensure only
              you can read or write your own subscription data. We take reasonable technical
              measures to protect your information, but no method of transmission or storage is
              100% secure.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-slate-900">6. Your Rights</h2>
            <p className="mt-2">
              You can edit or delete any subscription you've added at any time from your
              dashboard. To request deletion of your entire account and associated data, or to
              ask any question about your data, contact us at the address below.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-slate-900">7. Children's Privacy</h2>
            <p className="mt-2">
              SubTrack is not directed at children under 13, and we do not knowingly collect
              information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-slate-900">8. Changes to This Policy</h2>
            <p className="mt-2">
              We may update this policy from time to time. Continued use of SubTrack after a
              change constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-slate-900">9. Contact Us</h2>
            <p className="mt-2">
              Questions about this policy? Email{" "}
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
