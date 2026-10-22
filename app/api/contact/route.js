import { NextResponse } from "next/server";
import db from "@/lib/db1";
import nodemailer from "nodemailer";

export async function POST(request) {
  let connection;

  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      subject,
      message,
    } = body;

    // Basic validation
    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill all required fields.",
        },
        { status: 400 }
      );
    }

    // Get database connection
    connection = await db.getConnection();

    // Insert contact message
    const [result] = await connection.execute(
      `INSERT INTO contact_messages
       (name, email, phone, subject, message, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        name.trim(),
        email.trim(),
        phone.trim(),
        subject.trim(),
        message.trim(),
        "new",
      ]
    );
    

    return NextResponse.json(
      {
        success: true,
        message: "आपका संदेश सफलतापूर्वक भेज दिया गया है।",
        id: result.insertId,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );

  } finally {
    if (connection) {
      connection.release();
    }
  }
}