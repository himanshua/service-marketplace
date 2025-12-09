import Image from "next/image";
import Link from "next/link";
import { shareItems } from "../data";

export async function generateStaticParams() {
  return Object.keys(shareItems).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const item = shareItems[params.slug];
  if (!item) return { title: "AheadTerra" };
  return {
    title: item.title,
    description: item.description,
    openGraph: {
      title: item.title,
      description: item.description,
      url: `https://aheadterra.com/share/${params.slug}`,
      images: [{ url: item.image, width: 1200, height: 630, alt: item.label }],
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
  const item = shareItems[params.slug];
  if (!item) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Content not found</h1>
        <Link href="/">Return home</Link>
      </main>
    );
  }

  return (
    <main style={{ padding: 40, maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
      <img
        src={item.image.startsWith("http") ? item.image : `https://aheadterra.com${item.image}`}
        alt={item.label}
        width={720}
        height={405}
        style={{ width: "100%", height: "auto", borderRadius: 12 }}
      />
      <h1 style={{ marginTop: 24 }}>{item.title}</h1>
      <p style={{ color: "#374045" }}>{item.description}</p>
      <p style={{ margin: "24px 0", color: "#213247", lineHeight: 1.6 }}>{item.body}</p>
      <Link href="/" style={{ color: "#1976d2", textDecoration: "underline" }}>
        View the full AheadTerra site
      </Link>
    </main>
  );
}