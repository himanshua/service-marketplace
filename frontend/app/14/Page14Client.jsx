"use client";

import "../globals.css";
import "../profile/profile.css";
import UniversalShareBar from "../components/UniversalShareBar";

export default function Page14Client() {
  const shareChoices = ["14-house5"];
  const shareBaseUrl = "https://aheadterra.com/14";
  const shareImages = {
    "14-house5": {
      label: "5th House – Putra Bhava",
      image: "https://aheadterra.com/images/putra.jpg",
      description: "Creativity, children, intelligence, learning, romance, and self-expression.",
      url: "https://aheadterra.com/14",
    }
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
            <img
              src="/images/putra.jpg"
              alt="Putra Bhava – 5th House"
              style={{
                width: "100%",
                maxWidth: 320,
                height: 220,
                objectFit: "cover",
                borderRadius: 12,
                boxShadow: "0 12px 26px rgba(0,0,0,0.18)",
              }}
            />
            <h2 style={{ color: "#0d47a1", margin: 0 }}>5th House – Putra Bhava (पंचम भाव)</h2>
            <p style={{ margin: 0, color: "#555" }}>
              Creativity, children, intelligence, learning, romance, and self-expression.
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
            <h1>Fifth House (Putra Bhava) in Astrology: पंचम भाव</h1>
            <p style={{ color: "#4a6071", lineHeight: 1.7 }}>
              Putra / पुत्र = child, offspring, creation; पुत्र, संतान, रचना, सृजन।
            </p>
            <p style={{ color: "#274153", lineHeight: 1.6 }}>
              The Fifth House governs creativity, children, intelligence, learning, romance, and self-expression. It is the house of joy, play, and the fruits of past actions.<br />
              रचनात्मकता, संतान, बुद्धि, शिक्षा, प्रेम, और आत्म-अभिव्यक्ति का भाव।
            </p>
            <h2>Keywords & Concepts</h2>
            <ul style={{ marginLeft: 20, color: "#1f2a44" }}>
              <li>Children – संतान – santān</li>
              <li>Creativity – सृजन – srijan</li>
              <li>Intelligence – बुद्धि – buddhi</li>
              <li>Learning – अध्ययन – adhyayan</li>
              <li>Romance – प्रेम – prem</li>
              <li>Self-expression – आत्म-अभिव्यक्ति – atma-abhi-vyakti</li>
              <li>Past Life Merit – पूर्व पुण्य – purva punya</li>
              <li>Speculation – सट्टा – satta</li>
              <li>Play & Games – खेल – khel</li>
              <li>Joy – आनंद – anand</li>
              <li>Mantra/Knowledge – मंत्र/ज्ञान – mantra/jnana</li>
            </ul>
            <h2>Putra (पुत्र) & Srijan (सृजन)</h2>
            <p>
              <strong>Putra (पुत्र)</strong><br />
              <em>Pu + Tra</em><br />
              <strong>Pu</strong> = to purify<br />
              <strong>Tra</strong> = to protect<br />
              👉 <strong>Putra</strong> = one who purifies and protects the lineage → child, offspring.
            </p>
            <p>
              <strong>Srijan (सृजन)</strong><br />
              <em>Sri + Jan</em><br />
              <strong>Sri</strong> = to create<br />
              <strong>Jan</strong> = to be born<br />
              👉 <strong>Srijan</strong> = the act of creation → creativity, innovation.
            </p>
            <p style={{ marginTop: 12, fontStyle: "italic", color: "#0d47a1" }}>
              ✨ In simple words:<br />
              <strong>Putra</strong> = your creations (what you bring into the world)<br />
              <strong>Srijan</strong> = your creative power (how you express yourself)
            </p>
            <h2>Lord Rama’s Fifth House Example</h2>
            <p>
              In Lord Rama’s birth chart, the 5th house (Scorpio) represents his intelligence, devotion, and the blessings of children. The strength of this house is reflected in his wisdom, his devotion to dharma, and his role as a father. The 5th house highlights the importance of creativity, learning, and the fruits of one’s actions.
            </p>
            <figure style={{ margin: "0 0 12px 0", textAlign: "center" }}>
              <img
                src="/images/Rama5thHouse.jpg"
                alt="Birth chart of Lord Rama highlighting Fifth House"
                style={{
                  width: "100%",
                  maxWidth: 360,
                  height: "auto",
                  borderRadius: 12,
                  boxShadow: "0 12px 26px rgba(0,0,0,0.18)",
                }}
              />
              <figcaption style={{ marginTop: 10, fontSize: 14, color: "#4a6071" }}>
                Lord Rama’s 5th house (Scorpio) shows his intelligence, creativity, and blessings of children.
              </figcaption>
            </figure>
            <h2>Fifth House + Creativity & Children</h2>
            <p>
              Planets in Putra Bhava determine your creativity, intelligence, relationship with children, and capacity for joy. Benefics bring talent, happiness, and good fortune; malefics can cause challenges in learning, romance, or with children.
            </p>
            <h2>🌟 Example of Strong Fifth House</h2>
            <p>
              <strong>Person with a strong 5th house:</strong> Highly creative, intelligent, enjoys learning and teaching, has a joyful approach to life, and is blessed with talented children or creative projects.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}