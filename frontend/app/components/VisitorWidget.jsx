"use client";
import { useEffect, useState } from "react";

export default function VisitorWidget() {
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    fetch("/api/visitors?limit=10")
      .then((res) => res.json())
      .then((data) => setVisitors(data.visitors || []))
      .catch(() => {});
  }, []);

  if (!visitors.length) return null;

  return (
    <aside style={{ position: "fixed", right: 24, bottom: 24, width: 260, padding: "16px 18px", borderRadius: 16, background: "#fff", boxShadow: "0 18px 40px rgba(0,0,0,0.15)", zIndex: 2000 }}>
      <h4 style={{ margin: "0 0 12px 0", color: "#0c3c7a" }}>Recent visitors</h4>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {visitors.map((visit) => (
          <li key={visit.id} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
            <img src={`https://flagcdn.com/32x24/${visit.countryCode?.toLowerCase()}.png`} alt={visit.country || "Flag"} style={{ width: 24, height: 18, marginRight: 8, borderRadius: 4, boxShadow: "0 0 4px rgba(0,0,0,0.2)" }} />
            <div style={{ fontSize: 14 }}>
              <strong>{visit.country || "Unknown"}</strong>
              <div style={{ fontSize: 12, color: "#6b7a8c" }}>{visit.city || "—"}</div>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}