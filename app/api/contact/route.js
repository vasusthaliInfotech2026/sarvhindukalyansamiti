import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    // 1. MySQL Database (sarv_hindu_kalyan_samiti -> contact_messages) में सेव करें
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "sarv_hindu_kalyan_samiti",
    });

    await connection.execute(
      "INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone || null, subject || null, message],
    );
    await connection.end();

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Website Contact" <${process.env.EMAIL_USER}>`,
        replyTo: email,
        to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
        subject: subject
          ? `नया संदेश: ${subject}`
          : `नया संपर्क संदेश: ${name}`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6;">
            <h2>नया संपर्क फ़ॉर्म सबमिशन</h2>
            <p><strong>नाम:</strong> ${name}</p>
            <p><strong>मोबाइल:</strong> ${phone}</p>
            <p><strong>ईमेल:</strong> ${email}</p>
            <p><strong>विषय:</strong> ${subject || "N/A"}</p>
            <p><strong>संदेश:</strong><br/>${message}</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Backend Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
