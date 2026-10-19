"use client";

import { useEffect } from "react";
<<<<<<< HEAD
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
=======
import { bootstrapSession } from "@/lib/store";

export function StoreBootstrap() {
  useEffect(() => {
    void bootstrapSession();
>>>>>>> 61e2e93070d5da971e2d688117daa9ff6f0b57da
  }, []);

  return null;
}
