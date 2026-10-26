"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function QRCheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("order_id");
  const amount = searchParams.get("amount");
  const paymentType = searchParams.get("type") || "member"; // 'donate' या 'member'

  const [status, setStatus] = useState("scanning");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submittedInfo, setSubmittedInfo] = useState(null);

  const upiId = "7275000028-10@ybl";
  const payeeName = "Sarv Hindu Kalyan Samiti";

  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    payeeName
  )}&am=${amount}&cu=INR&tr=${orderId}`;

  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    upiUrl
  )}`;

  const handlePaymentConfirmation = async () => {
    setLoading(true);
    setError("");

    try {
      const isDonation =
        paymentType === "donate" ||
        Boolean(localStorage.getItem("pending_donation_data"));

      const storageKey = isDonation
        ? "pending_donation_data"
        : "pending_volunteer_data";

      const apiEndpoint = isDonation ? "/api/donate" : "/api/members";

      const savedData = JSON.parse(
        localStorage.getItem(storageKey) || "{}"
      );

      const paymentId = "UPI_QR_MANUAL";

      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...savedData,
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: "manual_qr_verified",
          utr_number: "PENDING",
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        localStorage.removeItem(storageKey);
        localStorage.removeItem("pending_order_id");
        localStorage.removeItem("completed_donation_receipt");

        setSubmittedInfo({
          name:
            savedData.donor_name ||
            savedData.full_name ||
            savedData.name ||
            "सहयोगी",
          amount: Number(amount),
          orderId: orderId,
          isDonation,
        });

        setStatus("pending_verification");
      } else {
        setError(result.error || "डेटा सेव करने में त्रुटि हुई।");
      }
    } catch (err) {
      console.error("Payment confirmation error:", err);
      setError("सर्वर से संपर्क नहीं हो सका।");
    } finally {
      setLoading(false);
    }
  };

  // पेमेंट सबमिट होने के बाद थैंक यू और वेरिफिकेशन स्क्रीन
  if (status === "pending_verification" && submittedInfo) {
    return (
      <div className="card animate-rise max-w-lg mx-auto mt-10 text-center p-8 bg-white rounded-3xl border border-amber-200 shadow-lg">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-4xl shadow-inner border border-amber-200 mb-4">
          ⏳
        </div>

        <h3 className="font-head text-2xl sm:text-3xl font-bold text-orange-700">
          भुगतान की जानकारी मिल गई है! 🙏
        </h3>

        <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          धन्यवाद <strong>{submittedInfo.name}</strong>! आपका भुगतान अनुरोध दर्ज
          कर लिया गया है। जैसे ही एडमिन द्वारा आपके भुगतान की पुष्टि (Verify) हो
          जाएगी, <strong>आपको ईमेल पर आधिकारिक रसीद (Receipt) भेज दी जाएगी।</strong>
        </p>

        {/* Submitted Details Box */}
        <div className="mt-6 rounded-2xl bg-[#faf3e8] p-5 text-left border border-[#e6d5b8] shadow-sm space-y-3">
          <div className="border-b border-[#e6d5b8] pb-3 flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-800">
              बुकिंग विवरण (Verification Pending)
            </span>

            <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
              सत्यापन लंबित (Pending)
            </span>
          </div>

          <div className="space-y-2 text-sm text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">नाम:</span>
              <span className="font-semibold text-slate-900">
                {submittedInfo.name}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">राशि:</span>
              <span className="font-bold text-orange-700 text-base">
                ₹{submittedInfo.amount.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">ऑर्डर आईडी:</span>
              <span className="font-mono text-xs text-slate-600">
                {submittedInfo.orderId}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          नोट: यदि आपके मन में कोई प्रश्न है, तो आप समिति के एडमिन से संपर्क कर
          सकते हैं।
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() =>
              router.push(submittedInfo.isDonation ? "/donate" : "/")
            }
            className="flex-1 rounded-xl bg-[#c86428] hover:bg-[#b05520] text-white font-semibold py-3 transition-colors shadow-sm text-sm cursor-pointer"
          >
            होम पेज पर जाएं
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-3xl border border-amber-200 shadow-lg text-center">
      <h2 className="text-2xl font-bold text-orange-700 mb-2">
        QR कोड द्वारा भुगतान
      </h2>

      <p className="text-sm text-slate-600 mb-4">
        अपने किसी भी UPI ऐप (PhonePe, GPay, Paytm) से स्कैन कर भुगतान करें और
        नीचे दिए गए बटन पर क्लिक करें।
      </p>

      <div className="bg-amber-50 p-4 rounded-2xl inline-block border border-amber-200 mb-4">
        <img
          src={qrCodeImageUrl}
          alt="Payment QR Code"
          className="w-56 h-56 mx-auto rounded-lg"
        />
      </div>

      <div className="text-lg font-semibold text-slate-800 mb-1">
        भुगतान राशि:{" "}
        <span className="text-orange-700">₹{amount}</span>
      </div>

      <div className="text-xs text-slate-500 mb-6">
        UPI ID:{" "}
        <span className="font-mono font-medium text-slate-700">
          {upiId}
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
          ⚠️ {error}
        </div>
      )}

      <button
        onClick={handlePaymentConfirmation}
        disabled={loading}
        className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold rounded-xl shadow transition duration-200 cursor-pointer"
      >
        {loading
          ? "प्रोसेस हो रहा है..."
          : "✅ मैंने भुगतान कर दिया है (I have made the payment)"}
      </button>

      <button
        onClick={() => router.back()}
        disabled={loading}
        className="mt-3 w-full py-2 px-4 text-xs text-slate-500 hover:text-slate-700"
      >
        ← वापस जाएं
      </button>
    </div>
  );
}

export default function QRCheckoutPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">लोड हो रहा है...</div>}>
      <QRCheckoutContent />
    </Suspense>
  );
}
