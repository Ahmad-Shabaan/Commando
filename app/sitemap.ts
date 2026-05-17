import { MetadataRoute } from "next";
import sql from "@/lib/db";
import { SITE_URL } from "@/lib/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const questions = await sql`SELECT slug, created_at FROM questions WHERE slug IS NOT NULL`;

  const questionUrls = questions.map((q) => ({
    url: `${SITE_URL}/tajneed/${q.slug}`,
    lastModified: new Date(q.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/tajneed`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...questionUrls,
  ];
}
