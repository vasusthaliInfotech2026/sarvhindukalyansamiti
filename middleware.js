import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("admin_token")?.value;
  const expectedToken =
    process.env.ADMIN_SECRET_TOKEN || "shks_admin_authenticated";

  const isAuthenticated = token && token === expectedToken;

  // 1. अगर यूजर लॉगिन नहीं है और /admin/dashboard खोलने की कोशिश करे -> Login पर भेजें
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. अगर यूजर पहले से लॉगिन है और /admin/login खोले -> सीधे Dashboard पर भेजें
  if (pathname.startsWith("/admin/login") && isAuthenticated) {
    const dashUrl = new URL("/admin/dashboard", req.url);
    return NextResponse.redirect(dashUrl);
  }
  

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};