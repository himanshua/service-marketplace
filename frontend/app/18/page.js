import "../globals.css";
import "../profile/profile.css";
import Page18Client from "./Page18Client";

export const metadata = {
  title: "8th House – Ashtam Bhava",
  description: "Transformation, shared resources, inheritances, occult knowledge, deep intimacy.",
  openGraph: {
    title: "8th House – Ashtam Bhava",
    description: "Transformation, shared resources, inheritances, occult knowledge, deep intimacy.",
    // point OG URL at the human-readable share page
    url: "https://aheadterra.com/share/ashtam-bhava",
    images: [
      {
        url: "https://aheadterra.com/images/ashtam.jpg",
        width: 1200,
        height: 630,
        alt: "8th House – Ashtam Bhava",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "8th House – Ashtam Bhava",
    description: "Transformation, shared resources, inheritances, occult knowledge, deep intimacy.",
    images: ["https://aheadterra.com/images/ashtam.jpg"],
    site: "@your_twitter_handle",
  },
};

export default function Page() {
  return <Page18Client />;
}
