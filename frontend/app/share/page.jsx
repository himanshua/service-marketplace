export const metadata = {
  title: "Terra – Psychic & Jyotishvidya Readings",
  description: "Discover Terra and connect with the best online psychic.",
  openGraph: {
    title: "Terra – Psychic & Jyotishvidya Readings",
    description: "Discover Terra and connect with the best online psychic.",
    url: "https://aheadterra.com/share",
    images: [
      {
        url: "https://aheadterra.com/images/himanshu-tiwari-og.jpg",
        width: 1200,
        height: 630,
        alt: "Himanshu Tiwari – Terra Psychic Reading",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terra – Psychic & Jyotishvidya Readings",
    description: "Discover Terra and connect with the best online psychic.",
    images: ["https://aheadterra.com/images/himanshu-tiwari-og.jpg"],
  },
};

export default function SharePage() {
  return (
    <main style={{ padding: "4rem 1.5rem", maxWidth: 720, margin: "0 auto" }}>
      <h1>Terra – Psychic & Jyotishvidya Readings</h1>
      <p>Get your unique reading from Himanshu Tiwari! Connect now.</p>
    </main>
  );
}