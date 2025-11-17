"use client";
import { useState } from "react";
import{useRouter}from"next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/"; 



export default function Signup() {
  const router=useRouter(); // Hook to navigate after signup
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "usernormal" }); //Form state
  const [message, setMessage] = useState(""); // Success/error message state
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => { // update form state on input change
    setForm({ ...form, [e.target.name]: e.target.value });
  }

async function handleSubmit(e) {// Handle form submission
   e.preventDefault(); // Prevent page reload
    setMessage(""); // Clear previous messages
    setLoading(true); // Set loading state
    try {
      const res = await fetch(`${API}/api/auth/signup`, { // Send POST request to signup endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json(); // Parse JSON response
      if (res.ok) {
      setMessage("Signup successful! Redirecting to login..."); // Set success message
      setTimeout(() => router.push("/login"), 2000); // Redirect to login after 2 seconds
    } else { 
      setMessage(data.message || "Signup failed"); // Set error message from response
    }
  } catch (error) {
    setMessage(error.message); // Set error message
  } finally {
    setLoading(false); // Reset loading state
  }
}
  

   return (
    <main style={{ padding: 20, maxWidth: 400, margin: "50px auto" }}>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}> {/* Form with submit handler */}
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
      <button className="signup-btn" onClick={() => signIn("google")}>
        <img src="/google-logo.svg" alt="Google" style={{ width: 24, marginRight: 8 }} />
        Sign Up with Google
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