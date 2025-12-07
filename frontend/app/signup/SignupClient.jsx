"use client";
// filepath: c:\Users\Dell\Documents\ServiceMarketplace\frontend\app\signup\SignupClient.jsx
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./signup.css";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/";

export default function SignupClient() {
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

  useEffect(() => {
    if (session?.user && !localStorage.getItem("token")) {
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
    return <main className="signup-main">Signing you in...</main>;
  }

  return (
    <main className="signup-main">
      <div className="signup-container">
        <div className="signup-form-col">
          <h1 className="signup-title">Sign Up</h1>
          <p className="signup-subtitle">
            Already have an account?{" "}
            <Link href="/login" className="signup-link">
              Log In
            </Link>
          </p>
          <form onSubmit={handleSubmit} className="signup-form">
            <input
              name="name"
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              className="signup-input"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="signup-input"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="signup-input"
            />
            <button type="submit" disabled={loading} className="signup-btn">
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
          {message && <p className="signup-message">{message}</p>}
        </div>
        <div className="signup-social-col">
          <div className="signup-or-row">
            <div className="signup-or-line" />
            <span className="signup-or-text">or</span>
            <div className="signup-or-line" />
          </div>
          <button className="signup-google-btn" onClick={() => signIn("google")}>
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
              className="signup-google-logo"
            />
            Continue with Google
          </button>
        </div>
      </div>
    </main>
  );
}