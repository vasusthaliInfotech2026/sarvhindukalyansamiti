import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl;
  const token = request.cookies.get("admin_token")?.value;

  if (url.pathname.startsWith("/admin") && url.pathname !== "/admin/login") {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};