import type { MetadataRoute } from "next";
import { books } from "@daily-book/shared";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL || "https://rizhi.dev";

  const bookPages = books.map((b) => ({
    url: `${base}/book/${b.slug}`,
    lastModified: new Date(b.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...bookPages,
  ];
}
