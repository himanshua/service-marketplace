"use client";
import { useEffect, useState, useRef } from "react";

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
  const [pos, setPos] = useState({ x: 24, y: 24 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    fetch("/api/visitors")
      .then((res) => res.json())
      .then((data) => setVisitors(data.visitors || []))
      .catch(() => {});
  }, []);

  const onDragStart = (e) => {
    setDragging(true);
    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
    dragOffset.current = {
      x: clientX - pos.x,
      y: clientY - pos.y,
    };
    document.body.style.userSelect = "none";
  };

  const onDrag = (e) => {
    if (!dragging) return;
    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
    let newX = clientX - dragOffset.current.x;
    let newY = clientY - dragOffset.current.y;
    // Keep inside viewport
    newX = Math.max(0, Math.min(window.innerWidth - 260, newX));
    newY = Math.max(0, Math.min(window.innerHeight - 80, newY));
    setPos({ x: newX, y: newY });
  };

  const onDragEnd = () => {
    setDragging(false);
    document.body.style.userSelect = "";
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e) => onDrag(e);
    const up = () => onDragEnd();
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
    // eslint-disable-next-line
  }, [dragging]);

  if (!visible) return null;

  const list = visitors.length
    ? visitors
    : [{ _id: "placeholder", country: "— No visitors yet —", city: "Check back soon", region: "", createdAt: null, countryCode: "" }];

  return (
    <aside
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: "min(260px, calc(100vw - 32px))",
        maxHeight: "calc(80vh - 38px)",
        overflowY: "auto",
        padding: "13px 14px 14px",
        borderRadius: 16,
        background: "#fff",
        boxShadow: "0 18px 40px rgba(0,0,0,0.15)",
        zIndex: 2000,
        cursor: dragging ? "grabbing" : "default",
        userSelect: dragging ? "none" : "auto",
      }}
    >
      <div
        style={{
          cursor: "grab",
          margin: "-13px -14px 6px",
          padding: "9px 14px 6px",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          background: "rgba(240,245,255,0.85)",
        }}
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
        aria-label="Drag visitor widget"
      >
        <button
          onClick={() => setVisible(false)}
          aria-label="Close visitor widget"
          style={{
            position: "absolute",
            top: 8,
            right: 10,
            border: "none",
            background: "transparent",
            fontSize: 16,
            cursor: "pointer",
            color: "#7a8797",
          }}
        >
          ×
        </button>
        <h4 style={{ margin: 0, color: "#0c3c7a", fontSize: 15 }}>Recent visitors</h4>
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {list.map((visit) => (
          <li key={visit._id} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            {visit.countryCode ? (
              <img
                src={`https://flagcdn.com/48x36/${visit.countryCode.toLowerCase()}.png`}
                width={20}
                height={15}
                alt={visit.country || "Flag"}
                style={{ borderRadius: 4, boxShadow: "0 0 4px rgba(0,0,0,0.2)" }}
              />
            ) : (
              <div style={{ width: 20, height: 15, borderRadius: 4, background: "#e0e6ef" }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 12 }}>{visit.city || "Unknown City"}</div>
              <div style={{ fontSize: 10, color: "#6b7483" }}>
                {[visit.region, visit.country].filter(Boolean).join(", ") || "Unknown Region"}
              </div>
              <div style={{ fontSize: 9, color: "#9da5b4", marginTop: 2 }}>{formatGMT(visit.createdAt)}</div>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setVisible(false)}
        style={{
          marginTop: 8,
          width: "100%",
          border: "1px solid #ccd3dd",
          borderRadius: 8,
          padding: "6px 0",
          background: "#f5f7fb",
          color: "#41506a",
          fontWeight: 600,
          cursor: "pointer",
          fontSize: 13,
        }}
      >
        Close
      </button>
    </aside>
  );
}