import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, purpose, full_name, email, phone } = body;

    const merchantKey = process.env.PAYU_MERCHANT_KEY?.trim();
    const merchantSalt = process.env.PAYU_MERCHANT_SALT?.trim();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    
    // Yahan trim() aur toLowerCase() zaroor lagayein
    const payuMode = (process.env.PAYU_MODE?.trim() || "test").toLowerCase();

    if (!merchantKey || !merchantSalt) {
      return NextResponse.json(
        {
          success: false,
          message: ".env.local me PAYU_MERCHANT_KEY ya PAYU_MERCHANT_SALT uplabdh nahi hai.",
        },
        { status: 500 }
      );
    }

    const txnid = "TXN_" + Date.now();
    const formattedAmount = Number(amount || 51).toFixed(2);
    const productInfo = (purpose || "सदस्यता शुल्क").trim().slice(0, 100);
    const firstname = (full_name || "Volunteer").trim().slice(0, 50);
    const userEmail = (email || "donor@domain.com").trim();
    const userPhone = (phone || "9999999999").trim();

    // PayU SHA-512 Hash string:
    const hashString = `${merchantKey}|${txnid}|${formattedAmount}|${productInfo}|${firstname}|${userEmail}|||||||||||${merchantSalt}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    // Live URL vs Test URL
    const actionUrl =
      payuMode === "live"
        ? "https://secure.payu.in/_payment"
        : "https://test.payu.in/_payment";

    // Debugging ke liye terminal me print karke check karein
    console.log("Current PayU Mode:", payuMode, "Target URL:", actionUrl);

    const payuParams = {
      key: merchantKey,
      txnid: txnid,
      amount: formattedAmount,
      productinfo: productInfo,
      firstname: firstname,
      email: userEmail,
      phone: userPhone,
      surl: `${baseUrl}/api/payu/response`,
      furl: `${baseUrl}/api/payu/response`,
      hash: hash,
      action: actionUrl,
    };

    return NextResponse.json({ success: true, params: payuParams });
  } catch (error) {
    console.error("PayU Create Order Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "PayU process fail hua." },
      { status: 500 }
    );
  }
}