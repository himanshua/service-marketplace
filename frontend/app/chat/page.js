"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const expertId = searchParams.get("expertId");
  const serviceTitle = searchParams.get("serviceTitle");
  const [expertName, setExpertName] = useState("");
  const [userName, setUserName] = useState(""); // <-- get from backend
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("token");
  const router = useRouter();

  useEffect(() => {
    console.log("ChatPage useEffect called");
    console.log("expertId:", expertId);
    console.log("token:", token);

    async function fetchExpert() {
      console.log("Inside fetchExpert");
      if (expertId && token) {
        const res = await fetch(`${API}/api/auth/experts/${expertId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log("Expert API response:", data);
        setExpertName(data.expert?.name || "Expert");
      }
    }
    fetchExpert();
  }, [expertId, token]);

  useEffect(() => {
    async function fetchUser() {
      if (token) {
        const res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log("User API response:", data);
        setUserName(data.user?.name || "You");
      }
    }
    fetchUser();
  }, [token]);

  useEffect(() => {
    async function fetchMessages() {
      if (expertId && token) {
        const res = await fetch(`${API}/api/chat/${expertId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMessages(data.messages ?? []);
      }
    }
    fetchMessages();
  }, [expertId, token]);

  async function sendMessage() {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { text: message, sender: userName }]);
    setMessage("");
    await fetch(`${API}/api/chat/${expertId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: message }),
    });
    // optional: refetch to sync timestamps
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100vw",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#f7f7f7",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 700,
          marginTop: 40,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          padding: 32,
        }}
      >
        <h1>Chat with {expertName}</h1>
        <h2 style={{ fontWeight: 400, color: "#555" }}>
          {serviceTitle ? `Service: ${serviceTitle}` : ""}
        </h2>
        <div
          style={{
            border: "1px solid #ccc",
            padding: 16,
            minHeight: 300,
            marginBottom: 16,
            background: "#fafafa",
            borderRadius: 4,
          }}
        >
          {messages.length === 0 ? (
            <p>No messages yet.</p>
          ) : (
            messages.map((msg, idx) => (
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
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message…"
            style={{
              flex: 1,
              padding: 12,
              marginRight: 8,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "12px 24px",
              borderRadius: 4,
              background: "#1976d2",
              color: "#fff",
              border: "none",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}