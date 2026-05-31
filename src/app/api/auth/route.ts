import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@asrarlalla.ma";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "asrar2026";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
