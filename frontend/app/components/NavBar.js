"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }
      try {
        const res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("unauthorized");
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch {
        localStorage.clear();
        setUser(null);
        router.push("/login");
      }
    };

    fetchUser();

    const sync = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };

    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [router, pathname]);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    router.push("/login");
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        borderBottom: "1px solid #e5e7eb",
        background: "#ffffffd9",
        backdropFilter: "blur(6px)",
      }}
    >
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          textDecoration: "none",
          color: "#111827",
        }}
      >
        <span
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 30% 30%, #fed7aa 0%, #f97316 55%, #c2410c 100%)",
            boxShadow: "0 4px 12px rgba(249, 115, 22, 0.35)",
          }}
        />
        <span
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
          }}
        >
          TERRA
        </span>
      </Link>

      <div style={{ display: "inline-flex", alignItems: "center", gap: 20 }}>
        <Link href="/" style={{ textDecoration: "none", color: "#1f2937" }}>
          Home
        </Link>
        <Link href="/services" style={{ textDecoration: "none", color: "#1f2937" }}>
          Services
        </Link>

        {user ? (
          <>
            <span style={{ color: "#6b7280", fontSize: "0.95rem" }}>
              {user.name} ({user.role})
            </span>
            <Link href="/profile" style={{ textDecoration: "none", color: "#1f2937" }}>
              Dashboard
            </Link>
            {user.role === "useradmin" && (
              <>
                <Link href="/services/create" style={{ textDecoration: "none", color: "#1f2937" }}>
                  Create Service
                </Link>
                <Link href="/admin/services" style={{ textDecoration: "none", color: "#1f2937" }}>
                  Admin Services
                </Link>
                <Link href="/admin" style={{ textDecoration: "none", color: "#1f2937" }}>
                  Admin Dashboard
                </Link>
              </>
            )}
            <button
              onClick={logout}
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                border: "1px solid #111827",
                background: "#111827",
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ textDecoration: "none", color: "#1f2937" }}>
              Login
            </Link>
            <Link
              href="/signup"
              style={{
                textDecoration: "none",
                color: "#ffffff",
                background: "#111827",
                padding: "8px 20px",
                borderRadius: 999,
              }}
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}