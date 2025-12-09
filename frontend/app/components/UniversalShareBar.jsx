"use client";
import { useMemo, useState } from "react";

const sharePlatforms = [
  {
    key: "facebook",
    label: "Facebook",
    color: "#1877f2",
    icon: "f",
    buildUrl: ({ url, title }) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    color: "#0a66c2",
    icon: "in",
    buildUrl: ({ url, title }) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    color: "#25d366",
    icon: "wa",
    buildUrl: ({ url, title }) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    key: "telegram",
    label: "Telegram",
    color: "#24a1de",
    icon: "tg",
    buildUrl: ({ url, title }) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
];

export default function UniversalShareBar({
  shareChoices = [],
  shareImages = {},
  shareBaseUrl = "https://aheadterra.com/share",
}) {
  const [pendingPlatform, setPendingPlatform] = useState(null);

  const normalizedChoices = useMemo(
    () =>
      shareChoices
        .map((choice) => (typeof choice === "string" ? choice : choice?.key))
        .filter((key) => key && shareImages[key]),
    [shareChoices, shareImages]
  );

  const platformMeta = useMemo(
    () => sharePlatforms.reduce((acc, platform) => ({ ...acc, [platform.key]: platform }), {}),
    []
  );

  const openShare = (platformKey, shareKey) => {
    const platform = platformMeta[platformKey];
    const payload = shareImages[shareKey];
    if (!platform || !payload) return;
    const targetUrl = payload.url || `${shareBaseUrl}/${shareKey}`;
    const shareHref = platform.buildUrl({
      url: targetUrl,
      title: payload.title || payload.label || "AheadTerra",
    });
    window.open(shareHref, "_blank", "noopener,noreferrer");
  };

  const handlePlatformClick = (platformKey) => {
    if (!normalizedChoices.length) return;
    if (normalizedChoices.length === 1) {
      openShare(platformKey, normalizedChoices[0]);
      return;
    }
    setPendingPlatform(platformKey);
  };

  const handleChoiceSelect = (choiceKey) => {
    if (!pendingPlatform) return;
    openShare(pendingPlatform, choiceKey);
    setPendingPlatform(null);
  };

  if (!normalizedChoices.length) return null;

  return (
    <div style={styles.bar}>
      {sharePlatforms.map(({ key, label, color, icon }) => (
        <button
          key={key}
          type="button"
          aria-label={`Share on ${label}`}
          style={{ ...styles.iconBtn, backgroundColor: color }}
          onClick={() => handlePlatformClick(key)}
        >
          {icon.toUpperCase()}
        </button>
      ))}

      {pendingPlatform && (
        <div style={styles.backdrop} onClick={() => setPendingPlatform(null)}>
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPendingPlatform(null)}
              aria-label="Close share modal"
              style={{
                position: "absolute",
                top: 12,
                right: 16,
                border: "none",
                background: "transparent",
                fontSize: 22,
                fontWeight: 700,
                color: "#7a8797",
                cursor: "pointer",
                zIndex: 1,
              }}
            >
              ×
            </button>
            <h4 style={{ marginBottom: 12, marginTop: 0 }}>
              Choose what to share on {platformMeta[pendingPlatform].label}
            </h4>
            <div style={styles.choiceGrid}>
              {normalizedChoices.map((choiceKey) => {
                const data = shareImages[choiceKey];
                return (
                  <button
                    key={choiceKey}
                    type="button"
                    style={styles.choiceCard}
                    onClick={() => handleChoiceSelect(choiceKey)}
                  >
                    <img
                      src={data.image}
                      alt={data.label || data.title}
                      style={styles.choiceImage}
                    />
                    {data.label && (
                      <span style={styles.choiceLabel}>{data.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              style={{
                ...styles.iconBtn,
                backgroundColor: "#e0e6ef",
                color: "#41506a",
                width: "100%",
                marginTop: 16,
                fontWeight: 600,
              }}
              onClick={() => setPendingPlatform(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  bar: { display: "flex", gap: 6, justifyContent: "flex-end" },
  iconBtn: {
    border: "none",
    color: "#fff",
    fontWeight: 700,
    borderRadius: 6,
    padding: "6px 10px",
    cursor: "pointer",
    fontSize: 12,
  },
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(9,20,40,0.35)",
    zIndex: 2000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    position: "relative",
    width: "min(520px, 100%)",
    maxHeight: "calc(100vh - 68px)",
    overflowY: "auto",
    background: "#fff",
    borderRadius: 12,
    padding: 18,
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  choiceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 12,
  },
  choiceCard: {
    border: "1px solid #d4dbe4",
    borderRadius: 10,
    padding: 10,
    background: "#f9fbff",
    cursor: "pointer",
    textAlign: "center",
  },
  choiceImage: {
    width: "100%",
    height: 90,
    objectFit: "cover",
    borderRadius: 8,
    marginBottom: 6,
    background: "#fff",
  },
  choiceLabel: { fontSize: 13, color: "#1e3553", fontWeight: 600 },
};