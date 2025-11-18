"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "./components/NavBar"; // adjust path as needed

const API = process.env.NEXT_PUBLIC_API_URL || "https://service-marketplace-backend.onrender.com";

export default function Home() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Check for JWT user on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) setUser(data.user);
        });
    }
  }, []);

  // Handle Google login: exchange for JWT and update UI
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
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            localStorage.setItem("token", data.token);
            setUser(data.user);
            // Reload to update Navbar/UI everywhere
            window.location.reload();
          }
        });
    }
  }, [session]);

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      <Navbar user={user} />
      <main>
        {user ? (
          <>
            <p>Welcome, {user.name}!</p>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => signIn("google")}>Sign in with Google</button>
            {/* ...other signup/login options... */}
          </>
        )}
      </main>
    </>
  );
}