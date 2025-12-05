import "../globals.css";
import "../profile/profile.css";

export default function Page17() {
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
            <h2 style={{ color: "#0d47a1", margin: 0 }}>Pushyami – Ravana Samhitha Insights</h2>
            <p style={{ margin: 0, color: "#555" }}>Interpretations for planets in Pushya Nakshatra.</p>
            <img
              src="/images/pushya.jpg"
              alt="Pushya Nakshatra"
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
            <p style={{ marginBottom: 14, color: "#465a72" }}>
              Source:{" "}
              <a
                href="https://horasarvam.blogspot.com/2012/06/results-of-planets-in-pushyami.html"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1976d2", textDecoration: "underline" }}
              >
                horasarvam.blogspot.com – Ravana Samhitha Pushyami
              </a>
            </p>
            <ul style={{ paddingLeft: 20, lineHeight: 1.6, color: "#24334a" }}>
              <li><strong>Sun:</strong> good character, vāta ailments, stable mind, spouse health issues, misfortune via spouse.</li>
              <li><strong>Mars:</strong> intelligence, travel earnings, heavy effort with low gain, philosophical curiosity, mother’s health issues.</li>
              <li><strong>Mercury:</strong> great wealth, command over others, musical taste, average schooling.</li>
              <li><strong>Jupiter:</strong> wealth, intelligence, comforts, charity, strong family bonds.</li>
              <li><strong>Venus:</strong> business focus, frequent travel, sensuous yet unsettled mind, lives away from birthplace, livestock gains.</li>
              <li><strong>Saturn:</strong> ordinary status, selfish traits, poor health, weak teeth, dependency.</li>
              <li><strong>Rahu:</strong> poetic ability, moderate education, two marriages possible, research talent, sharp intellect, weak marital bliss.</li>
              <li><strong>Ketu:</strong> difficult placement; exile from homeland, loss of paternal wealth, chronic illness, low comforts, dubious company.</li>
            </ul>
            <p style={{ marginTop: 18, color: "#60738b" }}>
              Align Pushya insights with your Vimshottari dasha timeline for practical remedial planning.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
