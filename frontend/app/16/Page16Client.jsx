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
      image: "https://aheadterra.com/images/saptam.jpeg",
      description: "Partnerships, marriage, contracts, open enemies, public relationships.",
      slug: "saptam-bhava",
      url: sharePageBase + "/saptam-bhava",
    },
    "16-house7-b": {
      label: "7th House – Saptam Bhava (Image 2)",
      image: "https://aheadterra.com/images/saptam1.jpeg",
      description: "Alternate illustration for Saptam Bhava — spouse, partners, public relations.",
      slug: "saptam-bhava-2",
      url: sharePageBase + "/saptam-bhava-2",
    },
  };

  const [selected, setSelected] = useState("16-house7-a");

  // --- small helpers (copied from 6th-house file) ---
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
  // --- end helpers ---

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
                src="/images/saptam.jpeg"
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
                src="/images/saptam1.jpeg"
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
              Partnerships, marriage, open enemies, contracts, business partners, public relationships.
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

            <h1>Seventh House (Saptam Bhava) in Astrology: सप्तम भाव</h1>
            <p style={{ color: "#4a6071", lineHeight: 1.7 }}>
              Saptam / सप्तम = partnership, spouse, public other; governs marriage, open partnership, and one‑to‑one public dealings.
            </p>
            <p style={{ color: "#274153", lineHeight: 1.6 }}>
              The Seventh House describes one‑to‑one relationships, marriage, contracts, and how you appear in public partnerships. It shows patterns of compromise, negotiation, and balance with others.
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
              Benefic planets in the 7th often support harmonious partnerships and successful unions; malefics can create conflict but also bring decisive action and clarity. The house ruler, aspects, and dignity determine relationship quality, contract outcomes, and public dealings.
            </p>

            <h2>Lord Rama’s Seventh House Example</h2>
            <p>
              In Lord Rama’s chart, the 7th house placements reflect public partnerships and marriage potential. The house shows how relationships are negotiated in public life and the native’s approach to one‑to‑one bonds.
            </p>

            <p>
              As 7th‑bhava considerations, the 7th lord and aspects from malefics or benefics will colour marriage outcomes, public disputes, and contractual success. Rulers and yogas involving the 7th often indicate marriage timing, spouse qualities, and business partnership dynamics.
            </p>

            <figure style={{ margin: "0 0 12px 0", textAlign: "center" }}>
              <img
                src="/images/Rama.JPG"
                alt="Lord Rama - Seventh House example"
                style={{
                  width: "100%",
                  maxWidth: 360,
                  height: "auto",
                  borderRadius: 12,
                  boxShadow: "0 12px 26px rgba(0,0,0,0.12)",
                }}
              />
              <figcaption style={{ marginTop: 10, fontSize: 14, color: "#4a6071" }}>
                Seventh house examples show partnership dynamics, public marriage patterns, and contractual relationships.
              </figcaption>
            </figure>

            <h2>🛠️ Seventh House + Marriage, Contracts & Public Relations</h2>
            <p>
              The Seventh House governs marriage, partnerships, and public contracts. Planets here show the nature of your partnerships—whether harmonious, challenging, or karmically charged. Benefics promote ease and cooperation; malefics may bring turbulence but also decisive resolution.
            </p>

            <h3>Essence</h3>
            <p>
              👉 The 7th house expresses how you relate across the table — partnership, marriage, and public one‑to‑one dealings.<br />
              👉 सप्तम भाव सार्वजनिक साझेदारी और विवाह का प्रतिनिधित्व करता है।
            </p>

            <h3>Saptam (सप्तम)</h3>
            <p>
              Sap + Tam<br />
              Sap = pair / relationship (root sense)<br />
              Tam = position / place<br />
              👉 Saptam = the place of pairing → house of partners and marriage
            </p>

            <h3>Vivāha (विवाह)</h3>
            <p>
              Vi + Vāha<br />
              Vi = joining across<br />
              Vāha = carrier / bond<br />
              👉 Vivāha = social joining → marriage, committed union
            </p>

            <h3>Bandhu (बन्धु)</h3>
            <p>
              Ba + Ndhu<br />
              Ba = relation<br />
              Ndhu = bond<br />
              👉 Bandhu = allied relation → spouse, partner, ally
            </p>

            <h3>Dharma & Social Contract</h3>
            <p>
              The 7th house also intersects with societal duty and public contract—marriage can be a dharmic bond as well as a legal one. Consider the 7th lord, aspects, and functional nature of planets to judge whether partnerships are karmic, contractual, or both.
            </p>

            <h3>Open Enemies (प्रत्यक्ष शत्रु)</h3>
            <p>
              The 7th also rules open enemies — those you meet face‑to‑face in public life, litigation with partners, or adversarial business dealings. Planets here show how conflict appears in public relationships.
            </p>

            <h3>Timing & Marriage</h3>
            <p>
              Transit and dashā timings involving the 7th house or its lord often trigger marriage or major partnership events. Yogas to the 7th or its ruler indicate timing windows for unions or contractual changes.
            </p>

            <h3>Career & Partnership Significance</h3>
            <p>
              👉 The 7th house is important for business partners, client relationships, and contracts. Strong 7th placements help form lasting business alliances and public cooperation.
            </p>

            <h2>🌟 Example of Strong Seventh House</h2>
            <p>
              <strong>Person with a strong 7th house:</strong> Harmonious in partnerships, forms lasting marriages or business alliances, skilled negotiator, and publicly respected in one‑to‑one dealings.
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