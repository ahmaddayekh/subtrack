import { useState, type FormEvent } from "react";
import { CATEGORIES, type BillingCycle, type Category, type Subscription, type SubscriptionInput } from "../types/subscription";

interface SubscriptionFormProps {
  initial?: Subscription | null;
  prefill?: Partial<SubscriptionInput> | null;
  onSubmit: (input: SubscriptionInput) => void;
  onClose: () => void;
}

const todayISO = () => new Date().toISOString().slice(0, 10);
const inputClasses =
  "w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200";
const labelClasses = "mb-1 block text-sm font-semibold text-slate-700";

export function SubscriptionForm({ initial, prefill, onSubmit, onClose }: SubscriptionFormProps) {
  const [name, setName] = useState(initial?.name ?? prefill?.name ?? "");
  const [price, setPrice] = useState((initial?.price ?? prefill?.price)?.toString() ?? "");
  const [currency, setCurrency] = useState(initial?.currency ?? prefill?.currency ?? "USD");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    initial?.billingCycle ?? prefill?.billingCycle ?? "monthly",
  );
  const [category, setCategory] = useState<Category>(initial?.category ?? prefill?.category ?? "Other");
  const [renewalDate, setRenewalDate] = useState(initial?.renewalDate ?? prefill?.renewalDate ?? todayISO());
  const [notes, setNotes] = useState(initial?.notes ?? prefill?.notes ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedPrice = Number(price);
    if (!name.trim()) {
      setError("Please enter a name.");
      return;
    }
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setError("Please enter a valid price.");
      return;
    }
    if (!renewalDate) {
      setError("Please pick a renewal date.");
      return;
    }

    onSubmit({
      name: name.trim(),
      price: parsedPrice,
      currency,
      billingCycle,
      category,
      renewalDate,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
        <h2 className="font-display mb-1 text-lg font-bold text-slate-900">
          {initial ? "Edit subscription" : "Add subscription"}
        </h2>
        {!initial && prefill && (
          <p className="mb-4 text-sm font-medium text-brand-600">
            ✨ Filled in from what you said — check it over before saving.
          </p>
        )}
        <form onSubmit={handleSubmit} className={`space-y-4 ${!initial && prefill ? "" : "mt-4"}`}>
          <div>
            <label className={labelClasses}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Netflix"
              className={inputClasses}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClasses}>Price</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="15.99"
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Currency</label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                maxLength={3}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClasses}>Billing cycle</label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
                className={inputClasses}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className={inputClasses}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClasses}>Next renewal date</label>
            <input
              type="date"
              value={renewalDate}
              onChange={(e) => setRenewalDate(e.target.value)}
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className={inputClasses}
            />
          </div>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border-2 border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-gradient rounded-full px-4 py-2 text-sm font-bold text-white shadow-md shadow-brand-500/25 transition hover:scale-105"
            >
              {initial ? "Save changes" : "Add subscription"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
