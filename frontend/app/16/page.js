import "../globals.css";
import "../profile/profile.css";
import Page16Client from "./Page16Client";

export const metadata = {
  title: "7th House – Saptam Bhava",
  description: "Partnerships, marriage, contracts, open enemies, public relationships.",
  openGraph: {
    title: "7th House – Saptam Bhava",
    description: "Partnerships, marriage, contracts, open enemies, public relationships.",
    // point OG URL at the human-readable share page
    url: "https://aheadterra.com/share/saptam-bhava",
    images: [
      {
        url: "https://aheadterra.com/images/saptam.png",
        width: 1200,
        height: 630,
        alt: "7th House – Saptam Bhava",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "7th House – Saptam Bhava",
    description: "Partnerships, marriage, contracts, open enemies, public relationships.",
    images: ["https://aheadterra.com/images/saptam.png"],
    site: "@your_twitter_handle",
  },
};

export default function Page() {
  return <Page16Client />;
}