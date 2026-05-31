import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("product_id");
  const db = sql();

  let rows;
  if (productId) {
    rows = await db`
      SELECT * FROM reviews
      WHERE is_visible = true AND product_id = ${productId}
      ORDER BY created_at DESC
    `;
  } else {
    rows = await db`
      SELECT * FROM reviews
      WHERE is_visible = true
      ORDER BY created_at DESC
    `;
  }

  const reviews = rows.map((row) => ({
    id: row.id,
    name: row.customer_name,
    city: row.customer_city,
    rating: row.rating,
    text: row.text,
    productId: row.product_id,
    verified: row.is_verified,
    visible: row.is_visible,
    createdAt: row.created_at,
  }));

  return NextResponse.json(reviews);
}
