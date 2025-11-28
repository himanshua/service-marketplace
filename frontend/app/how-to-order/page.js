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

  return (
    <main className="profile-main home-main">
      <div className="home-container" style={{ flexDirection: "column", padding: 0 }}>
        <HomeRow
          imgSrc="images/reading.jpg"
          imgAlt="Welcome"
        >
          <h2></h2>
          <p>
            How to order Jyotishavidya Readings<br />
            offered by{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                router.push('/#himanshu-section');
                const delays = [300, 600, 900, 1200];
                delays.forEach((delay) => {
                  setTimeout(() => {
                    const element = document.getElementById('himanshu-section');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, delay);
                });
              }}
              style={{
                color: "#1976d2",
                textDecoration: "underline",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Himanshu Tiwari
            </a>
          </p>
          <section>
            <h2>What you’ll receive</h2>
            <ul>
              <li>You receive a 2+ hour MP3 audio or video reading (lecture style) and a PDF with your charts and Vimshottari dasha timeline, delivered via Dropbox.</li>
              <li>
                Before the reading, please{" "}
                <a
                  href="mailto:himanshu.inperson@gmail.com"
                  style={{ color: "#1976d2", textDecoration: "underline" }}
                >
                  email to Himanshu
                </a>{" "}
                5–10 thoughtful questions you want answered.
              </li>
              <li>After the reading, you may ask one clarification question (answered by email or as an MP3).</li>
              <li>Required info: name, gender, exact birth date (DD-MMM-YYYY), accurate birth time (AM/PM and 24-hr), and birthplace with Google coordinates.</li>
              <li>Your questions should be reflective, specific, meaningful, and free from self-criticism.</li>
              <li>After log in you will see Services page of Himanshu, click on Chat Start Chatbutton of any expert</li>
              <li>Type the required details above, click send, complete the payment, and your reading will be prepared and sent to you. Best Wishes!</li>

            </ul>
          </section>
          <p style={{ marginTop: 24, fontWeight: 600, color: "#1976d2" }}>
            Please log in or sign up or use Google login to request your JyotishaVidya reading
          </p>
          {!isLoggedIn && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16, maxWidth: 350 }}>
              <button
                className="profile-btn profile-btn-google-blue"
                style={{ width: "100%" }}
                onClick={() => signIn("google", { callbackUrl: "/services" })}
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google logo"
                  className="profile-google-logo"
                  style={{ marginRight: 8, verticalAlign: "middle", height: 20 }}
                />
                Continue with Google
              </button>
              <div style={{ display: "flex", gap: 12 }}>
                <a href="/login" style={{ flex: 1 }}>
                  <button className="profile-btn profile-btn-outline" style={{ width: "100%" }}>
                    Log in
                  </button>
                </a>
                <a href="/signup" style={{ flex: 1 }}>
                  <button className="profile-btn profile-btn-outline" style={{ width: "100%" }}>
                    Sign up
                  </button>
                </a>
              </div>
            </div>
          )}
        </HomeRow>
      </div>
    </main>
  );
}