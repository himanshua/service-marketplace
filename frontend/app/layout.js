import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import Link from "next/link";
import Header from "./components/Header"; // <-- import your new Header

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
  return (
    <html lang="en">
      <head>
        <title>Terra – Psychic & Jyotishvidya Readings</title>
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
        {/* ...other head elements if needed... */}
      </head>
      <body>
        <Header /> {/* Use only the new Header here */}
        <main style={{ minHeight: "100vh" }}>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}


