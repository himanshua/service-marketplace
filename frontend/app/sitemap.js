
const baseUrl = "https://aheadterra.com";

export default function sitemap() {
  const routes = [
    "",
    "/services",
    "/profile",
    "/share",
    "/login",
    "/signup",
  ];

  const now = new Date().toISOString();

  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1.0 : 0.6,
  }));
}