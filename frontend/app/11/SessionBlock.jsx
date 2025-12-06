"use client";
import { useSession } from "next-auth/react";

export default function SessionBlock() {
  const { data: session } = useSession();
  if (!session) return null;
  // ...existing code...
}