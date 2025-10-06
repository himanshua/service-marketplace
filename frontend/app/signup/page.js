"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const role = "usernormal";
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const API_Base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch(`${API_Base}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Signup successful. Redirecting...");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch (err) {
      setMessage("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 420, margin: "60px auto", padding: 24, background: "#fff", borderRadius: 8 }}>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button disabled={loading} type="submit">
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </main>
  );
}
