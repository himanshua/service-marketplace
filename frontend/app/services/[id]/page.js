"use client"; // Client-side component

import { useEffect, useState } from "react"; // React hooks
import { useParams, useRouter } from "next/navigation"; // Hooks to get URL params and router
import Link from "next/link"; // Next.js link

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; // API base URL

export default function ServiceDetailPage() {
  const { id } = useParams(); // Get service ID from URL
  const router = useRouter(); // Router instance
  const [service, setService] = useState(null); // State for service data
  const [loading, setLoading] = useState(true); // Loading state
  const [err, setErr] = useState(""); // Error state
  const [userRole, setUserRole] = useState(""); // User role state
  const [currentUser, setCurrentUser] = useState(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""; // Token from localStorage

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

  useEffect(() => {
    async function fetchUser() {
      if (token) {
        const res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCurrentUser(data.user || null);
        setUserRole(data.user?.role || "");
      }
    }
    fetchUser();
  }, [token]);

  async function handleDelete() {
    // Delete service
    if (confirm("Are you sure you want to delete this service?")) {
      const res = await fetch(`${API}/api/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        router.push("/services"); // Redirect to services page
      } else {
        alert("Failed to delete service");
      }
    }
  }

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
      <p>Status: {service.status}</p>
      {currentUser && (
        <Link
          href={`/chat?expertId=${service.provider._id}&serviceTitle=${encodeURIComponent(service.title)}`}
        >
          <button style={{ width: "100%", marginTop: 16 }}>
            Chat | {service.price}/MIN
          </button>
        </Link>
      )}
      {/* Only show for admins */}
      {userRole === "useradmin" && (
        <>
          <Link href={`/services/${id}/edit`}>
            <button>Edit</button>
          </Link>
          <button onClick={handleDelete} style={{ marginLeft: 8, color: "crimson" }}>
            Delete
          </button>
        </>
      )}
    </main>
  );
}