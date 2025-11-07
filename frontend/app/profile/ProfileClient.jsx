"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./profile.css";
import "../globals.css";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProfileClient() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || "Unauthorized");
        setUser(data.user);
      } catch (e) {
        setErr(e.message);
        localStorage.clear();
        router.replace("/login");
      }
    })();
  }, [router]);

  const logout = () => {
    localStorage.clear();
    router.replace("/login");
  };

  if (!user && !err) return <main className="profile-main">Loading…</main>;

  return (
    <main className="hero-grid">
      <img className="hero-image" src="/images/himanshu-tiwari-og.jpg" alt="Himanshu Tiwari" />
      <div className="profile-content">
        <h1>User Dashboard</h1>
        <button
          style={{ marginBottom: "1.5rem", padding: "10px 18px" }}
          onClick={() => {
            const shareData = {
              title: "Terra – Psychic & Jyotishvidya Readings",
              text: "Discover Terra and connect with the best online psychic.",
              url: "https://aheadterra.com",
            };
            if (navigator.share) navigator.share(shareData).catch(console.error);
            else navigator.clipboard.writeText(shareData.url).then(() => alert("Link copied."));
          }}
        >
          Share Terra
        </button>
        {user ? (
          <div className="profile-card">
            <h2>Profile Information</h2>
            <div className="profile-row">
              <span className="profile-label">Name:</span>
              <span>{user.name}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Role:</span>
              <span>{user.role}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">User ID:</span>
              <span>{user.id}</span>
            </div>
            <button className="profile-logout" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <p className="profile-error">{err}</p>
        )}
      </div>
    </main>
  );
}