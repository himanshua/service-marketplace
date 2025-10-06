"use client";
import React, { useState } from "react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const role = "usernormal";
  const [message, setMessage] = useState("");

  const backendReady = !!process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!backendReady) {
      setMessage("Backend not deployed yet.");
      return;
    }
    setMessage("Attempting signup (backend to be added)...");
  };

  return (
    <main style={{ maxWidth: 420, margin: "60px auto", padding: 24, background: "#fff", borderRadius: 8, fontFamily: "sans-serif" }}>
      <h1>Signup</h1>
      {!backendReady && (
        <div style={{ background: "#fff3cd", padding: 10, border: "1px solid #ffe58f", borderRadius: 4, marginBottom: 12 }}>
          Backend not deployed yet. Form will not submit.
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Signup</button>
      </form>
      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </main>
  );
}
