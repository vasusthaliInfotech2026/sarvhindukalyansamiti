import { NextResponse } from "next/server";

const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

export async function POST(req) {
  try {
    const { amount, purpose, donor_name, donor_email, donor_phone } = await req.json();

    const accessToken = await getAccessToken();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // INR राशि को USD में कन्वर्ट (मानक विनिमय दर: ~85)
    const usdAmount = (Number(amount) / 85).toFixed(2);

    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          description: `सहयोग - ${purpose}`,
          custom_id: JSON.stringify({ donor_name, donor_email, donor_phone }),
          amount: {
            currency_code: "USD",
            value: Number(usdAmount) > 0 ? usdAmount.toString() : "1.00",
          },
        },
      ],
      application_context: {
        brand_name: "सर्व हिन्दू कल्याण समिति",
        landing_page: "BILLING",
        user_action: "PAY_NOW",
        return_url: `${baseUrl}/api/paypal/capture-order`,
        cancel_url: `${baseUrl}/donate?status=cancelled`,
      },
    };

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "PayPal ऑर्डर बनाने में समस्या आई।" },
        { status: 400 }
      );
    }

    const approveLink = data.links?.find((link) => link.rel === "approve")?.href;

    if (!approveLink) {
      return NextResponse.json(
        { success: false, message: "PayPal भुगतान लिंक प्राप्त नहीं हुआ।" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, redirect_url: approveLink });
  } catch (error) {
    console.error("PayPal Order Error:", error);
    return NextResponse.json(
      { success: false, message: "सर्वर से संपर्क विफल रहा।" },
      { status: 500 }
    );
  }
}