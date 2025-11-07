"use client"; // This tells Next.js this is a client-side component (runs in the browser, not server)

import React, { useState, useEffect } from "react"; // Import React and useState hook for managing component state
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = unknown

  const router = useRouter();
  const API_Base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    // Only runs on client
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Make POST request to backend login endpoint
      const res = await fetch(`${API_Base}/api/auth/login`, {
        method: "POST", // HTTP method
        headers: { "Content-Type": "application/json" }, // Tell server we're sending JSON string
        body: JSON.stringify({ email, password }), // Convert form data to JSON string
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Login successful");
        // Store authentication data in browser localStorage

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("user", JSON.stringify(data.user)); // store user too

        // Redirect based on backend roles: useradmin | userexpert | usernormal
        if (data.user.role === "useradmin") router.push("/admin");
        else if (data.user.role === "userexpert") router.push("/expert");
        else router.push("/profile");
      } else {
        setMessage(data.message || "❌ Invalid credentials");
      }
    } catch (err) {
      setMessage("⚠️ Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything until we know if user is logged in
  if (isLoggedIn === null) {
    return null; // or <main>Loading...</main>
  }

  if (isLoggedIn) {
    return <main><h1>Welcome!</h1></main>;
  }

  return (
    <main style={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
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
        <span style={{ color: "#6b7280" }}>New to Terra?</span>
        <Link
          href="/signup"
          style={{
            display: "inline-block",
            padding: "12px 22px",
            borderRadius: 999,
            background: "#f97316",
            color: "#fff",
            fontWeight: 700,
            textDecoration: "none",
            letterSpacing: "0.05em",
            boxShadow: "0 12px 28px rgba(249, 115, 22, 0.35)",
          }}
        >
          Create your account
        </Link>
      </p>
      {message && <p>{message}</p>}
    </main>
  );
}
