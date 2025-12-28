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
              The 8th house reveals how transformations occur in life — through crises, partnerships, and the flow of shared resources. Planets here indicate where deep change is likely and how the native engages with hidden matters.
            </p>

            <h2>Keywords & Concepts</h2>
            <ul style={{ marginLeft: 20, color: "#1f2a44" }}>
              <li>Inheritance & wills</li>
              <li>Death, rebirth, initiation</li>
              <li>Sexual intimacy & secrecy</li>
              <li>Occult knowledge & research</li>
              <li>Joint assets & debts</li>
            </ul>

            <h2>Essence</h2>
            <p>
              👉 The 8th house governs how you transform through others, shared resources, and hidden forces. It asks how you meet dissolution and renewal.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
