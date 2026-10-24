import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const ADMIN_USER = process.env.ADMIN_USERNAME;
    const ADMIN_PASS = process.env.ADMIN_PASSWORD;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      cookies().set({
        name: "admin_token",
        value: "authenticated_true_session",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24,
      });

      return NextResponse.json({ success: true, message: "लॉगिन सफल!" });
    }

    return NextResponse.json(
      { success: false, error: "अमान्य यूजरनेम या पासवर्ड!" },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "सर्वर त्रुटि" },
      { status: 500 }
    );
  }
}
