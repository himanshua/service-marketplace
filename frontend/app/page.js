"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./profile/profile.css";
import "./globals.css";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const [signingIn, setSigningIn] = useState(false); // <-- NEW

  // 1. Existing backend JWT user check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        else {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("user");
        }
      })
      .catch((err) => {
        console.error("Auth check failed:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // 2. If Google session exists but no site token, call backend to get JWT
  useEffect(() => {
    if (
      session &&
      session.user &&
      !localStorage.getItem("token")
    ) {
      setSigningIn(true); // <-- Show "Signing you in..."
      fetch(`${API}/api/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            localStorage.setItem("token", data.token);
            window.location.reload();
          }
        });
    }
  }, [session]);

  useEffect(() => {
    if (!user && !session && !loading) {
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [user, session, loading]);

  // Show loading spinner or custom message
  if (loading || status === "loading" || signingIn) {
    return (
      <main className="profile-main">
        {signingIn ? "Signing you in..." : "Loading…"}
      </main>
    );
  }

  const loggedInUser = user || (session && session.user);

  return (
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
        {loggedInUser ? (
          <>
            <p style={{ marginBottom: 24 }}>
              Welcome, {loggedInUser.name || loggedInUser.email}!
            </p>
            {loggedInUser.image && (
              <img src={loggedInUser.image} alt="Profile" style={{ width: 40, borderRadius: "50%", marginBottom: 16 }} />
            )}
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
              onClick={async () => {
                localStorage.clear();
                await signOut({ redirect: false });
                window.location.href = "/"; // or router.refresh() if you want to reload the homepage
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
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#fff',
                color: '#3c4043',
                border: '1px solid #dadce0',
                borderRadius: 4,
                fontWeight: 500,
                fontSize: 16,
                padding: '8px 16px',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(60,64,67,.08)',
                marginBottom: 16,
                marginTop: 16,
              }}
              onClick={() => signIn("google")}
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google logo"
                style={{ width: 20, height: 20, marginRight: 12 }}
              />
              Continue with Google
            </button>
          </>
        )}
        <div style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: "8px" }}>
          <a
            href="https://www.fiverr.com/himanshutiwari"
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
  );
}