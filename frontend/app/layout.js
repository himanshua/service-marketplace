// app/layout.js
import React from "react";
export const metadata = {
  title: "Service Marketplace",
  description: "Service Marketplace App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", background: "#f7f7f7", margin: 0 }}>{children}</body>
    </html>
  );
}
