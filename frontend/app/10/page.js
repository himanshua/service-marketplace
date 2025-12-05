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
              justifyContent: "flex-start", // was "center"
            }}
          >
            <img
              src="/images/First.png"
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
            <h2 style={{ color: "#0d47a1", margin: 0 }}>1st House – Lagna / Tanu Bhava</h2>
            <p style={{ margin: 0, color: "#555" }}>
              Embodied identity, vitality, complexion, and the first impression you cast.
            </p>
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
              It is the point of sunrise in every chart and sets the tone for how you meet the world. Or how your circle perceives you at first glance.
              Like Lord Rama is seen as very soft swabhav (nature) in Ramayana.
              This line is from Goswami Tulsidas's Ramcharitmanas.
              Meaning: Lord Ram's swa-bhav (inherent nature) is extremely gentle, compassionate, and tender.
              This line describes how Ram's natural disposition and temperament are soft, kind, and merciful - that his swabhav is free from harshness or cruelty and is filled with immense love and gentleness towards his devotees.
              As Lord Rama has Soft Cancer rising Swa/First Bhava in his natal chart. With Moon in own sign with exalted Jupiter in his Swa/First Bhavs.
              The Lagna lord (Ascendant ruler) is a key indicator of your physical constitution, personality imprint, and overall life path.
              A strong Lagna lord across varga charts often signals robust health, charisma, and resilience.
              Lagna or the First House shows success — it means chal paṛnā, the ability to rise and move forward in life. The planet placed here and ruler of this house will help native to move forwaed!            </p>
            <figure style={{ margin: "0 0 18px 0", textAlign: "center" }}>
              <img
                src="/images/Rama.JPG"
                alt="Birth chart of Lord Rama highlighting Lagna"
                style={{
                  width: "100%",
                  maxWidth: 360,
                  height: "auto",
                  borderRadius: 12,
                  boxShadow: "0 12px 26px rgba(0,0,0,0.18)",
                }}
              />
              <figcaption style={{ marginTop: 10, fontSize: 14, color: "#4a6071" }}>
                Birth chart of Lord Rama — note the two most benefic planets (Moon and exalted Jupiter) blessing his Swa Bhava / First House.
              </figcaption>
            </figure>
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
