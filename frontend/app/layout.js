import "./globals.css";
import NavBar from "./components/NavBar";
import { Analytics } from "@vercel/analytics/next";
import ClientProvider from "./client-provider";
import SessionSyncProvider from "./SessionSyncProvider";
import { useState, useEffect } from "react";
import Link from "next/link";

export const metadata = {
  metadataBase: new URL("https://aheadterra.com"),
  title: "Terra – Psychic & Jyotishvidya Readings",
  description: "Get your unique reading from Himanshu Tiwari! Connect now.",
  openGraph: {
    title: "Terra – Psychic & Jyotishvidya Readings",
    description: "Discover Terra and connect with the best online psychic.",
    url: "https://aheadterra.com",
    siteName: "Terra",
    images: [
      {
        url: "https://aheadterra.com/images/himanshu-tiwari-og.jpg",
        width: 1200,
        height: 630,
        alt: "Himanshu Tiwari – Terra Psychic Reading",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terra – Psychic & Jyotishvidya Readings",
    description: "Discover Terra and connect with the best online psychic.",
    images: ["https://aheadterra.com/images/himanshu-tiwari-og.jpg"],
  },
};

export default function RootLayout({ children }) {
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    // Check for token on mount (client-side)
    if (typeof window !== "undefined") {
      setLoggedInUser(localStorage.getItem("token"));
    }
  }, []);

  // Update login state on storage change (multi-tab support)
  useEffect(() => {
    const handler = () => setLoggedInUser(localStorage.getItem("token"));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return (
    <html lang="en">
      <head>
        {/* Primary meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Himanshu Tiwari" />
        <meta name="author" content="astrobhai" />
        <meta name="keywords" content="psychic, jyotishvidya, readings, astrology, tarot, USA, Himanshu Tiwari, Terra" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="geo.position" content="37.0902;-95.7129" />
        <meta name="ICBM" content="37.0902, -95.7129" />
        <meta httpEquiv="Content-Language" content="en-us" />
        <title>Terra – Psychic & Jyotishvidya Readings</title>
      </head>
      <body>
        <ClientProvider>
          <SessionSyncProvider>
            {/* Navbar */}
            <nav style={{ display: "flex", gap: 24, padding: 16, background: "#f5f7fa" }}>
              <Link href="/">Home</Link>
              <a
                href="#"
                onClick={e => {
                  if (!loggedInUser) {
                    e.preventDefault();
                    setShowAuthPrompt(true);
                  } else {
                    window.location.href = "/services";
                  }
                }}
              >
                Services
              </a>
              {/* ...other nav links... */}
            </nav>
            {/* Page Content */}
            <main style={{ minHeight: "100vh" }}>{children}</main>
            {/* Auth Modal */}
            {showAuthPrompt && (
              <div className="auth-modal-backdrop">
                <div className="auth-modal">
                  <p style={{ fontWeight: 600, fontSize: "1.2rem", marginBottom: 20 }}>
                    Please sign up or log in to access services.
                  </p>
                  <div style={{ display: "flex", gap: 12, marginBottom: 12, justifyContent: "center" }}>
                    <Link href={{ pathname: "/login", query: { redirect: "services" } }}>
                      <button className="profile-btn profile-btn-outline">Log in</button>
                    </Link>
                    <Link href="/signup">
                      <button className="profile-btn profile-btn-outline">Sign up</button>
                    </Link>
                  </div>
                  <div style={{ margin: "18px 0 8px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ flex: 1, height: 1, background: "#e0e7ef", marginRight: 10 }} />
                    <span style={{ color: "#888" }}>or</span>
                    <div style={{ flex: 1, height: 1, background: "#e0e7ef", marginLeft: 10 }} />
                  </div>
                  <button
                    className="profile-btn profile-btn-google-blue"
                    style={{ width: "100%", maxWidth: 350, marginBottom: 18 }}
                    onClick={() => {
                      setShowAuthPrompt(false);
                      window.location.href = "/api/auth/signin/google?callbackUrl=/services";
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
          </SessionSyncProvider>
        </ClientProvider>
        <Analytics />
      </body>
    </html>
  );
}


