"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/";

export default function Signup() {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "usernormal" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Signup successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Google session exchange logic (same as home page)
  useEffect(() => {
    if (
      session &&
      session.user &&
      !localStorage.getItem("token")
    ) {
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
            window.location.href = "/"; // or router.push("/") if you want
          }
        });
    }
  }, [session]);

  if (signingIn) {
    return <main style={{ padding: 20, maxWidth: 400, margin: "50px auto" }}>Signing you in...</main>;
  }

  return (
    <main style={{ padding: 20, maxWidth: 400, margin: "50px auto" }}>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
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
        <button type="submit" disabled={loading}>{loading ? "Signing up..." : "Signup"}</button>
      </form>
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          color: '#3c4043',
          border: '1px solid #dadce0',
          borderRadius: 4,
          fontWeight: 500,
          fontSize: 16,
          padding: '8px 16px',
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(60,64,67,.08)',
          marginBottom: 16,
          marginTop: 16,
          width: "100%",
          justifyContent: "center"
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
      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "#111827", fontWeight: 600 }}>
          Log in here
        </Link>
      </p>
      {message && <p>{message}</p>}
    </main>
  );
}