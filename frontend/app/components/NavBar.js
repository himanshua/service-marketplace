"use client";
import Link from "next/link";
import { signOut, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [user, setUser] = useState(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Check for JWT user in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      // Optionally, fetch user info from your backend
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://service-marketplace-backend.onrender.com"}/api/auth/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.user) setUser(data.user);
        });
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const handler = () => setUser(localStorage.getItem("token"));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return (
    <>
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

        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            outline: "none",
            color: "#1f2937",
            fontSize: "1.5rem",
          }}
        >
          &#9776; {/* Hamburger icon */}
        </button>

        <div
          className={`navbar-menu${menuOpen ? " open" : ""}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 20,
            flexDirection: "column",
            position: "absolute",
            top: "100%",
            right: 0,
            background: "#ffffff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            padding: "16px",
            borderRadius: "8px",
            zIndex: 1000,
          }}
        >
          <Link
            href="/"
            style={{ textDecoration: "none", color: "#1f2937", width: "100%", padding: "8px 0" }}
          >
            Home
          </Link>
          <a
            href="#"
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                setShowAuthPrompt(true);
              } else {
                window.location.href = "/services";
              }
            }}
            style={{ textDecoration: "none", color: "#1f2937", width: "100%", padding: "8px 0" }}
          >
            Services
          </a>

          {user ? (
            <>
              <span style={{ color: "#6b7280", fontSize: "0.95rem" }}>
                {user.name} ({user.role})
              </span>
              <Link
                href="/profile"
                style={{ textDecoration: "none", color: "#1f2937", width: "100%", padding: "8px 0" }}
              >
                Dashboard
              </Link>
              {user.role === "useradmin" && (
                <>
                  <Link
                    href="/services/create"
                    style={{ textDecoration: "none", color: "#1f2937", width: "100%", padding: "8px 0" }}
                  >
                    Create Service
                  </Link>
                  <Link
                    href="/admin/services"
                    style={{ textDecoration: "none", color: "#1f2937", width: "100%", padding: "8px 0" }}
                  >
                    Admin Services
                  </Link>
                  <Link
                    href="/admin"
                    style={{ textDecoration: "none", color: "#1f2937", width: "100%", padding: "8px 0" }}
                  >
                    Admin Dashboard
                  </Link>
                </>
              )}
              <button
                style={{ marginLeft: 16 }}
                onClick={async () => {
                  localStorage.clear();
                  await signOut({ redirect: false });
                  window.location.href = "/"; // or router.push("/") if using useRouter
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                style={{ textDecoration: "none", color: "#1f2937", width: "100%", padding: "8px 0" }}
              >
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
                  width: "100%",
                  textAlign: "center",
                }}
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </nav>
      {showAuthPrompt && (
        <div className="auth-modal-backdrop">
          <div className="auth-modal">
            <p
              style={{
                fontWeight: 600,
                fontSize: "1.2rem",
                marginBottom: 20,
              }}
            >
              Please sign up or log in to access services.
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 12,
                justifyContent: "center",
              }}
            >
              <Link
                href={{ pathname: "/login", query: { redirect: "services" } }}
                onClick={() => setShowAuthPrompt(false)}
              >
                <button className="profile-btn profile-btn-outline">Log in</button>
              </Link>
              <Link
                href="/signup"
                onClick={() => setShowAuthPrompt(false)}
              >
                <button className="profile-btn profile-btn-outline">Sign up</button>
              </Link>
            </div>
            <div
              style={{
                margin: "18px 0 8px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "#e0e7ef",
                  marginRight: 10,
                }}
              />
              <span style={{ color: "#888" }}>or</span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "#e0e7ef",
                  marginLeft: 10,
                }}
              />
            </div>
            <button
              className="profile-btn profile-btn-google-blue"
              style={{ width: "100%", maxWidth: 350, marginBottom: 18 }}
              onClick={() => {
                setShowAuthPrompt(false);
                signIn("google", { callbackUrl: "/services" });
              }}
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google logo"
                className="profile-google-logo"
              />
              Continue with Google
            </button>
            <button
              className="profile-btn"
              style={{ background: "#eee", color: "#333" }}
              onClick={() => setShowAuthPrompt(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}