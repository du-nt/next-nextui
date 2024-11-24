import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwtToken } from "./utils";

const protectRoutes = ["/blog"];
const authRoutes = ["/login"];

export async function middleware(request: NextRequest) {
  const { url, nextUrl, cookies } = request;
  const token = cookies.get("access_token")?.value;

  const isVerified: boolean = !!token && (await !!verifyJwtToken(token));

  if (isVerified && authRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", url));
  }

  if (!isVerified && protectRoutes.includes(nextUrl.pathname)) {
    const searchParams = new URLSearchParams(nextUrl.searchParams);
    searchParams.set("next", nextUrl.pathname);

    return NextResponse.redirect(new URL(`/login?${searchParams}`, url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
