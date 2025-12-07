"use client";
// filepath: c:\Users\Dell\Documents\ServiceMarketplace\frontend\app\17\Page17Client.jsx
import "../globals.css";
import "../profile/profile.css";

function HomeRow({ imgSrc, imgAlt, children }) {
  return (
    <section
      style={{
        display: "flex",
        flexWrap: "wrap",
        border: "2px solid #dfe4f0",
        borderRadius: 16,
        overflow: "hidden",
        background: "#fff",
        minHeight: 260,
        marginBottom: 18,
      }}
    >
      <div
        style={{
          flex: "0 0 360px",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: 16,
          borderRight: "2px solid #dfe4f0",
          background: "#f9fbff",
        }}
      >
        <img
          src={imgSrc}
          alt={imgAlt}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: 12,
            objectFit: "cover",
            boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
          }}
        />
      </div>
      <div
        style={{
          flex: "1 1 320px",
          padding: "24px 32px",
          borderLeft: "2px solid #dfe4f0",
          background: "#fff",
        }}
      >
        {children}
      </div>
    </section>
  );
}

export default function Page17Client() {
  return (
    <main className="profile-main home-main">
      <div className="home-container" style={{ flexDirection: "column", padding: 0 }}>
        <HomeRow imgSrc="/images/pushya.jpg" imgAlt="Pushya Nakshatra">
          <h1 style={{ marginBottom: 12 }}>
            Ravana Samhitha – Results of Planets in Pushyami (Pushya Nakshatra)
          </h1>
          <p style={{ marginBottom: 18, color: "#465a72", lineHeight: 1.6 }}>
            Source: Pushya is ruled by Saturn, lord of Pushya is Jupiter and symbolized by the udder of a cow...
          </p>
          <ul style={{ paddingLeft: 20, lineHeight: 1.6 }}>
            <li>
              <strong>Sun in Pushyami</strong> – Good character, a light vāta-type nature, a calm and steady mind, and some spouse-related challenges that teach you patience, strength, and personal growth over time.
            </li>
            <li>
              <strong>Mars in Pushyami</strong> – intelligence, earnings through travel, intense effort yet low returns, philosophical interests, health issues for mother.
            </li>
            <li>
              <strong>Mercury in Pushyami</strong> – huge wealth, authority over many, musical inclination, modest formal education.
            </li>
            <li>
              <strong>Jupiter in Pushyami</strong> – wealth, intelligence, luxurious comforts, charitable personality, strong family harmony.
            </li>
            <li>
              <strong>Venus in Pushyami</strong> – business focus, frequent journeys, sensuous nature, unstable intellect, living away from birthplace, livestock-related fortune.
            </li>
            <li>
              <strong>Saturn in Pushyami</strong> – average status, self-serving behavior, chronic ill health, weak teeth, dependence on others.
            </li>
            <li>
              <strong>Rahu in Pushyami</strong> – poetic flair, moderate education, possibility of two marriages, research talent, exceptional intellect, limited marital bliss.
            </li>
            <li>
              <strong>Ketu in Pushyami</strong> – adverse placement; native lives away from homeland, erodes paternal wealth, long illnesses, low comforts, associations with unworthy company.
            </li>
          </ul>
          <p style={{ marginTop: 18, color: "#60738b" }}>
            Pushyami (Pushya) remains a celebrated lunar mansion; align these planetary results with your Vimshottari timeline for deeper Jyotisha insights.
          </p>
        </HomeRow>
      </div>
    </main>
  );
}