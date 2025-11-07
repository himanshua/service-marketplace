"use client"; // Client-side component for authenticated user dashboard

import { useEffect, useState } from "react"; // React hooks: useEffect for side effects, useState for state
import { useRouter } from "next/navigation"; // Next.js hook for navigation
import "./profile.css"; // Import local styles for profile page
import "../globals.css"; // Import local styles for profile page

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; // API base URL from env, fallback to localhost

export const metadata = {
  title: "Your Terra Profile",
  description: "Manage your bookings and readings.",
  openGraph: {
    title: "Your Terra Profile",
    description: "Manage your Terra bookings and readings.",
    url: "https://aheadterra.com/profile",
    images: [
      {
        url: "https://aheadterra.com/images/himanshu-tiwari-og.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Terra Profile",
    description: "Manage your Terra bookings and readings.",
    images: ["https://aheadterra.com/images/himanshu-tiwari-og.jpg"],
  },
};

export default function Profile() {
  const router = useRouter(); // Hook to navigate between pages
  const [user, setUser] = useState(null); // State to hold user data from API
  const [err, setErr] = useState(""); // State to hold error messages

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null; // Get token from browser storage (client-side only)
    if (!token) {
      router.replace("/login");
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }, // Send JWT in header for auth
        });
        const data = await res.json().catch(() => ({})); // Parse JSON response, handle errors
        if (!res.ok) throw new Error(data.message || "Unauthorized"); // Throw if not 200
        setUser(data.user); // Set user state with fetched data
      } catch (e) {
        setErr(e.message); // Show error message
        localStorage.removeItem("token"); // Clear invalid token
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        router.replace("/login"); // Redirect to login
      }
    })();
  }, [router]); // Dependency array: re-run if router changes (rare)

  function logout() {
    localStorage.removeItem("token"); // Remove stored auth data
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    router.replace("/login"); // Redirect to login page
  }

  if (!user && !err) return <main className="profile-main">Loading…</main>;

  return (
    <main className="hero-grid">
      <img className="hero-image" src="/images/Himanshu Tiwari.jpg" alt="Himanshu Tiwari" />
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




