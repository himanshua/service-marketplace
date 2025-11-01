"use client"; // Client-side component

import { useEffect, useState } from "react"; // React hooks
import Link from "next/link"; // Next.js link
import { useRouter } from "next/navigation"; // Next.js router

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; // API base URL

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
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <p>Price: ${service.price}</p>
              <p>Category: {service.category}</p>
              <p>Provider: {service.provider.name} ({service.provider.email})</p>
              <Link href={`/services/${service._id}`}>View Details</Link>
              {" | "}
              {user && (
                <Link
                  href={`/chat?expertId=${service.provider._id}&serviceTitle=${encodeURIComponent(service.title)}`}
                >
                  <button>Start Chat</button>
                </Link>
              )}
              {/* Only show Edit/Delete for admins */}
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
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}