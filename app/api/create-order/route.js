import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error("Razorpay credentials are missing");

      return NextResponse.json(
        {
          success: false,
          message: "Razorpay configuration is missing",
        },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    const { amount } = await request.json();

    if (!amount || amount <= 50) {  
      return NextResponse.json(
        { success: false, message: "Invalid amount! Please enter at least 50" },
        { status: 400 }
      );
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `donation_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Razorpay order error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Unable to create Razorpay order" },
      { status: 500 }
    );
  }
}
