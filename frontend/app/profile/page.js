"use client"; // Client-side component for authenticated user dashboard

import { useEffect, useState } from "react"; // React hooks: useEffect for side effects, useState for state
import { useRouter } from "next/navigation"; // Next.js hook for navigation
import "./profile.css"; // Import local styles for profile page
import "../globals.css"; // Import local styles for profile page
import ProfileClient from "./ProfileClient";

export const metadata = {
  title: "Your Terra Profile",
  description: "Manage your bookings and readings.",
  openGraph: {
    title: "Your Terra Profile",
    description: "Manage your Terra bookings and readings.",
    url: "https://aheadterra.com/profile",
    images: [
      {
        url: "https://aheadterra.com/images/himanshu-tiwari-og.jpg",
        width: 1200,
        height: 630,
        alt: "Himanshu Tiwari – Terra Psychic Reading",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Terra Profile",
    description: "Manage your Terra bookings and readings.",
    images: ["https://aheadterra.com/images/himanshu-tiwari-og.jpg"],
  },
};

export default function ProfilePage() {
  return <ProfileClient />;
}




