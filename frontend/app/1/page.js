"use client";
import "../globals.css";
import "../profile/profile.css";
import HowToOrderPage from "../how-to-order/page";
export default function Page1() {
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
            <h2 style={{ color: "#d35400", margin: 0 }}>☀️ Sun (Surya)</h2>
            <p style={{ margin: 0, color: "#555" }}>Radiant life-force, confidence, royal authority.</p>
            <img
              src="/images/Sun.jpeg"
              alt="Sun Surya"
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
            <h3 style={{ marginBottom: 12 }}>Surya Shows the Center-Stage Role</h3>
            <p style={{ marginBottom: 12 }}>
              Wherever Surya sits in your chart, that arena becomes a spotlight—the place you are asked to lead with dignity,
              purpose, and unwavering self-belief. Surya rules the heartbeat of identity, granting visibility and the courage to
              take charge.
            </p>
            <ul style={{ paddingLeft: 20, lineHeight: 1.6 }}>
              <li>Highlights leadership themes in the house it occupies.</li>
              <li>Reveals how you command respect and radiate authority.</li>
              <li>Guides the “why” behind your drive to be seen and heard.</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
