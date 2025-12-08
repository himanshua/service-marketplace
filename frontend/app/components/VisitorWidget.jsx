"use client";
import { useEffect, useState } from "react";

const formatGMT = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-GB", {
        timeZone: "UTC",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }) + " GMT"
    : "—";

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

  const list = visitors.length
    ? visitors
    : [{ _id: "placeholder", country: "— No visitors yet —", city: "Check back soon", region: "", createdAt: null, countryCode: "" }];

  return (
    <aside
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        bottom: "auto",
        width: "min(260px, calc(100vw - 32px))",
        maxHeight: "calc(100vh - 48px)",
        overflowY: "auto",
        padding: "16px 18px 18px",
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
      <h4 style={{ margin: "0 0 12px", color: "#0c3c7a" }}>Recent visitors</h4>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {list.map((visit) => (
          <li key={visit._id} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            {visit.countryCode ? (
              <img
                src={`https://flagcdn.com/48x36/${visit.countryCode.toLowerCase()}.png`}
                width={24}
                height={18}
                alt={visit.country || "Flag"}
                style={{ borderRadius: 4, boxShadow: "0 0 4px rgba(0,0,0,0.2)" }}
              />
            ) : (
              <div style={{ width: 24, height: 18, borderRadius: 4, background: "#e0e6ef" }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{visit.city || "Unknown City"}</div>
              <div style={{ fontSize: 12, color: "#6b7483" }}>
                {[visit.region, visit.country].filter(Boolean).join(", ") || "Unknown Region"}
              </div>
              <div style={{ fontSize: 11, color: "#9da5b4", marginTop: 4 }}>{formatGMT(visit.createdAt)}</div>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setVisible(false)}
        style={{
          marginTop: 12,
          width: "100%",
          border: "1px solid #ccd3dd",
          borderRadius: 8,
          padding: "8px 0",
          background: "#f5f7fb",
          color: "#41506a",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </aside>
  );
}