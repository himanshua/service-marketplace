"use client";

import "../globals.css";
import "../profile/profile.css";
import UniversalShareBar from "../components/UniversalShareBar";
import React, { useState } from "react";
import { shareItems } from "../share/data";

export default function Page18Client() {
  const shareChoices = ["18-house8-a", "18-house8-b"];
  const shareBaseUrl = "https://aheadterra.com/18";
  const sharePageBase = "https://aheadterra.com/share";
  const shareImages = {
    "18-house8-a": {
      label: "8th House – Ashtam Bhava (Image 1)",
      image: "https://aheadterra.com/images/ashtam.jpg",
      description: "Transformation, shared resources, occult, inheritance, intimacy.",
      slug: "ashtam-bhava",
      url: sharePageBase + "/ashtam-bhava",
    },
    "18-house8-b": {
      label: "8th House – Ashtam Bhava (Image 2)",
      image: "https://aheadterra.com/images/ashtam1.jpeg",
      description: "Alternate 8th house illustration — death, rebirth, deep intimacy.",
      slug: "ashtam-bhava-2",
      url: sharePageBase + "/ashtam-bhava-2",
    },
  };

  const [selected, setSelected] = useState("18-house8-a");

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

      const shareText = `Ashtam Bhava illustrations\n\n${shareUrl}`;

      if (navigator.canShare && navigator.canShare({ files })) {
        await navigator.share({
          title: "8th House – Ashtam Bhava (Images)",
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
                src="/images/ashtam.jpg"
                alt="Ashtam Bhava – 8th House"
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
                src="/images/ashtam1.jpeg"
                alt="Ashtam Bhava – death, transformation"
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

            <h2 style={{ color: "#0d47a1", margin: 0 }}>8th House – Ashtam Bhava (अष्टम भाव)</h2>
            <p style={{ margin: 0, color: "#555" }}>
              Transformation, shared resources, inheritance, occult, intimacy, and endings that lead to rebirth.
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

            <h1>Eight House (Ashtam Bhava) in Astrology: अष्टम भाव</h1>
            <p style={{ color: "#4a6071", lineHeight: 1.7 }}>
              <strong>Eight House / अष्टम भाव</strong>
            </p>
            <ul style={{ marginLeft: 20, color: "#1f2a44", lineHeight: 1.6 }}>
              <li>Transformation, death & rebirth</li>
              <li>Shared resources, inheritances, and joint finances</li>
              <li>Occult studies, secrets, and hidden knowledge</li>
              <li>Deep intimacy and sexual bonds</li>
              <li>Longevity & major life crises</li>
            </ul>

            <h2>Practical Notes</h2>
            <p style={{ color: "#274153", lineHeight: 1.6 }}>
              The 8th house reveals how deep transformations occur — often through crisis, partnership, inheritance, or the uncovering of secrets. Planets placed here will show where change is most likely to be intense and how the native navigates hidden matters and joint resources.
            </p>

            <h2>Keywords & Concepts</h2>
            <ul style={{ marginLeft: 20, color: "#1f2a44" }}>
              <li>Inheritance & wills</li>
              <li>Death, rebirth, initiation</li>
              <li>Sexual intimacy & secrecy</li>
              <li>Occult knowledge & research</li>
              <li>Joint assets & debts</li>
              <li>Psychological transformation & therapy</li>
              <li>Taxes, loans, and other people's money</li>
            </ul>

            <h2>Essence</h2>
            <p>
              👉 The 8th house governs how you encounter endings and how those endings become beginnings — through shared belongings, intimate bonds, and the mysteries that change us.
            </p>

            <h2>Intimate Themes</h2>
            <ul style={{ marginLeft: 20, color: "#1f2a44", lineHeight: 1.6 }}>
              <li>Vulnerability, trust in shared resources, and transformational intimacy</li>
              <li>Hidden motives, secrets, and investigations</li>
              <li>Regeneration and recovery after loss</li>
            </ul>

            <h2>Practical Guidance</h2>
            <p style={{ color: "#274153", lineHeight: 1.6 }}>
              When benefic planets occupy the 8th, they can ease transitions and help the native manage joint finances or inheritances responsibly. Malefics can bring sudden events or intense psychological pressure, but also the potential for profound growth when handled consciously.
            </p>

            <figure style={{ margin: "0 0 12px 0", textAlign: "center" }}>
              <img
                src="/images/Rama.JPG"
                alt="Lord Rama - Eighth House example"
                style={{
                  width: "100%",
                  maxWidth: 360,
                  height: "auto",
                  borderRadius: 12,
                  boxShadow: "0 12px 26px rgba(0,0,0,0.12)",
                }}
              />
              <figcaption style={{ marginTop: 10, fontSize: 14, color: "#4a6071" }}>
                The Eighth house often appears in classical examples when life undergoes profound change.
              </figcaption>
            </figure>

            <h2>Lord Rama’s Eighth House Example</h2>
            <p>
              In illustrative charts, a strong 8th house or a well‑placed 8th lord can indicate deep resilience in the face of loss and an ability to regenerate after crises. When benefics support the 8th, shared resources and inheritances may be managed with wisdom and fairness. When malefics influence the 8th, the native may face sudden events or secrecy that require inner strength and careful handling.
            </p>

            <p style={{ color: "#274153", lineHeight: 1.6 }}>
              In the context of Lord Rama's mythology and illustrative charts, an activated 8th house can be read as symbolic of trials that transform the hero — periods that demand courage, humility, and a turning toward deeper wisdom. These placements reflect inner purification, confronting hidden enemies, and ultimately, renewal.
            </p>

            <h2>🛠️ Eight House: Practicalities</h2>
            <p>
              The 8th house is important for those working with inheritances, financial partnerships, estate planning, psychology, and occult studies. It also governs long-term recoveries, shared debt, and legal settlements.
            </p>

            <h3>Essence</h3>
            <p>
              👉 The 8th house shows where you meet endings and how those endings catalyze growth — through shared fate, intimate bonds, and the mysteries beneath ordinary life.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
