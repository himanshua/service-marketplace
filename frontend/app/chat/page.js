"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const expertId = searchParams.get("expert");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  function sendMessage() {
    if (!message.trim()) return;
    setChat([...chat, { sender: "user", text: message }]);
    setMessage("");
    // Here you would send the message to your backend/chat server
  }

  return (
    <main style={{ padding: 20, maxWidth: 600, margin: "40px auto" }}>
      <h1>Chat with Expert</h1>
      <p>Expert ID: {expertId}</p>
      <div style={{ border: "1px solid #ccc", padding: 16, minHeight: 200, marginBottom: 16 }}>
        {chat.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          chat.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: 8 }}>
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))
        )}
      </div>
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type your message…"
        style={{ width: "80%", padding: 8, marginRight: 8 }}
      />
      <button onClick={sendMessage}>Send</button>
    </main>
  );
}