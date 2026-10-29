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

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  if (!token) {
    return NextResponse.redirect(`${baseUrl}/donate?status=failed`);
  }

  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${token}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const captureData = await response.json();

    if (captureData.status === "COMPLETED") {
      const payerName = captureData.payer?.name?.given_name || "दानदाता";
      const receiptId = captureData.id;

      return NextResponse.redirect(
        `${baseUrl}/donate?status=success&receipt=${receiptId}&name=${encodeURIComponent(payerName)}`
      );
    } else {
      return NextResponse.redirect(`${baseUrl}/donate?status=failed`);
    }
  } catch (error) {
    console.error("Capture Error:", error);
    return NextResponse.redirect(`${baseUrl}/donate?status=failed`);
  }
}