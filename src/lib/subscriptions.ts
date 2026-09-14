import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { Subscription, SubscriptionInput } from "../types/subscription";

const COLLECTION = "subscriptions";

function stripUndefined<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as T;
}

export function subscribeToSubscriptions(
  userId: string,
  onChange: (subs: Subscription[]) => void,
) {
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId),
    orderBy("renewalDate", "asc"),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const subs = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Subscription,
      );
      onChange(subs);
    },
    (error) => {
      console.error("subscribeToSubscriptions failed:", error);
    },
  );
}

export async function addSubscription(
  userId: string,
  input: SubscriptionInput,
) {
  await addDoc(collection(db, COLLECTION), {
    ...stripUndefined(input),
    userId,
    createdAt: new Date().toISOString(),
  });
}

export async function updateSubscription(
  id: string,
  input: SubscriptionInput,
) {
  const data = Object.fromEntries(
    Object.entries(input).map(([k, v]) => [k, v === undefined ? deleteField() : v]),
  );
  await updateDoc(doc(db, COLLECTION, id), data);
}

export async function deleteSubscription(id: string) {
  await deleteDoc(doc(db, COLLECTION, id));
}
