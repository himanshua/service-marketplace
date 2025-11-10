"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const PAYMENT_TTL_MS = 30 * 60 * 1000;

// ---- Hard-coded PayPal configuration ----
const PAYPAL_MODE = process.env.NEXT_PUBLIC_PAYPAL_MODE === "live" ? "live" : "sandbox";

const PAYPAL_SETTINGS = {
  sandbox: {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_SANDBOX_CLIENT_ID ?? "",
    business: process.env.NEXT_PUBLIC_PAYPAL_SANDBOX_BUSINESS ?? "",
    currency: "USD",
    amount: "50.00",
  },
  live: {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_LIVE_CLIENT_ID ?? "",
    business: process.env.NEXT_PUBLIC_PAYPAL_LIVE_BUSINESS ?? "",
    currency: "USD",
    amount: "50.00",
  },
};

const ACTIVE = PAYPAL_SETTINGS[PAYPAL_MODE];

if (!ACTIVE.clientId) {
  return (
    <div className="rounded-md border border-amber-400 bg-amber-50 p-4 text-sm text-amber-700">
      PayPal client ID missing. Update PAYPAL_* constants.
      <div className="mt-1 text-xs text-amber-600">
        Mode: {PAYPAL_MODE.toUpperCase()} • Business: {ACTIVE.business || "unset"}
      </div>
    </div>
  );
}

