"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <main style={{ padding: 20 }}>Loading…</main>;

  return (
    <main style={{ padding: 20, maxWidth: 600, margin: "40px auto", textAlign: "center" }}>
      <img
        src="/images/Himanshu Tiwari.jpg"
        alt="Himanshu Tiwari"
        style={{ width: "180px", borderRadius: "50%", marginBottom: 24 }}
      />
      <h1>Service Marketplace</h1>
      {user ? (
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
      ) : (
        <>
          <p>Please log in or sign up.</p>
          <Link href="/login">Login</Link> | <Link href="/signup">Signup</Link>
        </>
      )}
    </main>
  );
}