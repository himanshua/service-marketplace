import "../globals.css";
import "../profile/profile.css";
import Page12Client from "./Page12Client";

export const metadata = {
  title: "3rd House – Sahaja Bhava",
  description: "Effort, courage, skills, siblings, and progress through one’s own actions.",
  openGraph: {
    title: "3rd House – Sahaja Bhava",
    description: "Effort, courage, skills, siblings, and progress through one’s own actions.",
    url: "https://aheadterra.com/12",
    images: [
      {
        url: "https://aheadterra.com/images/sahaj1.png",
        width: 1200,
        height: 630,
        alt: "3rd House – Sahaja Bhava",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "3rd House – Sahaja Bhava",
    description: "Effort, courage, skills, siblings, and progress through one’s own actions.",
    images: ["https://aheadterra.com/images/sahaj1.png"],
    site: "@your_twitter_handle", // optional, replace with your X handle
  },
};

export default function Page12() {
  return <Page12Client />;
}

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="3rd House – Sahaja Bhava">
<meta name="twitter:description" content="Effort, courage, skills, siblings, and progress through one’s own actions.">
<meta name="twitter:image" content="https://aheadterra.com/images/sahaj1.png">
