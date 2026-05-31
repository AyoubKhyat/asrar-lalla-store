import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  const db = sql();
  const rows = await db`SELECT key, value FROM site_settings`;

  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }

  return NextResponse.json({
    whatsappNumber: settings.whatsapp_number ?? "212600000000",
    freeShippingThreshold: Number(settings.free_shipping_threshold ?? "99"),
    promoBannerText: settings.promo_banner_text ?? "",
    promoBannerEnabled: settings.promo_banner_enabled === "true",
  });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const db = sql();

  const keyMap: Record<string, string> = {
    whatsappNumber: "whatsapp_number",
    freeShippingThreshold: "free_shipping_threshold",
    promoBannerText: "promo_banner_text",
    promoBannerEnabled: "promo_banner_enabled",
  };

  for (const [jsKey, value] of Object.entries(body)) {
    const dbKey = keyMap[jsKey];
    if (!dbKey) continue;
    await db`
      INSERT INTO site_settings (key, value) VALUES (${dbKey}, ${String(value)})
      ON CONFLICT (key) DO UPDATE SET value = ${String(value)}, updated_at = NOW()
    `;
  }

  return NextResponse.json({ ok: true });
}
