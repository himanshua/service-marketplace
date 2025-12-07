import { Suspense } from "react";
import ChatClient from "./ChatClient";

export default function ChatPage() {
  return (
    <Suspense fallback={<main style={{ padding: 20 }}>Loading…</main>}>
      <ChatClient />
    </Suspense>
  );
}