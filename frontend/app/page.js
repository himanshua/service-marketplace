"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./profile/profile.css"; // Reuse the same CSS as profile page
import "./globals.css";

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

  if (loading) return <main className="profile-main">Loading…</main>;

  return (
    <main className="hero-grid">
      <img
        className="hero-image"
        src="/images/himanshu-tiwari-og.jpg"
        alt="Himanshu Tiwari"
      />
      <div className="profile-content">
        <h1
          style={{
            color: "#1976d2",
            fontWeight: 700,
            fontSize: 32,
            marginBottom: 10,
          }}
        >
          Service Marketplace
        </h1>
        {user ? (
          <>
            <p style={{ marginBottom: 24 }}>
              Welcome, {user.name} ({user.role})!
            </p>
            <Link href="/profile">
              <button className="profile-btn" style={{ marginRight: 8 }}>
                View Profile
              </button>
            </Link>
            <Link href="/services">
              <button className="profile-btn" style={{ marginRight: 8 }}>
                View Chat/Call Services
              </button>
            </Link>
            <button
              className="profile-btn"
              onClick={() => {
                localStorage.clear();
                router.push("/login");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <p style={{ marginBottom: 24 }}>Please log in or sign up.</p>
            <Link href="/login">
              <button className="profile-btn" style={{ marginRight: 8 }}>
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="profile-btn">Signup</button>
            </Link>
          </>
        )}
      </div>
    </main>
  );
}