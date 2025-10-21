"use client"; // Client-side component for authenticated user dashboard

import { useEffect, useState } from "react"; // React hooks: useEffect for side effects, useState for state
import { useRouter } from "next/navigation"; // Next.js hook for navigation

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; // API base URL from env, fallback to localhost

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

  if (!user && !err) return <main style={{ padding: 20 }}>Loading…</main>; // Show loading while fetching

  return (
    <main style={{ padding: 20, maxWidth: 480, margin: "40px auto" }}>
      <h1>User Dashboard</h1> {/* Changed title to Dashboard */}
      {user ? (
        <>
          <p>Welcome, {user.name}!</p> {/* Personalized welcome */}
          <pre>{JSON.stringify(user, null, 2)}</pre> {/* Pretty-print user JSON */}
          <button onClick={logout}>Logout</button> {/* Logout button */}
          {/* Add more dashboard features here, e.g., user services, settings */}
        </>
      ) : (
        <p style={{ color: "crimson" }}>{err}</p> // Show error if no user
      )}
    </main>
  );
}




