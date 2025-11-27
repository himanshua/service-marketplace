"use client";
import Link from "next/link";
import "../profile/profile.css";
import "../globals.css";

// Copy HomeRow component here
function HomeRow({ label, imgSrc, imgAlt, imgStyle = {}, children }) {
  return (
    <div style={{
      display: "flex",
      borderBottom: "2px solid #bdbdbd",
      alignItems: "stretch",
      minHeight: 250
    }}>
      <div className="home-image-col">
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}>
          {label && <span style={{ marginBottom: 8, fontWeight: 600 }}>{label}</span>}
          <img
            src={imgSrc}
            alt={imgAlt}
            className="home-hero-image"
            style={{
              borderRadius: "12px",
              width: "100%",
              maxWidth: 340,
              height: 260,
              maxHeight: 260,
              objectFit: "contain",
              background: "#fff",
              display: "block",
              margin: "0 auto",
              ...imgStyle,
            }}
          />
        </div>
      </div>
      <div
        className="home-content-col"
        style={{
          flex: 1,
          padding: "18px 24px",
          boxSizing: "border-box",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function HowToOrder() {
  return (
    <main className="profile-main home-main">
      <div className="home-container" style={{ flexDirection: "column", padding: 0 }}>
        <HomeRow
          imgSrc="images/Ganesha.jpeg"
          imgAlt="Welcome"
        >
          <h2></h2>
          <p>
            How to order Jyotishavidya Readings<br />
            offered by{" "}
            <a
              href="home#himanshu-section"
              style={{ color: "#1976d2", textDecoration: "underline", fontWeight: 600 }}
            >
              Himanshu Tiwari
            </a>
          </p>
        </HomeRow>
      </div>
    </main>
  );
}