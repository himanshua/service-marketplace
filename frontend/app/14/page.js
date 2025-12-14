import "../globals.css";
import "../profile/profile.css";
import Page14Client from "./Page14Client";

export const metadata = {
  title: "5th House – Putra Bhava",
  description: "Creativity, children, intelligence, learning, romance, and self-expression.",
  openGraph: {
    title: "5th House – Putra Bhava",
    description: "Creativity, children, intelligence, learning, romance, and self-expression.",
    url: "https://aheadterra.com/14",
    images: [
      {
        url: "https://aheadterra.com/images/putra.jpg",
        width: 1200,
        height: 630,
        alt: "5th House – Putra Bhava",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "5th House – Putra Bhava",
    description: "Creativity, children, intelligence, learning, romance, and self-expression.",
    images: ["https://aheadterra.com/images/putra.jpg"],
    site: "@your_twitter_handle", // optional, replace with your X handle
  },
};

export default function Page() {
  return <Page14Client />;
}