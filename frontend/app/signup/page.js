"use client";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Signup() {
  const { data: session } = useSession();
  const [signingIn, setSigningIn] = useState(false);

  // Google session exchange logic (same as home page)
  useEffect(() => {
    if (session && session.user && !localStorage.getItem("token")) {
      setSigningIn(true);
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
            window.location.href = "/"; // or reload/redirect as needed
          }
        });
    }
  }, [session]);

  if (signingIn) {
    return <main>Signing you in...</main>;
  }

  return (
    <main style={{ padding: 20, maxWidth: 400, margin: "50px auto" }}>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        {" "}
        {/* Form with submit handler */}
        <input
          name="name" // Matches backend field
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Signup</button>
      </form>
      <button
        style={{
          display: "flex",
          alignItems: "center",
          background: "#fff",
          color: "#3c4043",
          border: "1px solid #dadce0",
          borderRadius: 4,
          fontWeight: 500,
          fontSize: 16,
          padding: "8px 16px",
          cursor: "pointer",
          boxShadow: "0 1px 2px rgba(60,64,67,.08)",
          marginBottom: 16,
          marginTop: 16,
        }}
        onClick={() => signIn("google")}
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google logo"
          style={{ width: 20, height: 20, marginRight: 12 }}
        />
        Continue with Google
      </button>
      <p
        style={{
          marginTop: "1.5rem",
          textAlign: "center",
          fontSize: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <span style={{ color: "#6b7280" }}>Already have an account?</span>
        <Link
          href="/login"
          style={{
            display: "inline-block",
            padding: "12px 22px",
            borderRadius: 999,
            background: "#111827",
            color: "#fff",
            fontWeight: 700,
            textDecoration: "none",
            letterSpacing: "0.05em",
            boxShadow: "0 12px 28px rgba(17, 24, 39, 0.35)",
          }}
        >
          Log in here
        </Link>
      </p>
      {message && <p>{message}</p>} {/* Show message */}
    </main>
  );
}