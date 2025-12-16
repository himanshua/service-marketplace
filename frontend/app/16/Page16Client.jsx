"use client";

import "../globals.css";
import "../profile/profile.css";
import UniversalShareBar from "../components/UniversalShareBar";
import React, { useState } from "react";
import { shareItems } from "../share/data";

export default function Page16Client() {
  const shareChoices = ["16-house7-a", "16-house7-b"];
  const shareBaseUrl = "https://aheadterra.com/16";
  const sharePageBase = "https://aheadterra.com/share";
  const shareImages = {
    "16-house7-a": {
      label: "7th House – Saptam Bhava (Image 1)",
      image: "https://aheadterra.com/images/saptam.png",
      description: "Partnerships, marriage, contracts, open enemies, public relationships.",
      slug: "saptam-bhava",
      url: sharePageBase + "/saptam-bhava",
    },
    "16-house7-b": {
      label: "7th House – Saptam Bhava (Image 2)",
      image: "https://aheadterra.com/images/saptam1.png",
      description: "Alternate illustration for Saptam Bhava — spouse, partners, public relations.",
      slug: "saptam-bhava-2",
      url: sharePageBase + "/saptam-bhava-2",
    },
  };

  const [selected, setSelected] = useState("16-house7-a");

  // small helpers
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

      const slug =
        item.slug ||
        Object.keys(shareItems).find((k) => {
          const si = shareItems[k];
          return si && (si.image === item.image || (`https://aheadterra.com${si.image}`) === item.image);
        }) ||
        selected;

      const shareUrl = `${sharePageBase}/${encodeURIComponent(slug)}`;
      const shareText = `${item.description}\n\n${shareUrl}`;

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: item.label,
          text: shareText,
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
      const keys = ["16-house7-a", "16-house7-b"];
      const files = await Promise.all(keys.map((k) => fetchFileFromUrl(shareImages[k].image, k)));

      const shareSlug = keys.map((k) => shareImages[k].slug || k).join("-");
      const shareUrl = `${sharePageBase}/${encodeURIComponent(shareSlug)}`;
      const shareText = `Saptam Bhava illustrations\n\n${shareUrl}`;

      if (navigator.canShare && navigator.canShare({ files })) {
        await navigator.share({
          title: "7th House – Saptam Bhava (Images)",
          text: shareText,
          files,
          url: shareUrl,
        });
        return;
      }
    } catch (e) {
      console.error(e);
    }

    window.open(`${sharePageBase}/${encodeURIComponent("saptam-bhava,saptam-bhava-2")}`, "_blank", "noopener");
    window.open(shareImages["16-house7-a"].image, "_blank", "noopener");
    window.open(shareImages["16-house7-b"].image, "_blank", "noopener");
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
                src="/images/saptam.png"
                alt="Saptam Bhava – 7th House"
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
                src="/images/saptam1.png"
                alt="Saptam Bhava – partners & marriage"
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

            <h2 style={{ color: "#0d47a1", margin: 0 }}>7th House – Saptam Bhava (सप्तम भाव)</h2>
            <p style={{ margin: 0, color: "#555" }}>
              Partnerships, marriage, contracts, open enemies, business partners, public relationships.
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
            <UniversalShareBar shareChoices={shareChoices} shareImages={shareImages} shareBaseUrl={shareBaseUrl} />

            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="radio"
                  name="shareImg"
                  value="16-house7-a"
                  checked={selected === "16-house7-a"}
                  onChange={(e) => setSelected(e.target.value)}
                />
                {shareImages["16-house7-a"].label}
              </label>

              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="radio"
                  name="shareImg"
                  value="16-house7-b"
                  checked={selected === "16-house7-b"}
                  onChange={(e) => setSelected(e.target.value)}
                />
                {shareImages["16-house7-b"].label}
              </label>

              <button className="profile-btn" onClick={shareSelected}>Share Selected (native)</button>
              <button className="profile-btn profile-btn-outline" onClick={shareBoth}>Share Both (native)</button>
            </div>

            <h1>Seventh House (Saptam Bhava) in Astrology: सप्तम भाव</h1>
            <p style={{ color: "#4a6071", lineHeight: 1.7 }}>
              The 7th house governs partnerships, marriage, open foes, and public relationships — the world you meet across from you.
            </p>

            <h2>Keywords & Concepts</h2>
            <ul style={{ marginLeft: 20, color: "#1f2a44" }}>
              <li>Marriage / Spouse – विवाह / जीवनसाथी</li>
              <li>Partnerships – साझेदारी / contracts</li>
              <li>Open Enemies – प्रत्यक्ष शत्रु</li>
              <li>Business Partners & Clients</li>
              <li>Public Image in Relationships</li>
            </ul>

            <h2>Practical Notes</h2>
            <p style={{ color: "#274153", lineHeight: 1.6 }}>
              Benefic planets in the 7th often support harmonious partnerships and successful unions; malefics can create conflict but also bring decisive action. The house ruler, aspects, and dignity determine the experience in marriage and business contracts.
            </p>

            <h2>✨ In simple words — 7th House (सप्तम भाव)</h2>
            <p style={{ color: "#274153", lineHeight: 1.6 }}>
              The 7th House governs committed partnerships, marriage, open relationships, and public contracts.
              <br /><br />
              <strong>Positive effects:</strong> Harmonious relationships, successful partnerships, cooperation, and productive business alliances.
              <br /><br />
              <strong>Negative effects:</strong> Conflicts in marriage or business, open rivals, litigation, and imbalance in one‑to‑one dealings.
            </p>

            <h2>Essence</h2>
            <p>
              👉 The 7th house shows how you meet the world in pairs — marriage, contracts, and the public partner. It reflects compromise, balance, and public negotiation.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}