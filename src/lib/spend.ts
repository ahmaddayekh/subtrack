import { differenceInCalendarDays, parseISO } from "date-fns";
import type { Subscription } from "../types/subscription";

export function toMonthlyAmount(sub: Subscription): number {
  switch (sub.billingCycle) {
    case "weekly":
      return sub.price * 4.345; // avg weeks per month
    case "yearly":
      return sub.price / 12;
    case "monthly":
    default:
      return sub.price;
  }
}

export function totalMonthlySpend(subs: Subscription[]): number {
  return subs.reduce((sum, s) => sum + toMonthlyAmount(s), 0);
}

export function totalYearlySpend(subs: Subscription[]): number {
  return totalMonthlySpend(subs) * 12;
}

export function daysUntilRenewal(sub: Subscription): number {
  return differenceInCalendarDays(parseISO(sub.renewalDate), new Date());
}

export function isRenewingSoon(sub: Subscription, withinDays = 7): boolean {
  const days = daysUntilRenewal(sub);
  return days >= 0 && days <= withinDays;
}

export function spendByCategory(
  subs: Subscription[],
): { category: string; total: number }[] {
  const map = new Map<string, number>();
  for (const s of subs) {
    map.set(s.category, (map.get(s.category) ?? 0) + toMonthlyAmount(s));
  }
  return Array.from(map.entries()).map(([category, total]) => ({
    category,
    total: Math.round(total * 100) / 100,
  }));
}
