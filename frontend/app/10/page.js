import "../globals.css";
import "../profile/profile.css";

export default function Page10() {
  return (
    <main className="profile-main home-main">
      <div className="home-container" style={{ flexDirection: "column", padding: 0 }}>
        <section
          style={{
            display: "flex",
            flexWrap: "wrap",
            minHeight: 260,
            background: "#fff",
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
              justifyContent: "center",
            }}
          >
            <h2 style={{ color: "#0d47a1", margin: 0 }}>1st House – Lagna / Tanu Bhava</h2>
            <p style={{ margin: 0, color: "#555" }}>
              Embodied identity, vitality, complexion, and the first impression you cast.
            </p>
            <img
              src="/images/lagna-wheel.jpg"
              alt="Lagna / Tanu Bhava"
              style={{
                width: "100%",
                maxWidth: 320,
                height: 220,
                objectFit: "cover",
                borderRadius: 12,
                boxShadow: "0 12px 26px rgba(0,0,0,0.18)",
              }}
            />
          </div>
          <div
            className="home-content-col"
            style={{
              flex: "1 1 260px",
              padding: "24px 32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <p style={{ color: "#4a6071", lineHeight: 1.7, marginBottom: 16 }}>
              The First House describes your embodied identity: vitality, complexion, mannerisms, and the way life chapters begin.
              It is the point of sunrise in every chart and sets the tone for how you meet the world.
            </p>
            <ul style={{ paddingLeft: 20, lineHeight: 1.6, color: "#24334a" }}>
              <li><strong>Keywords:</strong> physical body, character, courage, head, personality imprint.</li>
              <li><strong>Lagna lord strength:</strong> wellness, stamina, charisma, and resilience follow the Lagna lord’s dignity across varga.</li>
              <li><strong>Aspects & yogas:</strong> benefics add confidence and vitality; malefics may stir self-doubt or inflammation.</li>
              <li><strong>Career hints:</strong> planets stationed here broadcast their themes, often defining lifelong vocations.</li>
              <li><strong>Remedies:</strong> support the Lagna lord via mantra, color therapy, gemstones, and routines aligned with its tattva.</li>
            </ul>
            <p style={{ marginTop: 18, color: "#60738b" }}>
              Study more at{" "}
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
          </div>
        </section>
      </div>
    </main>
  );
}
