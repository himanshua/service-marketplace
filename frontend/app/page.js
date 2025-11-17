"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import "./profile/profile.css";
import "./globals.css";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);

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

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => setShowPrompt(true), 3000); // show after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (loading) return <main className="profile-main">Loading…</main>;

  return (
    <>
      <main className="hero-grid">
        <img
          className="hero-image"
          src="/images/himanshu-tiwari-og.jpg"
          alt="Himanshu Tiwari"
        />
        <div className="profile-content">
          <h1 style={{ color: "#1976d2", fontWeight: 700, fontSize: 32, marginBottom: 10 }}>
            Top-Rated Psychic, Astrology, Numerology, Horary & Tarot Readings in the USA — Himanshu Tiwari, Delivering Insight for Over 10 Years
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
                  Log in
                </button>
              </Link>

              <Link href="/signup">
                <button className="profile-btn" style={{ marginRight: 8 }}>
                  Sign up
                </button>
              </Link>
              <button
                className="signup-btn"
                style={{ background: "#fff", color: "#444", border: "1px solid #ccc", display: "flex", alignItems: "center", marginBottom: 16 }}
                onClick={() => signIn("google")}
              >
                <img src="/google-logo.svg" alt="Google" style={{ width: 24, marginRight: 8 }} />
                Sign Up with Google
              </button>
            </>
          )}
          <div style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <a
              href="https://www.fiverr.com/sellers/himanshutiwari"
              target="_blank"
              rel="noopener noreferrer"
              className="profile-btn"
            >
              Fiverr
            </a>
            <a
              href="https://www.youtube.com/@himanshutiwari8855"
              target="_blank"
              rel="noopener noreferrer"
              className="profile-btn"
            >
              YouTube
            </a>
            <a
              href="https://www.facebook.com/himanshuactive/"
              target="_blank"
              rel="noopener noreferrer"
              className="profile-btn"
            >
              Facebook (Personal)
            </a>
            <a
              href="https://www.facebook.com/vedicindianastrology/"
              target="_blank"
              rel="noopener noreferrer"
              className="profile-btn"
            >
              Facebook (Page)
            </a>
            <a
              href="https://www.facebook.com/groups/748009425400227"
              target="_blank"
              rel="noopener noreferrer"
              className="profile-btn"
            >
              Facebook Group
            </a>
          </div>
        </div>
        {showPrompt && !user && (
          <div
            style={{
              position: "fixed",
              bottom: 32,
              right: 32,
              background: "#fff3e0",
              border: "1px solid #ff9800",
              borderRadius: 10,
              padding: 24,
              zIndex: 1000,
              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
              maxWidth: 320,
            }}
          >
            <h3 style={{ margin: 0, marginBottom: 8 }}>Join Terra for Free!</h3>
            <p style={{ margin: 0, marginBottom: 16 }}>
              Sign up now to get your first psychic, astrology, or tarot reading.
            </p>
            <Link href="/signup">
              <button className="signup-btn">Sign Up</button>
            </Link>
            <button
              onClick={() => setShowPrompt(false)}
              style={{
                marginLeft: 12,
                background: "none",
                border: "none",
                color: "#ff9800",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Close
            </button>
          </div>
        )}
      </main>
    </>
  );
}