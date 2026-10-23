import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(request) {
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
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    // 1. Razorpay Signature Verify करें (सुरक्षा के लिए)
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Payment verification failed!" },
        { status: 400 }
      );
    }

    // 2. MySQL Database Connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "sarv_hindu_kalyan_samiti",
    });

    try {
      await connection.beginTransaction();

      // A. 'members' table में डेटा इंसर्ट करें
      const [memberResult] = await connection.execute(
        `INSERT INTO members 
        (full_name, email, phone, address, city, state, pincode, membership_type, role, membership_fee, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')`,
        [
          full_name,
          email || null,
          phone,
          address,
          city,
          state,
          pincode,
          membership_type,
          role,
          membership_fee,
        ]
      );

      const memberId = memberResult.insertId;
      const receiptNo = `RCPT_${Date.now()}`;

      // B. 'member_payments' table में पेमेंट रिकॉर्ड सेव करें
      await connection.execute(
        `INSERT INTO member_payments 
        (member_id, amount, currency, razorpay_order_id, razorpay_payment_id, razorpay_signature, payment_method, payment_status, receipt_number) 
        VALUES (?, ?, 'INR', ?, ?, ?, 'Razorpay', 'paid', ?)`,
        [
          memberId,
          membership_fee,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          receiptNo,
        ]
      );

      await connection.commit();
      await connection.end();

      // 3. Email Notifications (Nodemailer)
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        // A. वेबसाइट ओनर (Admin) के लिए ईमेल
        await transporter.sendMail({
          from: `"सर्व हिन्दू कल्याण समिति" <${process.env.EMAIL_USER}>`,
          to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
          subject: `🔔 नया सदस्य पंजीकरण: ${full_name} (₹${membership_fee})`,
          html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #c86428;">नया सदस्य पंजीकरण और भुगतान सफल</h2>
              <p><strong>पूरा नाम:</strong> ${full_name}</p>
              <p><strong>मोबाइल:</strong> ${phone}</p>
              <p><strong>ईमेल:</strong> ${email || "N/A"}</p>
              <p><strong>पता:</strong> ${address}, ${city}, ${state} - ${pincode}</p>
              <p><strong>सदस्यता का प्रकार:</strong> ${membership_type}</p>
              <p><strong>सेवा क्षेत्र:</strong> ${role}</p>
              <p><strong>भुगतान राशि:</strong> ₹${membership_fee}</p>
              <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
              <p><strong>रसीद संख्या:</strong> ${receiptNo}</p>
            </div>
          `,
        });

        // B. यूजर (जिसने फॉर्म भरा है) के लिए धन्यवाद ईमेल (अगर उसने ईमेल दिया है)
        if (email) {
          await transporter.sendMail({
            from: `"सर्व हिन्दू कल्याण समिति" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `🙏 समिति से जुड़ने के लिए धन्यवाद - सर्व हिन्दू कल्याण समिति`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e6d5b8; border-radius: 10px; background-color: #faf3e8;">
                <h2 style="color: #c86428; text-align: center;">जय श्री राम! 🙏</h2>
                <p>प्रिय <strong>${full_name} जी</strong>,</p>
                <p>सर्व हिन्दू कल्याण समिति परिवार में आपका हार्दिक स्वागत है! राष्ट्र और धर्म सेवा के इस महायज्ञ में स्वयंसेवक/सदस्य के रूप में जुड़ने के लिए आपका धन्यवाद।</p>
                
                <div style="background: #fff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #c86428;">
                  <h3 style="margin-top: 0; color: #333;">पंजीकरण और भुगतान विवरण:</h3>
                  <p style="margin: 5px 0;"><strong>सदस्यता प्रकार:</strong> ${membership_type}</p>
                  <p style="margin: 5px 0;"><strong>सेवा क्षेत्र:</strong> ${role}</p>
                  <p style="margin: 5px 0;"><strong>योगदान राशि:</strong> ₹${membership_fee}</p>
                  <p style="margin: 5px 0;"><strong>रसीद संख्या:</strong> ${receiptNo}</p>
                  <p style="margin: 5px 0;"><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
                </div>

                <p>हमारी टीम जल्द ही आपसे संपर्क करेगी। यदि आपके पास कोई जिज्ञासा या सुझाव है, तो आप हमसे संपर्क कर सकते हैं।</p>
                
                <p style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
                  <strong>सर्व हिन्दू कल्याण समिति</strong><br/>
                  राष्ट्र सेवा, धर्म रक्षा और समाज उत्थान हेतु समर्पित
                </p>
              </div>
            `,
          });
        }
      }

      return NextResponse.json({ success: true }, { status: 200 });

    } catch (dbError) {
      await connection.rollback();
      await connection.end();
      throw dbError;
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}