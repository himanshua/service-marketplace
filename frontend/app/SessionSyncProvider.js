"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SessionSyncProvider({ children }) {
  const { data: session } = useSession();
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (
      session &&
      session.user &&
      !localStorage.getItem("token")
    ) {
      setSyncing(true);
      fetch(`${API}/api/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            localStorage.setItem("token", data.token);
            window.location.reload();
          }
        });
    }
  }, [session]);

  if (syncing) {
    return <div style={{ textAlign: "center", marginTop: 40 }}>Signing you in…</div>;
  }

  return children;
}