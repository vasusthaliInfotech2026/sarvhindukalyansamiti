import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    const {
      status,
      firstname,
      amount,
      txnid,
      posted_hash,
      key,
      productinfo,
      email,
      hash,
      mihpayid,
    } = data;

    const merchantSalt = process.env.PAYU_MERCHANT_SALT?.trim();

    // PayU रिवर्स हैश सत्यापन:
    // sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
    const reverseHashString = `${merchantSalt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
    const calculatedHash = crypto
      .createHash("sha512")
      .update(reverseHashString)
      .digest("hex");

    const receivedHash = hash || posted_hash;

    if (calculatedHash.toLowerCase() !== receivedHash?.toLowerCase()) {
      console.error("PayU Hash Mismatch Error - सुरक्षा जाँच विफल!");
      return NextResponse.redirect(`${baseUrl}/donate?status=failed`, 303);
    }

    if (status === "success") {
      // भुगतान सफल होने पर रसीद पेज पर भेजें
      return NextResponse.redirect(
        `${baseUrl}/success?order_id=${mihpayid || txnid}&name=${encodeURIComponent(
          firstname
        )}&amount=${amount}`,
        303
      );
    } else {
      return NextResponse.redirect(`${baseUrl}/donate?status=failed`, 303);
    }
  } catch (error) {
    console.error("PayU Response Handling Error:", error);
    return NextResponse.redirect(`${baseUrl}/donate?status=failed`, 303);
  }
}