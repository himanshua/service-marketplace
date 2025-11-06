// app/layout.js

"use client"; // Client-side component for dynamic navigation

import { useEffect, useState } from "react"; // React hooks 
import Link from "next/link"; // Next.js Link component for navigation
import { useRouter, usePathname } from "next/navigation"; // Navigation hooks
import "./globals.css";
import NavBar from "./components/NavBar";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main style={{ minHeight: "100vh" }}>{children}</main>
      </body>
    </html>
  );
}