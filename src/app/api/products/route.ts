import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  const db = sql();

  const rows = await db`
    SELECT * FROM products
    WHERE is_visible = true
    ORDER BY created_at ASC
  `;

  const products = rows.map((row) => ({
    id: row.id,
    name_fr: row.name_fr,
    name_ar: row.name_ar,
    slug: row.slug,
    category: row.category,
    price: Number(row.price),
    old_price: row.old_price ? Number(row.old_price) : undefined,
    description: row.description,
    tagline: row.tagline,
    benefits: row.benefits ?? [],
    ingredients: row.ingredients ?? [],
    how_to_use: row.how_to_use,
    stock: row.stock,
    is_trending: row.is_trending,
    is_best_seller: row.is_best_seller,
    badge: row.badge,
    rating: Number(row.rating),
    reviews_count: row.reviews_count,
    color: row.color,
    gradient: row.gradient as [string, string],
    packaging: row.packaging,
  }));

  return NextResponse.json(products);
}
