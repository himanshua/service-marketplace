import React from "react";
import { shareItems } from "../data";

export async function generateMetadata({ params }) {
  const item = shareItems[params.slug] || shareItems["default"];
  const imageUrl =
    item.ogImage ||
    (item.image &&
      (item.image.startsWith("http")
        ? item.image
        : `https://aheadterra.com${item.image}`)) ||
    "https://aheadterra.com/images/default-share.png";

  return {
    title: item.title || "AheadTerra",
    description: item.description || "",
    openGraph: {
      title: item.title || "AheadTerra",
      description: item.description || "",
      url: `https://aheadterra.com/share/${params.slug}`,
      images: [
        {
          url: imageUrl,
          width: item.ogWidth || 1200,
          height: item.ogHeight || 630,
          alt: item.title || "share image",
        },
      ],
      siteName: "AheadTerra",
    },
    twitter: {
      card: "summary_large_image",
      title: item.title || "AheadTerra",
      description: item.description || "",
      images: [imageUrl],
    },
  };
}

export default function SharePage({ params }) {
  const item = shareItems[params.slug] || shareItems["default"];
  const imageUrl =
    item.ogImage ||
    (item.image &&
      (item.image.startsWith("http")
        ? item.image
        : `https://aheadterra.com${item.image}`));

  return (
    <main style={{ padding: 24 }}>
      <h1>{item.title}</h1>
      <p>{item.description}</p>

      {/* Server-rendered image so Facebook/OG scrapers get a concrete <img> */}
      {imageUrl && (
        <div style={{ marginTop: 16 }}>
          <img
            src={imageUrl}
            alt={item.title || "share image"}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      )}
    </main>
  );
}