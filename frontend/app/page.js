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

  useEffect(() => {
    if (
      session &&
      session.user &&
      !localStorage.getItem("token")
    ) {
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

  if (loading || status === "loading") {
    return <main className="profile-main">Loading…</main>;
  }

  const loggedInUser = user || (session && session.user);

  return (
    <main className="profile-main" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafbfc" }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        maxWidth: 700,
        width: "100%",
        padding: "40px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <img
          className="hero-image"
          src="/images/himanshu-tiwari-og.jpg"
          alt="Himanshu Tiwari"
          style={{ width: 120, borderRadius: "50%", marginBottom: 24 }}
        />
        <h1 style={{ color: "#1976d2", fontWeight: 700, fontSize: 32, marginBottom: 10, textAlign: "center" }}>
          Top-Rated Psychic, Astrology, Numerology, Horary & Tarot Readings in the USA — Himanshu Tiwari, Delivering Insight for Over 10 Years
        </h1>
        <h2 style={{ color: "#9c27b0", fontWeight: 600, marginBottom: 12, textAlign: "center" }}>
          Jyotishvidya, Astrology, Tarot & More by Himanshu Tiwari
        </h2>
        <p style={{ marginBottom: 18, textAlign: "center" }}>
          Experience accurate psychic readings, astrology insights, and tarot guidance from one of the best online psychics in the USA. Himanshu Tiwari offers Jyotishvidya, astrology, and tarot services to help you find clarity and direction.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginBottom: 18 }}>
          <Link href="/services">
            <button className="profile-btn">
              Order Now on Chat Services
            </button>
          </Link>
          {loggedInUser && (
            <>
              <Link href="/profile">
                <button className="profile-btn">
                  View Profile
                </button>
              </Link>
              <Link href="/services">
                <button className="profile-btn">
                  View Chat/Call Services
                </button>
              </Link>
              <button
                className="profile-btn"
                onClick={() => {
                  localStorage.clear();
                  signOut({ callbackUrl: "/login" });
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
        {!loggedInUser && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <button
              className="profile-google-btn"
              onClick={() => signIn("google")}
              style={{ marginBottom: 12, maxWidth: 350, width: "100%" }}
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google logo"
                className="profile-google-logo"
              />
              Sign up with Google
            </button>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <Link href="/login">
                <button className="profile-btn" style={{ background: "#fff", color: "#1976d2", border: "1px solid #1976d2" }}>
                  Log in
                </button>
              </Link>
              <Link href="/signup">
                <button className="profile-btn" style={{ background: "#fff", color: "#1976d2", border: "1px solid #1976d2" }}>
                  Sign up
                </button>
              </Link>
            </div>
          </div>
        )}
        <div style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
          <a
            href="https://www.fiverr.com/sellers/himanshutiwari"
            target="_blank"
            rel="noopener noreferrer"
            className="profile-btn"
            style={{ background: "#fff", color: "#1976d2", border: "1px solid #1976d2" }}
          >
            Fiverr
          </a>
          <a
            href="https://www.youtube.com/@himanshutiwari8855"
            target="_blank"
            rel="noopener noreferrer"
            className="profile-btn"
            style={{ background: "#fff", color: "#1976d2", border: "1px solid #1976d2" }}
          >
            YouTube
          </a>
          <a
            href="https://www.facebook.com/himanshuactive/"
            target="_blank"
            rel="noopener noreferrer"
            className="profile-btn"
            style={{ background: "#fff", color: "#1976d2", border: "1px solid #1976d2" }}
          >
            Facebook (Personal)
          </a>
          <a
            href="https://www.facebook.com/vedicindianastrology/"
            target="_blank"
            rel="noopener noreferrer"
            className="profile-btn"
            style={{ background: "#fff", color: "#1976d2", border: "1px solid #1976d2" }}
          >
            Facebook (Page)
          </a>
          <a
            href="https://www.facebook.com/groups/748009425400227"
            target="_blank"
            rel="noopener noreferrer"
            className="profile-btn"
            style={{ background: "#fff", color: "#1976d2", border: "1px solid #1976d2" }}
          >
            Facebook Group
          </a>
        </div>
      </div>
    </main>
  );
}