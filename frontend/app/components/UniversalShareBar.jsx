"use client";
import { useMemo, useState, useEffect } from "react";
import Script from "next/script";

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
  shareChoices,
  shareImages,
  defaultShareKey,
  shareBaseUrl = "https://aheadterra.com/share",
}) {
  const [pendingPlatform, setPendingPlatform] = useState(null);

  const platformMeta = useMemo(
    () => sharePlatforms.reduce((acc, p) => ({ ...acc, [p.key]: p }), {}),
    []
  );

  const openShare = (platformKey, shareKey) => {
    const platform = platformMeta[platformKey];
    const payload = shareImages?.[shareKey];
    if (!platform || !payload) return;
    const targetUrl = payload.url || `${shareBaseUrl}/${shareKey}`;
    const shareHref = platform.buildUrl({
      url: targetUrl,
      title: payload.title || payload.label || "AheadTerra",
    });
    window.open(shareHref, "_blank", "noopener,noreferrer");
  };

  const handlePlatformClick = (platformKey) => {
    if (!shareChoices?.length) return;
    if (shareChoices.length === 1) {
      openShare(platformKey, shareChoices[0].key);
      return;
    }
    setPendingPlatform(platformKey);
  };

  const handleChoiceSelect = (choiceKey) => {
    if (!pendingPlatform) return;
    openShare(pendingPlatform, choiceKey);
    setPendingPlatform(null);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.a2a) window.a2a.init_all();
  }, [defaultShareKey]);

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
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h4 style={{ marginBottom: 12 }}>
              Choose what to share on {platformMeta[pendingPlatform].label}
            </h4>
            <div style={styles.choiceGrid}>
              {shareChoices.map((choice) => {
                const data = shareImages[choice.key];
                if (!data) return null;
                return (
                  <button
                    key={choice.key}
                    type="button"
                    style={styles.choiceCard}
                    onClick={() => handleChoiceSelect(choice.key)}
                  >
                    <img
                      src={data.image}
                      alt={data.label}
                      style={styles.choiceImage}
                    />
                    <span style={styles.choiceLabel}>{data.label}</span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              style={{ ...styles.iconBtn, backgroundColor: "#ccc", width: "100%", marginTop: 12 }}
              onClick={() => setPendingPlatform(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <Script src="https://static.addtoany.com/menu/page.js" strategy="lazyOnload" />
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
    width: "min(520px, 100%)",
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