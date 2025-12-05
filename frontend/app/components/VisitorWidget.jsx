"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "aheadterra_recent_visitors";
const LIMIT = 10;

const fetchVisitor = async () => {
  const res = await fetch("https://ipapi.co/json/");
  if (!res.ok) throw new Error("geo lookup failed");
  const data = await res.json();
  return {
    id: `visit-${Date.now()}`,
    country: data.country_name || "Unknown",
    countryCode: data.country || "",
    city: data.city || "",
  };
};

export default function VisitorWidget() {
  const [visitors, setVisitors] = useState([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setVisitors(stored);

    fetchVisitor()
      .then((current) => {
        const updated = [current, ...stored].slice(0, LIMIT);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setVisitors(updated);
      })
      .catch(() => {});
  }, []);

  if (!visible || !visitors.length) return null;

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
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {visitors.map((visit) => (
          <li key={visit.id} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
            {visit.countryCode ? (
              <img
                src={`https://flagcdn.com/32x24/${visit.countryCode.toLowerCase()}.png`}
                alt={visit.country}
                style={{ width: 24, height: 18, marginRight: 8, borderRadius: 4, boxShadow: "0 0 4px rgba(0,0,0,0.2)" }}
              />
            ) : (
              <div style={{ width: 24, height: 18, marginRight: 8, borderRadius: 4, background: "#e0e0e0" }} />
            )}
            <div style={{ fontSize: 14 }}>
              <strong>{visit.country}</strong>
              <div style={{ fontSize: 12, color: "#6b7a8c" }}>{visit.city || "—"}</div>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}