import { getJwtSecretKey, verifyJwtToken } from "@/utils";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const refreshToken = cookies().get("refresh_token")?.value;

  if (!refreshToken) {
    cookies().delete("access_token");
    cookies().delete("refresh_token");

    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const payload = await verifyJwtToken(refreshToken);

  const secret = getJwtSecretKey();
  const newAccessToken = await new SignJWT({
    username: payload?.username,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1min")
    .sign(secret);

  const newRefreshToken = await new SignJWT({
    username: payload?.username,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7days")
    .sign(secret);

  cookies().set({
    name: "access_token",
    value: newAccessToken,
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  cookies().set({
    name: "refresh_token",
    value: newRefreshToken,
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
