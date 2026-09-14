export type BillingCycle = "weekly" | "monthly" | "yearly";

export const CATEGORIES = [
  "Streaming",
  "Software",
  "Music",
  "Gaming",
  "News",
  "Fitness",
  "Cloud Storage",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  category: Category;
  renewalDate: string; // ISO date string (yyyy-MM-dd)
  notes?: string;
  createdAt: string;
}

export type SubscriptionInput = Omit<Subscription, "id" | "userId" | "createdAt">;
