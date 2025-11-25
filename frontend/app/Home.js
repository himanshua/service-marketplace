"use client";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import "./profile/profile.css";
import "./globals.css";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
              width: "90%",
              maxWidth: 200,
              height: "auto",
              maxHeight: 180,
              objectFit: "contain",
              background: "#fff",
              display: "block",
              margin: "0 auto",
              ...imgStyle, // <-- merge custom style
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
        <HomeRow
          imgSrc="images/Ganesha.jpeg"
          imgAlt="Welcome"
        >
          <h2>Beej Mantra</h2>
          <p>
            Aum Hreem Hraum Suryayeh Namah, Aum Hreem Shreem Chandraya Namah, Aum Eim Hreem Shreem Mangalayeh Namah, Aum Aim Streem Bam Budhayeh Namah, Aum Hreem Brahm Brihaspatayeh Namah, Aum Hreem Shreem Shukrayeh Namah, Aum Hreem Shreem Sam Sanneshcharayeh Namah, Aum Eim Hreem Rahuvey Namah, Aum Eim Hreem Ketuvey Namah.
          </p>
        </HomeRow>
        <HomeRow
          imgSrc="/images/himanshu-tiwari-og.jpg"
          imgAlt="Himanshu Tiwari"
        >
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
        </HomeRow>
        <HomeRow
          label="12 Houses"
          imgSrc="/images/12-house1.jpg"
          imgAlt="12 Houses"
          imgStyle={{
          width: "100%",
          maxWidth: 320,
          height: 240,
          maxHeight: 240,
  }}
        >
          <h2>12 Houses</h2>
          <p>Houses 1 to 12</p>
          <ol>
            <li>
              <a href="https://barbarapijan.com/bpa/Bhava/0_Bhava_mainpage.htm#bhava-1" target="_blank" rel="noopener noreferrer">
                1st House – Lagna / Tanu Bhava
              </a>
              – Governs body.
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Bhava/0_Bhava_mainpage.htm#bhava-2" target="_blank" rel="noopener noreferrer">
                2nd House – Dhana Bhava
              </a>
              – Governs relatives.
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Bhava/0_Bhava_mainpage.htm#bhava-3" target="_blank" rel="noopener noreferrer">
                3rd House – Sahaja Bhava
              </a>
              – Governs brothers.
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Bhava/0_Bhava_mainpage.htm#bhava-4" target="_blank" rel="noopener noreferrer">
                4th House – Bandhu Bhava
              </a>
              – Governs friends.
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Bhava/0_Bhava_mainpage.htm#bhava-5" target="_blank" rel="noopener noreferrer">
                5th House – Putra Bhava
              </a>
              – Governs sons.
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Bhava/0_Bhava_mainpage.htm#bhava-6" target="_blank" rel="noopener noreferrer">
                6th House – Ari (Enemy) Bhava
              </a>
              – Governs enemies.
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Bhava/0_Bhava_mainpage.htm#bhava-7" target="_blank" rel="noopener noreferrer">
                7th House – Yuvati Bhava
              </a>
              – Governs wives (spouse).
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Bhava/0_Bhava_mainpage.htm#bhava-8" target="_blank" rel="noopener noreferrer">
                8th House – Randhra Bhava
              </a>
              – Governs death (terminus vitae).
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Bhava/0_Bhava_mainpage.htm#bhava-9" target="_blank" rel="noopener noreferrer">
                9th House – Dharma Bhava
              </a>
              – Governs auspicious qualities and the general moral condition.
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Bhava/0_Bhava_mainpage.htm#bhava-10" target="_blank" rel="noopener noreferrer">
                10th House – Karma Bhava
              </a>
              – Governs profession, honors, and dignity.
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Bhava/0_Bhava_mainpage.htm#bhava-11" target="_blank" rel="noopener noreferrer">
                11th House – Labha Bhava
              </a>
              – Governs income and finance.
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Bhava/0_Bhava_mainpage.htm#bhava-12" target="_blank" rel="noopener noreferrer">
                12th House – Vyaya Bhava
              </a>
              – Indicates expenditure.
            </li>
          </ol>
        </HomeRow>
        <HomeRow
          label="Nine Planets"
          imgSrc="images/planets.jpeg"
          imgAlt="Nine Planets"
        >
          <h2>Nine Planets</h2>
          <p>Planets 1 to 9</p>
          {/* ...add more content as needed... */}
        </HomeRow>
      </div>
    </main>
  );
}