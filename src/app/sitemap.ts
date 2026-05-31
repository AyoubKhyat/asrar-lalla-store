import type { MetadataRoute } from "next";
import { sql } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://asrarlalla.ma";

  const db = sql();
  const products = await db<{ slug: string; updated_at: string | null }[]>`SELECT slug, updated_at FROM products ORDER BY id`;

  const productPages = products.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/cart`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    ...productPages,
  ];
}
