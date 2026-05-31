import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await req.json();
  const db = sql();

  const [order] = await db`
    UPDATE orders SET status = ${status}
    WHERE id = ${id}
    RETURNING *
  `;

  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (status === "confirmed") {
    const items = await db`SELECT * FROM order_items WHERE order_id = ${id}`;
    for (const item of items) {
      await db`
        UPDATE products SET stock = GREATEST(0, stock - ${item.quantity})
        WHERE id = ${item.product_id}
      `;
    }
  }

  return NextResponse.json(order);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = sql();

  await db`DELETE FROM orders WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
