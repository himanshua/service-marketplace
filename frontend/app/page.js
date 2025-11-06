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
    <main style={{ padding: 20, maxWidth: 700, margin: "40px auto" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(220px, 240px) 1fr",
          alignItems: "center",
          gap: "24px",
          marginBottom: "1.5rem",
        }}
      >
        <img
          src="/images/Himanshu Tiwari.jpg"
          alt="Himanshu Tiwari"
          style={{
            width: 240,
            height: 360,
            borderRadius: "12px",
            objectFit: "cover",
            boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
            justifySelf: "start",
          }}
        />
        <h1
          style={{
            fontSize: "2.4rem",
            fontWeight: 700,
            margin: 0,
            color: "#2c3e50",
            lineHeight: 1.3,
            textAlign: "left",
          }}
        >
          Get Your Unique Psychic and Jyotishvidya Reading
          <br />
          offered by the Best Online Psychic Himanshu Tiwari
        </h1>
      </div>
      {user ? ( // If logged in, show user info
        <>
          <p>Welcome, {user.name} ({user.role})!</p>
          <Link href="/profile" className="profile-btn">View Profile</Link>
          {" | "}
          <Link href="/services">
            <button style={{ marginLeft: 8 }}>View Chat/Call Services</button>
          </Link>
          {" | "}
          <button onClick={() => { localStorage.clear(); router.push("/login"); }}>Logout</button>
        </>
      ) : ( // If not logged in, show links
        <>
          <p>Please log in or sign up.</p>
          <Link href="/login">Login</Link> | <Link href="/signup">Signup</Link>
        </>
      )}
    </main>
  );
}