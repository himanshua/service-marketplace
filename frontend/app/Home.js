"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { track } from "@vercel/analytics/react";
import "./profile/profile.css";
import "./globals.css";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function HomeRow({ label, imgSrc, imgAlt, imgStyle = {}, leftContent, children }) {
  return (
    <div style={{ display: "flex", borderBottom: "2px solid #bdbdbd", alignItems: "stretch", minHeight: 250 }}>
      <div className="home-image-col">
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            width: "100%",
          }}
        >
          {label && <span style={{ marginBottom: 8, fontWeight: 600 }}>{label}</span>}
          {leftContent}
          {imgSrc && (
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
          )}
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

const REMINDER_INITIAL_DELAY = 6000;
const REMINDER_SNOOZE_DELAY = 60000;

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showSignupReminder, setShowSignupReminder] = useState(false);
  const reminderAudioRef = useRef(null);
  const reminderTimerRef = useRef(null);
  const reminderAudioUnlockedRef = useRef(false);
  const reminderShownRef = useRef(false);
  const reminderSnoozeUntilRef = useRef(0);
  const pendingChimeRef = useRef(false);
  const isLoggedInRef = useRef(false);

  const loggedInUser = user || (session && session.user); // <-- move up before effects

  const playReminderChime = useCallback(() => {
    if (!reminderAudioRef.current || !reminderAudioUnlockedRef.current) {
      pendingChimeRef.current = true;
      return;
    }
    pendingChimeRef.current = false;
    reminderAudioRef.current.currentTime = 0;
    reminderAudioRef.current.play().catch(() => {});
  }, []);

  const unlockAudio = useCallback(async () => {
    if (reminderAudioUnlockedRef.current || !reminderAudioRef.current) return;
    try {
      await reminderAudioRef.current.play();
      reminderAudioRef.current.pause();
      reminderAudioRef.current.currentTime = 0;
      reminderAudioUnlockedRef.current = true;
      if (pendingChimeRef.current) playReminderChime();
    } catch {}
  }, [playReminderChime]);

  const showReminder = useCallback(() => {
    if (isLoggedInRef.current) return;
    if (reminderShownRef.current) return;
    if (Date.now() < reminderSnoozeUntilRef.current) return;

    reminderShownRef.current = true;
    setShowSignupReminder(true);
    playReminderChime();
  }, [playReminderChime]);

  const scheduleReminder = useCallback(
    (delay = REMINDER_INITIAL_DELAY) => {
      if (isLoggedInRef.current) return;
      if (reminderTimerRef.current) clearTimeout(reminderTimerRef.current);
      reminderTimerRef.current = setTimeout(showReminder, delay);
    },
    [showReminder]
  );

  const handleDismissReminder = useCallback(() => {
    setShowSignupReminder(false);
    reminderShownRef.current = false;
    reminderSnoozeUntilRef.current = Date.now() + REMINDER_SNOOZE_DELAY;
    scheduleReminder(REMINDER_SNOOZE_DELAY);
  }, [scheduleReminder]);

  useEffect(() => {
    const audio = new Audio("/sounds/reminder-chime.mp3");
    audio.preload = "auto";
    reminderAudioRef.current = audio;
    return () => {
      audio.pause();
      reminderAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (loading || loggedInUser) return;
    const handlePointerDown = async () => {
      await unlockAudio();
      showReminder();
    };
    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [loading, loggedInUser, unlockAudio, showReminder]);

  useEffect(() => {
    if (loading || loggedInUser) return;
    scheduleReminder(REMINDER_INITIAL_DELAY);
    return () => {
      if (reminderTimerRef.current) {
        clearTimeout(reminderTimerRef.current);
        reminderTimerRef.current = null;
      }
    };
  }, [loading, loggedInUser, scheduleReminder]);

  useEffect(() => {
    isLoggedInRef.current = !!loggedInUser;
    if (loggedInUser && reminderTimerRef.current) {
      clearTimeout(reminderTimerRef.current);
      reminderTimerRef.current = null;
    }
    if (loggedInUser) {
      setShowSignupReminder(false);
      reminderShownRef.current = false;
      reminderSnoozeUntilRef.current = 0;
    }
  }, [loggedInUser]);

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
    if (session && session.user && !localStorage.getItem("token")) {
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
            window.location.href = "https://aheadterra.com/how-to-order";
          }
        });
    }
  }, [session, searchParams]);

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.substring(1);
        const delays = [100, 300, 600, 900];
        delays.forEach((delay) => {
          setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, delay);
        });
        setTimeout(() => {
          window.history.replaceState(null, "", window.location.pathname);
        }, 1200);
      }
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  useEffect(() => track("cta_view_home"), []);

  const handlePrimaryCta = () => {
    track("cta_click_home");
    if (!loggedInUser) {
      setShowAuthPrompt(true);
      return;
    }
    router.push("/services");
  };

  const handleAuth = (provider) => {
    track("auth_start", { provider });
    if (provider === "google") {
      signIn("google", { callbackUrl: "https://aheadterra.com/how-to-order" });
    } else if (provider === "login") {
      router.push("/login?redirect=services");
    } else {
      router.push("/signup");
    }
  };

  if (loading || status === "loading") {
    return <main className="profile-main">Loading…</main>;
  }

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
          imgSrc="/images/Destiny.jpg" // <-- Use your actual image path here
          imgAlt="ज्योतिषशास्त्र"
          leftContent={
            <>
              <h1>ज्योतिषशास्त्र</h1>
              <p>
                भविष्यवाणी<br />
                कुंडली<br />
              </p>
            </>
          }
        >
          <p>
            Terra is a school<br />
            All planets are schools<br />
            <a
              href="https://astromnc.blogspot.com/2025"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1976d2", textDecoration: "underline" }}
            >
              2026 Rashifal (In Progress)
            </a>
          </p>
          <div style={{ marginTop: 24 }}>
            <strong>Q. Are you accepting reading requests?</strong>
            <br />
            <span>
              <strong>A.</strong> The 2025 Jyotishavidya readings calendar will be open during the full month of Nov-2025, and for parts of Dec-2025 as well.<br /><br />
              Likely, most of Jan-Feb-Mar of 2026 will also be available.<br /><br />
              Please feel welcome to <a
                href="https://aheadterra.com/how-to-order"
                rel="noopener noreferrer"
                style={{ color: "#1976d2", textDecoration: "underline" }}
              >order a Jyotishavidya reading</a> at your convenience.
            </span>
          </div>
        </HomeRow>

             <HomeRow
        imgSrc="/images/Naseeb.JPG"
        imgAlt="Image 1"
      >
        Astrology is not Fortune telling, it is divination. Jyotish = Jyoti + Ish.
        Jyoti means light and Ish means God (Ishwara). So Jyotish literally means the Light of God. Please be reminded that Jyotishavidya readings are designed as educational learnings for students of the vidya who wish to improve their divinatory skills. Jyotishavidya readings are not fortune-telling and Jyotisha tradition offers no moral judgments.
        Instead, It means Jyotisha only tells you what is happening in your life, what energies are active, and what direction things are moving. It does not say you are good or bad. It does not give blame or praise. It only shows the situation, so you can understand it and make better choices.
      </HomeRow>
      
      <HomeRow
        imgSrc="/images/Naseeb1.jpg"
        imgAlt="Image 2"
      >
        The text in Nepali: "भाग्य कसैको पेवा होइन"
