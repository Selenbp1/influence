import type { MetadataRoute } from "next";
import { getPortfolio } from "@/lib/api";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const portfolio = await getPortfolio();
  const now = new Date();
  const staticRoutes = ["", "/about", "/influencers", "/campaign", "/portfolio", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  return [
    ...staticRoutes,
    ...portfolio.map((item) => ({
      url: `${site.url}/portfolio/${item.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
