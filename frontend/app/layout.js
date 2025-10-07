// app/layout.js
import React from "react";
export const metadata = { title: "Service Marketplace" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "sans-serif" }}>{children}</body>
    </html>
  );
}
