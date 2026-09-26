import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminArea =
    pathname.startsWith("/admin") || pathname.startsWith("/cybercon/admin");

  if (isAdminArea) {
    const loginPath = pathname.startsWith("/admin")
      ? "/admin/login"
      : "/cybercon/admin/login";

    if (pathname === loginPath) {
      return NextResponse.next();
    }

    const token = request.cookies.get("csc-admin-token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL(loginPath, request.url));
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL(loginPath, request.url));
    }

    // Authorisation is deliberately NOT done here: a cookie can be older than
    // the account's current role. Every page and API route checks the live
    // role through getCurrentUser() (the database), which is the single
    // source of truth. Middleware only proves the session exists.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/cybercon/admin/:path*"],
};
