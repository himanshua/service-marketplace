"use client";
import { useMemo, useState } from "react";

// Add X (Twitter) and Instagram to platforms
const sharePlatforms = [
  {
    key: "facebook",
    label: "Facebook",
    color: "#1877f2",
    icon: "facebook",
    buildUrl: ({ url, title }) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    color: "#0a66c2",
    icon: "linkedin",
    buildUrl: ({ url, title }) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    color: "#25d366",
    icon: "whatsapp",
    buildUrl: ({ url, title }) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    key: "telegram",
    label: "Telegram",
    color: "#24a1de",
    icon: "telegram",
    buildUrl: ({ url, title }) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    key: "x",
    label: "X",
    color: "#000",
    icon: "x",
    buildUrl: ({ url, title }) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    key: "instagram",
    label: "Instagram",
    color: "#E1306C",
    icon: "instagram",
    buildUrl: ({ url }) =>
      `https://www.instagram.com/`, // Instagram does not support direct share links
  },
];

// SVG icons for each platform
const platformIcons = {
  facebook: (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#1877F3"/>
      <path d="M21 16h-3v8h-4v-8h-2v-3h2v-2c0-2 1-3 3-3h3v3h-2c-.5 0-1 .5-1 1v1h3l-1 3z" fill="#fff"/>
    </svg>
  ),
  linkedin: (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#0A66C2"/>
      <rect x="10" y="14" width="2" height="8" fill="#fff"/>
      <rect x="10" y="10" width="2" height="2" fill="#fff"/>
      <rect x="14" y="14" width="2" height="8" fill="#fff"/>
      <rect x="18" y="17" width="2" height="5" fill="#fff"/>
      <rect x="14" y="10" width="6" height="2" fill="#fff"/>
    </svg>
  ),
  whatsapp: (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#25D366"/>
      <path d="M22 10a6 6 0 0 0-10 7.5l-1 3.5 3.5-1A6 6 0 0 0 22 10zm-6 11a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm2.2-4.3c-.3-.2-.7-.4-1-.2-.3.1-.6.5-.8.8-.2.2-.4.3-.7.2-1.2-.5-2-1.6-2.1-2.9 0-.3.1-.5.3-.7.2-.2.4-.5.5-.7.1-.2.1-.5 0-.7-.1-.2-.3-.4-.5-.5-.2-.1-.5-.1-.7 0-.6.3-1.1.8-1.2 1.5-.2 1.2.2 2.4 1.1 3.3.9.9 2.1 1.3 3.3 1.1.7-.1 1.2-.6 1.5-1.2.1-.2.1-.5 0-.7-.1-.2-.3-.4-.5-.5z" fill="#fff"/>
    </svg>
  ),
  telegram: (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#0088CC"/>
      <path d="M23 10l-2.7 12c-.2.8-.7 1-1.4.6l-3.8-2.8-1.8-.9c-.4-.2-.4-.6 0-.8l7.1-6.3c.3-.3.7 0 .6.4l-1.1 4.6c-.1.4-.5.6-.9.5l-2.1-.7c-.4-.1-.5-.5-.2-.8l4.7-4.2c.3-.3.7 0 .6.4z" fill="#fff"/>
    </svg>
  ),
  x: (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#000"/>
      <path d="M21.5 10h-2l-3.5 5-3.5-5h-2l4.5 6.5-4.5 6.5h2l3.5-5 3.5 5h2l-4.5-6.5z" fill="#fff"/>
    </svg>
  ),
  instagram: (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#E1306C"/>
      <rect x="10" y="10" width="12" height="12" rx="4" fill="#fff"/>
      <circle cx="16" cy="16" r="3" fill="#E1306C"/>
      <circle cx="21" cy="11" r="1" fill="#E1306C"/>
    </svg>
  ),
};

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
      {sharePlatforms.map(({ key, label, color }) => (
        <button
          key={key}
          type="button"
          aria-label={`Share on ${label}`}
          style={{
            ...styles.iconBtn,
            backgroundColor: color,
            padding: 0,
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => handlePlatformClick(key)}
        >
          {platformIcons[key]}
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
    padding: "38px 18px 18px 18px", // increased top padding for x button
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