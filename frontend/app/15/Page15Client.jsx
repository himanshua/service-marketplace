"use client";

import "../globals.css";
import "../profile/profile.css";
import UniversalShareBar from "../components/UniversalShareBar";

export default function Page15Client() {
  const shareChoices = ["15-house6"];
  const shareBaseUrl = "https://aheadterra.com/15";
  const shareImages = {
    "15-house6": {
      label: "6th House – Ari Bhava",
      image: "https://aheadterra.com/images/ari1.png",
      description: "Enemies, health, service, debts, daily work, litigation, and obstacles.",
      url: "https://aheadterra.com/15",
    },
  };

  return (
    <main className="profile-main home-main">
      <div className="home-container" style={{ flexDirection: "column", padding: 0 }}>
        <section
          style={{
            display: "flex",
            flexWrap: "wrap",
            minHeight: 260,
            background: "#f9f9f9",
            borderBottom: "2px solid #bdbdbd",
          }}
        >
          <div
            className="home-image-col"
            style={{
              flex: "0 0 360px",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              justifyContent: "flex-start",
            }}
          >
            <div style={{ display: "flex", gap: 12 }}>
              <img
                src="/images/ari1.png"
                alt="Ari Bhava – 6th House"
                style={{
                  width: "100%",
                  maxWidth: 160,
                  height: 110,
                  objectFit: "cover",
                  borderRadius: 12,
                  boxShadow: "0 12px 26px rgba(0,0,0,0.12)",
                }}
              />
              <img
                src="/images/ari2.jpg"
                alt="Ari Bhava – service & health"
                style={{
                  width: "100%",
                  maxWidth: 160,
                  height: 110,
                  objectFit: "cover",
                  borderRadius: 12,
                  boxShadow: "0 12px 26px rgba(0,0,0,0.12)",
                }}
              />
            </div>

            <h2 style={{ color: "#0d47a1", margin: 0 }}>6th House – Ari Bhava (षष्ठ भाव)</h2>
            <p style={{ margin: 0, color: "#555" }}>
              Enemies, illness, service, debts, daily work, litigation, and overcoming obstacles.
            </p>
          </div>

          <div
            className="home-content-col"
            style={{
              flex: "1 1 260px",
              padding: "24px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              justifyContent: "center",
            }}
          >
            <UniversalShareBar
              shareChoices={shareChoices}
              shareImages={shareImages}
              shareBaseUrl={shareBaseUrl}
            />

            <h1>Sixth House (Ari Bhava) in Astrology: षष्ठ भाव</h1>
            <p style={{ color: "#4a6071", lineHeight: 1.7 }}>
              Ari / अरि = enemy, opponent; also service, daily work, health challenges, and service-oriented duties.
            </p>
            <p style={{ color: "#274153", lineHeight: 1.6 }}>
              The Sixth House governs enemies, illnesses, debts, legal matters, service, and routine work. It shows where we face opposition and where we can build strength by disciplined effort.
            </p>

            <h2>Keywords & Concepts</h2>
            <ul style={{ marginLeft: 20, color: "#1f2a44" }}>
              <li>Enemies / Opponents – शत्रु – śatru</li>
              <li>Health / Illness – स्वास्थ्य / रोग – svasthya / roga</li>
              <li>Service / Jobs – सेवा / कार्य – seva / kārya</li>
              <li>Debts & Liabilities – ऋण – ṛṇa</li>
              <li>Litigation & Legal – न्याय, मुक़दमे – nyāya</li>
              <li>Daily Routine – दिनचर्या – dinacaryā</li>
              <li>Overcoming Obstacles – बाधा/विजय – bādhā/vijaya</li>
              <li>Enemies of the ego – अहंकार के विरोधी</li>
            </ul>

            <h2>Practical Notes</h2>
            <p>
              Planets in Ari Bhava indicate how you handle competition, work under pressure, health routines, and service. Benefics here can help you overcome enemies and recover from illness; malefics can create chronic challenges unless disciplined remedies or service is applied.
            </p>

            <h2>Lord Rama’s Sixth House Example</h2>
            <p>
              In Lord Rama’s chart, the 6th house placements show how he faced opponents and overcame obstacles through discipline and duty. The house also reflects service and challenges that shaped his capacity for endurance and righteousness.
            </p>

            <figure style={{ margin: "0 0 12px 0", textAlign: "center" }}>
              <img
                src="/images/Rama.JPG"
                alt="Lord Rama - Sixth House example"
                style={{
                  width: "100%",
                  maxWidth: 360,
                  height: "auto",
                  borderRadius: 12,
                  boxShadow: "0 12px 26px rgba(0,0,0,0.12)",
                }}
              />
              <figcaption style={{ marginTop: 10, fontSize: 14, color: "#4a6071" }}>
                Sixth house examples show challenges, service, and the path to overcoming enemies.
              </figcaption>
            </figure>

            <h2>🌟 Example of Strong Sixth House</h2>
            <p>
              <strong>Person with a strong 6th house:</strong> Handles competition well, recovers quickly from illness, is disciplined in work and service, and can successfully manage debts or legal disputes.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}