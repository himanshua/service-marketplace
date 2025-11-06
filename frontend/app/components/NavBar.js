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
    const sync = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };
    sync();

    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      try {
        const res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          localStorage.clear();
          setUser(null);
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (err) {
        console.error("Auth check failed:", err);
      }
    })();

    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
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
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link href="/">Home</Link>
      <span> | </span>
      <Link href="/services">Services</Link>
      {user ? (
        <>
          <span> | </span>
          <span>
            Welcome, {user.name} ({user.role})
          </span>
          <span> | </span>
          <Link href="/profile">Dashboard</Link>
          {user.role === "useradmin" && (
            <>
              <span> | </span>
              <Link href="/services/create">Create Service</Link>
              <span> | </span>
              <Link href="/admin/services">Admin Services</Link>
              <span> | </span>
              <Link href="/admin/">Admin Dashboard</Link>
            </>
          )}
          <span> | </span>
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
  );
}