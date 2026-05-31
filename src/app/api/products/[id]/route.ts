import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const db = sql();

  const values: Record<string, unknown> = {};

  if (body.stock !== undefined) values.stock = body.stock;
  if (body.price !== undefined) values.price = body.price;
  if (body.is_visible !== undefined) values.is_visible = body.is_visible;
  if (body.is_trending !== undefined) values.is_trending = body.is_trending;
  if (body.is_best_seller !== undefined) values.is_best_seller = body.is_best_seller;
  if (body.badge !== undefined) values.badge = body.badge;

  const [updated] = await db`
    UPDATE products SET ${db(values)}
    WHERE id = ${id}
    RETURNING *
  `;

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}
