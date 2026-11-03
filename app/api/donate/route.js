import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { sendEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      donor_name,
      donor_email,
      donor_phone,
      amount,
      donation_purpose,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (!donor_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donor_email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address to receive your donation receipt." },
        { status: 400 }
      );
    }

    // 1. चेक करें कि पेमेंट QR से हुआ है या Razorpay से
    const isQRPayment =
      razorpay_signature === "manual_qr_verified" ||
      razorpay_signature === "auto_qr_verified";

    // अगर Razorpay पेमेंट है, तो Signature Verify करें (QR पेमेंट के लिए UTR/Validation जाँच हटा दी गई है)
    if (!isQRPayment) {
      const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (generated_signature !== razorpay_signature) {
        return NextResponse.json(
          { success: false, error: "Payment verification failed!" },
          { status: 400 },
        );
      }
    }

    const paymentMethod = isQRPayment ? "UPI_QR" : "Razorpay";
    // QR पेमेंट के लिए शुरुआती स्टेटस 'pending' रहेगा (एडमिन वेरीफाई करेगा), जबकि Razorpay के लिए 'paid'
    const paymentStatus = isQRPayment ? "pending" : "paid";

    // 2. MySQL Database Connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "sarv_hindu_kalyan_samiti",
    });

    const receiptNo = `RCPT_DON_${Date.now()}`;

    // 3. 'donations' table में डेटा सेव करें
    await connection.execute(
      `INSERT INTO donations 
      (donor_name, donor_email, donor_phone, amount, currency, razorpay_order_id, razorpay_payment_id, razorpay_signature, payment_method, payment_status, donation_purpose, receipt_number) 
      VALUES (?, ?, ?, ?, 'INR', ?, ?, ?, ?, ?, ?, ?)`,
      [
        donor_name,
        donor_email || null,
        donor_phone,
        amount,
        razorpay_order_id,
        razorpay_payment_id || "UPI_QR_MANUAL",
        razorpay_signature,
        paymentMethod,
        paymentStatus,
        donation_purpose,
        receiptNo,
      ],
    );

    await connection.end();

    // 4. Email Notifications
    // Email errors are handled separately so a saved donation is not reported as failed.
    const adminEmail = process.env.RECEIVER_EMAIL || process.env.EMAIL_USER;
    const emailTasks = [];

    const escapeHtml = (value) =>
      String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

    const safeName = escapeHtml(donor_name);
    const safeEmail = escapeHtml(donor_email || "N/A");
    const safePhone = escapeHtml(donor_phone);
    const safeAmount = escapeHtml(amount);
    const safePurpose = escapeHtml(donation_purpose);
    const safeReceipt = escapeHtml(receiptNo);

    const adminEmailMissing = !adminEmail;
    if (adminEmailMissing) {
      console.error(
        "Donation saved, but admin notification cannot be sent: set RECEIVER_EMAIL in the environment."
      );
    }

    if (isQRPayment) {
      // QR donation is pending until an admin verifies it. Notify admin only.
      if (adminEmail) {
        emailTasks.push(
          sendEmail({
            to: adminEmail,
            subject: `⏳ वेरिफिकेशन लंबित (QR दान): ₹${amount} (${donor_name})`,
            html: `
              <div style="font-family: sans-serif; line-height: 1.6;">
                <h2 style="color: #d97706;">नया QR डोनेशन (सत्यापन लंबित)</h2>
                <p><strong>दानदाता का नाम:</strong> ${safeName}</p>
                <p><strong>मोबाइल:</strong> ${safePhone}</p>
                <p><strong>ईमेल:</strong> ${safeEmail}</p>
                <p><strong>राशि:</strong> ₹${safeAmount}</p>
                <p><strong>उद्देश्य (Purpose):</strong> ${safePurpose}</p>
                <p><strong>रसीद संख्या:</strong> ${safeReceipt}</p>
                <p style="color: #b45309; font-weight: bold;">कृपया एडमिन डैशबोर्ड (/admin) में जाकर भुगतान की पुष्टि करें और 'Verify Payment' पर क्लिक करें।</p>
              </div>
            `,
          })
        );
      }
    } else {
      // Razorpay signature has been verified: notify admin and send donor receipt.
      if (adminEmail) {
        emailTasks.push(
          sendEmail({
            to: adminEmail,
            subject: `💰 नया दान प्राप्त हुआ (Razorpay): ₹${amount} (${donor_name})`,
            html: `
              <div style="font-family: sans-serif; line-height: 1.6;">
                <h2 style="color: #c86428;">नया डोनेशन प्राप्त हुआ</h2>
                <p><strong>दानदाता का नाम:</strong> ${safeName}</p>
                <p><strong>मोबाइल:</strong> ${safePhone}</p>
                <p><strong>ईमेल:</strong> ${safeEmail}</p>
                <p><strong>राशि:</strong> ₹${safeAmount}</p>
                <p><strong>उद्देश्य (Purpose):</strong> ${safePurpose}</p>
                <p><strong>माध्यम (Method):</strong> ${paymentMethod}</p>
                <p><strong>Payment ID:</strong> ${escapeHtml(razorpay_payment_id)}</p>
                <p><strong>रसीद संख्या:</strong> ${safeReceipt}</p>
              </div>
            `,
          })
        );
      }

      emailTasks.push(
        sendEmail({
          to: donor_email,
          subject: "🙏 आपके दान के लिए धन्यवाद - सर्व हिन्दू कल्याण समिति",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e6d5b8; border-radius: 10px; background-color: #faf3e8;">
              <h2 style="color: #c86428; text-align: center;">जय श्री राम! 🙏</h2>
              <p>प्रिय <strong>${safeName} जी</strong>,</p>
              <p>सर्व हिन्दू कल्याण समिति के <strong>"${safePurpose}"</strong> प्रकल्प में ₹${safeAmount} के आपके पवित्र सहयोग के लिए हम आपके अत्यंत आभारी हैं।</p>
              <div style="background: #fff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #c86428;">
                <h3 style="margin-top: 0; color: #333;">दान रसीद विवरण:</h3>
                <p style="margin: 5px 0;"><strong>सहयोग राशि:</strong> ₹${safeAmount}</p>
                <p style="margin: 5px 0;"><strong>उद्देश्य:</strong> ${safePurpose}</p>
                <p style="margin: 5px 0;"><strong>माध्यम:</strong> ${paymentMethod}</p>
                <p style="margin: 5px 0;"><strong>रसीद संख्या:</strong> ${safeReceipt}</p>
                <p style="margin: 5px 0;"><strong>Payment ID:</strong> ${escapeHtml(razorpay_payment_id)}</p>
              </div>
              <p>आपका यह योगदान समाज के उत्थान और धर्म रक्षा में महत्वपूर्ण भूमिका निभाएगा।</p>
              <p style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
                <strong>सर्व हिन्दू कल्याण समिति</strong><br/>
                राष्ट्र सेवा, धर्म रक्षा और समाज उत्थान हेतु समर्पित
              </p>
            </div>
          `,
        })
      );
    }

    const emailResults = await Promise.allSettled(emailTasks);
    const failedEmails = emailResults.filter(
      (result) => result.status === "rejected"
    );
    if (failedEmails.length > 0) {
      failedEmails.forEach((result) =>
        console.error("Donation email failed:", result.reason)
      );
    }

    return NextResponse.json(
      {
        success: true,
        receipt_number: receiptNo,
        payment_status: paymentStatus,
        email_status: !adminEmailMissing && failedEmails.length === 0 ? "processed" : "failed_or_partial",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Donate API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
