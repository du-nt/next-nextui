import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const token = cookies().get("access_token")?.value;

  if (!token) return NextResponse.json({ success: false }, { status: 401 });

  return NextResponse.json({ success: true, data: {} }, { status: 200 });
}
