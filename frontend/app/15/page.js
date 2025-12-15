import "../globals.css";
import "../profile/profile.css";
import Page15Client from "./Page15Client";

export const metadata = {
  title: "6th House – Ari Bhava",
  description: "Enemies, health, service, debts, daily work, litigation, and overcoming obstacles.",
  openGraph: {
    title: "6th House – Ari Bhava",
    description: "Enemies, health, service, debts, daily work, litigation, and overcoming obstacles.",
    url: "https://aheadterra.com/15",
    images: [
      {
        url: "https://aheadterra.com/images/ari1.png",
        width: 1200,
        height: 630,
        alt: "6th House – Ari Bhava",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "6th House – Ari Bhava",
    description: "Enemies, health, service, debts, daily work, litigation, and overcoming obstacles.",
    images: ["https://aheadterra.com/images/ari1.png"],
    site: "@your_twitter_handle",
  },
};

export default function Page() {
  return <Page15Client />;
}