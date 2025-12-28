export const metadata = {
  title: "9th House – Navam Bhava (नवम भाव) | AheadTerra",
  description: "Dharma, luck, higher learning, pilgrimage, and father — Navam Bhava.",
  openGraph: {
    title: "9th House – Navam Bhava",
    description: "Dharma, luck, higher learning, pilgrimage, and father — Navam Bhava.",
    url: "https://aheadterra.com/share/navam-bhava",
    images: [
      {
        url: "https://aheadterra.com/images/navam.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "9th House – Navam Bhava",
    images: ["https://aheadterra.com/images/navam.jpg"],
  },
};

import Page19Client from "./Page19Client";

export default function Page() {
  return <Page19Client />;
}
