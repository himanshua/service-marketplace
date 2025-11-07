"use client"; // Client-side component

import { useEffect, useState } from "react"; // React hooks
import { useRouter } from "next/navigation"; // Navigation hook
import Link from "next/link"; // Next.js link component

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; // API base URL

export default function Home() {
  const router = useRouter(); // Hook for navigation
  const [user, setUser] = useState(null); // State for user data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => { // Run on mount to check auth
    const token = localStorage.getItem("token"); // Get token from storage
    if (!token) { // If no token, stop loading
      setLoading(false);
      return;
    }
    (async () => { // Fetch user data if token exists
      try {
        const res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.user); // Set user if success
        } else {
          localStorage.removeItem("token"); // Clear invalid token
          localStorage.removeItem("role");
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false); // Stop loading
      }
    })();
  }, []);

  if (loading) return <main style={{ padding: 20 }}>Loading…</main>; // Show loading

  return (
    <main>
      <div className="hero-grid">
        <img className="hero-image" src="/images/Himanshu Tiwari.jpg" alt="Himanshu Tiwari" />
        <h1>Get Your Unique Psychic and Jyotishvidya Reading<br />offered by the Best Online Psychic Himanshu Tiwari</h1>
      </div>
      {user ? (
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <p>Welcome, {user.name} ({user.role})!</p>
          <Link href="/profile" className="profile-btn">View Profile</Link>
          {" | "}
          <Link href="/services">
            <button style={{ margin: "0 8px" }}>View Chat/Call Services</button>
          </Link>
          {" | "}
          <button onClick={() => { localStorage.clear(); router.push("/login"); }}>
            Logout
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <p>Please log in or sign up.</p>
          <div style={{ display: "inline-flex", gap: "12px" }}>
            <Link
              href="/login"
              style={{
                padding: "10px 22px",
                borderRadius: 999,
                background: "#111827",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              Login
            </Link>
            <Link
              href="/signup"
              style={{
                padding: "10px 22px",
                borderRadius: 999,
                background: "#f97316",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 600,
                letterSpacing: "0.05em",
                boxShadow: "0 10px 25px rgba(249, 115, 22, 0.35)",
              }}
            >
              Signup
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}