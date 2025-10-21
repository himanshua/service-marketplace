"use client"; // Client-side component

import { useEffect, useState } from "react"; // React hooks
import { useParams } from "next/navigation"; // Hook to get URL params
import Link from "next/link"; // Next.js link

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; // API base URL

export default function ServiceDetailPage() {
  const { id } = useParams(); // Get service ID from URL
  const [service, setService] = useState(null); // State for service data
  const [loading, setLoading] = useState(true); // Loading state
  const [err, setErr] = useState(""); // Error state

  useEffect(() => {
    // Fetch service on mount
    if (!id) return; // If no ID, skip
    if (!/^[0-9a-fA-F]{24}$/.test(id)) { // skip routes like "create"
      setErr("Invalid service ID");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${API}/api/services/${id}`); // GET /api/services/:id
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Service not found");
        setService(data); // Set service
      } catch (e) {
        setErr(e.message); // Set error
      } finally {
        setLoading(false); // Stop loading
      }
    })();
  }, [id]);

  if (loading) return <main style={{ padding: 20 }}>Loading service…</main>; // Loading
  if (err) return <main style={{ padding: 20, color: "crimson" }}>{err}</main>; // Error

  return (
    <main style={{ padding: 20, maxWidth: 600, margin: "40px auto" }}>
      <Link href="/services">← Back to Services</Link> {/* Back link */}
      <h1>{service.title}</h1> {/* Service title */}
      <p>{service.description}</p> {/* Description */}
      <p>Price: ${service.price}</p> {/* Price */}
      <p>Category: {service.category}</p> {/* Category */}
      <p>Provider: {service.provider.name} ({service.provider.email})</p> {/* Provider */}
      <p>Status: {service.status}</p> {/* Status */}
      {/* Add more details or actions here, e.g., book service if logged in */}
    </main>
  );
}