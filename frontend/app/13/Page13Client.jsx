"use client";

import "../globals.css";
import "../profile/profile.css";
import UniversalShareBar from "../components/UniversalShareBar";

export default function Page13Client() {
  const shareChoices = ["13-house4"];
  const shareBaseUrl = "https://aheadterra.com/13";
  const shareImages = {
    "13-house4": {
      label: "4th House – Sukha Bhava",
      image: "https://aheadterra.com/images/sukha.jpg",
      description: "Home, happiness, mother, property, inner peace, and emotional foundation.",
      url: "https://aheadterra.com/13",
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
              src="/images/sukha.jpg"
              alt="Sukha Bhava – 4th House"
              style={{
                width: "100%",
                maxWidth: 320,
                height: 220,
                objectFit: "cover",
                borderRadius: 12,
                boxShadow: "0 12px 26px rgba(0,0,0,0.18)",
              }}
            />
            <h2 style={{ color: "#0d47a1", margin: 0 }}>4th House – Sukha Bhava (चतुर्थ भाव)</h2>
            <p style={{ margin: 0, color: "#555" }}>
              Home, happiness, mother, property, inner peace, and emotional foundation.
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
            <h1>Fourth House (Sukha Bhava) in Astrology: चतुर्थ भाव</h1>
            <p style={{ color: "#4a6071", lineHeight: 1.7 }}>
              Sukha / सुख = happiness, comfort, contentment; सुख, संतोष, शांति, घर, माता।
            </p>
            <p style={{ color: "#274153", lineHeight: 1.6 }}>
              The Fourth House governs home, mother, property, inner peace, and emotional foundation. It is the base of one’s happiness and sense of belonging.<br />
              घर, माता, संपत्ति, आंतरिक शांति, और भावनात्मक आधार। यह सुख और संतोष का मूल स्थान है।
            </p>
            <h2>Keywords & Concepts</h2>
            <ul style={{ marginLeft: 20, color: "#1f2a44" }}>
              <li>Mother – माता – मातृ matr̥</li>
              <li>Home – घर – गृह griha</li>
              <li>Comfort – सुख – sukha</li>
              <li>Property – संपत्ति – sampatti</li>
              <li>Vehicle – वाहन – vahana</li>
              <li>Land – भूमि – bhūmi</li>
              <li>Peace of Mind – मन की शांति – man ki shanti</li>
              <li>Emotional Foundation – भावनात्मक आधार</li>
              <li>Roots/Heritage – जड़ें/वंश – jaḏen/vanśa</li>
              <li>Domestic Life – घरेलू जीवन – gharelu jeevan</li>
              <li>Heart – हृदय – hridaya</li>
              <li>Education (basic) – प्रारंभिक शिक्षा – prarambhik shiksha</li>
            </ul>
            <h2>Sampatti (सम्पत्ति) & Sukh (सुख)</h2>
            <p>
              <strong>Sampatti (सम्पत्ति)</strong><br />
              <em>Sam + Patti</em> (from root “pad / pattoti”)<br />
              <strong>Sam</strong> = well, complete, together<br />
              <strong>Patti / Pad</strong> = to obtain, to gain<br />
              👉 <strong>Sampatti</strong> = that which is well obtained → wealth, possessions, prosperity.
            </p>
            <p>
              <strong>Sukh (सुख)</strong><br />
              <em>Su + Kh</em><br />
              <strong>Su</strong> = good, pleasant<br />
              <strong>Kh</strong> = state, condition, space<br />
              👉 <strong>Sukh</strong> = a good state of being → happiness, comfort, inner peace.
            </p>
            <p style={{ marginTop: 12, fontStyle: "italic", color: "#0d47a1" }}>
              ✨ In simple words:<br />
              <strong>Sampatti</strong> = outer prosperity (what you have)<br />
              <strong>Sukh</strong> = inner happiness (how you feel)
            </p>
            <h2>Lord Rama’s Fourth House Example</h2>
            <p>
              In Lord Rama’s birth chart, the 4th house (Libra) represents his deep connection to home, mother, and inner peace. The strength of this house is reflected in his devotion to his mother Kaushalya, his sense of duty towards his homeland Ayodhya, and his ability to maintain inner calm and righteousness even in adversity. The 4th house highlights the importance of emotional stability and the nurturing influence of the mother in shaping one’s life.
            </p>
            <figure style={{ margin: "0 0 12px 0", textAlign: "center" }}>
              <img
                src="/images/Rama.JPG"
                alt="Birth chart of Lord Rama highlighting Fourth House"
                style={{
                  width: "100%",
                  maxWidth: 360,
                  height: "auto",
                  borderRadius: 12,
                  boxShadow: "0 12px 26px rgba(0,0,0,0.18)",
                }}
              />
              <figcaption style={{ marginTop: 10, fontSize: 14, color: "#4a6071" }}>
                Lord Rama’s 4th house (Libra) shows his deep connection to home, mother, and emotional foundation.
              </figcaption>
            </figure>
            <h2>Fourth House + Home & Happiness</h2>
            <p>
              Planets in Sukha Bhava determine your comfort, emotional stability, relationship with mother, and property matters. Benefics bring peace, prosperity, and strong roots; malefics can cause restlessness, lack of peace, or issues with home and mother.
            </p>
            <h2>🌟 Example of Strong Fourth House</h2>
            <p>
              <strong>Person with a strong 4th house:</strong> Enjoys a happy home life, strong bond with mother, emotional stability, and success in property or real estate. Finds comfort and peace within.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}