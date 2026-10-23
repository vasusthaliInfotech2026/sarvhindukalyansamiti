import { NextResponse } from "next/server";
import Razorpay from "razorpay";

console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
console.log(
  "Razorpay Secret Loaded:",
  !!process.env.RAZORPAY_KEY_SECRET
);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const { amount } = await request.json();

    if (!amount || amount <= 50) {
      return NextResponse.json(
        { success: false, message: "Invalid amount! Please enter atleast 50" },
        { status: 400 }
      );
    }

    const options = {
      amount: Math.round(amount * 100), // ₹ → paise
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
      {
        success: false,
        message:
        error?.error?.description ||
        error?.description ||
        error?.message ||
        "Unable to create Razorpay order",
      },
      { status: 500 }
    );
  }
}