"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const AREAS = ["अन्न सेवा", "स्वास्थ्य", "शिक्षा", "रक्तदान", "मंदिर सेवा"];
const FEE_OPTIONS = [51, 101, 201, 501, 1001, 1100, 2100, 2500, 5100];

export default function VolunteerForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState(""); // Popup ke liye error message state
  const [selectedFee, setSelectedFee] = useState(1);

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
    const emailInput = formData.get("email");

    // 1. PAYMENT SE PEHLE EMAIL CHECK KAREIN
    if (emailInput) {
      try {
        const checkRes = await fetch("/api/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailInput }),
        });
        const checkData = await checkRes.json();

        if (checkData.success && checkData.exists) {
          setError("तुम पहले से ही इस ईमेल आईडी से रजिस्टर्ड हो!");
          setLoading(false);
          return; // Yahin rok dega, aage payment par nahi jane dega
        }
      } catch (err) {
        console.error("Email verification failed:", err);
      }
    }

    const formValues = {
      full_name: formData.get("full_name"),
      phone: formData.get("phone"),
      email: emailInput,
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      pincode: formData.get("pincode"),
      membership_type: formData.get("membership_type"),
      membership_fee: selectedFee,
      role: formData.get("role"),
    };

    try {
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
      const paymentMode = process.env.NEXT_PUBLIC_PAYMENT_MODE || "qr";

      if (paymentMode === "razorpay") {
        const resScript = await loadRazorpayScript();
        if (!resScript) {
          throw new Error("Razorpay SDK failed to load.");
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "सर्व हिन्दू कल्याण समिति",
          description: "सदस्यता / सहायता शुल्क",
          order_id: order.id,
          handler: async function (response) {
            setProcessingPayment(true);

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
                router.push(`/success?order_id=${order.id}`);
              } else {
                setError(finalResult.error || "डेटा सेव करने में त्रुटि हुई।");
                setProcessingPayment(false);
                setLoading(false);
              }
            } catch (err) {
              setError("सर्वर से संपर्क नहीं हो सका।");
              setProcessingPayment(false);
              setLoading(false);
            }
          },
          prefill: {
            name: formValues.full_name,
            email: formValues.email,
            contact: formValues.phone,
          },
          theme: { color: "#c86428" },
        };

        const paymentWindow = new window.Razorpay(options);
        paymentWindow.open();
        setLoading(false);
      } else {
        localStorage.setItem("pending_volunteer_data", JSON.stringify(formValues));
        localStorage.setItem("pending_order_id", order.id);
        localStorage.setItem("pending_amount", selectedFee);
        router.push(`/pay?order_id=${order.id}&amount=${selectedFee}`);
      }
    } catch (err) {
      setError(err.message || "कुछ गड़बड़ी हो गई।");
      setLoading(false);
    }
  };

  if (processingPayment) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-amber-200 shadow-lg text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600 animate-spin">
          ⏳
        </div>
        <h3 className="text-2xl font-bold text-orange-700">भुगतान सत्यापित हो रहा है...</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          आपका भुगतान सफल हो गया है! आपका डेटा सुरक्षित दर्ज किया जा रहा है और ईमेल रसीद भेजी जा रही है। कृपया पेज बंद न करें...
        </p>
        <div className="text-xs text-slate-400 font-medium">यह प्रक्रिया केवल कुछ सेकंड लेगी।</div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="full_name" required maxLength={150} placeholder="पूरा नाम" className="input" />
        <div className="grid gap-4 sm:grid-cols-2">
          <input name="phone" required type="tel" maxLength={20} placeholder="मोबाइल नंबर" className="input" />
          <input name="email" type="email" maxLength={150} placeholder="ईमेल पता" className="input" />
        </div>
        <textarea name="address" required placeholder="पूरा पता" rows={3} className="input" />
        <div className="grid gap-4 sm:grid-cols-3">
          <input name="city" required maxLength={100} placeholder="शहर" className="input" />
          <input name="state" required maxLength={100} placeholder="राज्य" className="input" />
          <input name="pincode" required type="text" inputMode="numeric" maxLength={6} placeholder="पिन कोड" className="input" />
        </div>
        <select name="membership_type" required defaultValue="" className="input">
          <option value="" disabled>सदस्यता का प्रकार चुनें</option>
          <option value="सामान्य सदस्य">सामान्य सदस्य</option>
          <option value="आजीवन सदस्य">आजीवन सदस्य</option>
          <option value="सक्रिय स्वयंसेवक">सक्रिय स्वयंसेवक</option>
        </select>
        <div>
          <p className="mb-2 font-semibold">सेवा क्षेत्रों में रुचि *</p>
          <div className="flex flex-wrap gap-4">
            {AREAS.map((a) => (
              <label key={a} className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="role" value={a} required className="accent-saffron" />
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
                    isSelected ? "border-orange-600 bg-orange-50 text-orange-700 ring-2 ring-orange-500/20" : "border-[#e6d5b8] bg-white text-slate-800 hover:border-orange-400"
                  }`}
                >
                  ₹{fee.toLocaleString("en-IN")}
                </button>
              );
            })}
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#c86428] hover:bg-[#b05520] text-white font-semibold py-4 text-lg transition-colors shadow-sm">
          {loading ? "प्रतीक्षा करें..." : "Register & Pay"}
        </button>
      </form>

      {/* --- ERROR POPUP MODAL --- */}
      {error && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-amber-200 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <h3 className="text-xl font-bold text-slate-900">पंजीकरण सूचना</h3>
            <p className="text-sm text-slate-600 font-medium">
              {error}
            </p>
            <button
              onClick={() => setError("")}
              className="w-full py-3 rounded-xl bg-[#c86428] hover:bg-[#b05520] text-white font-semibold transition cursor-pointer shadow-sm"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}

