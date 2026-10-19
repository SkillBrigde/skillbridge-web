"use client";

import { useEffect } from "react";
import { actions } from "@/lib/store";

export function StoreBootstrap() {
  useEffect(() => {
    // Initial maintenance run on mount
    actions.runMaintenance();

    // Regular maintenance interval to handle expiring locks, auto-accept escrow, etc.
    const interval = setInterval(() => {
      actions.runMaintenance();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
