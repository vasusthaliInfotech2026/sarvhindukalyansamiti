import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";

const dbConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "sarv_hindu_kalyan_samiti",
};

// Safe query helper
async function safeQuery(connection, sql, fallbackSql = null) {
  try {
    const [rows] = await connection.execute(sql);
    return rows;
  } catch (err) {
    if (fallbackSql) {
      try {
        const [rows] = await connection.execute(fallbackSql);
        return rows;
      } catch (e) {
        return [];
      }
    }
    return [];
  }
}

// 1. GET: सभी Members, Donations और Contact Form का डेटा लाएं
export async function GET() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const donations = await safeQuery(
      connection,
      "SELECT * FROM donations ORDER BY id DESC"
    );

    const members = await safeQuery(
      connection,
      "SELECT * FROM members ORDER BY id DESC",
      "SELECT * FROM volunteers ORDER BY id DESC"
    );

    const contacts = await safeQuery(
      connection,
      "SELECT * FROM contacts ORDER BY id DESC",
      "SELECT * FROM contact_messages ORDER BY id DESC"
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      donations,
      members,
      contacts,
    });
  } catch (error) {
    if (connection) await connection.end();
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 2. POST: Admin द्वारा Payment Verify या Reject करना और तदनुसार ईमेल भेजना
export async function POST(request) {
  let connection;
  try {
    const body = await request.json();
    const { type, id, action } = body; // type: 'donation' | 'member', action: 'verify' | 'reject'

    if (!type || !id) {
      return NextResponse.json(
        { success: false, error: "Type और ID आवश्यक हैं।" },
        { status: 400 }
      );
    }

    // डिफ़ॉल्ट एक्शन 'verify' मान लें यदि न भेजा गया हो
    const currentAction = action || "verify";

    connection = await mysql.createConnection(dbConfig);

    if (type === "donation") {
      // 1. डोनेशन रिकॉर्ड निकालें
      const [rows] = await connection.execute(
        "SELECT * FROM donations WHERE id = ? LIMIT 1",
        [id]
      );

      if (!rows || rows.length === 0) {
        await connection.end();
        return NextResponse.json(
          { success: false, error: "डोनेशन रिकॉर्ड नहीं मिला।" },
          { status: 404 }
        );
      }

      const donation = rows[0];
      const donorEmail = donation.donor_email || donation.email;
      const donorName = donation.donor_name || donation.name || "दानदाता";
      const amount = donation.amount || 0;
      const purpose = donation.donation_purpose || "सामान्य दान";
      const paymentId = donation.razorpay_payment_id || "UPI_QR";

      const transporter =
        donorEmail && process.env.EMAIL_USER && process.env.EMAIL_PASS
          ? nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
              },
            })
          : null;

      // -------------------------------------------------------------
      // CASE A: PAYMENT NOT RECEIVED (REJECT)
      // -------------------------------------------------------------
      if (currentAction === "reject") {
        await connection.execute(
          "UPDATE donations SET payment_status = 'failed' WHERE id = ?",
          [id]
        );
        await connection.end();

        if (transporter) {
          await transporter.sendMail({
            from: `"सर्व हिन्दू कल्याण समिति" <${process.env.EMAIL_USER}>`,
            to: donorEmail,
            subject: `⚠️ भुगतान प्राप्त नहीं हुआ - सर्व हिन्दू कल्याण समिति`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e6d5b8; border-radius: 10px; background-color: #faf3e8;">
                <h2 style="color: #c86428; text-align: center;">जय श्री राम! 🙏</h2>
                <p>प्रिय <strong>${donorName} जी</strong>,</p>
                <p>हमें आपको यह सूचित करते हुए खेद हो रहा है कि सर्व हिन्दू कल्याण समिति को आपके द्वारा की गई ₹${amount} की राशि का भुगतान प्राप्त नहीं हुआ है या उसका सत्यापन (Verification) विफल रहा है।</p>
                
                <div style="background: #fff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                  <h3 style="margin-top: 0; color: #dc2626;">⚠️ स्थिति: भुगतान प्राप्त नहीं हुआ (Payment Not Received)</h3>
                  <p style="margin: 5px 0;"><strong>उद्देश्य:</strong> ${purpose}</p>
                  <p style="margin: 5px 0;"><strong>सहयोग राशि:</strong> ₹${amount}</p>
                  <p style="margin: 5px 0;"><strong>सुझाव:</strong> कृपया दोबारा भुगतान करें या किसी समस्या पर एडमिन से संपर्क करें।</p>
                </div>

                <p style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
                  <strong>सर्व हिन्दू कल्याण समिति</strong><br/>
                  राष्ट्र सेवा, धर्म रक्षा और समाज उत्थान हेतु समर्पित
                </p>
              </div>
            `,
          });
        }

        return NextResponse.json({
          success: true,
          message: "पेमेंट नॉट रिसीव्ड का ईमेल यूजर को भेज दिया गया है!",
        });
      }

      // -------------------------------------------------------------
      // CASE B: VERIFY PAYMENT (SUCCESS)
      // -------------------------------------------------------------
      const receiptNo =
        donation.receipt_number || `RCPT_DON_${Date.now()}`;

      await connection.execute(
        "UPDATE donations SET payment_status = 'paid', receipt_number = ? WHERE id = ?",
        [receiptNo, id]
      );

      await connection.end();

      if (transporter) {
        await transporter.sendMail({
          from: `"सर्व हिन्दू कल्याण समिति" <${process.env.EMAIL_USER}>`,
          to: donorEmail,
          subject: `✅ भुगतान सत्यापित एवं दान रसीद - सर्व हिन्दू कल्याण समिति`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e6d5b8; border-radius: 10px; background-color: #faf3e8;">
              <h2 style="color: #c86428; text-align: center;">जय श्री राम! 🙏</h2>
              <p>प्रिय <strong>${donorName} जी</strong>,</p>
              <p>आपका भुगतान सफलतापूर्वक <strong>सत्यापित (Verified)</strong> कर लिया गया है। सर्व हिन्दू कल्याण समिति के <strong>"${purpose}"</strong> प्रकल्प में ₹${amount} के आपके पवित्र सहयोग के लिए हम आपके अत्यंत आभारी हैं।</p>
              
              <div style="background: #fff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
                <h3 style="margin-top: 0; color: #16a34a;">✅ आधिकारिक दान रसीद (Verified Receipt):</h3>
                <p style="margin: 5px 0;"><strong>दानदाता का नाम:</strong> ${donorName}</p>
                <p style="margin: 5px 0;"><strong>सहयोग राशि:</strong> ₹${amount}</p>
                <p style="margin: 5px 0;"><strong>उद्देश्य:</strong> ${purpose}</p>
                <p style="margin: 5px 0;"><strong>रसीद संख्या:</strong> ${receiptNo}</p>
                <p style="margin: 5px 0;"><strong>UTR / Payment ID:</strong> ${paymentId}</p>
                <p style="margin: 5px 0;"><strong>स्थिति:</strong> <span style="color: #16a34a; font-weight: bold;">सत्यापित (Paid & Verified)</span></p>
              </div>

              <p>आपका यह योगदान समाज के उत्थान और धर्म रक्षा में महत्वपूर्ण भूमिका निभाएगा।</p>
              
              <p style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
                <strong>सर्व हिन्दू कल्याण समिति</strong><br/>
                राष्ट्र सेवा, धर्म रक्षा और समाज उत्थान हेतु समर्पित
              </p>
            </div>
          `,
        });
      }

      return NextResponse.json({
        success: true,
        message: "डोनेशन पेमेंट वेरीफाई हो गया और यूजर को ईमेल रसीद भेज दी गई है!",
      });
    }

    if (type === "member") {
      // 1. मेंबर रिकॉर्ड निकालें
      const [rows] = await connection.execute(
        "SELECT * FROM members WHERE id = ? LIMIT 1",
        [id]
      );

      if (!rows || rows.length === 0) {
        await connection.end();
        return NextResponse.json(
          { success: false, error: "सदस्य रिकॉर्ड नहीं मिला।" },
          { status: 404 }
        );
      }

      const member = rows[0];
      const memberEmail = member.email || member.member_email;
      const memberName =
        member.full_name || member.name || member.member_name || "सदस्य";
      const amount = member.amount || member.fee || member.membership_fee || "";
      const paymentId =
        member.razorpay_payment_id || member.payment_id || "UPI_QR";
      const orderId =
        member.razorpay_order_id || member.order_id || `MEM_${member.id}`;

      const transporter =
        memberEmail && process.env.EMAIL_USER && process.env.EMAIL_PASS
          ? nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
              },
            })
          : null;

      // -------------------------------------------------------------
      // CASE A: MEMBER PAYMENT NOT RECEIVED (REJECT)
      // -------------------------------------------------------------
      if (currentAction === "reject") {
        try {
          await connection.execute(
            "UPDATE members SET payment_status = 'failed' WHERE id = ?",
            [id]
          );
        } catch (e) {
          await connection.execute(
            "UPDATE members SET status = 'rejected' WHERE id = ?",
            [id]
          );
        }
        await connection.end();

        if (transporter) {
          await transporter.sendMail({
            from: `"सर्व हिन्दू कल्याण समिति" <${process.env.EMAIL_USER}>`,
            to: memberEmail,
            subject: `⚠️ सदस्यता भुगतान प्राप्त नहीं हुआ - सर्व हिन्दू कल्याण समिति`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e6d5b8; border-radius: 10px; background-color: #faf3e8;">
                <h2 style="color: #c86428; text-align: center;">जय श्री राम! 🙏</h2>
                <p>प्रिय <strong>${memberName} जी</strong>,</p>
                <p>सर्व हिन्दू कल्याण समिति को आपका सदस्यता शुल्क प्राप्त नहीं हुआ है या भुगतान सत्यापित नहीं हो पाया है।</p>
                
                <div style="background: #fff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                  <h3 style="margin-top: 0; color: #dc2626;">⚠️ स्थिति: भुगतान प्राप्त नहीं हुआ</h3>
                  ${amount ? `<p style="margin: 5px 0;"><strong>शुल्क राशि:</strong> ₹${amount}</p>` : ""}
                  <p style="margin: 5px 0;"><strong>सुझाव:</strong> कृपया दोबारा भुगतान करें या एडमिन से संपर्क करें।</p>
                </div>

                <p style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
                  <strong>सर्व हिन्दू कल्याण समिति</strong><br/>
                  राष्ट्र सेवा, धर्म रक्षा और समाज उत्थान हेतु समर्पित
                </p>
              </div>
            `,
          });
        }

        return NextResponse.json({
          success: true,
          message: "सदस्य को पेमेंट न मिलने की ईमेल भेज दी गई है!",
        });
      }

      // -------------------------------------------------------------
      // CASE B: VERIFY MEMBER PAYMENT (SUCCESS)
      // -------------------------------------------------------------
      try {
        await connection.execute(
          "UPDATE members SET payment_status = 'paid' WHERE id = ?",
          [id]
        );
      } catch (e) {
        await connection.execute(
          "UPDATE members SET status = 'verified' WHERE id = ?",
          [id]
        );
      }

      await connection.end();

      if (transporter) {
        await transporter.sendMail({
          from: `"सर्व हिन्दू कल्याण समिति" <${process.env.EMAIL_USER}>`,
          to: memberEmail,
          subject: `✅ सदस्यता एवं भुगतान सत्यापित - सर्व हिन्दू कल्याण समिति`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e6d5b8; border-radius: 10px; background-color: #faf3e8;">
              <h2 style="color: #c86428; text-align: center;">जय श्री राम! 🙏</h2>
              <p>प्रिय <strong>${memberName} जी</strong>,</p>
              <p>हमें आपको यह सूचित करते हुए हर्ष हो रहा है कि आपका सदस्यता शुल्क भुगतान <strong>सत्यापित (Verified)</strong> हो गया है और सर्व हिन्दू कल्याण समिति में आपका पंजीकरण कन्फर्म कर दिया गया है।</p>
              
              <div style="background: #fff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
                <h3 style="margin-top: 0; color: #16a34a;">✅ सदस्यता भुगतान रसीद:</h3>
                <p style="margin: 5px 0;"><strong>सदस्य का नाम:</strong> ${memberName}</p>
                ${amount ? `<p style="margin: 5px 0;"><strong>शुल्क राशि:</strong> ₹${amount}</p>` : ""}
                <p style="margin: 5px 0;"><strong>ऑर्डर / पंजीकरण संख्या:</strong> ${orderId}</p>
                <p style="margin: 5px 0;"><strong>UTR / Payment ID:</strong> ${paymentId}</p>
                <p style="margin: 5px 0;"><strong>स्थिति:</strong> <span style="color: #16a34a; font-weight: bold;">सत्यापित (Verified & Confirmed)</span></p>
              </div>

              <p>सर्व हिन्दू कल्याण समिति परिवार में आपका हार्दिक स्वागत है!</p>
              
              <p style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
                <strong>सर्व हिन्दू कल्याण समिति</strong><br/>
                राष्ट्र सेवा, धर्म रक्षा और समाज उत्थान हेतु समर्पित
              </p>
            </div>
          `,
        });
      }

      return NextResponse.json({
        success: true,
        message: "सदस्य का पेमेंट वेरीफाई हो गया और कन्फर्मेशन ईमेल भेज दिया गया है!",
      });
    }

    await connection.end();
    return NextResponse.json(
      { success: false, error: "Invalid verification type" },
      { status: 400 }
    );
  } catch (error) {
    if (connection) await connection.end();
    console.error("Admin Verify API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


