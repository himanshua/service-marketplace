import "../globals.css";
import "../profile/profile.css";

function HomeRow({ imgSrc, imgAlt, children }) {
  return (
    <section
      style={{
        display: "flex",
        flexWrap: "wrap",
        borderBottom: "2px solid #e0e7f5",
        background: "#fff",
        minHeight: 260,
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
      <div style={{ flex: "1 1 320px", padding: "24px 32px" }}>{children}</div>
    </section>
  );
}

export default function Page10() {
  return (
    <main className="profile-main home-main">
      <div className="home-container" style={{ flexDirection: "column", padding: 0 }}>
        <HomeRow imgSrc="/images/First.png" imgAlt="Lagna / Tanu Bhava">
          <h1 style={{ marginBottom: 12 }}>1st House – Lagna / Tanu Bhava / Swa Bhava / Identity / Who you truly are?

          </h1>
          <p style={{ color: "#4a6071", lineHeight: 1.7 }}>
            The First House describes your embodied identity: vitality, complexion, mannerisms, and the way life chapters begin. It is the point of sunrise in every chart and sets the tone for how you meet the world.
          </p>
          <ul style={{ paddingLeft: 20, lineHeight: 1.6, color: "#24334a" }}>
            <li><strong>Keywords:</strong> physical body, character, courage, head, personality imprint.</li>
            <li><strong>Lagna lord strength:</strong> wellness, stamina, charisma, and resilience track directly with how dignified the Lagna lord is across all varga.</li>
            <li><strong>Aspects & yogas:</strong> benefics bring confidence and vitality, while malefic pressure can trigger self-doubt, inflammation, or restless identity shifts.</li>
            <li><strong>Career hints:</strong> planets stationed here often mark lifelong vocations because the first house constantly broadcasts their themes.</li>
            <li><strong>Remedies:</strong> support the Lagna lord via mantra, color therapy, gemstones, and daily routines that honor the planet’s tattva.</li>
          </ul>
          <p style={{ marginTop: 18, color: "#60738b" }}>
            Study additional interpretations at{" "}
            <a
              href="https://barbarapijan.com/bpa/Bhava/1tanu_bhava.htm"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1976d2", textDecoration: "underline" }}
            >
              BarbaraPijan.com – Tanu Bhava
            </a>
            .
          </p>
        </HomeRow>
      </div>
    </main>
  );
}
