import "./globals.css";
import NavBar from "./components/NavBar";
import { Analytics } from "@vercel/analytics/next";
import ClientProvider from "./client-provider";
import SessionSyncProvider from "./SessionSyncProvider";
import { useEffect, useState } from "react";

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

function VisitorWidget() {
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    fetch("/api/visitors?limit=10")
      .then((res) => res.json())
      .then((data) => setVisitors(data.visitors || []))
      .catch(() => {});
  }, []);

  if (!visitors.length) return null;

  return (
    <aside
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        width: 260,
        padding: "16px 18px",
        borderRadius: 16,
        background: "#fff",
        boxShadow: "0 18px 40px rgba(0,0,0,0.15)",
        zIndex: 2000,
      }}
    >
      <h4 style={{ margin: "0 0 12px 0", color: "#0c3c7a" }}>Recent visitors</h4>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {visitors.map((visit) => (
          <li key={visit.id} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
            <img
              src={`https://flagcdn.com/32x24/${visit.countryCode?.toLowerCase()}.png`}
              alt={visit.country || "Flag"}
              style={{ width: 24, height: 18, marginRight: 8, borderRadius: 4, boxShadow: "0 0 4px rgba(0,0,0,0.2)" }}
            />
            <div style={{ fontSize: 14 }}>
              <strong>{visit.country || "Unknown"}</strong>
              <div style={{ fontSize: 12, color: "#6b7a8c" }}>{visit.city || "—"}</div>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default function RootLayout({ children }) {
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
        <link rel="icon" type="image/png" href="/favicon.png" sizes="64x64" />
      </head>
      <body>
        <ClientProvider>
          <SessionSyncProvider>
            <NavBar />
            <main style={{ minHeight: "100vh" }}>{children}</main>
          </SessionSyncProvider>
        </ClientProvider>
        <Analytics />
        <VisitorWidget />
      </body>
    </html>
  );
}


