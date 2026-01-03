import "./globals.css";
import NavBar from "./components/NavBar";
import { Analytics } from "@vercel/analytics/react";
import ClientProvider from "./client-provider";
import SessionSyncProvider from "./SessionSyncProvider";
import VisitorWidget from "./components/VisitorWidget";
import ClientVisitLogger from "./ClientVisitLogger";
import Header from "../components/Header";

export const metadata = {
  metadataBase: new URL("https://aheadterra.com"),
  title: "Terra – Psychic & Jyotishvidya Readings",
  description: "Get your unique reading from Himanshu Tiwari! Connect now.",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon", sizes: "16x16" },
      { url: "/favicon.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon.png", type: "image/png", sizes: "64x64" },
    ],
    shortcut: [
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/favicon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Terra – Psychic & Jyotishvidya Readings",
    description: "Discover Terra and connect with the best online psychic.",
    url: "https://aheadterra.com",
    siteName: "Terra",
    images: [
      {
        url: "/images/himanshu-tiwari-og.jpg",
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
    images: ["/images/himanshu-tiwari-og.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <head>
    {/* Primary meta tags */}
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="author" content="Himanshu Tiwari" />
    <meta name="publisher" content="astrobhai" />
    <meta name="keywords" content="psychic, jyotishvidya, readings, astrology, tarot, USA, Himanshu Tiwari, Terra" />
    <meta name="geo.region" content="US" />
    <meta name="geo.placename" content="United States" />
    <meta name="geo.position" content="37.0902;-95.7129" />
    <meta name="ICBM" content="37.0902, -95.7129" />
    <meta httpEquiv="Content-Language" content="en-us" />

    {/* Title */}
    <title>Terra – Psychic & Jyotishvidya Readings</title>
    </head>

      <body>
        <ClientProvider>
          <NavBar />
          <SessionSyncProvider>{children}</SessionSyncProvider>
        </ClientProvider>
        <ClientVisitLogger />
        <VisitorWidget />
        <Analytics />
      </body>
    </html>
  );
}


