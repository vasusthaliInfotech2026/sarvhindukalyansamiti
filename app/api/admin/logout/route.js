import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // admin_token कुकी को तुरंत एक्सपायर (delete) करें
  cookies().set({
    name: "admin_token",
    value: "",
    path: "/",
    maxAge: 0, 
  });

  return NextResponse.json({ success: true, message: "सफलतापूर्वक लॉगआउट हो गए" });
}