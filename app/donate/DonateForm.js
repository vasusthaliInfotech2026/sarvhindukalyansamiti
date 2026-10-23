"use client";
import { useEffect, useState } from "react";

const DONATION_PURPOSES = [
  "सामान्य दान",
  "अन्न सेवा अभियान",
  "शिक्षा सहायता अभियान",
  "अनाथ/बाल सहायता अभियान",
  "मंदिर एवं धर्म सेवा",
  "निःशुल्क स्वास्थ्य जांच शिविर",
  "मंदिर स्वच्छता अभियान"
];

export default function DonateForm() {
  const [amount, setAmount] = useState(200);
  const [purpose, setPurpose] = useState("सामान्य दान");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => { 
    const c = new URLSearchParams(window.location.search).get("campaign"); 
    if (c) setPurpose(c); 
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount || amount < 50 || amount > 10000) {
      setError("कृपया ₹50 से ₹10,000 के बीच की वैध राशि दर्ज करें।");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const donorData = {
      donor_name: formData.get("donor_name"),
      donor_email: formData.get("donor_email"),
      donor_phone: formData.get("donor_phone"),
      amount: Number(amount),
      donation_purpose: purpose,
    };

    try {
      const resScript = await loadRazorpayScript();
      if (!resScript) {
        setError("Razorpay SDK load hone me samasya aayi.");
        setLoading(false);
        return;
      }

      // 1. Backend se Razorpay Order banayein
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.message || "Order creation failed");
      }

      const order = orderData.order;

      // 2. Razorpay Popup kholein
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "सर्व हिन्दू कल्याण समिति",
        description: `सहयोग - ${purpose}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const saveRes = await fetch("/api/donate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...donorData,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const saveResult = await saveRes.json();
            if (saveRes.ok && saveResult.success) {
              setDone({
                name: donorData.donor_name,
                amount: Number(amount),
                id: saveResult.receipt_number || "SSKS-" + Date.now().toString().slice(-7)
              });
            } else {
              setError(saveResult.error || "डेटा सेव करने में त्रुटि हुई।");
            }
          } catch (err) {
            setError("सर्वर से संपर्क नहीं हो सका।");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: donorData.donor_name,
          email: donorData.donor_email,
          contact: donorData.donor_phone,
        },
        theme: {
          color: "#c86428",
        },
      };

      const paymentWindow = new window.Razorpay(options);
      paymentWindow.open();
    } catch (err) {
      setError(err.message || "कुछ गड़बड़ी हो गई।");
      setLoading(false);
    }
  };

  if (done)
  return (
    <div className="card animate-rise max-w-lg mx-auto text-center p-8 bg-white rounded-3xl border border-amber-200 shadow-lg">
      {/* Success Icon / Emoji */}
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-4xl shadow-inner border border-amber-200 mb-4">
        🙏
      </div>

      <h3 className="font-head text-3xl font-bold text-orange-700">
        धन्यवाद, {done.name}!
      </h3>
      <p className="mt-2 text-slate-600 text-sm sm:text-base">
        आपके पवित्र सहयोग के लिए सर्व हिन्दू कल्याण समिति आपका आभार व्यक्त करती है।
      </p>

      {/* Digital Receipt Card (Email Receipt Style) */}
      <div className="mt-6 rounded-2xl bg-[#faf3e8] p-5 text-left border border-[#e6d5b8] shadow-sm space-y-3">
        <div className="border-b border-[#e6d5b8] pb-3 flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-deep">
            भुगतान रसीद (Digital Receipt)
          </span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            सफल (Paid)
          </span>
        </div>

        <div className="space-y-2 text-sm text-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-500">दानदाता / सदस्य:</span>
            <span className="font-semibold text-slate-900">{done.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">सहयोग राशि:</span>
            <span className="font-bold text-orange-700 text-base">₹{done.amount.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">रसीद संख्या:</span>
            <span className="font-mono font-medium text-slate-800">{done.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">माध्यम:</span>
            <span className="font-medium text-slate-800">Razorpay (Secure)</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        इस लेन-देन की एक प्रति आपके ईमेल पर भी भेज दी गई है।
      </p>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button 
          onClick={() => window.print()} 
          className="flex-1 rounded-xl border border-orange-600 text-orange-700 hover:bg-orange-50 font-semibold py-3 transition-colors text-sm"
        >
          🖨️ रसीद प्रिंट करें
        </button>
        <button 
          onClick={() => setDone(null)} 
          className="flex-1 rounded-xl bg-[#c86428] hover:bg-[#b05520] text-white font-semibold py-3 transition-colors shadow-sm text-sm"
        >
          नया सहयोग करें
        </button>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleDonate} className="card space-y-4 w-full">
      <h2 className="font-head text-2xl font-bold text-navy mb-4">दान करें / सहयोग दें</h2>

      <div>
        <label className="block text-sm font-semibold mb-1">दानदाता का नाम *</label>
        <input name="donor_name" required placeholder="अपना पूरा नाम दर्ज करें" className="input" />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">ईमेल पता</label>
        <input name="donor_email" type="email" placeholder="अपना ईमेल दर्ज करें" className="input" />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">मोबाइल नंबर *</label>
        <input name="donor_phone" required type="tel" maxLength={10} placeholder="10 अंकों का मोबाइल नंबर दर्ज करें" className="input" />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">दान राशि (₹50 - ₹10,000) *</label>
        <input 
          type="number" 
          min="50" 
          max="10000"
          required
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          placeholder="राशि दर्ज करें (जैसे: 500)" 
          className="input" 
        />
        <p className="text-xs text-slate-500 mt-1">न्यूनतम दान ₹50 और अधिकतम ₹10,000 हो सकता है।</p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">दान का उद्देश्य / प्रकल्प *</label>
        <select 
          value={purpose} 
          onChange={(e) => setPurpose(e.target.value)} 
          className="input"
        >
          {DONATION_PURPOSES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button 
        type="submit" 
        disabled={loading}
        className="btn btn-saffron w-fit block mx-auto text-lg py-3 mt-4"
      >
        {loading ? "प्रतीक्षा करें..." : `सुरक्षित रूप से दान करें (₹${Number(amount || 0).toLocaleString("en-IN")})`}
      </button>
    </form>
  );
}
