"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./login.css"; // <-- Add this line

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/";

export default function Login() {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState({ email: "", password: "" });
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
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/"; // Instantly reloads and updates Navbar
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Google session exchange logic
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
            window.location.href = "/";
          }
        });
    }
  }, [session]);

  if (signingIn) {
    return <main className="login-main">Signing you in...</main>;
  }

  return (
    <main className="login-main">
      <div className="login-container">
        {/* Left: Form */}
        <div className="login-form-col">
          <h1 className="login-title">Log In</h1>
          <p className="login-subtitle">
            New here?{" "}
            <Link href="/signup" className="login-link">
              Sign Up
            </Link>
          </p>
          <form onSubmit={handleSubmit} className="login-form">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="login-input"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="login-input"
            />
            <button
              type="submit"
              disabled={loading}
              className="login-btn"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
          {message && <p className="login-message">{message}</p>}
        </div>
        {/* Right: Social */}
        <div className="login-social-col">
          <div className="login-or-row">
            <div className="login-or-line" />
            <span className="login-or-text">or</span>
            <div className="login-or-line" />
          </div>
          <button
            className="login-google-btn"
            onClick={() => signIn("google")}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
              className="login-google-logo"
            />
            Continue with Google
          </button>
        </div>
      </div>
    </main>
  );
}
