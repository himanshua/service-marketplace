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
  // Start at top right
  const [pos, setPos] = useState({ x: 24, y: 24 }); // x = right, y = top
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    fetch("/api/visitors")
      .then((res) => res.json())
      .then((data) => setVisitors(data.visitors || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Only runs in browser
    const update = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const onDragStart = (e) => {
    setDragging(true);
    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
    // Calculate offset from the widget's top-right corner
    const widget = e.currentTarget.getBoundingClientRect();
    dragOffset.current = {
      x: widget.right - clientX,
      y: clientY - widget.top,
    };
    document.body.style.userSelect = "none";
  };

  const onDrag = (e) => {
    if (!dragging) return;
    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
    // Calculate new right and top
    let newRight = Math.max(0, Math.min(window.innerWidth - 260, window.innerWidth - clientX - dragOffset.current.x));
    let newTop = Math.max(0, Math.min(window.innerHeight - 80, clientY - dragOffset.current.y));
    setPos({ x: newRight, y: newTop });
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

  // Calculate reduced top and maxHeight
  const reducedTop = pos.y + (viewport.height ? viewport.height * 0.10 : 0);
  const reducedMaxHeight = viewport.height ? viewport.height * 0.80 - 38 : undefined;

  return (
    <aside
      style={{
        position: "fixed",
        right: pos.x,
        top: reducedTop,
        width: "min(260px, calc(100vw - 32px))",
        maxHeight: reducedMaxHeight,
        overflowY: "auto",
        padding: "13px 14px 14px",
        borderRadius: 16,
        background: "#fff",
        boxShadow: "0 18px 40px rgba(0,0,0,0.15)",
        zIndex: 2000,
        cursor: dragging ? "grabbing" : "grab",
        userSelect: dragging ? "none" : "auto",
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
      <h4 style={{ margin: "0 0 12px", color: "#0c3c7a", fontSize: 15 }}>Recent visitors</h4>
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