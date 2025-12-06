"use client";
import { useSession } from "next-auth/react";

export default function Page11() {
  const sessionResult = useSession();
  const session = sessionResult?.data;

  if (sessionResult.status === "loading") return null;
  if (!session) return null;

  return (
    <>
      {/* server-rendered content */}
      <SessionBlock />
    </>
  );
}