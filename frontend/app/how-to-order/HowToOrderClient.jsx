"use client";
// filepath: c:\Users\Dell\Documents\ServiceMarketplace\frontend\app\how-to-order\HowToOrderClient.jsx
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import "../profile/profile.css";
import "../globals.css";

function HomeRow({ label, imgSrc, imgAlt, imgStyle = {}, children }) {
  return (
    <div
      style={{
        display: "flex",
        borderBottom: "2px solid #bdbdbd",
        alignItems: "stretch",
        minHeight: 250,
      }}
    >
      <div className="home-image-col">
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
          }}
        >
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

export default function HowToOrderClient() {
  const router = useRouter();
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  const openAuth = (mode) => {
    if (mode === "google") signIn("google", { callbackUrl: "/services" });
    else router.push(mode === "login" ? "/login?redirect=/services" : "/signup?redirect=/services");
  };

  const AuthCta = ({ isLoggedIn, openAuth }) => (
    <>
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
    </>
  );

  return (
    <main className="profile-main home-main">
      <div className="home-container" style={{ flexDirection: "column", padding: 0 }}>
        <HomeRow imgSrc="images/reading.jpg" imgAlt="How to order">
          <h1 style={{ marginBottom: 8 }}>Request your Jyotishavidya Reading</h1>
          <p style={{ color: "#385072", lineHeight: 1.6 }}>
            Follow the steps, complete the payment, and receive your Jyotish Vidya reading through Dropbox, email, and on dashboard/home page of your AheadTerra account.
          </p>
          <section style={{ marginTop: 18 }}>
            <h2>Required information</h2>
            <ul style={{ paddingLeft: 20, lineHeight: 1.7 }}>
              <li><strong>BIRTH-DATE</strong> - format DD-MMM-YYYY - example: 24-Apr-2001</li>
              <li>
                <strong>BIRTH-TIME</strong> - format HH:MM please mention AM or PM * Please mention the time in am/pm AND in 24-hr format
                (example: 8:20pm = 20:20) Yes it's redundant but using both formats helps to reduce mistakes :)) Time must be accurate to the minute.
                Ideally, when possible, birth time should be known from an official birth certificate.
              </li>
              <li>
                <strong>BIRTH-PLACE</strong> name of your city, town, or village * AND its Google coordinates (example: Bengaluru, Karnataka, India 12°59′N 77°35′E )
              </li>
              <li>
                Five-to-ten questions that you would like to have answered from a Jyotisha perspective. Please take some time to compose reflective, thoughtful questions.
                Questions should be as free of self-criticism as possible, specific, and meaningful for you.
              </li>
            </ul>
          </section>
          <section style={{ marginTop: 18 }}>
            <h2>Booking Checklist</h2>
            <ol style={{ paddingLeft: 20, lineHeight: 1.7 }}>
              <li><strong>Birth details</strong> – name, gender, DD-MMM-YYYY, exact time (AM/PM + 24 hr), birthplace + Google coordinates.</li>
              <li><strong>Life questions</strong> – 5–10 reflective questions covering relationships, vocation, health, dharma, or travel decisions.</li>
              <li><strong>Preferred delivery style</strong> – audio (MP3) or video plus PDF charts.</li>
              <li><strong>Dropbox, email or download from your AheadTerra Dashboard</strong> – address where you want the final link shared.</li>
            </ol>
          </section>
          <section style={{ marginTop: 22 }}>
            <h2>Payment & Delivery</h2>
            <ul style={{ paddingLeft: 20, lineHeight: 1.6 }}>
              <li>Payments are processed via <a href="https://www.fiverr.com/himanshutiwari" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", textDecoration: "underline" }}>Fiverr</a> or custom PayPal invoice (details shared in chat).</li>
              <li>Turnaround ≈ 2–3 business days unless otherwise noted in the Services calendar.</li>
              <li>Dropbox folder includes MP3/video lecture + Vimshottari dasha timeline PDF.</li>
              <li>One follow-up clarification is included (email or short MP3).</li>
            </ul>
          </section>
          <section style={{ marginTop: 22, border: "1px solid #d9e8ff", borderRadius: 12, padding: 18, background: "#f4f8ff" }}>
            <h3 style={{ marginBottom: 10, color: "#0d366e" }}>Before you send questions</h3>
            <p style={{ marginBottom: 8 }}>
              Review the Jyotisha etiquette: no blame, no self-criticism—state the situation, the decision window, and what outcome you hope to understand.
            </p>
            <p style={{ marginBottom: 12 }}>
              Need scheduling confirmation? Email{" "}
              <a href="mailto:himanshu.inperson@gmail.com" style={{ color: "#1976d2", textDecoration: "underline" }}>
                Email to Himanshu
              </a>.
            </p>
            <p style={{ fontSize: 14, color: "#4a6071" }}>
              As per Barbara from{" "}
              <a
                href="https://barbarapijan.com/bpa/payment_Jyotisha_services.htm"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1976d2", textDecoration: "underline" }}
              >
                BarbaraPijan.com
              </a>
              : precise questions make for precise Jyotisha answers.
            </p>
          </section>
          <section style={{ marginTop: 24 }}>
            <h2>After you order</h2>
            <ul style={{ paddingLeft: 20, lineHeight: 1.6 }}>
              <li>You’ll receive a confirmation in chat plus the estimated delivery window.</li>
              <li>Dropbox notification arrives when the lecture + PDF are uploaded.</li>
              <li>Use the same thread for your one clarification question within 14 days.</li>
            </ul>
          </section>
          <section style={{ marginTop: 24 }}>
            <h2>How it works</h2>
            <ul style={{ paddingLeft: 20, lineHeight: 1.6 }}>
              <li>After log in you will see Services page of Himanshu, click on Start Chat button of any expert.</li>
              <li>Type the required details above, click send, complete the payment, and your reading will be prepared and sent to you. Best Wishes!</li>
            </ul>
          </section>
          <AuthCta isLoggedIn={isLoggedIn} openAuth={openAuth} />
        </HomeRow>
        <HomeRow
          label="Traditional Vedic Gemstone Recommendation"
          imgSrc="/images/reading.jpg"
          imgAlt="Navaratna gemstones"
        >
          <h2>Gemstone & Remedial Guidance</h2>
          <p>
            Receive a Navaratna-based prescription aligned with your dashā and bhukti periods, covering the metal, carat weight, and mantra activation steps.
          </p>
          <ul style={{ paddingLeft: 20 }}>
            <li>Identifies benefic/detriment planets before recommending a gem.</li>
            <li>Explains why the remedy supports your current karmic cycle.</li>
            <li>Includes wear schedule and purification ritual.</li>
          </ul>
          <AuthCta isLoggedIn={isLoggedIn} openAuth={openAuth} />
        </HomeRow>
        <HomeRow
          label="Muhurta & Life Planning"
          imgSrc="/images/reading.jpg"
          imgAlt="Muhurta planning"
        >
          <h2>Choose the right launch window</h2>
          <p>Outline your event, wedding, or product launch and get a shortlist of auspicious start times.</p>
          <p>
            Like learn{" "}
            <a
              href="https://komilla.com/lib-pushkara-part-two.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1976d2", textDecoration: "underline" }}
            >
              Pushkara Navamsa
            </a>
          </p>
          <AuthCta isLoggedIn={isLoggedIn} openAuth={openAuth} />
        </HomeRow>
        <HomeRow
          label="Relationship Compatibility"
          imgSrc="/images/reading.jpg"
          imgAlt="Compatibility charts"
        >
          <h2>Synastry & Guna Milan brief</h2>
          <p>Upload both birth packets to receive a combined PDF + MP3 covering guna scores, dashā overlaps, and remedial advice.</p>
          <AuthCta isLoggedIn={isLoggedIn} openAuth={openAuth} />
        </HomeRow>
      </div>
    </main>
  );
}