"use client";

import "../globals.css";
import "../profile/profile.css";
import UniversalShareBar from "../components/UniversalShareBar";
import React, { useState } from "react";
import { shareItems } from "../share/data";

export default function Page19Client() {
  const shareChoices = ["19-house9-a", "19-house9-b"];
  const shareBaseUrl = "https://aheadterra.com/19";
  const sharePageBase = "https://aheadterra.com/share";
  const shareImages = {
    "19-house9-a": {
      label: "9th House – Navam Bhava (Image 1)",
      image: "https://aheadterra.com/images/navam.jpg",
      description: "Luck, dharma, higher learning, long journeys, father and fortune.",
      slug: "navam-bhava",
      url: sharePageBase + "/navam-bhava",
    },
    "19-house9-b": {
      label: "9th House – Navam Bhava (Image 2)",
      image: "https://aheadterra.com/images/navam1.jpeg",
      description: "Alternate 9th house illustration — pilgrimage, philosophy, and higher studies.",
      slug: "navam-bhava-2",
      url: sharePageBase + "/navam-bhava-2",
    },
  };

  const [selected, setSelected] = useState("19-house9-a");

  async function fetchFileFromUrl(url, name) {
    const res = await fetch(url);
    const blob = await res.blob();
    const ext = (url.split(".").pop() || "jpg").split("?")[0];
    return new File([blob], `${name}.${ext}`, { type: blob.type });
  }

  async function shareSelected() {
    try {
      const item = shareImages[selected];
      const file = await fetchFileFromUrl(item.image, selected);

      const slug =
        item.slug ||
        Object.keys(shareItems).find((k) => {
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
      const keys = Object.keys(shareImages);
      const files = await Promise.all(keys.map((k) => fetchFileFromUrl(shareImages[k].image, k)));

      const shareSlug = keys.map((k) => shareImages[k].slug || k).join("-");
      const shareUrl = `${sharePageBase}/${encodeURIComponent(shareSlug)}`;

      const shareText = `Navam Bhava illustrations\n\n${shareUrl}`;

      if (navigator.canShare && navigator.canShare({ files })) {
        await navigator.share({
          title: "9th House – Navam Bhava (Images)",
          text: shareText,
          files,
          url: shareUrl,
        });
        return;
      }
    } catch (e) {
      console.error(e);
    }

    const fallbackKeys = Object.keys(shareImages);
    const fallbackSlugs = fallbackKeys.map((k) => shareImages[k].slug || k).join(",");
    window.open(`${sharePageBase}/${encodeURIComponent(fallbackSlugs)}`, "_blank", "noopener");
    fallbackKeys.forEach((k) => {
      const img = shareImages[k].image;
      if (img) window.open(img, "_blank", "noopener");
    });
  }

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
                src="/images/navam.jpg"
                alt="Navam Bhava – 9th House"
                style={{
                  width: "100%",
                  maxWidth: 360,
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: 12,
                  boxShadow: "0 12px 26px rgba(0,0,0,0.12)",
                }}
              />
              <img
                src="/images/navam1.jpeg"
                alt="Navam Bhava – dharma & fortune"
                style={{
                  width: "100%",
                  maxWidth: 360,
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: 12,
                  boxShadow: "0 12px 26px rgba(0,0,0,0.12)",
                }}
              />
            </div>

            <h2 style={{ color: "#0d47a1", margin: 0 }}>9th House – Navam Bhava (नवम भाव)</h2>
            <p style={{ margin: 0, color: "#555" }}>
              Dharma, luck, higher learning, long journeys, father, and spiritual law.
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

            <h1>Ninth House (Navam Bhava) in Astrology: नवम भाव</h1>
            <p style={{ color: "#4a6071", lineHeight: 1.7 }}>
              <strong>Ninth House / नवम भाव</strong>
            </p>

            <ul style={{ marginLeft: 20, color: "#1f2a44", lineHeight: 1.6 }}>
              <li>Dharma, ethics, and higher purpose</li>
              <li>Luck, fortune, and benefic blessings</li>
              <li>Long-distance travel and pilgrimage</li>
              <li>Higher learning, philosophy, and religion</li>
              <li>Father, mentors, and auspicious guidance</li>
            </ul>

            <h2>Practical Notes</h2>
            <p style={{ color: "#274153", lineHeight: 1.6 }}>
              The 9th house shows where the native finds meaning, luck, and higher purpose. Benefics here expand opportunities, grant fortunate breaks, and support long journeys and higher education.
            </p>

            <h2>Keywords & Concepts</h2>
            <ul style={{ marginLeft: 20, color: "#1f2a44" }}>
              <li>Fortune & providence</li>
              <li>Religion, philosophy & law</li>
              <li>Pilgrimage, travel & expatriation</li>
              <li>Teachers, mentors & the father</li>
              <li>Education, publishing & long-term study</li>
            </ul>

            <h2>Essence</h2>
            <p>
              👉 The 9th house reveals how the native connects to the transcendent — through luck, faith, mentors, and journeys that broaden perspective.
            </p>

            <h2>Practical Guidance</h2>
            <p style={{ color: "#274153", lineHeight: 1.6 }}>
              A strong 9th house supports long-term study, successful foreign travel, and fortunate legal outcomes. When afflicted, the 9th can point to missed opportunities or conflicts with belief systems, but it also offers lessons that enlarge the soul.
            </p>

            <figure style={{ margin: "0 0 12px 0", textAlign: "center" }}>
              <img
                src="/images/Rama.JPG"
                alt="Lord Rama - Ninth House example"
                style={{
                  width: "100%",
                  maxWidth: 360,
                  height: "auto",
                  borderRadius: 12,
                  boxShadow: "0 12px 26px rgba(0,0,0,0.12)",
                }}
              />
              <figcaption style={{ marginTop: 10, fontSize: 14, color: "#4a6071" }}>
                The Ninth house governs dharma, long journeys, and auspicious guidance.
              </figcaption>
            </figure>

            <h2>Lord Rama’s Ninth House Note</h2>
            <div style={{ color: "#274153", lineHeight: 1.6, marginBottom: 18 }}>
              <p>
                In Lord Rama’s horoscope (Cancer Ascendant), the 9th Bhava (House of Fortune and Dharma) is exceptionally powerful and defines his identity as Maryada Purushottam.
              </p>
              <p>
                <strong>Exalted Lord:</strong> The 9th house is Pisces, and its ruler, Jupiter, is exalted in the 1st house (Ascendant), creating a direct link between his soul and supreme righteousness (Dharma).
              </p>
              <p>
                <strong>Dharmic Foundation:</strong> This placement ensured that every action he took was rooted in divine law, making him the eternal benchmark for duty and ethical conduct.
              </p>
              <p>
                <strong>Father’s Influence:</strong> The 9th house represents the father; although he faced exile due to his father's promise, the strength of this house shows his unwavering obedience to King Dasharatha.
              </p>
              <p>
                <strong>Guru’s Grace:</strong> A strong 9th house brought him under the guidance of great sages like Vishwamitra and Vashistha, who equipped him with divine weapons and spiritual wisdom.
              </p>
              <p>
                <strong>Pilgrimage and Exile:</strong> Since the 9th house also relates to long travels, his 14-year exile became a spiritual journey that cleansed the earth of demonic forces and established Ram Rajya.
              </p>
            </div>

            <h2>🛠️ Ninth House: Practicalities</h2>
            <p>
              The 9th house is essential for students, pilgrims, clergy, and those seeking purpose through travel, education, or law.
            </p>

            <h2>Travel & Car Services for you</h2>
            <div style={{ color: "#1f2a44", lineHeight: 1.6, marginBottom: 18 }}>
              <p>
                The 9th house is the domain of travel, learning, and long journeys. As your professional travel coach, I offer you chauffeur-driven car services for personalized tours, family trips, corporate travel, airport transfers, and outstation journeys.
              </p>
              <ul>
                <li>Private Chauffeur Service</li>
                <li>Airport Pickup and Drop</li>
                <li>Outstation Trips</li>
                <li>Sightseeing Tours</li>
                <li>Travel Guide Services</li>
                <li>Personalized Tour Packages</li>
                <li>Corporate Travel</li>
                <li>Family Trips</li>
              </ul>
              <p>
                All services are delivered with a focus on safety, comfort, flexibility, and professionalism. Enjoy a reliable and friendly travel experience for every journey.
              </p>
                <p style={{ marginTop: 16 }}>
                  <strong>Contact:</strong> <a href="mailto:himanshu@aheadterra.com">himanshu@aheadterra.com</a>
                </p>
            </div>

            <h3>Essence</h3>
            <p>
              👉 The 9th house shows how faith, study, and long journeys expand a life toward its highest meaning.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
