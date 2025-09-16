"use client";
import { useEffect } from "react";

interface AnalyticsProviderProps {
  enable?: boolean;
}

export default function AnalyticsProvider({ enable = true }: AnalyticsProviderProps) {
  useEffect(() => {
    if (!enable) return;
    console.log("Analytics enabled");
  }, [enable]);

  return null;
}
