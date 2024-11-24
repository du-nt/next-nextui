import { getJwtSecretKey } from "@/utils";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.username === "admin" && body.password === "admin") {
    const secret = getJwtSecretKey();
    const token = await new SignJWT({
      username: body.username,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("10mins")
      .sign(secret);

    cookies().set({
      name: "access_token",
      value: token,
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    return NextResponse.json(
      { success: true, message: "Login successful" },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { success: false, message: "Login failed" },
    { status: 400 }
  );
}
