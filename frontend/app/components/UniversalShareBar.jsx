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
    key: "reddit",
    label: "Reddit",
    color: "#FF4500",
    icon: "reddit",
    buildUrl: ({ url, title }) =>
      `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
  {
    key: "pinterest",
    label: "Pinterest",
    color: "#E60023",
    icon: "pinterest",
    buildUrl: ({ url, title }) =>
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`,
  },
  {
    key: "email",
    label: "Email",
    color: "#7a8797",
    icon: "email",
    buildUrl: ({ url, title }) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
  },
];

// SVG icons for each platform
const platformIcons = {
  facebook: (
    // Official Facebook SVG
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#1877F2"/>
      <path d="M21.5 16.1c0-3.4-2.7-6.1-6.1-6.1s-6.1 2.7-6.1 6.1c0 3.1 2.3 5.7 5.3 6v-4.2h-1.6v-1.8h1.6v-1.4c0-1.6 1-2.5 2.5-2.5.7 0 1.4.1 1.4.1v1.6h-.8c-.8 0-1 .4-1 .9v1.2h1.7l-.3 1.8h-1.4V22c3-.3 5.3-2.9 5.3-6z" fill="#fff"/>
    </svg>
  ),
  linkedin: (
    // Official LinkedIn SVG
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#0A66C2"/>
      <rect x="10" y="13" width="2" height="7" fill="#fff"/>
      <rect x="10" y="10" width="2" height="2" fill="#fff"/>
      <rect x="14" y="13" width="2" height="7" fill="#fff"/>
      <rect x="18" y="16" width="2" height="4" fill="#fff"/>
      <rect x="14" y="10" width="6" height="2" fill="#fff"/>
    </svg>
  ),
  whatsapp: (
    // Official WhatsApp SVG
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#25D366"/>
      <path d="M22.1 10.1A8.1 8.1 0 0 0 8.1 22.1l-1.1 3.8 3.8-1.1A8.1 8.1 0 1 0 22.1 10.1zm-6.1 13.1a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm3.1-5.1c-.2-.1-.5-.2-.7-.1-.2.1-.4.4-.5.6-.1.2-.3.2-.5.1-1-.4-1.7-1.3-1.8-2.3 0-.2.1-.4.2-.5.1-.2.3-.4.4-.5.1-.2.1-.4 0-.6-.1-.2-.2-.3-.4-.4-.2-.1-.4-.1-.6 0-.5.2-.9.7-1 1.2-.2 1 .2 2 1 2.7.8.7 1.8 1.1 2.7 1 .6-.1 1-.5 1.2-1 .1-.2.1-.4 0-.6-.1-.2-.2-.3-.4-.4z" fill="#fff"/>
    </svg>
  ),
  telegram: (
    // Official Telegram SVG
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#0088CC"/>
      <path d="M23.1 10.3l-2.8 12.3c-.2.8-.7 1-1.4.6l-3.9-2.9-1.9-.9c-.4-.2-.4-.6 0-.8l7.2-6.4c.3-.3.7 0 .6.4l-1.1 4.7c-.1.4-.5.6-.9.5l-2.2-.7c-.4-.1-.5-.5-.2-.8l4.8-4.3c.3-.3.7 0 .6.4z" fill="#fff"/>
    </svg>
  ),
  x: (
    // Official X (Twitter) SVG
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#000"/>
      <path d="M20.7 10h-2l-2.7 3.9L13.3 10h-2l3.5 5-3.5 5h2l2.7-3.9 2.7 3.9h2l-3.5-5z" fill="#fff"/>
    </svg>
  ),
  reddit: (
    // Official Reddit SVG
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#FF4500"/>
      <ellipse cx="16" cy="20" rx="7" ry="4" fill="#fff"/>
      <circle cx="13" cy="18" r="1.5" fill="#FF4500"/>
      <circle cx="19" cy="18" r="1.5" fill="#FF4500"/>
      <ellipse cx="16" cy="21" rx="2" ry="1" fill="#FF4500"/>
      <circle cx="10" cy="12" r="2" fill="#fff"/>
      <circle cx="22" cy="12" r="2" fill="#fff"/>
      <circle cx="10" cy="12" r="1" fill="#FF4500"/>
      <circle cx="22" cy="12" r="1" fill="#FF4500"/>
    </svg>
  ),
  pinterest: (
    // Official Pinterest SVG
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#E60023"/>
      <path d="M16 10c-3.3 0-6 2.5-6 5.7 0 2.1 1.3 3.3 2.1 3.3.3 0 .5-.2.5-.5 0-.2-.1-.8-.1-1.1 0-.4-.2-.5-.4-.8-.3-.4-.1-1 .2-1.2.3-.2.7-.1 1 .2.3.4.5 1 .5 1.4 0 .5-.2 1.1-.2 1.4 0 .3.2.5.5.5 1.2 0 2.1-1.2 2.1-2.7 0-2.2-1.8-4-4-4z" fill="#fff"/>
    </svg>
  ),
  email: (
    // Official Email SVG
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#7a8797"/>
      <rect x="8" y="12" width="16" height="8" rx="2" fill="#fff"/>
      <path d="M8 12l8 6 8-6" stroke="#7a8797" strokeWidth="1.5"/>
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