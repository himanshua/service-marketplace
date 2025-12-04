"use client";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
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
  const router = useRouter();
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  const openAuth = (mode) => {
    if (mode === "google") signIn("google", { callbackUrl: "/services" });
    else router.push(mode === "login" ? "/login?redirect=/services" : "/signup?redirect=/services");
  };

  return (
    <main className="profile-main home-main">
      <div className="home-container" style={{ flexDirection: "column", padding: 0 }}>
        <HomeRow imgSrc="images/reading.jpg" imgAlt="How to order">
          <h1 style={{ marginBottom: 8 }}>Request your Jyotishavidya Reading</h1>
          <p style={{ color: "#385072", lineHeight: 1.6 }}>
            Follow three quick steps to receive your Dropbox delivery with MP3 + charts.
          </p>

          <ol style={{ paddingLeft: 20, marginTop: 18, lineHeight: 1.7 }}>
            <li><strong>Prepare your birth data</strong> – name, gender, DD-MMM-YYYY, exact time (with AM/PM + 24-hr), birthplace + Google coordinates.</li>
            <li><strong>List 5–10 thoughtful questions</strong> reflecting real decisions you face right now.</li>
            <li><strong>Log in and start chat</strong> – tap “Start Chat,” paste your details, submit payment, receive Dropbox link.</li>
          </ol>

          <section style={{ marginTop: 20 }}>
            <h2>What you receive</h2>
            <ul>
              <li>2+ hour MP3 (or video) lecture with Vimshottari dasha timeline PDF.</li>
              <li>One post-reading clarification via email or MP3.</li>
              <li>Guidance that blends classical Jyotishavidya, KP, numerology, and tarot perspectives.</li>
            </ul>
          </section>

          <section style={{ marginTop: 22, border: "1px solid #d9e8ff", borderRadius: 12, padding: 18, background: "#f4f8ff" }}>
            <h3 style={{ marginBottom: 10, color: "#0d366e" }}>Need help before booking?</h3>
            <p style={{ marginBottom: 12 }}>
              Email{" "}
              <a href="mailto:himanshu.inperson@gmail.com" style={{ color: "#1976d2", textDecoration: "underline" }}>
                himanshu.inperson@gmail.com
              </a>{" "}
              with your questions or to confirm availability.
            </p>
            <p style={{ fontSize: 14, color: "#4a6071" }}>
              Hint: thoughtful, self-reflective questions lead to deeper readings.
            </p>
          </section>

          {!isLoggedIn && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24, maxWidth: 360 }}>
              <button className="profile-btn profile-btn-google-blue" onClick={() => openAuth("google")}>
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="" className="profile-google-logo" />
                Continue with Google
              </button>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="profile-btn profile-btn-outline" style={{ flex: 1 }} onClick={() => openAuth("login")}>
                  Log in
                </button>
                <button className="profile-btn profile-btn-outline" style={{ flex: 1 }} onClick={() => openAuth("signup")}>
                  Sign up
                </button>
              </div>
            </div>
          )}

          <p style={{ marginTop: 18, fontSize: 14, color: "#60738b" }}>
            Already booked? <a href="/services" style={{ color: "#1976d2", textDecoration: "underline" }}>Go to Services</a> to check chat status.
          </p>
        </HomeRow>
      </div>
    </main>
  );
}