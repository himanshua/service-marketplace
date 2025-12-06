"use client";
import { useSession } from "next-auth/react";
import SessionBlock from "./SessionBlock";

export default function Page11() {
  // server-only data fetching...
  return (
    <>
      {/* server-rendered content */}
      <SessionBlock />
    </>
  );
}