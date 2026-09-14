import type { Category } from "../types/subscription";

// Validated categorical palette (dataviz-checked: CVD-safe adjacent pairs,
// >=3:1 contrast on light surface). "Other" stays neutral on purpose.
export const CATEGORY_COLORS: Record<Category, string> = {
  Streaming: "#7c3aed",
  Software: "#ea580c",
  Music: "#059669",
  Gaming: "#2563eb",
  News: "#dc2626",
  Fitness: "#f59e0b",
  "Cloud Storage": "#db2777",
  Other: "#94a3b8",
};

export const CATEGORY_BADGE_CLASSES: Record<Category, string> = {
  Streaming: "bg-violet-100 text-violet-700",
  Software: "bg-orange-100 text-orange-700",
  Music: "bg-emerald-100 text-emerald-700",
  Gaming: "bg-blue-100 text-blue-700",
  News: "bg-red-100 text-red-700",
  Fitness: "bg-amber-100 text-amber-700",
  "Cloud Storage": "bg-pink-100 text-pink-700",
  Other: "bg-slate-100 text-slate-600",
};
