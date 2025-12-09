import { shareItems } from "../data";

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
      images: [
        {
          url: item.image.startsWith("http")
            ? item.image
            : `https://aheadterra.com${item.image}`,
          width: 1200,
          height: 630,
          alt: item.label || item.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.description,
      images: [
        item.image.startsWith("http")
          ? item.image
          : `https://aheadterra.com${item.image}`,
      ],
    },
  };
}