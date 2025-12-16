"use client";

import "../globals.css";
import "../profile/profile.css";
import UniversalShareBar from "../components/UniversalShareBar";
import React, { useState } from "react";
import { shareItems } from "../share/data"; // add this near top with other imports


export default function Page15Client() {
  const shareChoices = ["15-house6-a", "15-house6-b"];
  const shareBaseUrl = "https://aheadterra.com/15";
  const sharePageBase = "https://aheadterra.com/share"; // use /share/<slug> for readable links
  const shareImages = {
    "15-house6-a": {
      label: "6th House – Ari Bhava (Image 1)",
      image: "https://aheadterra.com/images/ari.png",
      description: "Enemies, health, service, debts, daily work, litigation, and obstacles.",
      slug: "ari-bhava",
      url: sharePageBase + "/ari-bhava",
    },
    "15-house6-b": {
      label: "6th House – Ari Bhava (Image 2)",
      image: "https://aheadterra.com/images/ari1.png",
      description: "Alternate illustration for Ari Bhava — service & health.",
      slug: "ari-bhava-2",
      url: sharePageBase + "/ari-bhava-2",
    },
  };

  const [selected, setSelected] = useState("15-house6-a"); // default to ari (image A)

  // --- INSERT: small helpers (place BEFORE return) ---
  async function fetchFileFromUrl(url, name) {
    const res = await fetch(url);
    const blob = await res.blob();
    const ext = (url.split(".").pop() || "png").split("?")[0];
    return new File([blob], `${name}.${ext}`, { type: blob.type });
  }

  async function shareSelected() {
    try {
      const item = shareImages[selected];
      const file = await fetchFileFromUrl(item.image, selected);

      // Resolve a human-readable slug:
      const slug =
        item.slug || // prefer slug on local shareImages entry
        Object.keys(shareItems).find((k) => {
          // try to match by image URL if no slug
          const si = shareItems[k];
          return si && (si.image === item.image || (`https://aheadterra.com${si.image}`) === item.image);
        }) ||
        selected;

      const shareUrl = `${sharePageBase}/${encodeURIComponent(slug)}`;

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: item.label,
          text: item.description + "\n\n" + shareUrl,
          files: [file],
          url: shareUrl,
        });
        return;
      }

      window.open(shareUrl, "_blank", "noopener");
      return;
    } catch (e) {
      console.error(e);
    }

    window.open(shareImages[selected].image, "_blank", "noopener");
  }

  async function shareBoth() {
    try {
      const keys = ["15-house6-a", "15-house6-b"];
      const files = await Promise.all(
        keys.map((k) => fetchFileFromUrl(shareImages[k].image, k))
      );

      const shareSlug = keys.map((k) => shareImages[k].slug || k).join("-");
      const shareUrl = `${sharePageBase}/${encodeURIComponent(shareSlug)}`;

      const shareText = `Ari Bhava illustrations\n\n${shareUrl}`;

      if (navigator.canShare && navigator.canShare({ files })) {
        await navigator.share({
          title: "6th House – Ari Bhava (Images)",
          text: shareText,   // include link in text for reliability
          files,
          url: shareUrl,
        });
        return;
      }
    } catch (e) {
      console.error(e);
    }

    window.open(`${sharePageBase}/${encodeURIComponent("ari-bhava,ari-bhava-2")}`, "_blank", "noopener");
    window.open(shareImages["15-house6-a"].image, "_blank", "noopener");
    window.open(shareImages["15-house6-b"].image, "_blank", "noopener");
  }
  // --- END INSERT ---

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
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-start", justifyContent: "center" }}>
              <img
                src="/images/ari.png"
                alt="Ari Bhava – 6th House"
                style={{
                  width: "100%",
                  maxWidth: 360,     // increased size
                  height: "auto",    // preserve aspect ratio (portrait works)
                  objectFit: "cover",
                  borderRadius: 12,
                  boxShadow: "0 12px 26px rgba(0,0,0,0.12)",
                }}
              />
              <img
                src="/images/ari1.png"
                alt="Ari Bhava – service & health"
                style={{
                  width: "100%",
                  maxWidth: 360,     // increased size
                  height: "auto",    // preserve aspect ratio
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
The Sixth House (Ari Bhava) governs enemies, competition, debt, illness, and the daily service or work environment. Uniquely, this is a dusthāna where malefic planets such as Mars, Saturn, Rahu, or Ketu often perform well. Their aggressive and resilient nature helps the native fight enemies, overcome litigation, manage debt, and resist disease, making them effective conquerors of challenges.
In contrast, strong benefic planets like Jupiter or the Moon may struggle here, sometimes increasing sensitivity to illness or making it harder to overcome opposition unless they are very well placed or strongly aspected. Venus, however, is often considered a functional benefic exception in the 6th house—especially when unafflicted—supporting harmony at work, recovery, and service without weakening competitive strength.</p>

            <h2>Lord Rama’s Sixth House Example</h2>
            <p>
              In Lord Rama’s chart, the 6th house placements show how he faced opponents and overcame obstacles through discipline and duty. The house also reflects service and challenges that shaped his capacity for endurance and righteousness.
            </p>

            <p>
              Lord Rama’s 6th bhava ruler is <strong>Jupiter</strong>, which also rules his <strong>9th house</strong> of higher learning. On one hand, as 9th lord Jupiter grants higher knowledge, status, and learned teachers: his father King Dasharatha, and gurus Vashishtha (family priest and educator), Vishvamitra (who taught advanced martial arts and divine weaponry), Agastya (who provided celestial weapons), Bharadwaj (who offered sanctuary and guidance during exile), and Valmiki (who later taught his sons Lava and Kusha and recorded the Ramayana). This role links Jupiter to kingship, respect from brahmins and sages, and the transmission of Vedic wisdom.
            </p>

            <p>
              On the other hand, as exalted 6th lord Jupiter brings strong enemies and obstacles: powerful adversaries such as Ravana, Kumbhakarna, Indrajit, Khara, Dushana, Tataka, and Maricha; and major trials like Kaikeyi’s fourteen‑year exile, Sita’s abduction, the ocean barrier, and the boons protecting his foes. Jupiter’s dual role (9th and exalted 6th lord in lagna) explains why he both attracts learned allies and faces formidable enemies, and why higher learning and dharma ultimately help overcome those challenges. Jupiter’s drishti to the 7th house also supports brahmacharya tendencies, especially when Mangal occupies the 7th.
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

            <h2>🛠️ Sixth House + Health, Debt & Service</h2>
            <p>
            Planets in Ripu Bhava (the Sixth House) shape experiences related to illness, debt, enemies, service, and daily routines. Malefic planets often perform well here, helping one confront enemies, overcome debt and legal issues, and build resilience against disease. Strong benefic planets may sometimes struggle in this house, potentially increasing sensitivity to illness or difficulty overcoming opposition, unless very well placed or supported by aspects.            </p>

            <h3>Essence</h3>
            <p>
              👉 The 6th house does not break you—it trains you.<br />
              👉 यह भाव गिराता नहीं, गिराने की शक्ति देता है。
            </p>

           

            <h3>Ari (अरि)</h3>
            <p>
              A + Ri<br />
              A = against<br />
              Ri = rise / movement<br />
              👉 Ari = one who rises against → enemy, rival, opposition
            </p>

            <h3>Śatru (शत्रु)</h3>
            <p>
              Śa + Tru<br />
              Śa = harm<br />
              Tru = restrain / bind<br />
              👉 Śatru = one who harms but can be restrained → controllable enemy
            </p>

            <h3>Ripu (रिपु)</h3>
            <p>
              Ri + Pu<br />
              Ri = deceive / corrupt<br />
              Pu = spoil / weaken<br />
              👉 Ripu = corrupting enemy → inner vices, hidden opposition
            </p>

            <h3>Zatru / Śatru (जत्रु / शत्रु)</h3>
            <p>
              Za / Śa = strike / harm<br />
              Tru = restrain<br />
              👉 Zatru / Śatru = harmful opponent → destroyer of stability
            </p>

            <h3>Roga (रोग)</h3>
            <p>
              Ro + Ga<br />
              Ro = blockage<br />
              Ga = flow / movement<br />
              👉 Roga = blocked flow → illness, disease
            </p>

            <h3>Vyādhi (व्याधि)</h3>
            <p>
              Vi + Ādhi<br />
              Vi = spread<br />
              Ādhi = affliction<br />
              👉 Vyādhi = spreading affliction → chronic disease
            </p>

            <h3>Kṣata (क्षत)</h3>
            <p>
              Kṣa + Ta<br />
              Kṣa = damage<br />
              Ta = state / condition<br />
              👉 Kṣata = damaged state → wound, injury, trauma
            </p>

            <h3>Girāna (गिराना)</h3>
            <p>
              Gi + Rā + Na<br />
              Gi = fall<br />
              Rā = force<br />
              Na = act<br />
              👉 Girāna = act of causing a fall → defeat, subdue
            </p>

            <h3>Ṛṇa (ऋण)</h3>
            <p>
              Ṛ + Ṇa<br />
              Ṛ = duty<br />
              Ṇa = bond<br />
              👉 Ṛṇa = bonded duty → debt, karmic obligation
            </p>

            <h3>Sevā (सेवा)</h3>
            <p>
              Se + Vā<br />
              Se = dedication<br />
              Vā = action<br />
              👉 Sevā = dedicated action → service, daily work
            </p>

            <h3>Yuddha (युद्ध)</h3>
            <p>
              Yu + Dha<br />
              Yu = join / engage<br />
              Dha = hold firm<br />
              👉 Yuddha = engaged struggle → battle, competition, litigation
            </p>

            <h3>Ṣaṭkoṇa (षट्कोण)</h3>
            <p>
              Ṣaṭ + Koṇa<br />
              Ṣaṭ = six<br />
              Koṇa = angle<br />
              👉 Ṣaṭkoṇa = sixth angle → house of conflict and correction
            </p>

            <h3>Śatrur-gṛha (शत्रुर्गृह)</h3>
            <p>
              Śatru + Gṛha<br />
              Śatru = enemy<br />
              Gṛha = house<br />
              👉 Śatrur-gṛha = house of enemies → Sixth House
            </p>

            <h3>Protective Power of the 6th House</h3>
            <p>
              👉 The 6th house protects against enemy, sickness, sorrow, and debt by giving resilience, discipline, and fighting spirit.<br />
              👉 यह भाव कष्ट से रक्षा करना सिखाता है।
            </p>

            <h3>Career & Work Significance</h3>
            <p>
              👉 The 6th house is very good for jobs and service, because it is 9th from the 10th Bhāva (fortune of career).<br />
              👉 इसलिए यह भाव नौकरी, सेवा, और मेहनत से सफलता देता है।
            </p>

            <h3>Essence</h3>
            <p>
              👉 The 6th house does not break you—it trains you.<br />
              👉 यह भाव गिराता नहीं, गिराने की शक्ति देता है。
            </p>

             {/* moved blocks inserted below */}

            <h2>🌟 Example of Strong Sixth House</h2>
            <p>
              <strong>Person with a strong 6th house:</strong> Highly disciplined, excels in their job or service, successfully manages debts or overcomes legal opposition, and is often dedicated to a health regimen or helping the marginalized. They have the power to conquer their enemies (internal or external).
            </p>

            <h2>✨ In simple words — 6th House (षष्ठ भाव)</h2>
            <p style={{ color: "#274153", lineHeight: 1.6 }}>
              <strong>Good first (Positive nature):</strong><br />
              👉 The 6th house gives strength through struggle and protection through discipline.<br />
              👉 It creates fighters, healers, problem-solvers, and survivors—such as surgeons, doctors, lawyers, police, soldiers, athletes, and service professionals.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}