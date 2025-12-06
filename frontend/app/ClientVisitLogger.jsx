// filepath: c:\Users\Dell\Documents\ServiceMarketplace\frontend\app\ClientVisitLogger.jsx
"use client";
import { useEffect } from "react";

export default function ClientVisitLogger() {
  useEffect(() => {
    if (sessionStorage.getItem("aheadterra_visit_logged")) return;
    fetch("/api/visitors", { method: "POST" }).catch(() => {});
    sessionStorage.setItem("aheadterra_visit_logged", "1");
  }, []);
  return null;
}
