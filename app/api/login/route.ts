import { getJwtSecretKey } from "@/utils";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.username !== "admin" || body.password !== "admin") {
    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 400 }
    );
  }

  const secret = getJwtSecretKey();
  const accessToken = await new SignJWT({
    username: body.username,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1min")
    .sign(secret);

  const refreshToken = await new SignJWT({
    username: body.username,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7days")
    .sign(secret);

  cookies().set({
    name: "access_token",
    value: accessToken,
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  cookies().set({
    name: "refresh_token",
    value: refreshToken,
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
