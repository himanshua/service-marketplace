"use client"; // Client-side component

import { useState, useEffect } from "react"; // React hooks
import { useRouter } from "next/navigation"; // Navigation hook
import Link from "next/link"; // Next.js link

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; // API base URL

export default function CreateServicePage() {
  const router = useRouter(); // Hook for navigation
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "" }); // Form state
  const [message, setMessage] = useState(""); // Success/error message
  const [loading, setLoading] = useState(false); // Loading state
  const [token, setToken] = useState(""); // Token state
  const [errors, setErrors] = useState({}); // Validation errors

  useEffect(() => { // Check auth on mount
    const t = localStorage.getItem("token"); // Get token
    if (!t) {
      router.replace("/login"); // Redirect if not logged in
      return;
    }
    setToken(t); // Set token
  }, [router]);

  function handleChange(e) { // Update form state
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) { // Handle form submission
    e.preventDefault();
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Title is required";
    if (!form.description.trim()) nextErrors.description = "Description is required";
    if (!form.category.trim()) nextErrors.category = "Category is required";
    if (form.price === "" || Number(form.price) <= 0)
      nextErrors.price = "Price must be greater than zero";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setMessage("");
    setLoading(true); // Show loading
    try {
      const res = await fetch(`${API}/api/services`, { // POST to create service
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send JWT
        },
        body: JSON.stringify(form), // Send form data
      });
      const data = await res.json();
      if (res.ok) { // Success
        setMessage("✅ Service created! Redirecting...");
        setTimeout(() => router.push("/services"), 2000); // Redirect to services list
      } else {
        setMessage(data.message || "❌ Failed to create service"); // Error
      }
    } catch (err) {
      setMessage("⚠️ Network error: " + err.message); // Network error
    } finally {
      setLoading(false); // Hide loading
    }
  }

  if (!token) return <main style={{ padding: 20 }}>Loading…</main>; // Loading if no token

  return (
    <main style={{ padding: 20, maxWidth: 400, margin: "50px auto" }}>
      <h1>Create Service</h1>
      <form onSubmit={handleSubmit} noValidate>
        <input
          name="title"
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />
        {errors.title && <p style={{ color: "crimson", marginTop: 4 }}>{errors.title}</p>}
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={4}
        />
        {errors.description && <p style={{ color: "crimson", marginTop: 4 }}>{errors.description}</p>}
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          min="0"
        />
        {errors.price && <p style={{ color: "crimson", marginTop: 4 }}>{errors.price}</p>}
        <input
          name="category"
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />
        {errors.category && <p style={{ color: "crimson", marginTop: 4 }}>{errors.category}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Service"}
        </button>
      </form>
      {message && (
        <p style={{ color: message.startsWith("✅") ? "green" : "crimson", marginTop: 12 }}>
          {message}
        </p>
      )} {/* Show message */}
      <Link href="/services">Back to Services</Link> {/* Back link */}
    </main>
  );
}