"use client";
import { useState } from "react";

const AREAS = ["अन्न सेवा", "स्वास्थ्य", "शिक्षा", "रक्तदान", "मंदिर सेवा"];
const FEE_OPTIONS = [51, 101, 201, 501, 1001, 1100, 2100, 2500, 5100];

export default function VolunteerForm() {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFee, setSelectedFee] = useState(501);

  // Razorpay Script लोड करने का फंक्शन
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const formValues = {
      full_name: formData.get("full_name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      pincode: formData.get("pincode"),
      membership_type: formData.get("membership_type"),
      membership_fee: selectedFee,
      role: formData.get("role"),
    };

    try {
      const resScript = await loadRazorpayScript();
      if (!resScript) {
        setError("Razorpay SDK failed to load. Check your connection.");
        setLoading(false);
        return;
      }

      // 1. पहले Backend से Razorpay Order बनाएं (आपकी पुरानी donation order API का उपयोग करें)
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selectedFee }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.message || "Order creation failed");
      }

      const order = orderData.order;

      // 2. Razorpay Checkout Popup खोलें
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: order.currency,
        name: "सर्व हिन्दू कल्याण समिति",
        description: "सदस्यता / सहायता शुल्क",
        order_id: order.id,
        handler: async function (response) {
          // 3. पेमेंट सफल होने पर डेटा और पेमेंट डिटेल्स अपनी API पर भेजें
          try {
            const finalRes = await fetch("/api/members", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...formValues,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const finalResult = await finalRes.json();
            if (finalRes.ok && finalResult.success) {
              setOk(true);
            } else {
              setError(finalResult.error || "डेटा सेव करने में त्रुटि हुई।");
            }
          } catch (err) {
            setError("सर्वर से संपर्क नहीं हो सका।");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formValues.full_name,
          email: formValues.email,
          contact: formValues.phone,
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

 if (ok) {
    return (
      <div className="card animate-rise max-w-lg mx-auto text-center p-8 bg-white rounded-3xl border border-amber-200 shadow-lg">
        {/* Success Icon / Emoji */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-4xl shadow-inner border border-amber-200 mb-4">
          🙏
        </div>

        <h3 className="font-head text-3xl font-bold text-orange-700">
          पंजीकरण और भुगतान सफल!
        </h3>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          सर्व हिन्दू कल्याण समिति परिवार में आपका हार्दिक स्वागत है। आपका डेटा सुरक्षित दर्ज कर लिया गया है।
        </p>

        {/* Digital Receipt Card (Email Receipt Style) */}
        <div className="mt-6 rounded-2xl bg-[#faf3e8] p-5 text-left border border-[#e6d5b8] shadow-sm space-y-3">
          <div className="border-b border-[#e6d5b8] pb-3 flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-saffron-deep">
              पंजीकरण रसीद (Member Receipt)
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              सक्रिय (Active)
            </span>
          </div>

          <div className="space-y-2 text-sm text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">चयनित शुल्क:</span>
              <span className="font-bold text-orange-700 text-base">₹{selectedFee.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">भुगतान माध्यम:</span>
              <span className="font-medium text-slate-800">Razorpay (Secure)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">स्थिति:</span>
              <span className="font-medium text-emerald-600">सफलतापूर्वक सत्यापित</span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          इस पंजीकरण और भुगतान की पुष्टि आपके ईमेल पर भेज दी गई है। हमारी टीम जल्द ही आपसे संपर्क करेगी।
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
            onClick={() => setOk(false)} 
            className="flex-1 rounded-xl bg-[#c86428] hover:bg-[#b05520] text-white font-semibold py-3 transition-colors shadow-sm text-sm"
          >
            नया पंजीकरण करें
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="full_name"
        required
        maxLength={150}
        placeholder="पूरा नाम"
        className="input"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="phone"
          required
          type="tel"
          maxLength={20}
          placeholder="मोबाइल नंबर"
          className="input"
        />
        <input
          name="email"
          type="email"
          maxLength={150}
          placeholder="ईमेल पता"
          className="input"
        />
      </div>

      <textarea
        name="address"
        required
        placeholder="पूरा पता"
        rows={3}
        className="input"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <input
          name="city"
          required
          maxLength={100}
          placeholder="शहर"
          className="input"
        />
        <input
          name="state"
          required
          maxLength={100}
          placeholder="राज्य"
          className="input"
        />
        <input
          name="pincode"
          required
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="पिन कोड"
          className="input"
        />
      </div>

      <select name="membership_type" required defaultValue="" className="input">
        <option value="" disabled>
          सदस्यता का प्रकार चुनें
        </option>
        <option value="सामान्य सदस्य">सामान्य सदस्य</option>
        <option value="आजीवन सदस्य">आजीवन सदस्य</option>
        <option value="सक्रिय स्वयंसेवक">सक्रिय स्वयंसेवक</option>
      </select>

      <div>
        <p className="mb-2 font-semibold">सेवा क्षेत्रों में रुचि *</p>
        <div className="flex flex-wrap gap-4">
          {AREAS.map((a) => (
            <label key={a} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="role"
                value={a}
                required
                className="accent-saffron"
              />
              {a}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <p className="font-semibold text-slate-800">सदस्यता / सहायता शुल्क *</p>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {FEE_OPTIONS.map((fee) => {
            const isSelected = selectedFee === fee;
            return (
              <button
                key={fee}
                type="button"
                onClick={() => setSelectedFee(fee)}
                className={`py-3.5 px-2 rounded-xl border text-center font-semibold transition-all ${
                  isSelected
                    ? "border-orange-600 bg-orange-50 text-orange-700 ring-2 ring-orange-500/20"
                    : "border-[#e6d5b8] bg-white text-slate-800 hover:border-orange-400"
                }`}
              >
                ₹{fee.toLocaleString("en-IN")}
              </button>
            );
          })}
        </div>

        <div className="rounded-xl bg-[#faf3e8] px-5 py-4 flex items-center gap-2">
          <span className="font-semibold text-slate-800">
            Selected Membership Fee:
          </span>
          <span className="text-xl font-bold text-[#c86428]">
            ₹{selectedFee.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#c86428] hover:bg-[#b05520] text-white font-semibold py-4 text-lg transition-colors shadow-sm"
      >
        {loading ? "प्रतीक्षा करें..." : "Register & Pay"}
      </button>
    </form>
  );
}

