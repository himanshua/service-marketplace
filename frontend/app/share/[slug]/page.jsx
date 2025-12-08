import { notFound } from "next/navigation";
import { shareImages } from "../data";

export function generateStaticParams() {
  return Object.keys(shareImages).map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const item = shareImages[params.slug];
  if (!item) return {};
  return {
    title: item.title,
    description: item.description,
    alternates: { canonical: item.canonical },
    openGraph: {
      title: item.title,
      description: item.description,
      url: `https://aheadterra.com/share/${params.slug}`,
      images: [{ url: item.image, width: 1200, height: 630, alt: item.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.description,
      images: [item.image],
    },
  };
}

export default function SharePage({ params }) {
  const item = shareImages[params.slug];
  if (!item) return notFound();

  return (
    <main style={{ padding: "64px 24px", textAlign: "center" }}>
      <h1 style={{ marginBottom: 12 }}>{item.title}</h1>
      <p style={{ marginBottom: 24, color: "#49596a" }}>{item.description}</p>
      <img
        src={item.image}
        alt={item.title}
        style={{ maxWidth: 500, width: "100%", borderRadius: 16, boxShadow: "0 20px 45px rgba(0,0,0,0.2)" }}
      />
      <p style={{ marginTop: 24, fontSize: 14, color: "#3a4d63" }}>
        Share link:{" "}
        <strong>https://aheadterra.com/share/{params.slug}</strong>
      </p>
      <a
        href={item.canonical}
        style={{ display: "inline-block", marginTop: 10, color: "#1976d2", textDecoration: "underline" }}
      >
        View full content
      </a>
    </main>
  );
}