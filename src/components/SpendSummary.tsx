import type { Subscription } from "../types/subscription";
import { isRenewingSoon, totalMonthlySpend, totalYearlySpend } from "../lib/spend";

export function SpendSummary({ subscriptions }: { subscriptions: Subscription[] }) {
  const monthly = totalMonthlySpend(subscriptions);
  const yearly = totalYearlySpend(subscriptions);
  const renewingSoonCount = subscriptions.filter((s) => isRenewingSoon(s)).length;

  const stats = [
    { label: "Monthly spend", value: `$${monthly.toFixed(2)}`, accent: "text-violet-600" },
    { label: "Yearly spend", value: `$${yearly.toFixed(2)}`, accent: "text-orange-600" },
    { label: "Active subscriptions", value: subscriptions.length.toString(), accent: "text-emerald-600" },
    { label: "Renewing within 7 days", value: renewingSoonCount.toString(), accent: "text-pink-600" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            {stat.label}
          </p>
          <p className={`font-display mt-1 text-2xl font-extrabold ${stat.accent}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
