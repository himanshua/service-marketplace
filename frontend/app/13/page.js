import "../globals.css";
import "../profile/profile.css";
import Page13Client from "./Page13Client";

export const metadata = {
  title: "4th House – Sukha Bhava",
  description: "Home, happiness, mother, property, inner peace, and emotional foundation.",
  openGraph: {
    title: "4th House – Sukha Bhava",
    description: "Home, happiness, mother, property, inner peace, and emotional foundation.",
    url: "https://aheadterra.com/13",
    images: [
      {
        url: "https://aheadterra.com/images/sukha.jpg", // <-- Make sure this matches your Sukha Bhava image!
        width: 1200,
        height: 630,
        alt: "4th House – Sukha Bhava",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "4th House – Sukha Bhava",
    description: "Home, happiness, mother, property, inner peace, and emotional foundation.",
    images: ["https://aheadterra.com/images/sukha.jpg"], // <-- Same here
    site: "@your_twitter_handle", // optional
  },
};

export default function Page13() {
  return <Page13Client />;
}