import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const validUser = process.env.ADMIN_USERNAME || "admin";
    const validPass = process.env.ADMIN_PASSWORD || "admin123";
    const sessionToken =
      process.env.ADMIN_SECRET_TOKEN || "shks_admin_authenticated";

    if (username === validUser && password === validPass) {
      const response = NextResponse.json({
        success: true,
        message: "लॉगिन सफल रहा!",
      });

      // Set HTTP-Only Cookie for 7 days
      response.cookies.set("admin_token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 Days
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "ईमेल/यूजरनेम या पासवर्ड गलत है।" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "लॉगिन प्रोसेस करने में सर्वर एरर आया।" },
      { status: 500 }
    );
  }
}

