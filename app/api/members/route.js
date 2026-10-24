import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const body = await request.json();
    
    const full_name = body.full_name || "";
    const email = body.email || null;
    const phone = body.phone || "";
    const address = body.address || "";
    const city = body.city || "";
    const state = body.state || "";
    const pincode = body.pincode || "";
    const membership_type = body.membership_type || "सामान्य सदस्य";
    const role = body.role || "";
    const membership_fee = body.membership_fee || 1;
    const razorpay_order_id = body.razorpay_order_id || "manual_order";
    const razorpay_payment_id = body.razorpay_payment_id || "manual_payment";
    const razorpay_signature = body.razorpay_signature || "";

    // Check karein ki yeh QR manual payment hai ya Razorpay Gateway payment
    const isQRManual = razorpay_signature === "qr_manual_verified";
    
    const paymentStatus = isQRManual ? "pending" : "paid";
    const memberStatus = isQRManual ? "Pending" : "Active";
    const paymentMethodName = isQRManual ? "UPI QR (Verification Pending)" : "Razorpay Gateway";

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "sarv_hindu_kalyan_samiti",
    });

    try {
      await connection.beginTransaction();

      // A. Members table mein status save karein ('Pending' ya 'Active')
      const [memberResult] = await connection.execute(
        `INSERT INTO members 
        (full_name, email, phone, address, city, state, pincode, membership_type, role, membership_fee, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [full_name, email, phone, address, city, state, pincode, membership_type, role, membership_fee, memberStatus]
      );

      const memberId = memberResult.insertId;
      const receiptNo = `RCPT_${Date.now()}`;

      // B. Payments table mein record save karein
      await connection.execute(
        `INSERT INTO member_payments 
        (member_id, amount, currency, razorpay_order_id, razorpay_payment_id, razorpay_signature, payment_method, payment_status, receipt_number) 
        VALUES (?, ?, 'INR', ?, ?, ?, ?, ?, ?)`,
        [memberId, membership_fee, razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentMethodName, paymentStatus, receiptNo]
      );

      await connection.commit();
      await connection.end();

      // 3. Email Notifications
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        if (isQRManual) {
          // --- QR MODE: Payment Verification Pending Email ---
          
          // Admin Email (Notification ki payment verify karni hai)
          await transporter.sendMail({
            from: `"सर्व हिन्दू कल्याण समिति" <${process.env.EMAIL_USER}>`,
            to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
            subject: `⚠️ भुगतान सत्यापन लंबित (Pending Verification): ${full_name} (₹${membership_fee})`,
            html: `
              <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #d97706;">नया QR पंजीकरण - भुगतान सत्यापन लंबित है</h2>
                <p><strong>पूरा नाम:</strong> ${full_name}</p>
                <p><strong>मोबाइल:</strong> ${phone}</p>
                <p><strong>ईमेल:</strong> ${email || "N/A"}</p>
                <p><strong>राशि:</strong> ₹${membership_fee}</p>
                <p><strong>रसीद संख्या:</strong> ${receiptNo}</p>
                <p style="color: red; font-weight: bold;">कृपया बैंक खाते में राशि चेक करके इस सदस्य का भुगतान वेरीफाई करें।</p>
              </div>
            `,
          });

          // User Email (Verification Pending Message)
          if (email) {
            await transporter.sendMail({
              from: `"सर्व हिन्दू कल्याण समिति" <${process.env.EMAIL_USER}>`,
              to: email,
              subject: `⏳ पंजीकरण प्राप्त हुआ - भुगतान सत्यापन लंबित है (Sarv Hindu Kalyan Samiti)`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e6d5b8; border-radius: 10px; background-color: #faf3e8;">
                  <h2 style="color: #c86428; text-align: center;">जय श्री राम! 🙏</h2>
                  <p>प्रिय <strong>${full_name} जी</strong>,</p>
                  <p>सर्व हिन्दू कल्याण समिति में आपका पंजीकरण अनुरोध मिल गया है और आपका भुगतान <strong>सत्यापन के लिए लंबित (Verification Pending)</strong> है।</p>
                  <p>हमारी टीम आपके बैंक ट्रांसफर/UPI भुगतान की जाँच कर रही है। भुगतान सत्यापित होते ही आपकी आधिकारिक रसीद आपके ईमेल पर भेज दी जाएगी।</p>
                  <div style="background: #fff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d97706;">
                    <p style="margin: 5px 0;"><strong>सदस्यता प्रकार:</strong> ${membership_type}</p>
                    <p style="margin: 5px 0;"><strong>राशि:</strong> ₹${membership_fee}</p>
                    <p style="margin: 5px 0;"><strong>रिफरेंस नंबर:</strong> ${receiptNo}</p>
                  </div>
                  <p style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
                    <strong>सर्व हिन्दू कल्याण समिति</strong>
                  </p>
                </div>
              `,
            });
          }

        } else {
          // --- RAZORPAY GATEWAY MODE: Direct Payment Confirmed & Received Email ---

          // Admin Email
          await transporter.sendMail({
            from: `"सर्व हिन्दू कल्याण समिति" <${process.env.EMAIL_USER}>`,
            to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
            subject: `🔔 नया सदस्य पंजीकरण (भुगतान सफल): ${full_name} (₹${membership_fee})`,
            html: `
              <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #16a34a;">नया सदस्य पंजीकरण और भुगतान सफल</h2>
                <p><strong>पूरा नाम:</strong> ${full_name}</p>
                <p><strong>मोबाइल:</strong> ${phone}</p>
                <p><strong>ईमेल:</strong> ${email || "N/A"}</p>
                <p><strong>राशि:</strong> ₹${membership_fee}</p>
                <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
              </div>
            `,
          });

          // User Email (Payment Confirmed & Received)
          if (email) {
            await transporter.sendMail({
              from: `"सर्व हिन्दू कल्याण समिति" <${process.env.EMAIL_USER}>`,
              to: email,
              subject: `🙏 भुगतान सफल एवं रसीद - सर्व हिन्दू कल्याण समिति`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e6d5b8; border-radius: 10px; background-color: #faf3e8;">
                  <h2 style="color: #c86428; text-align: center;">जय श्री राम! 🙏</h2>
                  <p>प्रिय <strong>${full_name} जी</strong>,</p>
                  <p>आपका भुगतान सफलताપूर्वक प्राप्त हो गया है! सर्व हिन्दू कल्याण समिति परिवार में आपका हार्दिक स्वागत है।</p>
                  <div style="background: #fff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
                    <h3 style="margin-top: 0; color: #333;">भुगतान एवं रसीद विवरण:</h3>
                    <p style="margin: 5px 0;"><strong>सदस्यता प्रकार:</strong> ${membership_type}</p>
                    <p style="margin: 5px 0;"><strong>सेवा क्षेत्र:</strong> ${role}</p>
                    <p style="margin: 5px 0;"><strong>प्राप्त राशि:</strong> ₹${membership_fee}</p>
                    <p style="margin: 5px 0;"><strong>रसीद संख्या:</strong> ${receiptNo}</p>
                    <p style="margin: 5px 0;"><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
                  </div>
                  <p>हमारी टीम जल्द ही आपसे संपर्क करेगी।</p>
                  <p style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
                    <strong>सर्व हिन्दू कल्याण समिति</strong>
                  </p>
                </div>
              `,
            });
          }
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}



