import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { createHmac, timingSafeEqual } from "node:crypto";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";

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

function verifyRazorpaySignature(orderId, paymentId, receivedSignature) {
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret || !orderId || !paymentId || !receivedSignature) {
    return false;
  }

  const expectedSignature = createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const expected = Buffer.from(expectedSignature, "hex");
  const received = Buffer.from(String(receivedSignature), "hex");

  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}

async function sendMemberEmail({ label, to, subject, html, text }) {
  try {
    const result = await sendEmail({ to, subject, html, text });

    if (result?.mocked === true) {
      return { sent: false, mocked: true };
    }

    return { sent: true, mocked: false };
  } catch (error) {
    console.error(`[MEMBER EMAIL] FAILED: ${label} email could not be sent.`, {
      recipient: to,
      message: error?.message || String(error),
      stack: error?.stack,
    });

    return { sent: false, mocked: false };
  }
}

export async function POST(request) {
  let connection;

  try {
    const body = await request.json();

    const full_name = String(body.full_name || "").trim();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const phone = String(body.phone || "").trim();
    const address = String(body.address || "").trim();
    const city = String(body.city || "").trim();
    const state = String(body.state || "").trim();
    const pincode = String(body.pincode || "").trim();
    const membership_type = String(
      body.membership_type || "सामान्य सदस्य",
    ).trim();
    const role = String(body.role || "").trim();
    const membership_fee = Number(body.membership_fee);

    const razorpay_order_id = String(body.razorpay_order_id || "").trim();
    const razorpay_payment_id = String(body.razorpay_payment_id || "").trim();
    const razorpay_signature = String(body.razorpay_signature || "").trim();

    if (
      !full_name ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !membership_type ||
      !role
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "कृपया सभी आवश्यक जानकारी भरें। ईमेल पता अनिवार्य है।",
        },
        { status: 400 },
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { success: false, error: "कृपया सही ईमेल पता दर्ज करें।" },
        { status: 400 },
      );
    }

    if (!Number.isFinite(membership_fee) || membership_fee <= 0) {
      return NextResponse.json(
        { success: false, error: "कृपया सही सदस्यता शुल्क चुनें।" },
        { status: 400 },
      );
    }

    const isQRManual = razorpay_signature === "qr_manual_verified";

    let paymentStatus;
    let memberStatus;
    let paymentMethodName;

    if (isQRManual) {
      paymentStatus = "pending";
      memberStatus = "Pending";
      paymentMethodName = "UPI QR (Verification Pending)";
    } else {
      const signatureValid = verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      );

      if (!signatureValid) {
        return NextResponse.json(
          {
            success: false,
            error:
              "भुगतान सत्यापित नहीं हो सका। कृपया सहायता के लिए समिति से संपर्क करें।",
          },
          { status: 400 },
        );
      }

      paymentStatus = "paid";
      memberStatus = "Active";
      paymentMethodName = "Razorpay Gateway";
    }

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "sarv_hindu_kalyan_samiti",
    });

    await connection.beginTransaction();

    const [existingUsers] = await connection.execute(
      "SELECT id FROM members WHERE email = ? LIMIT 1",
      [email],
    );

    if (existingUsers.length > 0) {
      await connection.rollback();
      await connection.end();
      connection = null;

      return NextResponse.json(
        {
          success: false,
          alreadyRegistered: true,
          error:
            "यह ईमेल आईडी पहले से ही पंजीकृत है। कृपया किसी अन्य ईमेल आईडी का उपयोग करें।",
        },
        { status: 409 },
      );
    }

    const [memberResult] = await connection.execute(
      `INSERT INTO members
       (full_name, email, phone, address, city, state, pincode,
        membership_type, role, membership_fee, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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
        memberStatus,
      ],
    );

    const memberId = memberResult.insertId;
    const receiptNo = `RCPT_${Date.now()}`;

    await connection.execute(
      `INSERT INTO member_payments
       (member_id, amount, currency, razorpay_order_id,
        razorpay_payment_id, razorpay_signature, payment_method,
        payment_status, receipt_number)
       VALUES (?, ?, 'INR', ?, ?, ?, ?, ?, ?)`,
      [
        memberId,
        membership_fee,
        razorpay_order_id || "manual_order",
        razorpay_payment_id || "manual_payment",
        razorpay_signature,
        paymentMethodName,
        paymentStatus,
        receiptNo,
      ],
    );

    await connection.commit();
    await connection.end();
    connection = null;

    const adminEmail = process.env.RECEIVER_EMAIL;

    const safeName = escapeHtml(full_name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeMembershipType = escapeHtml(membership_type);
    const safeRole = escapeHtml(role);
    const safeReceiptNo = escapeHtml(receiptNo);
    const safeOrderId = escapeHtml(razorpay_order_id || "manual_order");
    const safePaymentId = escapeHtml(razorpay_payment_id || "manual_payment");

    const adminSubject = isQRManual
      ? `⚠️ भुगतान सत्यापन लंबित: ${full_name} (₹${membership_fee})`
      : `नया सदस्य पंजीकरण - भुगतान सफल: ${full_name} (₹${membership_fee})`;

    const adminHeading = isQRManual
      ? "नया QR पंजीकरण - भुगतान सत्यापन लंबित है"
      : "नया सदस्य पंजीकरण और भुगतान सफल";

    const adminText = [
      adminHeading,
      `नाम: ${full_name}`,
      `मोबाइल: ${phone}`,
      `ईमेल: ${email}`,
      `सदस्यता प्रकार: ${membership_type}`,
      `सेवा क्षेत्र: ${role}`,
      `राशि: ₹${membership_fee}`,
      `भुगतान स्थिति: ${paymentStatus}`,
      `रसीद संख्या: ${receiptNo}`,
      `Payment ID: ${razorpay_payment_id || "N/A"}`,
    ].join("\n");

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #333;">
        <h2 style="color: ${isQRManual ? "#d97706" : "#16a34a"};">
          ${adminHeading}
        </h2>
        <p><strong>पूरा नाम:</strong> ${safeName}</p>
        <p><strong>मोबाइल:</strong> ${safePhone}</p>
        <p><strong>ईमेल:</strong> ${safeEmail}</p>
        <p><strong>सदस्यता प्रकार:</strong> ${safeMembershipType}</p>
        <p><strong>सेवा क्षेत्र:</strong> ${safeRole}</p>
        <p><strong>राशि:</strong> ₹${membership_fee}</p>
        <p><strong>भुगतान स्थिति:</strong> ${paymentStatus}</p>
        <p><strong>रसीद संख्या:</strong> ${safeReceiptNo}</p>
        <p><strong>Payment ID:</strong> ${safePaymentId}</p>
        <p><strong>Order ID:</strong> ${safeOrderId}</p>
      </div>
    `;

    if (adminEmail) {
      await sendMemberEmail({
        label: isQRManual
          ? "Admin pending-verification"
          : "Admin payment-success",
        to: adminEmail,
        subject: adminSubject,
        text: adminText,
        html: adminHtml,
      });
    } else {
      console.error(
        "[MEMBER EMAIL] FAILED: RECEIVER_EMAIL is not configured. Admin notification was not sent.",
      );
    }

    const memberSubject = isQRManual
      ? "⏳ आपका सदस्यता आवेदन प्राप्त हुआ - भुगतान सत्यापन लंबित"
      : "🙏 सदस्यता भुगतान सफल एवं रसीद - सर्व हिन्दू कल्याण समिति";

    const memberStatusText = isQRManual
      ? "आपका भुगतान सत्यापन के लिए लंबित है। समिति की टीम भुगतान की पुष्टि करने के बाद आपसे संपर्क करेगी।"
      : "सर्व हिन्दू कल्याण समिति परिवार में आपका हार्दिक स्वागत है। आपका सदस्यता भुगतान सफल रहा है।";

    const memberHtml = `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 20px;
        border: 1px solid #e6d5b8;
        border-radius: 10px;
        background-color: #faf3e8;
        line-height: 1.7;
        color: #333;
      ">
        <h2 style="color: #c86428; text-align: center;">
          जय श्री राम! 🙏
        </h2>

        <p>प्रिय <strong>${safeName} जी</strong>,</p>
        <p>${memberStatusText}</p>

        <div style="
          background: #fff;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid ${isQRManual ? "#d97706" : "#16a34a"};
        ">
          <h3 style="margin-top: 0; color: #333;">
            ${isQRManual ? "पंजीकरण विवरण" : "भुगतान एवं रसीद विवरण"}
          </h3>
          <p><strong>सदस्यता प्रकार:</strong> ${safeMembershipType}</p>
          <p><strong>सेवा क्षेत्र:</strong> ${safeRole}</p>
          <p><strong>राशि:</strong> ₹${membership_fee}</p>
          <p><strong>भुगतान स्थिति:</strong> ${isQRManual ? "सत्यापन लंबित" : "सफल"}</p>
          <p><strong>रसीद / संदर्भ संख्या:</strong> ${safeReceiptNo}</p>
          ${
            isQRManual
              ? ""
              : `<p><strong>Payment ID:</strong> ${safePaymentId}</p>`
          }
        </div>

        <p style="margin-top: 25px; text-align: center; color: #666; font-size: 14px;">
          <strong>सर्व हिन्दू कल्याण समिति</strong>
        </p>
      </div>
    `;

    await sendMemberEmail({
      label: isQRManual
        ? "Member pending-confirmation"
        : "Member payment-receipt",
      to: email,
      subject: memberSubject,
      text: [
        "जय श्री राम!",
        `प्रिय ${full_name} जी,`,
        memberStatusText,
        `सदस्यता प्रकार: ${membership_type}`,
        `सेवा क्षेत्र: ${role}`,
        `राशि: ₹${membership_fee}`,
        `भुगतान स्थिति: ${isQRManual ? "सत्यापन लंबित" : "सफल"}`,
        `रसीद / संदर्भ संख्या: ${receiptNo}`,
      ].join("\n"),
      html: memberHtml,
    });

    return NextResponse.json(
      {
        success: true,
        memberId,
        receiptNo,
        paymentStatus,
        message: "सदस्यता पंजीकरण सफलतापूर्वक दर्ज हो गया है।",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[MEMBER API] FAILED:", {
      message: error?.message || String(error),
      stack: error?.stack,
    });

    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("[MEMBER API] Database rollback failed:", rollbackError);
      }

      try {
        await connection.end();
      } catch (closeError) {
        console.error(
          "[MEMBER API] Database connection close failed:",
          closeError,
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "पंजीकरण पूरा नहीं हो सका। कृपया दोबारा प्रयास करें।",
      },
      { status: 500 },
    );
  }
}
