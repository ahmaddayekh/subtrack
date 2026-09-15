import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "./AuthContext";
import type { Plan } from "../lib/billing";

interface PlanContextValue {
  plan: Plan;
  loading: boolean;
}

const PlanContext = createContext<PlanContextValue | undefined>(undefined);

// Provided once at the app root so there's exactly one Firestore listener
// (and one lazy-create attempt for a missing plan doc) per session — having
// every consumer run its own onSnapshot independently caused a race right
// after signup where two instances both tried to create the same doc before
// Firestore's security-rule auth context had settled.
export function PlanProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [plan, setPlan] = useState<Plan>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPlan("free");
      setLoading(false);
      return;
    }

    const ref = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setDoc(ref, { plan: "free", updatedAt: new Date().toISOString() }).catch((err) =>
            console.error("Failed to create default plan doc:", err),
          );
          return;
        }
        setPlan((snap.data().plan as Plan) ?? "free");
        setLoading(false);
      },
      (err) => console.error("Plan listener failed:", err),
    );

    return unsubscribe;
  }, [user]);

  return <PlanContext.Provider value={{ plan, loading }}>{children}</PlanContext.Provider>;
}

export function usePlan(): PlanContextValue {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used within a PlanProvider");
  return ctx;
}
