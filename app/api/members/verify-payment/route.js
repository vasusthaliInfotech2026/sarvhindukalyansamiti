import { NextResponse } from "next/server";
import crypto from "crypto";
import db from "@/lib/db1";

export async function POST(request) {
  let connection;

  try {
    const body = await request.json();

    const {
      member_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (
      !member_id ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Incomplete payment information.",
        },
        { status: 400 }
      );
    }

    // Find member
    const [members] = await db.execute(
      "SELECT * FROM members WHERE id = ? LIMIT 1",
      [member_id]
    );

    if (members.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Member record not found.",
        },
        { status: 404 }
      );
    }

    const member = members[0];

    // Find payment
    const [payments] = await db.execute(
      `
      SELECT *
      FROM member_payments
      WHERE member_id = ?
      AND razorpay_order_id = ?
      LIMIT 1
      `,
      [member_id, razorpay_order_id]
    );

    if (payments.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment record not found.",
        },
        { status: 404 }
      );
    }

    // Generate Razorpay signature
    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    // Compare signatures
    if (generatedSignature !== razorpay_signature) {
      await db.execute(
        `
        UPDATE member_payments
        SET
          razorpay_payment_id = ?,
          razorpay_signature = ?,
          payment_status = 'Failed',
          notes = ?
        WHERE member_id = ?
        AND razorpay_order_id = ?
        `,
        [
          razorpay_payment_id,
          razorpay_signature,
          "Payment signature verification failed.",
          member_id,
          razorpay_order_id,
        ]
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Payment verification failed. Please contact the committee.",
        },
        { status: 400 }
      );
    }

    // Generate receipt number
    const receiptNumber =
      `MEM-${new Date().getFullYear()}-` +
      String(member_id).padStart(6, "0");

    // Update payment
    await db.execute(
      `
      UPDATE member_payments
      SET
        razorpay_payment_id = ?,
        razorpay_signature = ?,
        payment_status = 'Success',
        receipt_number = ?,
        notes = ?
      WHERE member_id = ?
      AND razorpay_order_id = ?
      `,
      [
        razorpay_payment_id,
        razorpay_signature,
        receiptNumber,
        "Membership payment successfully verified.",
        member_id,
        razorpay_order_id,
      ]
    );

    // Activate member
    await db.execute(
      `
      UPDATE members
      SET status = 'Active'
      WHERE id = ?
      `,
      [member_id]
    );

    return NextResponse.json({
      success: true,
      message:
        "Membership registration and payment completed successfully.",
      member_id: member_id,
      receipt_number: receiptNumber,
    });
  } catch (error) {
    console.error(
      "Membership Payment Verification Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to verify membership payment.",
      },
      { status: 500 }
    );
  }
}