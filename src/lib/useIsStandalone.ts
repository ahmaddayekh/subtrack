import { useEffect, useState } from "react";

function detect(): boolean {
  if (typeof window === "undefined") return false;
  const displayModeStandalone = window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone = (window.navigator as { standalone?: boolean }).standalone === true;
  return displayModeStandalone || iosStandalone;
}

export function useIsStandalone(): boolean {
  const [isStandalone, setIsStandalone] = useState(detect);

  useEffect(() => {
    const mq = window.matchMedia("(display-mode: standalone)");
    const listener = () => setIsStandalone(detect());
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  return isStandalone;
}
