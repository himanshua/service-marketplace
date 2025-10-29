"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const expertId = searchParams.get("expertId");
  const serviceId = searchParams.get("serviceId");
  const userName = searchParams.get("userName");
  const [expertName, setExpertName] = useState("");
  const [serviceTitle, setServiceTitle] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    // Fetch expert and service details from backend
    async function fetchDetails() {
      if (expertId) {
        const res = await fetch(`${API}/api/experts/${expertId}`);
        const data = await res.json();
        setExpertName(data.name || "Expert");
      }
      if (serviceId) {
        const res = await fetch(`${API}/api/services/${serviceId}`);
        const data = await res.json();
        setServiceTitle(data.title || "");
      }
    }
    fetchDetails();
  }, [expertId, serviceId]);

  function sendMessage() {
    if (!message.trim()) return;
    setChat([...chat, { sender: userName || "You", text: message }]);
    setMessage("");
  }

  return (
    <main style={{
      minHeight: "100vh",
      width: "100vw",
      padding: 0,
      margin: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: "#f7f7f7"
    }}>
      <div style={{
        width: "100%",
        maxWidth: 700,
        marginTop: 40,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: 32
      }}>
        <h1>Welcome! Chat with {expertName}</h1>
        <h2 style={{ fontWeight: 400, color: "#555" }}>{serviceTitle ? `Service: ${serviceTitle}` : ""}</h2>
        <div style={{
          border: "1px solid #ccc",
          padding: 16,
          minHeight: 300,
          marginBottom: 16,
          background: "#fafafa",
          borderRadius: 4
        }}>
          {chat.length === 0 ? (
            <p>No messages yet.</p>
          ) : (
            chat.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: 8 }}>
                <strong>{msg.sender}:</strong> {msg.text}
              </div>
            ))
          )}
        </div>
        <div style={{ display: "flex" }}>
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type your message…"
            style={{ flex: 1, padding: 12, marginRight: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
          <button onClick={sendMessage} style={{ padding: "12px 24px", borderRadius: 4, background: "#1976d2", color: "#fff", border: "none" }}>
            Send
          </button>
        </div>
      </div>
    </main>
  );
}