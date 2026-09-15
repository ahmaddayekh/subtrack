# SubTrack

Track every recurring subscription in one place, see what you're really spending each month, and get flagged before renewals sneak up on you.

> **Current deployment status:** the live URL below is a **portfolio demo** — real Firebase project, but Stripe is in **test mode** (no real charges) and the database holds demo/test data, not real customers. See [Going live for real](#going-live-for-real-later) before treating this as a production launch.

## Stack

- React + Vite + TypeScript
- React Router
- Tailwind CSS
- Firebase (Auth + Firestore)
- Recharts
- Billing backend: Vercel serverless functions (`/api`) + Stripe + `firebase-admin` — no Firebase Blaze plan required

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a new project (free Spark plan is enough).
2. In **Build > Authentication**, click "Get started" and enable the **Email/Password** sign-in provider.
3. In **Build > Firestore Database**, click "Create database" and start in **production mode**.
4. In **Project settings > General**, scroll to "Your apps", click the web icon (`</>`) to register a web app, and copy the config values shown.

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in the values from the Firebase config:

```bash
cp .env.example .env
```

### 4. Apply Firestore security rules

Deploy the rules in `firestore.rules` (covers both `subscriptions` and `users` collections) via the Firebase CLI:

```bash
firebase login
firebase deploy --only firestore:rules
```

Or paste the contents of `firestore.rules` into **Firestore Database > Rules** in the console.

### 5. Run the app

```bash
npm run dev
```

## Billing setup (Pro plan)

Free plan works with just the steps above — no billing setup, no Firebase Blaze upgrade needed for it. To enable Pro (Stripe-backed) checkout, the three functions in `/api` need to be deployed somewhere that can run Node serverless functions with outbound network access. This project is set up for **Vercel** (free Hobby tier, no credit card required), which keeps Firestore/Auth exactly as-is on Firebase and only hosts the three billing endpoints.

1. **Get a Firebase service account key** (lets the API functions read/write Firestore as an admin, bypassing security rules): Firebase console → gear icon → **Project settings → Service accounts → Generate new private key**. This downloads a JSON file — keep it secret, never commit it.
2. **Create a Stripe account** at [stripe.com](https://stripe.com) if you don't have one.
3. In the Stripe dashboard, create one recurring **Price** for "SubTrack Pro" (e.g. $4.99/month). Copy its Price ID (`price_...`).
4. **Create a Vercel account** at [vercel.com](https://vercel.com) (free, no card needed) and connect this project (via `vercel` CLI or by importing the repo from the Vercel dashboard).
5. In the Vercel project's **Settings → Environment Variables**, add:
   - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` — from the service account JSON downloaded in step 1 (paste the private key including the `BEGIN/END PRIVATE KEY` lines; Vercel handles the newlines)
   - `STRIPE_SECRET_KEY` — from the Stripe dashboard
   - `STRIPE_PRICE_ID_PRO` — from step 3
   - `APP_URL` — your deployed app's URL (e.g. `https://subtrack.vercel.app`)
   - `STRIPE_WEBHOOK_SECRET` — added in step 7, after the first deploy
6. Deploy: `vercel --prod` (or push to the connected Git branch).
7. In the Stripe dashboard, add a **webhook endpoint** pointing at `https://<your-app>/api/stripe-webhook`, listening for `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`. Copy its signing secret into the `STRIPE_WEBHOOK_SECRET` env var (step 5) and redeploy.

Use [Stripe's test card `4242 4242 4242 4242`](https://stripe.com/docs/testing) (any future expiry/CVC) to test checkout end to end without real charges.

Local testing of the `/api` functions requires `vercel dev` (proxies both the Vite frontend and the API functions on one port) with the same env vars in a local `.env` — plain `npm run dev` only serves the frontend, so Pro checkout will fail locally without it.

## Voice-add setup (app-only feature)

When installed as an app (not in a regular browser tab), a mic button on the dashboard lets users speak a subscription instead of typing it ("I subscribed to Netflix for $15.99 a month starting today"). Speech-to-text runs free in the browser (Web Speech API — works best on Chrome/Android, weaker on iOS Safari); the transcript is sent to `/api/parse-subscription`, which uses Google's Gemini API to extract structured fields for you to review before saving.

To enable it: get a free API key at [aistudio.google.com](https://aistudio.google.com/app/apikey) (no credit card required for the free tier), add it to Vercel as `GEMINI_API_KEY`, and redeploy.

## Going live for real (later)

This deployment is meant to stay a permanent portfolio demo. When actually ready to launch SubTrack as a real product for real users, don't just flip a switch on this same setup — spin up a clean, separate environment so demo/portfolio traffic never touches real customer data:

1. **New Firebase project** — separate Auth users and Firestore data from anything the demo has accumulated (test signups, sample subscriptions).
2. **Stripe: switch from test mode to live mode** — this needs your real business details and a bank account on file in the Stripe dashboard; create a new live-mode Price for Pro and a new live webhook endpoint. This step is entirely on you — it's a business/identity decision, not something that can be automated.
3. **New Vercel project** (or a new environment on the same project) pointing at the new Firebase service account + live Stripe keys — keep the demo's env vars untouched so the demo keeps working independently.
4. **A real domain** — a custom domain reads as a real launch far better than a generated `*.vercel.app` URL. Point it at the new production Vercel project, and leave the demo on its existing `vercel.app` URL.
5. Re-run through this README's setup + billing steps end to end against the new project before announcing anything.

## Roadmap (not in this MVP)

- Bank sync (Plaid) to auto-detect subscriptions
- Email/push renewal reminders (Firebase Cloud Functions + scheduler)
- Team/multi-seat Enterprise plan (currently "contact us" only)
