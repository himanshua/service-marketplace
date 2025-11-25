"use client";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import "./profile/profile.css";
import "./globals.css";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        else {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("user");
        }
      })
      .catch((err) => {
        console.error("Auth check failed:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (
      session &&
      session.user &&
      !localStorage.getItem("token")
    ) {
      fetch(`${API}/api/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            localStorage.setItem("token", data.token);
            // Redirect to /services if coming from modal, else home
            if (searchParams.get("redirect") === "services" || session.callbackUrl === "/services") {
              window.location.href = "/services";
            } else {
              window.location.reload();
            }
          }
        });
    }
  }, [session, searchParams]);

  if (loading || status === "loading") {
    return <main className="profile-main">Loading…</main>;
  }

  const loggedInUser = user || (session && session.user);

  return (
    <main className="profile-main home-main">
      <div className="home-container" style={{ flexDirection: "column", padding: 0 }}>
        {/* Row 0 (NEW TOP ROW) */}
        <div style={{ display: "flex", borderBottom: "2px solid #bdbdbd" }}>
                    <div
            className="home-image-col"
            style={{
              borderRight: "2px solid #bdbdbd",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",   // centers horizontally
              justifyContent: "center", // centers vertically (optional)
              padding: "16px 0",
              boxSizing: "border-box",
            }}
          >
            <img
              src="images/Ganesha.jpeg"
              alt="Welcome"
              className="home-hero-image"
              style={{
                borderRadius: "12px",
                width: 215,
                height: 235,
                objectFit: "cover",
                background: "#fff",
                display: "block",
              }}
            />
          </div>
          <div className="home-content-col">
            <h2>Beej Mantra</h2>
            <p>Aum Hreem Hraum Suryayeh Namah, Aum Hreem Shreem Chandraya Namah, Aum Eim Hreem Shreem Mangalayeh Namah, Aum Aim Streem Bam Budhayeh Namah, Aum Hreem Brahm Brihaspatayeh Namah, Aum Hreem Shreem Shukrayeh Namah, Aum Hreem Shreem Sam Sanneshcharayeh Namah, Aum Eim Hreem Rahuvey Namah, Aum Eim Hreem Ketuvey Namah.</p>
          </div>
        </div>
        {/* Row 1 */}
        <div style={{ display: "flex", borderBottom: "2px solid #bdbdbd" }}>
          <div className="home-image-col" style={{ borderRight: "2px solid #bdbdbd" }}>
            <img
              src="/images/himanshu-tiwari-og.jpg"
              alt="Himanshu Tiwari"
              className="home-hero-image"
              style={{
                borderRadius: "12px",
                width: 240,
                height: 350,
                objectFit: "cover",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                background: "#fff",
                display: "block",
              }}
            />
          </div>
          <div className="home-content-col">
            <h1 className="home-title">
              Top-Rated Psychic, Astrology, Numerology, Horary & Tarot Readings in the USA — Himanshu Tiwari, Delivering Insight for Over 10 Years
            </h1>
            <h2 className="home-subtitle">
              Jyotishvidya, Astrology, Tarot & More by Himanshu Tiwari
            </h2>
            <p className="home-desc">
              Experience accurate psychic readings, astrology insights, and tarot guidance from one of the best online psychics in the USA. Himanshu Tiwari offers Jyotishvidya, astrology, and tarot services to help you find clarity and direction.
            </p>
            {loggedInUser && (
              <p style={{
                fontWeight: 800,
                color: "#1976d2",
                marginBottom: 18,
                fontSize: "2rem",
                letterSpacing: "0.5px"
              }}>
                Welcome, {loggedInUser.name || loggedInUser.email}!
              </p>
            )}
            <div className="home-btn-row">
              <button
                className="profile-btn"
                onClick={() => {
                  if (!loggedInUser) {
                    setShowAuthPrompt(true);
                  } else {
                    window.location.href = "/services";
                  }
                }}
              >
                Order Now on Chat Services
              </button>
              {loggedInUser && (
                <>
                  <Link href="/profile">
                    <button className="profile-btn">View Profile</button>
                  </Link>
                  <Link href="/services">
                    <button className="profile-btn">View Chat/Call Services</button>
                  </Link>
                  <button
                    className="profile-btn"
                    onClick={() => {
                      localStorage.clear();
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
            {!loggedInUser && (
              <div className="home-auth-row">
                <button
                  className="profile-btn profile-btn-google-blue"
                  onClick={() => signIn("google")}
                >
                  <img
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google logo"
                    className="profile-google-logo"
                  />
                  Continue with Google
                </button>
                <div className="home-auth-btns">
                  <Link href="/login">
                    <button className="profile-btn profile-btn-outline">
                      Log in
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button className="profile-btn profile-btn-outline">
                      Sign up
                    </button>
                  </Link>
                </div>
              </div>
            )}
            <div className="home-social-row">
              <a
                href="https://www.fiverr.com/himanshutiwari"
                target="_blank"
                rel="noopener noreferrer"
                className="profile-btn profile-btn-outline"
              >
                Fiverr Profile
              </a>
              <a
                href="https://www.youtube.com/@himanshutiwari8855"
                target="_blank"
                rel="noopener noreferrer"
                className="profile-btn profile-btn-outline"
              >
                YouTube Channel
              </a>
              <a
                href="https://www.facebook.com/himanshuactive/"
                target="_blank"
                rel="noopener noreferrer"
                className="profile-btn profile-btn-outline"
              >
                Facebook (Personal)
              </a>
              <a
                href="https://www.facebook.com/vedicindianastrology/"
                target="_blank"
                rel="noopener noreferrer"
                className="profile-btn profile-btn-outline"
              >
                Facebook Page
              </a>
              <a
                href="https://www.facebook.com/groups/748009425400227"
                target="_blank"
                rel="noopener noreferrer"
                className="profile-btn profile-btn-outline"
              >
                Facebook Group
              </a>
              <a
                href="https://x.com/himanshusocial"
                target="_blank"
                rel="noopener noreferrer"
                className="profile-btn profile-btn-outline"
              >
                X Profile
              </a>
            </div>
            {showAuthPrompt && (
              <div className="auth-modal-backdrop">
                <div className="auth-modal">
                  <p style={{ fontWeight: 600, fontSize: "1.2rem", marginBottom: 20 }}>
                    Please sign up or log in to access services.
                  </p>
                  <div style={{ display: "flex", gap: 12, marginBottom: 12, justifyContent: "center" }}>
                    <Link href={{ pathname: "/login", query: { redirect: "services" } }}>
                      <button className="profile-btn profile-btn-outline">Log in</button>
                    </Link>
                    <Link href="/signup">
                      <button className="profile-btn profile-btn-outline">Sign up</button>
                    </Link>
                  </div>
                  <div style={{ margin: "18px 0 8px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ flex: 1, height: 1, background: "#e0e7ef", marginRight: 10 }} />
                    <span style={{ color: "#888" }}>or</span>
                    <div style={{ flex: 1, height: 1, background: "#e0e7ef", marginLeft: 10 }} />
                  </div>
                  <button
                    className="profile-btn profile-btn-google-blue"
                    style={{ width: "100%", maxWidth: 350, marginBottom: 18 }}
                    onClick={() => {
                      signIn("google", { callbackUrl: "/services" });
                    }}
                  >
                    <img
                      src="https://developers.google.com/identity/images/g-logo.png"
                      alt="Google logo"
                      className="profile-google-logo"
                    />
                    Continue with Google
                  </button>
                  <button
                    className="profile-btn"
                    style={{ background: "#eee", color: "#333" }}
                    onClick={() => setShowAuthPrompt(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Row 2 */}
        <div
  style={{
    display: "flex",
    borderBottom: "2px solid #bdbdbd",
    alignItems: "stretch", // ensures equal height
    minHeight: 320, // optional: set a minimum height for the row
  }}
>
  <div
    className="home-image-col"
    style={{
      borderRight: "2px solid #bdbdbd",
      flex: "0 0 320px", // fixed width for left column
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
      height: "100%",
      minHeight: "100%",
      background: "#fff",
    }}
  >
    <span style={{ marginBottom: 8, fontWeight: 600 }}>12 Houses</span>
    <img
      src="/images/12-house1.jpg"
      alt="12 Houses"
      className="home-hero-image"
      style={{
        borderRadius: "12px",
        width: "90%",
        maxWidth: 300,
        height: "auto",
        maxHeight: 260,
        objectFit: "contain",
        background: "#fff",
        display: "block",
      }}
    />
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
    <h2>12 Houses</h2>
    <p>Houses 1 to 12</p>
    <ol>
      <li>
        <a href="https://vedicfeed.com/12-houses-astrology/#1st" target="_blank" rel="noopener noreferrer">
          First House
        </a>
        – Your identity, appearance, personality, and self-expression.
      </li>
      <li>
        <a href="https://astrosanhita.com/twelve-houses-in-astrology/#2nd_house" target="_blank" rel="noopener noreferrer">
          Second House
        </a>
        – Your money, speech, values, wealth, and family resources.
      </li>
      <li>
        <a href="https://astrosanhita.com/twelve-houses-in-astrology/#3rd_house" target="_blank" rel="noopener noreferrer">
          Third House
        </a>
        – Your communication, courage, siblings, skills, and efforts.
      </li>
      <li>
        <a href="https://astrosanhita.com/twelve-houses-in-astrology/#4th_house" target="_blank" rel="noopener noreferrer">
          Fourth House
        </a>
        – Your home, mother, emotions, land, and inner stability.
      </li>
      <li>
        <a href="https://astrosanhita.com/twelve-houses-in-astrology/#5th_house" target="_blank" rel="noopener noreferrer">
          Fifth House
        </a>
        – Your love, creativity, children, intelligence, and joy.
      </li>
      <li>
        <a href="https://astrosanhita.com/twelve-houses-in-astrology/#6th_house" target="_blank" rel="noopener noreferrer">
          Sixth House
        </a>
        – Your health, enemies, debts, work routines, and discipline.
      </li>
      <li>
        <a href="https://astrosanhita.com/twelve-houses-in-astrology/#7th_house" target="_blank" rel="noopener noreferrer">
          Seventh House
        </a>
        – Your marriage, partnerships, contracts, and commitments.
      </li>
      <li>
        <a href="https://astrosanhita.com/twelve-houses-in-astrology/#8th_house" target="_blank" rel="noopener noreferrer">
          Eighth House
        </a>
        – Sudden changes, secrets, inheritance, transformation, deep emotions.
      </li>
      <li>
        <a href="https://astrosanhita.com/twelve-houses-in-astrology/#9th_house" target="_blank" rel="noopener noreferrer">
          Ninth House
        </a>
        – Luck, spirituality, higher learning, philosophy, long journeys.
      </li>
      <li>
        <a href="https://astrosanhita.com/twelve-houses-in-astrology/#10th_house" target="_blank" rel="noopener noreferrer">
          Tenth House
        </a>
        – Career, reputation, authority, achievements, and life direction.
      </li>
      <li>
        <a href="https://astrosanhita.com/twelve-houses-in-astrology/#11th_house" target="_blank" rel="noopener noreferrer">
          Eleventh House
        </a>
        – Gains, income, friends, networks, and life goals.
      </li>
      <li>
        <a href="https://astrosanhita.com/twelve-houses-in-astrology/#12th_house" target="_blank" rel="noopener noreferrer">
          Twelfth House
        </a>
        – Losses, isolation, foreign lands, liberation, spirituality.
      </li>
    </ol>
  </div>
</div>
        {/* Row 3 */}
        <div style={{ display: "flex" }}>
          <div className="home-image-col" style={{ borderRight: "2px solid #bdbdbd" }}>
            <img
              src="/images/your-third-image.jpg"
              alt="Nine Planets"
              className="home-hero-image"
              style={{
                borderRadius: "12px",
                width: 300,
                height: 200,
                objectFit: "cover",
                background: "#fff",
              }}
            />
          </div>
          <div className="home-content-col">
            <h2>Nine Planets</h2>
            <p>Planets 1 to 9</p>
          </div>
        </div>
      </div>
    </main>
  );
}