"use client";

import "../globals.css";
import "../profile/profile.css";
import UniversalShareBar from "../components/UniversalShareBar";

export default function Page12Client() {
  // Only include the share item key(s) here, not platform names!
  const shareChoices = ["12-house3"];
  const shareBaseUrl = "https://aheadterra.com/12";
  const shareImages = {
    "12-house3": {
      label: "3rd House – Sahaja Bhava",
      image: "/images/sahaj1.png",
      description: "Effort, courage, skills, siblings, and progress through one’s own actions.",
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
              src="/images/sahaj1.png"
              alt="Sahaja Bhava – 3rd House"
              style={{
                width: "100%",
                maxWidth: 320,
                height: 220,
                objectFit: "cover",
                borderRadius: 12,
                boxShadow: "0 12px 26px rgba(0,0,0,0.18)",
              }}
            />
            <h2 style={{ color: "#0d47a1", margin: 0 }}>3rd House – Sahaja Bhava (तृतीय भाव)</h2>
            <p style={{ margin: 0, color: "#555" }}>
              Effort, courage, skills, siblings, and progress through one’s own actions.
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
            <h1>Third House (Sahaja Bhava) in Astrology: तृतीय भाव</h1>
            <p style={{ color: "#4a6071", lineHeight: 1.7 }}>
              Sahaj / सहज (सह + अज) = born together, natural, inborn; जन्म से साथ आया, स्वाभाविक, जन्मजात; सहज (सह + अज) = “सहजन्म, स्वभावतः, जन्मतः सिद्धम्。
            </p>
            <p style={{ color: "#274153", lineHeight: 1.6 }}>
              The Third House governs प्रयास (efforts), साहस (courage), कौशल (skills), and progress through one’s own actions. It is an Upachaya house that grows with time.<br />
              प्रयास, साहस, कौशल, और अपने कर्मों से प्रगति। यह उपचय भाव है जो समय के साथ बढ़ता है。
            </p>
            <h2>Keywords & Concepts</h2>
            <ul style={{ marginLeft: 20, color: "#1f2a44" }}>
              <li>Brothers / Siblings – भाई-बहन – भ्रातृ bhratru</li>
              <li>Co-borns – सहोदर – सहज / सहोत्त sahaja / sahotta</li>
              <li>Efforts – प्रयास, मेहनत – प्रयत्न prayatna</li>
              <li>Courage / Enterprise – साहस – पराक्रम parakrama</li>
              <li>Bold Action / Step Forward – आगे बढ़ना – विक्रम vikrama</li>
              <li>Step-by-step Process – क्रम – क्रम krama</li>
              <li>Style / Manner – तरीका, अंदाज़ – रीति riti</li>
              <li>Way of Doing Things – करने का ढंग – कार्य-पद्धति karya-paddhati</li>
              <li>Management – प्रबंधन – प्रबन्ध prabandha</li>
              <li>Manual Skill / Handcraft – हाथ का कौशल – हस्त-कौशल hasta-kaushala</li>
              <li>Mūlatrikoṇa Influence – मूलत्रिकोण गुण</li>
              <li>Prabandhu-sthāna – संबंधों/कार्य-व्यवहार का स्थान</li>
            </ul>
            <h2>Lord Rama’s Third House Example</h2>
            <p>
              In Lord Rama’s birth chart, the 3rd house (Virgo) represents co-borns and siblings. Its lord, Mercury, is posited in the house of gains (11th house), which signifies support, teamwork, and fulfillment through siblings. This astrological placement is reflected in the Ramayana, where Lord Rama’s younger brother, Lakshmana, played a crucial role in supporting him throughout his journey—demonstrating courage, loyalty, and tireless effort. The strength of the 3rd house and its connection to gains shows how sibling relationships can be a source of great help, progress, and success in life.
            </p>
            <figure style={{ margin: "0 0 12px 0", textAlign: "center" }}>
              <img
                src="/images/Rama.JPG"
                alt="Birth chart of Lord Rama highlighting Third House"
                style={{
                  width: "100%",
                  maxWidth: 360,
                  height: "auto",
                  borderRadius: 12,
                  boxShadow: "0 12px 26px rgba(0,0,0,0.18)",
                }}
              />
              <figcaption style={{ marginTop: 10, fontSize: 14, color: "#4a6071" }}>
                Lord Rama’s 3rd house (Virgo) and Mercury in the house of gains (11th) show sibling support and teamwork.
              </figcaption>
            </figure>
            <h2>Third House + Effort & Siblings</h2>
            <p>
              Planets in Sahaja Bhava determine your initiative, courage, manual skills, and sibling relationships. Benefics bring harmony, boldness, and skillfulness; malefics can cause rivalry, restlessness, or scattered efforts.
            </p>
            <h2>🌟 Example of Strong Third House</h2>
            <p>
              <strong>Person with a strong 3rd house:</strong> Bold, skillful, good communicator, and successful in self-driven projects. Often enjoys harmonious sibling relationships and excels in manual or creative arts.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}