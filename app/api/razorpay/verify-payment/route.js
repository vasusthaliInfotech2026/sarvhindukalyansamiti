import { NextResponse } from "next/server";
import crypto from "crypto";
import mysql from "mysql2/promise";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  let connection;

  try {
    const body = await request.json();

    const {
      donorName,
      donorEmail,
      donorPhone,
      amount,
      purpose,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = body;

    // -----------------------------------------
    // 1. Validate required information
    // -----------------------------------------

    if (
      !donorName ||
      !donorEmail ||
      !donorPhone ||
      !amount ||
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Required payment information is missing.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // 2. Verify Razorpay signature
    // -----------------------------------------

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpayOrderId}|${razorpayPaymentId}`
      )
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      console.error("Invalid Razorpay signature");

      return NextResponse.json(
        {
          success: false,
          message: "Payment verification failed. Invalid signature.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // 3. Fetch order from Razorpay
    // -----------------------------------------

    const order = await razorpay.orders.fetch(
      razorpayOrderId
    );

    // Convert Razorpay paise to rupees
    const orderAmount = Number(order.amount) / 100;

    // -----------------------------------------
    // 4. Verify amount
    // -----------------------------------------

    if (orderAmount !== Number(amount)) {
      console.error(
        "Amount mismatch:",
        orderAmount,
        Number(amount)
      );

      return NextResponse.json(
        {
          success: false,
          message: "Payment amount verification failed.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // 5. Fetch payment details from Razorpay
    // -----------------------------------------

    const payment = await razorpay.payments.fetch(
      razorpayPaymentId
    );

    // -----------------------------------------
    // 6. Check payment status
    // -----------------------------------------

    if (payment.status !== "captured") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment has not been captured yet.",
          payment_status: payment.status,
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // 7. Connect to MySQL
    // -----------------------------------------

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database:
        process.env.DB_DATABASE ||
        "sarv_hindu_kalyan_samiti",
    });

    // -----------------------------------------
    // 8. Check if payment already exists
    // -----------------------------------------

    const [existingPayment] = await connection.execute(
      `
      SELECT id
      FROM donations
      WHERE razorpay_payment_id = ?
      LIMIT 1
      `,
      [razorpayPaymentId]
    );

    if (existingPayment.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Payment already verified.",
        payment_id: razorpayPaymentId,
      });
    }

    // -----------------------------------------
    // 9. Generate receipt number
    // -----------------------------------------

    const receiptNumber =
      `DON-${Date.now()}`;

    // -----------------------------------------
    // 10. Save donation in MySQL
    // -----------------------------------------

    const [result] = await connection.execute(
      `
      INSERT INTO donations
      (
        donor_name,
        donor_email,
        donor_phone,
        amount,
        currency,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        payment_method,
        payment_status,
        donation_purpose,
        receipt_number,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        donorName,
        donorEmail,
        donorPhone,
        orderAmount,
        order.currency || "INR",
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        payment.method || null,
        "Success",
        purpose || "General Donation",
        receiptNumber,
        JSON.stringify({
          razorpay_status: payment.status,
          razorpay_order_status: order.status,
        }),
      ]
    );

    // -----------------------------------------
    // 11. Return success
    // -----------------------------------------

    return NextResponse.json({
      success: true,
      message: "Payment verified and donation saved successfully.",
      donation_id: result.insertId,
      receipt_number: receiptNumber,
      payment_id: razorpayPaymentId,
      order_id: razorpayOrderId,
      amount: orderAmount,
    });
  } catch (error) {
    console.error(
      "Payment verification error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.error?.description ||
          error?.description ||
          error?.message ||
          "Unable to verify payment.",
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}