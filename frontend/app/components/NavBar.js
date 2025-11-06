"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return true;
    return !!window.localStorage.getItem("token");
  });

  useEffect(() => {
    const sync = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };

    sync();

    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        try {
          const res = await fetch(`${API}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
          } else if (res.status === 401) {
            localStorage.clear();
            setUser(null);
            router.push("/login");
          }
        } catch (err) {
          console.error("Auth check failed:", err);
        } finally {
          setLoading(false);
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

  function logout() {
    localStorage.clear();
    setUser(null);
    router.push("/login");
  }

  return (
    <>
      <nav
        style={{
          padding: "10px 20px",
          borderBottom: "1px solid #ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        <span
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#1976d2",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Terra
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <Link href="/">Home</Link>
          <span>|</span>
          <Link href="/services">Services</Link>
          {user ? (
            <>
              <span>|</span>
              <span>Welcome, {user.name} ({user.role})</span>
              <span>|</span>
              <Link href="/profile">Dashboard</Link>
              {user.role === "useradmin" && (
                <>
                  <span>|</span>
                  <Link href="/services/create">Create Service</Link>
                  <span>|</span>
                  <Link href="/admin/services">Admin Services</Link>
                  <span>|</span>
                  <Link href="/admin/">Admin Dashboard</Link>
                </>
              )}
              <span>|</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <span>|</span>
              <Link href="/login">Login</Link>
              <span>|</span>
              <Link href="/signup">Signup</Link>
            </>
          )}
        </div>
      </nav>
      {loading ? <main style={{ padding: 20 }}>Loading…</main> : null}
    </>
  );
}