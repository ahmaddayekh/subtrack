import type { Subscription } from "../types/subscription";
import { daysUntilRenewal, isDueForDecision, isRenewingSoon } from "../lib/spend";
import { CATEGORY_BADGE_CLASSES } from "../lib/categoryColors";

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
  onRenew: (sub: Subscription) => void;
  highlightId?: string | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SubscriptionTable({
  subscriptions,
  onEdit,
  onDelete,
  onRenew,
  highlightId,
}: SubscriptionTableProps) {
  if (subscriptions.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
        No subscriptions yet. Add your first one to start tracking.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-slate-100 bg-slate-50/60 text-slate-500">
          <tr>
            <th className="px-4 py-3 font-bold">Name</th>
            <th className="px-4 py-3 font-bold">Price</th>
            <th className="px-4 py-3 font-bold">Cycle</th>
            <th className="px-4 py-3 font-bold">Category</th>
            <th className="px-4 py-3 font-bold">Renews</th>
            <th className="px-4 py-3 text-right font-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub) => {
            const soon = isRenewingSoon(sub);
            const days = daysUntilRenewal(sub);
            const dueForDecision = isDueForDecision(sub);
            return (
              <tr
                key={sub.id}
                data-sub-id={sub.id}
                className={`border-b border-slate-50 last:border-0 hover:bg-slate-50/50 ${
                  highlightId === sub.id ? "ring-2 ring-inset ring-brand-400 bg-brand-50/40" : ""
                }`}
              >
                <td className="px-4 py-3 font-semibold text-slate-900">{sub.name}</td>
                <td className="px-4 py-3 text-slate-700">
                  {sub.currency} {sub.price.toFixed(2)}
                </td>
                <td className="px-4 py-3 capitalize text-slate-700">{sub.billingCycle}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${CATEGORY_BADGE_CLASSES[sub.category]}`}
                  >
                    {sub.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-slate-700">{formatDate(sub.renewalDate)}</span>
                  {soon && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">
                      {days === 0 ? "Today" : `${days}d`}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {dueForDecision ? (
                    <div className="flex items-center justify-end gap-3">
                      <span className="hidden text-xs font-semibold text-orange-700 sm:inline">
                        Renewing soon —
                      </span>
                      <button
                        onClick={() => onRenew(sub)}
                        className="font-bold text-emerald-600 hover:text-emerald-700"
                      >
                        Renew
                      </button>
                      <button
                        onClick={() => onDelete(sub.id)}
                        className="font-bold text-red-600 hover:text-red-700"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => onEdit(sub)}
                        className="mr-3 font-bold text-brand-600 hover:text-brand-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(sub.id)}
                        className="font-bold text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
