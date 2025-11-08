"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function ChatContent() {
  const searchParams = useSearchParams();
  const expertId = searchParams.get("expertId");
  const serviceTitle = searchParams.get("serviceTitle");
  const paymentStatus = searchParams.get("payment");
  const [expertName, setExpertName] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [hasPaid, setHasPaid] = useState(false);
  const [showPaymentPrompt, setShowPaymentPrompt] = useState(false);
  const [returnUrl, setReturnUrl] = useState("");
  const [cancelUrl, setCancelUrl] = useState("");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const router = useRouter();

  const paidKey = useMemo(() => (expertId ? `chat-paid-${expertId}` : null), [expertId]);

  useEffect(() => {
    if (paidKey && typeof window !== "undefined") {
      const saved = sessionStorage.getItem(paidKey);
      if (saved === "true") setHasPaid(true);
    }
  }, [paidKey]);

  useEffect(() => {
    if (paymentStatus === "success" && paidKey) {
      setHasPaid(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(paidKey, "true");
        const url = new URL(window.location.href);
        url.searchParams.delete("payment");
        router.replace(url.toString());
      }
    }
    if (paymentStatus === "cancel" && paidKey) {
      setShowPaymentPrompt(false);
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("payment");
        router.replace(url.toString());
      }
    }
  }, [paymentStatus, paidKey, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams();
      if (expertId) params.set("expertId", expertId);
      if (serviceTitle) params.set("serviceTitle", serviceTitle);
      params.set("payment", "success");
      setReturnUrl(`${window.location.origin}/chat?${params.toString()}`);

      const cancelParams = new URLSearchParams();
      if (expertId) cancelParams.set("expertId", expertId);
      if (serviceTitle) cancelParams.set("serviceTitle", serviceTitle);
      cancelParams.set("payment", "cancel");
      setCancelUrl(`${window.location.origin}/chat?${cancelParams.toString()}`);
    }
  }, [expertId, serviceTitle]);

  useEffect(() => {
    async function fetchExpert() {
      if (expertId && token) {
        const res = await fetch(`${API}/api/auth/experts/${expertId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
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
        const normalized = (data.messages ?? [])
          .filter(Boolean)
          .map((msg) => ({
            sender: msg.sender ?? (msg.expert ? "expert" : "customer"),
            text: msg.text ?? "",
          }));
        setMessages(normalized);
      }
    }
    fetchMessages();
  }, [expertId, token]);

  async function sendMessage() {
    if (!message.trim()) return;
    if (!hasPaid) {
      setShowPaymentPrompt(true);
      return;
    }

    const content = message.trim();
    setMessage("");

    const res = await fetch(`${API}/api/chat/${expertId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: content }),
    });

    if (res.ok) {
      const data = await res.json();
      setMessages((prev) => [...prev, data.customerMessage, data.expertMessage]);
    }
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
        <h1>Chat/Ask with {expertName}</h1>
        <h2 style={{ fontWeight: 400, color: "#555" }}>
          {serviceTitle ? `Service: ${serviceTitle}` : ""}
        </h2>
        <p style={{ marginTop: 12, color: "#444", lineHeight: 1.5 }}>
          Kindly provide your birth details and question below. I will respond to your inquiry as quickly as possible.
          <br />
          Please complete the $50 consultation fee via PayPal to continue the conversation.
        </p>

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
                <strong>
                  {(msg.sender ?? "customer") === "expert"
                    ? expertName || "Expert"
                    : userName || "You"}
                  :
                </strong>{" "}
                {msg.text}
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

      {showPaymentPrompt && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: 20,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              background: "#fff",
              borderRadius: 12,
              padding: 28,
              boxShadow: "0 20px 45px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ marginBottom: 12 }}>Complete Payment to Continue</h2>
            <p style={{ color: "#4b5563", marginBottom: 24, lineHeight: 1.5 }}>
              To unlock messaging, please submit the $50 consultation fee via PayPal Sandbox. After payment,
              you will automatically return here and can continue chatting.
            </p>
            <form
              action="https://www.sandbox.paypal.com/cgi-bin/webscr"
              method="post"
              target="_blank"
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <input type="hidden" name="cmd" value="_xclick" />
              <input type="hidden" name="business" value="sb-twl5f33076536@business.example.com" />
              <input
                type="hidden"
                name="item_name"
                value={`Consultation with ${expertName || "Expert"}`}
              />
              <input type="hidden" name="currency_code" value="USD" />
              <input type="hidden" name="amount" value="50.00" />
              <input type="hidden" name="return" value={returnUrl} />
              <input type="hidden" name="cancel_return" value={cancelUrl} />
              <button
                type="submit"
                style={{
                  padding: "12px 24px",
                  borderRadius: 8,
                  border: "none",
                  background: "#ffc439",
                  color: "#111827",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Pay $50 with PayPal Sandbox
              </button>
            </form>
            <button
              onClick={() => setShowPaymentPrompt(false)}
              style={{
                marginTop: 16,
                padding: "10px 18px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                background: "#fff",
                color: "#6b7280",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<main style={{ padding: 20 }}>Loading…</main>}>
      <ChatContent />
    </Suspense>
  );
}