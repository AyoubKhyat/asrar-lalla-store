import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

const PHONE_RE = /^[0-9+\s()-]{7,20}$/;

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const db = sql();
    const status = req.nextUrl.searchParams.get("status");

    let orders;
    if (status && status !== "all") {
      orders = await db`
        SELECT o.*, json_agg(json_build_object(
          'product_id', oi.product_id,
          'product_name', oi.product_name,
          'price', oi.price,
          'quantity', oi.quantity
        )) AS items
        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.id
        WHERE o.status = ${status}
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `;
    } else {
      orders = await db`
        SELECT o.*, json_agg(json_build_object(
          'product_id', oi.product_id,
          'product_name', oi.product_name,
          'price', oi.price,
          'quantity', oi.quantity
        )) AS items
        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.id
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `;
    }

    return NextResponse.json(orders.map(mapOrder));
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { customer, items, total } = body;
    const shippingCost = body.shippingCost ?? 0;

    if (!customer?.fullName || !customer?.phone || !customer?.city || !customer?.address) {
      return NextResponse.json({ error: "Missing customer info" }, { status: 400 });
    }
    if (typeof customer.fullName !== "string" || customer.fullName.length > 100) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }
    if (!PHONE_RE.test(customer.phone)) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }
    if (typeof customer.address !== "string" || customer.address.length > 500) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    for (const item of items) {
      if (!item.productId || !item.name || typeof item.price !== "number" || item.price <= 0) {
        return NextResponse.json({ error: "Invalid item" }, { status: 400 });
      }
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
        return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
      }
    }

    const db = sql();

    // Validate stock availability
    for (const item of items) {
      const [product] = await db`SELECT stock FROM products WHERE id = ${item.productId}`;
      if (!product) {
        return NextResponse.json({ error: `Product ${item.name} not found` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `${item.name} : stock insuffisant (${product.stock} disponible)` }, { status: 400 });
      }
    }

    const [order] = await db`
      INSERT INTO orders (customer_name, customer_phone, customer_city, customer_address, customer_notes, total, shipping_cost, status, source)
      VALUES (${customer.fullName}, ${customer.phone}, ${customer.city}, ${customer.address}, ${customer.notes || null}, ${total}, ${shippingCost}, 'new', 'website')
      RETURNING *
    `;

    for (const item of items) {
      await db`
        INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
        VALUES (${order.id}, ${item.productId}, ${item.name}, ${item.price}, ${item.quantity})
      `;
    }

    return NextResponse.json(mapOrder({
      ...order,
      items: items.map((i: { productId: string; name: string; price: number; quantity: number }) => ({
        product_id: i.productId,
        product_name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    }), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function mapOrder(row: Record<string, unknown>) {
  const items = Array.isArray(row.items) ? row.items : [];
  return {
    id: row.id,
    ref: row.ref,
    customer: {
      fullName: row.customer_name,
      phone: row.customer_phone,
      city: row.customer_city,
      address: row.customer_address,
      notes: row.customer_notes,
    },
    items: items.filter((i: Record<string, unknown>) => i.product_id !== null).map((i: Record<string, unknown>) => ({
      productId: i.product_id,
      name: i.product_name,
      price: Number(i.price),
      quantity: Number(i.quantity),
    })),
    total: Number(row.total),
    shippingCost: Number(row.shipping_cost),
    status: row.status,
    source: row.source,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
