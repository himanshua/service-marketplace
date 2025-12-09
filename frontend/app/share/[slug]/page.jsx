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

      {/* Professional Share Icons */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", margin: "32px 0" }}>
        {/* Facebook */}
        <a href={`https://www.facebook.com/sharer/sharer.php?u=https://aheadterra.com/share/${params.slug}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#1877F3"/><path d="M21 16h-3v8h-4v-8h-2v-3h2v-2c0-2 1-3 3-3h3v3h-2c-.5 0-1 .5-1 1v1h3l-1 3z" fill="#fff"/></svg>
        </a>
        {/* WhatsApp */}
        <a href={`https://wa.me/?text=https://aheadterra.com/share/${params.slug}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#25D366"/><path d="M22 10a6 6 0 0 0-10 7.5l-1 3.5 3.5-1A6 6 0 0 0 22 10zm-6 11a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm2.2-4.3c-.3-.2-.7-.4-1-.2-.3.1-.6.5-.8.8-.2.2-.4.3-.7.2-1.2-.5-2-1.6-2.1-2.9 0-.3.1-.5.3-.7.2-.2.4-.5.5-.7.1-.2.1-.5 0-.7-.1-.2-.3-.4-.5-.5-.2-.1-.5-.1-.7 0-.6.3-1.1.8-1.2 1.5-.2 1.2.2 2.4 1.1 3.3.9.9 2.1 1.3 3.3 1.1.7-.1 1.2-.6 1.5-1.2.1-.2.1-.5 0-.7-.1-.2-.3-.4-.5-.5z" fill="#fff"/></svg>
        </a>
        {/* LinkedIn */}
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=https://aheadterra.com/share/${params.slug}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#0A66C2"/><rect x="10" y="14" width="2" height="8" fill="#fff"/><rect x="10" y="10" width="2" height="2" fill="#fff"/><rect x="14" y="14" width="2" height="8" fill="#fff"/><rect x="18" y="17" width="2" height="5" fill="#fff"/><rect x="14" y="10" width="6" height="2" fill="#fff"/></svg>
        </a>
        {/* Telegram */}
        <a href={`https://t.me/share/url?url=https://aheadterra.com/share/${params.slug}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Telegram">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#0088CC"/><path d="M23 10l-2.7 12c-.2.8-.7 1-1.4.6l-3.8-2.8-1.8-.9c-.4-.2-.4-.6 0-.8l7.1-6.3c.3-.3.7 0 .6.4l-1.1 4.6c-.1.4-.5.6-.9.5l-2.1-.7c-.4-.1-.5-.5-.2-.8l4.7-4.2c.3-.3.7 0 .6.4z" fill="#fff"/></svg>
        </a>
        {/* X (Twitter) */}
        <a href={`https://twitter.com/intent/tweet?url=https://aheadterra.com/share/${params.slug}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#000"/><path d="M21.5 10h-2l-3.5 5-3.5-5h-2l4.5 6.5-4.5 6.5h2l3.5-5 3.5 5h2l-4.5-6.5z" fill="#fff"/></svg>
        </a>
        {/* Instagram */}
        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Share on Instagram">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#E1306C"/><rect x="10" y="10" width="12" height="12" rx="4" fill="#fff"/><circle cx="16" cy="16" r="3" fill="#E1306C"/><circle cx="21" cy="11" r="1" fill="#E1306C"/></svg>
        </a>
      </div>

      <Link href="/" style={{ color: "#1976d2", textDecoration: "underline" }}>
        View the full AheadTerra site
      </Link>
    </main>
  );
}