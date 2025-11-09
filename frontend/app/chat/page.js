"use client";

import { Suspense, useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const PAYMENT_TTL_MS = 30 * 60 * 1000; // 30 minutes

// ---- PayPal Configuration (Hardcoded for Vercel Deployment) ----
const PAYPAL_MODE = "live"; // or "sandbox" when testing

// You can use either Merchant ID or Business Email
const PAYPAL_LIVE_BUSINESS = "X449U4V5MLENA"; // your PayPal Merchant ID
const PAYPAL_SANDBOX_BUSINESS = "sb-qsfqi47281361@business.example.com";

const PAYPAL_BUSINESS =
  PAYPAL_MODE === "live" ? PAYPAL_LIVE_BUSINESS : PAYPAL_SANDBOX_BUSINESS;

const PAYPAL_ENDPOINT =
  PAYPAL_MODE === "live"
    ? "https://www.paypal.com/cgi-bin/webscr"
    : "https://www.sandbox.paypal.com/cgi-bin/webscr";
// ---------------------------------------------------------------


function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const expertId = searchParams.get("expertId");
  const serviceTitle = searchParams.get("serviceTitle");
  const paymentStatus = searchParams.get("payment");
  const payerId = searchParams.get("PayerID");
  const [expertName, setExpertName] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [hasPaid, setHasPaid] = useState(false);
  const [showPaymentPrompt, setShowPaymentPrompt] = useState(false);
  const [returnUrl, setReturnUrl] = useState("");
  const [cancelUrl, setCancelUrl] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);
  const [remainingMs, setRemainingMs] = useState(0);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const paidKey = useMemo(() => (expertId ? `chat-paid-${expertId}` : null), [expertId]);
  const pendingStorageKey = useMemo(() => (paidKey ? `${paidKey}-pending` : null), [paidKey]);

  const baseQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (expertId) params.set("expertId", expertId);
    if (serviceTitle) params.set("serviceTitle", serviceTitle);
    return params.toString();
  }, [expertId, serviceTitle]);

  const basePath = useMemo(() => (baseQuery ? `/chat?${baseQuery}` : "/chat"), [baseQuery]);

  const formatRemaining = useCallback((ms) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  useEffect(() => {
  console.log("PayPal Mode:", PAYPAL_MODE);
  console.log("PayPal Live Business:", PAYPAL_LIVE_BUSINESS);
  console.log("PayPal Sandbox Business:", PAYPAL_SANDBOX_BUSINESS);
  console.log("PayPal Business in use:", PAYPAL_BUSINESS);
}, []);


  useEffect(() => {
    if (!pendingStorageKey || typeof window === "undefined") return;
    const storedDraft = sessionStorage.getItem(pendingStorageKey);
    if (storedDraft) setMessage(storedDraft);
  }, [pendingStorageKey]);

  useEffect(() => {
    if (!paidKey || typeof window === "undefined") return;
    const raw = sessionStorage.getItem(paidKey);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      const now = Date.now();
      if (parsed?.paid && parsed.expiresAt && parsed.expiresAt > now) {
        setHasPaid(true);
        setExpiresAt(parsed.expiresAt);
        setRemainingMs(parsed.expiresAt - now);
      } else {
        sessionStorage.removeItem(paidKey);
        setHasPaid(false);
        setExpiresAt(null);
        setRemainingMs(0);
      }
    } catch {
      sessionStorage.removeItem(paidKey);
    }
  }, [paidKey]);

  useEffect(() => {
    if (!paidKey) return;

    const cameFromPayPal = Boolean(payerId || paymentStatus === "cancel");
    if (!cameFromPayPal) return;

    if (payerId) {
      setHasPaid(true);
      setShowPaymentPrompt(false);
      if (typeof window !== "undefined") {
        const expiry = Date.now() + PAYMENT_TTL_MS;
        sessionStorage.setItem(paidKey, JSON.stringify({ paid: true, expiresAt: expiry }));
        setExpiresAt(expiry);
        setRemainingMs(PAYMENT_TTL_MS);
        if (pendingStorageKey) sessionStorage.setItem("send-after-redirect", pendingStorageKey);
      }
    }

    if (paymentStatus === "cancel" && typeof window !== "undefined" && pendingStorageKey) {
      sessionStorage.removeItem(pendingStorageKey);
    }

    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", basePath);
    }
    router.replace(basePath, { scroll: false });
  }, [payerId, paymentStatus, paidKey, pendingStorageKey, basePath, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const origin = window.location.origin;
    const successUrl = `${origin}${basePath}`;
    const cancelParams = new URLSearchParams(baseQuery);
    cancelParams.set("payment", "cancel");
    const cancelUrlComputed = `${origin}/chat?${cancelParams.toString()}`;

    setReturnUrl(successUrl);
    setCancelUrl(cancelUrlComputed);
  }, [basePath, baseQuery]);

  useEffect(() => {
    async function fetchExpert() {
      if (!expertId || !token) return;
      const res = await fetch(`${API}/api/auth/experts/${expertId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setExpertName(data.expert?.name || "Expert");
    }
    fetchExpert();
  }, [expertId, token]);

  useEffect(() => {
    async function fetchUser() {
      if (!token) return;
      const res = await fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUserName(data.user?.name || "You");
    }
    fetchUser();
  }, [token]);

  useEffect(() => {
    async function fetchMessages() {
      if (!expertId || !token) return;
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
    fetchMessages();
  }, [expertId, token]);

  const sendMessageToServer = useCallback(
    async (content) => {
      if (!expertId || !token) return;

      setMessage("");
      if (pendingStorageKey && typeof window !== "undefined") {
        sessionStorage.removeItem(pendingStorageKey);
        sessionStorage.removeItem("send-after-redirect");
      }

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
        setMessages((prev) => [
          ...prev,
          ...(data.customerMessage ? [data.customerMessage] : []),
          ...(data.expertMessage ? [data.expertMessage] : []),
        ]);
      }
    },
    [expertId, token, pendingStorageKey]
  );

  useEffect(() => {
    if (!hasPaid || !pendingStorageKey || typeof window === "undefined") return;

    const targetKey = sessionStorage.getItem("send-after-redirect");
    if (targetKey === pendingStorageKey) {
      const stored = sessionStorage.getItem(pendingStorageKey);
      if (stored) {
        sendMessageToServer(stored);
      }
    }
  }, [hasPaid, pendingStorageKey, sendMessageToServer]);

  useEffect(() => {
    if (!expiresAt || typeof window === "undefined") return;
    const tick = () => {
      const diff = expiresAt - Date.now();
      if (diff <= 0) {
        setHasPaid(false);
        setExpiresAt(null);
        setRemainingMs(0);
        if (paidKey) sessionStorage.removeItem(paidKey);
      } else {
        setRemainingMs(diff);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, paidKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const goToServices = () => {
      window.removeEventListener("popstate", goToServices);
      window.location.replace("/services");
    };

    window.history.pushState({ stayOnChat: true }, "", window.location.href);
    window.addEventListener("popstate", goToServices);

    return () => window.removeEventListener("popstate", goToServices);
  }, []);

  async function sendMessage() {
    if (!message.trim()) return;
    const content = message.trim();

    if (!hasPaid) {
      setShowPaymentPrompt(true);
      if (pendingStorageKey && typeof window !== "undefined") {
        sessionStorage.setItem(pendingStorageKey, content);
      }
      return;
    }

    await sendMessageToServer(content);
  }

  const paypalReady = Boolean(PAYPAL_BUSINESS);

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
        {hasPaid && remainingMs > 0 && (
          <p style={{ marginTop: 8, color: "#10b981", fontWeight: 600 }}>
            Session expires in {formatRemaining(remainingMs)}
          </p>
        )}

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
            onChange={(e) => {
              const next = e.target.value;
              setMessage(next);
              if (pendingStorageKey && typeof window !== "undefined") {
                sessionStorage.setItem(pendingStorageKey, next);
              }
            }}
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
              To unlock messaging, please submit the $50 consultation fee via PayPal. After payment, you will automatically return here and can continue chatting.
            </p>
            {!paypalReady && (
              <p style={{ color: "#b91c1c", fontWeight: 600 }}>
                PayPal business account is not configured. Set the environment variables to enable the button.
              </p>
            )}
            <form
              action={PAYPAL_ENDPOINT}
              method="post"
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <input type="hidden" name="cmd" value="_xclick" />
              <input type="hidden" name="business" value={PAYPAL_BUSINESS || ""} />
              <input
                type="hidden"
                name="item_name"
                value={`Consultation with ${expertName || "Expert"}`}
              />
              <input type="hidden" name="currency_code" value="USD" />
              <input type="hidden" name="amount" value="50.00" />
              <input type="hidden" name="currency_code" value="INR" />

              <input type="hidden" name="return" value={returnUrl} />
              <input type="hidden" name="cancel_return" value={cancelUrl} />
              <input type="hidden" name="rm" value="0" />
              <button
                type="submit"
                disabled={!paypalReady}
                style={{
                  padding: "12px 24px",
                  borderRadius: 8,
                  border: "none",
                  background: paypalReady ? "#ffc439" : "#facc15",
                  color: "#111827",
                  fontWeight: 700,
                  cursor: paypalReady ? "pointer" : "not-allowed",
                }}
              >
                Pay $50 with PayPal ({PAYPAL_MODE === "live" ? "Live" : "Sandbox"})
              </button>
            </form>
            <button
              onClick={() => {
                setShowPaymentPrompt(false);
                if (pendingStorageKey && typeof window !== "undefined") {
                  sessionStorage.removeItem(pendingStorageKey);
                }
              }}
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