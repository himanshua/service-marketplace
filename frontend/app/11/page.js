"use client";
import { useSession } from "next-auth/react";

export default function Page11() {
  const sessionResult = useSession();
  const session = sessionResult?.data;

  if (!session) return null; // or a loading UI
  // ...existing code...
}