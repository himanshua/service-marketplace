"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./profile/profile.css";
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
        <h1 style={{ color: "#1976d2", fontWeight: 700, fontSize: 32, marginBottom: 10 }}>
          Best Psychic, Astrology & Tarot Readings in the USA from Himanshu Tiwari
          from the past 10 years
        </h1>
        <h2 style={{ color: "#9c27b0", fontWeight: 600, marginBottom: 12 }}>
          Jyotishvidya, Astrology, Tarot & More by Himanshu Tiwari
        </h2>
        <p style={{ marginBottom: 18 }}>
          Experience accurate psychic readings, astrology insights, and tarot guidance from one of the best online psychics in the USA. Himanshu Tiwari offers Jyotishvidya, astrology, and tarot services to help you find clarity and direction.
        </p>
        <Link href="/services">
          <button className="profile-btn" style={{ marginBottom: 18 }}>
            Order Now on Chat Services
          </button>
        </Link>
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
        <div style={{ marginTop: 32 }}>
          <h3 style={{ marginBottom: 20 }}>Connect with Himanshu Tiwari:</h3>
          <a
            href="https://www.fiverr.com/sellers/himanshutiwari"
            target="_blank"
            rel="noopener noreferrer"
            className="profile-btn"
            style={{ marginRight: 8 }}
          >
            Fiverr
          </a>
          <a
            href="https://www.youtube.com/@himanshutiwari8855"
            target="_blank"
            rel="noopener noreferrer"
            className="profile-btn"
            style={{ marginRight: 8 }}
          >
            YouTube
          </a>
          <a
            href="https://www.facebook.com/himanshuactive/"
            target="_blank"
            rel="noopener noreferrer"
            className="profile-btn"
            style={{ marginRight: 8 }}
          >
            Facebook (Personal)
          </a>
          <a
            href="https://www.facebook.com/vedicindianastrology/"
            target="_blank"
            rel="noopener noreferrer"
            className="profile-btn"
            style={{ marginRight: 4 }}
          >
            Facebook (Page)
          </a>
          <a
            href="https://www.facebook.com/groups/748009425400227"
            target="_blank"
            rel="noopener noreferrer"
            className="profile-btn"
            style={{ marginLeft: 0 }}
          >
            Facebook Group
          </a>
        </div>
      </div>
    </main>
  );
}