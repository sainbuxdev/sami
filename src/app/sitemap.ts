import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.5 },
  ];

  let products: { slug: string; updatedAt: Date }[] = [];
  try {
    products = await prisma.product.findMany({
      where: { isAvailable: true },
      select: { slug: true, updatedAt: true },
    });
  } catch {
    // Database unavailable at build time - return static routes only.
  }

  return [
    ...staticRoutes,
    ...products.map((p) => ({
      url: `${siteUrl}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
