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
    <main className="profile-main home-main">
      <div className="home-container">
        {/* Left: Image */}
        <div className="home-image-col">
          <img
            src="/images/himanshu-tiwari-og.jpg"
            alt="Himanshu Tiwari"
            className="home-hero-image"
            style={{ borderRadius: "12px", width: 300, height: 450, objectFit: "cover", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", background: "#fff" }}
          />
        </div>
        {/* Right: Content */}
        <div className="home-content-col">
          <h1 className="home-title">
            Top-Rated Psychic, Astrology, Numerology, Horary & Tarot Readings in the USA — Himanshu Tiwari, Delivering Insight for Over 10 Years
          </h1>
          <h2 className="home-subtitle">
            Jyotishvidya, Astrology, Tarot & More by Himanshu Tiwari
          </h2>
          <p className="home-desc">
            Experience accurate psychic readings, astrology insights, and tarot guidance from one of the best online psychics in the USA. Himanshu Tiwari offers Jyotishvidya, astrology, and tarot services to help you find clarity and direction.
          </p>
          {loggedInUser && (
            <p style={{
              fontWeight: 800,
              color: "#1976d2",
              marginBottom: 18,
              fontSize: "2rem",
              letterSpacing: "0.5px"
            }}>
              Welcome, {loggedInUser.name || loggedInUser.email}!
            </p>
          )}
          <div className="home-btn-row">
            <Link href="/services">
              <button className="profile-btn">Order Now on Chat Services</button>
            </Link>
            {loggedInUser && (
              <>
                <Link href="/profile">
                  <button className="profile-btn">View Profile</button>
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
            <div className="home-auth-row">
              <button
                className="profile-btn profile-btn-google-blue"
                onClick={() => signIn("google")}
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google logo"
                  className="profile-google-logo"
                />
                Continue with Google
              </button>
              <div className="home-auth-btns">
                <Link href="/login">
                  <button className="profile-btn profile-btn-outline">
                    Log in
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="profile-btn profile-btn-outline">
                    Sign up
                  </button>
                </Link>
              </div>
            </div>
          )}
          <div className="home-social-row">
            <a
              href="https://www.fiverr.com/himanshutiwari"
              target="_blank"
              rel="noopener noreferrer"
              className="profile-btn profile-btn-outline"
            >
              Check my Fiverr Profile
            </a>
            <a
              href="https://www.youtube.com/@himanshutiwari8855"
              target="_blank"
              rel="noopener noreferrer"
              className="profile-btn profile-btn-outline"
            >
              Check my YouTube Channel
            </a>
            <a
              href="https://www.facebook.com/himanshuactive/"
              target="_blank"
              rel="noopener noreferrer"
              className="profile-btn profile-btn-outline"
            >
              Check my Facebook (Personal)
            </a>
            <a
              href="https://www.facebook.com/vedicindianastrology/"
              target="_blank"
              rel="noopener noreferrer"
              className="profile-btn profile-btn-outline"
            >
              Check my Facebook Page
            </a>
            <a
              href="https://www.facebook.com/groups/748009425400227"
              target="_blank"
              rel="noopener noreferrer"
              className="profile-btn profile-btn-outline"
            >
              Check my Facebook Group
            </a>
            <a
              href="https://x.com/himanshusocial"
              target="_blank"
              rel="noopener noreferrer"
              className="profile-btn profile-btn-outline"
            >
              Check my X Profile
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}