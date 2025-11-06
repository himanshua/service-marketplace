// app/layout.js

"use client"; // Client-side component for dynamic navigation

import { useEffect, useState } from "react"; // React hooks 
import Link from "next/link"; // Next.js Link component for navigation
import { useRouter, usePathname } from "next/navigation"; // Navigation hooks
import "./globals.css";
import NavBar from "./components/NavBar";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; // API base URL

export const metadata = {
  title: "Terra – Psychic & Jyotishvidya Readings",
  description: "Get your unique reading from Himanshu Tiwari.",
  openGraph: {
    title: "Terra – Psychic & Jyotishvidya Readings",
    description: "Discover Terra and connect with the best online psychic.",
    url: "https://aheadterra.com",
    siteName: "Terra",
    images: [
      {
        url: "https://aheadterra.com/images/Himanshu%20Tiwari.jpg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terra – Psychic & Jyotishvidya Readings",
    description: "Discover Terra and connect with the best online psychic.",
    images: ["https://aheadterra.com/images/Himanshu%20Tiwari.jpg"],
  },
};

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

  function logout() { // Logout func
  
    localStorage.clear(); // Clear local storage
    setUser(null); // Clear user state
    router.push("/login"); // Redirect to login
  }     

  return (
    <html lang="en">
      <body>
        <NavBar />
        <main style={{ minHeight: "100vh" }}>{loading ? <main style={{ padding: 20 }}>Loading…</main> : children}</main>
      </body>
    </html>
  );
}