const PAYPAL_SDK_URL = `https://www.paypal.com/sdk/js?client-id=${ACTIVE.clientId}&currency=${ACTIVE.currency}&components=buttons`;
// --------------------------------------------------------------

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
  const [expiresAt, setExpiresAt] = useState(null);
  const [remainingMs, setRemainingMs] = useState(0);
  const [paypalError, setPaypalError] = useState("");
  const [isInitializingPayPal, setIsInitializingPayPal] = useState(false);
  const [isCapturingPayment, setIsCapturingPayment] = useState(false);

  const paypalContainerRef = useRef(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const paidKey = useMemo(
    () => (expertId ? `chat-paid-${expertId}` : null),
    [expertId]
  );
  const pendingStorageKey = useMemo(
    () => (paidKey ? `${paidKey}-pending` : null),
    [paidKey]
  );

  const baseQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (expertId) params.set("expertId", expertId);
    if (serviceTitle) params.set("serviceTitle", serviceTitle);
    return params.toString();
  }, [expertId, serviceTitle]);

  const basePath = useMemo(
    () => (baseQuery ? `/chat?${baseQuery}` : "/chat"),
    [baseQuery]
  );

  const formatRemaining = useCallback((ms) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const markPaymentAsComplete = useCallback(() => {
    setHasPaid(true);
    setShowPaymentPrompt(false);
    if (typeof window === "undefined") return;

    const now = Date.now();
    const expiry = now + PAYMENT_TTL_MS;

    if (paidKey) {
      sessionStorage.setItem(
        paidKey,
        JSON.stringify({ paid: true, expiresAt: expiry })
      );
    }

    setExpiresAt(expiry);
    setRemainingMs(expiry - now);

    if (
      pendingStorageKey &&
      sessionStorage.getItem(pendingStorageKey) !== null
    ) {
      sessionStorage.setItem("send-after-redirect", pendingStorageKey);
    }
  }, [paidKey, pendingStorageKey]);

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
      markPaymentAsComplete();
    }

    if (
      paymentStatus === "cancel" &&
      typeof window !== "undefined" &&
      pendingStorageKey
    ) {
      sessionStorage.removeItem(pendingStorageKey);
    }

    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", basePath);
    }
    router.replace(basePath, { scroll: false });
  }, [
    payerId,
    paymentStatus,
    paidKey,
    pendingStorageKey,
    basePath,
    router,
    markPaymentAsComplete,
  ]);

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

  useEffect(() => {
    if (!showPaymentPrompt) {
      setPaypalError("");
      setIsInitializingPayPal(false);
      setIsCapturingPayment(false);
    }
  }, [showPaymentPrompt]);

  const createPayPalOrder = useCallback(async () => {
    const payload = {
      amount: ACTIVE.amount,
      currency: ACTIVE.currency,
      intent: "CAPTURE",
      expertId,
      serviceTitle,
    };

    if (typeof window !== "undefined") {
      payload.returnUrl = encodeURIComponent(window.location.href);
      payload.cancelUrl = encodeURIComponent(window.location.href);
    }

    const response = await fetch("/api/paypal/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.id) {
      throw new Error(
        data?.error || "Unable to create a PayPal order right now."
      );
    }
    return data.id;
  }, [expertId, serviceTitle]);

  const capturePayPalOrder = useCallback(async (orderId) => {
    const response = await fetch(`/api/paypal/order/${orderId}/capture`, {
      method: "POST",
    });

    const data = await response.json().catch(() => null);
    if (!response.ok || !data) {
      throw new Error(
        data?.error || "Unable to capture the PayPal order right now."
      );
    }
    return data;
  }, []);

  useEffect(() => {
    if (!showPaymentPrompt) return;
    if (!ACTIVE.clientId) {
      setPaypalError("PayPal client ID missing. Update PAYPAL_* constants.");
      return;
    }

    let isCancelled = false;

    const renderButtons = () => {
      if (isCancelled || !paypalContainerRef.current) return;

      paypalContainerRef.current.innerHTML = "";
      const paypal = window.paypal;
      if (!paypal?.Buttons) {
        setPaypalError("PayPal SDK did not load correctly.");
        return;
      }

      paypal
        .Buttons({
          style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "pay",
          },
          createOrder: () => createPayPalOrder(),
          onApprove: async (data) => {
            try {
              setPaypalError("");
              setIsCapturingPayment(true);
              const capture = await capturePayPalOrder(data.orderID);
              if (capture?.status !== "COMPLETED") {
                throw new Error("Payment was not completed.");
              }
              markPaymentAsComplete();
            } catch (error) {
              console.error("PayPal approval error:", error);
              setPaypalError(
                error.message ||
                  "Unable to complete the payment. Please try again."
              );
            } finally {
              setIsCapturingPayment(false);
            }
          },
          onError: (err) => {
            console.error("PayPal button error:", err);
            if (!isCancelled) {
              setPaypalError("PayPal experienced an error. Please try again.");
            }
          },
        })
        .render(paypalContainerRef.current);
    };

    if (window.paypal?.Buttons) {
      renderButtons();
      return () => {
        isCancelled = true;
      };
    }

    setIsInitializingPayPal(true);
    const scriptId = "aheadterra-paypal-sdk";
    let script = document.getElementById(scriptId);

    const handleReady = () => {
      setIsInitializingPayPal(false);
      renderButtons();
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src =
        PAYPAL_SDK_URL + (PAYPAL_MODE === "sandbox" ? "&debug=true" : "");
      script.async = true;
      script.onload = handleReady;
      script.onerror = () => {
        setIsInitializingPayPal(false);
        setPaypalError("Failed to load PayPal. Please refresh and try again.");
      };
      document.head.appendChild(script);
    } else if (window.paypal?.Buttons) {
      setIsInitializingPayPal(false);
      renderButtons();
    } else {
      script.addEventListener("load", handleReady, { once: true });
    }

    return () => {
      isCancelled = true;
      if (paypalContainerRef.current) {
        paypalContainerRef.current.innerHTML = "";
      }
    };
  }, [
    showPaymentPrompt,
    createPayPalOrder,
    capturePayPalOrder,
    markPaymentAsComplete,
  ]);

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
          Kindly provide your birth details and question below. I will respond to
          your inquiry as quickly as possible.
          <br />
          Please complete the $50 consultation fee via PayPal Checkout to
          continue the conversation.
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
          }
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
              Pay via PayPal Checkout and return automatically to continue
              chatting.
            </p>

            {isInitializingPayPal && (
              <p style={{ color: "#4b5563", marginBottom: 12 }}>
                Loading PayPal…
              </p>
            )}
            {isCapturingPayment && (
              <p style={{ color: "#111827", marginBottom: 12 }}>
                Finalizing payment…
              </p>
            )}
            {paypalError && (
              <p style={{ color: "#b91c1c", fontWeight: 600, marginBottom: 12 }}>
                {paypalError}
              </p>
            )}

            <div
              ref={paypalContainerRef}
              style={{ minHeight: 60, display: "flex", alignItems: "center" }}
            />

            <p style={{ marginTop: 16, color: "#4b5563", fontSize: 12 }}>
              Mode: {PAYPAL_MODE.toUpperCase()} • Business:{" "}
              {ACTIVE.business}
            </p>

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