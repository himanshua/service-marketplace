// app/layout.js

"use client"; // Client-side component for dynamic navigation

import { useEffect, useState } from "react"; // React hooks 
import Link from "next/link"; // Next.js Link component for navigation
import { useRouter, usePathname } from "next/navigation"; // Navigation hooks

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; // API base URL

export default function RootLayout({ children }) { // Main layout component
  const router = useRouter(); // Hook for navigation
  const pathname = usePathname();
  const [user, setUser] = useState(null);               // start as null so SSR/CSR match
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return true;
    return !!window.localStorage.getItem("token");
  });

  useEffect(() => {
    const sync = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };

    sync();                                             // hydrate from localStorage

    const token = localStorage.getItem("token");
    if (token) {
      (async () => { // Fetch user if token exists
        try {
          const res = await fetch(`${API}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok) setUser(data.user); // Set user
          else if (res.status === 401) {
            localStorage.clear(); // Clear invalid data
            setUser(null);
            router.push("/login"); // Redirect to login
          }
        } catch (err) {
          console.error("Auth check failed:", err);
        } finally {
          setLoading(false); // Stop loading
        }
      })();
    } else {
      setLoading(false);
    }

    window.addEventListener("storage", sync);
    window.addEventListener("auth-storage", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth-storage", sync);
    };
  }, [router]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
  }, [pathname]);

  function logout() { // Logout function
    localStorage.clear(); // Clear local storage
    setUser(null); // Clear user state
    router.push("/login"); // Redirect to login
  }     

  return (
    <html lang="en">
      <body>
        <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
          <Link href="/">Home</Link>
          <span> | </span>
          <Link href="/services">Services</Link>
          {user ? (
            <>
              <span> | </span>
              <span>Welcome, {user.name} ({user.role})</span>

              <span> | </span>
              <Link href="/profile">Dashboard</Link>
              <span> | </span>
              <Link href="/services/create">Create Service</Link>
              <span> | </span>
              <Link href="/admin/services" >Admin Services</Link>
              <span> | </span>
              <Link href="/admin/">Admin Dashboard</Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <span> | </span>
              <Link href="/login">Login</Link>
              <span> | </span>
              <Link href="/signup">Signup</Link>
            </>
          )}
        </nav>
        {loading ? <main style={{ padding: 20 }}>Loading…</main> : children}
      </body>
    </html>
  );
}