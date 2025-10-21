"use client";
import { useState } from "react";
import{useRouter}from"next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"; 



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
        <button type="submit" disabled={loading}> {/* Submit button */}
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
      {message && <p>{message}</p>} {/* Show message */}
    </main>
  );
}