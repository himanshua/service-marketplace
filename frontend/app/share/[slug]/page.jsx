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
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="16" fill="#1877F2"/>
            <path d="M22 16.1C22 12.7 19.3 10 16 10C12.7 10 10 12.7 10 16.1C10 19.1 12.1 21.6 15 22V17H13V16H15V14.5C15 12.6 16.2 11.7 17.8 11.7C18.5 11.7 19.2 11.8 19.2 11.8V13.7H18.1C17 13.7 16.8 14.3 16.8 15V16H19L18.7 17H16.8V22C19.9 21.6 22 19.1 22 16.1Z" fill="white"/>
          </svg>
        </a>
        {/* WhatsApp */}
        <a href={`https://wa.me/?text=https://aheadterra.com/share/${params.slug}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="16" fill="#25D366"/>
            <path d="M16 10C12.7 10 10 12.7 10 16C10 19.3 12.7 22 16 22C19.3 22 22 19.3 22 16C22 12.7 19.3 10 16 10ZM16 20.5C13.5 20.5 11.5 18.5 11.5 16C11.5 13.5 13.5 11.5 16 11.5C18.5 11.5 20.5 13.5 20.5 16C20.5 18.5 18.5 20.5 16 20.5ZM18.2 17.3C18 17.2 17.7 17.1 17.5 17.2C17.3 17.3 17.1 17.5 17 17.7C16.9 17.8 16.7 17.9 16.5 17.8C15.3 17.3 14.5 16.2 14.4 14.9C14.4 14.7 14.5 14.5 14.7 14.3C14.8 14.2 15 14 15.1 13.8C15.2 13.6 15.2 13.3 15.1 13.1C15 12.9 14.8 12.7 14.6 12.6C14.4 12.5 14.1 12.5 13.9 12.6C13.3 12.9 12.9 13.4 12.8 14.1C12.6 15.3 13 16.5 13.9 17.4C14.8 18.3 16 18.7 17.2 18.5C17.9 18.4 18.4 17.9 18.7 17.3C18.8 17.1 18.8 16.8 18.7 16.6C18.6 16.4 18.4 16.2 18.2 17.3Z" fill="white"/>
          </svg>
        </a>
        {/* LinkedIn */}
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=https://aheadterra.com/share/${params.slug}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="16" fill="#0A66C2"/>
            <rect x="10" y="14" width="2" height="8" fill="white"/>
            <rect x="10" y="10" width="2" height="2" fill="white"/>
            <rect x="14" y="14" width="2" height="8" fill="white"/>
            <rect x="18" y="17" width="2" height="5" fill="white"/>
            <rect x="14" y="10" width="6" height="2" fill="white"/>
          </svg>
        </a>
        {/* Telegram */}
        <a href={`https://t.me/share/url?url=https://aheadterra.com/share/${params.slug}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Telegram">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="16" fill="#0088CC"/>
            <path d="M23 10l-2.7 12c-.2.8-.7 1-1.4.6l-3.8-2.8-1.8-.9c-.4-.2-.4-.6 0-.8l7.1-6.3c.3-.3.7 0 .6.4l-1.1 4.6c-.1.4-.5.6-.9.5l-2.1-.7c-.4-.1-.5-.5-.2-.8l4.7-4.2c.3-.3.7 0 .6.4z" fill="white"/>
          </svg>
        </a>
        {/* X (Twitter) */}
        <a href={`https://twitter.com/intent/tweet?url=https://aheadterra.com/share/${params.slug}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="16" fill="#000"/>
            <path d="M21.5 10h-2l-3.5 5-3.5-5h-2l4.5 6.5-4.5 6.5h2l3.5-5 3.5 5h2l-4.5-6.5z" fill="white"/>
          </svg>
        </a>
        {/* Reddit */}
        <a href={`https://www.reddit.com/submit?url=https://aheadterra.com/share/${params.slug}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Reddit">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="16" fill="#FF4500"/>
            <circle cx="16" cy="16" r="8" fill="white"/>
            <circle cx="13" cy="16" r="1.5" fill="#FF4500"/>
            <circle cx="19" cy="16" r="1.5" fill="#FF4500"/>
            <ellipse cx="16" cy="19" rx="3" ry="1.2" fill="#FF4500"/>
            <circle cx="12" cy="13" r="1" fill="#FF4500"/>
            <circle cx="20" cy="13" r="1" fill="#FF4500"/>
          </svg>
        </a>
        {/* Pinterest */}
        <a href={`https://pinterest.com/pin/create/button/?url=https://aheadterra.com/share/${params.slug}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Pinterest">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="16" fill="#E60023"/>
            <path d="M16 10c-3.3 0-6 2.5-6 5.7 0 2.1 1.3 3.3 2.1 3.3.3 0 .5-.2.5-.5 0-.2-.1-.8-.1-1.1 0-.4-.2-.5-.4-.8-.3-.4-.1-1 .2-1.2.3-.2.7-.1 1 .2.3.4.5 1 .5 1.4 0 .5-.2 1.1-.2 1.4 0 .3.2.5.5.5 1.2 0 2.1-1.2 2.1-2.7 0-2.2-1.8-4-4-4z" fill="white"/>
          </svg>
        </a>
        {/* Email */}
        <a href={`mailto:?subject=${encodeURIComponent(item.title)}&body=${encodeURIComponent(`Check this out: https://aheadterra.com/share/${params.slug}`)}`} target="_blank" rel="noopener noreferrer" aria-label="Share by Email">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="16" fill="#7a8797"/>
            <rect x="8" y="12" width="16" height="8" rx="2" fill="white"/>
            <path d="M8 12l8 6 8-6" stroke="#7a8797" strokeWidth="1.5"/>
          </svg>
        </a>
      </div>

      <Link href="/" style={{ color: "#1976d2", textDecoration: "underline" }}>
        View the full AheadTerra site
      </Link>
    </main>
  );
}