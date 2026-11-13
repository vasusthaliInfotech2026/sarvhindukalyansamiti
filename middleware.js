import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("admin_token")?.value;
  const expectedToken =
    process.env.ADMIN_SECRET_TOKEN || "shks_admin_authenticated";

  const isAuthenticated = token && token === expectedToken;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith("/admin/login") && isAuthenticated) {
    const dashUrl = new URL("/admin/dashboard", req.url);
    return NextResponse.redirect(dashUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
