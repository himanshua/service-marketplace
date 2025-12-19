"use client";

import "../globals.css";
import "../profile/profile.css";
import UniversalShareBar from "../components/UniversalShareBar";
import React, { useState } from "react";
import { shareItems } from "../share/data";

export default function Page16Client() {
  const shareChoices = ["16-house7-a", "16-house7-b", "16-house7-c"];
  const shareBaseUrl = "https://aheadterra.com/16";
  const sharePageBase = "https://aheadterra.com/share";
  const shareImages = {
    "16-house7-a": {
      label: "7th House – Saptam Bhava (Image 1)",
      image: "https://aheadterra.com/images/saptam.jpg",
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
    "16-house7-c": {
      label: "Deals — Michael Jordan (Image 3)",
      image: "/images/MichaelJordan.jpg",
      description: "Upper Deck Authentic Michael Jordan Autograph Basketball — deals, collectibles, auctions.",
      slug: "michael-jordan-deal",
      url: sharePageBase + "/michael-jordan-deal",
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
      const keys = Object.keys(shareImages);
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
    const fallbackKeys = Object.keys(shareImages);
    const fallbackSlugs = fallbackKeys.map((k) => shareImages[k].slug || k).join(",");
    window.open(`${sharePageBase}/${encodeURIComponent(fallbackSlugs)}`, "_blank", "noopener");
    fallbackKeys.forEach((k) => {
      const img = shareImages[k].image;
      if (img) window.open(img, "_blank", "noopener");
    });
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
                src="/images/saptam.jpg"
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
              <strong>Seventh House / सप्तम भाव</strong>
            </p>
            <ul style={{ marginLeft: 20, color: "#1f2a44", lineHeight: 1.6 }}>
              <li style={{
                background: "#fff8e1",
                borderLeft: "4px solid #ffb300",
                padding: "10px 12px",
                marginBottom: 8,
                borderRadius: 6,
                listStylePosition: "outside",
                display: "list-item",
              }}>
                <strong style={{ fontWeight: 700, color: "#0d47a1", fontSize: "1.03em", display: "inline" }}>Contracts & Justice —</strong>
                <span style={{ color: "#1f2a44", marginLeft: 8 }}>
                  fairness in partnerships and relationships; <em>11th (Gains) from the 9th bhava — the primary Justice / Dharma bhava</em>
                </span>
              </li>
              <li><strong>शुक्रगृह / śukra-gṛha / Shukra-griha</strong> — the house of Venus (Shukra / शुक्र)</li>
              <li>The revered planet of wealth, knowledge, devotion, and pleasures; blessed by Goddesses Lakshmi, Saraswati, and Parvati.</li>
              <li>Attraction/ आकर्षण, Love, beauty, equity, balance (Tula - Libra - तुला - तराजू - Weighing scale - संतुलन ⚖♎👩‍⚖️👨‍⚖️🤍 ), and harmony</li>
              <li>Partnerships & Deals </li>
              <li>Romantic relationships</li>
              <li>Spouse & mate</li>
              <li>Marriage & long-term relationships</li>
              <li>Business partners & clients</li>
              <li style={{
                background: "#fff8e1",
                borderLeft: "4px solid #ffb300",
                padding: "10px 12px",
                marginBottom: 8,
                borderRadius: 6,
                listStylePosition: "outside",
                display: "list-item",
              }}>
                <strong style={{ fontWeight: 700, color: "#0d47a1", fontSize: "1.03em", display: "inline" }}>Connections with others —</strong>
                <span style={{ color: "#1f2a44", marginLeft: 8 }}>social ties, networks, and public linkages</span>
              </li>
              <li>Open collaboration</li>
              <li>Contracts</li>
              <li>Public dealings</li>
            </ul>

            <p>
              <strong>Intimate themes:</strong>
            </p>
            <ul style={{ marginLeft: 20, color: "#1f2a44", lineHeight: 1.6 }}>
              <li>Vulnerable exchange / संवेदनशील आदान-प्रदान</li>
              <li style={{
                background: "#fff8f0",
                borderLeft: "4px solid #8e24aa",
                padding: "8px 12px",
                marginBottom: 8,
                borderRadius: 6,
                listStylePosition: "outside",
                display: "list-item",
              }}>
                <strong style={{ color: "#6a1b9a", fontSize: "1.02em" }}>Sacred union / पवित्र मिलन</strong>
              </li>
              <li>Authentic presence / प्रामाणिक उपस्थिति</li>
              <li>Shared trust / साझा विश्वास</li>
            </ul>

            <p style={{ color: "#274153", lineHeight: 1.6 }}>
          The Seventh House (सप्तम भाव) is the house of partnership and marriage
          (विवाह और साझेदारी). It primarily governs the bond with one’s spouse
          (जीवनसाथी), romantic partner, and business associates. This house manages
          all one-to-one public dealings (सार्वजनिक संबंध), including legal alliances,
          contracts, and open collaborations. It reflects how we relate to others on
          both personal and professional levels and represents the “other” in our lives,
          highlighting marriage, committed partnerships, public interactions, and
          professional agreements (विवाह, साझेदारी, और व्यावसायिक अनुबंध).
        </p>


            <h2>Keywords & Concepts</h2>
          <ul style={{ marginLeft: 20, color: "#1f2a44" }}>
            <li>Marriage / Spouse – विवाह / जीवनसाथी</li>
            <li>Partnerships / Contracts – साझेदारी / अनुबंध</li>
            <li>Open Enemies – साफ़ शत्रु (or स्पष्ट विरोधी)</li>
            <li>Business Partners & Clients – व्यावसायिक साथी और ग्राहक</li>
            <li>Public Image in Relationships – सार्वजनिक संबंधों में छवि</li>
            <li>One-to-One Interactions – एक से एक बातचीत</li>
            <li>Balance & Harmony – संतुलन और सामंजस्य</li>
            <li>Justice & Fairness – न्याय और निष्पक्षता</li>
            <li>Venus (Shukra) Influence – शुक्र ग्रह का प्रभाव</li>  
            <li>Daily Income – दैनिक आय / आमदनी / दैनिक आमदनी / रोज़ाना आय; Earnings, wages, pay (business context: revenue).</li>
            <li>Shows opponents, rivals, winners, and losers in one-to-one games, partnerships, and relationships.</li>
          </ul>

            <h2>Practical Notes</h2>
            <p style={{ color: "#274153", lineHeight: 1.6 }}>
              Benefic planets in the 7th often support harmonious partnerships and successful unions; malefics can create conflict but also bring decisive action and clarity. The house ruler, aspects, and dignity determine relationship quality, contract outcomes, and public dealings.
            </p>

            <figure style={{ margin: "0 0 12px 0", textAlign: "center" }}>
              <img
                src="/images/MichaelJordan.jpg"
                alt="Michael Jordan - Upper Deck Authentic Autograph Basketball"
                style={{
                  width: "100%",
                  maxWidth: 360,
                  height: "auto",
                  borderRadius: 12,
                  boxShadow: "0 12px 26px rgba(0,0,0,0.12)",
                }}
              />
              <figcaption style={{ marginTop: 10, fontSize: 14, color: "#4a6071" }}>
                Deals — <a href="https://www.amazon.com/Authentic-Autograph-Official-Spalding-Basketball/dp/B0CGMMHXYC/ref=sr_1_27?dib=eyJ2IjoiMSJ9.Gicmy5uRzsxs9RGC1tz0UB3KlMrS2bagklOy8Ne7FRpJG45NbpCEaLaUHQo4mc0wGrIac_KcbkmfNUG9cPp_mpKrJnJ5hJsxPi3L52stEjMe_Cjf3XBCS6UU__ubUDe1KfAki9lSY9vw7NKKu4laJzagzQ2S6kVzbKEgw8Err7tcCVhoeo3DqDtNjJ3Vm-fsLbsK63y_bLLZ6DL4D1XXZmvcLNRhLA2HeIontcNCvYb1tegYshQZZQmFLKF3ecct5KER-o7dE8KH_cOvsrJPDGAC3meY3nKmANyInltBiAk.813eOcsEELI6uq2uGS6mqAq5EsFj5IkAouF1MrLro2U&dib_tag=se&qid=1766172138&refinements=p_athlete%3AMichael+Jordan&s=trading-cards&sr=1-27" target="_blank" rel="noopener noreferrer">Upper Deck Authentic Michael Jordan Autograph Official NBA Spalding Basketball</a>
              </figcaption>
            </figure>

            <h2>Lord Rama’s Seventh House Example</h2>
           <p>
            In Lord Rama’s chart, the 7th House placement is strong, with exalted Mars forming
            <a
              href="https://barbarapijan.com/bpa/Yoga/Panchmahapurusha_yoga.htm"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}Ruchaka Yoga
            </a>,
            reflecting powerful public partnerships and marriage potential. This house shows
            how relationships are negotiated in public life and the native’s approach to
            one-to-one bonds.
          </p>

          <p>
            From a 7th-bhava perspective, the 7th lord and aspects from malefic or benefic planets
            color marriage outcomes, public disputes, and contractual success. Planets and yogas
            connected to the 7th House often indicate marriage timing, spouse qualities, and
            business partnership dynamics.
          </p>

          <p style={{ color: "#274153", lineHeight: 1.6 }}>
            In Lord Rama’s birth chart, the 7th House of marriage, partnerships, and public
            relationships is very strong and dharmic.
            <a
              href="https://barbarapijan.com/bpa/Yoga/Panchmahapurusha_yoga.htm"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}Ruchaka Yoga
            </a>,
            formed by a powerful Mars, gives him courage, discipline, protection of others,
            and a true warrior spirit, reflected in his righteous conduct in public and
            one-to-one dealings. The 7th House also receives the benefic aspect of Jupiter,
            bringing wisdom, fairness, moral judgment, and divine guidance to his relationships.
            The lord of the 7th House, Saturn, is exalted in the 4th House (Libra), forming
            <a
              href="https://barbarapijan.com/bpa/Yoga/Panchmahapurusha_yoga.htm"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}Śaśa Yoga
            </a>,
            one of the
            <a
              href="https://barbarapijan.com/bpa/Yoga/Panchmahapurusha_yoga.htm"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}Pancha Mahapurusha Yogas
            </a>.
            This placement shows emotional stability, responsibility, respect for home and
            mother, and strong inner discipline. Together, these influences make Lord Rama an
            ideal husband, a just ruler, and a timeless symbol of balanced, righteous, and
            duty-bound relationships.
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