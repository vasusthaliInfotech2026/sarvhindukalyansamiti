import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import db from "@/lib/db1";

const ALLOWED_FEES = [51, 101, 201, 501, 1001, 1100, 2100, 2500, 5100];

export async function POST(request) {
  let connection;

  try {
    const body = await request.json();

    const {
      full_name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      membership_type,
      role,
      membership_fee,
    } = body;

    const amount = Number(membership_fee);

    // Basic validation
    if (
      !full_name ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !membership_type
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill all required fields.",
        },
        { status: 400 }
      );
    }

    // Validate membership fee
    if (!ALLOWED_FEES.includes(amount)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid membership fee selected.",
        },
        { status: 400 }
      );
    }

    // Check duplicate email
    const [existingEmail] = await db.execute(
      "SELECT id, status FROM members WHERE email = ? LIMIT 1",
      [email.trim()]
    );

    if (existingEmail.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A member with this email address is already registered.",
        },
        { status: 409 }
      );
    }

    // Check duplicate phone
    const [existingPhone] = await db.execute(
      "SELECT id, status FROM members WHERE phone = ? LIMIT 1",
      [phone.trim()]
    );

    if (existingPhone.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A member with this phone number is already registered.",
        },
        { status: 409 }
      );
    }

    // Create Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `MEM-${Date.now()}`,
      notes: {
        purpose: "Membership Registration",
        membership_type: membership_type,
      },
    });

    // Create member as Pending
    const [memberResult] = await db.execute(
      `
      INSERT INTO members
      (
        full_name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        membership_type,
        role,
        membership_fee,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
      `,
      [
        full_name.trim(),
        email.trim(),
        phone.trim(),
        address.trim(),
        city.trim(),
        state.trim(),
        pincode.trim(),
        membership_type,
        role ? role.trim() : null,
        amount,
      ]
    );

    const memberId = memberResult.insertId;

    // Create payment record
    await db.execute(
      `
      INSERT INTO member_payments
      (
        member_id,
        amount,
        currency,
        razorpay_order_id,
        payment_status
      )
      VALUES (?, ?, ?, ?, 'Created')
      `,
      [
        memberId,
        amount,
        "INR",
        order.id,
      ]
    );

    return NextResponse.json({
      success: true,
      member_id: memberId,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    });
  } catch (error) {
    console.error("Create Membership Order Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to create membership payment order.",
      },
      { status: 500 }
    );
  }
}