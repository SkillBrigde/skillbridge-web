"use client";

import { useEffect } from "react";
import { bootstrapSession } from "@/lib/store";

export function StoreBootstrap() {
  useEffect(() => {
    void bootstrapSession();
  }, []);

  return null;
}