Simple English (Positive version):
"Everyone can create their own fortune"
Positive Meaning:

Everyone has equal opportunity for success
You can build your own luck through effort
Good things are possible for anyone
Your hard work creates your bright future
Believe in yourself - success is within your reach!
      </HomeRow>

        
        <HomeRow
          imgSrc="/images/himanshu-tiwari-og.jpg"
          imgAlt="Himanshu Tiwari"
        >
          <h1 className="home-title" id="himanshu-section">
            Top-Rated Psychic, Astrology, Numerology, Horary & Tarot Readings in the USA — Himanshu Tiwari, Delivering Insight for Over 10 Years
          </h1>
          <h2 className="home-subtitle">
            Jyotishavidya, Astrology, Tarot & More by Himanshu Tiwari
          </h2>
          <p className="home-desc">
            Experience accurate psychic readings, astrology insights, and tarot guidance from one of the best online psychics in the USA. Himanshu Tiwari offers Jyotishavidya, astrology, and tarot services to help you find clarity and direction.
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
              onClick={handlePrimaryCta}
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
            <ul style={{ marginTop: 14, paddingLeft: 20, color: "#0b2a55", lineHeight: 1.6 }}>
              <li>Save your Jyotishavidya questions for later replies.</li>
              <li>Unlock the Services page and start chat instantly.</li>
              <li>Receive Dropbox delivery updates in one dashboard.</li>
            </ul>
          )}
          <div className="home-auth-row">
            <button
              className="profile-btn profile-btn-google-blue"
              onClick={() => signIn("google", { callbackUrl: "https://aheadterra.com/how-to-order" })}
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
              href="https://www.linkedin.com/in/himanshu-tiwari-b32a602b/"
              target="_blank"
              rel="noopener noreferrer"
              className="profile-btn profile-btn-outline"
            >
              LinkedIn
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
                <h3 style={{ marginBottom: 8 }}>Create your AheadTerra account</h3>
                <p style={{ marginBottom: 16, color: "#4a6071" }}>
                  Sign in to book readings, upload birth data, and get Dropbox links.
                </p>
                <button
                  className="profile-btn profile-btn-google-blue"
                  onClick={() => handleAuth("google")}
                >
                  <img src="https://developers.google.com/identity/images/g-logo.png" alt="" className="profile-google-logo" />
                  Continue with Google
                </button>
                <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                  <button className="profile-btn profile-btn-outline" onClick={() => handleAuth("login")}>
                    Log in
                  </button>
                  <button className="profile-btn profile-btn-outline" onClick={() => handleAuth("signup")}>
                    Sign up
                  </button>
                </div>
                <button className="profile-btn" style={{ marginTop: 14, background: "#eee", color: "#333" }} onClick={() => setShowAuthPrompt(false)}>
                  Maybe later
                </button>
              </div>
            </div>
          )}
        </HomeRow>
        <HomeRow
          label="12 Houses"
          imgSrc="/images/12-house4.JPG"
          imgAlt="12 Houses"
          imgStyle={{
            width: "100%",
            height: "100%",
            objectFit: "fill", // Stretches image to fill both width and height
            borderRadius: "12px",
            background: "#fff",
            display: "block",
            margin: "0 auto",
          }}
        >
          <h2>
            <a
              href="https://barbarapijan.com/bpa/Bhava/0_Bhava_mainpage.htm"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1976d2", textDecoration: "underline" }}
            >
              12 Houses
            </a>
          </h2>
          <p>Houses 1 to 12</p>
          <ol>
            <li>
              <a href="https://aheadterra.com/10" target="_self" rel="noopener noreferrer">
                1st House – Lagna / Tanu Bhava - The First House is about your own Identity (स्वभाव). 

              </a>
              – It shows your identity. Tanu Bhava or First Bhava is Swa Bhava — The way you are naturally. It explains your look, personality, how you begin things, and the direction your life wants to go. 
              </li>
              <li>
              <a href="https://aheadterra.com/11" target="_self" rel="noopener noreferrer">
               2nd House – Dhana / Kutumb Bhava – The Second House is about your wealth, family, and voice (धन, कुटुम्ब, वाणी).
              </a>
               – It shows your money, savings, speech, face, beauty, food habits, and family background.
               Dhana Bhava or Second Bhava is Kutumb Bhava — your family and the things you own. It explains your wealth, early learning, values, and how sweet or strong your voice is.              </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Bhava/2dhana_bhava.htm" target="_blank" rel="noopener noreferrer">
                2nd House – Dhana Bhava
              </a>
              – Governs family, speech, and wealth.
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Bhava/3sahaja_bhava.htm" target="_blank" rel="noopener noreferrer">
                3rd House – Sahaja Bhava
              </a>
              – Governs siblings, courage, and communication.
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Bhava/4bandhu_bhava.htm" target="_blank" rel="noopener noreferrer">
                4th House – Bandhu Bhava
              </a>
              – Governs mother, home, and comforts.
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Bhava/5putra_bhava.htm" target="_blank" rel="noopener noreferrer">
                5th House – Putra Bhava
              </a>
              – Governs children, creativity, and intelligence.
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Bhava/6ari_bhava.htm" target="_blank" rel="noopener noreferrer">
                6th House – Ari (Enemy) Bhava
              </a>
              – Governs enemies, health, and service.
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Bhava/7yuvati_bhava.htm" target="_blank" rel="noopener noreferrer">
                7th House – Yuvati Bhava
              </a>
              – Governs spouse, partnerships, and marriage.
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Bhava/8randhra_bhava.htm" target="_blank" rel="noopener noreferrer">
                8th House – Randhra Bhava
              </a>
              – Governs longevity, transformation, and mysteries.
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Bhava/9dharma_bhava.htm" target="_blank" rel="noopener noreferrer">
                9th House – Dharma Bhava
              </a>
              – Governs fortune, dharma, and higher learning.
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Bhava/10karma_bhava.htm" target="_blank" rel="noopener noreferrer">
                10th House – Karma Bhava
              </a>
              – Governs career, status, and achievements.
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Bhava/11labha_bhava.htm" target="_blank" rel="noopener noreferrer">
                11th House – Labha Bhava
              </a>
              – Governs gains, aspirations, and friendships.
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Bhava/12vyaya_bhava.htm" target="_blank" rel="noopener noreferrer">
                12th House – Vyaya Bhava
              </a>
              – Indicates losses, expenses, and liberation.
            </li>
          </ol>
        </HomeRow>
        <HomeRow
          label="Nine Planets"
          imgSrc="/images/9-planets.png"
          imgAlt="Nine Planets"
          imgStyle={{
            width: "100%",
            maxWidth: 340,
            height: 320,
            maxHeight: 320,
            objectFit: "contain",
            borderRadius: "12px",
            background: "#fff",
            display: "block",
            margin: "0 auto",
          }}
        >
          <h2>
            <a
              href="https://barbarapijan.com/bpa/bAstrHom.htm#Planets"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1976d2", textDecoration: "underline" }}
            >
              Nine Planets
            </a>
          </h2>
          <p>Planets 1 to 9</p>
          <ol>
            <li>
              <a
                href="https://aheadterra.com/1"
                rel="noopener noreferrer"
              >
                [Surya]
              </a>
              — Dimension 7 : creation, light, authority, vitality, purpose, identity, will
            </li>
            <li>
              <a
                href="https://barbarapijan.com/bpa/Graha/Chandra/1Chandra_main_page.htm"
                target="_blank"
                rel="noopener noreferrer"
              >
                [Chandra]
              </a>
              — Dimension 6 : intuition, emotion, memory, nurturing, rhythm, sensitivity
            </li>
            <li>
              <a
                href="https://barbarapijan.com/bpa/Graha/Budha/1Budha_main_page.htm"
                target="_blank"
                rel="noopener noreferrer"
              >
                [Budha]
              </a>
              — Dimension 5 : thinking, speaking, learning, analysis, logic
            </li>
            <li>
              <a
                href="https://barbarapijan.com/bpa/Graha/Zukra/1Zukra_MainPage.htm"
                target="_blank"
                rel="noopener noreferrer"
              >
                [Shukra]
              </a>
              — Dimension 4 : love, beauty, harmony, attraction
            </li>
            <li>
              <a
                href="https://barbarapijan.com/bpa/Graha/Mangala/1Mangala_main_page.htm"
                target="_blank"
                rel="noopener noreferrer"
              >
                [Kuja]
              </a>
              — Dimension 3 : action, courage, desire
            </li>
            <li>
              <a
                href="https://barbarapijan.com/bpa/Graha/Guru/1Guru_main_page.htm"
                target="_blank"
                rel="noopener noreferrer"
              >
                [Guru]
              </a>
              — Dimension 2 : expansion, guidance
            </li>
            <li>
              <a
                href="https://barbarapijan.com/bpa/Graha/Shani/1Shani_main_page.htm"
                target="_blank"
                rel="noopener noreferrer"
              >
                [Shani]
              </a>
              — Dimension 1 : structure
            </li>
            <li>
              <a
                href="https://barbarapijan.com/bpa/Graha/Rahu/1Rahu_MainPage.htm"
                target="_blank"
                rel="noopener noreferrer"
              >
                [Rahu]
              </a>
              — materializing force
            </li>
            <li>
              <a
                href="https://barbarapijan.com/bpa/Graha/Ketu/1Ketu_main.htm"
                target="_blank"
                rel="noopener noreferrer"
              >
                [Ketu]
              </a>
              — spiritualizing force
            </li>
          </ol>
        </HomeRow>
        <HomeRow
          label="Who is AheadTerra?"
          imgSrc="/images/Earth_flag.jpg"
          imgAlt="AheadTerra - Earth"
          imgStyle={{
            width: "100%",
            maxWidth: 340,
            height: 220,
            maxHeight: 220,
            objectFit: "contain",
            borderRadius: "12px",
            background: "#fff",
            display: "block",
            margin: "0 auto",
          }}
        >
          <h2>Who is AheadTerra?</h2>
          <p>
            Terra is a Latin word for Earth. "AheadTerra" symbolizes moving forward on Earth, embracing knowledge, growth, and a global perspective. The name reflects a vision of progress and connection for everyone on our planet.
          </p>
        </HomeRow>
        <HomeRow
          label="Who is Himanshu Tiwari"
          imgSrc="/images/himanshu-tiwari-og.jpg"
          imgAlt="Who is Himanshu Tiwari"
          imgStyle={{
            width: "100%",
            maxWidth: 340,
            height: 220,
            maxHeight: 220,
            objectFit: "contain",
            borderRadius: "12px",
            background: "#fff",
            display: "block",
            margin: "0 auto",
          }}
        >
           <h2 style={{ textAlign: "" }}>
            <Link href="#himanshu-section">
              <span style={{ color: "#1976d2", textDecoration: "underline" }}>
                Who is Himanshu Tiwari? 
              </span>
            </Link>
          </h2>
         
          <p style={{ textAlign: "right" }}>...</p>
        </HomeRow>

        <HomeRow
          imgSrc="/images/signup-reminder.jpg"
          imgAlt="Join AheadTerra"
        >
          <h2>Ready to request your reading?</h2>
          <p>Log in to save your birth details, track delivery dates, and message Himanshu directly.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="profile-btn" onClick={handlePrimaryCta}>Access Services</button>
            <button className="profile-btn profile-btn-outline" onClick={() => handleAuth("signup")}>Create account</button>
          </div>
        </HomeRow>
        <HomeRow
          label="How to order Jyotishavidya Readings?"
          imgSrc="/images/reading.jpg"
          imgAlt="How to order Jyotishavidya Readings?"
          imgStyle={{
            width: "100%",
            maxWidth: 340,
            height: 220,
            maxHeight: 220,
            objectFit: "contain",
            borderRadius: "12px",
            background: "#fff",
            display: "block",
            margin: "0 auto",
          }}
        >
          <h2>
            <Link href="/how-to-order" style={{ color: "#1976d2", textDecoration: "underline" }}>
              How to order Jyotishavidya Readings
            </Link>
          </h2>
          <p>
            Click above to learn how to request your personalized Jyotishavidya reading from Himanshu Tiwari, including required information and contact details.
          </p>
        </HomeRow>
        <HomeRow
          imgSrc="/images/Time.jpg" // <-- Save your image as this path or update accordingly
          imgAlt="समय का महत्व समझें"
          leftContent={
            <>
              <h2 style={{ color: "#1976d2", marginBottom: 8 }}>Understand the value of time. समय का महत्व समझें</h2>
              <p style={{ fontSize: 15, color: "#444" }}>
                "Understand the value of time."
              </p>
            </>
          }
        >
          <p>
            Every single moment you have is an opportunity to take action, improve yourself, or learn something new.<br /><br />
            By choosing to use your time wisely and intentionally today, you are actively building a stronger, brighter future for yourself tomorrow.<br /><br />
            Never forget that time is your most valuable and limited resource—use it well.
          </p>
        </HomeRow>
        
        <HomeRow
          imgSrc="/images/person.jpg" // <-- Save your image as this path or update accordingly
          imgAlt="वह व्यक्ति बनें जिसे आप खोजते हैं"
          leftContent={
            <>
              <h2 style={{ color: "#1976d2", marginBottom: 8 }}>Your Marriage and Relationship Success Starts With You! वह व्यक्ति बनें जिसे आप खोजते हैं</h2>
              <p style={{ fontSize: 15, color: "#444" }}>
                "Your Marriage and Relationship Success Starts With You: Become the person you seek. <br />"
              </p>
            </>
          }
        >
          <p>
            The best way to attract a truly loving, supportive, and dedicated partner is to first cultivate those very qualities within yourself.<br /><br />
            If you desire a partner who is kind, successful, and emotionally intelligent, focus your energy on becoming more kind, successful, and emotionally intelligent yourself.<br /><br />
            This process of self-improvement prepares you not only for marriage but also to maintain a strong and fulfilling relationship.
          </p>
        </HomeRow>
        
        <HomeRow
  imgSrc="/images/career.jpg" // <-- Save your relevant image as this path or update accordingly
  imgAlt="करियर D-9 से: हुनर ही सच्ची संपत्ति है"
  leftContent={
    <>
      <h2 style={{ color: "#1976d2", marginBottom: 8 }}>
        💰 Career in D-9: Skill is a True Form of Wealth
        💰 करियर D-9 से: हुनर ही सच्ची संपत्ति है
      </h2>
      <p style={{ fontSize: 15, color: "#444" }}>
        💰 Career in D-9: Skill is a True Form of Wealth
      </p>
    </>
  }
