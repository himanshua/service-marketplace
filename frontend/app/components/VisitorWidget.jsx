"use client";
import { useEffect, useState } from "react";

const toFlag = (code = "") =>
  code.length === 2
    ? String.fromCodePoint(...code.toUpperCase().split("").map((c) => c.charCodeAt(0) + 127397))
    : "🌐";

export default function VisitorWidget() {
  const [visitors, setVisitors] = useState([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    fetch("/api/visitors")
      .then((res) => res.json())
      .then((data) => setVisitors(data.visitors || []))
      .catch(() => {});
  }, []);

  if (!visible) return null;

  const items = visitors.length
    ? visitors
    : [{ _id: "placeholder", country: "— No visitors yet —", city: "Check back soon", countryCode: "" }];

  return (
    <aside
      style={{
        position: "fixed",
        right: 24,
        bottom: 340, // lifted to avoid overlapping signup reminder
        width: 260,
        padding: "16px 18px 14px 18px",
        borderRadius: 16,
        background: "#fff",
        boxShadow: "0 18px 40px rgba(0,0,0,0.15)",
        zIndex: 2000,
      }}
    >
      <button
        onClick={() => setVisible(false)}
        aria-label="Close visitor widget"
        style={{
          position: "absolute",
          top: 10,
          right: 12,
          border: "none",
          background: "transparent",
          fontSize: 16,
          cursor: "pointer",
          color: "#7a8797",
        }}
      >
        ×
      </button>
      <h4 style={{ margin: "0 0 12px 0", color: "#0c3c7a" }}>Recent visitors</h4>
      <ul className="visitor-widget__list">
        {items.map((visit) => (
          <li key={visit._id} className="visitor-widget__item">
            <div className="visitor-widget__flag">{toFlag(visit.countryCode)}</div>
            <div className="visitor-widget__city">{visit.city || "Unknown City"}</div>
            <div className="visitor-widget__region">
              {[visit.region, visit.country].filter(Boolean).join(", ") || "Unknown Region"}
            </div>
            <div className="visitor-widget__time">
              {visit.createdAt
                ? new Date(visit.createdAt).toLocaleString("en-GB", {
                    timeZone: "UTC",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  }) + " GMT"
                : "—"}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}