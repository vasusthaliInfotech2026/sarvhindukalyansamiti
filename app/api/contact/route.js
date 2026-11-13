import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { sendEmail } from "@/lib/email";

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

export async function POST(request) {
  let connection;

  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email and message are required.",
        },
        { status: 400 },
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide a valid email address.",
        },
        { status: 400 },
      );
    }

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "sarv_hindu_kalyan_samiti",
    });

    await connection.execute(
      `INSERT INTO contact_messages
       (name, email, phone, subject, message)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone || null, subject || null, message],
    );

    await connection.end();
    connection = null;

    let emailSent = false;
    let emailMocked = false;

    try {
      const adminEmail = process.env.RECEIVER_EMAIL;

      if (!adminEmail) {
        throw new Error("RECEIVER_EMAIL is not configured.");
      }

      const emailResult = await sendEmail({
        to: adminEmail,

        replyTo: email,

        subject: subject
          ? `नया संपर्क संदेश: ${subject}`
          : `नया संपर्क संदेश: ${name}`,

        text: [
          "नया संपर्क फ़ॉर्म सबमिशन",
          `नाम: ${name}`,
          `मोबाइल: ${phone || "N/A"}`,
          `ईमेल: ${email}`,
          `विषय: ${subject || "N/A"}`,
          `संदेश: ${message}`,
        ].join("\n"),

        html: `
          <div style="
            font-family: Arial, sans-serif;
            line-height: 1.7;
            color: #333;
          ">

            <h2 style="color: #c86428;">
              नया संपर्क फ़ॉर्म सबमिशन
            </h2>

            <p>
              <strong>नाम:</strong>
              ${escapeHtml(name)}
            </p>

            <p>
              <strong>मोबाइल:</strong>
              ${escapeHtml(phone || "N/A")}
            </p>

            <p>
              <strong>ईमेल:</strong>
              ${escapeHtml(email)}
            </p>

            <p>
              <strong>विषय:</strong>
              ${escapeHtml(subject || "N/A")}
            </p>

            <p>
              <strong>संदेश:</strong>
            </p>

            <div style="
              white-space: pre-wrap;
              padding: 12px;
              background: #faf3e8;
              border-left: 4px solid #c86428;
            ">
              ${escapeHtml(message)}
            </div>

          </div>
        `,
      });

      emailMocked = emailResult?.mocked === true;
      emailSent = !emailMocked;
    } catch (emailError) {
      console.error("[CONTACT EMAIL] FAILED: Admin email could not be sent.", {
        message: emailError?.message || String(emailError),
        stack: emailError?.stack,
      });
    }

    return NextResponse.json(
      {
        success: true,
        email_sent: emailSent,
        email_mocked: emailMocked,
        message: "Your enquiry has been submitted successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[CONTACT API] FAILED:", {
      message: error?.message || String(error),
      stack: error?.stack,
    });

    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.error(
          "[CONTACT API] Database connection close failed:",
          closeError,
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unable to submit your enquiry right now. Please try again.",
      },
      { status: 500 },
    );
  }
}