>
  <p>
    Your Profession, Career, and Vocation are primarily seen through the 10th house of the Navamsha Chart (D-9). Having a good skill or trade is a form of wealth; it supports you, feeds you, and provides stability. Even if you have held a variety of jobs, there is often a consistent theme running through your professional life.
  </p>
  <p>
    If the planet ruling the 10th Navamsha is weak or Combust in the main chart (D-1), your career fame and recognition will not be very strong, even if that planet is otherwise well-placed in the D-1 chart. However, the presence of <b>ANY planet</b> in the 10th house of the Navamsha Varga often leads to a well-defined and publicly recognized career. (A famous example is former President George Bush POTUS-43, see for a huge Simha planetary grouping in the 10th house of his D-9 chart.)
  </p>
</HomeRow>
        
        <HomeRow
          label="Full Stack Web App Services"
          imgSrc="/images/Himanshu-Tiwari.png"
          imgAlt="Himanshu Tiwari - Full Stack Developer"
          imgStyle={{
            width: "100%",
            maxWidth: 340,
            height: 220,
            maxHeight: 220,
            objectFit: "cover",
            borderRadius: "12px",
            background: "#fff",
            display: "block",
            margin: "0 auto",
          }}
        >
          <h2>Build Your Next Web App with Himanshu Tiwari</h2>
          <p>
            Himanshu Tiwari is a B.Tech + M.Tech computer science engineer, certified by IIT Mandi & Wiley, with 15+ years in professional software development services.
            He specializes in MERN-stack (MongoDB, Express.js, React, Node.js) development, delivering secure, scalable web
            applications for startups, spiritual platforms, and enterprise teams.
          </p>
          <ul>
            <li>Custom dashboards, portals, and marketplaces</li>
            <li>API integration, authentication, and cloud deployment</li>
            <li>Performance tuning, maintenance, and technical consulting</li>
          </ul>
          <div className="home-link-bar">
            <span className="home-link-label">Hire via Fiverr:</span>
            <a
              href="https://www.fiverr.com/himanshutiwari/write-any-script-in-html-css-javascript-jquery-php"
              target="_blank"
              rel="noopener noreferrer"
              className="home-link-chip"
            >
              Script & Web App Gig
            </a>
            <a
              href="https://www.fiverr.com/himanshutiwari"
              target="_blank"
              rel="noopener noreferrer"
              className="home-link-chip"
            >
              Fiverr Profile
            </a>
            <a
              href="https://www.linkedin.com/in/himanshu-tiwari-b32a602b/"
              target="_blank"
              rel="noopener noreferrer"
              className="home-link-chip"
            >
              LinkedIn
            </a>
            <a
              href="/documents/Himanshu_Tiwari.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="home-link-chip"
            >
              Résumé (PDF)
            </a>
          </div>
        </HomeRow>

        <HomeRow
          label="My Best Sellers"
          imgSrc="/images/bestsellers.jpeg"
          imgAlt="Himanshu Tiwari Best Seller Gigs"
          imgStyle={{
            width: "100%",
            maxWidth: 360,
            height: 340,
            maxHeight: 340,
            objectFit: "cover",
            borderRadius: "12px",
            background: "#fff",
            display: "block",
            margin: "0 auto",
          }}
        >
          <h2>Himanshu Tiwari: My Best-Selling Fiverr Readings</h2>
          <p>
            Trusted by clients worldwide for precise Vedic astrology and relationship insights. These services remain consistently booked because they deliver detailed, my own research-backed guidance drawing from:
          </p>
          <p className="best-seller-inline-cta">
            These two bestseller gigs stay open for bookings:
            <a
              href="https://www.fiverr.com/himanshutiwari/predict-your-future-using-vedic-astrology-jyotish"
              target="_blank"
              rel="noopener noreferrer"
            >
              🔮 Predict Your Future (Jyotish)
            </a>
            <span>·</span>
            <a
              href="https://www.fiverr.com/himanshutiwari/predict-and-forecast-information-about-your-spouse"
              target="_blank"
              rel="noopener noreferrer"
            >
              💍 Forecast Your Spouse Insights
            </a>
          </p>
          <ul style={{ marginTop: 10, paddingLeft: 20 }}>
            <li>Classical Vedic astrology (Jyotishavidya) principles</li>
            <li>Personalized horoscope analysis</li>
            <li>Relationship compatibility insights</li>
            <li>Career and finance guidance</li>
            <li>Spiritual growth and life purpose readings</li>
          </ul>
          <p style={{ marginTop: 10 }}>
            Every consultation brings fresh perspectives for life's ever-changing journey—because while certain moments in life pass and never return, new opportunities and challenges always emerge. Like humanity's Mars missions reaching unprecedented frontiers, your path forward holds possibilities you've never encountered before.
          </p>
          <p style={{ marginTop: 16, fontWeight: 600, lineHeight: 1.6 }}>
            <strong>
              “A trip to Mars normally takes about 6–9 months. Future human missions are expected in the late 2030s or early 2040s, and they will take the same travel time. The good news is that human travel to Mars is becoming more real every year. Rockets are getting stronger, life-support systems are improving, and both NASA and SpaceX are making fast progress. For the first time in history, humans have a real chance to walk on Mars in our lifetime.”
            </strong>
          </p>
          <p style={{ marginTop: 8, color: "#0d366e" }}>
            Follow the breakthroughs at{" "}
            <a href="https://www.nasa.gov/" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", textDecoration: "underline" }}>
              NASA
            </a>{" "}
            and{" "}
            <a href="https://www.spacex.com/" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", textDecoration: "underline" }}>
              SpaceX
            </a>{" "}
            as they bring Mars within reach.
          </p>
          <div className="best-seller-gallery">
            <figure className="best-seller-card">
              <a
                href="https://www.fiverr.com/himanshutiwari/predict-your-future-using-vedic-astrology-jyotish"
                target="_blank"
                rel="noopener noreferrer"
                className="home-link-chip best-seller-link"
              >
                🔮 Predict Your Future with Vedic Astrology (Jyotish)
              </a>
              <img src="/images/mars-valley.jpg" alt="Visit the Mars Valley poster" />
              <figcaption>Exclusive 2014 NASA Space Tour Poster</figcaption>
            </figure>
            <figure className="best-seller-card">
              <a
                href="https://www.fiverr.com/himanshutiwari/predict-and-forecast-information-about-your-spouse"
                target="_blank"
                rel="noopener noreferrer"
                className="home-link-chip best-seller-link"
              >
                💍 Predict & Forecast Information About Your Spouse
              </a>
              <img src="/images/mars-spacecraft.jpg" alt="Mars mission spacecraft" />
              <figcaption>Mars mission spacecraft</figcaption>
            </figure>
          </div>
        </HomeRow>

        <HomeRow
          label="Jyotisha Topics"
          imgSrc="/images/jyotisha-topics.jpg"
          imgAlt="Jyotisha overview"
        >
          <h2>
            <a
              href="https://barbarapijan.com/bpa/bAstrHom.htm"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1976d2", textDecoration: "underline" }}
            >
              Explore Jyotisha Topics
            </a>
          </h2>
          <ul style={{ paddingLeft: 20, lineHeight: 1.6 }}>
            <li>
              <a href="https://barbarapijan.com/bpa/Graha/1Graha_mainpage.htm" target="_blank" rel="noopener noreferrer">
                9 Graha = 7 classical planets plus Rahu–Ketu
              </a>
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Rashi_Lagna/1Rashi_MainPage.htm" target="_blank" rel="noopener noreferrer">
                12 Rashi = 12 zodiacal signs
              </a>
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Bhava/0_Bhava_mainpage.htm" target="_blank" rel="noopener noreferrer">
                12 Bhava = 12 houses
              </a>
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Amsha/karaka_bhava_NamaAdhipati.htm" target="_blank" rel="noopener noreferrer">
                Names of the 12 houses in Sanskrit and English
              </a>
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/bAstrHom.htm#twenty-seven%20nakshtras" target="_blank" rel="noopener noreferrer">
                27 Nakshatra (lunar constellations)
              </a>
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Graha/Chandra/Chandra_index_27_nakshatra.htm" target="_blank" rel="noopener noreferrer">
                Chandra in 27 Nakshatra
              </a>
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/Graha/Chakra_planets.htm" target="_blank" rel="noopener noreferrer">
                Chakra references
              </a>
            </li>
            <li>
              <a href="https://barbarapijan.com/bpa/VimshottariDasha/1VimshottariDasha_mainpage.htm" target="_blank" rel="noopener noreferrer">
                Vimshottari Dasha Timeline
              </a>
            </li>
          </ul>
        </HomeRow>
        <HomeRow
          label="27 Nakshatra"
          imgSrc="/images/nakshatra-wheel.png"
          imgAlt="Lunar houses"
        >
          <h2>
            <a
              href="https://barbarapijan.com/bpa/bAstrHom.htm#twenty-seven%20nakshtras"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1976d2", textDecoration: "underline" }}
            >
              27 Nakshatra — lunar houses / lunar constellations
            </a>
          </h2>
          <ol style={{ paddingLeft: 20, lineHeight: 1.6 }}>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/01ashvini.htm" target="_blank" rel="noopener noreferrer">Aśvini – Dasra</a></li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/02bharani.htm" target="_blank" rel="noopener noreferrer">Bharani – Yamuna</a></li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/03krittika.htm" target="_blank" rel="noopener noreferrer">Kṛttikā – Pleiades</a></li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/04rohini.htm" target="_blank" rel="noopener noreferrer">Rohiṇī – Aldebaran</a></li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/05mrigashira.htm" target="_blank" rel="noopener noreferrer">Mrigashiras – Invaka</a></li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/06ardra.htm" target="_blank" rel="noopener noreferrer">Arudra – Betelgeuse</a></li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/07punarvasu.htm" target="_blank" rel="noopener noreferrer">Punarvasu – Yamaka</a></li>
            <li><a href="https://aheadterra.com/17" target="_self" rel="noopener noreferrer">Pushya – Sidhya </a> - Ever Progressing Pushya</li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/09azlesa.htm" target="_blank" rel="noopener noreferrer">Aśleṣa – Naga</a></li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/10magha.htm" target="_blank" rel="noopener noreferrer">Magha – Regulus</a></li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/11purvaphalguni.htm" target="_blank" rel="noopener noreferrer">Pūrvaphalgunī – Yonī</a></li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/12uttaraphalguni.htm" target="_blank" rel="noopener noreferrer">Uttaraphalgunī – Aryaman</a></li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/13hasta.htm" target="_blank" rel="noopener noreferrer">Hasta – Savitri</a></li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/14chitra.htm" target="_blank" rel="noopener noreferrer">Chitra – Spica</a></li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/15swati.htm" target="_blank" rel="noopener noreferrer">Svati – Arcturus</a></li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/16visaka.htm" target="_blank" rel="noopener noreferrer">Viśākha – Rādhā</a></li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/17anuradha.htm" target="_blank" rel="noopener noreferrer">Anuradha – Maitreya</a></li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/18jyestha.htm" target="_blank" rel="noopener noreferrer">Jyeṣṭha – Antares</a></li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/19mula.htm" target="_blank" rel="noopener noreferrer">Mula – Nirṛti</a></li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/20purvazadha.htm" target="_blank" rel="noopener noreferrer">Pūrvāṣāḍhā – Apah</a></li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/21uttarazadha.htm" target="_blank" rel="noopener noreferrer">Uttarāṣāḍha – Vaishva</a></li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/22shravana.htm" target="_blank" rel="noopener noreferrer">Śrāvaṇa – Hari</a></li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/23dhaniztha.htm" target="_blank" rel="noopener noreferrer">Dhaniṣṭha – Delphinus</a></li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/24shatataraka.htm" target="_blank" rel="noopener noreferrer">Sadachbia – Varuna</a></li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/25purvabhadra.htm" target="_blank" rel="noopener noreferrer">Pūrvābhādra – Pegasus</a></li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/26uttarabhadra.htm" target="_blank" rel="noopener noreferrer">Uttarabhadra – Andromeda</a></li>
            <li><a href="https://barbarapijan.com/bpa/Nakshatra_radical/27revati.htm" target="_blank" rel="noopener noreferrer">Revatī – Pushana</a></li>
          </ol>
        </HomeRow>
        <HomeRow
          imgSrc="/images/signup-reminder.jpg"
          imgAlt="Join AheadTerra"
        >
          <h2>Ready to request your reading?</h2>
          <p>Log in to save your birth details, track delivery dates, and message Himanshu directly.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="profile-btn" onClick={handlePrimaryCta}>Access Services</button>
            <button className="profile-btn profile-btn-outline" onClick={() => handleAuth("signup")}>Create account</button>
          </div>
        </HomeRow>
      </div>

      {!loggedInUser && showSignupReminder && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 16,
            width: "min(420px, calc(100% - 32px))",
            zIndex: 1000,
            padding: "18px 20px",
            borderRadius: 12,
            background: "linear-gradient(135deg, #e0f2ff 0%, #f5fbff 100%)",
            border: "1px solid #b3e0ff",
            boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
          }}
        >
          <button
            onClick={handleDismissReminder}
            style={{
              border: "none",
              background: "transparent",
              fontSize: 18,
              cursor: "pointer",
              color: "#4a6071",
              float: "right",
            }}
            aria-label="Dismiss reminder"
          >
            ×
          </button>
          <strong style={{ color: "#0d5cab", fontSize: "1rem" }}>Stay in sync with AheadTerra</strong>
          <p style={{ margin: "6px 0 12px 0", color: "#24445a" }}>
            Sign up, log in, or continue with Google to access personalized Jyotishavidya services.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Link href="/signup">
              <button className="profile-btn profile-btn-outline" style={{ flex: 1 }}>Sign up</button>
            </Link>
            <Link href="/login">
              <button className="profile-btn profile-btn-outline" style={{ flex: 1 }}>Log in</button>
            </Link>
            <button
              className="profile-btn profile-btn-google-blue"
              style={{ width: "100%" }}
              onClick={() => signIn("google", { callbackUrl: "https://aheadterra.com/how-to-order" })}
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google logo"
                className="profile-google-logo"
              />
              Continue with Google
            </button>
          </div>
        </div>
      )}
    </main>
  );
}