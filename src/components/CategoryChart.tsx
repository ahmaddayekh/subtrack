import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Category, Subscription } from "../types/subscription";
import { spendByCategory } from "../lib/spend";
import { CATEGORY_COLORS } from "../lib/categoryColors";

export function CategoryChart({ subscriptions }: { subscriptions: Subscription[] }) {
  const data = spendByCategory(subscriptions);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <h3 className="font-display mb-4 text-sm font-bold text-slate-700">
        Monthly spend by category
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f0ed" />
          <XAxis dataKey="category" tick={{ fontSize: 12, fill: "#64748b" }} />
          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip
            formatter={(value) => [`$${Number(value).toFixed(2)}`, "Monthly"]}
            contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0", fontSize: 13 }}
          />
          <Bar dataKey="total" radius={[8, 8, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.category}
                fill={CATEGORY_COLORS[entry.category as Category] ?? CATEGORY_COLORS.Other}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
