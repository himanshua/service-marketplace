"use client"; // Client-side component

import { useEffect, useState } from "react"; // React hooks
import Link from "next/link"; // Next.js link
import { useRouter } from "next/navigation"; // Next.js router

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; // API base URL
const defaultAvatar = "/images/default-avatar.png"; // place this file in /public/images

export default function ServicesPage() {
  const [services, setServices] = useState([]); // State for services list
  const [loading, setLoading] = useState(true); // Loading state
  const [err, setErr] = useState(""); // Error state
  const [user, setUser] = useState(null); // Add state for user
  const [userRole, setUserRole] = useState(""); // State for user role
  const router = useRouter(); // Initialize router

  useEffect(() => { // Fetch services and check auth
    (async () => {
      try {
        const res = await fetch(`${API}/api/services`); // GET /api/services
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to fetch services");
        setServices(data); // Set services
      } catch (e) {
        setErr(e.message); // Set error
      } finally {
        setLoading(false); // Stop loading
      }
    })();

    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        try {
          const res = await fetch(`${API}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok) {
            setUser(data.user); // Set user if logged in
            setUserRole(data.user.role); // Set user role
          } // Set user role
        } catch (e) {
          console.error("Auth check failed:", e);
        }
      })();
    }
  }, []);

  function handleStartChat(service) {
    const user = JSON.parse(localStorage.getItem("user"));
    router.push("/chat", {
      state: {
        expertName: service.provider.name,
        serviceTitle: service.title,
        userName: user?.name || "",
      },
    });
  }

  if (loading) return <main style={{ padding: 20 }}>Loading services…</main>; // Loading
  if (err) return <main style={{ padding: 20, color: "crimson" }}>{err}</main>; // Error

  return (
    <main style={{ padding: 20, maxWidth: 800, margin: "40px auto" }}>
      <h1>Services</h1>
      {userRole === "useradmin" && ( // Show create link if user is admin
        <p><Link href="/services/create">+ Create New Service</Link></p>
      )}
      {services.length === 0 ? ( // If no services
        <p>No services available.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}> {/* List services */}
          {services.map((service) => (
            <li key={service._id} style={{ border: "1px solid #ccc", padding: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 16 }}>
                <img
                  src={service.provider.avatarUrl || defaultAvatar}
                  alt={`${service.provider.name} avatar`}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "8px",
                    objectFit: "cover",
                    border: "1px solid #ddd",
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <p>Price: ${service.price}</p>
                  <p>Category: {service.category}</p>
                  <p>Provider: {service.provider.name} ({service.provider.email})</p>
                  {userRole === "useradmin" && (
                    <p>
                      <Link href={`/admin/providers/${service.provider._id}/image`}>Add / Update Image</Link>
                    </p>
                  )}
                  <Link href={`/services/${service._id}`}>View Details</Link>
                  {" | "}
                  {user && (
                    <Link href={`/chat?expertId=${service.provider._id}&serviceTitle=${encodeURIComponent(service.title)}`}>
                      <button>Start Chat</button>
                    </Link>
                  )}
                  {userRole === "useradmin" && (
                    <>
                      {" | "}
                      <Link href={`/services/${service._id}/edit`}>
                        <button>Edit</button>
                      </Link>
                      {" | "}
                      <button
                        onClick={async () => {
                          if (confirm("Are you sure you want to delete this service?")) {
                            const token = localStorage.getItem("token");
                            const res = await fetch(`${API}/api/services/${service._id}`, {
                              method: "DELETE",
                              headers: { Authorization: `Bearer ${token}` },
                            });
                            if (res.ok) {
                              alert("Service deleted");
                              setServices(services.filter((s) => s._id !== service._id));
                            } else {
                              alert("Failed to delete service");
                            }
                          }
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}